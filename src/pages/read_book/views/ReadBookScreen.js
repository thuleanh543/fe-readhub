import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function ReadBookScreen() {
  const location = useLocation();
  const { bookId } = location.state || {};

  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('bookId:', bookId);
    if (bookId) {
      // Gọi API Gutendex để lấy thông tin sách
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
    return <div>Loading...</div>;
  }

  if (!bookData) {
    return <div>No book data found</div>;
  }

  const { title, authors, formats } = bookData;

  return (
    <div style={styles.container}>
      <h1>{title}</h1>
      <p>
        <strong>Author:</strong> {authors.map((author) => author.name).join(', ')}
      </p>
      <div style={styles.readerContainer}>
        {/* Link to read the book in plain text format */}
        {formats['text/plain'] && (
          <iframe
            src={formats['text/plain']}
            style={styles.bookContent}
            title="Book Content"
          />
        )}
        {/* If there's no plain text version, fallback to HTML or other format */}
        {!formats['text/plain'] && formats['text/html'] && (
          <iframe
            src={formats['text/html']}
            style={styles.bookContent}
            title="Book Content"
          />
        )}
        {/* In case no readable format is available */}
        {!formats['text/plain'] && !formats['text/html'] && (
          <p>No readable format available for this book.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  readerContainer: {
    marginTop: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  bookContent: {
    width: '100%',
    height: '500px',
    border: 'none',
  },
};

export default ReadBookScreen;