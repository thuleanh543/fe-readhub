import React, {useState, useRef, useEffect} from 'react'
import {ListBook} from '../../pages'
import {Search, SlidersHorizontal, X, Check} from 'lucide-react'
import HeaderComponent from '../../component/header/HeaderComponent'
import {languages, subjects} from '../../constants/searchData'

const MultiSelect = ({value, onChange, options, placeholder}) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  return (
    <div className='relative' ref={wrapperRef}>
      <div
        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer flex justify-between items-center'
        onClick={() => setIsOpen(!isOpen)}>
        <span className='truncate'>
          {value.length ? `${value.length} selected` : placeholder}
        </span>
        <span className='transform transition-transform duration-200'>
          {isOpen ? '▲' : '▼'}
        </span>
      </div>

      {isOpen && (
        <div className='absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto'>
          {options.map(option => (
            <div
              key={option.value}
              className='flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer'
              onClick={() => {
                onChange(
                  value.includes(option.value)
                    ? value.filter(v => v !== option.value)
                    : [...value, option.value],
                )
              }}>
              <div className='w-5 h-5 border border-gray-300 rounded mr-3 flex items-center justify-center'>
                {value.includes(option.value) && (
                  <Check className='w-4 h-4 text-blue-600' />
                )}
              </div>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SearchResult = () => {
  const [searchParams, setSearchParams] = useState({
    title: '',
    author: '',
    subjects: [], // Changed to array for multiple selection
    language: '',
  })

  const [showResults, setShowResults] = useState(false)
  const [finalSearchTerm, setFinalSearchTerm] = useState('')
  const [isFilterExpanded, setIsFilterExpanded] = useState(true)
  const windowSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  const handleSearch = e => {
    e.preventDefault()
    const terms = []

    if (searchParams.title) terms.push(searchParams.title)

    // Add author to baseQuery if it exists
    if (searchParams.author) {
      if (terms.length > 0) {
        terms.push(`%20${searchParams.author}`)
      } else {
        terms.push(searchParams.author)
      }
    }

    // Join multiple subjects with commas
    const subjectsQuery =
      searchParams.subjects.length > 0
        ? `&topic=${searchParams.subjects.join(',')}`
        : ''

    // Add language if selected
    const languageQuery =
      searchParams.language.length > 0
        ? `&languages=${searchParams.language}`
        : ''

    const baseQuery = terms.join('')
    const finalQuery = `${baseQuery}${subjectsQuery}${languageQuery}`

    if (finalQuery.trim()) {
      setFinalSearchTerm(finalQuery)
      setShowResults(true)
    }
  }

  const clearSearch = () => {
    setSearchParams({
      title: '',
      author: '',
      subjects: [],
      language: '',
    })
    setFinalSearchTerm('')
    setShowResults(false)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <HeaderComponent
        windowSize={windowSize}
        centerContent={''}
        showSearch={false}
      />

      <div className='pt-20 px-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white rounded-xl shadow-lg mb-8 overflow-hidden'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>
                  Advanced Search
                </h2>
                <button
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                  className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                  <SlidersHorizontal className='w-5 h-5 text-gray-600' />
                </button>
              </div>

              <form
                onSubmit={handleSearch}
                className={`${isFilterExpanded ? 'block' : 'hidden'}`}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Title */}
                  <div className='col-span-full'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Title
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        value={searchParams.title}
                        onChange={e =>
                          setSearchParams({
                            ...searchParams,
                            title: e.target.value,
                          })
                        }
                        placeholder='Search by book title...'
                        className='w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      />
                      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                      {searchParams.title && (
                        <button
                          type='button'
                          onClick={() =>
                            setSearchParams({...searchParams, title: ''})
                          }
                          className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                          <X className='w-5 h-5' />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Author */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Author
                    </label>
                    <input
                      type='text'
                      value={searchParams.author}
                      onChange={e =>
                        setSearchParams({
                          ...searchParams,
                          author: e.target.value,
                        })
                      }
                      placeholder='Author name...'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>

                  {/* Language */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Language
                    </label>
                    <MultiSelect
                      value={searchParams.language}
                      onChange={newLanguage =>
                        setSearchParams({
                          ...searchParams,
                          language: newLanguage,
                        })
                      }
                      options={languages}
                      placeholder='Any language'
                    />
                  </div>

                  {/* Subject with Multiple Select */}
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Subjects
                    </label>
                    <MultiSelect
                      value={searchParams.subjects}
                      onChange={newSubjects =>
                        setSearchParams({
                          ...searchParams,
                          subjects: newSubjects,
                        })
                      }
                      options={subjects}
                      placeholder='Any subject'
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='mt-8 flex justify-end space-x-4'>
                  <button
                    type='button'
                    onClick={clearSearch}
                    className='px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
                    Clear
                  </button>
                  <button
                    type='submit'
                    className='px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                    Search Books
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Results Section */}
          {showResults && finalSearchTerm && (
            <div className='mt-6'>
              <ListBook searchTerm={finalSearchTerm} windowSize={windowSize} />
            </div>
          )}

          {/* No Search Yet Message */}
          {!showResults && (
            <div className='text-center py-16'>
              <h3 className='text-xl text-gray-600'>
                Use the filters above to search for books
              </h3>
              <p className='mt-2 text-gray-500'>
                You can search by title, author, subject, or language
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchResult
