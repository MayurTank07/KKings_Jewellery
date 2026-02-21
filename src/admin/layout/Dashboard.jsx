'use client'

import { useProduct } from '../../customer/context/ProductContext'
import { useCart } from '../../customer/context/useCart'
import { useOrder } from '../../customer/context/useOrder' // ✅ FIXED PATH
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  PlusCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'

import AdminCard from './AdminCard'
import AdminButton from './AdminButton'

import {
  calculateTotalStats,
  getRevenueStats,
} from '../utils/analyticsService'

export default function Dashboard() {
  const { products } = useProduct()
  const { cartItems } = useCart()
  const { orders } = useOrder()

  const orderStats = useMemo(() => calculateTotalStats(orders), [orders])
  const revenueStats = useMemo(() => getRevenueStats(orders), [orders])

  const totalProducts = products.length

  // ✅ FIXED: use backend order revenue
  const totalRevenue = revenueStats.totalRevenue || 0

  const pendingOrders = orderStats.pendingOrders || 0

  // ✅ FIXED: stock from sizes
  const lowStockProducts = useMemo(() => {
    return products.filter(p =>
      p.sizes?.some(s => s.stock <= 5)
    ).length
  }, [products])

  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN')}`
  }

  const stats = [
    {
      name: 'Total Products',
      value: totalProducts,
      change: '+0%',
      changeType: 'increase',
      icon: ShoppingBagIcon,
      href: '/admin/products',
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: `${revenueStats.revenueGrowth > 0 ? '+' : ''}${revenueStats.revenueGrowth || 0}%`,
      changeType: revenueStats.revenueGrowth > 0 ? 'increase' : 'decrease',
      icon: CurrencyDollarIcon,
      href: '/admin/analytics',
    },
    {
      name: 'Pending Orders',
      value: pendingOrders,
      change: pendingOrders > 0 ? '⚠' : '✓',
      changeType: pendingOrders > 0 ? 'decrease' : 'increase',
      icon: UsersIcon,
      href: '/admin/orders',
    },
    {
      name: 'Low Stock',
      value: lowStockProducts,
      change: lowStockProducts > 0 ? '⚠' : '✓',
      changeType: lowStockProducts > 0 ? 'decrease' : 'increase',
      icon: ArrowTrendingUpIcon,
      href: '/admin/products?filter=low-stock',
    },
  ]

  const recentProducts = products.slice(-5).reverse()

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here’s what’s happening with your store.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => {
          const Icon = stat.icon

          return (
            <AdminCard key={stat.name} hover>
              <Link to={stat.href} className="group block">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold mt-1">
                      {stat.value}
                    </p>

                    <div className="flex items-center mt-2">
                      <ArrowTrendingUpIcon
                        className={`h-4 w-4 ${
                          stat.changeType === 'increase'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      />
                      <span
                        className={`ml-1 text-sm font-medium ${
                          stat.changeType === 'increase'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="ml-1 text-sm text-gray-500">
                        vs last month
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#fef2f2] rounded-xl group-hover:bg-[#ae0b0b] transition">
                    <Icon className="h-6 w-6 text-[#ae0b0b] group-hover:text-white transition" />
                  </div>
                </div>
              </Link>
            </AdminCard>
          )
        })}
      </div>

      {/* Quick Actions */}
      <AdminCard>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <AdminButton href="/admin/upload" variant="secondary" className="p-4">
            <PlusCircleIcon className="h-5 w-5 mr-2 text-[#ae0b0b]" />
            Add Product
          </AdminButton>

          <AdminButton href="/admin/products" variant="secondary" className="p-4">
            <EyeIcon className="h-5 w-5 mr-2 text-[#ae0b0b]" />
            View Products
          </AdminButton>

          <AdminButton href="/admin/analytics" variant="secondary" className="p-4">
            <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-[#ae0b0b]" />
            Analytics
          </AdminButton>

        </div>
      </AdminCard>

      {/* Recent Products */}
      <AdminCard>
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Products</h2>
        </div>

        {recentProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p>No products yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">
              <tbody className="divide-y">
                {recentProducts.map(product => (
                  <tr key={product._id || product.id} className="hover:bg-[#fef2f2]">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.title || product.name}</p>
                        <p className="text-xs text-gray-600">{product.category}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      ₹{(product.price || 0).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      {product.sizes?.reduce((a, s) => a + s.stock, 0) ?? 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

    </div>
  )
}
