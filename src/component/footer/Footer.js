import React from 'react'
import {Mail, Phone, Facebook, Twitter, Instagram} from 'lucide-react'

const Footer = () => {
  const socialLinks = [
    {icon: Facebook, label: 'Facebook', url: '#'},
    {icon: Twitter, label: 'Twitter', url: '#'},
    {icon: Instagram, label: 'Instagram', url: '#'},
  ]

  return (
    <footer className='bg-[#1a1a1a] text-gray-300 py-8 md:py-16'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16'>
          {/* Company Info */}
          <div className='text-center sm:text-left'>
            <h3 className='text-2xl md:text-[28px] font-bold text-[#4477ff] mb-4'>
              ReadHub
            </h3>
            <p className='text-gray-400 text-sm md:text-base mb-6'>
              ReadHub Electronic Book Joint Stock Company
            </p>
            <div className='flex flex-col gap-4'>
              <a
                href='tel:0877736289'
                className='inline-flex items-center justify-center sm:justify-start gap-3 text-gray-400 hover:text-gray-300 transition-colors'>
                <div className='bg-[#252525] p-2 rounded-lg'>
                  <Phone className='w-4 h-4 text-[#4477ff]' />
                </div>
                <span className='text-sm md:text-base'>0877736289</span>
              </a>
              <a
                href='mailto:Support@readhub.vn'
                className='inline-flex items-center justify-center sm:justify-start gap-3 text-gray-400 hover:text-gray-300 transition-colors'>
                <div className='bg-[#252525] p-2 rounded-lg'>
                  <Mail className='w-4 h-4 text-[#4477ff]' />
                </div>
                <span className='text-sm md:text-base'>Support@readhub.vn</span>
              </a>
            </div>
          </div>

          {/* About Us */}
          <div className='text-center sm:text-left'>
            <h4 className='text-white font-semibold mb-4 md:mb-6 text-base md:text-lg'>
              About Us
            </h4>
            <ul className='space-y-3 md:space-y-4'>
              {['Introduction', 'Organization Structure', 'Business Areas'].map(
                item => (
                  <li key={item}>
                    <a
                      href='#'
                      className='text-gray-400 hover:text-gray-300 transition-colors text-sm md:text-base'>
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Useful Information */}
          <div className='text-center sm:text-left'>
            <h4 className='text-white font-semibold mb-4 md:mb-6 text-base md:text-lg'>
              Useful Information
            </h4>
            <ul className='space-y-3 md:space-y-4'>
              {['Terms of Use', 'Benefits', 'Privacy Policy', 'FAQ'].map(
                item => (
                  <li key={item}>
                    <a
                      href='#'
                      className='text-gray-400 hover:text-gray-300 transition-colors text-sm md:text-base'>
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Connect With Us */}
          <div className='text-center sm:text-left'>
            <h4 className='text-white font-semibold mb-4 md:mb-6 text-base md:text-lg'>
              Connect With Us
            </h4>
            <div className='flex gap-3 justify-center sm:justify-start'>
              {socialLinks.map(({icon: Icon, label}, index) => (
                <a
                  key={index}
                  href='#'
                  aria-label={label}
                  className='bg-[#252525] p-2.5 rounded-lg hover:bg-[#2a2a2a] transition-colors group'>
                  <Icon className='w-5 h-5 text-[#4477ff] group-hover:text-[#5588ff]' />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Information */}
        <div className='mt-8 md:mt-16 pt-6 md:pt-8 border-t border-[#252525] text-center sm:text-left'>
          <p className='text-xs md:text-sm text-gray-500 max-w-4xl'>
            ReadHub Electronic Book Joint Stock Company - 6th Floor, Hoa Binh
            International Office Tower, 106 Hoang Quoc Viet Street, Nghia Do
            Ward, Cau Giay District, Hanoi, Vietnam.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
