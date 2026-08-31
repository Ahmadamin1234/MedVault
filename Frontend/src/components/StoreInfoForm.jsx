import React from 'react';
import { Upload } from 'lucide-react';

export default function StoreInfoForm() {
  const handleFormSave = (e) => {
    e.preventDefault();
    alert("Store information registry updated successfully!");
  };

  return (
    <form onSubmit={handleFormSave} className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-xs font-medium animate-fadeIn">
      
      {/* Form Top Section Header Bar */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-800">Pharmacy & Dispensary Information</h3>
        <button type="submit" className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95">
          Save Changes
        </button>
      </div>

      Row Block 1: Brand & Type Information
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Upload Logo Box Asset container placeholder */}
        {/* <div className="w-24 h-24 border border-dashed border-slate-200 rounded-lg bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 p-2 cursor-pointer hover:bg-slate-50 transition-colors shrink-0">
          <Upload className="w-4 h-4 mb-1 text-slate-400" />
          <span className="text-[9px] font-bold text-slate-400 text-center">Upload Logo</span>
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
          <div className="space-y-1">
            <label className="font-bold text-slate-400">Store Display Name *</label>
            <input type="text" required defaultValue="MedVault Pharmacy - Downtown Branch" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-none focus:border-teal-600" />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-400">Store Type</label>
            <select className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-none focus:border-teal-600 appearance-none">
              <option>Retail Pharmacy (Independent)</option>
              <option>Clinical Dispensary</option>
              <option>Hospital Pharmacy Hub</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row Block 2: National Identification Registers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5">
        <div className="space-y-1">
          <label className="font-bold text-slate-400">DEA Registration Number *</label>
          <input type="text" required defaultValue="BM8721649" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-mono font-semibold text-slate-800 focus:outline-none focus:border-teal-600" />
        </div>
        <div className="space-y-1">
          <label className="font-bold text-slate-400">National Provider Identifier (NPI) *</label>
          <input type="text" required defaultValue="1982736450" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-mono font-semibold text-slate-800 focus:outline-none focus:border-teal-600" />
        </div>
      </div>

      {/* Segment Block 3: Operating Business Timers Matrix */}
      <div className="space-y-3 border-t border-slate-100 pt-5">
        <h4 className="font-bold text-slate-800 text-[13px] tracking-tight">Operating Hours</h4>
        
        <div className="space-y-2">
          {/* Weekday Schedule lines */}
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="font-bold text-slate-700">Monday - Friday</span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-slate-600 font-bold">08:00 AM - 08:00 PM</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">Open</span>
            </div>
          </div>

          {/* Saturday Schedule lines */}
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="font-bold text-slate-700">Saturday</span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-slate-600 font-bold">09:00 AM - 05:00 PM</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">Open</span>
            </div>
          </div>

          {/* Sunday Schedule lines */}
          <div className="flex justify-between items-center py-2">
            <span className="font-bold text-slate-400">Sunday</span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-slate-300 font-medium">Closed</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase bg-rose-50 text-rose-500 border border-rose-100">Closed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row Block 4: Online Footprint & Communications Profile */}
      <div className="space-y-3 border-t border-slate-100 pt-5">
        <h4 className="font-bold text-slate-800 text-[13px] tracking-tight">Store Contact & Web Presence</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-400">Public Email Address</label>
            <input type="email" defaultValue="downtown@medvaultrx.com" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-700 focus:outline-none focus:border-teal-600" />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-400">Fax Number</label>
            <input type="text" defaultValue="+1 (555) 902-1244" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-700 focus:outline-none focus:border-teal-600" />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-400">Website URL</label>
            <input type="url" defaultValue="https://www.medvaultrx.com/downtown" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-700 focus:outline-none focus:border-teal-600" />
          </div>
        </div>
      </div>

    </form>
  );
}
