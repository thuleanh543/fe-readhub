import React, {useState, useEffect} from 'react'
import {
  BookOpen,
  Sparkles,
  Stars,
  LibraryBig,
  MessagesSquare,
  ThumbsUp,
  Wand2,
} from 'lucide-react'

const Banner = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Add scoped styles on component mount
  useEffect(() => {
    setIsVisible(true)

    // Create unique ID for scoped styles
    const styleId = 'banner-styles'

    // Only add styles if they don't already exist
    if (!document.getElementById(styleId)) {
      const styleSheet = document.createElement('style')
      styleSheet.id = styleId
      styleSheet.textContent = `
        @keyframes banner-pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.5); opacity: 0.8; }
        }
        
        .banner-sparkle {
          animation: banner-pulse 2s infinite;
        }
      `
      document.head.appendChild(styleSheet)
    }

    // Cleanup styles on unmount
    return () => {
      const existingStyle = document.getElementById(styleId)
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [])

  return (
    <div className='relative w-full h-[320px] bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 overflow-hidden'>
      {/* Gradient overlays */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/10 to-transparent' />
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent' />

      {/* Sparkles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className='banner-sparkle absolute w-1.5 h-1.5 bg-white/20 rounded-full'
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Main content */}
      <div
        className={`relative h-full max-w-6xl mx-auto px-8 flex items-center justify-between transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
        {/* Left section */}
        <div className='w-2/5'>
          <div className='flex items-center space-x-4 mb-6 group'>
            <div className='relative'>
              <BookOpen
                size={48}
                className='text-yellow-300 transition-transform duration-300 group-hover:scale-110'
              />
              <Sparkles
                size={20}
                className='absolute -top-2 -right-2 text-yellow-200'
              />
              <Stars
                size={16}
                className='absolute -bottom-2 -left-2 text-yellow-200'
              />
            </div>
            <h1 className='text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300'>
              ReadHub
            </h1>
          </div>

          <h2 className='text-3xl font-semibold text-white mb-6 leading-tight'>
            Your Personal Reading Universe
          </h2>

          <div className='flex items-center space-x-3 text-white/90'>
            <Stars className='text-yellow-300' />
            <span>Join our community of passionate readers</span>
          </div>
        </div>

        {/* Right section - Features */}
        <div className='w-1/2 grid grid-cols-2 gap-6'>
          {[
            {
              title: 'Personal Library',
              desc: 'Organize and track your reading journey',
              color: 'text-emerald-300',
              icon: <LibraryBig className='w-6 h-6' />,
            },
            {
              title: 'Smart Recommendations',
              desc: 'AI-powered book suggestions',
              color: 'text-blue-300',
              icon: <Wand2 className='w-6 h-6' />,
            },
            {
              title: "Reader's Forum",
              desc: 'Discuss books with community',
              color: 'text-violet-300',
              icon: <MessagesSquare className='w-6 h-6' />,
            },
            {
              title: 'Book Reviews',
              desc: 'Share your reading experience',
              color: 'text-pink-300',
              icon: <ThumbsUp className='w-6 h-6' />,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className='group relative p-4 rounded-xl bg-white/10 backdrop-blur-sm 
                hover:bg-white/20 transition-all duration-300
                transform hover:scale-105 hover:-translate-y-1'>
              <div
                className={`${feature.color} mb-3 transition-transform duration-300 group-hover:scale-110`}>
                {feature.icon}
              </div>

              <h3 className='text-lg font-semibold text-white mb-2 group-hover:text-yellow-200 transition-colors'>
                {feature.title}
              </h3>
              <p className='text-sm text-white/80 group-hover:text-white/90'>
                {feature.desc}
              </p>

              <div className='absolute inset-0 border border-white/20 rounded-xl group-hover:border-white/40 transition-colors' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Banner
