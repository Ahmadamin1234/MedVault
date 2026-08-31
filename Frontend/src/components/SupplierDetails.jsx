import React from 'react';
import { Truck, User, Phone, Mail } from 'lucide-react';

export default function SupplierDetails({ details }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 sticky top-6">
      
      {/* Header Profile Title Identification */}
      <div className="text-center py-2 space-y-2">
        <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4 text-left">Supplier Profile Details</h4>
        <div className="w-14 h-14 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center mx-auto text-teal-600">
          <Truck className="w-6 h-6 stroke-[2]" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-800">{details.name}</h3>
          <span className="inline-block bg-teal-50 text-teal-600 font-extrabold text-[9px] tracking-widest px-2 py-0.5 rounded-md border border-teal-100 uppercase mt-1">
            {details.tier}
          </span>
        </div>
      </div>

      {/* Primary Contact Row */}
      <div className="space-y-2.5 text-xs">
        <h5 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Primary Contact Info</h5>
        <div className="space-y-2 font-medium text-slate-600">
          <p className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-800">{details.contact.name}</span>
            <span className="text-slate-400 text-[11px]">({details.contact.role})</span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400" /> {details.contact.phone}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400" /> {details.contact.email}
          </p>
        </div>
      </div>

      {/* Contractual Parameters Wrapper */}
      <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4">
        <h5 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Contractual Terms</h5>
        <div className="space-y-2 font-medium">
          <div className="flex justify-between">
            <span className="text-slate-400">Payment Window</span>
            <span className="font-bold text-slate-800">{details.terms.window}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Lead Delivery Time</span>
            <span className="font-bold text-slate-800">{details.terms.leadTime}</span>
          </div>
        </div>
      </div>

      {/* Service Performance Analysis Gauges */}
      <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4">
        <h5 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Service Level Performance</h5>
        <div className="space-y-2 font-medium">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">On-Time Delivery Rate</span>
            <span className="font-extrabold text-emerald-500">{details.performance.deliveryRate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Order Accuracy Rate</span>
            <span className="font-extrabold text-teal-600">{details.performance.accuracyRate}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
