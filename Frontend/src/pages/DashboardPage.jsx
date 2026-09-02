import React, { useEffect, useState } from "react";
import { getDashboardAnalytics } from "../data/authApi";

import StatCards from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import DrugCategories from "../components/DrugCategories";
import RecentBilling from "../components/RecentBilling";
import LowStockItems from "../components/LowStockItems";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardAnalytics();

        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err?.message ||
            "Unable to load dashboard analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-teal-600 font-semibold animate-pulse">
          Loading Dashboard Metrics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-xl p-6 text-center shadow-sm">
          <h2 className="text-sm font-bold text-rose-600">
            Dashboard Loading Failed
          </h2>

          <p className="text-xs text-slate-500 mt-2">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <main className="h-full min-h-0 overflow-y-auto p-8 space-y-6 bg-slate-50">

      {/* STAT CARDS */}
      <StatCards
        statsData={dashboardData.stats || []}
      />

      {/* REVENUE + CATEGORIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">
          <RevenueChart
            data={dashboardData.revenueTrend || []}
          />
        </div>

        <div>
          <DrugCategories
            categoriesData={dashboardData.categories || []}
          />
        </div>

      </div>

      {/* BILLING + LOW STOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2">
          <RecentBilling
            billingData={dashboardData.billing || []}
          />
        </div>

        <div>
          <LowStockItems
            stockData={dashboardData.lowStock || []}
          />
        </div>

      </div>

    </main>
  );
}