'use client'

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline'

const API_BASE = "http://localhost:5000/api/products"

export default function ProductsManagement() {
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [loading, setLoading] = useState(true)

  // 🔥 Fetch products
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_BASE)
      const data = await res.json()
      setProducts(data || [])
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  // 🔥 Unique categories
  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category).filter(Boolean))]
  }, [products])

  // 🔥 Filter + Sort
  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (searchQuery) {
      result = result.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory)
    }

    result.sort((a, b) => {
      let aValue = a[sortBy] || ''
      let bValue = b[sortBy] || ''

      if (sortBy === 'price') {
        aValue = parseFloat(aValue) || 0
        bValue = parseFloat(bValue) || 0
      }

      return sortOrder === 'asc'
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1
    })

    return result
  }, [products, searchQuery, selectedCategory, sortBy, sortOrder])

  // 🔥 Delete product
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return

    try {
      const token = localStorage.getItem('kk_admin_token')

      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (res.ok) {
        fetchProducts()
      } else {
        alert('Delete failed')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 🔥 Stock helpers
  const getTotalStock = (product) => {
    if (product.sizes?.length) {
      return product.sizes.reduce((sum, s) => sum + (s.stock || 0), 0)
    }
    return product.stock || 0
  }

  const getStockStatus = (product) => {
    const total = getTotalStock(product)
    if (total <= 0) return 'out'
    if (total <= 5) return 'low'
    return 'ok'
  }

  // 🔥 Get image (Cloudinary support)
  const getProductImage = (product) => {
    return (
      product.images?.[0] || // ✅ new Cloudinary array
      product.image ||       // ✅ old single image
      product.imageUrl ||    // ✅ fallback
      ''
    )
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your inventory</p>
        </div>

        <Link
          to="/admin/upload"
          className="flex items-center gap-2 bg-[#ae0b0b] text-white px-4 py-2 rounded-lg"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 px-4 py-2 border rounded-lg"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="createdAt">Newest</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No products found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map(product => {
                const stockStatus = getStockStatus(product)
                const image = getProductImage(product)

                return (
                  <tr key={product._id} className="border-t hover:bg-gray-50">
                    
                    {/* Product */}
                    <td className="p-3 flex items-center gap-3">
                      {image ? (
                        <img
                          src={image}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                          No Img
                        </div>
                      )}

                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          {product.description?.slice(0, 40)}...
                        </p>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-3">₹{product.price}</td>

                    {/* Stock */}
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        stockStatus === 'out'
                          ? 'bg-red-100 text-red-700'
                          : stockStatus === 'low'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {stockStatus === 'out'
                          ? 'Out'
                          : stockStatus === 'low'
                          ? 'Low'
                          : 'In Stock'}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="p-3">{product.category || '—'}</td>

                    {/* Actions */}
                    <td className="p-3 flex justify-end gap-3">
                      <Link to={`/product/${product._id}`}>
                        <EyeIcon className="h-5" />
                      </Link>

                      <Link to={`/admin/edit/${product._id}`}>
                        <PencilIcon className="h-5" />
                      </Link>

                      <button onClick={() => handleDelete(product._id, product.name)}>
                        <TrashIcon className="h-5 text-red-600" />
                      </button>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
