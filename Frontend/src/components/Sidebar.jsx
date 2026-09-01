import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  Truck,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { logout } from "../data/authApi";
import LogoutModal from "./LogoutModal";

export default function Sidebar({ isCollapsed, setIsCollapsed, allowedPages }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      key: "dashboard",
      icon: LayoutDashboard,
    },
    { name: "Inventory", path: "/inventory", key: "inventory", icon: Package },
    {
      name: "Purchase Orders",
      path: "/purchase-orders",
      key: "purchase-orders",
      icon: FileText,
    }, // 🍏 FIXED MATCH
    { name: "Suppliers", path: "/suppliers", key: "suppliers", icon: Truck },
    {
      name: "Expiry Alerts",
      path: "/expiry-alerts",
      key: "expiry-alerts",
      icon: AlertTriangle,
    }, // 🍏 FIXED MATCH
    {
      name: "Sales & Billing",
      path: "/sales-billing",
      key: "sales-billing",
      icon: DollarSign,
    }, // 🍏 FIXED MATCH
    { name: "Reports", path: "/reports", key: "reports", icon: BarChart3 },
    { name: "Staff", path: "/staff", key: "staff", icon: Users },
  ];
  const visibleMenuItems = menuItems.filter(
    (item) => !allowedPages || allowedPages.includes(item.key),
  );
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };
  const handleLogoutCancel = () => {
    if (isLoggingOut) return;

    setShowLogoutModal(false);
  };
  const handleLogoutConfirm = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Failed to logout:", error);
      localStorage.clear();
      setShowLogoutModal(false);
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <aside
        className={`bg-white border-r border-slate-200 flex flex-col justify-between py-6 shrink-0 h-screen sticky top-0 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div>
          {/* Brand System Typography and Graphic Layout Banner */}
          <div
            className={`flex items-center gap-3 mb-6 transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-6"}`}
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-lg shrink-0 select-none shadow-sm">
              <img src="./images/brand-logo.png" alt="" />
            </div>
            {!isCollapsed && (
              <div className="whitespace-nowrap animate-fadeIn">
                <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">
                  MedVault
                </h1>
                <span className="text-[10px] text-teal-600 uppercase font-extrabold tracking-widest mt-1 block">
                  Rx Inventory
                </span>
              </div>
            )}
          </div>
          <div className="px-3 mb-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              className="w-full flex items-center justify-center py-2.5 text-xs font-bold text-slate-500 hover:text-teal-600 hover:bg-slate-50 rounded-lg transition-all duration-200 cursor-pointer active:scale-95"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 shrink-0" />
              ) : (
                <ChevronLeft className="w-4 h-4 shrink-0" />
              )}
            </button>
          </div>

          {/* Navigation List Layer */}
          <nav className="space-y-1 px-3">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  title={isCollapsed ? item.name : ""}
                  className={`w-full flex items-center py-2.5 text-xs font-bold transition-all duration-200 rounded-lg relative group cursor-pointer ${
                    isCollapsed ? "justify-center px-0" : "gap-3 px-4"
                  } ${
                    isActive
                      ? "text-teal-600 bg-teal-50/80 font-bold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {/* Active selection vertical line indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] bg-teal-600 rounded-r" />
                  )}

                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? "text-teal-600" : "text-slate-400 group-hover:scale-105"}`}
                  />

                  {/* Render tab text labels */}
                  {!isCollapsed && (
                    <span className="truncate whitespace-nowrap tracking-wide">
                      {item.name}
                    </span>
                  )}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleLogoutClick}
              title={isCollapsed ? "Sign Out" : ""}
              className={`w-full flex items-center py-2.5 text-xs font-bold transition-all duration-200 rounded-lg group cursor-pointer text-slate-500 hover:bg-rose-50 hover:text-rose-600 ${
                isCollapsed ? "justify-center px-0" : "gap-3 px-4"
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-rose-500 group-hover:scale-105 transition-transform duration-200" />

              {!isCollapsed && (
                <span className="truncate whitespace-nowrap tracking-wide">
                  Log Out
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Sidebar Metadata footer text area */}
        <div
          className={`text-[10px] font-bold text-slate-400 transition-all duration-300 ${isCollapsed ? "text-center px-0" : "px-6"}`}
        >
          {isCollapsed ? (
            <span className="font-extrabold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded text-[9px] tracking-wider uppercase">
              v1.4
            </span>
          ) : (
            <div className="space-y-0.5 whitespace-nowrap tracking-wide">
              <p>v1.4.2 Professional Edition</p>
              <p>
                System Status:{" "}
                <span className="text-emerald-500 font-extrabold uppercase text-[9px] tracking-wider">
                  Online
                </span>
              </p>
            </div>
          )}
        </div>
      </aside>
      {showLogoutModal && (
        <LogoutModal
          onCancel={handleLogoutCancel}
          onConfirm={handleLogoutConfirm}
          isLoggingOut={isLoggingOut}
        />
      )}
    </>
  );
}
