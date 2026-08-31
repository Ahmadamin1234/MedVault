import React from 'react';

export default function PerformanceGrids({ topSelling, performance }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      {/* Top Selling Horizontal Progress Tracks */}
      <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Top Selling Drugs (Units Sold)</h4>
        <div className="space-y-4">
          {topSelling?.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">{item.name}</span>
                <span className="text-slate-400 font-medium text-[11px]">{item.units} units</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full transition-all duration-500" style={{ width: item.percentage }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Performance Trends Data Matrix */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Category Performance Trend</h4>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse text-xs font-bold">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 tracking-wider uppercase">
                <th className="pb-2">Category</th>
                <th className="pb-2">Q1 Rev</th>
                <th className="pb-2">Q2 Rev</th>
                <th className="pb-2 text-center">6Mo Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600 font-semibold">
              {performance?.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 text-slate-800 font-bold">{row.category}</td>
                  <td className="py-3 text-slate-400">{row.q1}</td>
                  <td className="py-3 text-teal-600 font-bold">{row.q2}</td>
                  <td className="py-3 text-center">
                    <div className="w-14 h-6 mx-auto">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 60 20">
                        <path d={row.sparkPath} fill="none" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
