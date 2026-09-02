export default function RecentBilling({ billingData = [] }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-0">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Recent Billing Activity
          </h4>

          <p className="text-[10px] text-slate-400 mt-1">
            Latest completed transactions
          </p>
        </div>

        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-1 rounded">
          Last 5
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 tracking-wider uppercase bg-slate-50/50">
              <th className="py-2.5 px-4">Drug Name</th>

              <th className="py-2.5 px-4 text-center">Qty</th>

              <th className="py-2.5 px-4">Customer</th>

              <th className="py-2.5 px-4 text-right">Amount</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {billingData.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-10 text-center text-slate-400">
                  No recent billing activity.
                </td>
              </tr>
            ) : (
              billingData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {row.name}
                  </td>

                  <td className="py-3 px-4 text-center text-slate-400">
                    {row.qty}
                  </td>

                  <td className="py-3 px-4 text-slate-500">{row.user}</td>

                  <td className="py-3 px-4 text-right">
                    <div className="font-bold text-slate-900">{row.price}</div>

                    <div className="text-[9px] text-slate-400 mt-0.5">
                      {row.time}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
