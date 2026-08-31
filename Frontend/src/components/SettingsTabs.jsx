import React from "react";
import { useNavigate } from "react-router-dom";
export default function SettingsTabs({ currentSubTab, setCurrentSubTab }) {
  const tabs = [
    "General",
    "Store Info",
    "Tax & Pricing",
    "Notifications",
    "Backup & Data",
    "Security",
    "Integrations",
  ];
  const navigate = useNavigate();

  return (
    <div className="w-full md:w-56 bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setCurrentSubTab(tab)}
          className={`w-full text-left px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            currentSubTab === tab
              ? "bg-teal-50 text-teal-700 font-bold"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          {tab}
        </button>
      ))}

      
    </div>
  );
}
