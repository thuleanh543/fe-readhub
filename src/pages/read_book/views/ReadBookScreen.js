import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {ReactReaderStyle} from 'react-reader'
import ReaderHeader from './ReaderHeader'
import ReaderContent from './ReaderContent'
import NotePopover from './NotePopover'
import NotesDrawer from './NotesDrawer'
import SettingsDrawer from './SettingsDrawer'
import {
  Button,
  Select,
  MenuItem,
  TextField,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import axios from 'axios'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useBookmarks } from '../useBookmarks'
import { useUser } from '../../../contexts/UserProvider'

const colors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF']
const themes = ['#FFFFFF', '#faf6ed', '#121212']
const fontFamilies = ['Times New Roman', 'Arial', 'Georgia', 'Verdana']
const defaultSettings = {
  theme: themes[0],
  pageView: 'double',
  fontFamily: fontFamilies[0],
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.2,
  zoom: 100,
}

function ReadBookScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loca, setLocation] = useState(location || '')
  const {bookId, bookTitle, ebook} = location.state || {}
  const {user} = useUser()
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks(
    user?.userId,
    bookId
  );
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
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingNote, setEditingNote] = useState(null)
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false)
  const [settings, setSettings] = useState(defaultSettings)
  const [isNote, setIsNote] = useState(false)
  const [readStartTime, setReadStartTime] = useState(null)
  const [bookmarkId, setBookmarkId] = useState(null)
  const [lastReadingUpdate, setLastReadingUpdate] = useState(null)
  const [isActive, setIsActive] = useState(true)
  const [activeHighlights] = useState(new Set())
  const [currentLocation, setCurrentLocation] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const startReadingSession = () => {
    setReadStartTime(Date.now())
  }

  const updateReadingHistory = async () => {
    const currentTime = Date.now()
    const timeSpent = Math.floor((currentTime - lastReadingUpdate) / 1000)
    if (!user || !bookId) return
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/reading-history`,
        {
          userId: user.userId,
          bookId: bookId,
          timeSpent: timeSpent,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      setLastReadingUpdate(currentTime)
    } catch (error) {
      console.error('Error updating reading history:', error)
    }
  }


  const getNotes = async () => {
    if (!user?.userId || !bookId || !rendition) return
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/note/user/${user.userId}/book/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )

      const notesData = Array.isArray(response.data.data)
        ? response.data.data
        : []
      setSelections(notesData)
    } catch (error) {
      console.error('Error fetching notes:', error)
      setSelections([])
    }
  }

  const handleEditNote = note => {
    setEditingNote(note)
  }

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/note`, editingNote, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (editingNote) {
        setSelections(
          selections.map(s =>
            s.cfiRange === editingNote.cfiRange ? editingNote : s,
          ),
        )

        // Xóa highlight cũ
        rendition.annotations.remove(editingNote.cfiRange, 'highlight')
        activeHighlights.delete(editingNote.cfiRange)

        // Tạo highlight mới với màu đã cập nhật
        rendition.annotations.add(
          'highlight',
          editingNote.cfiRange,
          {},
          null,
          'hl',
          {
            fill: editingNote.color,
            'fill-opacity': '0.3',
            'mix-blend-mode': 'multiply',
          },
        )
        activeHighlights.add(editingNote.cfiRange)

        setIsNote(!isNote)
        setEditingNote(null) // Đóng dialog
      }
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }



  const handleToggleBookmark = async (value, isRemove) => {
    if (!user) {
      toast.error("Please login to bookmark");
      return;
    }

    try {
      if (isRemove) {
        await removeBookmark(value); // value is bookmarkId
        toast.success("Bookmark removed");
      } else {
        await addBookmark(currentLocation); // value is location
        toast.success("Bookmark added");
      }
    } catch (error) {
      toast.error("Failed to update bookmark");
    }
  };

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
      // Xóa toàn bộ highlight hiện tại trước
      activeHighlights.forEach(cfiRange => {
        rendition.annotations.remove(cfiRange, 'highlight')
      })
      activeHighlights.clear()

      // Apply settings mới
      rendition.themes.default({
        body: {
          background: settings.theme,
          color: settings.theme === '#121212' ? '#FFFFFF' : '#000000',
          'font-family':
            settings.fontFamily === 'Default' ? 'inherit' : settings.fontFamily,
          'font-size': `${settings.fontSize}px`,
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

      // Apply lại highlight sau khi settings đã được cập nhật
      setTimeout(() => {
        selections.forEach(note => {
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
          activeHighlights.add(note.cfiRange)
        })
      }, 50)
    }
  }

  const updateSettings = (key, value) => {
    setSettings(prev => ({...prev, [key]: value}))

    if (['fontSize', 'fontWeight', 'lineHeight', 'zoom'].includes(key)) {
      rendition.clear()
      rendition.themes.default({
        body: {
          background: settings.theme,
          color: settings.theme === '#121212' ? '#FFFFFF' : '#000000',
          'font-family': settings.fontFamily,
          'font-size': `${value}px`,
          'font-weight': key === 'fontWeight' ? value : settings.fontWeight,
          'line-height': key === 'lineHeight' ? value : settings.lineHeight,
          transform:
            key === 'zoom'
              ? `scale(${value / 100})`
              : `scale(${settings.zoom / 100})`,
          'transform-origin': 'top left',
        },
      })
      rendition.display(loca)
    }
  }

  const handleResetSettings = () => {
    setSettings(defaultSettings)
  }

  // Event Listeners and Effect Hooks
  useEffect(() => {
    applySettings()
  }, [settings])

  useEffect(() => {
    if (user?.userId && bookId) {
      setLastReadingUpdate(Date.now())
      setIsActive(true)

      const intervalId = setInterval(() => {
        if (isActive) {
          updateReadingHistory()
        }
      }, 5 * 60 * 1000)

      return () => {
        updateReadingHistory()
        clearInterval(intervalId)
      }
    }
  }, [user, bookId])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsActive(false)
        updateReadingHistory()
      } else {
        setIsActive(true)
        setLastReadingUpdate(Date.now())
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    setEpubUrl(ebook)
  }, [ebook, bookId])

  useEffect(() => {
    const handleBeforeUnload = () => {
      updateReadingHistory()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])


  useEffect(() => {
    if (user && bookId) {
      getNotes()
    }
  }, [user, bookId, rendition, isNote])

  useEffect(() => {
    if (rendition) {
      const handleSelection = (cfiRange, contents) => {
        const selection = contents.window.getSelection()
        const text = selection.toString().trim() // Lấy text và trim luôn

        // Chỉ xử lý khi có text thật sự
        if (text) {
          const range = selection.getRangeAt(0)
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
          background: 'rgba(0, 0, 255, 0.1)',
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

      return () => {
        rendition.off('selected', handleSelection)
      }
    }
  }, [rendition])

  // Highlight Management
  useEffect(() => {
    if (rendition) {
      const applyHighlight = note => {
        if (!activeHighlights.has(note.cfiRange)) {
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
              'white-space': 'pre-wrap', // Giữ nguyên khoảng trắng
              'box-decoration-break': 'clone', // Đảm bảo highlight không vượt quá text
            },
          )
          activeHighlights.add(note.cfiRange)
        }
      }

      const removeHighlight = cfiRange => {
        rendition.annotations.remove(cfiRange, 'highlight')
        activeHighlights.delete(cfiRange)
      }

      const refreshHighlights = () => {
        // Xóa những highlight không còn trong selections
        for (const cfiRange of activeHighlights) {
          if (!selections.some(note => note.cfiRange === cfiRange)) {
            removeHighlight(cfiRange)
          }
        }

        // Thêm những highlight mới
        selections.forEach(note => {
          if (!activeHighlights.has(note.cfiRange)) {
            applyHighlight(note)
          }
        })
      }

      refreshHighlights()

      // Handler cho việc di chuyển trang
      const handleRelocated = () => {
        selections.forEach(note => {
          if (!activeHighlights.has(note.cfiRange)) {
            applyHighlight(note)
          }
        })
      }

      rendition.on('relocated', handleRelocated)

      return () => {
        rendition.off('relocated', handleRelocated)
        // Không xóa highlights khi unmount để tránh việc phải render lại
      }
    }
  }, [rendition, selections])

  const handleSave = async () => {
    if (selectedCfiRange) {
      const newNote = {
        userId: user.userId,
        bookId: bookId,
        content: comment || '',
        selectedText: selectedText,
        cfiRange: selectedCfiRange,
        color: highlightColor,
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/note`,
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
        setPopoverAnchor(null)
        setComment('')
        setSelectedText('')
        setSelectedCfiRange('')
        setIsNote(!isNote)
      } catch (error) {
        console.error('Error creating note:', error)
      }
    }
  }

  const handleRemoveHighlight = async (cfiRange, noteId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/note/${noteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      // Xóa highlight cụ thể
      rendition.annotations.remove(cfiRange, 'highlight')
      activeHighlights.delete(cfiRange)

      // Cập nhật state
      setSelections(selections.filter(s => s.cfiRange !== cfiRange))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
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
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
      <ReaderHeader
        title={bookTitle}
        onBack={() => navigate(-1)}
        onToggleNotes={handleToggleDrawer}
        onToggleSettings={handleSettingsDrawerToggle}
        user={user}
        onToggleBookmark={handleToggleBookmark}
        hasBookmark={bookmarks.some(b => b.location === currentLocation)}
        currentLocation={currentLocation}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}

      <ReaderContent
        epubUrl={epubUrl}
        location={loca}
        totalPages={totalPages}
        onLocationChanged={loc => {setLocation(loc);
          setCurrentLocation(loc)}
        }
        onGetRendition={_rendition => {
          setRendition(_rendition)

          _rendition.book.ready.then(() => {
            const totalPagesCount = _rendition.book.locations.length();
            setTotalPages(totalPagesCount);
          });

          // Apply default settings ngay khi rendition được tạo
          _rendition.themes.default({
            body: {
              background: defaultSettings.theme,
              color:
                defaultSettings.theme === '#121212' ? '#FFFFFF' : '#000000',
              'font-family': defaultSettings.fontFamily,
              'font-size': `${defaultSettings.fontSize}px`,
              'font-weight': defaultSettings.fontWeight,
              'line-height': defaultSettings.lineHeight,
              transform: `scale(${defaultSettings.zoom / 100})`,
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

          _rendition.themes.select('default')

          if (defaultSettings.pageView === 'double') {
            _rendition.spread('auto')
          } else {
            _rendition.spread('none')
          }

          _rendition.on('started', () => setLoading(false))
        }}
        onError={handleError}
        readerStyles={readerStyles}
      />
      <NotePopover
        anchorPosition={popoverAnchor}
        open={Boolean(popoverAnchor)}
        onClose={() => setPopoverAnchor(null)}
        colors={colors}
        highlightColor={highlightColor}
        setHighlightColor={setHighlightColor}
        comment={comment}
        setComment={setComment}
        onSave={handleSave}
      />

      <NotesDrawer
        open={drawerOpen}
        onClose={handleToggleDrawer}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
        bookmarks={bookmarks}
        onShowBookmark={(location) => {
          rendition.display(location);
        }}
        onRemoveBookmark={removeBookmark}
        colors={colors}
        filteredSelections={filteredSelections}
        rendition={rendition}
        onRemoveHighlight={handleRemoveHighlight}
        onEditNote={handleEditNote}
      />

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
            value={editingNote?.content || ''}
            onChange={e =>
              setEditingNote({...editingNote, content: e.target.value})
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
          <Button
            color='primary'
            variant='contained'
            disabled={
              !editingNote ||
              (selections.find(note => note.noteId === editingNote.noteId)
                ?.content === editingNote.content &&
                selections.find(note => note.noteId === editingNote.noteId)
                  ?.color === editingNote.color)
            }
            onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <SettingsDrawer
        open={settingsDrawerOpen}
        onClose={handleSettingsDrawerToggle}
        settings={settings}
        updateSettings={updateSettings}
        themes={themes}
        fontFamilies={fontFamilies}
        onResetSettings={handleResetSettings}
      />
    </div>
  )
}

export default ReadBookScreen
