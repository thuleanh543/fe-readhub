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

  useEffect(() => {
    setIsVisible(true)

    const styleId = 'banner-styles'
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

    return () => {
      const existingStyle = document.getElementById(styleId)
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [])

  const features = [
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
  ]

  return (
    <div className='relative w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 overflow-hidden'>
      {/* Background Effects */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/10 to-transparent' />
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent' />

      {/* Sparkles - Hidden on mobile */}
      <div className='hidden md:block'>
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
      </div>

      {/* Main content */}
      <div
        className={`relative min-h-[280px] md:h-[320px] max-w-6xl mx-auto px-4 md:px-8 
                    flex flex-col md:flex-row items-center md:justify-between 
                    transition-all duration-1000 py-8 md:py-0
                    ${
                      isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'
                    }`}>
        {/* Left section */}
        <div className='w-full md:w-2/5 text-center md:text-left mb-8 md:mb-0'>
          <div className='flex items-center space-x-4 mb-6 group justify-center md:justify-start'>
            <div className='relative'>
              <BookOpen
                size={36}
                className='text-yellow-300 transition-transform duration-300 group-hover:scale-110 md:w-12 md:h-12'
              />
              <Sparkles
                size={16}
                className='absolute -top-2 -right-2 text-yellow-200 md:w-5 md:h-5'
              />
              <Stars
                size={14}
                className='absolute -bottom-2 -left-2 text-yellow-200 md:w-4 md:h-4'
              />
            </div>
            <h1 className='text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300'>
              ReadHub
            </h1>
          </div>

          <h2 className='text-2xl md:text-3xl font-semibold text-white mb-4 md:mb-6 leading-tight'>
            Your Personal Reading Universe
          </h2>

          <div className='flex items-center space-x-3 text-white/90 justify-center md:justify-start'>
            <Stars className='text-yellow-300' />
            <span className='text-sm md:text-base'>
              Join our community of readers
            </span>
          </div>
        </div>

        {/* Right section - Features */}
        <div className='w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 px-4 md:px-0'>
          {features.map((feature, i) => (
            <div
              key={i}
              className='group relative p-3 md:p-4 rounded-xl bg-white/10 backdrop-blur-sm 
                       hover:bg-white/20 transition-all duration-300
                       transform hover:scale-105 hover:-translate-y-1'>
              <div className='flex items-center md:block'>
                <div
                  className={`${feature.color} mr-3 md:mr-0 md:mb-3 transition-transform duration-300 group-hover:scale-110`}>
                  {feature.icon}
                </div>

                <div className='flex-1 md:flex-none'>
                  <h3 className='text-base md:text-lg font-semibold text-white md:mb-2 group-hover:text-yellow-200 transition-colors'>
                    {feature.title}
                  </h3>
                  <p className='hidden md:block text-sm text-white/80 group-hover:text-white/90'>
                    {feature.desc}
                  </p>
                </div>
              </div>

              <div className='absolute inset-0 border border-white/20 rounded-xl group-hover:border-white/40 transition-colors' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Banner
