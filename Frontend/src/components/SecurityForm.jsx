import React, { useState } from 'react';

export default function SecurityForm() {
  // Toggle Switches State
  const [require2Fa, setRequire2Fa] = useState(true);
  const [enforceRbac, setEnforceRbac] = useState(true);

  // Field Inputs State
  const [idleTimeout, setIdleSessionTimeout] = useState('15 Minutes');
  const [pwdExpiry, setForcedPasswordExpiry] = useState('90 Days');
  const [minPwdLength, setMinimumPasswordLength] = useState('12 Characters');

  const handleFormSave = (e) => {
    e.preventDefault();
    alert("Security guidelines & authorization protocols saved successfully!");
  };

  const handleEditPermissions = (role) => {
    alert(`Opening access token modifier window for role matrix: ${role}`);
  };

  const handleViewAuditLog = () => {
    alert("Opening secure system immutable activity cryptographic audit records...");
  };

  const rbacMatrix = [
    { role: 'Admin', summary: 'Full system config, audit logs, financials' },
    { role: 'Pharmacist (Sarah Jenkins)', summary: 'Dispense controlled Rx, approve POs' },
    { role: 'Technician', summary: 'Log inventory, queue orders, view stock' },
    { role: 'Cashier', summary: 'Point of sale access, print customer receipts' }
  ];

  return (
    <form onSubmit={handleFormSave} className="flex-1 w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-xs font-semibold text-slate-500 animate-fadeIn">
      
      {/* SECTION HEADER BLOCK */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-800">Security & Compliance settings</h3>
        <button type="submit" className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95">
          Save Changes
        </button>
      </div>

      {/* 1. IDENTITY & MULTI-FACTOR AUTHENTICATION */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Identity & Multi-Factor Authentication</h4>
        
        {/* Toggle Option Line */}
        <div className="flex items-center justify-between max-w-xl">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-800 block">Require Two-Factor Authentication (2FA)</span>
            <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Enforce TOTP authenticator app tokens for all pharmacy logins</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" checked={require2Fa} onChange={() => setRequire2Fa(!require2Fa)} className="sr-only peer" />
            <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
          </label>
        </div>

        {/* Form Inputs Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-1">
            <label className="font-bold text-slate-400">Idle Session Timeout</label>
            <select value={idleTimeout} onChange={(e) => setIdleSessionTimeout(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-700 focus:outline-none focus:border-teal-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23CBCCCD%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_14px_center] bg-no-repeat">
              <option>15 Minutes</option>
              <option>30 Minutes</option>
              <option>1 Hour</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-400">Forced Password Expiry</label>
            <input type="text" value={pwdExpiry} onChange={(e) => setForcedPasswordExpiry(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-600" />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-400">Minimum Password Length</label>
            <input type="text" value={minPwdLength} onChange={(e) => setMinimumPasswordLength(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-600" />
          </div>
        </div>
      </div>

      {/* 2. ROLE-BASED ACCESS CONTROL (RBAC) */}
      <div className="space-y-4 border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Role-Based Access Control (RBAC)</h4>
        
        {/* Toggle Switch */}
        <div className="flex items-center justify-between max-w-xl pb-2">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-800 block">Enforce Explicit Permission Matrix</span>
            <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Restrict operations to system users based on their active credentials</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" checked={enforceRbac} onChange={() => setEnforceRbac(!enforceRbac)} className="sr-only peer" />
            <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
          </label>
        </div>

        {/* RBAC Overview Mapping Grid Table */}
        <div className="border border-slate-100 rounded-xl overflow-hidden mt-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-4 w-[25%]">Role</th>
                <th className="py-2.5 px-4 w-[60%]">Key Permissions Summary</th>
                <th className="py-2.5 px-4 text-center w-[15%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-600">
              {rbacMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">{item.role}</td>
                  <td className="py-3 px-4 text-slate-500 font-medium">{item.summary}</td>
                  <td className="py-3 px-4 text-center">
                    <button type="button" onClick={() => handleEditPermissions(item.role)} className="text-teal-600 font-bold hover:text-teal-700 transition-colors cursor-pointer">
                      Edit Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. HIPAA ACTIVITY AUDIT LOG SUMMARY FEED */}
      <div className="space-y-4 border-t border-slate-100 pt-5">
        <div className="flex justify-between items-center max-w-full">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">HIPAA Activity Audit Log</h4>
            <span className="font-bold text-slate-800 block mt-3">Automatic Activity Tracking</span>
            <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Log patient record access, drug movements, and dispensing alterations</span>
          </div>
          <button type="button" onClick={handleViewAuditLog} className="px-4 py-2 border border-teal-600 text-teal-700 font-bold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-xs shadow-sm self-end">
            View Audit Log
          </button>
        </div>

        {/* Recent Security Logs Feed Display Component */}
        <div className="pt-2 space-y-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Recent Security Events</span>
          <div className="space-y-2 font-medium text-[11px] leading-relaxed">
            <div className="flex items-start gap-4">
              <span className="font-mono text-slate-400 font-semibold shrink-0">2026-08-24 15:14:22</span>
              <p className="text-slate-500">
                <span className="font-bold text-slate-800">Sarah Jenkins</span> Controlled drug dispensation (Oxycodone 10mg) approved
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono text-slate-400 font-semibold shrink-0">2026-08-24 09:41:05</span>
              <p className="text-slate-500">
                <span className="font-bold text-slate-800">System</span> Daily backup verification passed (Hash: e8f912c)
              </p>
            </div>
          </div>
        </div>
      </div>

    </form>
  );
}
