import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, ShoppingBagIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const Account = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6ec] to-[#fff1e6] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-[#f0e0c0] p-12 text-center max-w-sm w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
            <UserCircleIcon className="h-8 w-8 text-[#ae0b0b]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 text-sm mb-6">Please log in to access your account</p>
          <Link to="/login"
            className="inline-block px-8 py-3 bg-[#ae0b0b] text-white font-bold rounded-xl hover:bg-[#8f0a0a] transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Handle logout button click
  const handleLogout = () => {
    const result = logout();
    if (result.success) {
      navigate("/login");
    }
  };

  const displayName = user.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user.email || user.phone || 'Customer';

  const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '') || displayName[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-6">

        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ae0b0b] to-[#d4350b] rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
              <p className="text-gray-500 text-sm mt-1">KKings Jewellery Member</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Profile details */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {user.phone && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{user.phone}</p>
                </div>
              </div>
            )}
            {user.email && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/shop"
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-[#ae0b0b] hover:bg-[#fdf6ec] transition-all group">
              <ShoppingBagIcon className="h-5 w-5 text-gray-400 group-hover:text-[#ae0b0b]" />
              <span className="font-medium text-gray-700 group-hover:text-[#ae0b0b]">Continue Shopping</span>
            </Link>
            <Link to="/cart"
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-[#ae0b0b] hover:bg-[#fdf6ec] transition-all group">
              <ShoppingBagIcon className="h-5 w-5 text-gray-400 group-hover:text-[#ae0b0b]" />
              <span className="font-medium text-gray-700 group-hover:text-[#ae0b0b]">View Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
