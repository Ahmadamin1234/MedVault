import React, { useState, useEffect } from "react";
import StaffDashboard from "../components/StaffDashboard";
import InviteStaff from "../components/InviteStaff";
import { getStaff, ensureCsrfToken , updateStaff, deleteStaff} from "../data/authApi"; // 🍏 IMPORTED CSRF WORKAROUND
import { ShieldAlert , ArrowLeft } from "lucide-react";
import { useNavigate , useOutletContext} from "react-router-dom";

export default function StaffPage() {
  const navigate = useNavigate()
  const {currentUser} = useOutletContext();
  const [data, setData] = useState({ staff: [], logs: [] });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
    if (currentUser && currentUser.role !== 'Admin') {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 p-6 animate-fadeIn">
        <div className="max-w-md text-center space-y-5 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mx-auto border border-rose-100 shadow-sm">
            <ShieldAlert className="w-7 h-7 stroke-[2]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              403 - Security Access Restricted
            </h3>
            <p className="text-xs font-semibold text-slate-400 leading-relaxed">
              Your account level credentials ({currentUser.role}) do not have clearance to read or alter the Administrative Access Registries registry framework. This incident has been logged.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center gap-2 mx-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateStaffMember = async (id, updatedFields) => {
    try {
      // Direct call wraps CSRF, tokens, and response validation automatically
      await updateStaff(id, updatedFields);

      const payload = await getStaff();
      setData({
        staff: payload.staff || [],
        logs: payload.logs || []
      });
    } catch (err) {
      console.error("Failed updating user settings profiles:", err);
    }
  };

  // 🍏 UPDATED HANDLER
  const handleDeleteStaffMember = async (id) => {
    try {
      // Direct clean deletion abstraction call
      await deleteStaff(id);

      const payload = await getStaff();
      setData({ 
        staff: payload.staff || [], 
        logs: payload.logs || [] 
      });
    } catch (err) {
      console.error("Failed executing operational wipe request:", err);
    }
  };

  useEffect(() => {
    getStaff()
      .then((payload) => {
        setData({ 
          staff: payload.staff || [],
          logs: payload.logs || []
        });
        setLoading(false);
      })
      .catch((requestError) => {
        setError(requestError.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50">
        <div className="text-teal-600 font-semibold animate-pulse text-sm">
          Accessing Administrative Access Registries...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-sm font-semibold text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <main className="h-full overflow-y-auto p-8 bg-slate-50 relative">
      <StaffDashboard
        staffList={data.staff}
        logsData={data.logs}
        onOpenInvite={() => setModalOpen(true)}
        onUpdateStaff={handleUpdateStaffMember}
        onDeleteStaff={handleDeleteStaffMember}
      />

      <InviteStaff
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={async () => {
          const payload = await getStaff();
          setData({
            staff: payload.staff || [],
            logs: payload.logs || []
          });
          setModalOpen(false);
        }}
      />
    </main>
  );
}
