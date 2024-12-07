// SearchComponent.jsx
import React, {useState, useRef, useCallback} from 'react'
import {Search, X} from 'lucide-react'
import {useEffect} from 'react'

const SearchComponent = ({onSearchChange, initialSearchTerm = ''}) => {
  // Local state to handle immediate input changes
  const [localSearchTerm, setLocalSearchTerm] = useState(initialSearchTerm)
  const inputRef = useRef(null)

  // A single useEffect that handles both search updates and focus management
  useEffect(() => {
    // Update the parent with the search term
    onSearchChange?.(localSearchTerm)
    // Immediately restore focus after the update
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Clean up the timer on component updates or unmount
  }, [localSearchTerm, onSearchChange])

  // Simple handlers that don't include debouncing logic
  const handleChange = e => {
    setLocalSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setLocalSearchTerm('')
    onSearchChange?.('')
    inputRef.current?.focus()
  }

  return (
    <div className='relative'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5' />
      <input
        ref={inputRef}
        type='text'
        placeholder='Search books, authors, or keywords...'
        value={localSearchTerm}
        onChange={handleChange}
        className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
      />
      {localSearchTerm && (
        <button
          onClick={clearSearch}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
          <X className='h-5 w-5' />
        </button>
      )}
    </div>
  )
}

export default React.memo(SearchComponent)
