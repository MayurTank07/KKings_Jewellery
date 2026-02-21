import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const Account = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  // ✅ Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">Please log in to access your account</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-[#b30000] text-white font-semibold rounded-sm hover:bg-[#990000] transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ✅ Handle logout button click
  const handleLogout = () => {
    const result = logout();
    if (result.success) {
      console.log("✅ User logged out, redirecting to login page");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Account
          </h1>
          <p className="text-gray-600">Welcome back, {user.phone}!</p>
        </div>

        {/* Account Card */}
        <div className="bg-[#F6ECC7] shadow-md rounded-lg p-8 max-w-2xl">
          
          {/* User Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-black mb-6">
              Profile Information
            </h2>

            <div className="space-y-5">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <p className="text-lg text-gray-900">{user.phone}</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <p className="text-lg text-gray-900">{user.email || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300 my-8"></div>

          {/* Logout Button */}
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-[#b30000] text-white font-semibold rounded-sm hover:bg-[#990000] transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-sm text-gray-600">
          <p>Your account data is stored securely in your browser's local storage.</p>
          <p className="mt-2">For full account management features, check back soon!</p>
        </div>
      </div>
    </div>
  );
};

export default Account;
