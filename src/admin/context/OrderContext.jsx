import React, { createContext, useContext, useState, useEffect } from 'react'

export const OrderContext = createContext()

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}

const API_URL = "http://localhost:5000/api/orders"

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setOrders(data || [])
    } catch (error) {
      console.error('❌ Error loading orders:', error.message)
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

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        getStats,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}