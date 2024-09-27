import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { images } from '../../../constants';

function ReadBookScreen() {
  const location = useLocation();
  const { bookId } = location.state || {};

  const [bookData, setBookData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState('');
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (bookId) {
      fetch(`https://gutendex.com/books/${bookId}`)
        .then((response) => response.json())
        .then((data) => {
          setBookData(data);
          fetchChapters(data.formats['text/html']);
        })
        .catch((error) => {
          console.error('Error fetching book data:', error);
          setLoading(false);
        });
    }
  }, [bookId]);

  const fetchChapters = (url) => {
    fetch(`http://localhost:8080/api/v1/book/chapters?url=${encodeURIComponent(url)}`)
      .then((response) => response.json())
      .then((data) => {
        setChapters(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching chapters:', error);
        setLoading(false);
      });
  };

  const fetchChapterContent = (chapterId) => {
    setLoading(true);
    const url = bookData.formats['text/html'];
    fetch(`http://localhost:8080/api/v1/book/chapter-content?url=${encodeURIComponent(url)}&chapterId=${chapterId}`)
      .then((response) => response.text())
      .then((data) => {
        setChapterContent(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching chapter content:', error);
        setLoading(false);
      });
  };

  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
    fetchChapterContent(chapter.id);
  };

  useEffect(() => {
    if (iframeRef.current && chapterContent) {
      const iframe = iframeRef.current;
      iframe.srcdoc = chapterContent;
      iframe.onload = () => {
        iframe.style.height = `${contentRef.current.clientHeight}px`;
      };
    }
  }, [chapterContent]);

  useEffect(() => {
    const handleResize = () => {
      if (iframeRef.current && contentRef.current) {
        iframeRef.current.style.height = `${contentRef.current.clientHeight}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const { title, authors } = bookData;
  const coverImageUrl = bookData.formats['image/jpeg'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
      <img src={coverImageUrl} alt="Book Cover" style={styles.coverImage} />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h1>{title}</h1>
        <p>
          <strong>Author:</strong> {authors.map((author) => author.name).join(', ')}
        </p>
      </div>
      </div>
      <div style={styles.content}>
        <div style={styles.chapterList}>
        <List>
        {chapters.map((chapter) => (
        <ListItem ListItem
          button
          key={chapter.id}
          onClick={() => handleChapterClick(chapter)}
          selected={selectedChapter && selectedChapter.id === chapter.id}
          sx={{
            '& .MuiListItemText-primary': {
          fontFamily: '"Sitka Heading", serif',
          fontWeight: 500,
          },
          backgroundColor: selectedChapter && selectedChapter.id === chapter.id ? '#d3d3d3' : 'transparent',
          '&:hover': {
            backgroundColor: '#F1F1F1FF',
          },
        }}
        >
      <ListItemText primary={chapter.name} />
    </ListItem>
  ))}
</List>
        </div>
        <div ref={contentRef} style={styles.bookContent}>
          {selectedChapter ? (
            <iframe
              ref={iframeRef}
              style={styles.iframe}
              title="Chapter Content"
              sandbox="allow-same-origin"
            />
          ) : (
            <div>Select a chapter to start reading</div>
          )}
        </div>
      </div>
      <div style={styles.footer}>
        <button onClick={() => {}} style={styles.button}>
          <img src={images.icLeftArrow} alt="Previous" style={styles.icon} />
        </button>
        <span style={styles.chapterLabel}>
          {selectedChapter ? selectedChapter.name : 'No chapter selected'}
        </span>
        <button onClick={() => {}} style={styles.button}>
          <img src={images.icRightArrow} alt="Next" style={styles.icon} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  coverImage : {
    width: '50px',
    marginRight: '10px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  header: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    flexDirection: 'row',
    zIndex: 1000,
    width: '250px',
    position: 'fixed',
    top: 0,
    left: 0,
  },
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  chapterList: {
    marginTop: '5%',
    width: '250px',
    overflowY: 'auto',
    borderRight: '1px solid #ddd',
  },
  bookContent: {
    flex: 1,
    overflow: 'hidden',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  footer: {
    height: '60px',
    borderTop: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  icon: {
    width: '30px',
    height: '30px',
  },
  button: {
    padding: '10px 20px',
    cursor: 'pointer',
  },
  chapterLabel: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 20px',
  },
};

export default ReadBookScreen;