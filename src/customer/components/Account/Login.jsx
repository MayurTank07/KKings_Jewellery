import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ Changed variable name (more correct)
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!identifier.trim()) {
        throw new Error("Email or phone is required");
      }

      if (!password.trim()) {
        throw new Error("Password is required");
      }

      const value = identifier.trim();
      const isEmail = value.includes("@");

      let payload;

      if (isEmail) {
        // ✅ Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new Error("Invalid email format");
        }

        payload = { email: value, password };

      } else {
        // ✅ Phone validation
        const phoneDigits = value.replace(/\D/g, "");
        if (!/^\d{10}$/.test(phoneDigits)) {
          throw new Error("Phone must be 10 digits");
        }

        // ⚠️ Backend expects "email" field
        payload = { email: phoneDigits, password };
      }

      // ✅ IMPORTANT: await login
      const result = await login(payload);

      if (result.success) {
        console.log("✅ Login successful");
        navigate("/account");
      } else {
        setError(result.error || "Login failed");
      }

    } catch (err) {
      console.error("❌ Login error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative">
      
      {/* Logo */}
      <div className="absolute top-4 left-4 border border-black w-6 h-6 flex items-center justify-center text-xs">
        KJ
      </div>

      {/* Title */}
      <h1 className="mt-6 text-red-600 font-semibold text-[18px] tracking-wide">
        KKings_Jewellery
      </h1>

      {/* Login Card */}
      <div className="mt-12 w-[430px] bg-[#F6ECC7] shadow-md px-10 py-8">
        
        <h2 className="text-[22px] font-semibold text-black mb-6">
          Login
        </h2>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-sm text-sm">
            {error}
          </div>
        )}

        {/* Email / Phone */}
        <div className="mb-5">
          <label className="block text-[14px] text-black mb-1">
            Email/Mobile Number
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter email or phone"
            className="w-full h-[36px] bg-white px-3 outline-none rounded-sm border border-gray-300 focus:border-red-500"
          />
        </div>

        {/* Password */}
        <div className="mb-8">
          <label className="block text-[14px] text-black mb-1">
            Enter Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full h-[36px] bg-white px-3 outline-none rounded-sm border border-gray-300 focus:border-red-500"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full h-[42px] bg-[#b30000] text-white text-[16px] font-semibold rounded-sm hover:bg-[#990000] transition duration-200 disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Signup */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#b30000] font-semibold hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;