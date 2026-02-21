/**
 * Order Service Layer (FINAL VERSION)
 * ==================================
 * Hybrid system:
 * - Works with localStorage
 * - Ready for backend API
 * - Integrated with analytics + Razorpay
 */

import { recordSale } from '../../admin/utils/analyticsStorage'

const STORAGE_KEY = 'kk_orders'
const API_BASE = 'http://localhost:5000/api/orders'

// 🔥 SWITCH THIS WHEN BACKEND READY
const USE_BACKEND = false

// ============================================================================
// STORAGE HELPERS
// ============================================================================

const readOrders = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const writeOrders = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

// ============================================================================
// LOAD ORDERS
// ============================================================================

export const loadOrders = async () => {
  try {
    if (USE_BACKEND) {
      const res = await fetch(API_BASE)
      return await res.json()
    }

    return readOrders()

  } catch (error) {
    console.error('❌ Load orders failed:', error)
    return []
  }
}

// ============================================================================
// SAVE ORDERS
// ============================================================================

export const saveOrders = async (orders) => {
  try {
    if (!Array.isArray(orders)) {
      throw new Error('Orders must be array')
    }

    if (USE_BACKEND) {
      await fetch(API_BASE + '/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orders)
      })
      return true
    }

    writeOrders(orders)
    return true

  } catch (error) {
    console.error('❌ Save orders failed:', error)
    return false
  }
}

// ============================================================================
// CREATE ORDER (🔥 IMPORTANT)
// ============================================================================

export const createOrder = async (orderData) => {
  try {
    if (!orderData?.orderId) {
      throw new Error('Order ID required')
    }

    const now = new Date().toISOString()

    const newOrder = {
      ...orderData,
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || 'pending',
      paymentMethod: orderData.paymentMethod || 'COD',
      createdAt: now,
      updatedAt: now,
    }

    // 🔥 BACKEND MODE
    if (USE_BACKEND) {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      })

      const saved = await res.json()

      // 🔥 record analytics
      recordSale(saved)

      return saved
    }

    // 🔥 LOCAL MODE
    const orders = readOrders()

    if (orders.some(o => o.orderId === newOrder.orderId)) {
      throw new Error('Duplicate order ID')
    }

    orders.push(newOrder)
    writeOrders(orders)

    // 🔥 analytics integration
    recordSale(newOrder)

    return newOrder

  } catch (err) {
    console.error('❌ Create order failed:', err.message)
    throw err
  }
}

// ============================================================================
// UPDATE ORDER STATUS
// ============================================================================

export const updateOrderStatus = async (orderId, newStatus) => {
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

  if (!validStatuses.includes(newStatus)) {
    throw new Error('Invalid status')
  }

  if (USE_BACKEND) {
    const res = await fetch(`${API_BASE}/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    return await res.json()
  }

  const orders = readOrders()
  const index = orders.findIndex(o => String(o.orderId) === String(orderId))

  if (index === -1) throw new Error('Order not found')

  orders[index].status = newStatus
  orders[index].updatedAt = new Date().toISOString()

  writeOrders(orders)
  return orders[index]
}

// ============================================================================
// GET HELPERS
// ============================================================================

export const getOrderById = (orderId, orders) => {
  return orders.find(o => String(o.orderId) === String(orderId)) || null
}

export const getOrdersByCustomer = (customerId, orders) => {
  return orders.filter(o => o.shippingAddress?.mobile === customerId)
}

export const getOrdersByStatus = (status, orders) => {
  return orders.filter(o => o.status === status)
}

// ============================================================================
// VALIDATION
// ============================================================================

export const validateOrder = (order) => {
  if (!order.orderId) return { valid: false, error: 'Order ID required' }
  if (!order.items?.length) return { valid: false, error: 'Items required' }
  if (!order.shippingAddress) return { valid: false, error: 'Address required' }
  if (typeof order.totals?.total !== 'number') {
    return { valid: false, error: 'Invalid total' }
  }

  return { valid: true }
}

// ============================================================================
// STATS (🔥 FIXED)
// ============================================================================

export const getOrderStats = (orders) => {
  const stats = {
    total: orders.length,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  }

  orders.forEach(order => {
    stats[order.status] = (stats[order.status] || 0) + 1

    // 🔥 ONLY COUNT DELIVERED
    if (order.status === 'delivered') {
      stats.totalRevenue += order.totals?.total || 0
    }
  })

  stats.averageOrderValue =
    stats.delivered > 0
      ? Math.round(stats.totalRevenue / stats.delivered)
      : 0

  return stats
}

// ============================================================================
// RECENT ORDERS
// ============================================================================

export const getRecentOrders = (orders, limit = 10) => {
  return [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
}

// ============================================================================
// FORMAT FOR UI
// ============================================================================

export const formatOrderForDisplay = (order) => {
  return {
    orderId: order.orderId,
    date: new Date(order.createdAt).toLocaleDateString(),
    time: new Date(order.createdAt).toLocaleTimeString(),
    customer: order.shippingAddress
      ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
      : 'Unknown',
    phone: order.shippingAddress?.mobile || 'N/A',
    itemCount: order.items?.length || 0,
    total: order.totals?.total || 0,
    status: order.status || 'unknown',
    items: order.items || [],
  }
}
