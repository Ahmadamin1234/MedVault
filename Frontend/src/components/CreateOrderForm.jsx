import { useState } from "react";
import { Calendar, ChevronDown, Plus, Trash2 } from "lucide-react";
import { createPurchaseOrder } from "../data/authApi";

export default function CreateOrderForm({
  suppliers,
  medications,
  onCancel,
  onCreated,
}) {
  const [items, setItems] = useState([
    {
      medication: "",
      quantity: 1,
      unit_cost: "",
      expiry_date: "",
    },
  ]);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateItem = (index, field, value) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        medication: "",
        quantity: 1,
        unit_cost: "",
        expiry_date: "",
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;

    setItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!suppliers.length) {
      setError("Add at least one supplier before creating an order.");
      return;
    }

    if (!medications.length) {
      setError("Add at least one medication before creating an order.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const supplier = formData.get("supplier");
    const expectedDelivery = formData.get("expectedDelivery");
    const paymentTerms = formData.get("payment_terms");

    if (!supplier || !expectedDelivery || !paymentTerms) {
      setError("Please complete all purchase order information.");
      return;
    }

    const incompleteItem = items.some(
      (item) =>
        !item.medication ||
        !item.quantity ||
        Number(item.quantity) <= 0 ||
        !item.unit_cost ||
        Number(item.unit_cost) <= 0 ||
        !item.expiry_date
    );

    if (incompleteItem) {
      setError(
        "Complete medication, quantity, unit cost and expiry date for every item."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await createPurchaseOrder({
        supplier: Number(supplier),

        expectedDelivery: expectedDelivery,

        payment_terms: paymentTerms,

        items: items.map((item) => ({
          medication: Number(item.medication),

          quantity: Number(item.quantity),

          unit_cost: item.unit_cost,

          expiry_date: item.expiry_date,
        })),
      });

      await onCreated();
    } catch (requestError) {
      console.error(
        "Failed to create purchase order:",
        requestError
      );

      setError(
        requestError.message ||
          "Failed to create purchase order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">

      {/* Header */}
      <div className="bg-teal-50 border border-teal-100 rounded-lg p-3 text-teal-800 font-semibold text-sm">
        New Purchase Order Registration Setup
      </div>

      <form
        className="space-y-6 text-xs"
        onSubmit={handleSubmit}
      >

        {/* Purchase Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Supplier */}
          <div className="space-y-1 relative">

            <label className="font-bold text-slate-500">
              Select Supplier *
            </label>

            <select
              name="supplier"
              required
              defaultValue=""
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 appearance-none font-medium text-slate-800 focus:border-teal-500 focus:outline-none pr-8"
            >
              <option value="" disabled>
                Select supplier
              </option>

              {suppliers.map((supplier) => (
                <option
                  key={supplier.id}
                  value={supplier.id}
                >
                  {supplier.name}
                </option>
              ))}
            </select>

            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-8 pointer-events-none" />

          </div>

          {/* Expected Delivery */}
          <div className="space-y-1 relative">

            <label className="font-bold text-slate-500">
              Expected Delivery Date *
            </label>

            <div className="relative">

              <input
                name="expectedDelivery"
                type="date"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:border-teal-500 focus:outline-none pr-8"
              />

              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />

            </div>

          </div>

          {/* Payment Terms */}
          <div className="space-y-1">

            <label className="font-bold text-slate-500">
              Payment Terms *
            </label>

            <select
              name="payment_terms"
              required
              defaultValue="Net 30 Days"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:border-teal-500 focus:outline-none"
            >
              <option>Net 30 Days</option>
              <option>Net 60 Days</option>
              <option>COD</option>
            </select>

          </div>

        </div>

        {/* Order Items */}
        <div className="space-y-2">

          <label className="font-bold text-slate-500 block">
            Order Items List
          </label>

          <div className="border border-slate-200 rounded-xl overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full text-left border-collapse">

                <thead>

                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">

                    <th className="p-3">
                      Item / Drug Profile
                    </th>

                    <th className="p-3 w-28 text-center">
                      Quantity
                    </th>

                    <th className="p-3 w-36">
                      Unit Cost
                    </th>

                    <th className="p-3 w-40">
                      Expiry Date
                    </th>

                    <th className="p-3 w-20 text-center">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100 font-medium">

                  {items.map((item, index) => (

                    <tr key={index}>

                      {/* Medication */}
                      <td className="p-3">

                        <select
                          value={item.medication}
                          onChange={(event) =>
                            updateItem(
                              index,
                              "medication",
                              event.target.value
                            )
                          }
                          className="w-full bg-transparent outline-none text-slate-800"
                          required
                        >

                          <option value="">
                            Select medication
                          </option>

                          {medications.map(
                            (medication) => (

                              <option
                                key={medication.id}
                                value={medication.id}
                              >
                                {medication.name}
                              </option>

                            )
                          )}

                        </select>

                      </td>

                      {/* Quantity */}
                      <td className="p-3">

                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(
                              index,
                              "quantity",
                              event.target.value
                            )
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-center font-bold"
                          required
                        />

                      </td>

                      {/* Unit Cost */}
                      <td className="p-3">

                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.unit_cost}
                          onChange={(event) =>
                            updateItem(
                              index,
                              "unit_cost",
                              event.target.value
                            )
                          }
                          placeholder="0.00"
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 font-bold"
                          required
                        />

                      </td>

                      {/* Expiry Date */}
                      <td className="p-3">

                        <div className="relative">

                          <input
                            type="date"
                            value={item.expiry_date}
                            min={
                              new Date()
                                .toISOString()
                                .split("T")[0]
                            }
                            onChange={(event) =>
                              updateItem(
                                index,
                                "expiry_date",
                                event.target.value
                              )
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 font-medium text-slate-800 focus:border-teal-500 focus:outline-none"
                            required
                          />

                        </div>

                      </td>

                      {/* Delete Row */}
                      <td className="p-3 text-center">

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(index)
                          }
                          disabled={items.length === 1}
                          className="text-slate-400 hover:text-rose-500 p-1 disabled:opacity-30"
                          title="Remove item"
                        >

                          <Trash2 className="w-4 h-4" />

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* Add Item */}
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 text-teal-600 font-bold hover:text-teal-700 py-1"
          >

            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />

            Add Another Row Item

          </button>

        </div>

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
            className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-500 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-sm disabled:opacity-50"
          >

            {isSubmitting
              ? "Submitting..."
              : "Submit Purchase Order"}

          </button>

        </div>

      </form>

    </div>
  );
}