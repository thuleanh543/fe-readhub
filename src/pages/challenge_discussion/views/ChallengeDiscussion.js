import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Trash2, Send,Plus, X } from 'lucide-react';
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
  const [challengeInfo, setChallengeInfo] = useState(null);
  const [readBooksCount, setReadBooksCount] = useState(0);
  const [currentUserReadCount, setCurrentUserReadCount] = useState(0);
  const [user, setUser] = useState(null);

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
    getUser();
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

  const getDaysRemaining = () => {
    if (!challengeInfo?.endDate) return 0;
    const endDate = new Date(challengeInfo.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  useEffect(() => {
    if (challengeInfo?.startDate && challengeInfo?.endDate) {
      fetchUserReadCount();
    }
  }, [challengeInfo]);

  const fetchUserReadCount = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/reading-history/count`,
        {
          params: {
            startDate: challengeInfo?.startDate,
            endDate: challengeInfo?.endDate
          },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      if (response.data.success) {
        setCurrentUserReadCount(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load user read count:", error);
    }
  };

  // Tính phần trăm hoàn thành
  const getProgressPercentage = () => {
    if (!challengeInfo?.targetBooks) return 0;
    return Math.min((readBooksCount / challengeInfo.targetBooks) * 100, 100);
  };

  const getUser = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/user/profile`,
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
    }
  }

  useEffect(() => {
    const fetchChallengeInfo = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/challenges/${challengeId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.success) {
          setChallengeInfo(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load challenge info:", error);
      }
    };

    // Fetch số sách đã đọc
    const fetchReadBooksCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/reading-history/count`, {
            params: {
              startDate: challengeInfo?.startDate,
              endDate: challengeInfo?.endDate
            },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        if (response.data.success) {
          setReadBooksCount(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load read books count:", error);
      }
    };

    fetchChallengeInfo();
    if (challengeInfo) {
      fetchReadBooksCount();
    }
  }, [challengeId, challengeInfo?.startDate, challengeInfo?.endDate]);

  useEffect(() => {
    let stompClientRef = null;
    let subscription = null;
    let deleteSubscription = null;

    const connectWebSocket = () => {
      const socket = new SockJS(`${process.env.REACT_APP_END_POINT_API_RENDER}/ws`);
      const client = Stomp.over(socket);
      client.debug = () => {};
      stompClientRef = client;

      client.connect(
        { Authorization: `Bearer ${localStorage.getItem('token')}` },
        () => {
          setStompClient(client);
          subscription = client.subscribe(`/topic/challenge/${challengeId}`, message => {
            const newComment = JSON.parse(message.body);
            // Check if the new comment should have a reward badge
            const shouldShowReward = newComment.user.id === JSON.parse(localStorage.getItem('user'))?.id &&
                                   currentUserReadCount >= challengeInfo?.targetBooks;

            const commentWithReward = {
              ...newComment,
              rewardEarned: shouldShowReward
            };

            setComments(prev => {
              const exists = prev.some(c => c.id === commentWithReward.id);
              if (exists) return prev;
              return [commentWithReward, ...prev];
            });
          });

          deleteSubscription = client.subscribe(
            `/topic/challenge/${challengeId}/comment-delete`,
            message => {
              const { commentId } = JSON.parse(message.body);
              setComments(prev => prev.filter(c => c.id !== commentId));
            }
          );
        }
      );
    };

    connectWebSocket();

    return () => {
      if (subscription) subscription.unsubscribe();
      if (deleteSubscription) deleteSubscription.unsubscribe();
      if (stompClientRef?.connected) {
        stompClientRef.disconnect();
      }
    };
  }, [challengeId, currentUserReadCount, challengeInfo]);

  const handleDeleteComment = (commentId) => {
    if (stompClient?.connected) {
      const messagePayload = {
        challengeId,
        commentId,
        timestamp: new Date().getTime()
      };

      stompClient.send(
        '/app/challenge/comment/delete',
        { Authorization: `Bearer ${localStorage.getItem('token')}` },
        JSON.stringify(messagePayload)
      );
    }
  };

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

        const messagePayload = {
          challengeId,
          content: newComment,
          books: formattedBooks,
          timestamp: new Date().getTime(),
          rewardEarned: currentUserReadCount >= challengeInfo?.targetBooks
        };

        stompClient.send(
          '/app/challenge/comment',
          { Authorization: `Bearer ${localStorage.getItem('token')}` },
          JSON.stringify(messagePayload)
        );

        // Reset form and update read count
        setNewComment('');
        setSelectedBooks([]);
        if (formattedBooks.length > 0) {
          fetchUserReadCount(); // Refresh the read count after adding books
        }
      }
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setIsSending(false);
    }
  };

  const MonthlyBadge = () => (
    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full text-xs text-white font-medium shadow-lg">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="#FFD700" stroke="#FFD700"/>
      </svg>
      <span>Monthly Champion</span>
    </div>
  );

  const ColorBadge = () => (
    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full text-xs text-white font-medium shadow-lg">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6H4V18H20V6Z" fill="#00BCD4"/>
        <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
              fill="#FFFFFF"/>
      </svg>
      <span>Color Master</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <HeaderComponent centerContent='' showSearch={false} />
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white mt-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{challengeInfo?.title || 'Reading Challenge Progress'}</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm opacity-80">Books Read</p>
              <p className="text-2xl font-bold">
                {readBooksCount}/{challengeInfo?.targetBooks || 0}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Days Left</p>
              <p className="text-2xl font-bold">{getDaysRemaining()}</p>
            </div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your reading progress and thoughts..."
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[180px] resize-none bg-white shadow-sm"
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
<div className="space-y-6 mt-8">
        {comments.map((comment, index) => {
          const isOwnComment = comment?.user?.userId === user?.userId;
          return (
            <div
              key={`comment-${comment.id}-${index}`}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
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
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-lg">{comment.user.fullName}</h4>
                      {comment.rewardEarned && challengeInfo?.reward === "READING_COLOR" && (
                        <ColorBadge />
                      )}
                      {comment.rewardEarned && challengeInfo?.reward === "READING_MONTH" && (
                        <MonthlyBadge />
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">
                      {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                {isOwnComment && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <p className="text-gray-800 mb-4">{comment.content}</p>

              {comment.books?.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Books Read:</h5>
                  <div className="grid grid-cols-2 gap-4">
                    {comment.books.map((book, bookIndex) => (
                      <div
                        key={`book-${comment.id}-${book.id}-${bookIndex}`}
                        className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg"
                      >
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengeDiscussion;