import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  Printer,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function InventoryTable({
  data = [],
  searchQuery,
  setSearchQuery,
  onEdit,
  onDelete,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Number of medicines shown on one page
  const itemsPerPage = 10;

  // --------------------------------------------------
  // STATUS STYLES
  // --------------------------------------------------

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

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredData = useMemo(() => {
    const query = searchQuery?.toLowerCase().trim();

    if (!query) {
      return data;
    }

    return data.filter((item) => {
      return (
        item.name?.toLowerCase().includes(query) ||
        item.generic?.toLowerCase().includes(query) ||
        item.sku?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.supplier_name?.toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery]);

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const totalItems = filteredData.length;

  const totalPages = Math.ceil(
    totalItems / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const currentData = filteredData.slice(
    startIndex,
    endIndex
  );

  // When search changes, go back to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // If deleting the last item on a page
  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // --------------------------------------------------
  // PAGINATION FUNCTIONS
  // --------------------------------------------------

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((page) => page + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  };

  // --------------------------------------------------
  // EXPORT CSV
  // --------------------------------------------------

  const handleExport = () => {
    if (!filteredData.length) {
      alert("No inventory data to export.");
      return;
    }

    const headers = [
      "Drug Name",
      "Generic Name",
      "SKU",
      "Category",
      "Stock",
      "Reorder",
      "Price",
      "Supplier",
      "Status",
    ];

    const rows = filteredData.map((item) => [
      item.name || "",
      item.generic || "",
      item.sku || "",
      item.category || "",
      item.stock ?? 0,
      item.reorder ?? 0,
      item.price ?? 0,
      item.supplier_name || "",
      item.status || "",
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "inventory.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------
  // PRINT
  // --------------------------------------------------

  const handlePrint = () => {
    const printWindow = window.open(
      "",
      "_blank",
      "width=1200,height=800"
    );

    if (!printWindow) {
      alert("Please allow popups to print inventory.");
      return;
    }

    const rows = filteredData
      .map(
        (item) => `
          <tr>
            <td>${item.name || ""}</td>
            <td>${item.generic || ""}</td>
            <td>${item.sku || ""}</td>
            <td>${item.category || ""}</td>
            <td>${item.stock ?? 0}</td>
            <td>${item.reorder ?? 0}</td>
            <td>${item.price ?? 0}</td>
            <td>${item.supplier_name || ""}</td>
            <td>${item.status || ""}</td>
          </tr>
        `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Inventory Report</title>

          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
            }

            h1 {
              margin-bottom: 5px;
            }

            p {
              color: #666;
              margin-bottom: 20px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }

            th,
            td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }

            th {
              background: #f5f5f5;
              font-weight: bold;
            }

            @media print {
              body {
                padding: 10px;
              }
            }
          </style>
        </head>

        <body>

          <h1>Inventory Report</h1>

          <p>
            Total Medications: ${filteredData.length}
          </p>

          <table>

            <thead>
              <tr>
                <th>Drug Name</th>
                <th>Generic Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Reorder</th>
                <th>Price</th>
                <th>Supplier</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              ${rows}
            </tbody>

          </table>

        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

    printWindow.close();
  };

  // --------------------------------------------------
  // PAGE NUMBERS
  // --------------------------------------------------

  const getPageNumbers = () => {
    const pages = [];

    for (let page = 1; page <= totalPages; page++) {
      pages.push(page);
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">

      {/* SEARCH + ACTIONS */}

      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">

        <div className="flex items-center gap-4">

          <div className="relative w-64">

            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search inventory catalog..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
            />

          </div>

        </div>

        <div className="flex items-center gap-2">

          {/* EXPORT */}

          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />

            Export
          </button>

          {/* PRINT */}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />

            Print
          </button>

        </div>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full text-left border-collapse">

          <thead>

            <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">

              <th className="py-3 px-6">
                Drug Name
              </th>

              <th className="py-3 px-6">
                Generic Name
              </th>

              <th className="py-3 px-6">
                SKU
              </th>

              <th className="py-3 px-6">
                Category
              </th>

              <th className="py-3 px-6 text-center">
                Stock
              </th>

              <th className="py-3 px-6 text-center">
                Reorder
              </th>

              <th className="py-3 px-6">
                Price
              </th>

              <th className="py-3 px-6">
                Supplier
              </th>

              <th className="py-3 px-6 text-center">
                Status
              </th>

              <th className="py-3 px-6 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-600">

            {currentData.map((item) => (

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

                <td className="py-3.5 px-6">
                  {item.category}
                </td>

                <td className="py-3.5 px-6 text-center font-medium text-slate-900">
                  {item.stock}
                </td>

                <td className="py-3.5 px-6 text-center text-slate-500">
                  {item.reorder}
                </td>

                <td className="py-3.5 px-6 font-medium text-slate-900">
                  {item.price}
                </td>

                <td className="py-3.5 px-6 text-slate-500">
                  {item.supplier_name || "-"}
                </td>

                <td className="py-3.5 px-6 text-center">

                  <span
                    className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-md border tracking-wide uppercase ${getStatusStyles(
                      item.status
                    )}`}
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

            {currentData.length === 0 && (

              <tr>

                <td
                  colSpan="10"
                  className="py-8 text-center text-slate-400 text-sm"
                >
                  No matching medications found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white text-xs text-slate-500">

        {/* REAL DATABASE/FILTERED COUNT */}

        <span>

          Showing{" "}

          {totalItems === 0
            ? 0
            : startIndex + 1}

          -

          {Math.min(
            endIndex,
            totalItems
          )}{" "}

          of{" "}

          <span className="font-bold text-slate-700">
            {totalItems}
          </span>{" "}

          medications

        </span>

        {/* PAGINATION BUTTONS */}

        <div className="flex items-center gap-1">

          {/* PREVIOUS */}

          <button
            onClick={previousPage}
            disabled={currentPage === 1}
            className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* PAGE NUMBERS */}

          {getPageNumbers().map((page) => (

            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-7 h-7 flex items-center justify-center font-semibold rounded ${
                currentPage === page
                  ? "bg-teal-600 text-white shadow-sm"
                  : "border border-slate-200 hover:bg-slate-50 text-slate-600"
              }`}
            >
              {page}
            </button>

          ))}

          {/* NEXT */}

          <button
            onClick={nextPage}
            disabled={
              currentPage === totalPages ||
              totalPages === 0
            }
            className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
}