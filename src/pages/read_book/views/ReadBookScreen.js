import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {ReactReaderStyle} from 'react-reader'
import ePub from 'epubjs'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingNote, setEditingNote] = useState(null)
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false)
  const [settings, setSettings] = useState(defaultSettings)
  const [user, setUser] = useState(null)
  const [isNote, setIsNote] = useState(false)
  const [hasBookmark, setHasBookmark] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [readStartTime, setReadStartTime] = useState(null)
  const [bookmarkId, setBookmarkId] = useState(null)
  const [lastReadingUpdate, setLastReadingUpdate] = useState(null)
  const [isActive, setIsActive] = useState(true)
  const [activeHighlights] = useState(new Set())

  const startReadingSession = () => {
    setReadStartTime(Date.now())
  }

  const updateReadingHistory = async () => {
    const currentTime = Date.now()
    const timeSpent = Math.floor((currentTime - lastReadingUpdate) / 1000)
    if (!user || !bookId) return
    try {
      await axios.post(
        'http://localhost:8080/api/v1/reading-history',
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

  const saveBookmark = async location => {
    if (!user || !bookId) return

    try {
      await axios.post(
        'http://localhost:8080/api/v1/bookmark',
        {
          userId: user.userId,
          bookId: bookId,
          location: loca,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      setHasBookmark(true)
      toast.success('Đã lưu đánh dấu trang')
    } catch (error) {
      console.error('Error saving bookmark:', error)
      toast.error('Có lỗi xảy ra khi lưu đánh dấu trang', 'error')
    }
  }

  const getUser = async () => {
    if (!localStorage.getItem('token')) return
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
    if (!user?.userId || !bookId || !rendition) return
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/note/user/${user.userId}/book/${bookId}`,
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
      await axios.put(`http://localhost:8080/api/v1/note`, editingNote, {
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

  const getBookmark = async () => {
    if (!user || !bookId) return
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/bookmark/user/${user.userId}/book/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )

      if (response.data.data) {
        setHasBookmark(true)
        setBookmarkId(response.data.data.bookmarkId)
        setLocation(response.data.data.location)
      }
    } catch (error) {
      console.error('Error fetching bookmark:', error)
    }
  }

  const handleToggleBookmark = async () => {
    if (!user || !bookId) return

    if (hasBookmark && bookmarkId) {
      try {
        await axios.put(
          'http://localhost:8080/api/v1/bookmark',
          {
            bookmarkId: bookmarkId,
            userId: user.userId,
            bookId: bookId,
            location: loca,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )
        toast.success('Đã đánh dấu trang')
      } catch (error) {
        toast.error('Có lỗi xảy ra khi đánh dấu trang', 'error')
      }
    } else {
      await saveBookmark(currentLocation)
    }
  }

  const handleError = error => {
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
    const epubUrl = `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.epub`
    setEpubUrl(epubUrl)
    getUser()
  }, [bookId])

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
      getBookmark()
    }
  }, [user && bookId])

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
      await axios.delete(`http://localhost:8080/api/v1/note/${noteId}`, {
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
        hasBookmark={hasBookmark}
        currentLocation={currentLocation}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}

      <ReaderContent
        epubUrl={epubUrl}
        location={loca}
        onLocationChanged={loc => setLocation(loc)}
        onGetRendition={_rendition => {
          setRendition(_rendition)

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
