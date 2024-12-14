import React, { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import debounce from 'lodash/debounce'

const SearchComponent = ({ onSearchChange, initialSearchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(initialSearchTerm || {
    title: '',
    author: null,
    subjects: null,
    bookshelves: null,
    languages: null,
  })
  
  const inputRef = useRef(null)

  // Tạo debounced function với useCallback để tránh tạo lại
  const debouncedSearch = useRef(
    debounce((searchValue) => {
      requestAnimationFrame(() => {
        onSearchChange(searchValue)
        // Focus lại input sau khi search
        if (inputRef.current) {
          inputRef.current.focus()
        }
      })
    }, 300)
  ).current

  // Giữ focus cho input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleChange = (e) => {
    const newSearchTerm = {
      ...localSearchTerm,
      title: e.target.value
    }
    setLocalSearchTerm(newSearchTerm)
    debouncedSearch(newSearchTerm)
  }

  const clearSearch = (e) => {
    e.stopPropagation()
    const emptySearchTerm = {
      title: '',
      author: null,
      subjects: null,
      bookshelves: null,
      languages: null,
    }
    setLocalSearchTerm(emptySearchTerm)
    debouncedSearch.cancel()
    requestAnimationFrame(() => {
      onSearchChange(emptySearchTerm)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    })
  }

  // Cleanup
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  return (
    <div className='relative'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5' />
      <input
        ref={inputRef}
        type='text'
        autoFocus
        placeholder='Search books, authors, or keywords...'
        value={localSearchTerm?.title}
        onChange={handleChange}
        className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
      />
      {localSearchTerm?.title && (
        <button
          type="button"
          onClick={clearSearch}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
        >
          <X className='h-5 w-5' />
        </button>
      )}
    </div>
  )
}

export default SearchComponent