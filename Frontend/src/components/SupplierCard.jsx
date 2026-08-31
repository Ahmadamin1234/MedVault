import React from 'react';
import { Star, Building2 } from 'lucide-react';

export default function SupplierCard({ supplier , onEdit, onDelete}) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative hover:border-slate-300 transition-all">
      {/* Top Banner Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">{supplier.name}</h4>
            <p className="text-[10px] text-slate-400 font-medium">Rep: {supplier.rep}</p>
          </div>
        </div>
        <span className={`w-2 h-2 rounded-full mt-1 ${supplier.statusColor}`} />
      </div>

      {/* Metrics Center Segment */}
      <div className="mt-5 space-y-1.5 text-xs font-medium border-t border-b border-slate-50 py-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-[11px]">Total Drugs Supplied</span>
          <span className="text-slate-800 font-bold">{supplier.totalDrugs}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-[11px]">Last Shipment Date</span>
          <span className="text-slate-600 font-semibold">{supplier.lastShipment}</span>
        </div>
      </div>

      {/* Footer Interactive Controls */}
      <div className="flex justify-between items-center mt-3 pt-1">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < supplier.rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-200'}`} />
          ))}
        </div>
        
        <button className="text-[11px] font-bold text-teal-600 hover:text-teal-700 cursor-pointer">
          Configure Terms
        </button>
      </div>
    </div>
  );
}
