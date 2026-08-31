import React, { useState } from 'react';

export default function NotificationsForm() {
  // Email Notifications State Mapping
  const [orderConfirm, setOrderConfirm] = useState(true);
  const [rxReadyEmail, setRxReadyEmail] = useState(true);
  const [lowStockWarn, setLowStockWarn] = useState(true);
  const [dailySalesPdf, setDailySalesPdf] = useState(false);
  const [batchExpiry, setBatchExpiry] = useState(true);

  // SMS Alerts State Mapping
  const [rxReadySms, setRxReadySms] = useState(true);
  const [refillReminders, setRefillReminders] = useState(true);
  const [appointmentSms, setAppointmentSms] = useState(false);
  const [smsSender, setSmsSender] = useState('+1 (888) 902-8811 (Twilio Registered)');

  // In-App Alerts State Mapping
  const [shelfStockAlert, setShelfStockAlert] = useState(true);
  const [eRxNotification, setERxNotification] = useState(true);
  const [staffMessaging, setStaffMessaging] = useState(true);

  const handleFormSave = (e) => {
    e.preventDefault();
    alert("System alerts & dispatch channels updated successfully!");
  };

  return (
    <form onSubmit={handleFormSave} className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-xs font-semibold text-slate-500 animate-fadeIn">
      
      {/* SECTION HEADER BLOCK */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-800">System Alerts & Notifications</h3>
        <button type="submit" className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95">
          Save Changes
        </button>
      </div>

      {/* 1. EMAIL NOTIFICATIONS CATEGORY */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Email Notifications</h4>
        <div className="divide-y divide-slate-100">
          
          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-bold text-slate-800 block">Order Confirmations</span>
              <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Send detailed order invoices to patients immediately after purchase</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={orderConfirm} onChange={() => setOrderConfirm(!orderConfirm)} className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-bold text-slate-800 block">Prescription Ready Alerts</span>
              <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Email patients when their prescriptions are fully dispensed and ready for pick-up</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={rxReadyEmail} onChange={() => setRxReadyEmail(!rxReadyEmail)} className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-bold text-slate-800 block">Critical Low Stock Warnings</span>
              <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Receive real-time email warnings when shelf quantities touch safety thresholds</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={lowStockWarn} onChange={() => setLowStockWarn(!lowStockWarn)} className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-bold text-slate-800 block">Daily Sales Report PDF</span>
              <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Deliver daily store performance statistics directly to the Chief Pharmacist email</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={dailySalesPdf} onChange={() => setDailySalesPdf(!dailySalesPdf)} className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-bold text-slate-800 block">Batch Expiry Reminders</span>
              <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Weekly overview of medications approaching expiry within the 30-day window</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={batchExpiry} onChange={() => setBatchExpiry(!batchExpiry)} className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

        </div>
      </div>

      {/* 2. SMS ALERTS & REMINDERS CATEGORY */}
      <div className="space-y-4 border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">SMS Alerts & Reminders</h4>
        <div className="divide-y divide-slate-100">
          
          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-bold text-slate-800 block">Prescription Ready SMS</span>
              <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Send direct text messages to verified patient mobile numbers</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={rxReadySms} onChange={() => setRxReadySms(!rxReadySms)} className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-bold text-slate-800 block">Automated Refill Reminders</span>
              <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Prompt patients 3 days before their chronic care refills are scheduled to expire</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={refillReminders} onChange={() => setRefillReminders(!refillReminders)} className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-bold text-slate-800 block">Appointment SMS Reminders</span>
              <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Send reminders 24 hours prior to scheduled clinic or vaccination sessions</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={appointmentSms} onChange={() => setAppointmentSms(!appointmentSms)} className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

        </div>

        {/* SMS Sender Number Field Block */}
        <div className="space-y-1.5 max-w-xs pt-1">
          <label className="font-bold text-slate-800 block">Outgoing SMS Sender Number</label>
          <input 
            type="text" 
            value={smsSender} 
            onChange={(e) => setSmsSender(e.target.value)} 
            className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700 focus:outline-none focus:border-teal-500" 
          />
        </div>
      </div>
            {/* 3. IN-APP REAL-TIME SYSTEM ALERTS CATEGORY */}
      <div className="space-y-4 border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">In-App Real-time System Alerts</h4>
        <div className="divide-y divide-slate-100">
          
          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-bold text-slate-800 block">Real-time Shelf Stock Alerts</span>
              <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Toast alert inside POS interface when item stock is low</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={shelfStockAlert} onChange={() => setShelfStockAlert(!shelfStockAlert)} className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-bold text-slate-800 block">Incoming E-Prescription Notifications</span>
              <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Audio chime alert on new EPCS system arrivals</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={eRxNotification} onChange={() => setERxNotification(!eRxNotification)} className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-bold text-slate-800 block">Staff Direct Messaging</span>
              <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Enable instant pop-up notifications for workspace staff communications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={staffMessaging} onChange={() => setStaffMessaging(!staffMessaging)} className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

        </div>
      </div>

    </form>
  );
}


