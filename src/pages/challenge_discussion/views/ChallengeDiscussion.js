import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MessagesSquare, Book, Trash2, Send, BookOpen, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import { SEARCH_MODE } from '../../../constants/enums';
import { Stomp } from '@stomp/stompjs';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';
import HeaderComponent from '../../../component/header/HeaderComponent';
import { Avatar } from '@mui/material';

const ChallengeDiscussion = () => {
  const { challengeId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [stompClient, setStompClient] = useState(null);
  const [isSending, setIsSending] = useState(false);

  function stringToColor(string) {
    let hash = 0
    let i
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    return color
  }
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 33,
        height: 33,
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    }
  }

  useEffect(() => {
    const books = location.state?.selectedBooks;
    if (books) {
      setSelectedBooks(books);
      window.history.replaceState(null, '');
    }
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/challenges/${challengeId}/comments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.success) {
          setComments(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load comments:", error);
      }
    };

    fetchComments();
  }, [challengeId]);

  useEffect(() => {
    let stompClientRef = null;

    const connectWebSocket = () => {
      const socket = new SockJS('http://localhost:8080/ws');
      const client = Stomp.over(socket);
      client.debug = () => {};
      stompClientRef = client;

      client.connect(
        { Authorization: `Bearer ${localStorage.getItem('token')}` },
        () => {
          setStompClient(client);
          const commentSub = client.subscribe(`/topic/challenge/${challengeId}`, message => {
            const newComment = JSON.parse(message.body);
            setComments(prev => [newComment, ...prev]);
          });

          return () => {
            if (commentSub) commentSub.unsubscribe();
          };
        }
      );
    };

    connectWebSocket();

    return () => {
      if (stompClientRef?.connected) {
        stompClientRef.disconnect();
      }
    };
  }, [challengeId]);

  const handleSubmit = async () => {
    if (!newComment.trim() && !selectedBooks.length) return;
    if (isSending) return;

    try {
      setIsSending(true);
      if (stompClient?.connected) {
        const formattedBooks = selectedBooks.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          coverUrl: book.coverUrl
        }));

        stompClient.send(
          '/app/challenge/comment',
          { Authorization: `Bearer ${localStorage.getItem('token')}` },
          JSON.stringify({
            challengeId,
            content: newComment,
            books: formattedBooks
          })
        );
        setNewComment('');
        setSelectedBooks([]);
        window.history.replaceState(null, '');
      }
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <HeaderComponent centerContent='' showSearch={false} />
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white mt-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Reading Challenge Progress</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm opacity-80">Books Read</p>
              <p className="text-2xl font-bold">3/10</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Days Left</p>
              <p className="text-2xl font-bold">15</p>
            </div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div className="bg-white rounded-full h-3 w-[30%]" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-3">
    <textarea
     value={newComment}
     onChange={(e) => setNewComment(e.target.value)}
     placeholder="Share your reading progress and thoughts..."
     className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[180px] resize-none"
   />
 </div>

 <div className="space-y-4">
   <button
     onClick={() => {
       navigate('/search-result', {
         state: {
           mode: SEARCH_MODE.SELECT_BOOKS_FOR_CHALLENGE,
           challengeId: challengeId
         }
       });
     }}
     className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all"
   >
     <Plus className="w-5 h-5" />
     <span>Add Books Read</span>
   </button>

   {selectedBooks.length > 0 && (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-3">Selected Books ({selectedBooks.length})</h4>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {selectedBooks.map(book => (
          <div key={book.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-colors group">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-12 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-gray-900 text-sm truncate">{book.title}</h5>
              <p className="text-gray-500 text-xs truncate">{book.author}</p>
            </div>
            <button
              onClick={() => setSelectedBooks(books => books.filter(b => b.id !== book.id))}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
 </div>

 <div className="md:col-span-4 flex justify-end">
 <button
    onClick={handleSubmit}
    disabled={isSending || (!newComment.trim() && !selectedBooks.length)}
    className={`${
      isSending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
    } text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2`}
  >
    {isSending ? (
      <>
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        <span>Posting...</span>
      </>
    ) : (
      <>
        <Send className="w-5 h-5" />
        <span>Post Update</span>
      </>
    )}
  </button>
 </div>
</div>
      <div className="space-y-6">
        {comments.map((comment, index) => (
          <div
          key={`comment-${comment.id}-${index}`}
          className="bg-white rounded-xl shadow-md p-6"
          >

            <div className="flex items-center gap-4 mb-4">
            {comment?.user?.urlAvatar ? (
                      <Avatar
                        sx={{width: 30, height: 30}}
                        src={comment?.user?.urlAvatar}
                        alt={comment?.user?.fullName}
                      />
                    ) : (
                      <Avatar {...stringAvatar(comment?.user?.fullName)} />
                    )}
              <div>
                <h4 className="font-semibold text-lg">{comment.user.fullName}</h4>
                <p className="text-gray-500 text-sm">
                  {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
            </div>

            <p className="text-gray-800 mb-4">{comment.content}</p>

            {comment.books?.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Books Read:</h5>
                <div className="grid grid-cols-2 gap-4">
                  {comment.books.map((book, bookIndex) => (
                    <div
                    key={`book-${comment.id}-${book.id}-${bookIndex}`}
                    className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-16 object-cover rounded"
                      />
                      <div>
                        <h6 className="font-medium text-gray-900">{book.title}</h6>
                        <p className="text-sm text-gray-500">{book.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-6 mt-4 text-gray-500">
              <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <MessagesSquare className="w-5 h-5" />
                <span>Reply</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengeDiscussion;