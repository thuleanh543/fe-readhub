import React, {useState, useEffect, useRef} from 'react'
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  Users,
  ThumbsUp,
  Bookmark,
  MoreHorizontal,
  Send,
  Image,
} from 'lucide-react'
import {useNavigate, useParams} from 'react-router-dom'
import HeaderComponent from '../../../component/header/HeaderComponent'
import {Box} from '@mui/material'
import {colors} from '../../../constants'
import SockJS from 'sockjs-client'
import {Stomp, Client} from '@stomp/stompjs'
import ForumCommentItem from './widgets/ForumCommentItem'

const ForumDiscussion = () => {
  const {forumId} = useParams()
  const navigate = useNavigate()
  const [forum, setForum] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState(null)

  const [selectedImage, setSelectedImage] = useState(null)
  const [stompClient, setStompClient] = useState(null)
  const fileInputRef = useRef(null)
  const webSocketRef = useRef(null)
  const [isSending, setIsSending] = useState(false);

  const getUser = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/v1/user/profile',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const connectWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/ws')
    const client = Stomp.over(() => socket)

    client.debug = () => {}

    const token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    client.connect(
      headers,
      () => {
        console.log('Connected to WebSocket')
        setStompClient(client)
        webSocketRef.current = client

        client.subscribe(`/topic/forum/${forumId}`, message => {
          try {
            const newComment = JSON.parse(message.body)
            setComments(prevComments => {
              const exists = prevComments.some(c => c.id === newComment.id)
              if (!exists) {
                return [newComment, ...prevComments]
              }
              return prevComments
            })
          } catch (error) {
            console.error('Error processing comment:', error)
          }
        })
      },
      error => {
        console.error('WebSocket connection error:', error)
      },
    )

    return client
  }

  const handleImageSelect = event => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() && !selectedImage) return
    if (isSending) return;
    try {
      let imageUrl = null
      if (selectedImage) {
        const formData = new FormData()
        setIsSending(true);
        formData.append('file', selectedImage)
        const response = await fetch('http://localhost:8080/api/v1/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        })

        if (response.ok) {
          const result = await response.json();
          imageUrl = result.data.url;
        }
      }

      if (stompClient?.connected) {

        const token = localStorage.getItem('token')
        const commentData = {
          content: newComment,
          discussionId: forumId,
          imageUrl: imageUrl,
        }
console.log('Posting comment:', commentData)
        stompClient.send(
          '/app/comment',
          {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          JSON.stringify(commentData),
        )

        setNewComment('')
        setSelectedImage(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSending(false);
  }
  }
  useEffect(() => {
    const fetchForumData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `http://localhost:8080/api/v1/forums/${forumId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        const data = await response.json()
        if (data.success) {
          setForum(data.data)
        }

        const commentsResponse = await fetch(
          `http://localhost:8080/api/v1/forums/${forumId}/comments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        const commentsData = await commentsResponse.json()
        if (commentsData.success) {
          setComments(commentsData.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    connectWebSocket()
    getUser()
    fetchForumData()
    return () => {
      if (webSocketRef.current) {
        console.log('Disconnecting WebSocket')
        webSocketRef.current.disconnect()
        webSocketRef.current = null
      }
    }
  }, [forumId])

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        Loading...
      </div>
    )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.themeLight.color060d13,
        display: 'flex',
        flexDirection: 'column',
      }}>
      <HeaderComponent centerContent='' showSearch={false} />
      <div className='min-h-screen bg-gray-50'>
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
          <div className='container mx-auto px-4 py-8'>
            <div className='flex flex-col md:flex-row gap-8 mt-12'>
              <div className='w-full md:w-1/3 lg:w-1/4'>
                <img
                  src={forum?.imageUrl || '/api/placeholder/300/450'}
                  alt={forum?.forumTitle}
                  className='w-full h-[450px] object-cover rounded-lg shadow-lg'
                />

                <div className='flex justify-between mt-4'>
                  <button className='flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors'>
                    <Heart className='w-5 h-5' />
                    <span>Like</span>
                  </button>
                  <button className='flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors'>
                    <Share2 className='w-5 h-5' />
                    <span>Share</span>
                  </button>
                  <button className='flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors'>
                    <Bookmark className='w-5 h-5' />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* Forum Info */}
              <div className='flex-1'>
                <h1 className='text-4xl font-bold mb-4'>{forum?.forumTitle}</h1>
                <p className='text-lg text-white/80 mb-6'>
                  {forum?.forumDescription}
                </p>

                <div className='grid grid-cols-2 md:grid-cols-3 gap-6 mb-8'>
                  <div>
                    <h3 className='text-white/60 text-sm mb-1'>Book Title</h3>
                    <p className='text-lg font-medium'>{forum?.bookTitle}</p>
                  </div>
                  <div>
                    <h3 className='text-white/60 text-sm mb-1'>Author</h3>
                    <p className='text-lg font-medium'>{forum?.authors}</p>
                  </div>
                  <div>
                    <h3 className='text-white/60 text-sm mb-1'>Created By</h3>
                    <div className='flex items-center gap-2'>
                      <img
                        src={
                          forum?.creator?.urlAvatar || '/api/placeholder/32/32'
                        }
                        alt={forum?.creator?.fullName}
                        className='w-8 h-8 rounded-full'
                      />
                      <span className='text-lg font-medium'>
                        {forum?.creator?.fullName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex gap-6'>
                  <div className='flex items-center gap-2'>
                    <Users className='w-5 h-5' />
                    <span>{forum?.totalMembers} members</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <MessageCircle className='w-5 h-5' />
                    <span>{comments.length} discussions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-4xl mx-auto'>
            <div className='bg-white rounded-lg shadow-md p-4 mb-8'>
              <div className='flex gap-4'>
                <img
                  src={user?.urlAvatar || '/api/placeholder/48/48'}
                  alt='Your avatar'
                  className='w-10 h-10 rounded-full'
                />
                <div className='flex-1'>
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder='Share your thoughts about this book...'
                    className='w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none'
                    rows='3'
                  />
                  <div className='flex justify-between items-center mt-4'>
                    <div className='flex gap-2'>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageSelect}
                        ref={fileInputRef}
                        className='hidden'
                        id='image-upload'
                      />
                      <label
                        htmlFor='image-upload'
                        className='cursor-pointer flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors'>
                        <Image className='w-5 h-5' />
                        <span>Add Image</span>
                      </label>
                      {selectedImage && (
                        <div className='flex items-center gap-2'>
                          <span className='text-sm text-gray-500'>
                            {selectedImage.name}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedImage(null)
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ''
                              }
                            }}
                            className='text-red-500 hover:text-red-700'>
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                    <button
    onClick={handleSubmitComment}
    disabled={isSending}
    className={`${
        isSending
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
    } text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2`}
>
    {isSending ? (
        <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Sending...</span>
        </>
    ) : (
        <>
            <Send className="w-4 h-4" />
            <span>Post</span>
        </>
    )}
</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className='space-y-6'>
              {comments.map(comment => (
                <ForumCommentItem
                  key={comment.id}
                  comment={comment}
                  stompClient={stompClient}
                  user={user}
               />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Box>
  )
}

export default ForumDiscussion
