import { useState } from "react";
import { updateSettings } from "../data/authApi";

const SECTION_FIELDS = {
  "Store Info": [
    ["storeDisplayName", "Store Display Name"],
    ["storeType", "Store Type"],
    ["deaNumber", "DEA Registration Number"],
    ["npiNumber", "National Provider Identifier"],
    ["publicEmail", "Public Email Address"],
    ["faxNumber", "Fax Number"],
    ["websiteUrl", "Website URL"],
  ],
  "Tax & Pricing": [
    ["taxRate", "Default Tax Rate"],
    ["taxId", "Tax ID Number"],
    ["markup", "Default Markup Rate"],
    ["maxDiscount", "Maximum Permitted Discount"],
    ["copayAmount", "Default Flat Copay Amount"],
  ],
  Notifications: [
    ["orderConfirm", "Order Confirmations"],
    ["rxReadyEmail", "Prescription Ready Email"],
    ["lowStockWarn", "Critical Low Stock Warnings"],
    ["dailySalesPdf", "Daily Sales Report PDF"],
    ["batchExpiry", "Batch Expiry Reminders"],
    ["smsSender", "Outgoing SMS Sender Number"],
  ],
  "Backup & Data": [
    ["frequency", "Backup Frequency"],
    ["backupTime", "Scheduled Backup Time"],
    ["retentionPeriod", "Record Retention Period"],
    ["autoBackup", "Enable Automatic Backups"],
    ["autoPurge", "Auto-purge Expired Logs"],
  ],
  Security: [
    ["require2Fa", "Require Two-Factor Authentication"],
    ["idleTimeout", "Idle Session Timeout"],
    ["pwdExpiry", "Forced Password Expiry"],
    ["minPwdLength", "Minimum Password Length"],
    ["enforceRbac", "Enforce Permission Matrix"],
  ],
  Integrations: [
    ["apiKey", "Production API Key"],
    ["webhookUrl", "Webhook Listener URL"],
  ],
};

const defaults = {
  storeDisplayName: "MedVault Pharmacy",
  storeType: "Retail Pharmacy",
  deaNumber: "",
  npiNumber: "",
  publicEmail: "",
  faxNumber: "",
  websiteUrl: "",
  taxRate: "8.25%",
  taxId: "",
  markup: "35%",
  maxDiscount: "20%",
  copayAmount: "$15.00",
  orderConfirm: true,
  rxReadyEmail: true,
  lowStockWarn: true,
  dailySalesPdf: false,
  batchExpiry: true,
  smsSender: "",
  frequency: "Daily (Every Night)",
  backupTime: "02:00 AM",
  retentionPeriod: "7 Years",
  autoBackup: true,
  autoPurge: false,
  require2Fa: true,
  idleTimeout: "15 Minutes",
  pwdExpiry: "90 Days",
  minPwdLength: "12 Characters",
  enforceRbac: true,
  apiKey: "",
  webhookUrl: "",
};

export default function SettingsSectionForm({ section, savedData }) {
  const key =
    section === "Store Info"
      ? "storeInfo"
      : section === "Tax & Pricing"
        ? "taxPricing"
        : section === "Backup & Data"
          ? "backupData"
          : section.toLowerCase();
  const [values, setValues] = useState({ ...defaults, ...(savedData || {}) });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fields = SECTION_FIELDS[section];

  const save = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await updateSettings({ sections: { [key]: values } });
      setMessage("Settings saved successfully.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <form
      onSubmit={save}
      className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-xs font-medium"
    >
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-800">{section}</h3>
        <button
          disabled={false}
          className="px-4 py-2 bg-teal-700 text-white font-bold rounded-lg"
        >
          Save Changes
        </button>
      </div>
      {message && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 font-semibold text-emerald-700">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 font-semibold text-rose-700">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(([field, label]) =>
          typeof values[field] === "boolean" ? (
            <label
              key={field}
              className="flex items-center justify-between border border-slate-100 rounded-lg p-3 font-bold text-slate-700"
            >
              <span>{label}</span>
              <input
                type="checkbox"
                checked={values[field]}
                onChange={(event) =>
                  setValues({ ...values, [field]: event.target.checked })
                }
                className="accent-teal-600"
              />
            </label>
          ) : (
            <label key={field} className="space-y-1 font-bold text-slate-500">
              {label}
              <input
                name={field}
                type={
                  field.includes("Email") || field === "publicEmail"
                    ? "email"
                    : field === "websiteUrl"
                      ? "url"
                      : "text"
                }
                value={values[field]}
                onChange={(event) =>
                  setValues({ ...values, [field]: event.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800"
              />
            </label>
          ),
        )}
      </div>
    </form>
  );
}
