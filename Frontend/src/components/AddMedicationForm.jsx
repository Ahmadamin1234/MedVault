import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { createMedication } from "../data/authApi";

export default function AddMedicationForm({ onCancel, onCreated }) {
  const [formType, setFormType] = useState("Capsule");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);

      await createMedication({
        name: formData.get("name"),
        generic: formData.get("generic"),
        sku: formData.get("sku"),
        price: formData.get("price"),
        ndc: formData.get("ndc"),
        category: formData.get("category"),
        form_type: formData.get("form_type"),
        reorder: formData.get("reorder"),
        shelf_location: formData.get("shelf_location"),
        manufacturer: formData.get("manufacturer"),
        clinical_notes: formData.get("clinical_notes"),
      });

      await onCreated();
    } catch (requestError) {
      console.error("Failed to create medication:", requestError);
      setError(
        requestError.message || "Failed to create medication."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">

      {/* Header */}
      <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-3 text-emerald-800 font-semibold text-sm">
        Medication Profile Registration
      </div>

      {/* Information */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-blue-800 text-xs font-medium">
        New medicines are added to the catalog with <strong>0 stock</strong>.
        Stock, supplier, purchase cost, and expiry date are recorded through
        Purchase Orders when new stock is purchased.
      </div>

      <form
        id="medication-form"
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
            placeholder="e.g. Amoxicillin 500mg"
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
            placeholder="e.g. AMX-500-CAP"
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-mono rounded-lg p-2.5 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Sale Price */}
        <div className="space-y-1">
          <label className="font-bold text-slate-500">
            Unit Sale Price *
          </label>

          <input
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="0.00"
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
            placeholder="e.g. Amoxicillin Trihydrate"
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
            placeholder="e.g. 0093-3109-05"
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
            defaultValue=""
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 appearance-none font-medium text-slate-800 focus:outline-none focus:border-teal-500 pr-8"
          >
            <option value="" disabled>
              Select category
            </option>

            <option value="Antibiotics">
              Antibiotics
            </option>

            <option value="Cardiac">
              Cardiac
            </option>

            <option value="Painkillers">
              Painkillers
            </option>

            <option value="Vitamins">
              Vitamins
            </option>

            <option value="Anesthetics">
              Anesthetics
            </option>

            <option value="Surgicals">
              Surgicals
            </option>
          </select>

          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-8 pointer-events-none" />
        </div>

        {/* Reorder Level */}
        <div className="space-y-1">
          <label className="font-bold text-slate-500">
            Reorder Alert Level *
          </label>

          <input
            name="reorder"
            type="number"
            min="0"
            required
            defaultValue="50"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Form Type */}
        <div className="space-y-2 lg:col-span-2">
          <label className="font-bold text-slate-500 block">
            Form / Drug Type *
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              "Tablet",
              "Capsule",
              "Liquid",
              "Injection",
            ].map((type) => (
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
            ))}
          </div>
        </div>

        {/* Shelf Location */}
        <div className="space-y-1">
          <label className="font-bold text-slate-500">
            Shelf / Bin Location
          </label>

          <input
            name="shelf_location"
            type="text"
            placeholder="e.g. Bay-3 / Row-A"
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
            placeholder="e.g. Aurobindo Pharma"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Stock Information */}
        <div className="space-y-1">
          <label className="font-bold text-slate-500">
            Initial Stock
          </label>

          <input
            type="text"
            value="0"
            disabled
            className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-500"
          />

          <p className="text-[10px] text-slate-400">
            Stock is added through Purchase Orders.
          </p>
        </div>

        {/* Clinical Notes */}
        <div className="space-y-1 lg:col-span-2">
          <label className="font-bold text-slate-500">
            Usage Description / Clinical Notes
          </label>

          <textarea
            name="clinical_notes"
            rows="4"
            placeholder="Enter clinical notes or usage description..."
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

      {/* Footer */}
      <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">

        <button
          onClick={onCancel}
          type="button"
          disabled={isSubmitting}
          className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-500 hover:bg-slate-50 transition-colors text-xs"
        >
          Cancel
        </button>

        <div className="flex items-center gap-2">

          <button
            type="submit"
            form="medication-form"
            disabled={isSubmitting}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-sm transition-colors text-xs"
          >
            {isSubmitting
              ? "Saving..."
              : "Save Drug Profile"}
          </button>

        </div>

      </div>
    </div>
  );
}