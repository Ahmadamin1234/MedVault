import React from "react";


export default function RecentBillingLogs({
  logsData,
}) {


  // ============================================================
  // STATUS BADGE
  // ============================================================

  const getStatusBadge = (status) => {

    switch (status) {

      case "Completed":

        return "bg-emerald-50 text-emerald-600 border-emerald-100";

      case "On Hold":

        return "bg-amber-50 text-amber-500 border-amber-100";

      case "Returned":

        return "bg-rose-50 text-rose-500 border-rose-100";

      default:

        return "bg-slate-50 text-slate-500 border-slate-100";

    }

  };


  return (

    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">


      {/* ========================================================
          HEADER
      ========================================================= */}

      <div className="flex justify-between items-center">

        <h3 className="text-sm font-bold text-slate-800">

          Recent POS Billing Logs

        </h3>


        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">

          Last 5 Sales

        </span>

      </div>


      {/* ========================================================
          TABLE
      ========================================================= */}

      <div className="overflow-x-auto">

        <table className="w-full text-left border-collapse text-xs">


          <thead>

            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">

              <th className="py-2 px-4">
                Invoice ID
              </th>

              <th className="py-2 px-4">
                Customer
              </th>

              <th className="py-2 px-4">
                Amount Paid
              </th>

              <th className="py-2 px-4">
                Timestamp
              </th>

              <th className="py-2 px-4 text-center">
                Status
              </th>

            </tr>

          </thead>


          <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">


            {!logsData ||
            logsData.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="py-10 text-center text-slate-400"
                >

                  No billing records yet.

                </td>

              </tr>

            ) : (

              logsData.map((log) => (

                <tr
                  key={log.id}
                  className="hover:bg-slate-50/30 transition-colors"
                >


                  {/* INVOICE */}

                  <td className="py-2.5 px-4 font-mono font-bold text-teal-600">

                    {log.invoiceId}

                  </td>


                  {/* CUSTOMER */}

                  <td className="py-2.5 px-4 text-slate-800">

                    {log.customer ||
                      "Walk-in Customer"}

                  </td>


                  {/* AMOUNT */}

                  <td className="py-2.5 px-4 font-black text-slate-900">

                    {log.amount}

                  </td>


                  {/* TIME */}

                  <td className="py-2.5 px-4 text-slate-400 font-medium">

                    {log.time}

                  </td>


                  {/* STATUS */}

                  <td className="py-2.5 px-4 text-center">

                    <span
                      className={`inline-block px-2 py-0.5 text-[9px] font-extrabold rounded border uppercase ${getStatusBadge(
                        log.status
                      )}`}
                    >

                      {log.status ||
                        "Completed"}

                    </span>

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