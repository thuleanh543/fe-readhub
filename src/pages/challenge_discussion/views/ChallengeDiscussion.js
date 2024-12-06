import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MessagesSquare, Book, Trash2, Send, BookOpen, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import { SEARCH_MODE } from '../../../constants/enums';

const ChallengeDiscussion = () => {
  const { challengeId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Challenge Progress Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
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

      {/* Comment Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex gap-6 mb-6">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your reading progress and thoughts..."
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none"
            />
          </div>
          <div className="w-64 border-l pl-6">
            <button
              onClick={() => {
                navigate('/search-result', {
                  state: { mode: SEARCH_MODE.SELECT_BOOKS_FOR_CHALLENGE },
                  onSelect: (selectedBooks) => {
                    setSelectedBooks(selectedBooks);
                  }
                });
              }}
              className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Books Read</span>
            </button>
            {selectedBooks.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Selected Books:</h4>
                {selectedBooks.map(book => (
                  <div key={book.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-sm truncate flex-1">{book.title}</span>
                    <button
                      onClick={() => setSelectedBooks(books => books.filter(b => b.id !== book.id))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
            <Send className="w-5 h-5" />
            <span>Post Update</span>
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={comment.user.avatar}
                alt={comment.user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="font-semibold text-lg">{comment.user.name}</h4>
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
                  {comment.books.map(book => (
                    <div key={book.id} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
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