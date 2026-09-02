import React, { useState } from "react";

export default function RecentBillingLogs({
  logsData,
}) {
  // ============================================================
  // PAGINATION
  // ============================================================

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const totalInvoices = logsData?.length || 0;

  const totalPages = Math.ceil(
    totalInvoices / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const currentInvoices =
    logsData?.slice(startIndex, endIndex) || [];


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


  // ============================================================
  // PAGE CHANGE
  // ============================================================

  const goToPage = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
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
          All Invoices
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
                Payment Method
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

            {/* ==================================================
                NO DATA
            ================================================== */}

            {currentInvoices.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="py-10 text-center text-slate-400"
                >
                  No billing records yet.
                </td>

              </tr>

            ) : (

              currentInvoices.map((log) => (

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


                  {/* PAYMENT METHOD */}

                  <td className="py-2.5 px-4">

                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold">

                      {log.paymentMethod ||
                        log.payment_method ||
                        "Cash"}

                    </span>

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


      {/* ========================================================
          PAGINATION FOOTER
      ========================================================= */}

      {totalInvoices > 0 && (

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">

          {/* ====================================================
              TOTAL INVOICES
          ==================================================== */}

          <div className="text-xs font-semibold text-slate-500">

            Total Invoices:

            <span className="ml-1 font-bold text-slate-800">
              {totalInvoices}
            </span>

          </div>


          {/* ====================================================
              PAGINATION
          ==================================================== */}

          <div className="flex items-center gap-1">

            {/* PREVIOUS */}

            <button
              onClick={() =>
                goToPage(currentPage - 1)
              }
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 rounded-md hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>


            {/* PAGE NUMBERS */}

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (

              <button
                key={page}
                onClick={() =>
                  goToPage(page)
                }
                className={`min-w-7 h-7 px-2 text-xs font-bold rounded-md transition-colors ${
                  currentPage === page
                    ? "bg-teal-600 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >

                {page}

              </button>

            ))}


            {/* NEXT */}

            <button
              onClick={() =>
                goToPage(currentPage + 1)
              }
              disabled={
                currentPage === totalPages
              }
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 rounded-md hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>

          </div>

        </div>

      )}

    </div>

  );
}