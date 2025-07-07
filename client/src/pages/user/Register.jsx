import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    userType: "user",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      if (value.endsWith('@') && !value.includes('@agilefacilities.com')) {
        setForm({ ...form, [name]: value + 'agilefacilities.com' });
        return;
      }
      if (value.includes('@') && !value.endsWith('@')) {
        const username = value.split('@')[0];
        if (username && !value.includes('@agilefacilities.com')) {
          const domainPart = value.split('@')[1] || '';
          if ('agilefacilities.com'.startsWith(domainPart)) {
            setForm({ ...form, [name]: value });
            return;
          } else {
            setForm({ ...form, [name]: username + '@agilefacilities.com' });
            return;
          }
        }
      }
    }
    if (name === "phone") {
      let phoneValue = value;
      if (!phoneValue.startsWith("+1")) {
        phoneValue = "+1" + phoneValue.replace(/^\+?1?/, "");
      }
      let digits = phoneValue.slice(2).replace(/\D/g, "").slice(0, 10);
      phoneValue = "+1" + digits;
      setForm({ ...form, [name]: phoneValue });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const validateEmail = (email) => {
    return email.toLowerCase().endsWith('@agilefacilities.com');
  };
  const validatePhone = (phone) => {
    return /^\+1\d{10}$/.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!validateEmail(form.email)) {
      setMessage({ type: "error", text: "Email must end with @agilefacilities.com" });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (!validatePhone(form.phone)) {
      setMessage({ type: "error", text: "Phone number must start with +1 and be 10 digits long." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message || "Registration successful! Redirecting..." });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Registration failed." });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Network error." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto"> {/* Changed max-w-lg to max-w-md */}
        <img src="/logo.jpg" alt="Logo" className="h-14 w-20 object-contain mb-6 mx-auto" /> {/* Smaller logo and less margin */}
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2 text-center">Create Your Account</h1>
        <p className="text-gray-600 text-center mb-6">Please fill in the form to register</p>
        {message && (
          <div className={`mb-3 w-full text-center rounded py-2 px-4 text-base font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>{message.text}</div>
        )}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex gap-4 mb-4"> {/* Reduced gap and margin */}
            <div className="w-1/2">
              <label htmlFor="firstname" className="block text-base font-medium text-black mb-1">First Name</label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                value={form.firstname}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white text-base"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="lastname" className="block text-base font-medium text-black mb-1">Last Name</label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                value={form.lastname}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white text-base"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-base font-medium text-black mb-1">
              Email Address <span className="text-sm font-normal text-gray-600">(@agilefacilities.com email required)</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="yourname@agilefacilities.com"
              className={`w-full px-4 py-2 rounded-md border ${!form.email || validateEmail(form.email) ? 'border-gray-300' : 'border-red-500'} focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white text-base`}
              required
            />
            {form.email && !validateEmail(form.email) && (
              <p className="mt-1 text-sm text-red-600">Email must end with @agilefacilities.com</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-base font-medium text-black mb-1">
              Phone Number <span className="text-sm font-normal text-gray-600">(Format: +1XXXXXXXXXX)</span>
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={form.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${!form.phone || validatePhone(form.phone) ? 'border-gray-300' : 'border-red-500'} focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white text-base`}
              required
              maxLength={12}
              pattern="\+1\d{10}"
              inputMode="numeric"
            />
            {form.phone && !validatePhone(form.phone) && (
              <p className="mt-1 text-sm text-red-600">Phone number must start with +1 and be 10 digits long.</p>
            )}
          </div>
          <div className="flex gap-4 mb-6"> {/* Reduced gap and margin */}
            <div className="w-1/2">
              <label htmlFor="password" className="block text-base font-medium text-black mb-1">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-black"
                  tabIndex={-1}
                >
                  {passwordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="w-1/2">
              <label htmlFor="confirmPassword" className="block text-base font-medium text-black mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md border ${
                    !form.confirmPassword || form.password === form.confirmPassword 
                      ? 'border-gray-300' 
                      : 'border-red-500'
                  } focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white text-base`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-black"
                  tabIndex={-1}
                >
                  {confirmPasswordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-md font-semibold text-white text-lg transition-all duration-150 bg-black hover:bg-gray-900"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="w-full text-center mt-6 text-base text-gray-700"> {/* Reduced margin */}
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-black hover:underline">Sign in</a>
        </div>
        <div className="w-full flex items-center mt-8 mb-2"> {/* Reduced margin */}
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-base text-gray-500">Secure Registration</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;