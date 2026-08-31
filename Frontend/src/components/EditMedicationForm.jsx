import React, { useState } from "react";
import {ChevronDown } from "lucide-react";
import {
  updateMedication
} from "../data/authApi";

export default function EditMedicationForm({
  medication,
  onCancel,
  onUpdated,
}) {
  const [formType, setFormType] = useState(medication.form_type);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);

      const payload = Object.fromEntries(formData.entries());

      await updateMedication(medication.id, payload);

      onUpdated();
    } catch (requestError) {
      console.error("Failed to update medication:", requestError);

      setError(
        requestError.message || "Failed to update medication."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">

      {/* Header */}
      <div className="bg-teal-50 border border-teal-100 rounded-lg p-3 text-teal-800 font-semibold text-sm">
        Edit Medication Profile
      </div>

      <form
        id="edit-medication-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-xs"
      >

        {/* Form Type */}
        <input
          type="hidden"
          name="form_type"
          value={formType}
        />

        {/* Medication Name */}
        <div className="space-y-1">
          <label className="font-bold text-slate-500">
            Medication Name *
          </label>

          <input
            name="name"
            type="text"
            required
            defaultValue={medication.name}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* SKU */}
        <div className="space-y-1">
          <label className="font-bold text-slate-500">
            SKU *
          </label>

          <input
            name="sku"
            type="text"
            required
            defaultValue={medication.sku}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-mono rounded-lg p-2.5"
          />
        </div>

        {/* Sale Price */}
        <div className="space-y-1">
          <label className="font-bold text-slate-500">
            Unit Sale Price ($) *
          </label>

          <input
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={medication.price}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Generic Name */}
        <div className="space-y-1">
          <label className="font-bold text-slate-500">
            Generic Name *
          </label>

          <input
            name="generic"
            type="text"
            required
            defaultValue={medication.generic}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Stock */}
        <div className="space-y-1">
          <label className="font-bold text-slate-500">
            Stock Quantity *
          </label>

          <input
            name="stock"
            type="number"
            min="0"
            required
            defaultValue={medication.stock}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* NDC */}
        <div className="space-y-1">
          <label className="font-bold text-slate-500">
            National Drug Code (NDC) *
          </label>

          <input
            name="ndc"
            type="text"
            required
            defaultValue={medication.ndc}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Category */}
        <div className="space-y-1 relative">
          <label className="font-bold text-slate-500">
            Category *
          </label>

          <select
            name="category"
            required
            defaultValue={medication.category}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 appearance-none font-medium text-slate-800 focus:outline-none focus:border-teal-500 pr-8"
          >
            <option>Antibiotics</option>
            <option>Cardiac</option>
            <option>Painkillers</option>
            <option>Anesthetics</option>
            <option>Vitamins</option>
            <option>Surgicals</option>
          </select>

          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-8 pointer-events-none" />
        </div>

        {/* Reorder */}
        <div className="space-y-1">
          <label className="font-bold text-slate-500">
            Reorder Alert Level *
          </label>

          <input
            name="reorder"
            type="number"
            min="0"
            required
            defaultValue={medication.reorder}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Form Type */}
        <div className="space-y-2 lg:col-span-2">
          <label className="font-bold text-slate-500 block">
            Form / Drug Type *
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["Tablet", "Capsule", "Liquid", "Injection"].map(
              (type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormType(type)}
                  className={`flex items-center justify-center p-2.5 border rounded-lg font-medium transition-all gap-2 ${
                    formType === type
                      ? "border-teal-600 text-teal-700 bg-teal-50/50 font-bold ring-1 ring-teal-600"
                      : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      formType === type
                        ? "border-teal-600"
                        : "border-slate-300"
                    }`}
                  >
                    {formType === type && (
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    )}
                  </div>

                  {type}
                </button>
              )
            )}
          </div>
        </div>

        {/* Shelf */}
        <div className="space-y-1">
          <label className="font-bold text-slate-500">
            Shelf / Bin Location
          </label>

          <input
            name="shelf_location"
            type="text"
            defaultValue={medication.shelf_location}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Manufacturer */}
        <div className="space-y-1">
          <label className="font-bold text-slate-500">
            Manufacturer *
          </label>

          <input
            name="manufacturer"
            type="text"
            required
            defaultValue={medication.manufacturer}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Clinical Notes */}
        <div className="space-y-1 lg:col-span-2">
          <label className="font-bold text-slate-500">
            Usage Description / Clinical Notes
          </label>

          <textarea
            name="clinical_notes"
            rows="4"
            defaultValue={medication.clinical_notes}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500 resize-none"
          />
        </div>
      </form>

      {/* Error */}
      {error && (
        <p className="text-xs font-semibold text-rose-700 bg-rose-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Buttons */}
      <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">

        <button
          onClick={onCancel}
          type="button"
          className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-500 hover:bg-slate-50 transition-colors text-xs"
        >
          Cancel
        </button>

        <button
          form="edit-medication-form"
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-sm transition-colors text-xs"
        >
          {isSubmitting ? "Updating..." : "Update Medication"}
        </button>

      </div>
    </div>
  );
}