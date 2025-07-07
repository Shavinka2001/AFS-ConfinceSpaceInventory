import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../../services/userService";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const msg = params.get('message');
    const type = params.get('type') || 'info';
    if (msg) {
      setMessage({ type, text: msg });
    }
    const user = localStorage.getItem("User") || sessionStorage.getItem("User");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser && (parsedUser.isAdmin || parsedUser.userType === 'admin')) {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/user/dashboard", { replace: true });
        }
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const { email, password } = form;
      const data = await login(email, password, true);
      setMessage({ type: "success", text: "Login successful! Redirecting..." });
      setTimeout(() => {
        if (data.user && (data.user.isAdmin || data.user.userType === 'admin')) {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/user/dashboard", { replace: true });
        }
      }, 1000);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Invalid email or password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center px-4">
      <div className="w-full max-w-lg mx-auto">
        <img src="/logo.jpg" alt="Logo" className="h-20 w-28 object-contain mb-8 mx-auto" />
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2 text-center">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-10">Sign in to your account to continue</p>
        {message && (
          <div className={`mb-4 w-full text-center rounded py-2 px-4 text-base font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>{message.text}</div>
        )}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="text-left mb-5">
            <label htmlFor="email" className="block text-base font-medium text-black mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white text-base"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          <div className="text-left mb-7">
            <label htmlFor="password" className="block text-base font-medium text-black mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white text-base"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 rounded-md font-semibold text-white text-lg transition-all duration-150 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-900"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="w-full text-center mt-8 text-base text-gray-700">
          Don't have an account?{' '}
          <a href="/register" className="font-semibold text-black hover:underline">Sign up here</a>
        </div>
        <div className="w-full text-center mt-3 text-base">
          <a href="/forgot-password" className="text-gray-600 hover:text-black">Forgot your password?</a>
        </div>
        <div className="w-full flex items-center mt-10 mb-2">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-base text-gray-500">Secure Login</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;