import React from 'react';
import { ShoppingCart, Truck, CheckCircle, DollarSign } from 'lucide-react';

const iconMap = {
  ShoppingCart: ShoppingCart,
  Truck: Truck,
  CheckCircle: CheckCircle,
  DollarSign: DollarSign
};

export default function POSummary({ summaryData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData?.map((item, idx) => {
        const Icon = iconMap[item.icon] || ShoppingCart;
        return (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color} shrink-0`}>
              <Icon className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{item.value}</h3>
              <p className="text-xs font-medium text-slate-400 mt-0.5">{item.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
