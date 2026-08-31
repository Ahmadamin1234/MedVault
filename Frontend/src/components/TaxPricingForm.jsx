import React, { useState } from 'react';

export default function TaxPricingForm() {
  // Input State Management
  const [taxRate, setTaxRate] = useState('8.25%');
  const [taxId, setTaxId] = useState('TX-77-98216-01');
  const [markup, setMarkup] = useState('35.00%');
  const [maxDiscount, setMaxDiscount] = useState('20.00%');
  const [copayAmount, setCopayAmount] = useState('$15.00');

  // Toggle Switches State Management
  const [taxExempt, setTaxExempt] = useState(true);
  const [acceptInsurance, setAcceptInsurance] = useState(true);
  const [bcbsActive, setBcbsActive] = useState(true);
  const [aetnaActive, setAetnaActive] = useState(true);
  const [unitedActive, setUnitedActive] = useState(false);

  const handleFormSave = (e) => {
    e.preventDefault();
    alert("Tax rules & operational pricing parameters saved successfully!");
  };

  return (
    <form onSubmit={handleFormSave} className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-xs font-semibold text-slate-500 animate-fadeIn">
      
      {/* 1. SECTION HEADER TRACER STRIP */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-800">Tax Configuration & Pricing Rules</h3>
        <button type="submit" className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95">
          Save Changes
        </button>
      </div>

      {/* 2. TAX CONFIGURATION PANEL */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tax Configuration</h4>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
            <div className="space-y-1">
              <label className="font-bold text-slate-400">Default Tax Rate (%) *</label>
              <input type="text" required value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-600" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-400">Tax ID Number</label>
              <input type="text" value={taxId} onChange={(e) => setTaxId(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-600" />
            </div>
          </div>

          {/* Tax Exempt Toggle Card */}
          <div className="w-full md:w-80 flex items-center justify-between bg-slate-50/50 p-4 border border-slate-100 rounded-xl md:mt-4">
            <div className="space-y-0.5 pr-4">
              <span className="font-bold text-slate-800 block">Tax-Exempt Prescriptions</span>
              <span className="text-slate-400 text-[10px] font-medium leading-normal block">Automatically apply 0% tax to certified prescription products</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" checked={taxExempt} onChange={() => setTaxExempt(!taxExempt)} className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>
        </div>
      </div>

      {/* 3. PRICING RULES & MARGINS PANEL */}
      <div className="space-y-4 border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pricing Rules & Margins</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-400">Default Markup Rate (%) *</label>
            <input type="text" required value={markup} onChange={(e) => setMarkup(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-600" />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-400">Rounding Rule</label>
            <select className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-700 focus:outline-none focus:border-teal-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23CBCCCD%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_14px_center] bg-no-repeat">
              <option>Nearest cent ($0.01)</option>
              <option>Nearest nickel ($0.05)</option>
              <option>Nearest dollar ($1.00)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-400">Maximum Permitted Discount</label>
            <input type="text" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-600" />
          </div>
        </div>
      </div>

      {/* 4. INSURANCE & COPAY RULES PANEL */}
      <div className="space-y-4 border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Insurance & Copay Rules</h4>
        
        {/* Insurance Activation Toggle Row */}
        <div className="flex items-center justify-between max-w-xl pb-2">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-700 block">Accept Insurance Plans</span>
            <span className="text-slate-400 text-[10px] font-medium leading-normal block">Enable third-party adjudications and copay splitting at checkout</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" checked={acceptInsurance} onChange={() => setAcceptInsurance(!acceptInsurance)} className="sr-only peer" />
            <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
          </label>
        </div>

        {/* Fallback Copay Field */}
        <div className="space-y-1 max-w-xs pt-1">
          <label className="font-bold text-slate-400">Default Flat Copay Amount (fallback)</label>
          <input type="text" value={copayAmount} onChange={(e) => setCopayAmount(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-600" />
        </div>

        {/* 5. INSURANCE CUSTOM CO-OP DIRECTORY GRID */}
        <div className="border border-slate-100 rounded-xl overflow-hidden mt-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-4 w-[45%]">Provider Name</th>
                <th className="py-2.5 px-4 w-[45%]">Plan Type</th>
                <th className="py-2.5 px-4 text-right pr-6 w-[10%]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-600">
              
              {/* Row 1 */}
              <tr className="hover:bg-slate-50/30 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-800">Blue Cross Blue Shield</td>
                <td className="py-3 px-4 text-slate-400 font-medium">PPO / HMO</td>
                <td className="py-3 px-4 text-right pr-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={bcbsActive} onChange={() => setBcbsActive(!bcbsActive)} className="sr-only peer" />
                    <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
                  </label>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-slate-50/30 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-800">Aetna Health</td>
                <td className="py-3 px-4 text-slate-400 font-medium">Commercial Medicare</td>
                <td className="py-3 px-4 text-right pr-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={aetnaActive} onChange={() => setAetnaActive(!aetnaActive)} className="sr-only peer" />
                    <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
                  </label>
                  </td>
                </tr>
                              {/* Row 3 */}
              <tr className="hover:bg-slate-50/30 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-800">UnitedHealthcare</td>
                <td className="py-3 px-4 text-slate-400 font-medium">Managed Medicaid</td>
                <td className="py-3 px-4 text-right pr-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={unitedActive} 
                      onChange={() => setUnitedActive(!unitedActive)} 
                      className="sr-only peer" 
                    />
                    <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
                  </label>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </form>
  );
}

