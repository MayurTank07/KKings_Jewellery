'use client'

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  // FIXED: Use consistent pricing - selling_price takes priority over price
  const price = item.selling_price || item.price || 0
  const originalPrice = item.originalPrice || item.price || 0
  const discount = item.discount || 0
  const itemTotal = price * item.quantity

  return (
    <div className="bg-white rounded shadow-sm p-4 flex gap-4">

      {/* IMAGE */}
      <div className="w-28 h-36 border rounded overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* DETAILS */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900">
          {item.name}
        </h3>

        <p className="text-sm text-gray-600 mt-1">
          Material: {item.material} · {item.purity}
        </p>

        <p className="text-sm text-gray-600 mt-1">
          Weight: {item.weight}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Seller:{' '}
          <span className="font-medium">
            {item.seller}
          </span>
        </p>

        {/* PRICE - FIXED: Show consistent pricing */}
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          {originalPrice > price && (
            <span className="line-through text-gray-400 text-sm">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}

          <span className="text-lg font-semibold text-gray-900">
            ₹{price.toLocaleString()}
          </span>

          {discount > 0 && (
            <span className="text-green-600 text-sm font-medium">
              {discount}% off
            </span>
          )}

          {/* FIXED: Show total for this item */}
          <span className="ml-auto text-lg font-semibold text-green-700">
            ₹{itemTotal.toLocaleString()}
          </span>
        </div>

        {/* QTY + REMOVE */}
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2 border rounded-full p-1">
            <button
              onClick={() => onDecrease()}
              disabled={item.quantity <= 1}
              className="w-6 h-6 flex items-center justify-center disabled:opacity-40 hover:text-[#ae0b0b] transition"
              title="Decrease quantity"
            >
              <MinusIcon className="h-4 w-4" />
            </button>

            <span className="w-6 text-center font-medium text-sm">
              {item.quantity}
            </span>

            <button
              onClick={() => onIncrease()}
              className="w-6 h-6 flex items-center justify-center text-[#ae0b0b] hover:opacity-80 transition"
              title="Increase quantity"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => onRemove()}
            className="text-[#ae0b0b] hover:text-red-600 text-sm font-medium transition"
            title="Remove from cart"
          >
            REMOVE
          </button>
        </div>
      </div>
    </div>
  )
}
