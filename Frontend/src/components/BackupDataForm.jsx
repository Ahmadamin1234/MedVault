import React, { useState } from 'react';
import { Database, Download, Upload } from 'lucide-react';

export default function BackupDataForm() {
  // Toggle Switches State Management
  const [autoBackup, setAutoBackup] = useState(true);
  const [autoPurge, setAutoPurge] = useState(false);

  // Form Fields State Management
  const [frequency, setFrequency] = useState('Daily (Every Night)');
  const [backupTime, setBackupTime] = useState('02:00 AM (EST)');
  const [retentionPeriod, setRetentionPeriod] = useState('7 Years (HIPAA Compliant)');
  const [targetFormat, setTargetFormat] = useState('CSV UTF-8 (Comma Delimited)');

  const handleFormSave = (e) => {
    e.preventDefault();
    alert("Backup configurations & data retention policies saved successfully!");
  };

  const handleBackupNow = () => {
    alert("Initiating immediate full system cryptographic vault backup...");
  };

  return (
    <form onSubmit={handleFormSave} className="flex-1 w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-xs font-semibold text-slate-500 animate-fadeIn">
      
      {/* 1. MAIN PANEL HEADER STRIP */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-800">Backup, Restore & Data Policies</h3>
        <button type="submit" className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95">
          Save Changes
        </button>
      </div>

      {/* 2. AUTOMATIC DATABASE BACKUPS SECTION */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Automatic Database Backups</h4>
        
        {/* Toggle Option Line */}
        <div className="flex items-center justify-between max-w-xl">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-800 block">Enable Automatic System Backups</span>
            <span className="text-slate-500 text-[10px] font-medium block mt-0.5">Encrypt and secure system database replicas to cloud vaults</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" checked={autoBackup} onChange={() => setAutoBackup(!autoBackup)} className="sr-only peer" />
            <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
          </label>
        </div>

        {/* Input Parameters Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-2">
          <div className="space-y-1">
            <label className="font-bold text-slate-500">Backup Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-700 focus:outline-none focus:border-teal-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23CBCCCD%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_14px_center] bg-no-repeat">
              <option>Daily (Every Night)</option>
              <option>Weekly (Sundays)</option>
              <option>Monthly (1st of Month)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500">Scheduled Backup Time</label>
            <input type="text" value={backupTime} onChange={(e) => setBackupTime(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-600" />
          </div>

          {/* Metadata Sync Readout Line */}
          <div className="text-left md:pb-2 text-[11px] font-medium text-slate-400">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Last Successful Sync</span>
            <p className="mt-1 font-semibold">
              Today, <span className="text-emerald-500 font-bold">02:00 AM</span> <span className="text-slate-400 font-normal">(Size: 642.1 MB)</span>
            </p>
          </div>
        </div>

        {/* Immediate Action Backup Trigger Button */}
        <div className="pt-2">
          <button 
            type="button" 
            onClick={handleBackupNow}
            className="flex items-center gap-2 px-4 py-2.5 border border-teal-600 bg-teal-50/30 hover:bg-teal-50 text-teal-700 font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Database className="w-3.5 h-3.5 stroke-[2.5]" />
            Backup Now
          </button>
        </div>
      </div>

      {/* 3. PATIENT & DISPENSING RECORDS RETENTION SECTION */}
      <div className="space-y-4 border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Patient & Dispensing Records Retention</h4>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="space-y-1 w-full md:max-w-md">
            <label className="font-bold text-slate-500">Record Retention Period</label>
            <select value={retentionPeriod} onChange={(e) => setRetentionPeriod(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-700 focus:outline-none focus:border-teal-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23CBCCCD%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_14px_center] bg-no-repeat">
              <option>5 Years (Standard Compliance)</option>
              <option>7 Years (HIPAA Compliant)</option>
              <option>10 Years (Extended Audits)</option>
            </select>
          </div>

          {/* Purge Toggles Card */}
          <div className="w-full md:max-w-md flex items-center justify-between bg-slate-50/50 p-4 border border-slate-100 rounded-xl md:mt-4">
            <div className="space-y-0.5 pr-4">
              <span className="font-bold text-slate-800 block">Auto-purge Expired Logs</span>
              <span className="text-slate-400 text-[10px] font-medium leading-normal block">Permanently delete system activity logs older than retention period</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" checked={autoPurge} onChange={() => setAutoPurge(!autoPurge)} className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>
        </div>
      </div>

      {/* 4. EXPORT & IMPORT DATASETS SECTION */}
      <div className="space-y-4 border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Export & Import Datasets</h4>
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 max-w-2xl">
          <div className="space-y-1 flex-1 w-full">
            <label className="font-bold text-slate-500">Target Format</label>
            <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-700 focus:outline-none focus:border-teal-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23CBCCCD%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_14px_center] bg-no-repeat">
              <option>CSV UTF-8 (Comma Delimited)</option>
              <option>JSON Dataset Document</option>
              <option>SQL Insert Script dump</option>
            </select>
          </div>

          {/* Action Row Links Buttons mapping */}
          <div className="flex gap-2 w-full sm:w-auto shrink-0">
            <button type="button" onClick={() => alert("Downloading spreadsheet export files...")} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-lg font-bold text-slate-600 transition-colors shadow-sm cursor-pointer">
              <Download className="w-3.5 h-3.5 text-slate-400" /> Export All Data (CSV)
            </button>
            <button 
              type="button" 
              onClick={() => alert("Opening native window database file upload picker...")} 
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 border border-teal-200 text-teal-700 bg-teal-50/50 hover:bg-teal-50 rounded-lg font-bold transition-colors shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> 
              Import Data File
            </button>
          </div>
        </div>
      </div>

    </form>
  );
}
