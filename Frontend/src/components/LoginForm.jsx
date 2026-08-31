import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link, replace } from "react-router-dom";
import { login, getCurrentUser } from "../data/authApi";
export default function LoginForm() {
  const navigate = useNavigate();
  // 🍏 JWT-READY CREDENTIAL STATE OBJECT MODEL
  const [credentials, setCredentials] = useState({
    username_or_email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🍏 FUTURE DJANGO REST (SimpleJWT) POST DISPATCH DISPATCHER
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login({
        username_or_email: credentials.username_or_email,
        password: credentials.password,
      });
      const currentUser = await getCurrentUser();
      const landingPage = currentUser.role === "Admin" ? "dashboard" : currentUser.pages?.includes("dashboard") ?"dashboard": currentUser.pages?.[0];
      if (!landingPage){
        throw new Error("Your account does not have access to any page.")
      }
      navigate(`/${landingPage}`, {replace: true});
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-white p-8 sm:p-12 flex flex-col justify-center items-center overflow-y-auto h-full animate-fadeIn">
      <div className="w-full max-w-sm space-y-6 text-left">
        {/* Header Block Titles */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Enter your credentials to access your pharmacy control center
          </p>
        </div>
        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {error}
          </p>
        )}

        {/* Input Validation Form Block Container */}
        <form
          onSubmit={handleLoginSubmit}
          className="space-y-4 text-xs font-bold text-slate-500"
        >
          {/* User Identifier Input Wrapper Field */}
          <div className="space-y-1">
            <label className="tracking-wide">Email or Username</label>
            <div className="relative">
              <input
                type="text"
                name="username_or_email"
                required
                value={credentials.username_or_email}
                onChange={handleInputChange}
                placeholder="name@pharmacy.com"
                className="w-full font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 pl-9 focus:outline-none focus:border-teal-600 transition-colors"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Secure Credential Password Field Wrapper */}
          <div className="space-y-1">
            <label className="tracking-wide">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 pl-9 pr-9 focus:outline-none focus:border-teal-600 transition-colors"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Matrix and Forgot Password Action Rows */}
          <div className="flex items-center justify-between text-[11px] pt-1">
            {/* <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="remember_me"
                checked={credentials.remember_me}
                onChange={handleInputChange}
                className="w-3.5 h-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 accent-teal-600"
              />
              <span className="font-semibold text-slate-400">Remember me</span>
            </label> */}
            <span className="text-teal-600 font-bold hover:underline cursor-pointer">
              Forgot Password?
            </span>
          </div>

          {/* Primary Action Core Submission Controllers */}
          <div className="pt-3 space-y-4 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-md transition-all cursor-pointer active:scale-[0.99]"
            >
              {isSubmitting ? "Loging in..." : "Login to Control Center"}
            </button>
            {/* <p className="text-[11px] font-medium text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-teal-600 text-bold hover:underline cursor-pointer"
              >
                Signup
              </Link> */}
            {/* </p> */}
          </div>
        </form>
      </div>
    </div>
  );
}
