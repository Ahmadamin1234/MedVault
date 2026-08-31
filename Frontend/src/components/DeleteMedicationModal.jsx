import React from "react";
import { Trash2, X } from "lucide-react";

export default function DeleteMedicationModal({
  medication,
  onCancel,
  onConfirm,
  isDeleting,
}) {
  if (!medication) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">

      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-rose-600" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Delete Medication
              </h2>

              <p className="text-[10px] text-slate-400">
                Permanent inventory action
              </p>
            </div>

          </div>

          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>

        </div>


        {/* Content */}
        <div className="px-5 py-5">

          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to delete this medication?
          </p>

          {/* Medication name */}
          <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">

            <p className="text-sm font-bold text-slate-800">
              {medication.name}
            </p>

            <p className="text-[10px] text-slate-400 mt-1">
              SKU: {medication.sku}
            </p>

          </div>

          <p className="text-[10px] text-rose-600 font-medium mt-3">
            This action cannot be undone.
          </p>

        </div>


        {/* Footer */}
        <div className="flex justify-end items-center gap-2 px-5 py-4 border-t border-slate-100">

          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}