import React from "react";
import {
  Search,
  Download,
  Printer,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function InventoryTable({
  data,
  searchQuery,
  setSearchQuery,
  onEdit,
  onDelete,
}) {
  // Helper to dynamically theme status values from image references
  const getStatusStyles = (status) => {
    switch (status) {
      case "IN STOCK":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "LOW STOCK":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "OUT OF STOCK":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Search and Action Toolbar controls */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inventory catalog..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
          {/* <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">
            Filters Applied: None
          </span> */}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          {/* <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-rose-50 border border-rose-100 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button> */}
        </div>
      </div>

      {/* Main Core Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              <th className="py-3 px-6">Drug Name</th>
              <th className="py-3 px-6">Generic Name</th>
              <th className="py-3 px-6">SKU</th>
              <th className="py-3 px-6">Category</th>
              <th className="py-3 px-6 text-center">Stock</th>
              <th className="py-3 px-6 text-center">Reorder</th>
              <th className="py-3 px-6">Price</th>
              <th className="py-3 px-6">Supplier</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
            {data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-3.5 px-6 font-semibold text-slate-900">
                  {item.name}
                </td>
                <td className="py-3.5 px-6 text-slate-500 italic">
                  {item.generic}
                </td>
                <td className="py-3.5 px-6 font-mono text-slate-400">
                  {item.sku}
                </td>
                <td className="py-3.5 px-6">{item.category}</td>
                <td className="py-3.5 px-6 text-center font-medium text-slate-900">
                  {item.stock}
                </td>
                <td className="py-3.5 px-6 text-center text-slate-500">
                  {item.reorder}
                </td>
                <td className="py-3.5 px-6 font-medium text-slate-900">
                  {item.price}
                </td>
                <td className="py-3.5 px-6 text-slate-500">{item.supplier_name}</td>
                <td className="py-3.5 px-6 text-center">
                  <span
                    className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-md border tracking-wide uppercase ${getStatusStyles(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="px-2.5 py-1 text-[10px] font-semibold rounded-md border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(item)}
                      className="px-2.5 py-1 text-[10px] font-semibold rounded-md border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan="10"
                  className="py-8 text-center text-slate-400 text-sm"
                >
                  No matching medications found in catalog view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white text-xs text-slate-500">
        <span>Showing 1-{data.length} of 2,847 medications</span>

        <div className="flex items-center gap-1">
          <button className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-400 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center font-semibold rounded bg-teal-600 text-white shadow-sm">
            1
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">
            2
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">
            3
          </button>
          <button className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-600">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
