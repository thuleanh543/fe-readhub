import React, {useEffect, useState, useRef} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {ReactReader} from 'react-reader'
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
  Divider,
} from '@mui/material'
import {ArrowBack, ColorLens} from '@mui/icons-material'

const colors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'] // Pastel colors

function ReadBookScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const {bookId, bookTitle} = location.state || {}
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [epubUrl, setEpubUrl] = useState(null)
  const [selections, setSelections] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [rendition, setRendition] = useState(null)
  const [highlightColor, setHighlightColor] = useState(colors[0])
  const [comment, setComment] = useState('')
  const [popoverAnchor, setPopoverAnchor] = useState(null)
  const [selectedText, setSelectedText] = useState('')
  const [selectedCfiRange, setSelectedCfiRange] = useState('')
  const readerRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all') // Filter state

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
  }, [bookId])

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
          background: 'rgba(0, 0, 255, 0.1)', // Light blue on selection
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
        timestamp: Date.now(), // Add timestamp for sorting
      }
      setSelections(prev => [...prev, newSelection])

      // Remove old highlight if exists
      rendition.annotations.remove(selectedCfiRange, 'highlight')

      // Add new highlight with selected color
      rendition.annotations.add('highlight', selectedCfiRange, {}, null, 'hl', {
        fill: highlightColor,
        'fill-opacity': '0.3',
        'mix-blend-mode': 'multiply',
      })

      // Update styles for the highlight
      rendition.views().forEach(view => {
        const highlights = view.document.querySelectorAll(
          'mark[data-epubjs-annotation="highlight"]',
        )
        highlights.forEach(highlight => {
          if (highlight.dataset.epubcfi === selectedCfiRange) {
            highlight.style.backgroundColor = highlightColor // Apply selected highlight color
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

  // Search and filter logic
  const filteredSelections = selections
    .filter(selection => {
      const isTextMatch = selection.text
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const isColorMatch = filter === 'all' || selection.color === filter
      return isTextMatch && isColorMatch
    })
    .sort((a, b) => b.timestamp - a.timestamp) // Sort by latest first

  return (
    <div
      className='App'
      style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
      <AppBar position='static'>
        <Toolbar>
          <Button color='inherit' onClick={() => navigate(-1)}>
            <ArrowBack />
            Back
          </Button>
          <Typography variant='h6' style={{flexGrow: 1, textAlign: 'center'}}>
            {bookTitle || 'Epub Reader'}
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
            allowPopups: true,
            allowScriptedContent: true,
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
        <div style={{width: 350}}>
          <div
            style={{
              paddingTop: '20px',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}>
            <Typography variant='h6' style={{marginBottom: '10px'}}>
              Notes
            </Typography>
            <TextField
              label='Search Notes'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              fullWidth
              style={{
                marginBottom: '10px',
              }}
            />
            <Select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              fullWidth
              style={{
                marginBottom: '10px',
              }}>
              <MenuItem
                value='all'
                style={{paddingLeft: '20px', paddingRight: '20px'}}>
                All Colors
              </MenuItem>
              {colors.map((color, index) => (
                <MenuItem key={index} value={color}>
                  <span
                    style={{
                      backgroundColor: color,
                      padding: '2px 10px',
                      borderRadius: '5px',
                      color: color,
                    }}>
                    {`ColorColorColorColorColorColori`}
                  </span>
                </MenuItem>
              ))}
            </Select>
          </div>
          <Divider style={{margin: '10px 0'}} />
          <div
            style={{
              maxHeight: 'calc(100vh - 205px)',
              overflowY: 'auto',
              paddingLeft: '20px',
            }}>
            {filteredSelections.map((note, i) => {
              const {text, cfiRange, comment, color, timestamp} = note
              const isLastNote = i === filteredSelections.length - 1 // Check if it's the last note
              return (
                <div
                  key={i}
                  style={{
                    marginBottom: '15px',
                    paddingBottom: '10px',
                    paddingRight: '10px',
                    borderBottom: isLastNote ? 'none' : '1px solid #eee', // Conditional border
                  }}>
                  <Typography
                    variant='body2'
                    style={{
                      backgroundColor: color,
                      padding: '7px',
                      borderRadius: '5px',
                      marginBottom: '7px',
                    }}>
                    {text}
                  </Typography>
                  <Typography variant='body2'>{comment}</Typography>
                  <Typography
                    variant='caption'
                    style={{
                      textAlign: 'right',
                      display: 'block',
                      marginTop: '7px',
                    }}>
                    {new Date(timestamp).toLocaleString()}
                  </Typography>
                  <Button
                    size='small'
                    onClick={() => rendition.display(cfiRange)}
                    style={{marginRight: '5px'}}
                    variant='outlined'>
                    Show
                  </Button>
                  <Button
                    size='small'
                    onClick={() => handleRemoveHighlight(cfiRange)}
                    variant='outlined'
                    color='secondary'>
                    Remove
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default ReadBookScreen
