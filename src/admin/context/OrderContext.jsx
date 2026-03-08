import React, { createContext, useContext, useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config/api'
import { useAdminAuth } from './useAdminAuth'

export const OrderContext = createContext()

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}

const API_URL = `${API_BASE_URL}/orders`

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const { setOrderRefreshCallback } = useAdminAuth() || {}

  useEffect(() => {
    // Only fetch orders if admin token exists
    const token = localStorage.getItem('kk_admin_token')
    if (token && token !== 'undefined') {
      fetchOrders()
    }

    // Register refresh callback with AdminAuth
    if (setOrderRefreshCallback) {
      setOrderRefreshCallback(() => fetchOrders)
    }
  }, [])

  const fetchOrders = async () => {
    const token = localStorage.getItem('kk_admin_token')
    
    // Don't fetch if no token
    if (!token || token === 'undefined') {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('kk_admin_token')
        }
        throw new Error(`HTTP ${res.status}`)
      }
      
      const data = await res.json()
      setOrders(data.data?.orders || data.data || data || [])
    } catch (error) {
      console.error('❌ Error loading orders:', error.message)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // ✅ CREATE ORDER
  const createOrder = async (orderData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setOrders(prev => [...prev, data])
      return { success: true, order: data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ✅ UPDATE STATUS (FIXED)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('kk_admin_token')

      const res = await fetch(`${API_URL}/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const updated = await res.json()
      if (!res.ok) throw new Error(updated.message)

      setOrders(prev =>
        prev.map(o => (o._id === orderId ? updated : o))
      )

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ✅ DELETE (FIXED)
  const deleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('kk_admin_token')

      await fetch(`${API_URL}/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setOrders(prev => prev.filter(o => o._id !== orderId))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ✅ FIXED STATS
  const getStats = () => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  })

  // Refresh orders (call after login)
  const refreshOrders = () => {
    fetchOrders()
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        getStats,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}