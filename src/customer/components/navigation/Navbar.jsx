'use client'

import { useState, Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Popover, Dialog, Transition } from '@headlessui/react'
import { useAuth } from '../../context/useAuth'

const shopCategories = [
  { name: 'Bracelets', image: 'https://res.cloudinary.com/dkbxrhe1v/image/upload/v1768828246/main2_xk6xst.jpg' },
  { name: 'Chains', image: 'https://res.cloudinary.com/dkbxrhe1v/image/upload/v1768828246/broadchain2_wyc1do.jpg' },
  { name: 'Rings', image: 'https://res.cloudinary.com/dkbxrhe1v/image/upload/v1768828250/rings_zjtuwl.jpg' },
  { name: 'Pendal', image: 'https://res.cloudinary.com/dkbxrhe1v/image/upload/v1768830804/pendal_vufulo.jpg' },
  { name: 'Kada', image: 'https://res.cloudinary.com/dkbxrhe1v/image/upload/v1768828246/kada_ajfqqz.jpg' },
  { name: 'Bali', image: 'https://res.cloudinary.com/dkbxrhe1v/image/upload/v1768828243/bali_cq49be.jpg' },
  { name: 'Rudraksh', image: 'https://res.cloudinary.com/dkbxrhe1v/image/upload/v1768828248/rudraksh_jik5vi.jpg' },
]

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Our Story', path: '/our-story' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  // ✅ Handle account icon click: navigate based on login status
  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate('/account')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="sticky top-0 z-50 bg-white">

      {/* Announcement */}
      <header>
        <p className="flex h-10 items-center justify-center bg-[#ae0b0b] text-sm font-medium text-white">
          Get 10% off on First Purchase
        </p>
      </header>

      {/* Navbar */}
      <nav className="border-b border-gray-200">

        {/* Top row */}
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-[#ae0b0b]"
              onClick={() => setMobileOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <Link to="/">
              <img
                src="https://res.cloudinary.com/dkbxrhe1v/image/upload/v1768829821/logo1_xqrmjy.png"
                className="h-11"
                alt="KKings"
              />
            </Link>
          </div>

          {/* Brand */}
          <h1 className="hidden lg:block text-3xl font-serif font-bold text-[#ae0b0b]">
            KKings_Jewellery
          </h1>

          <h1 className="absolute left-1/2 -translate-x-1/2 lg:hidden text-lg font-serif font-bold text-[#ae0b0b]">
            KKings_Jewellery
          </h1>

          {/* Icons */}
          <div className="flex items-center gap-5 text-[#ae0b0b]">
            <MagnifyingGlassIcon className="h-5 w-5 cursor-pointer" />
            {/* ✅ Account icon: Navigate to /account if logged in, /login if not */}
            <button onClick={handleAccountClick} className="cursor-pointer hover:opacity-70 transition">
              <UserCircleIcon className="h-5 w-5" />
            </button>
            <Link to="/cart">
              <ShoppingBagIcon className="h-5 w-5 cursor-pointer" />
            </Link>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center gap-14">

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-medium hover:text-[#ae0b0b]"
              >
                {link.name}
              </Link>
            ))}

            {/* Shop All mega menu */}
            <Popover className="relative">
              <Popover.Button className="font-medium text-[#ae0b0b]">
                Shop All
              </Popover.Button>

              <Transition as={Fragment}>
                <Popover.Panel className="absolute left-1/2 -translate-x-1/2 top-full mt-6 w-[95vw] max-w-[1100px] max-h-[80vh] bg-white shadow-2xl border p-10 rounded-2xl z-50 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {shopCategories.map((cat) => (
                      <Link
                        key={cat.name}
                        to={`/shop/${cat.name.toLowerCase()}`}
                        className="text-center group"
                      >
                        <img
                          src={cat.image}
                          className="rounded-xl aspect-square object-cover group-hover:scale-105 transition"
                        />
                        <p className="mt-3 font-medium">{cat.name}</p>
                        <span className="text-sm text-[#ae0b0b]">Explore →</span>
                      </Link>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>

          </div>
        </div>

        {/* Mobile menu */}
        <Dialog open={mobileOpen} onClose={setMobileOpen} className="lg:hidden">
          <div className="fixed inset-0 bg-black/30 z-40" />
          <Dialog.Panel className="fixed inset-y-0 left-0 w-[85%] bg-white z-50 p-6">

            <button onClick={() => setMobileOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-[#ae0b0b]" />
            </button>

            <div className="mt-6 space-y-4">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className="block text-lg">
                  {link.name}
                </Link>
              ))}
              <Link to="/shop" className="block text-lg">Shop All</Link>
            </div>

          </Dialog.Panel>
        </Dialog>

      </nav>
    </div>
  )
}
