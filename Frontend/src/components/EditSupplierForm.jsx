import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { updateSupplier } from "../data/authApi";

export default function EditSupplierForm({
  supplier,
  onCancel,
  onUpdated,
}) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);

      const payload = {
        name: formData.get("name"),
        representative_name: formData.get("representative_name"),
        representative_role: formData.get("representative_role"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        payment_terms: formData.get("payment_terms"),
        lead_time: formData.get("lead_time"),
        tier: formData.get("tier"),
        rating: Number(formData.get("rating")),
      };

      await updateSupplier(
        supplier.id,
        payload
      );

      await onUpdated();

    } catch (requestError) {
      console.error(
        "Failed to update supplier:",
        requestError
      );

      setError(
        requestError.message ||
        "Failed to update supplier."
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="bg-teal-50 border border-teal-100 rounded-lg p-3 text-teal-800 font-semibold text-sm">
        Edit Supplier Profile
      </div>


      {/* ============================================================
          INFORMATION
      ============================================================ */}

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-blue-800 text-xs font-medium">

        Update the supplier information below and save the changes.

      </div>


      {/* ============================================================
          FORM
      ============================================================ */}

      <form
        id="edit-supplier-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-xs"
      >

        {/* ==========================================================
            SUPPLIER NAME
        ========================================================== */}

        <div className="space-y-1">

          <label className="font-bold text-slate-500">
            Supplier Name *
          </label>

          <input
            name="name"
            type="text"
            required
            defaultValue={supplier.name || ""}
            placeholder="e.g. ABC Pharmaceuticals"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />

        </div>


        {/* ==========================================================
            REPRESENTATIVE NAME
        ========================================================== */}

        <div className="space-y-1">

          <label className="font-bold text-slate-500">
            Representative Name *
          </label>

          <input
            name="representative_name"
            type="text"
            required
            defaultValue={
              supplier.contact?.name ||
              supplier.rep ||
              ""
            }
            placeholder="e.g. Ahmed Khan"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />

        </div>


        {/* ==========================================================
            REPRESENTATIVE ROLE
        ========================================================== */}

        <div className="space-y-1">

          <label className="font-bold text-slate-500">
            Representative Role *
          </label>

          <input
            name="representative_role"
            type="text"
            required
            defaultValue={
              supplier.representative_role ||
              supplier.contact?.role ||
              ""
            }
            placeholder="e.g. Sales Manager"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />

        </div>


        {/* ==========================================================
            PHONE
        ========================================================== */}

        <div className="space-y-1">

          <label className="font-bold text-slate-500">
            Phone *
          </label>

          <input
            name="phone"
            type="tel"
            required
            defaultValue={
              supplier.phone ||
              supplier.contact?.phone ||
              ""
            }
            placeholder="e.g. +92 300 1234567"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />

        </div>


        {/* ==========================================================
            EMAIL
        ========================================================== */}

        <div className="space-y-1">

          <label className="font-bold text-slate-500">
            Email *
          </label>

          <input
            name="email"
            type="email"
            required
            defaultValue={
              supplier.email ||
              supplier.contact?.email ||
              ""
            }
            placeholder="e.g. sales@company.com"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />

        </div>


        {/* ==========================================================
            PAYMENT TERMS
        ========================================================== */}

        <div className="space-y-1">

          <label className="font-bold text-slate-500">
            Payment Terms *
          </label>

          <select
            name="payment_terms"
            required
            defaultValue={
              supplier.payment_terms ||
              supplier.terms?.window ||
              "Net 30 Days"
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          >

            <option value="Net 30 Days">
              Net 30 Days
            </option>

            <option value="Net 60 Days">
              Net 60 Days
            </option>

            <option value="COD">
              COD
            </option>

          </select>

        </div>


        {/* ==========================================================
            LEAD TIME
        ========================================================== */}

        <div className="space-y-1">

          <label className="font-bold text-slate-500">
            Lead Time *
          </label>

          <input
            name="lead_time"
            type="text"
            required
            defaultValue={
              supplier.lead_time ||
              supplier.terms?.leadTime ||
              ""
            }
            placeholder="e.g. 5-7 Days"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />

        </div>


        {/* ==========================================================
            SUPPLIER TIER
        ========================================================== */}

        <div className="space-y-1 relative">

          <label className="font-bold text-slate-500">
            Supplier Tier *
          </label>

          <select
            name="tier"
            required
            defaultValue={
              supplier.tier ||
              "TIER-2 STANDARD"
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 appearance-none font-medium text-slate-800 focus:outline-none focus:border-teal-500 pr-8"
          >

            <option value="TIER-1 PREFERRED">
              TIER-1 PREFERRED
            </option>

            <option value="TIER-2 STANDARD">
              TIER-2 STANDARD
            </option>

            <option value="TIER-3 BACKUP">
              TIER-3 BACKUP
            </option>

          </select>

          <ChevronDown
            className="w-4 h-4 text-slate-400 absolute right-3 top-8 pointer-events-none"
          />

        </div>


        {/* ==========================================================
            RATING
        ========================================================== */}

        <div className="space-y-1">

          <label className="font-bold text-slate-500">
            Rating *
          </label>

          <input
            name="rating"
            type="number"
            min="0"
            max="5"
            step="1"
            required
            defaultValue={
              supplier.rating ?? 0
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />

          <p className="text-[10px] text-slate-400">
            Rating must be between 0 and 5.
          </p>

        </div>


        {/* ==========================================================
            LAST SHIPMENT
        ========================================================== */}

        <div className="space-y-1">

          <label className="font-bold text-slate-500">
            Last Shipment
          </label>

          <input
            type="text"
            value={
              supplier.lastShipment ||
              "No shipments yet"
            }
            disabled
            className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-500"
          />

          <p className="text-[10px] text-slate-400">
            Shipment information is updated automatically when purchase orders are received.
          </p>

        </div>

      </form>


      {/* ============================================================
          ERROR
      ============================================================ */}

      {error && (

        <p className="text-xs font-semibold text-rose-700 bg-rose-50 rounded-lg px-3 py-2">

          {error}

        </p>

      )}


      {/* ============================================================
          FOOTER
      ============================================================ */}

      <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">

        {/* CANCEL */}

        <button
          onClick={onCancel}
          type="button"
          disabled={isSubmitting}
          className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-500 hover:bg-slate-50 transition-colors text-xs disabled:opacity-50"
        >
          Cancel
        </button>


        {/* UPDATE */}

        <button
          form="edit-supplier-form"
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-sm transition-colors text-xs disabled:opacity-50"
        >

          {isSubmitting
            ? "Updating..."
            : "Update Supplier"}

        </button>

      </div>

    </div>
  );
}