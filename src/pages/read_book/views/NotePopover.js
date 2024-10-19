import React from 'react'
import {Popover, TextField, Button} from '@mui/material'

const NotePopover = ({
  anchorPosition,
  open,
  onClose,
  colors,
  highlightColor,
  setHighlightColor,
  comment,
  setComment,
  onSave,
}) => (
  <Popover
    open={open}
    anchorReference='anchorPosition'
    anchorPosition={anchorPosition}
    onClose={onClose}
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
        onClick={onSave}
        disabled={!comment}
        color='primary'
        variant='contained'>
        Save
      </Button>
    </div>
  </Popover>
)
export default NotePopover
