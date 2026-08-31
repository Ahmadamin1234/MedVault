import React, { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteConfirmModal({
  itemName,
  title = "Delete Supplier",
  message,
  onCancel,
  onConfirm,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await onConfirm();
    } catch (error) {
      console.error("Delete failed:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">

      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {title}
              </h3>

              <p className="text-[11px] text-slate-400">
                This action cannot be undone.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

        {/* Body */}
        <div className="p-5">

          <p className="text-xs text-slate-600 leading-5">
            {message || (
              <>
                Are you sure you want to delete{" "}
                <strong className="text-slate-800">
                  {itemName}
                </strong>
                ?
              </>
            )}
          </p>

          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3 text-[11px] text-amber-700">
            Existing purchase history may depend on this supplier.
            If the supplier is already used by a purchase order,
            Django may prevent deletion.
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-5 border-t border-slate-100">

          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />

            {isDeleting
              ? "Deleting..."
              : "Delete Supplier"}
          </button>

        </div>

      </div>

    </div>
  );
}