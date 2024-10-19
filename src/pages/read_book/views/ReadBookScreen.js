import React, {useEffect, useState, useRef} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {ReactReader, ReactReaderStyle} from 'react-reader'
import ePub from 'epubjs'
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
  DialogActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Slider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import {
  ArrowBack,
  Bookmark,
  BookmarkBorder,
  ColorLens,
  Edit,
  Settings,
} from '@mui/icons-material'
import ExpandableText from './ExpandableText'
import axios from 'axios'

const colors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'] // Pastel colors
const themes = ['#FFFFFF', '#F5F5F5', '#121212']
const fontFamilies = [
  'Arial',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Roboto',
]
const defaultSettings = {
  theme: themes[0],
  pageView: 'double',
  fontFamily: fontFamilies[0],
  fontSize: 100,
  fontWeight: 400,
  lineHeight: 1.5,
  zoom: 100,
}

function ReadBookScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loca, setLocation] = useState(location || '')
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
  const [filter, setFilter] = useState('all')
  const [editingNote, setEditingNote] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [theme, setTheme] = useState(themes[0])
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false)
  const [pageView, setPageView] = useState('single')
  const [fontFamily, setFontFamily] = useState(fontFamilies[0])
  const [fontSize, setFontSize] = useState(100)
  const [fontWeight, setFontWeight] = useState(400)
  const [lineHeight, setLineHeight] = useState(1.5)
  const [zoom, setZoom] = useState(100)
  const [settings, setSettings] = useState(defaultSettings)
  const [user, setUser] = useState(null)

  const getUser = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/user/profile',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      setUser(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const getNotes = async () => {
    if (!user || !bookId) return

    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/note/user/${user.userId}/book/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )

      // Extract the data array from the response
      const notesData = Array.isArray(response.data.data)
        ? response.data.data
        : []
      setSelections(notesData)

      if (rendition) {
        notesData.forEach(note => {
          rendition.annotations.add(
            'highlight',
            note.cfiRange,
            {},
            null,
            'hl',
            {
              fill: note.color,
              'fill-opacity': '0.3',
              'mix-blend-mode': 'multiply',
            },
          )
        })
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
      setSelections([]) // Set to empty array in case of error
    }
  }

  const handleEditNote = note => {
    setEditingNote(note)
  }
  const handleSaveEdit = () => {
    if (editingNote) {
      setSelections(
        selections.map(s =>
          s.cfiRange === editingNote.cfiRange ? editingNote : s,
        ),
      )
      setEditingNote(null)
    }
  }

  const handleToggleBookmark = cfiRange => {
    if (bookmarks.includes(cfiRange)) {
      setBookmarks(bookmarks.filter(b => b !== cfiRange))
    } else {
      setBookmarks([...bookmarks, cfiRange])
    }
  }

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
  const handleSettingsDrawerToggle = () => {
    setSettingsDrawerOpen(!settingsDrawerOpen)
  }

  const applySettings = () => {
    if (rendition) {
      rendition.themes.default({
        body: {
          background: settings.theme,
          color: settings.theme === '#121212' ? '#FFFFFF' : '#000000',
          'font-family': settings.fontFamily,
          'font-size': `${settings.fontSize}%`,
          'font-weight': settings.fontWeight,
          'line-height': settings.lineHeight,
          transform: `scale(${settings.zoom / 100})`,
          'transform-origin': 'top left',
        },
        'a, a:link, a:visited, a:hover, a:active': {
          color: 'inherit !important',
          '-webkit-text-fill-color': 'inherit !important',
          'text-decoration': 'none',
        },
        '::selection': {
          'background-color': 'rgba(0, 0, 255, 0.1)',
          color: 'inherit',
        },
        '*': {
          transition: 'none !important',
        },
      })

      rendition.themes.select('default')

      if (settings.pageView === 'double') {
        rendition.spread('auto')
      } else {
        rendition.spread('none')
      }
    }
  }

  const updateSettings = (key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }))
  }

  const handleResetSettings = () => {
    setSettings(defaultSettings)
  }

  useEffect(() => {
    applySettings()
  }, [settings])

  useEffect(() => {
    const epubUrl = `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.epub`
    setEpubUrl(epubUrl)
    getUser()
  }, [bookId])

  useEffect(() => {
    if (user && bookId) {
      getNotes()
    }
  }, [user, bookId, rendition])

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
        'a:link': {
          color: 'inherit !important',
          '-webkit-text-fill-color': 'inherit !important',
        },
        'a:hover': {
          color: 'inherit !important',
          '-webkit-text-fill-color': 'inherit !important',
        },
      })

      rendition.on('rendered', section => {
        section.document.addEventListener('click', () => {
          const highlightElements =
            section.document.querySelectorAll('.highlight')
          highlightElements.forEach(el => {
            el.style.transition = 'background-color 0.3s ease'
          })
        })
      })

      return () => {
        rendition.off('selected', handleSelection)
      }
    }
  }, [rendition])
  useEffect(() => {
    if (rendition) {
      const applyHighlights = () => {
        rendition.views().forEach(view => {
          selections.forEach(note => {
            try {
              const cfiRange = new ePub.CFI(note.cfiRange)
              const range = cfiRange.toRange(view.document)

              if (range) {
                const newHighlight = view.document.createElement('div')
                newHighlight.setAttribute(
                  'style',
                  `
                background-color: ${note.color};
                opacity: 0.3;
                position: absolute;
                z-index: -1;
                pointer-events: none;
                `,
                )

                const rects = range.getClientRects()
                for (let i = 0; i < rects.length; i++) {
                  const rect = rects[i]
                  const highlightClone = newHighlight.cloneNode()
                  highlightClone.style.left = `${rect.left}px`
                  highlightClone.style.top = `${rect.top}px`
                  highlightClone.style.height = `${rect.height}px`
                  highlightClone.style.width = `${rect.width}px`
                  view.document.body.appendChild(highlightClone)
                }
              }
            } catch (error) {
              console.error('Error applying highlight:', error)
            }
          })
        })
      }

      rendition.on('rendered', section => {
        applyHighlights()
      })

      rendition.on('relocated', location => {
        applyHighlights()
      })
    }
  }, [rendition, selections])

  const handleSave = async () => {
    if (comment && selectedCfiRange) {
      const newNote = {
        userId: user.userId,
        bookId: bookId,
        content: comment,
        selectedText: selectedText,
        cfiRange: selectedCfiRange,
        color: highlightColor,
      }

      try {
        const response = await axios.post(
          'http://localhost:8080/api/v1/note',
          newNote,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )

        const createdNote = response.data

        setSelections(prev => [...prev, createdNote])

        rendition.annotations.add(
          'highlight',
          selectedCfiRange,
          {},
          null,
          'hl',
          {
            fill: highlightColor,
            'fill-opacity': '0.3',
            'mix-blend-mode': 'multiply',
          },
        )

        rendition.views().forEach(view => {
          const highlights = view.document.querySelectorAll(
            'mark[data-epubjs-annotation="highlight"]',
          )
          highlights.forEach(highlight => {
            if (highlight.dataset.epubcfi === selectedCfiRange) {
              highlight.style.backgroundColor = highlightColor
              highlight.style.opacity = '0.3'
            }
          })
        })

        setPopoverAnchor(null)
        setComment('')
        setSelectedText('')
        setSelectedCfiRange('')
      } catch (error) {
        console.error('Error creating note:', error)
      }
    }
  }

  const handleRemoveHighlight = cfiRange => {
    rendition.annotations.remove(cfiRange, 'highlight')
    setSelections(prevSelections =>
      prevSelections.filter(selection => selection.cfiRange !== cfiRange),
    )
  }

  const filteredSelections = Array.isArray(selections)
    ? selections
        .filter(selection => {
          const isTextMatch =
            (selection.selectedText
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ??
              false) ||
            (selection.content
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ??
              false)
          const isColorMatch = filter === 'all' || selection.color === filter
          return isTextMatch && isColorMatch
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp theo thời gian, mới nhất trước
    : []

  const readerStyles = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      backgroundColor: settings.theme,
      color: settings.theme === '#121212' ? '#FFFFFF' : '#000000',
    },
  }

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
          {user && (
            <Button color='inherit' onClick={handleToggleDrawer}>
              <ColorLens />
              Notes
            </Button>
          )}
          <Button color='inherit' onClick={handleSettingsDrawerToggle}>
            <Settings />
            Settings
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
          location={loca}
          locationChanged={loc => setLocation(loc)}
          getRendition={_rendition => {
            setRendition(_rendition)
            _rendition.on('started', () => setLoading(false))
          }}
          handleError={handleError}
          readerStyles={readerStyles}
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
              maxHeight: 'calc(100vh - 215px)',
              overflowY: 'auto',
              paddingLeft: '20px',
            }}>
            {filteredSelections.length > 0 ? (
              filteredSelections.map((note, i) => {
                const {
                  selectedText,
                  cfiRange,
                  content,
                  color,
                  createdAt,
                  noteId,
                } = note
                const isLastNote = i === filteredSelections.length - 1
                const isBookmarked = bookmarks.includes(cfiRange)
                return (
                  <div
                    key={noteId}
                    style={{
                      marginBottom: '15px',
                      paddingBottom: '10px',
                      paddingRight: '10px',
                      borderBottom: isLastNote ? 'none' : '1px solid #eee',
                    }}>
                    <div
                      style={{
                        backgroundColor: color,
                        padding: '7px',
                        borderRadius: '5px',
                        marginBottom: '7px',
                      }}>
                      <ExpandableText text={selectedText} maxLength={190} />
                    </div>
                    <ExpandableText text={content} maxLength={190} />
                    <Typography
                      variant='caption'
                      style={{
                        textAlign: 'right',
                        display: 'block',
                        marginTop: '7px',
                      }}>
                      {new Date(createdAt).toLocaleString()}
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
                      color='secondary'
                      style={{marginRight: '80px'}}>
                      Remove
                    </Button>
                    <IconButton
                      size='small'
                      onClick={() => handleEditNote(note)}
                      style={{marginRight: '5px'}}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      size='small'
                      onClick={() => handleToggleBookmark(cfiRange)}>
                      {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </div>
                )
              })
            ) : (
              <Typography variant='body1'>No notes found.</Typography>
            )}
          </div>
        </div>
      </Drawer>

      <Dialog open={Boolean(editingNote)} onClose={() => setEditingNote(null)}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Comment'
            fullWidth
            multiline
            rows={4}
            value={editingNote?.comment || ''}
            onChange={e =>
              setEditingNote({...editingNote, comment: e.target.value})
            }
          />
          <Select
            value={editingNote?.color || colors[0]}
            onChange={e =>
              setEditingNote({...editingNote, color: e.target.value})
            }
            fullWidth
            style={{marginTop: '10px'}}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingNote(null)}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
      <Drawer
        anchor='right'
        open={settingsDrawerOpen}
        onClose={handleSettingsDrawerToggle}>
        <div
          style={{
            width: 350,
            paddingTop: 15,
            paddingLeft: 25,
            paddingRight: 25,
          }}>
          <Typography variant='h6' gutterBottom style={{marginBottom: -5}}>
            Settings
          </Typography>
          <FormControl fullWidth margin='normal'>
            <Typography gutterBottom>Theme</Typography>
            <Select
              value={settings.theme}
              onChange={e => updateSettings('theme', e.target.value)}>
              {themes.map((t, index) => (
                <MenuItem key={index} value={t}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: t,
                      border: '1px solid #000',
                      display: 'inline-block',
                      marginRight: 10,
                      marginBottom: -5,
                    }}
                  />
                  {t === '#FFFFFF'
                    ? 'White'
                    : t === '#F5F5F5'
                    ? 'Light Gray'
                    : t === '#E0E0E0'
                    ? 'Gray'
                    : 'Dark'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <Typography gutterBottom style={{marginBottom: -5}}>
              Page View
            </Typography>
            <RadioGroup
              row
              value={settings.pageView}
              style={{marginBottom: -10}}
              onChange={e => updateSettings('pageView', e.target.value)}>
              <FormControlLabel
                value='single'
                control={<Radio />}
                label='Single'
              />
              <FormControlLabel
                value='double'
                control={<Radio />}
                label='Double'
              />
            </RadioGroup>
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <Typography gutterBottom>Font Family</Typography>
            <Select
              value={settings.fontFamily}
              onChange={e => updateSettings('fontFamily', e.target.value)}>
              {fontFamilies.map((font, index) => (
                <MenuItem key={index} value={font} style={{fontFamily: font}}>
                  {font}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <Typography gutterBottom>
              Font Size: {settings.fontSize}%
            </Typography>
            <Slider
              value={settings.fontSize}
              onChange={(_, newValue) => updateSettings('fontSize', newValue)}
              min={50}
              max={200}
              step={10}
            />
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <Typography gutterBottom>
              Font Weight: {settings.fontWeight}
            </Typography>
            <Slider
              value={settings.fontWeight}
              onChange={(_, newValue) => updateSettings('fontWeight', newValue)}
              min={100}
              max={900}
              step={100}
            />
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <Typography gutterBottom>
              Line Height: {settings.lineHeight}
            </Typography>
            <Slider
              value={settings.lineHeight}
              onChange={(_, newValue) => updateSettings('lineHeight', newValue)}
              min={1}
              max={3}
              step={0.1}
            />
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <Typography gutterBottom>Zoom: {settings.zoom}%</Typography>
            <Slider
              value={settings.zoom}
              onChange={(_, newValue) => updateSettings('zoom', newValue)}
              min={50}
              max={200}
              step={10}
            />
          </FormControl>
          <Button
            variant='contained'
            color='secondary'
            fullWidth
            onClick={handleResetSettings}
            style={{marginTop: 5}}>
            Reset Settings
          </Button>
        </div>
      </Drawer>
    </div>
  )
}

export default ReadBookScreen
