import React, {useState} from 'react'
import {Typography, Button} from '@mui/material'

const ExpandableText = ({text, maxLength = 400}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (text.length <= maxLength) {
    return <Typography variant='body2'>{text}</Typography>
  }

  return (
    <>
      <Typography variant='body2'>
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </Typography>
      <Button
        size='small'
        onClick={() => setIsExpanded(!isExpanded)}
        style={{padding: '0', minWidth: 'auto', textTransform: 'none'}}>
        {isExpanded ? 'See less' : 'See more'}
      </Button>
    </>
  )
}

export default ExpandableText
