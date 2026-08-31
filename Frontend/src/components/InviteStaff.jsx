import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react"; // 🍏 Added CheckCircle for success feedback
import { createStaff } from "../data/authApi";

export default function InviteStaff({ isOpen, onClose, onCreated }) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // 🍏 FIX 1: Success state tracker

  if (!isOpen) return null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await createStaff(
        Object.fromEntries(new FormData(e.currentTarget).entries()),
      );
      
      // 🍏 FIX 2: Trigger success visual state on successful API return
      setIsSuccess(true);
      
      // Delay closing and reloading the background data table for 2 seconds 
      // so the admin can read the success message
      setTimeout(async () => {
        await onCreated();
        setIsSuccess(false); // Reset for next time
      }, 2500);

    } catch (requestError) {
      setError(requestError.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden relative p-6">
        
        {/* 🍏 FIX 3: Dynamic Success Screen Render */}
        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Invitation Transmitted</h4>
              <p className="text-xs font-semibold text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                The account has been securely hashed. High-strength credentials have been sent directly to their email inbox.
              </p>
            </div>
          </div>
        ) : (
          /* Standard Input Form Schema Matrix */
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">
                Invite New Team Member
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="e.g. elena@medvault.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="0300 0000000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Assign Role</label>
                <select
                  name="role"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                >
                  <option value="Technician">Technician</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Billing Clerk">Billing Clerk</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                </select>
              </div>

              {error && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  {error}
                </p>
              )}

              <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 border border-slate-200 rounded-lg font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
