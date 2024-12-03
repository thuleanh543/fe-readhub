import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessagesSquare, Book, Trash2, Send, Paperclip, X } from 'lucide-react';
import { format } from 'date-fns';
import SearchResult from '../../search_result/SearchResult';
import axios from 'axios';

const ChallengeDiscussion = ({ challengeId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [showBookSearch, setShowBookSearch] = useState(false);
  const navigate = useNavigate();

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/v1/challenges/${challengeId}/comments`, {
        content: newComment,
        books: selectedBooks.map(book => book.id)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        setComments([response.data.data, ...comments]);
        setNewComment('');
        setSelectedBooks([]);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleBookSelect = (book) => {
    setSelectedBooks(prev => [...prev, book]);
    setShowBookSearch(false);
  };

  const removeSelectedBook = (bookId) => {
    setSelectedBooks(prev => prev.filter(book => book.id !== bookId));
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`/api/v1/challenges/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Comment Input Section */}
      <div className="bg-white rounded-lg shadow-lg mb-8 p-4">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about the challenge..."
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none"
            />

            {/* Selected Books Display */}
            {selectedBooks.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedBooks.map(book => (
                  <div key={book.id} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    <Book className="w-4 h-4 mr-2" />
                    <span className="truncate max-w-[150px]">{book.title}</span>
                    <button
                      onClick={() => removeSelectedBook(book.id)}
                      className="ml-2 hover:text-blue-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowBookSearch(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Paperclip className="w-5 h-5" />
              <span>Add Books</span>
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-5 h-5" />
              <span>Post</span>
            </button>
          </div>
        </form>
      </div>

      {/* Book Search Modal */}
      {showBookSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Select Books</h2>
              <button onClick={() => setShowBookSearch(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <SearchResult
                mode="SELECT_BOOKS_FOR_COMMENT"
                onBookSelect={handleBookSelect}
                selectedBooks={selectedBooks}
              />
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{comment.user.username}</h4>
                  <span className="text-sm text-gray-500">
                    {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              </div>
              {comment.isOwner && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <p className="mt-4 text-gray-700">{comment.content}</p>

            {/* Shared Books */}
            {comment.books && comment.books.length > 0 && (
              <div className="mt-4 space-y-3">
                <h5 className="text-sm font-medium text-gray-700">Shared Books:</h5>
                <div className="flex flex-wrap gap-3">
                  {comment.books.map(book => (
                    <div
                      key={book.id}
                      className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-3 max-w-sm"
                    >
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded mr-3"
                      />
                      <div>
                        <h6 className="font-medium text-gray-900 line-clamp-1">{book.title}</h6>
                        <p className="text-sm text-gray-500 line-clamp-1">{book.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengeDiscussion;