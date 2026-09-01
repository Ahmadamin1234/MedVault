import React from "react";

export default function PerformanceGrids({
  topSelling = [],
  performance = [],
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* =====================================================
          TOP SELLING DRUGS
      ====================================================== */}

      <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-5">
          Top Selling Drugs (Units Sold)
        </h4>

        <div className="space-y-4">
          {topSelling.length > 0 ? (
            topSelling.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                {/* Drug name + units */}

                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">
                    {item.name || "Unknown Drug"}
                  </span>

                  <span className="text-slate-400 font-medium text-[11px]">
                    {item.units || 0} units
                  </span>
                </div>

                {/* Progress bar */}

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all duration-500"
                    style={{
                      width: item.percentage || "0%",
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No sales data available.
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          PAYMENT PERFORMANCE
      ====================================================== */}

      {/* Payment Performance */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
          Payment Performance
        </h4>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 tracking-wider uppercase">
                <th className="pb-2">Payment Method</th>

                <th className="pb-2">Transactions</th>

                <th className="pb-2 text-right">Revenue</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {performance?.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3">
                    <span className="font-bold text-slate-800">
                      {row.method}
                    </span>
                  </td>

                  <td className="py-3 text-slate-500">{row.transactions}</td>

                  <td className="py-3 text-right font-bold text-teal-600">
                    {row.revenue}
                  </td>
                </tr>
              ))}

              {!performance?.length && (
                <tr>
                  <td
                    colSpan="3"
                    className="py-8 text-center text-slate-400 italic"
                  >
                    No payment transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
