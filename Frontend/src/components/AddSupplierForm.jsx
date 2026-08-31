import React, { useState } from "react";
import { Building2, User, Phone, Mail, Clock } from "lucide-react";
import { createSupplier } from "../data/authApi";

export default function AddSupplierForm({ onCancel, onCreated }) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");
  setIsSubmitting(true);

  try {
    const formData = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );

    await createSupplier(formData);

    await onCreated();

  } catch (requestError) {
    console.error("Failed to create supplier:", requestError);

    setError(
      requestError.message || "Failed to create supplier."
    );

  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 animate-fadeIn">
      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-emerald-800 font-semibold text-sm">
        New Supplier Registration Setup
      </div>

      <form
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs"
        onSubmit={handleSubmit}
      >
        <div className="space-y-1 relative">
          <label className="font-bold text-slate-500">Supplier Name *</label>
          <div className="relative">
            <input
              name="name"
              type="text"
              required
              placeholder="e.g., Pfizer Laboratories"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium pr-8 focus:border-teal-500 focus:outline-none"
            />
            <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="space-y-1 relative">
          <label className="font-bold text-slate-500">
            Representative Name *
          </label>
          <div className="relative">
            <input
              name="representative_name"
              type="text"
              required
              placeholder="e.g., Rajesh Kumar"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium pr-8 focus:border-teal-500 focus:outline-none"
            />
            <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-500">
            Representative Role *
          </label>
          <input
            name="representative_role"
            type="text"
            required
            placeholder="e.g., Director Distribution"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1 relative">
          <label className="font-bold text-slate-500">Contact Phone *</label>
          <div className="relative">
            <input
              name="phone"
              type="text"
              required
              placeholder="+91 22 6650 3000"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium pr-8 focus:border-teal-500 focus:outline-none"
            />
            <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="space-y-1 relative">
          <label className="font-bold text-slate-500">Contact Email *</label>
          <div className="relative">
            <input
              name="email"
              type="email"
              required
              placeholder="orders@supplier.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium pr-8 focus:border-teal-500 focus:outline-none"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-500">Payment Terms *</label>
          <select
            name="payment_terms"
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 appearance-none font-medium text-slate-800 focus:border-teal-500 focus:outline-none pr-8"
          >
            <option>Net 30 Days</option>
            <option>Net 60 Days</option>
            <option>COD (Cash on Delivery)</option>
          </select>
        </div>

        <div className="space-y-1 relative">
          <label className="font-bold text-slate-500">
            Lead Delivery Time *
          </label>
          <div className="relative">
            <input
              name="lead_time"
              type="text"
              required
              placeholder="e.g., 3-5 Business Days"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium pr-8 focus:border-teal-500 focus:outline-none"
            />
            <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-500">Supplier Tier</label>
          <select
            name="tier"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 appearance-none font-medium text-slate-800 focus:border-teal-500 focus:outline-none pr-8"
          >
            <option>TIER-1 PREFERRED</option>
            <option>TIER-2 STANDARD</option>
            <option>TIER-3 BACKUP</option>
          </select>
        </div>
        {error && (
          <p className="lg:col-span-3 text-xs font-semibold text-rose-700 bg-rose-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-4 lg:col-span-3">
          <button
            onClick={onCancel}
            type="button"
            disabled={isSubmitting}
            className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-sm transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save Supplier Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
