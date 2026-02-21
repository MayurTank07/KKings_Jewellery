import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Handle sign up button click
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // ✅ Validate all fields are filled
      if (!phone.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        throw new Error("All fields are required");
      }

      // ✅ Attempt registration with context function
      const result = register({
        phone: phone.replace(/\D/g, ""),
        email,
        password,
        confirmPassword,
      });

      if (result.success) {
        // ✅ Redirect to login after successful signup
        console.log("✅ Registration successful, redirecting to login");
        alert("Account created successfully! Please log in.");
        navigate("/login");
      } else {
        setError(result.error || "Sign up failed");
      }
    } catch (err) {
      console.error("❌ Sign up error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      
      {/* Top Title */}
      <h1 className="mt-6 text-red-600 font-semibold text-[18px] tracking-wide">
        KKings_Jewellery
      </h1>

      {/* Signup Card */}
      <div className="mt-12 w-[430px] bg-[#F6ECC7] shadow-md px-10 py-8">
        
        {/* Heading */}
        <h2 className="text-[22px] font-semibold text-black mb-6">
          Signup
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-sm text-sm">
            {error}
          </div>
        )}

        {/* Mobile Number */}
        <div className="mb-4">
          <label className="block text-[14px] text-black mb-1">
            Mobile Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter 10-digit phone"
            className="w-full h-[36px] bg-white px-3 outline-none rounded-sm border border-gray-300 focus:border-red-500"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-[14px] text-black mb-1">
            Email Id
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full h-[36px] bg-white px-3 outline-none rounded-sm border border-gray-300 focus:border-red-500"
          />
        </div>

        {/* Create Password */}
        <div className="mb-4">
          <label className="block text-[14px] text-black mb-1">
            Create New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 4 characters"
            className="w-full h-[36px] bg-white px-3 outline-none rounded-sm border border-gray-300 focus:border-red-500"
          />
        </div>

        {/* Verify Password */}
        <div className="mb-6">
          <label className="block text-[14px] text-black mb-1">
            Verify Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className="w-full h-[36px] bg-white px-3 outline-none rounded-sm border border-gray-300 focus:border-red-500"
          />
        </div>

        {/* Sign Up Button */}
        <button
          onClick={handleSignup}
          disabled={isLoading}
          className="w-full h-[42px] bg-[#b30000] text-white text-[16px] font-semibold rounded-sm hover:bg-[#990000] transition duration-200 disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Login link */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#b30000] font-semibold hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

