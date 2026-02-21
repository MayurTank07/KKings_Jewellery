import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function OrderSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderId = location.state?.orderId

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Placed Successfully!
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        
        {orderId && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="font-mono font-semibold text-lg">{orderId}</p>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/shop')}
            className="w-full bg-[#ae0b0b] text-white py-3 rounded-md hover:bg-[#8a0909] transition-colors"
          >
            Continue Shopping
          </button>
          
          <button
            onClick={() => navigate('/account')}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            View My Orders
          </button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>A confirmation email has been sent to your registered email address.</p>
          <p className="mt-2">For any queries, contact our customer support.</p>
        </div>
      </div>
    </div>
  )
}
