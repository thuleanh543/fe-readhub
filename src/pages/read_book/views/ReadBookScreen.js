import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function ReadBookScreen() {
  const location = useLocation();
  const { bookId } = location.state || {};

  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('bookId:', bookId);
    if (bookId) {
      fetch(`https://gutendex.com/books/${bookId}`)
        .then((response) => response.json())
        .then((data) => {
          setBookData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching book data:', error);
          setLoading(false);
        });
    }
  }, [bookId]);


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!bookData) {
    return <div>No book data found</div>;
  }

  const { title, authors, formats } = bookData;

  return (
    <div>
      <div style={{ ...styles.header }}>
        <h1>{title}</h1>
        <p>
          <strong>Author:</strong> {authors.map((author) => author.name).join(', ')}
        </p>
      </div>
      <iframe
        src={formats['text/plain'] || formats['text/html']}
        style={styles.bookContent}
        title="Book Content"
      />
    </div>
  );
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '19%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '10px',
    borderBottom: '1px solid #ddd',
    zIndex: 1000,
    transition: 'opacity 0.3s ease',
  },
  bookContent: {
    width: '100%',
    height: '100vh',
    border: 'none',
  },
};

export default ReadBookScreen;
