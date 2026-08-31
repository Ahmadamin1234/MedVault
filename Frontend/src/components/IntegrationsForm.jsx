import React, { useState } from 'react';

export default function IntegrationsForm() {
  const [apiKey, setApiKey] = useState('mv_live_88a912c774fdab67d8a7c1e30901ea2b');
  const [webhookUrl, setWebhookUrl] = useState('https://medvaultrx.com');

  const handleFormSave = (e) => {
    e.preventDefault();
    alert("Integration connection preferences saved successfully!");
  };

  const handleRegenerateKey = () => {
    if (window.confirm("Are you sure you want to regenerate the active production API key? Existing system integrations will lose access immediately.")) {
      setApiKey('mv_live_' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2));
    }
  };

  const integrationsData = [
    { title: "POS Register Terminal", desc: "Synchronize store pricing and instant shelf depletion on checkout", connected: true },
    { title: "QuickBooks Online", desc: "Push purchase orders, margins, and sales tax to accounting ledger", connected: true },
    { title: "E-Prescribing (EPCS)", desc: "Secure electronic scripts directly from certified regional practitioners", connected: true },
    { title: "Rx Delivery Dispatch", desc: "Trigger local on-demand couriers for prescription home deliveries", connected: false },
    { title: "Insurance Adjudication Engine", desc: "Real-time copay estimates and plan coverage validation", connected: false },
    { title: "Hospital Lab Systems (HL7)", desc: "Sync custom compound requests and verify renal diagnostic checks", connected: true }
  ];

  return (
    <form onSubmit={handleFormSave} className="flex-1 w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-xs font-semibold text-slate-500 animate-fadeIn">
      
      {/* SECTION HEADER BLOCK */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-800">Connected Systems & APIs</h3>
        <button type="submit" className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95">
          Save Changes
        </button>
      </div>

      {/* 1. CONNECTED SERVICES CARD GRID */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Connected Services & Healthcare Hubs</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrationsData.map((service, idx) => (
            <div key={idx} className="border border-slate-100 rounded-xl p-4 flex flex-col justify-between space-y-3 bg-white hover:shadow-xs transition-shadow">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 block text-xs">{service.title}</span>
                  <span className="text-slate-400 text-[10px] font-medium leading-normal block">{service.desc}</span>
                </div>
                
                {/* Status Badge */}
                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wide uppercase border ${
                  service.connected 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}>
                  {service.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              {/* Action Button */}
              <div>
                {service.connected ? (
                  <button type="button" onClick={() => alert(`Configuring settings for ${service.title}`)} className="px-3 py-1.5 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors text-[10px] cursor-pointer">
                    Configure
                  </button>
                ) : (
                  <button type="button" onClick={() => alert(`Initiating handshake handshake loop for ${service.title}`)} className="px-3 py-1.5 border border-teal-200 text-teal-700 bg-teal-50/50 hover:bg-teal-50 rounded-lg font-bold transition-colors text-[10px] cursor-pointer">
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. DEVELOPER API & WEBHOOKS SECTION */}
      <div className="space-y-4 border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Developer API & Webhooks</h4>
        
        {/* Production API Key Block */}
        <div className="space-y-1">
          <label className="font-bold text-slate-400">
            Active Production API Key <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-3">
            <input 
              type="text" 
              readOnly 
              value={apiKey} 
              className="flex-1 bg-slate-50 border border-slate-200 font-mono font-semibold text-slate-700 rounded-lg p-2.5 outline-none select-all" 
            />
            <button 
              type="button" 
              onClick={handleRegenerateKey}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 shadow-xs transition-colors shrink-0 cursor-pointer active:scale-95"
            >
              Regenerate Key
            </button>
          </div>
        </div>

        {/* Webhook URL Block */}
        <div className="space-y-1 pt-1">
          <label className="font-bold text-slate-400">Webhook Listener URL</label>
          <input 
            type="url" 
            value={webhookUrl} 
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-700 focus:outline-none focus:border-teal-500" 
          />
        </div>
      </div>

    </form>
  );
}
