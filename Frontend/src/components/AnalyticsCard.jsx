import React from 'react';

export default function AnalyticsCards({ summaryData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData?.map((item, idx) => (
        <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-28">
          <div>
            <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">{item.title}</p>
            <h3 className="text-xl font-black text-slate-900 mt-1.5 tracking-tight">{item.value}</h3>
          </div>
          <p className={`text-[10px] font-bold ${
            item.isTarget ? 'text-teal-600/70' : item.isPositive ? 'text-emerald-500' : 'text-rose-500'
          }`}>
            {item.change}
          </p>
        </div>
      ))}
    </div>
  );
}
