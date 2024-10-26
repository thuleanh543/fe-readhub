import React, { useState } from 'react';
import { PlusCircle, MessageCircle, Users, Book, TrendingUp, Star, BookOpen, Clock, Heart } from 'lucide-react';

const BookForum = () => {
  const [forums, setForums] = useState([
    {
      id: 1,
      title: "Classic Literature Club",
      description: "Discuss timeless works of literature from around the world",
      totalMembers: 1240,
      totalPosts: 456,
      latestActivity: "2 hours ago",
      category: "Classics",
      trending: true,
      currentBook: {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        rating: 4.8,
        readers: 1890,
        coverUrl: "https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg",
      },
      upcomingBooks: [
        "The Great Gatsby - F. Scott Fitzgerald",
        "1984 - George Orwell"
      ],
      recentTopics: [
        "Character Analysis: Elizabeth Bennet",
        "Social Commentary in Pride and Prejudice",
        "Marriage Themes Discussion"
      ]
    },
    {
      id: 2,
      title: "Science Fiction & Fantasy",
      description: "Explore imaginative worlds and futuristic scenarios",
      totalMembers: 890,
      totalPosts: 234,
      latestActivity: "5 hours ago",
      category: "Fiction",
      trending: false,
      currentBook: {
        title: "Dune",
        author: "Frank Herbert",
        rating: 4.9,
        readers: 2340,
        coverUrl: "https://bizweb.dktcdn.net/100/180/408/products/xu-cat-d3a402bd-5793-473f-bb52-2836eeac5316-cfdf89e9-4ecb-4bc5-be97-87533e48d45a-a3d65c8a-fd91-4c25-a86d-2b359e974290.jpg?v=1638598294267",
      },
      upcomingBooks: [
        "Foundation - Isaac Asimov",
        "The Way of Kings - Brandon Sanderson"
      ],
      recentTopics: [
        "Themes of Ecology in Dune",
        "Paul's Character Development",
        "Exploring the Bene Gesserit"
      ]
    },
    {
      id: 3,
      title: "Modern Literature",
      description: "Contemporary works that shape today's literary landscape",
      totalMembers: 567,
      totalPosts: 789,
      latestActivity: "1 day ago",
      category: "Contemporary",
      trending: true,
      currentBook: {
        title: "The Midnight Library",
        author: "Matt Haig",
        rating: 4.6,
        readers: 1567,
        coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-XewEIDM-yCiLLSynORoahhkJwn0CiHT7qg&s",
      },
      upcomingBooks: [
        "Cloud Cuckoo Land - Anthony Doerr",
        "Beautiful World, Where Are You - Sally Rooney"
      ],
      recentTopics: [
        "Life Choices and Parallel Universes",
        "Mental Health Themes",
        "Character Study: Nora Seed"
      ]
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Book Forums</h1>
          <p className="text-gray-600">Join thoughtful discussions about books with fellow readers</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Forum
        </button>
      </div>

      {/* Forums Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {forums.map((forum) => (
          <div key={forum.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Forum Header */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{forum.title}</h2>
                {forum.trending && (
                  <span className="flex items-center px-2 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Trending
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{forum.description}</p>
            </div>

            {/* Current Book Section */}
            <div className="px-6 py-4 border-t border-b border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Currently Reading</h3>
              <div className="flex gap-4">
                <img
                  src={forum.currentBook.coverUrl}
                  alt={forum.currentBook.title}
                  className="w-24 h-36 object-cover rounded"
                />
                <div>
                  <h4 className="font-bold">{forum.currentBook.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">by {forum.currentBook.author}</p>
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm">{forum.currentBook.rating}</span>
                    <span className="text-gray-500 text-sm ml-2">({forum.currentBook.readers} readers)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Topics */}
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Recent Topics</h3>
              <ul className="space-y-2">
                {forum.recentTopics.map((topic, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-blue-500" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            {/* Upcoming Books */}
            <div className="px-6 py-4 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Coming Up Next</h3>
              <ul className="space-y-2">
                {forum.upcomingBooks.map((book, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-green-500" />
                    {book}
                  </li>
                ))}
              </ul>
            </div>

            {/* Forum Stats */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between items-center border-t border-gray-200">
              <div className="flex gap-4">
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="text-sm">{forum.totalMembers.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{forum.totalPosts.toLocaleString()}</span>
                </div>
              </div>
              <span className="text-sm text-gray-500">Active {forum.latestActivity}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Reading Challenge */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Featured Reading Challenge</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-2">Summer Reading Challenge</h3>
            <p className="text-blue-100 mb-4">Read 5 classics in 3 months and earn your badge</p>
            <div className="flex items-center mb-6">
              <Book className="w-6 h-6 mr-2" />
              <span>15 days remaining</span>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors">
                Join Challenge
              </button>
              <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                View Books
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-2">Author Spotlight</h3>
            <p className="text-purple-100 mb-4">This month featuring: Haruki Murakami</p>
            <div className="flex items-center mb-6">
              <Heart className="w-6 h-6 mr-2" />
              <span>Join the reading marathon</span>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors">
                View Collection
              </button>
              <button className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors">
                Join Discussion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookForum;