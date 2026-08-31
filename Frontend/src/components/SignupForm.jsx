import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { register } from "../data/authApi";

export default function SignupForm() {
  const navigate = useNavigate();
  // 🍏 API-READY DATA STATE MODEL
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    pharmacy_name: "",
    password: "",
    confirm_password: "",
    agreed_to_terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync keyboard entry actions to state model objects
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🍏 FUTURE DJANGO REST + JWT FETCH PIPELINE
  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side structural match checking before hitting backend lines
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreed_to_terms) {
      setError("You must accept the terms before creating an account.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(formData);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-white p-8 sm:p-12 flex flex-col justify-center items-center overflow-y-auto h-full">
      <div className="w-full max-w-md space-y-6 text-left">
        {/* Title Blocks */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Register your dispensary hub to begin professional compliance
            tracking
          </p>
        </div>
        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {error}
          </p>
        )}

        {/* Core Submission Matrix Forms */}
        <form
          onSubmit={handleFormSubmission}
          className="space-y-4 text-xs font-bold text-slate-500"
        >
          {/* Grid Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Dr. Sarah Jenkins"
                className="w-full font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-teal-600 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="sarah.j@medvault.com"
                className="w-full font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-teal-600 transition-colors"
              />
            </div>
          </div>

          {/* Grid Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone_number"
                required
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className="w-full font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-teal-600 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label>Pharmacy Name</label>
              <input
                type="text"
                name="pharmacy_name"
                required
                value={formData.pharmacy_name}
                onChange={handleInputChange}
                placeholder="Central Rx Dispensary"
                className="w-full font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-teal-600 transition-colors"
              />
            </div>
          </div>

          {/* Password Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1 relative">
              <label>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 pr-9 focus:outline-none focus:border-teal-600 transition-colors"
                />
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

            {/* Confirm Password */}
            <div className="space-y-1 relative">
              <label>Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  required
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 pr-9 focus:outline-none focus:border-teal-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Legal Compliance Checkboxes */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="agreed_to_terms"
                checked={formData.agreed_to_terms}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 accent-teal-600 mt-0.5 shrink-0"
              />
              <span className="text-[11px] font-medium text-slate-400 leading-normal">
                I agree to the{" "}
                <span className="text-teal-600 font-bold hover:underline">
                  Terms & Conditions
                </span>{" "}
                and FDA security compliance mandates.
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-3 space-y-4 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-[0.99]"
            >
              {isSubmitting
                ? "Creating account..."
                : "Register Pharmacy & Create Vault"}
            </button>
            <p className="text-[11px] font-medium text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-teal-600 font-bold hover:underline cursor-pointer"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
