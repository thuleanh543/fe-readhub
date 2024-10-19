import React from 'react'
import {
  Drawer,
  Typography,
  TextField,
  Select,
  MenuItem,
  Divider,
  Button,
  IconButton,
} from '@mui/material'
import {Edit} from '@mui/icons-material'
import ExpandableText from './ExpandableText'

const NotesDrawer = ({
  open,
  onClose,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  colors,
  filteredSelections,
  rendition,
  onRemoveHighlight,
  onEditNote,
  bookmarks,
  handleEditNote,
}) => (
  <Drawer anchor='right' open={open} onClose={onClose}>
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
            const {selectedText, cfiRange, content, color, createdAt, noteId} =
              note
            const isLastNote = i === filteredSelections.length - 1
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
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <div>
                    <Button
                      size='small'
                      onClick={() => rendition.display(cfiRange)}
                      style={{marginRight: '5px'}}
                      variant='outlined'>
                      Show
                    </Button>
                    <Button
                      size='small'
                      onClick={() => onRemoveHighlight(cfiRange, noteId)}
                      variant='outlined'
                      color='secondary'>
                      Remove
                    </Button>
                  </div>
                  <IconButton
                    size='small'
                    onClick={() => onEditNote(note)}
                    style={{marginRight: '5px'}}>
                    <Edit />
                  </IconButton>
                </div>
              </div>
            )
          })
        ) : (
          <Typography variant='body1'>No notes found.</Typography>
        )}
      </div>
    </div>
  </Drawer>
)
export default NotesDrawer
