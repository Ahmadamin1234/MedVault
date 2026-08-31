import { useState, useEffect } from "react";
import ExpiryBanner from "../components/ExpiryBanner";
import ExpiryTableSection from "../components/ExpiryTableSection";
import { getExpiryAlerts } from "../data/authApi";

export default function ExpiryAlertsPage() {
  const [expiryData, setExpiryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    try {
      const data = await getExpiryAlerts();
      setExpiryData(data);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
    const refreshTimer = window.setInterval(loadAlerts, 30000);
    return () => {
      window.clearInterval(refreshTimer);
    };
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50">
        <div className="text-teal-600 font-semibold animate-pulse text-sm">
          Analyzing Catalog Lifecycle Batch Metrics...
        </div>
      </div>
    );
  }

  if (error && !expiryData) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50 text-sm font-semibold text-rose-700">
        {error}
      </div>
    );
  }

  // 🍏 SAFE EXTRACTION: Grabs the arrays directly from your views.py 'batches' key safely
  const batchList = Array.isArray(expiryData?.batches) ? expiryData.batches : [];

  const expiredBatches = batchList.filter((b) => b.type === "EXPIRED");
  const thirtyDayBatches = batchList.filter((b) => b.type === "30_DAYS");
  const ninetyDayBatches = batchList.filter((b) => b.type === "90_DAYS");

  return (
    <main className="h-full overflow-y-auto p-8 bg-slate-50 space-y-6">
      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
          {error}
        </p>
      )}
      
      {/* 🍏 UPDATED: Your summary data totals ($325 loss, etc.) sync live now */}
      <ExpiryBanner summary={expiryData?.summary} />

      {/* Table Section 1: Expired Batches */}
      <ExpiryTableSection
        headerText="Expired Batches (Immediate Action Required)"
        headerBg="bg-rose-50 text-rose-700"
        items={expiredBatches}
        sectionType="EXPIRED"
        onResolved={loadAlerts}
      />

      {/* Table Section 2: Expiring 30 Days */}
      <ExpiryTableSection
        headerText="Expiring Within 30 Days (Logistics window)"
        headerBg="bg-amber-50 text-amber-700"
        items={thirtyDayBatches}
        sectionType="30_DAYS"
        onResolved={loadAlerts}
      />

      {/* Table Section 3: Expiring 90 Days */}
      <ExpiryTableSection
        headerText="Expiring Within 90 Days (Under monitoring)"
        headerBg="bg-slate-50 text-slate-700"
        items={ninetyDayBatches}
        sectionType="90_DAYS"
        onResolved={loadAlerts}
      />
    </main>
  );
}
