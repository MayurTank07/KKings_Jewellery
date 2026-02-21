'use client'

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  HomeIcon,
  ShoppingBagIcon,
  PlusCircleIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

// ✅ IMPORT AUTH HOOK
import { useAdminAuth } from '../context/useAdminAuth'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
  { name: 'Add Product', href: '/admin/upload', icon: PlusCircleIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon },
  { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  { name: 'Pages', href: '/admin/pages', icon: ChartBarIcon },
  { name: 'CMS Content', isCategory: true },
  { name: '  Home Page', href: '/admin/cms/home', icon: null },
  { name: '  Footer', href: '/admin/cms/footer', icon: null },
  { name: '  Our Story', href: '/admin/cms/our-story', icon: null },
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // ✅ USE AUTH
  const { logoutAdmin } = useAdminAuth()

  // ✅ FIXED LOGOUT
  const handleLogout = () => {
    logoutAdmin()              // 🔥 clears token + state
    navigate('/')              // redirect to home
  }

  const isActive = (href) => {
    if (!href) return false
    if (href === '/admin') return location.pathname === href
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
          <Link to="/admin" className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/dkbxrhe1v/image/upload/v1768829821/logo1_xqrmjy.png"
              alt="KKings Admin"
              className="h-8 object-contain"
            />
            <span className="text-xl font-serif font-bold text-[#ae0b0b]">
              Admin
            </span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#ae0b0b]"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            if (item.isCategory) {
              return (
                <div
                  key={item.name}
                  className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2"
                >
                  {item.name}
                </div>
              )
            }

            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors
                  ${active
                    ? 'bg-[#ae0b0b] text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#ae0b0b]'
                  }
                `}
              >
                {Icon ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  <span className="h-5 w-5" />
                )}
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-[#b91c1c] transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#ae0b0b]"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex items-center justify-between flex-1">
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  {menuItems.find(item => isActive(item.href))?.name || 'Admin Dashboard'}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to="/"
                  className="text-sm font-medium text-[#ae0b0b] hover:opacity-80"
                >
                  View Store →
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
