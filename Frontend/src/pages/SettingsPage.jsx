import React, { useState, useEffect } from "react";
import SettingsTabs from "../components/SettingsTabs";
import SettingsForm from "../components/SettingsForm";
import StoreInfoForm from "../components/StoreInfoForm";
import TaxPricingForm from "../components/TaxPricingForm";
import NotificationsForm from "../components/NotificationForm";
import BackupDataForm from "../components/BackupDataForm";
import SecurityForm from "../components/SecurityForm";
import IntegrationsForm from "../components/IntegrationsForm";
import SettingsSectionForm from "../components/SettingsSectionForm";
import { getSettings } from "../data/authApi";
import { useOutletContext } from "react-router-dom";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { setHeaderOverride } = useOutletContext();
  const [currentSubTab, setCurrentSubTab] = useState("General");
  useEffect(() => {
    getSettings()
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((requestError) => {
        setError(requestError.message);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    if (setHeaderOverride) {
      setHeaderOverride(`System Settings`);
    }
    return () => setHeaderOverride?.("");
  }, [setHeaderOverride]);
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50">
        <div className="text-teal-600 font-semibold animate-pulse text-sm">
          Loading System Control Parameters...
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="h-full flex items-center justify-center text-sm font-semibold text-rose-700">
        {error}
      </div>
    );

  return (
    <main className="h-full overflow-y-auto p-8 bg-slate-50">
      <div className="flex flex-col md:flex-row gap-8 items-start max-w-full w-full">
        {/* Left Hand Constant Tab Navigation Menu List Panel */}
        <SettingsTabs
          currentSubTab={currentSubTab}
          setCurrentSubTab={setCurrentSubTab}
        />
        <>
          {currentSubTab === "Integrations" && (
            <SettingsSectionForm
              section="Integrations"
              savedData={settings.sections?.integrations}
            />
          )}
          {currentSubTab === "Security" && (
            <SettingsSectionForm
              section="Security"
              savedData={settings.sections?.security}
            />
          )}
          {currentSubTab === "Backup & Data" && (
            <SettingsSectionForm
              section="Backup & Data"
              savedData={settings.sections?.backupData}
            />
          )}
          {currentSubTab === "Notifications" && (
            <SettingsSectionForm
              section="Notifications"
              savedData={settings.sections?.notifications}
            />
          )}
          {currentSubTab === "Store Info" && (
            <SettingsSectionForm
              section="Store Info"
              savedData={settings.sections?.storeInfo}
            />
          )}
          {currentSubTab === "General" && (
            <SettingsForm initialData={settings} />
          )}
          {currentSubTab === "Tax & Pricing" && (
            <SettingsSectionForm
              section="Tax & Pricing"
              savedData={settings.sections?.taxPricing}
            />
          )}
        </>
      </div>
    </main>
  );
}
