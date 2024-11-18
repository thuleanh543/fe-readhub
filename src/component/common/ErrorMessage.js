const ErrorMessage = ({error}) => {
  return (
    <div className='py-10'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='text-center p-8 rounded-lg bg-red-50 border border-red-100'>
          <div className='flex items-center justify-center space-x-2 mb-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-red-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <h3 className='text-lg font-medium text-red-800'>
              Failed to load books
            </h3>
          </div>
          <p className='text-red-600 mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage
