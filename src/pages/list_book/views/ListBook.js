import React, { useEffect, useState, useCallback, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
const ListBook = ({ searchTerm, windowSize }) => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [error, setError] = useState(null);
  const prevSearchTerm = useRef('');


  const fetchBooks = useCallback(
    async (search = '', pageNum = 1) => {
      setHasMore(true);
      if (loading || !shouldFetch) return;
      setLoading(true);
      setError(null);
      try {
        const formattedSearchTerm = search.replace(/ /g, '&');
        const apiUrl = `https://gutendex.com/books/?search=${formattedSearchTerm}&page=${pageNum}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (Array.isArray(data.results)) {
          if (pageNum === 1) {
            setBooks(data.results);
          } else {
            setBooks(prevBooks => [...prevBooks, ...data.results]);
          }
          setPage(pageNum + 1);
          setHasMore(data.next !== null);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        setError('Failed to load books. Please try again later.');
        setHasMore(false);
      } finally {
        setLoading(false);
        setShouldFetch(false);
      }
    },
    [loading, shouldFetch]
  );
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
        hasMore
      ) {
        setShouldFetch(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    let searchTimeoutId;

    if (searchTerm !== prevSearchTerm.current) {
      prevSearchTerm.current = searchTerm;
      if (searchTimeoutId) {
        clearTimeout(searchTimeoutId);
      }
      searchTimeoutId = setTimeout(() => {
        setPage(1);
        setBooks([]);
        setShouldFetch(true);
      }, 200);
    }

    if (shouldFetch) {
      fetchBooks(searchTerm, page);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (searchTimeoutId) {
        clearTimeout(searchTimeoutId);
      }
    };
  }, [searchTerm, fetchBooks, page, shouldFetch, hasMore]);

  const handleBookClick = (bookId, bookTitle) => {
    navigate('/description-book', {state: {bookId, bookTitle}})
  };

  if (error) {
    return (
      <div className="m-4 p-4 bg-red-100/10 border border-red-400/20 text-red-400 rounded-lg backdrop-blur-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-200/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-grid-slate-200/[0.04] bg-[size:50px_50px] pointer-events-none" />

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
          {books.map((book, index) => (
              <div
                key={`${book.id}-${index}`}
                onClick={() => handleBookClick(book.id, book.title)}
                className="group relative flex flex-col transition-all duration-300 hover:scale-105"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm ring-1 ring-slate-200/50 shadow-xl">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundImage: `url('${book.formats['image/jpeg']}')`
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="px-6 py-3 rounded-full bg-white/90 text-sm font-medium text-gray-900 hover:bg-white transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:shadow-xl">
                      View Details
                    </button>
                  </div>

                  <div className="absolute -inset-px bg-gradient-to-r from-blue-300 to-purple-300 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300" />
                </div>

                <div className="mt-4 p-3 rounded-lg bg-white/60 backdrop-blur-sm">
                  <h3 className="text-center text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                    {book.title}
                  </h3>
                  <p className="mt-2 text-center text-sm font-medium text-blue-600 group-hover:text-blue-800 transition-colors duration-300">
                    {book.authors?.[0]?.name || 'Unknown Author'}
                  </p>
                </div>
              </div>
            ))}

            {/* Skeleton loading */}
            {loading &&
              [...Array(6)].map((_, index) => (
                <div key={`skeleton-${index}`} className="flex flex-col">
                  <div className="aspect-[2/3] rounded-xl bg-gray-800/50 animate-pulse ring-1 ring-white/10" />
                  <div className="mt-4 p-3 rounded-lg bg-gray-800/20">
                    <div className="h-4 bg-gray-700/50 rounded animate-pulse" />
                    <div className="mt-2 h-4 w-2/3 mx-auto bg-gray-700/50 rounded animate-pulse" />
                  </div>
                </div>
              ))}
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-center justify-center mt-12 mb-8">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500/20 border-t-emerald-500" />
                <div className="absolute inset-0 animate-pulse rounded-full h-12 w-12 border-4 border-transparent border-t-emerald-400/50 blur" />
              </div>
              <span className="ml-4 text-gray-300 text-lg">Loading more books...</span>
            </div>
          )}

          {/* No more books message */}
          {!hasMore && books.length > 0 && (
            <div className="text-center mt-12 mb-8">
              <p className="text-gray-400 text-lg">
                No more books to load
              </p>
            </div>
          )}

          {/* No results message */}
          {!hasMore && books.length === 0 && !loading && (
            <div className="text-center mt-20 mb-12">
              <p className="text-xl text-gray-300">
                No books found. Try a different search term.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListBook;