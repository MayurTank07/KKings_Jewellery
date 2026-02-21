'use client'

import React, { useState } from 'react'
import { useOrder } from '../context/OrderContext'
import AdminCard from '../layout/AdminCard'
import {
formatOrderDate,
formatOrderTime,
getStatusColor,
formatPrice,
} from '../utils/orderValidation'

const AdminOrders = () => {
  const { orders, updateOrderStatus, getStats } = useOrder()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [error, setError] = useState('')

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(o => o.status === selectedStatus)

  const stats = getStats()

  // ✅ FIXED (async)
  const handleStatusChange = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus)
    if (!result.success) {
      setError(result.error)
      setTimeout(() => setError(''), 3000)
    }
  }

  // ✅ FIXED (_id instead of orderId)
  const selectedOrder = selectedOrderId
    ? orders.find(o => o._id === selectedOrderId)
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-2">
          Manage and track all customer orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <AdminCard>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Processing</p>
            <p className="text-3xl font-bold text-blue-600">{stats.processing}</p>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Shipped</p>
            <p className="text-3xl font-bold text-purple-600">{stats.shipped}</p>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Delivered</p>
            <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Cancelled</p>
            <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </AdminCard>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {/* Filters */}
      <AdminCard>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedStatus === 'all'
                ? 'bg-[#ae0b0b] text-white'
                : 'bg-gray-100'
            }`}
          >
            All Orders
          </button>

          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${
                selectedStatus === status
                  ? 'bg-[#ae0b0b] text-white'
                  : 'bg-gray-100'
              }`}
            >
              {status} ({orders.filter(o => o.status === status).length})
            </button>
          ))}
        </div>
      </AdminCard>

      {/* Table */}
      <AdminCard>
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">No orders found</div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id} className="border-b">
                  <td className="p-3">{order._id}</td>

                  <td className="p-3">
                    {order.shippingAddress?.firstName}
                  </td>

                  <td className="p-3">
                    {formatOrderDate(order.createdAt)}
                  </td>

                  <td className="p-3 text-right">
                    {formatPrice(order.totalAmount || order.totals?.total || 0)}
                  </td>

                  <td className="p-3 text-center">
                    <span className={getStatusColor(order.status)}>
                      {order.status}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        setSelectedOrderId(
                          selectedOrderId === order._id ? null : order._id
                        )
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminCard>

      {/* Details */}
      {selectedOrder && (
        <AdminCard>
          <h3 className="font-bold mb-4">{selectedOrder._id}</h3>

          <div className="space-y-2">
            <p>Status: {selectedOrder.status}</p>

            <div className="flex gap-2">
              {['pending','processing','shipped','delivered','cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(selectedOrder._id, status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </AdminCard>
      )}
    </div>
  )
}

export default AdminOrders
