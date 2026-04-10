import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    password: "",
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegister({
        email: formData.email,
        contact: formData.contactNumber,
        password: formData.password,
        isSeller: formData.isSeller,
        fullname: formData.fullName,
      });
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e5e2e1] font-sans selection:bg-[#FFD700] selection:text-[#131313] flex flex-col lg:flex-row">
      {/* Split Screen - Left Image Section (Hidden on mobile, visible on lg screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#131313] items-center justify-center overflow-hidden border-r border-[#1c1b1b]">
        <img
          src="/snitch_editorial.png"
          alt="Snitch Fashion Editorial"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:scale-105 transition-transform duration-[20s] ease-out"
        />

        {/* Gradient overlays to merge image nicely into the dark background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/50 via-transparent to-[#0e0e0e] opacity-90"></div>

        <div className="relative z-10 p-16 flex flex-col h-full justify-between w-full max-w-2xl">
          <h2 className="text-[#FFD700] text-xl font-bold tracking-widest uppercase">
            Snitch.
          </h2>

          <div className="mt-auto">
            <p className="text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1] text-white mb-6">
              Define your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e9c400] to-[#ffd700]">
                aesthetic.
              </span>
            </p>
            <p className="text-[#d0c6ab] max-w-md text-lg leading-relaxed">
              Join the exclusive movement of creators and brands redefining the
              modern fashion landscape.
            </p>
          </div>
        </div>
      </div>

      {/* Split Screen - Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 min-h-screen overflow-y-auto z-10 bg-[#0e0e0e]">
        <div className="w-full max-w-md bg-[#131313] lg:bg-transparent p-10 md:p-14 lg:p-6 rounded-2xl lg:rounded-none shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] lg:shadow-none">
          <div className="mb-12">
            <h2 className="text-sm uppercase tracking-widest text-[#FFD700] font-medium mb-3">
              Welcome to Snitch
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
              Elevate Your Style
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Google Auth */}
            <a href="/api/auth/google" className="w-full block">
              <button
                type="button"
                className="w-full bg-white text-black font-semibold tracking-wide py-3.5 px-4 rounded flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors duration-300"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </a>

            {/* OR Separator */}
            <div className="flex items-center gap-4 -my-2">
              <div className="flex-1 border-t border-[#4d4732]"></div>
              <span className="text-sm font-medium text-[#999077]">OR</span>
              <div className="flex-1 border-t border-[#4d4732]"></div>
            </div>

            {/* Full Name */}
            <div className="flex flex-col">
              <label className="text-sm text-[#d0c6ab] mb-2 font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="bg-[#1c1b1b] lg:bg-[#0e0e0e] text-white border-b-2 border-[#4d4732] focus:border-[#FFD700] outline-none px-4 py-3 transition-colors duration-300 focus:bg-[#201f1f] lg:focus:bg-[#131313]"
                placeholder="e.g. John Doe"
              />
            </div>

            {/* Contact Number */}
            <div className="flex flex-col">
              <label className="text-sm text-[#d0c6ab] mb-2 font-medium">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="bg-[#1c1b1b] lg:bg-[#0e0e0e] text-white border-b-2 border-[#4d4732] focus:border-[#FFD700] outline-none px-4 py-3 transition-colors duration-300 focus:bg-[#201f1f] lg:focus:bg-[#131313]"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm text-[#d0c6ab] mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-[#1c1b1b] lg:bg-[#0e0e0e] text-white border-b-2 border-[#4d4732] focus:border-[#FFD700] outline-none px-4 py-3 transition-colors duration-300 focus:bg-[#201f1f] lg:focus:bg-[#131313]"
                placeholder="hello@example.com"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-sm text-[#d0c6ab] mb-2 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-[#1c1b1b] lg:bg-[#0e0e0e] text-white border-b-2 border-[#4d4732] focus:border-[#FFD700] outline-none px-4 py-3 transition-colors duration-300 focus:bg-[#201f1f] lg:focus:bg-[#131313]"
                placeholder="••••••••"
              />
            </div>

            {/* Is Seller Checkbox */}
            <div className="flex items-center gap-4 mt-2 group w-max cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="isSeller"
                  id="isSeller"
                  checked={formData.isSeller}
                  onChange={handleChange}
                  className="peer appearance-none w-6 h-6 border border-[#4d4732] rounded bg-[#1c1b1b] lg:bg-[#0e0e0e] checked:bg-[#FFD700] checked:border-[#FFD700] cursor-pointer transition-colors duration-300 group-hover:border-[#FFD700]"
                />
                <svg
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-[#221b00]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <label
                htmlFor="isSeller"
                className="text-sm text-[#e5e2e1] group-hover:text-[#FFD700] cursor-pointer select-none transition-colors duration-300"
              >
                Register as Seller
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-6 w-full bg-gradient-to-r from-[#e9c400] to-[#ffd700] text-[#131313] font-bold tracking-wide py-4 px-8 rounded hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Sign Up
            </button>

            <div className="text-center mt-6">
              <a
                href="/login"
                className="text-sm text-[#999077] hover:text-[#FFD700] transition-colors border-b border-transparent hover:border-[#FFD700] py-0.5"
              >
                Already have an account? Sign in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
