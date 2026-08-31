// src/components/LayoutShell.jsx
import React, { useState } from "react";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function LayoutShell({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) {
  const location = useLocation();
  const { currentUser } = useOutletContext();
  const [customHeaderOverride, setCustomHeaderOverride] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // Clean raw paths out of URL params (e.g. /purchase-orders -> Purchase Orders)
  const getCleanTitle = () => {
    if (customHeaderOverride) return customHeaderOverride;
    const path = location.pathname.substring(1);
    if (!path || path === "dashboard") return "Dashboard Overview";
    return path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 font-sans antialiased text-slate-800 overflow-hidden print:h-auto print:w-auto print:overflow-visible select-none">
      {/* 🍏 HIDES SIDEBAR COMPLETELY ON PRINT LOOPS */}
      <div className="print:hidden flex shrink-0">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          allowedPages={currentUser?.pages}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible">
        {/* 🍏 HIDES NAVBAR HEADER COMPLETELY ON PRINT LOOPS */}
        <div className="print:hidden">
          <Navbar 
          title={getCleanTitle()}
          searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentUser={currentUser}
             />
        </div>
        <div className="flex-1 overflow-hidden print:overflow-visible print:h-auto">
          <Outlet
            context={{
              setHeaderOverride: setCustomHeaderOverride,
              currentUser,
              searchQuery,
              setSearchQuery
            }}
          />
        </div>
      </div>
    </div>
  );
}
