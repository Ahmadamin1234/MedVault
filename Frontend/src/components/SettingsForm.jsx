import React, { useState } from "react";
import { updateSettings } from "../data/authApi";

export default function SettingsForm({ initialData }) {
  const [threshold, setThreshold] = useState(
    initialData.thresholds.lowStockThreshold,
  );
  const [autoReorder, setAutoReorder] = useState(
    initialData.thresholds.autoReorder,
  );
  const [criticalAlert, setCriticalAlert] = useState(
    initialData.channels.criticalLowAlert,
  );
  const [expiryWarning, setExpiryWarning] = useState(
    initialData.channels.batchExpiryWarning,
  );
  const [salesPdf, setSalesPdf] = useState(initialData.channels.dailySalesPdf);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaved("");
    setError("");
    setIsSaving(true);
    const form = new FormData(e.currentTarget);
    try {
      await updateSettings({
        general: {
          storeName: form.get("storeName"),
          timezone: form.get("timezone"),
          licenseNumber: form.get("licenseNumber"),
          currency: form.get("currency"),
          phone: form.get("phone"),
          address: form.get("address"),
        },
        thresholds: { lowStockThreshold: Number(threshold), autoReorder },
        channels: {
          criticalLowAlert: criticalAlert,
          batchExpiryWarning: expiryWarning,
          dailySalesPdf: salesPdf,
        },
      });
      setSaved("Settings saved successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-xs font-medium"
    >
      {/* Upper Preference Form Header Trigger Row */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-800">
          General Store Preferences
        </h3>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer active:scale-95"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      {saved && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          {saved}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
          {error}
        </p>
      )}

      {/* Inputs Configuration Matrix Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-1">
          <label className="font-bold text-slate-400">
            Pharmacy/Store Name
          </label>
          <input
            name="storeName"
            type="text"
            required
            defaultValue={initialData.general.storeName}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-700 focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="space-y-1">
          <label className="font-bold text-slate-400">
            Operational Timezone
          </label>
          <select
            name="timezone"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-700 focus:outline-none focus:border-teal-500 appearance-none"
          >
            <option>{initialData.general.timezone}</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="font-bold text-slate-400">
            License Registration Number
          </label>
          <input
            name="licenseNumber"
            type="text"
            required
            defaultValue={initialData.general.licenseNumber}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-700 focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="space-y-1">
          <label className="font-bold text-slate-400">System Currency</label>
          <select
            name="currency"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-700 focus:outline-none focus:border-teal-500 appearance-none"
          >
            <option>{initialData.general.currency}</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="font-bold text-slate-400">
            Primary Contact Phone
          </label>
          <input
            name="phone"
            type="text"
            required
            defaultValue={initialData.general.phone}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-700 focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="space-y-1">
          <label className="font-bold text-slate-400">
            Dispensary Street Address
          </label>
          <input
            name="address"
            type="text"
            required
            defaultValue={initialData.general.address}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-700 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Threshold Sliders Section Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center font-bold text-slate-800">
            <span>Critical Replenishment thresholds</span>
            <span className="text-teal-600 font-extrabold text-[11px]">
              {threshold} Units
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px]">
              Global Low Stock Threshold
            </span>
            <input
              type="range"
              min="5"
              max="100"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-50/50 p-4 border border-slate-100 rounded-xl">
          <div className="space-y-0.5 pr-4">
            <span className="font-bold text-slate-800 block">
              Auto-reorder Low Items
            </span>
            <span className="text-slate-400 text-[11px]">
              Instantly trigger purchase orders to supplier.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={autoReorder}
              onChange={() => setAutoReorder(!autoReorder)}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
          </label>
        </div>
      </div>

      {/* System Toggle Dispatch Alerts list channel lines */}
      <div className="border-t border-slate-100 pt-6 space-y-4">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          System Alert & Dispatch Channels
        </h4>

        <div className="divide-y divide-slate-100">
          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-bold text-slate-800 block">
                Critical Low Stock Alert
              </span>
              <span className="text-slate-400 text-[11px]">
                Instantly notify when stock touches zero.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={criticalAlert}
                onChange={() => setCriticalAlert(!criticalAlert)}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-bold text-slate-800 block">
                Batch Expiry Warning (30-day window)
              </span>
              <span className="text-slate-400 text-[11px]">
                Warn when a batch is 30 days near expiry date.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={expiryWarning}
                onChange={() => setExpiryWarning(!expiryWarning)}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-bold text-slate-800 block">
                Daily Sales Summary PDF
              </span>
              <span className="text-slate-400 text-[11px]">
                Receive daily performance digests over email.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={salesPdf}
                onChange={() => setSalesPdf(!salesPdf)}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
