import React, { useState } from 'react'
import { useCart } from '../../context/useCart'
import { useNavigate } from 'react-router-dom'
import { useProduct } from '../../context/ProductContext'
import { validateCartStock, processOrderAndDecrementStock } from '../../utils/checkoutValidation'
import { useOrder } from '../../context/useOrder'
import { recordSale } from '../../../admin/utils/analyticsStorage'

const OrderSummary = ({ address = {} }) => {
  const { cartItems, totalPrice, clearCart } = useCart()
  const productContext = useProduct()
  const navigate = useNavigate()
  const { createOrder } = useOrder()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  // FIXED: Calculate totals with tax
  const subtotal = totalPrice
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const shippingCost = 0 // Free shipping
  const totalAmount = subtotal + tax + shippingCost

  // FIXED: Add order placement functionality with stock validation
  const handlePlaceOrder = async () => {
    // Validate cart and address
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      navigate('/cart')
      return
    }

    if (!address.firstName || !address.mobile) {
      alert('Please complete the delivery address before placing order.')
      navigate('/checkout?step=1')
      return
    }

    // ENHANCED: Validate stock availability before processing
    const stockValidation = validateCartStock(cartItems, productContext)
    if (!stockValidation.valid) {
      const errorMessage = stockValidation.errors.join('\n')
      console.error('❌ Stock validation failed:', errorMessage)
      alert('❌ Cannot place order:\n\n' + errorMessage + '\n\nPlease update your cart.')
      return
    }

    setIsPlacingOrder(true)

    try {
      // ENHANCED: Process order and decrease stock for all items
      const orderResult = await processOrderAndDecrementStock(cartItems, productContext)
      
      if (!orderResult.success) {
        console.error('❌ Order processing failed:', orderResult.error)
        alert('❌ Error processing order:\n\n' + orderResult.error)
        return
      }

      // FIXED: Prepare order data
      const orderData = {
        orderDate: new Date().toISOString(),
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name || item.title,
          quantity: item.quantity,
          price: item.selling_price || item.price || 0,
          subtotal: (item.selling_price || item.price || 0) * item.quantity
        })),
        shippingAddress: {
          firstName: address.firstName,
          lastName: address.lastName,
          streetAddress: address.streetAddress,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          mobile: address.mobile
        },
        totals: {
          subtotal,
          tax,
          shipping: shippingCost,
          total: totalAmount
        },
        status: 'pending',
        orderId: `ORD-${Date.now()}`
      }

      // ✅ ENHANCED: Add order to OrderContext for admin dashboard
      const orderContextResult = createOrder(orderData)
      if (!orderContextResult.success) {
        console.error('❌ Failed to save order to context:', orderContextResult.error)
        alert('⚠ Warning: Order placed but failed to save to system. Contact support.')
      } else {
        console.log('✅ Order saved to context:', orderContextResult.order?.orderId)
      }

      // ✅ NEW: Record sale in analytics storage
      const analyticsRecorded = recordSale(orderData)
      if (analyticsRecorded) {
        console.log('✅ Sale recorded in analytics:', orderData.orderId)
      } else {
        console.warn('⚠ Failed to record sale in analytics:', orderData.orderId)
      }

      // FIXED: Store order locally for backward compatibility
      localStorage.setItem('lastOrder', JSON.stringify(orderData))
      console.log('✅ Order placed successfully:', orderData)

      // Show success message
      alert('✅ Order placed successfully! Order ID: ' + orderData.orderId)

      // FIXED: Clear cart after successful order
      clearCart()

      // FIXED: Redirect to home or confirmation page
      navigate('/')
    } catch (error) {
      console.error('❌ Error placing order:', error)
      alert('❌ Error placing order. Please try again.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <div className="border rounded-md shadow-lg p-5 bg-white">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {cartItems.length === 0 ? (
        <p className="text-sm text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {/* FIXED: Display items with consistent pricing */}
          <ul className="space-y-3 pb-4 border-b">
            {cartItems.map((it) => {
              const price = it.selling_price || it.price || 0
              const itemTotal = price * it.quantity
              return (
                <li key={it.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{it.title || it.name}</p>
                    <p className="text-xs text-gray-500">Qty: {it.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">₹{price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">₹{itemTotal.toLocaleString()}</p>
                  </div>
                </li>
              )
            })}
          </ul>

          {/* FIXED: Display order totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (18% GST)</span>
              <span className="font-medium">₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-base">
              <span>Total Amount</span>
              <span className="text-green-700">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* FIXED: Display delivery address summary */}
          {address.firstName && (
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
              <p className="font-medium text-gray-700 mb-2">Delivery Address</p>
              <p className="text-gray-600">
                {address.firstName} {address.lastName}
              </p>
              <p className="text-gray-600">{address.streetAddress}</p>
              <p className="text-gray-600">
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p className="text-gray-600">Phone: {address.mobile}</p>
            </div>
          )}

          {/* FIXED: Add place order button and navigation */}
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => navigate('/checkout?step=1')} 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
              disabled={isPlacingOrder}
            >
              Back to Address
            </button>
            <button 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || cartItems.length === 0}
              className="ml-auto px-6 py-2 bg-[#ae0b0b] hover:opacity-90 disabled:opacity-50 text-white rounded font-medium transition"
            >
              {isPlacingOrder ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderSummary
