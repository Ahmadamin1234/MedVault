import React, { useEffect, useState } from "react";
import {
  Plus,
  Info,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

import { useOutletContext } from "react-router-dom";

import SupplierCard from "../components/SupplierCard";
import SupplierDetails from "../components/SupplierDetails";
import AddSupplierForm from "../components/AddSupplierForm";
import EditSupplierForm from "../components/EditSupplierForm";

import {
  getSuppliers,
  deleteSupplier,
} from "../data/authApi";


export default function SuppliersPage() {

  const { setHeaderOverride } = useOutletContext();

  const [data, setData] = useState({
    suppliers: [],
    selected: null,
  });

  const [loading, setLoading] = useState(true);

  const [isAdding, setIsAdding] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Load Suppliers
  |--------------------------------------------------------------------------
  */

  const loadSuppliers = async (selectedId = null) => {

    try {

      setLoading(true);
      setError("");

      const suppliers = await getSuppliers();

      let selectedSupplier = null;

      if (selectedId) {

        selectedSupplier =
          suppliers.find(
            (supplier) => supplier.id === selectedId
          ) || null;

      }

      if (!selectedSupplier) {
        selectedSupplier = suppliers[0] || null;
      }

      setData({
        suppliers,
        selected: selectedSupplier,
      });

    } catch (requestError) {

      console.error(
        "Failed to load suppliers:",
        requestError
      );

      setError(
        requestError.message ||
        "Failed to load suppliers."
      );

    } finally {

      setLoading(false);

    }
  };


  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadSuppliers();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Header
  |--------------------------------------------------------------------------
  */

  const handleToggleForm = (showForm) => {

    setIsAdding(showForm);
    setIsEditing(false);

    setHeaderOverride(
      showForm
        ? "Add New Supplier"
        : ""
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Select Supplier
  |--------------------------------------------------------------------------
  */

  const handleSelectedSupplier = (supplier) => {

    setData((prev) => ({
      ...prev,
      selected: supplier,
    }));

  };


  /*
  |--------------------------------------------------------------------------
  | Edit Supplier
  |--------------------------------------------------------------------------
  */

  const handleEdit = () => {

    if (!data.selected) {
      return;
    }

    setIsEditing(true);
    setIsAdding(false);

    setHeaderOverride(
      "Edit Supplier"
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Cancel Edit
  |--------------------------------------------------------------------------
  */

  const handleCancelEdit = () => {

    setIsEditing(false);

    setHeaderOverride("");

  };


  /*
  |--------------------------------------------------------------------------
  | After Supplier Updated
  |--------------------------------------------------------------------------
  */

  const handleSupplierUpdated = async () => {

    const selectedId = data.selected?.id;

    await loadSuppliers(selectedId);

    setIsEditing(false);

    setHeaderOverride("");

  };


  /*
  |--------------------------------------------------------------------------
  | Delete Confirmation UI
  |--------------------------------------------------------------------------
  */

  const handleDeleteClick = () => {

    if (!data.selected) {
      return;
    }

    setSupplierToDelete(
      data.selected
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Cancel Delete
  |--------------------------------------------------------------------------
  */

  const handleCancelDelete = () => {

    if (isDeleting) {
      return;
    }

    setSupplierToDelete(null);

  };


  /*
  |--------------------------------------------------------------------------
  | Confirm Delete
  |--------------------------------------------------------------------------
  */

  const handleConfirmDelete = async () => {

    if (!supplierToDelete) {
      return;
    }

    try {

      setIsDeleting(true);
      setError("");

      const deletedId =
        supplierToDelete.id;

      await deleteSupplier(
        deletedId
      );

      setSupplierToDelete(null);

      await loadSuppliers();

    } catch (requestError) {

      console.error(
        "Failed to delete supplier:",
        requestError
      );

      setError(
        requestError.message ||
        "Failed to delete supplier."
      );

    } finally {

      setIsDeleting(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50">

        <div className="text-teal-600 font-semibold animate-pulse text-sm">

          Accessing Manufacturer Directories...

        </div>

      </div>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Add / Edit Form
  |--------------------------------------------------------------------------
  */

  if (isAdding) {

    return (
      <main className="h-full overflow-y-auto p-8 bg-slate-50">

        <AddSupplierForm

          onCancel={() =>
            handleToggleForm(false)
          }

          onCreated={async () => {

            await loadSuppliers();

            handleToggleForm(false);

          }}

        />

      </main>
    );

  }


  if (isEditing) {

    return (
      <main className="h-full overflow-y-auto p-8 bg-slate-50">

        <EditSupplierForm

          supplier={data.selected}

          onCancel={handleCancelEdit}

          onUpdated={handleSupplierUpdated}

        />

      </main>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Main Page
  |--------------------------------------------------------------------------
  */

  return (

    <main className="h-full overflow-y-auto p-8 bg-slate-50">

      <div className="space-y-6">

        {/* ============================================================
            TOP ACTIONS
        ============================================================ */}

        <div className="flex justify-between items-center">

          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">

            Contracted Manufacturers

          </h4>


          <button

            onClick={() =>
              handleToggleForm(true)
            }

            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"

          >

            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />

            Add New Supplier

          </button>

        </div>


        {/* ============================================================
            ERROR MESSAGE
        ============================================================ */}

        {error && (

          <div className="bg-rose-50 border border-rose-100 rounded-lg px-4 py-3 text-xs font-semibold text-rose-700">

            {error}

          </div>

        )}


        {/* ============================================================
            MAIN CONTENT
        ============================================================ */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">


          {/* ============================================================
              SUPPLIER LIST
          ============================================================ */}

          <div className="lg:col-span-2 space-y-4">

            {data.suppliers.map((supplier) => (

              <div

                key={supplier.id}

                onClick={() =>
                  handleSelectedSupplier(supplier)
                }

                className={`
                  cursor-pointer
                  rounded-xl
                  transition-all
                  duration-200

                  ${
                    data.selected?.id === supplier.id
                      ? "ring-2 ring-teal-600 shadow-md"
                      : "hover:shadow-sm"
                  }
                `}

              >

                <SupplierCard
                  supplier={supplier}
                />

              </div>

            ))}


            {/* ========================================================
                EMPTY STATE
            ======================================================== */}

            {data.suppliers.length === 0 && (

              <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 text-center">

                <Info className="w-8 h-8 text-slate-300 mx-auto mb-3" />

                <p className="text-slate-400 font-medium italic text-sm">

                  No contracted manufacturers found.

                </p>

                <p className="text-slate-400 text-xs mt-1">

                  Click "+ Add New Supplier" to initialize records.

                </p>

              </div>

            )}

          </div>


          {/* ============================================================
              RIGHT DETAILS PANEL
          ============================================================ */}

          <div className="sticky top-0">

            {data.selected ? (

              <div className="space-y-4">

                <SupplierDetails
                  details={data.selected}
                />


                {/* ======================================================
                    ACTION BUTTONS
                ====================================================== */}

                <div className="bg-white border border-slate-200 rounded-xl p-4">

                  <div className="flex gap-2">


                    {/* EDIT */}

                    <button

                      type="button"

                      onClick={handleEdit}

                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold transition-colors"

                    >

                      <Pencil className="w-3.5 h-3.5" />

                      Edit Supplier

                    </button>


                    {/* DELETE */}

                    <button

                      type="button"

                      onClick={handleDeleteClick}

                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"

                    >

                      <Trash2 className="w-3.5 h-3.5" />

                      Delete

                    </button>

                  </div>

                </div>

              </div>

            ) : (

              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-400 font-semibold text-xs flex items-center justify-center gap-2 py-12">

                <Info className="w-4 h-4 text-slate-300" />

                Select a manufacturer profile to review detailed performance metrics.

              </div>

            )}

          </div>

        </div>

      </div>


      {/* ================================================================
          DELETE CONFIRMATION OVERLAY
      ================================================================= */}

      {supplierToDelete && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Background */}

          <div

            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"

            onClick={handleCancelDelete}

          />


          {/* Confirmation Card */}

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">

            {/* Close */}

            <button

              type="button"

              onClick={handleCancelDelete}

              disabled={isDeleting}

              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40"

            >

              <X className="w-4 h-4" />

            </button>


            {/* Icon */}

            <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center mb-4">

              <AlertTriangle className="w-5 h-5 text-rose-500" />

            </div>


            {/* Title */}

            <h3 className="text-base font-bold text-slate-800">

              Delete Supplier?

            </h3>


            {/* Message */}

            <p className="text-xs text-slate-500 mt-2 leading-5">

              You are about to delete

              <span className="font-bold text-slate-700">

                {" "}{supplierToDelete.name}

              </span>

              . This action cannot be undone.

            </p>


            {/* Buttons */}

            <div className="flex justify-end gap-2 mt-6">

              <button

                type="button"

                onClick={handleCancelDelete}

                disabled={isDeleting}

                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"

              >

                Cancel

              </button>


              <button

                type="button"

                onClick={handleConfirmDelete}

                disabled={isDeleting}

                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm disabled:opacity-50 flex items-center gap-2"

              >

                <Trash2 className="w-3.5 h-3.5" />

                {isDeleting
                  ? "Deleting..."
                  : "Delete Supplier"}

              </button>

            </div>

          </div>

        </div>

      )}

    </main>

  );

}