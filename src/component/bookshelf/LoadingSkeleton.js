const LoadingSkeleton = () => {
  return (
    <>
      {/* Lặp lại 3 lần cho 3 sections */}
      {[...Array(3)].map((_, sectionIndex) => (
        <div key={sectionIndex} className='py-10'>
          <div className='max-w-7xl mx-auto px-4'>
            <div className='flex items-center space-x-3 mb-8'>
              {/* Title skeleton */}
              <div className='h-8 w-1 rounded-full bg-gray-200 animate-pulse' />
              <div className='h-6 w-48 bg-gray-200 rounded animate-pulse' />
            </div>

            {/* Books row */}
            <div className='relative px-11 flex space-x-8'>
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className='group relative animate-pulse'
                  style={{
                    width: '200px',
                    margin: '0 18px',
                  }}>
                  {/* Book cover skeleton */}
                  <div
                    className='relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-200 shadow-lg'
                    style={{height: '290px'}}
                  />
                  {/* Book info skeleton */}
                  <div className='mt-4 p-3'>
                    <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2' />
                    <div className='h-3 bg-gray-200 rounded w-1/2 mx-auto' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default LoadingSkeleton
