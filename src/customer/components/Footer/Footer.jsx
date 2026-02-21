'use client'

import { useEffect, useState } from 'react'
import { Instagram, WhatsApp } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { getContent, DEFAULT_CONTENT } from '../../../utils/contentStorage'

export default function Footer() {
  const [content, setContent] = useState(DEFAULT_CONTENT.footer)

  useEffect(() => {
    const footerContent = getContent('FOOTER')
    if (footerContent) {
      setContent(footerContent)
    }
  }, [])

  return (
    <footer className="bg-[#7a1c1c] text-white py-10 mt-12">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand / Tagline */}
        <div>
          <h2 className="text-2xl font-bold">{content.brandName}</h2>
          <p className="text-sm mt-2 text-red-100">
            {content.tagline}
          </p>
          <p className="text-sm text-red-200 mt-1">
            {content.trustline}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-red-100">
            {content.quickLinks.map((link, idx) => (
              <li key={idx}>
                <Link to={link.url} className="hover:text-yellow-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
          <p className="text-sm text-red-100 mb-3">
            {content.contact.address} <br />
            {content.contact.phone} <br />
            {content.contact.email}
          </p>
          <div className="flex space-x-4">
            {/* Instagram */}
            <a
              href={content.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 hover:scale-110 transition-transform duration-300"
            >
              <Instagram sx={{ color: 'white' }} />
            </a>

            {/* WhatsApp */}
            <a
              href={content.socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 hover:scale-110 transition-transform duration-300"
            >
              <WhatsApp sx={{ color: 'white' }} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-8 text-center text-sm text-red-200 border-t border-red-600 pt-4">
        {content.copyright.replace('{year}', new Date().getFullYear())}
      </div>
    </footer>
  )
}
