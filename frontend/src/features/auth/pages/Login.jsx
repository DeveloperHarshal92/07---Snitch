import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import { LuxurisenLogo } from "../../Shared/components/LuxurisenLogo";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.loading);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate(currentUser.role === "seller" ? "/seller/dashboard" : "/", {
        replace: true,
      });
    }
  }, [currentUser, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await handleLogin({
        email: formData.email,
        password: formData.password,
      });
      if (!user) return;
      if (user.role === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen flex flex-col lg:flex-row bg-[#fbf9f6] dark:bg-[#0a0908] text-[#0d0d0b] dark:text-[#fbf9f6] selection:bg-[#C9A96E]/30 transition-colors duration-300"
        style={{
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* ── LEFT: Editorial Image Panel ───────────────────────── */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1b1917]">
          {/* Local High-Res Luxury Editorial Image */}
          <img
            src="/luxurisen_auth_login.jpg"
            alt="Luxurisen Tailoring Editorial"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-90 scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          />

          {/* Luxury Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0b]/90 via-[#0d0d0b]/40 to-transparent" />

          {/* Editorial Content Overlay */}
          <div className="absolute inset-0 p-12 lg:p-16 flex flex-col justify-between z-10">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <LuxurisenLogo
                iconSize={26}
                textSize="1.25rem"
                color="#C9A96E"
                textColor="#fbf9f6"
                onClick={() => navigate("/")}
              />
            </div>

            {/* Quote / Headline */}
            <div className="flex flex-col gap-4 max-w-md">
              <span className="inline-block px-3 py-1 rounded-full text-[0.58rem] tracking-[0.24em] uppercase font-semibold bg-white/10 backdrop-blur-md text-[#C9A96E] w-max border border-white/15">
                The Heritage Vault
              </span>
              <p
                className="text-4xl xl:text-5xl font-light leading-[1.12] text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Welcome back to refined tailored luxury.
              </p>
              <p className="text-xs font-light text-[#d6d3d1] leading-relaxed">
                &ldquo;True elegance is not about standing out, but being remembered for quiet perfection.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form Panel ─────────────────────────────────── */}
        <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen px-6 sm:px-12 lg:px-20 py-12">
          <div className="w-full max-w-md flex flex-col gap-8">
            {/* Mobile Header / Brand */}
            <div className="flex items-center justify-between lg:hidden pb-4 border-b border-[#e4e2df] dark:border-[#292522]">
              <LuxurisenLogo
                iconSize={22}
                textSize="1.1rem"
                color="#C9A96E"
                onClick={() => navigate("/")}
              />
              <button
                onClick={() => navigate("/")}
                className="text-[0.62rem] tracking-[0.16em] uppercase text-[#6b6158] dark:text-[#a8a29e] hover:text-[#0d0d0b] dark:hover:text-white"
              >
                Collection ↗
              </button>
            </div>

            {/* Heading */}
            <div>
              <span className="text-[0.6rem] tracking-[0.25em] uppercase font-semibold text-[#C9A96E] block mb-2">
                Member Access
              </span>
              <h1
                className="text-3xl sm:text-4xl font-light text-[#0d0d0b] dark:text-white tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Sign In to Luxurisen
              </h1>
              <p className="text-xs text-[#6b6158] dark:text-[#a8a29e] font-light mt-2">
                Enter your credentials to access your bag, orders, and wishlist.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-email"
                  className="text-[0.62rem] tracking-[0.18em] uppercase font-medium text-[#3d342c] dark:text-[#d6d3d1]"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#a8a29e]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f5f3f0] dark:bg-[#161412] border border-[#e4e2df] dark:border-[#292522] focus:border-[#C9A96E] focus:bg-[#fbf9f6] dark:focus:bg-[#1c1916] outline-none text-xs text-[#0d0d0b] dark:text-[#fbf9f6] transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="text-[0.62rem] tracking-[0.18em] uppercase font-medium text-[#3d342c] dark:text-[#d6d3d1]"
                  >
                    Password
                  </label>
                  <span className="text-[0.62rem] text-[#8c827a] hover:text-[#C9A96E] transition-colors cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#a8a29e]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#f5f3f0] dark:bg-[#161412] border border-[#e4e2df] dark:border-[#292522] focus:border-[#C9A96E] focus:bg-[#fbf9f6] dark:focus:bg-[#1c1916] outline-none text-xs text-[#0d0d0b] dark:text-[#fbf9f6] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#a8a29e] hover:text-[#0d0d0b] dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 rounded-full bg-[#0d0d0b] dark:bg-[#fbf9f6] text-[#fbf9f6] dark:text-[#0d0d0b] text-[0.68rem] tracking-[0.22em] uppercase font-semibold hover:bg-[#C9A96E] hover:text-[#0d0d0b] dark:hover:bg-[#C9A96E] dark:hover:text-[#0d0d0b] transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>

              {/* Or Divider */}
              <div className="flex items-center gap-4 my-1">
                <div className="flex-1 h-px bg-[#e4e2df] dark:bg-[#292522]" />
                <span className="text-[0.58rem] tracking-[0.18em] uppercase text-[#a8a29e]">
                  Or Connect With
                </span>
                <div className="flex-1 h-px bg-[#e4e2df] dark:bg-[#292522]" />
              </div>

              {/* Google SSO */}
              <ContinueWithGoogle />

              {/* Sign Up Redirect */}
              <p className="text-center text-xs text-[#6b6158] dark:text-[#a8a29e] mt-2">
                Don&apos;t have an atelier account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-medium text-[#0d0d0b] dark:text-[#fbf9f6] hover:text-[#C9A96E] underline underline-offset-4 cursor-pointer"
                >
                  Create one here
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
