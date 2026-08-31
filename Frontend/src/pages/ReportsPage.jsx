import React, { useState, useEffect } from "react";
import { Calendar, Download, FileText, Printer } from "lucide-react";
import AnalyticsCards from "../components/AnalyticsCard";
import AnalyticsCharts from "../components/AnalyticsCharts";
import PerformanceGrids from "../components/PerformanceGrids";
import { getReportsAnalytics } from "../data/authApi";

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Dynamic label for current operational year
  const currentYear = new Date().getFullYear();

  const downloadCsv = () => {
    if (!data) return;

    const summaryRows = data.summary?.map((item) => [item.title, item.value]) || [];
    const topSellingRows = data.topSelling?.map((item) => [item.name, item.units]) || [];

    const rows = [
      ["Metric", "Value"],
      ...summaryRows,
      [],
      ["Top Selling Drug", "Units Sold"],
      ...topSellingRows,
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    link.download = `medvault-report-${currentYear}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  useEffect(() => {
    getReportsAnalytics()
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading reports analytics:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50 min-h-screen">
        <div className="text-teal-600 font-semibold animate-pulse text-sm">
          Compiling Analytical Matrix Streams...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 p-8 text-center text-rose-500 bg-slate-50 min-h-screen flex flex-col items-center justify-center gap-2">
        <p className="font-semibold">Failed to compile analytical data matrix streams.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-md transition-colors"
        >
          Reload Dashboard Workspace
        </button>
      </div>
    );
  }

  return (
    <main className="h-full overflow-y-auto p-8 bg-slate-50 space-y-6 animate-fadeIn print:h-auto print:overflow-visible print:bg-white print:p-0">
      {/* Dynamic Sub-action Filter Toolbar Grid Header */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-xs font-bold text-slate-600">
        <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <Calendar className="w-4 h-4 text-slate-400" />
          Year To Date (Jan 1 - Dec 31, {currentYear})
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" /> Export PDF
          </button>
          <button
            onClick={downloadCsv}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" /> Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print Report
          </button>
        </div>
      </div>

      <AnalyticsCards summaryData={data.summary || []} />
      <AnalyticsCharts
        revenueTrend={data.revenueTrend || []}
        salesByCategory={data.salesByCategory || []}
      />
      <PerformanceGrids
        topSelling={data.topSelling || []}
        performance={data.performance || []}
      />
    </main>
  );
}
