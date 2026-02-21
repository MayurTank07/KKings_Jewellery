'use client'

import { useState, useEffect } from 'react'
import AdminCard from './AdminCard'
import AdminButton from './AdminButton'

const API_URL = "http://localhost:5000/api/content/our-story"

export default function OurStoryEditor() {
  const [content, setContent] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // 🔥 FETCH FROM BACKEND
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(API_URL)
        const data = await res.json()
        setContent(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchContent()
  }, [])

  const handleHeroChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }))
  }

  const handleSectionChange = (sectionIndex, field, value) => {
    const updated = [...content.sections]
    updated[sectionIndex] = {
      ...updated[sectionIndex],
      [field]: value,
    }

    setContent(prev => ({
      ...prev,
      sections: updated,
    }))
  }

  const handleTimelineItemChange = (sectionIndex, itemIndex, field, value) => {
    const updated = [...content.sections]
    const section = { ...updated[sectionIndex] }

    const items = [...section.items]
    items[itemIndex] = { ...items[itemIndex], [field]: value }

    section.items = items
    updated[sectionIndex] = section

    setContent(prev => ({
      ...prev,
      sections: updated,
    }))
  }

  // 🔥 SAVE TO BACKEND
  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const token = localStorage.getItem('kk_admin_token')

      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 🔐 admin protected
        },
        body: JSON.stringify(content),
      })

      if (res.ok) {
        setMessage('✅ Our Story content saved successfully!')
      } else {
        setMessage('❌ Failed to save content')
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  if (!content) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Our Story Page Editor
        </h1>
        <p className="text-gray-600 mt-1">
          Edit the Our Story page content
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('✅')
            ? 'bg-green-50 text-green-800'
            : 'bg-red-50 text-red-800'
        }`}>
          {message}
        </div>
      )}

      {/* Hero */}
      <AdminCard>
        <input
          value={content.hero?.title || ''}
          onChange={(e) => handleHeroChange('title', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-2"
        />

        <textarea
          value={content.hero?.subtitle || ''}
          onChange={(e) => handleHeroChange('subtitle', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-2"
        />

        <input
          value={content.hero?.image || ''}
          onChange={(e) => handleHeroChange('image', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </AdminCard>

      {/* Sections */}
      <AdminCard>
        {content.sections?.map((section, idx) => (
          <div key={section.id} className="mb-4">

            <input
              value={section.title || ''}
              onChange={(e) =>
                handleSectionChange(idx, 'title', e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />

            {section.content && (
              <textarea
                value={section.content}
                onChange={(e) =>
                  handleSectionChange(idx, 'content', e.target.value)
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            )}
          </div>
        ))}
      </AdminCard>

      {/* Save */}
      <AdminButton
        onClick={handleSave}
        disabled={saving}
        className="w-full"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </AdminButton>
    </div>
  )
}
