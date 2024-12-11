import React, {useState} from 'react'
import {
  IconButton,
  Avatar,
  Drawer,
  Tabs,
  Tab,
  Box,
  TextField,
  Select,
  MenuItem,
  Divider,
  Button,
} from '@mui/material'
import {
  ArrowBack,
  BookmarkBorder,
  Bookmark,
  ViewListRounded,
  Settings,
  Person,
  AutoStories,
  Logout,
  Edit,
} from '@mui/icons-material'
import ExpandableText from './ExpandableText'

function TabPanel({children, value, index}) {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      className='h-[calc(100vh-48px)] overflow-hidden'>
      {value === index && children}
    </div>
  )
}

const NotesDrawer = ({...props}) => {
  const [tabValue, setTabValue] = useState(0)

  return (
    <Drawer
      anchor='right'
      open={props.open}
      onClose={props.onClose}
      PaperProps={{
        sx: {
          width: 350,
          bgcolor: '#FFFFFF',
          boxShadow: '0 0 15px rgba(0,0,0,0.1)',
        },
      }}>
      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        variant='fullWidth'
        sx={{
          borderBottom: '1px solid #E5E7EB',
          '& .MuiTab-root': {
            color: '#6B7280',
            textTransform: 'none',
            fontSize: '15px',
            '&.Mui-selected': {
              color: '#111827',
            },
          },
          '& .MuiTabs-indicator': {
            bgcolor: '#111827',
          },
        }}>
        <Tab label='Notes & Highlights' />
        <Tab label='Bookmarks' />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <div className='p-5'>
          <TextField
            label='Search notes'
            value={props.searchTerm}
            onChange={e => props.setSearchTerm(e.target.value)}
            fullWidth
            size='small'
            sx={{
              marginBottom: '12px',
              '& .MuiOutlinedInput-root': {
                color: '#111827',
                '& fieldset': {
                  borderColor: '#E5E7EB',
                },
                '&:hover fieldset': {
                  borderColor: '#9CA3AF',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#6B7280',
              },
            }}
          />
          <Select
            value={props.filter}
            onChange={e => props.setFilter(e.target.value)}
            fullWidth
            size='small'
            sx={{
              marginBottom: '12px',
              color: '#111827',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: '#E5E7EB',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9CA3AF',
              },
              '.MuiSvgIcon-root': {
                color: '#111827',
              },
            }}>
            <MenuItem value='all'>All Colors</MenuItem>
            {props.colors.map((color, index) => (
              <MenuItem key={index} value={color}>
                <span
                  style={{
                    backgroundColor: color,
                    padding: '2px 10px',
                    borderRadius: '4px',
                    color,
                  }}>
                  Colorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
                </span>
              </MenuItem>
            ))}
          </Select>
        </div>
        <Divider sx={{borderColor: '#E5E7EB'}} />
        <div className='overflow-y-auto h-[calc(100%-132px)] px-5'>
          {props.filteredSelections.length > 0 ? (
            props.filteredSelections.map(note => (
              <div
                key={note.noteId}
                className='py-4 border-b border-gray-100 last:border-0'>
                <div
                  style={{backgroundColor: note.color}}
                  className='p-2 rounded mb-2'>
                  <ExpandableText text={note.selectedText} maxLength={190} />
                </div>
                {note.content && (
                  <div className='text-gray-700 text-sm mb-2'>
                    <ExpandableText text={note.content} maxLength={190} />
                  </div>
                )}
                <div className='text-xs text-gray-500 text-right mb-2'>
                  {new Date(note.createdAt).toLocaleString()}
                </div>
                <div className='flex justify-between items-center'>
                  <div className='space-x-2'>
                    <Button
                      size='small'
                      onClick={() => props.rendition.display(note.cfiRange)}
                      variant='outlined'
                      sx={{
                        color: '#111827',
                        borderColor: '#E5E7EB',
                        '&:hover': {
                          borderColor: '#9CA3AF',
                          bgcolor: 'rgba(0,0,0,0.04)',
                        },
                      }}>
                      Show
                    </Button>
                    <Button
                      size='small'
                      onClick={() =>
                        props.onRemoveHighlight(note.cfiRange, note.noteId)
                      }
                      variant='outlined'
                      color='error'
                      sx={{
                        borderColor: '#FCA5A5',
                        '&:hover': {
                          bgcolor: 'rgba(239,68,68,0.04)',
                          borderColor: '#EF4444',
                        },
                      }}>
                      Remove
                    </Button>
                  </div>
                  <IconButton
                    size='small'
                    onClick={() => props.onEditNote(note)}
                    sx={{color: '#111827'}}>
                    <Edit fontSize='small' />
                  </IconButton>
                </div>
              </div>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center h-full text-gray-400'>
              <ViewListRounded
                sx={{fontSize: 40, marginBottom: 2, opacity: 0.5}}
              />
              <p>No notes found</p>
            </div>
          )}
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <div className='h-full flex flex-col'>
          <div className='p-5'>
            <TextField
              placeholder='Search bookmarks'
              size='small'
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#111827',
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9CA3AF',
                  },
                },
              }}
            />
          </div>
          <Divider sx={{borderColor: '#E5E7EB'}} />
          <div className='flex-1 overflow-y-auto px-5'>
            {props.bookmarks?.length > 0 ? (
              <div className='divide-y divide-gray-100'>
                {props.bookmarks?.map(bookmark => (
                  <div key={bookmark.id} className='py-4'>
                    <div className='mb-3'>
                      <div className='text-gray-600 text-sm line-clamp-2'>
                        {bookmark?.text}
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <Button
                        size='small'
                        onClick={() => props.onShowBookmark(bookmark.location)}
                        variant='outlined'
                        sx={{
                          color: '#111827',
                          borderColor: '#E5E7EB',
                          '&:hover': {
                            borderColor: '#9CA3AF',
                            bgcolor: 'rgba(0,0,0,0.04)',
                          },
                        }}>
                        Go to page
                      </Button>
                      <div className='flex items-center gap-3'>
                        <span className='text-xs text-gray-500'>
                          {new Date(bookmark.createdAt).toLocaleString()}
                        </span>
                        <IconButton
                          size='small'
                          onClick={() => props.onRemoveBookmark(bookmark.bookmarkId)}
                          sx={{
                            color: '#EF4444',
                            padding: '4px',
                            '&:hover': {
                              bgcolor: 'rgba(239,68,68,0.04)',
                            },
                          }}>
                          <Bookmark fontSize='small' />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                <Bookmark sx={{fontSize: 40, marginBottom: 2, opacity: 0.5}} />
                <p>No bookmarks yet</p>
              </div>
            )}
          </div>
        </div>
      </TabPanel>
    </Drawer>
  )
}
export default NotesDrawer
