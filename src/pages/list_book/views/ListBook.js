import React, { useEffect, useState, useCallback, useRef } from 'react';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { colors, images } from '../../../constants';

const ListBook = ({ searchTerm, windowSize }) => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [shouldFetch, setShouldFetch] = useState(true);
  const prevSearchTerm = useRef('');

  const navigate = useNavigate();

  const fetchBooks = useCallback(
    async (search = '', pageNum = 1) => {
      setHasMore(true);
      if (loading || !shouldFetch) return;
      setLoading(true);
      try {
        let apiUrl;
        const formattedSearchTerm = search.replace(/ /g, '&');
        apiUrl = `https://gutendex.com/books/?search=${formattedSearchTerm}&page=${pageNum}`;
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
          setLoading(false);
          setHasMore(false);
        }
      } catch (error) {
        setLoading(false);
        setHasMore(false);
      } finally {
        setLoading(false);
        setShouldFetch(false);
      }
    },
    [loading, shouldFetch],
  );

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
  }, [searchTerm, fetchBooks, page, shouldFetch]);

  const handleBookClick = bookId => {
    navigate('/ReadBookScreen', { state: { bookId } });
  };

  const getGridColumns = () => {
    const width = windowSize.width;
    if (width > 1400) return 7;
    if (width > 1200) return 6;
    if (width > 992) return 5;
    if (width > 768) return 4;
    if (width > 576) return 3;
    return 2;
  };

  const gridColumns = getGridColumns();
  const bookWidth = (windowSize.width * 0.9) / gridColumns - 20;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: colors.themeDark.color060d13,
        padding: '20px 5%',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
          gap: '20px',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {books.map((book, index) => (
          <div
            key={`${book.id}-${page}-${index}`}
            onClick={() => handleBookClick(book.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                height: bookWidth * 1.38,
                width: bookWidth,
                backgroundImage: `url('${book.formats['image/jpeg']}')`,
                borderRadius: 8,
                backgroundSize: 'cover',
                borderWidth: 3,
                borderColor: '#474a51',
                borderStyle: 'solid',
                boxShadow: '5px 5px 10px rgba(255, 255, 255, 0.3)',
              }}
            />
            <span
              style={{
                marginTop: 15,
                width: bookWidth,
                fontWeight: 'bold',
                fontSize: '14px',
                color: colors.themeDark.textColor,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitLineClamp: 2,
                textAlign: 'center',
              }}
            >
              {book.title}
            </span>
          </div>
        ))}
      </div>
      {loading && (
        <p
          style={{
            color: '#fff',
            textAlign: 'center',
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <CircularProgress size={24} color='inherit' /> Loading more books...
        </p>
      )}
      {!hasMore && (
        <p
          style={{
            color: '#fff',
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          No more books to load
        </p>
      )}
    </div>
  );
};

export default ListBook;
