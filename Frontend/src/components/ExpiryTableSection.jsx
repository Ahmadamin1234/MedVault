import React, { useState } from "react";
import { resolveExpiry } from "../data/authApi";

export default function ExpiryTableSection({
  headerText,
  headerBg,
  items,
  sectionType,
  onResolved,
}) {
  const [processingId, setProcessingId] = useState(null);

  const handleAction = async (item, action) => {
    setProcessingId(item.id);
    try {
      await resolveExpiry(item.id, action);
      await onResolved();
    } finally {
      setProcessingId(null);
    }
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Dynamic Sub-header Categorization Line */}
      <div
        className={`p-3 text-xs font-bold ${headerBg} border-b border-slate-200 tracking-wide`}
      >
        {headerText}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 tracking-wider uppercase bg-slate-50/50">
              <th className="py-2.5 px-6 w-[22%]">Drug Name</th>
              <th className="py-2.5 px-4 w-[12%]">Batch No.</th>
              <th className="py-2.5 px-4 w-[12%]">Expiry Date</th>
              <th className="py-2.5 px-4 w-[12%] text-center">
                Days Remaining
              </th>
              <th className="py-2.5 px-4 w-[12%] text-center">Stock Qty</th>
              <th className="py-2.5 px-4 w-[12%] text-center">Value at Risk</th>
              <th className="py-2.5 px-6 w-[18%] text-center">
                Resolution Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/30 transition-colors"
              >
                <td className="py-3 px-6 font-bold text-slate-800">
                  {item.medicationName}
                </td>
                <td className="py-3 px-4 font-mono text-slate-400 text-[11px] font-semibold">
                  {item.batchNo}
                </td>
                <td className="py-3 px-4 text-slate-500 font-semibold">
                  {item.expiryDate}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold border tracking-wide uppercase ${
                      sectionType === "EXPIRED"
                        ? "bg-rose-50 text-rose-500 border-rose-100"
                        : item.color
                    }`}
                  >
                    {item.daysLeft}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-slate-500 font-semibold">
                  {item.stockQty}
                </td>
                <td
                  className={`py-3 px-4 text-center font-extrabold ${sectionType === "EXPIRED" ? "text-rose-500" : "text-slate-900"}`}
                >
                  {item.valueAtRisk}
                </td>
                <td className="py-3 px-6 text-center">
                  {sectionType === "EXPIRED" && (
                    <button
                      disabled={processingId === item.id}
                      onClick={() => handleAction(item, "DISPOSE")}
                      className="w-full py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg text-[10px] tracking-wide shadow-sm transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {processingId === item.id
                        ? "Recording..."
                        : "Dispose / Log Loss"}
                    </button>
                  )}
                  {sectionType === "30_DAYS" && (
                    <div className="flex gap-2 justify-center">
                      <button
                        disabled={processingId === item.id}
                        onClick={() => handleAction(item, "RETURN")}
                        className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-[10px] transition-colors cursor-pointer disabled:opacity-60"
                      >
                        Return Supplier
                      </button>
                      <button
                        disabled={processingId === item.id}
                        onClick={() => handleAction(item, "TRANSFER")}
                        className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-[10px] shadow-sm transition-colors cursor-pointer disabled:opacity-60"
                      >
                        Transfer Store
                      </button>
                    </div>
                  )}
                  {sectionType === "90_DAYS" && (
                    <button
                      disabled={processingId === item.id}
                      onClick={() => handleAction(item, "CLEARANCE")}
                      className="w-full py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-[10px] transition-colors cursor-pointer disabled:opacity-60"
                    >
                      Mark Clearance Sale
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
