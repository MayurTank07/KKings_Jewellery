'use client'

import { useCart } from '../../context/useCart'
import { useNavigate } from 'react-router-dom'
import CartItem from './CartItem'

export default function Cart() {
  const { cartItems, increaseQty, decreaseQty, removeItem, totalPrice } = useCart()

  const totalDiscount = 0 // discount logic not yet standardized across data
  const totalAmount = totalPrice - totalDiscount
  const navigate = useNavigate()

  // FIXED: Add handler to prevent checkout with empty cart
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checking out.')
      return
    }
    // Navigate to checkout with step 1 (delivery address)
    navigate('/checkout?step=1')
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.length === 0 ? (
            // FIXED: Improve empty cart message with action
            <div className="bg-white rounded p-6 text-center">
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <button 
                onClick={() => navigate('/shop')}
                className="px-4 py-2 bg-[#ae0b0b] hover:opacity-90 text-white rounded font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={() => increaseQty(item.id)}
                onDecrease={() => decreaseQty(item.id)}
                onRemove={() => removeItem(item.id)}
              />
            ))
          )}
        </div>

        {/* PRICE DETAILS */}
        <div className="bg-white rounded shadow-sm p-6 h-fit sticky top-20">
          <h3 className="text-gray-500 font-medium border-b pb-3">PRICE DETAILS</h3>

          <div className="space-y-4 mt-4 text-sm">
            <div className="flex justify-between">
              <span>Price ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{totalDiscount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="border-t pt-4 flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span className="text-green-700">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* FIXED: Disable checkout button when cart is empty */}
          <button 
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className="mt-6 w-full bg-[#ae0b0b] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded font-medium transition"
          >
            {cartItems.length === 0 ? 'Cart is Empty' : 'PLACE ORDER'}
          </button>
        </div>
      </div>
    </div>
  )
}
