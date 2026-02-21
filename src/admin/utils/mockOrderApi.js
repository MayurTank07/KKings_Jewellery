/**
 * Order API Layer (Hybrid: Local + Backend Ready)
 * ==============================================
 * - Works with localStorage (current)
 * - Easily switch to real backend
 * - Razorpay + Analytics ready
 */

import { recordSale } from '../../admin/utils/analyticsStorage'

const STORAGE_KEY = 'kk_orders'
const API_BASE = 'http://localhost:5000/api/orders'

// 🔥 SWITCH (IMPORTANT)
const USE_BACKEND = false // ✅ change to true when backend ready

// ========================
// SAFE STORAGE HELPERS
// ========================
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

// ========================
// FETCH ALL ORDERS
// ========================
export const fetchOrdersApi = async () => {
  try {
    if (USE_BACKEND) {
      const res = await fetch(API_BASE)
      return await res.json()
    }

    return readOrders()

  } catch (err) {
    console.error('❌ Fetch orders failed:', err)
    return []
  }
}

// ========================
// FETCH SINGLE ORDER
// ========================
export const fetchOrderByIdApi = async (orderId) => {
  const orders = await fetchOrdersApi()
  return orders.find(o => String(o.orderId) === String(orderId)) || null
}

// ========================
// CREATE ORDER (🔥 IMPORTANT)
// ========================
export const createOrderApi = async (orderData) => {
  try {
    if (!orderData?.orderId) {
      throw new Error('Order ID required')
    }

    const newOrder = {
      ...orderData,
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || 'pending',
      paymentMethod: orderData.paymentMethod || 'COD', // Razorpay later
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // 🔥 BACKEND MODE
    if (USE_BACKEND) {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      })

      const saved = await res.json()

      // 🔥 Record analytics
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

    // 🔥 Analytics integration
    recordSale(newOrder)

    return newOrder

  } catch (err) {
    console.error('❌ Create order failed:', err.message)
    throw err
  }
}

// ========================
// UPDATE STATUS
// ========================
export const updateOrderStatusApi = async (orderId, newStatus) => {
  const valid = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

  if (!valid.includes(newStatus)) {
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

// ========================
// UPDATE ORDER
// ========================
export const updateOrderApi = async (orderId, updates) => {
  if (USE_BACKEND) {
    const res = await fetch(`${API_BASE}/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    return await res.json()
  }

  const orders = readOrders()
  const index = orders.findIndex(o => String(o.orderId) === String(orderId))

  if (index === -1) throw new Error('Order not found')

  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  writeOrders(orders)
  return orders[index]
}

// ========================
// DELETE ORDER
// ========================
export const deleteOrderApi = async (orderId) => {
  if (USE_BACKEND) {
    await fetch(`${API_BASE}/${orderId}`, { method: 'DELETE' })
    return true
  }

  const orders = readOrders()
  const updated = orders.filter(o => String(o.orderId) !== String(orderId))

  writeOrders(updated)
  return true
}

// ========================
// FILTER HELPERS
// ========================
export const fetchOrdersByStatusApi = async (status) => {
  const orders = await fetchOrdersApi()
  return orders.filter(o => o.status === status)
}

export const fetchOrdersByCustomerApi = async (phone) => {
  const orders = await fetchOrdersApi()
  return orders.filter(o => o.shippingAddress?.mobile === phone)
}

// ========================
// STATS
// ========================
export const fetchOrderStatsApi = async () => {
  const orders = await fetchOrdersApi()

  const stats = {
    total: orders.length,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0
  }

  orders.forEach(o => {
    stats[o.status] = (stats[o.status] || 0) + 1

    if (o.status === 'delivered') {
      stats.totalRevenue += o.totals?.total || 0
    }
  })

  stats.averageOrderValue =
    stats.delivered > 0
      ? Math.round(stats.totalRevenue / stats.delivered)
      : 0

  return stats
}
