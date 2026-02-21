import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  loadProducts,
  saveProducts,
  loadCategories,
  saveCategories,
  getProductById,
} from '../utils/productService'
import { normalizeProduct, normalizeProducts, syncProductStock } from '../utils/productSchemaNormalizer'
import { autoSyncIfNeeded } from '../utils/dataSyncInitializer'
import {
  getCategoryById,
  getProductsByCategory,
  getLowStockProducts,
  isInStock,
  isLowStock,
  validateProduct,
  initializeProductStock,
} from '../utils/productService'

const ProductContext = createContext()

export const useProduct = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider')
  }
  return context
}

/**
 * ProductProvider Component
 * Enhanced with:
 * - Inventory/Stock management (stock, lowStockThreshold)
 * - Category management
 * - Data persistence layer (service abstraction)
 * - Auto validation
 * - Error-safe storage
 * 
 * All operations persist to localStorage via productService layer.
 * Ready for backend API integration without UI changes.
 */
export const ProductProvider = ({ children }) => {
  // ========================================================================
  // STATE INITIALIZATION
  // ========================================================================

  /**
   * Initialize products from service layer
   * Falls back to empty array if localStorage is corrupted
   * Normalizes all products to consistent schema
   * Auto-syncs data if needed
   */
  const [products, setProducts] = useState(() => {
    // Auto-sync data if needed on initialization
    const syncedProducts = autoSyncIfNeeded()
    return normalizeProducts(syncedProducts || [])
  })

  /**
   * Initialize categories from service layer
   * Falls back to empty array if localStorage is corrupted
   */
  const [categories, setCategories] = useState(() => {
    return loadCategories()
  })

  // ========================================================================
  // PERSISTENCE EFFECTS
  // ========================================================================

  /**
   * Auto-persist products to localStorage whenever they change
   * Uses service layer for error handling
   */
  useEffect(() => {
    saveProducts(products)
  }, [products])

  /**
   * Auto-persist categories to localStorage whenever they change
   * Uses service layer for error handling
   */
  useEffect(() => {
    saveCategories(categories)
  }, [categories])

  // ========================================================================
  // PRODUCT OPERATIONS (Original API - Backward Compatible)
  // ========================================================================

  /**
   * Add new product
   * Auto-initializes stock fields if not provided
   * Validates category if provided
   * Normalizes product schema before adding
   */
  const addProduct = (product) => {
    // Normalize product schema
    const normalizedProduct = normalizeProduct(product)
    
    // Validate product
    const validation = validateProduct(normalizedProduct, categories)
    if (!validation.valid) {
      console.error('❌ Product validation failed:', validation.errors)
      return { success: false, error: validation.errors.join(', ') }
    }

    // Initialize stock defaults if needed
    const initializedProduct = initializeProductStock(normalizedProduct)
    
    // Sync stock with sizes
    const syncedProduct = syncProductStock(initializedProduct)

    setProducts((prev) => {
      // Check for duplicate ID
      if (prev.some((p) => String(p.id) === String(syncedProduct.id))) {
        console.warn('⚠ Product with this ID already exists')
        return prev
      }
      
      return [...prev, syncedProduct]
    })

    console.log('✅ Product added:', syncedProduct.id)
    return { success: true, product: syncedProduct }
  }

  /**
   * Delete product
   * Removes product from inventory
   */
  const deleteProduct = (id) => {
    const product = getProductById(id, products)
    if (!product) {
      console.warn('⚠ Product not found:', id)
      return { success: false, error: 'Product not found' }
    }

    setProducts(prev => prev.filter(product => product.id !== id))
    console.log(`✅ Product deleted: ${id}`)
    return { success: true }
  }

  /**
   * Update existing product
   * Validates and normalizes product data
   * Syncs stock with size data
   */
  const updateProduct = (id, updates) => {
    setProducts((prev) => {
      const index = prev.findIndex((p) => String(p.id) === String(id))
      if (index === -1) {
        console.warn('⚠ Product not found for update:', id)
        return prev
      }

      const currentProduct = prev[index]
      
      // Merge with updates and normalize
      const updatedProduct = normalizeProduct({
        ...currentProduct,
        ...updates,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      })

      // Validate updated product
      const validation = validateProduct(updatedProduct, categories)
      if (!validation.valid) {
        console.error('❌ Product update validation failed:', validation.errors)
        return prev
      }

      // Sync stock with sizes
      const syncedProduct = syncProductStock(updatedProduct)

      const newProducts = [...prev]
      newProducts[index] = syncedProduct
      
      console.log('✅ Product updated:', id)
      return newProducts
    })

    return { success: true }
  }

  // ========================================================================
  // INVENTORY / STOCK MANAGEMENT
  // ========================================================================

  /**
   * Increase product stock by amount
   * Handles size-specific stock updates
   * @param {string} productId - Product to update
   * @param {number} amount - Quantity to add
   * @param {string} size - Optional size for size-specific stock
   */
  const increaseStock = (productId, amount, size = null) => {
    if (amount <= 0) {
      console.warn('⚠ Stock increase amount must be positive')
      return { success: false, error: 'Amount must be positive' }
    }

    return updateProduct(productId, (currentProduct) => {
      let updatedProduct = { ...currentProduct }
      
      if (size && currentProduct.sizes) {
        // Update specific size stock
        const sizeIndex = currentProduct.sizes.findIndex(s => s.size === size)
        if (sizeIndex === -1) {
          console.warn('⚠ Size not found:', size)
          return currentProduct
        }
        
        // Update size stock
        updatedProduct.sizes = [...currentProduct.sizes]
        updatedProduct.sizes[sizeIndex] = {
          ...updatedProduct.sizes[sizeIndex],
          stock: (updatedProduct.sizes[sizeIndex].stock || 0) + amount
        }
        
        // Recalculate total stock
        const totalStock = updatedProduct.sizes.reduce((sum, s) => sum + (s.stock || 0), 0)
        updatedProduct.stock = totalStock
        updatedProduct.inStock = totalStock > 0
      } else {
        // Update total stock only
        const currentStock = currentProduct.stock || 0
        const newStock = currentStock + amount
        updatedProduct.stock = newStock
        updatedProduct.inStock = newStock > 0
      }

      return updatedProduct
    })
  }

  /**
   * Decrease product stock by amount
   * Prevents stock from going negative
   * Handles size-specific stock updates
   * @param {string} productId - Product to update
   * @param {number} amount - Quantity to subtract
   * @param {string} size - Optional size for size-specific stock
   */
  const decreaseStock = (productId, amount, size = null) => {
    if (amount <= 0) {
      console.warn('⚠ Stock decrease amount must be positive')
      return { success: false, error: 'Amount must be positive' }
    }

    return updateProduct(productId, (currentProduct) => {
      let updatedProduct = { ...currentProduct }
      
      if (size && currentProduct.sizes) {
        // Update specific size stock
        const sizeIndex = currentProduct.sizes.findIndex(s => s.size === size)
        if (sizeIndex === -1) {
          console.warn('⚠ Size not found:', size)
          return currentProduct
        }
        
        const currentSizeStock = currentProduct.sizes[sizeIndex].stock || 0
        if (currentSizeStock < amount) {
          console.warn('⚠ Insufficient stock for size:', size)
          return currentProduct
        }
        
        // Update size stock
        updatedProduct.sizes = [...currentProduct.sizes]
        updatedProduct.sizes[sizeIndex] = {
          ...updatedProduct.sizes[sizeIndex],
          stock: currentSizeStock - amount
        }
        
        // Recalculate total stock
        const totalStock = updatedProduct.sizes.reduce((sum, s) => sum + (s.stock || 0), 0)
        updatedProduct.stock = totalStock
        updatedProduct.inStock = totalStock > 0
      } else {
        // Update total stock only
        const currentStock = currentProduct.stock || 0
        if (currentStock < amount) {
          console.warn('⚠ Insufficient stock:', currentStock, 'requested:', amount)
          return currentProduct
        }

        const newStock = currentStock - amount
        updatedProduct.stock = newStock
        updatedProduct.inStock = newStock > 0
      }

      if (isLowStock(updatedProduct)) {
        console.warn(`⚠ Low stock alert for ${productId}: ${updatedProduct.stock} units remaining`)
      }

      return updatedProduct
    })
  }

  /**
   * Check if product is in stock (stock > 0)
   */
  const checkInStock = (productId) => {
    const product = getProductById(productId, products)
    return isInStock(product)
  }

  /**
   * Check if product has low stock
   */
  const checkLowStock = (productId) => {
    const product = getProductById(productId, products)
    return isLowStock(product)
  }

  /**
   * Get all low stock products
   */
  const getLowStockWarnings = () => {
    return getLowStockProducts(products)
  }

  // ========================================================================
  // CATEGORY MANAGEMENT
  // ========================================================================

  /**
   * Add new category
   * @param {string} name - Category name
   * @returns {Object} { success, category?, error? }
   */
  const addCategory = (name) => {
    if (!name || name.trim() === '') {
      console.warn('⚠ Category name is required')
      return { success: false, error: 'Category name is required' }
    }

    // Check for duplicate names
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      console.warn('⚠ Category already exists:', name)
      return { success: false, error: 'Category already exists' }
    }

    const newCategory = {
      id: Date.now().toString(),
      name: name.trim()
    }

    setCategories(prev => [...prev, newCategory])
    console.log(`✅ Category added: ${newCategory.id} (${name})`)
    return { success: true, category: newCategory }
  }

  /**
   * Delete category
   * Prevents deletion if products exist in that category
   * @param {string} categoryId - Category to delete
   */
  const deleteCategory = (categoryId) => {
    const category = getCategoryById(categoryId, categories)
    if (!category) {
      console.warn('⚠ Category not found:', categoryId)
      return { success: false, error: 'Category not found' }
    }

    // Check if any products exist in this category
    const productsInCategory = getProductsByCategory(categoryId, products)
    if (productsInCategory.length > 0) {
      console.warn(
        `⚠ Cannot delete category "${category.name}": ${productsInCategory.length} product(s) still assigned`
      )
      return {
        success: false,
        error: `Cannot delete category with ${productsInCategory.length} product(s)`
      }
    }

    setCategories(prev => prev.filter(c => c.id !== categoryId))
    console.log(`✅ Category deleted: ${categoryId}`)
    return { success: true }
  }

  /**
   * Update category name
   * @param {string} categoryId - Category to update
   * @param {string} newName - New name
   */
  const updateCategory = (categoryId, newName) => {
    if (!newName || newName.trim() === '') {
      console.warn('⚠ Category name is required')
      return { success: false, error: 'Category name is required' }
    }

    const category = getCategoryById(categoryId, categories)
    if (!category) {
      console.warn('⚠ Category not found:', categoryId)
      return { success: false, error: 'Category not found' }
    }

    // Check for duplicate names (excluding current category)
    if (
      categories.some(
        c =>
          c.id !== categoryId &&
          c.name.toLowerCase() === newName.toLowerCase()
      )
    ) {
      console.warn('⚠ Category name already exists:', newName)
      return { success: false, error: 'Category name already exists' }
    }

    setCategories(prev =>
      prev.map(c =>
        c.id === categoryId ? { ...c, name: newName.trim() } : c
      )
    )
    console.log(`✅ Category updated: ${categoryId} (${newName})`)
    return { success: true, category: { id: categoryId, name: newName } }
  }

  /**
   * Get all categories
   */
  const getAllCategories = () => {
    return categories
  }

  /**
   * Get category by ID
   */
  const getCategory = (categoryId) => {
    return getCategoryById(categoryId, categories)
  }

  /**
   * Get products in a category
   */
  const getProductsInCategory = (categoryId) => {
    return getProductsByCategory(categoryId, products)
  }

  // ========================================================================
  // CONTEXT VALUE
  // ========================================================================

  const value = {
    // Original API (backward compatible)
    products,
    addProduct,
    deleteProduct,
    updateProduct,

    // New: Categories management
    categories,
    addCategory,
    deleteCategory,
    updateCategory,
    getAllCategories,
    getCategory,
    getProductsInCategory,

    // New: Inventory/Stock management
    increaseStock,
    decreaseStock,
    checkInStock,
    checkLowStock,
    getLowStockWarnings,

    // Helpers
    getProductById: (id) => getProductById(id, products),
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}
