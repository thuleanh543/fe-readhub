import React, {useEffect, useState, useRef} from 'react'
import {useLocation} from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import {images} from '../../../constants'
import {ReactReader} from 'react-reader'
import axios from 'axios'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Select,
  MenuItem,
  Drawer,
  Popover,
  TextField,
} from '@mui/material'
import {ColorLens} from '@mui/icons-material'
const colors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'] // Màu pastel

function ReadBookScreen() {
  const location = useLocation()
  const {bookId} = location.state || {}
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [epubUrl, setEpubUrl] = useState(null)
  const [selections, setSelections] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [rendition, setRendition] = useState(null)
  const [highlightColor, setHighlightColor] = useState(colors[0]) // Màu mặc định
  const [comment, setComment] = useState('')
  const [popoverAnchor, setPopoverAnchor] = useState(null)
  const [selectedText, setSelectedText] = useState('')
  const [selectedCfiRange, setSelectedCfiRange] = useState('')
  const readerRef = useRef(null)

  const handleError = error => {
    console.error('Error in ReactReader:', error)
    setError(
      'An error occurred while loading the book. Please try again later.',
    )
    setLoading(false)
  }

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }
  useEffect(() => {
    const epubUrl = `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.epub`
    setEpubUrl(epubUrl)
  }, [])

  useEffect(() => {
    if (rendition) {
      const handleSelection = (cfiRange, contents) => {
        const selection = contents.window.getSelection()
        const range = selection.getRangeAt(0)
        const text = selection.toString().trim()
        if (text) {
          setSelectedText(text)
          setSelectedCfiRange(cfiRange)
          const rect = range.getBoundingClientRect()
          const viewportHeight = window.innerHeight
          const viewportWidth = window.innerWidth
          setPopoverAnchor({
            top:
              rect.top < viewportHeight / 2
                ? rect.bottom + window.scrollY + 115
                : rect.top + window.scrollY - 60,
            left: viewportWidth / 2 + 5,
          })
        }
      }

      rendition.on('selected', handleSelection)

      rendition.themes.default({
        '::selection': {
          background: 'rgba(0, 0, 255, 0.1)', // Màu xanh nhạt khi kéo thả
          color: 'inherit',
        },
      })

      return () => {
        rendition.off('selected', handleSelection)
      }
    }
  }, [rendition])

  const handleSave = () => {
    if (comment && selectedCfiRange) {
      const newSelection = {
        text: selectedText,
        cfiRange: selectedCfiRange,
        comment,
        color: highlightColor,
        timestamp: new Date().toISOString(), // Add timestamp
      }

      setSelections(prev => [newSelection, ...prev])

      // Xóa highlight cũ (nếu có)
      rendition.annotations.remove(selectedCfiRange, 'highlight')

      // Thêm highlight mới với màu đã chọn
      rendition.annotations.add('highlight', selectedCfiRange, {}, null, 'hl', {
        fill: highlightColor,
        'fill-opacity': '0.3',
        'mix-blend-mode': 'multiply',
      })

      // Cập nhật styles cho highlight
      rendition.views().forEach(view => {
        const highlights = view.document.querySelectorAll(
          'mark[data-epubjs-annotation="highlight"]',
        )
        highlights.forEach(highlight => {
          // Find the highlight by CFI range and apply the correct background color
          if (highlight.dataset.epubcfi === selectedCfiRange) {
            highlight.style.backgroundColor = highlightColor // Apply the selected highlight color
            highlight.style.opacity = '0.3' // Set opacity
          }
        })
      })

      setPopoverAnchor(null)
      setComment('')
      setSelectedText('')
      setSelectedCfiRange('')
    }
  }

  const handleRemoveHighlight = cfiRange => {
    rendition.annotations.remove(cfiRange, 'highlight')
    setSelections(
      selections.filter(selection => selection.cfiRange !== cfiRange),
    )
  }

  return (
    <div
      className='App'
      style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' style={{flexGrow: 1}}>
            Epub Reader
          </Typography>
          <Button color='inherit' onClick={handleToggleDrawer}>
            <ColorLens />
            Notes
          </Button>
        </Toolbar>
      </AppBar>
      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div style={{flex: 1, position: 'relative'}} ref={readerRef}>
        <ReactReader
          url={epubUrl}
          epubOptions={{
            allowPopups: true, // Adds `allow-popups` to sandbox-attribute
            allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
          }}
          location={location}
          getRendition={_rendition => {
            setRendition(_rendition)
            _rendition.on('started', () => setLoading(false))
          }}
          handleError={handleError}
        />
      </div>
      <Popover
        open={Boolean(popoverAnchor)}
        anchorReference='anchorPosition'
        anchorPosition={popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <div style={{padding: '10px'}}>
          <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
            {colors.map((color, i) => (
              <div
                key={i}
                onClick={() => setHighlightColor(color)}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: color,
                  border: color === highlightColor ? '2px solid black' : '',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
          <TextField
            label='Comment'
            fullWidth
            multiline
            rows={2}
            value={comment}
            onChange={e => setComment(e.target.value)}
            style={{marginBottom: '10px'}}
          />
          <Button
            onClick={handleSave}
            disabled={!comment}
            color='primary'
            variant='contained'>
            Save
          </Button>
        </div>
      </Popover>
      <Drawer anchor='right' open={drawerOpen} onClose={handleToggleDrawer}>
        <div style={{width: 250, padding: '20px'}}>
          <Typography variant='h6'>Notes</Typography>
          {selections.map(({text, cfiRange, comment, color}, i) => (
            <div
              key={i}
              style={{
                marginBottom: '15px',
                borderBottom: '1px solid #eee',
                paddingBottom: '10px',
              }}>
              <Typography
                variant='body2'
                style={{backgroundColor: color, padding: '5px'}}>
                {text}
              </Typography>
              <Typography variant='body2'>{comment}</Typography>
              <Button size='small' onClick={() => rendition.display(cfiRange)}>
                Show
              </Button>
              <Button
                size='small'
                onClick={() => handleRemoveHighlight(cfiRange)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  )
}

export default ReadBookScreen
