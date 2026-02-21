'use client'

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from './context/useAdminAuth'
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

const AdminOnlyLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logoutAdmin } = useAdminAuth()

  const adminMenuItems = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    {name: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon },
    { name: 'Pages', href: '/admin/pages', icon: ShoppingBagIcon },
    { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
    { name: 'Add Product', href: '/admin/upload', icon: PlusCircleIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon },
    { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ]

  const isActive = href =>
    href === '/admin'
      ? location.pathname === href
      : location.pathname.startsWith(href)

  /**
   * Handle admin logout
   * Clears token and redirects to admin login page
   */
  const handleLogout = () => {
    const result = logoutAdmin()
    if (result.success) {
      console.log('✅ Admin logged out, redirecting to login')
      navigate('/admin-login')
    } else {
      console.error('❌ Logout failed:', result.error)
    }
  }

  return (
    <div className="h-screen bg-[#fafafa] flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out h-full
          lg:translate-x-0 lg:static lg:h-full
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-20 px-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ae0b0b] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">KK</span>
            </div>
            <span className="font-serif font-bold text-lg text-[#ae0b0b]">Admin</span>
          </div>

          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#ae0b0b]">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {adminMenuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  ${active
                    ? 'bg-[#ae0b0b] text-white shadow-md'
                    : 'text-gray-700 hover:bg-[#fef2f2] hover:text-[#ae0b0b]'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4 space-y-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#ae0b0b] text-white hover:bg-[#8f0a0a] transition-all"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            View Store
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:ml-64 h-full">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-[#ae0b0b]">
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ae0b0b] rounded-xl flex items-center justify-center">
              <span className="font-bold text-sm text-white">KK</span>
            </div>
            <span className="font-serif font-bold text-lg text-[#ae0b0b]">Admin</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-[#fafafa]">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminOnlyLayout
