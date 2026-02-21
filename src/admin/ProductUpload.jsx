'use client'

import { useState, useEffect } from 'react'
import { uploadToCloudinary } from "../utils/cloudinaryUpload"
import { useProduct } from '../customer/context/ProductContext'
import AdminCard from './layout/AdminCard'
import AdminButton from './layout/AdminButton'

const ProductUpload = () => {
  const { addProduct, getAllCategories } = useProduct()
  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: ['', '', '', '', ''], // Support 4 images
    imageUrl: '', // Backward compatibility
    stock: '1'
  })

  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load categories on component mount
  useEffect(() => {
    const allCategories = getAllCategories()
    setCategories(allCategories)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    setError('')

    try {
      const imageUrl = await uploadToCloudinary(file)
      
      // Update specific image in the images array
      setFormData(prev => {
        const newImages = [...prev.images]
        newImages[index] = imageUrl
        return { ...prev, images: newImages }
      })
      
      setSuccess(`Image ${index + 1} uploaded successfully!`)
    } catch {
      setError(`Image ${index + 1} upload failed. Try again.`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const newImages = [...prev.images]
      newImages[index] = ''
      return { ...prev, images: newImages }
    })
  }

  // Validate that all 4 images exist before saving
    const validateImages = () => {
      const validImages = formData.images.filter(img => img && img.trim() !== '')
      if (validImages.length === 0) {
        setError('At least one image is required')
        return false
      }
      return true
    }

    const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setError('')
    setSuccess('')

    if (!formData.name || !formData.price || !formData.category) {
      setError('Please fill required fields')
      return
    }

    // Validate images
    if (!validateImages()) {
      return
    }

    const price = Number(formData.price)
    if (price <= 0) {
      setError('Price must be greater than 0')
      return
    }

    setIsSubmitting(true)

    try {
      const product = {
        ...formData,
        price,
        stock: Number(formData.stock) || 1,
        // Convert single image to array for backward compatibility
        images: formData.images.filter(img => img && img.trim() !== ''),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Call addProduct and handle the return value with validation result
      const result = addProduct(product)

      // Check if product add was successful
      if (!result.success) {
        setError(result.error || 'Failed to add product')
        return
      }

      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        images: ['', '', '', '', ''], // Reset to 4 empty slots
        imageUrl: '', // Backward compatibility
        stock: '1'
      })

      setSuccess('Product added successfully!')
      setTimeout(() => setSuccess(''), 3000)

    } catch {
      setError('Failed to add product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Add Product</h1>
        <p className="text-gray-600 mt-1">
          Add a new item to your inventory
        </p>
      </div>

      <AdminCard>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name *
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#ae0b0b]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <input
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Chains, Rings, Bracelets..."
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#ae0b0b]"
                required
              />
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#ae0b0b]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#ae0b0b]"
              />
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#ae0b0b]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Product Images (4 slots)
            </label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="space-y-2">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      disabled={isUploading}
                      className="w-full border rounded-xl px-4 py-2 text-sm"
                    />
                    
                    {image && (
                      <div className="mt-2">
                        <img
                          src={image}
                          className="h-24 w-24 object-cover rounded-xl border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    
                    {isUploading && !image && (
                      <div className="mt-2 text-sm text-gray-600">
                        Uploading image {index + 1}...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">

            <AdminButton
              type="submit"
              loading={isSubmitting}
              disabled={isUploading}
              size="lg"
              className="flex-1"
            >
              Add Product
            </AdminButton>

            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => window.history.back()}
              size="lg"
            >
              Cancel
            </AdminButton>

          </div>

        </form>
      </AdminCard>
    </div>
  )
}

export default ProductUpload
