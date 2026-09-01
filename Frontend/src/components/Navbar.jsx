import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Bell,
  Package,
  AlertTriangle,
  Truck,
  FileText,
  DollarSign,
  Users,
  X,
} from "lucide-react";

import { globalSearch, getMedications, getExpiryAlerts } from "../data/authApi";

import { useNavigate } from "react-router-dom";

export default function Navbar({ title, currentUser }) {
  const navigate = useNavigate();

  // ============================================================
  // STATE
  // ============================================================

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState({
    medications: [],
    suppliers: [],
    purchaseOrders: [],
    sales: [],
    staff: [],
  });

  const [isSearching, setIsSearching] = useState(false);

  const [showSearchResults, setShowSearchResults] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  // ============================================================
  // USER
  // ============================================================

  const fullName =
    currentUser?.full_name || currentUser?.username || "Loading Account...";

  const displayRole =
    currentUser?.role === "Admin"
      ? "Clinic Administrator"
      : currentUser?.role || "Medical Staff";

  const nameInitials = fullName
    .split(" ")
    .map((namePart) => namePart[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ============================================================
  // GLOBAL SEARCH
  // ============================================================

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSearchResults({
        medications: [],
        suppliers: [],
        purchaseOrders: [],
        sales: [],
        staff: [],
      });

      setShowSearchResults(false);

      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);

        const results = await globalSearch(query);

        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Global search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  const loadNotifications = async () => {
    try {
      const [medications, expiryAlerts] = await Promise.all([
        getMedications(),
        getExpiryAlerts(),
      ]);

      const newNotifications = [];

      // --------------------------------------------------------
      // LOW STOCK
      // --------------------------------------------------------

      const medicationList = Array.isArray(medications) ? medications : [];

      medicationList.forEach((medication) => {
        const stock = Number(medication.stock ?? 0);

        const reorder = Number(
          medication.reorder ?? medication.reorder_level ?? 0,
        );

        if (reorder > 0 && stock <= reorder) {
          newNotifications.push({
            id: `low-${medication.id}`,
            type: "low-stock",
            title: "Low Stock",
            message: `${medication.name} has only ${stock} units remaining.`,
            icon: Package,
            path: "/inventory",
          });
        }
      });

      // --------------------------------------------------------
      // EXPIRY
      // --------------------------------------------------------

      const expiryList = Array.isArray(expiryAlerts?.batches)
        ? expiryAlerts.batches
        : [];

      expiryList.forEach((item) => {
        newNotifications.push({
          id: `expiry-${item.id}`,
          type: "expiry",
          title: "Expiry Alert",
          message: `${item.medication_name || item.name || "Medicine"} is approaching expiry.`,
          icon: AlertTriangle,
          path: "/expiry-alerts",
        });
      });

      setNotifications(newNotifications);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  // Load notifications when Navbar loads

  useEffect(() => {
    loadNotifications();
  }, []);

  // ============================================================
  // REFRESH NOTIFICATIONS WHEN BELL IS OPENED
  // ============================================================

  const handleNotificationClick = async () => {
    const newState = !showNotifications;

    setShowNotifications(newState);

    if (newState) {
      await loadNotifications();
    }
  };

  // ============================================================
  // SEARCH RESULT COUNT
  // ============================================================

  const totalResults =
    searchResults.medications.length +
    searchResults.suppliers.length +
    searchResults.purchaseOrders.length +
    searchResults.sales.length +
    searchResults.staff.length;

  // ============================================================
  // CLEAR SEARCH
  // ============================================================

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  // ============================================================
  // RESULT CLICK
  // ============================================================

  const handleResultClick = (path) => {
    setShowSearchResults(false);
    setSearchQuery("");

    navigate(path);
  };

  // ============================================================
  // CLICK OUTSIDE
  // ============================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ============================================================
  // SEARCH RESULT GROUP
  // ============================================================

  const ResultGroup = ({
    title,
    icon: Icon,
    items,
    path,
    getTitle,
    getSubtitle,
  }) => {
    if (!items.length) {
      return null;
    }

    return (
      <div>
        <div className="px-4 py-2 bg-slate-50 border-y border-slate-100 flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-slate-400" />

          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
        </div>

        {items.slice(0, 5).map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => handleResultClick(path)}
            className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-teal-600" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-700 truncate">
                {getTitle(item)}
              </p>

              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {getSubtitle(item)}
              </p>
            </div>
          </button>
        ))}
      </div>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
      {/* ======================================================
          TITLE
      ======================================================= */}

      <h2 className="text-xl font-bold tracking-tight text-slate-800">
        {title}
      </h2>

      {/* ======================================================
          RIGHT SIDE
      ======================================================= */}

      <div className="flex items-center gap-5">
        {/* ====================================================
            GLOBAL SEARCH
        ===================================================== */}

        <div ref={searchRef} className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => {
              if (searchQuery.trim()) {
                setShowSearchResults(true);
              }
            }}
            placeholder="Search entire system..."
            className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors placeholder:text-slate-400 font-medium"
          />

          {/* Loading */}

          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-teal-600 rounded-full animate-spin" />
            </div>
          )}

          {/* Clear */}

          {!isSearching && searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* ==================================================
              SEARCH RESULTS
          =================================================== */}

          {showSearchResults && (
            <div className="absolute right-0 top-12 w-96 max-h-[500px] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50">
              {/* Search Header */}

              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-700">
                  Search Results
                </p>

                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isSearching
                    ? "Searching..."
                    : `${totalResults} result${
                        totalResults !== 1 ? "s" : ""
                      } found`}
                </p>
              </div>

              {/* Results */}

              {!isSearching && totalResults === 0 && (
                <div className="px-4 py-10 text-center">
                  <Search className="w-6 h-6 text-slate-300 mx-auto mb-2" />

                  <p className="text-xs font-semibold text-slate-500">
                    No results found
                  </p>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Try another medicine, supplier, order or staff name.
                  </p>
                </div>
              )}

              <ResultGroup
                title="Medications"
                icon={Package}
                items={searchResults.medications}
                path="/inventory"
                getTitle={(item) => item.name}
                getSubtitle={(item) =>
                  `${item.sku || "No SKU"} • ${item.category || "Medication"}`
                }
              />

              <ResultGroup
                title="Suppliers"
                icon={Truck}
                items={searchResults.suppliers}
                path="/suppliers"
                getTitle={(item) => item.name}
                getSubtitle={(item) => item.email || item.phone || "Supplier"}
              />

              <ResultGroup
                title="Purchase Orders"
                icon={FileText}
                items={searchResults.purchaseOrders}
                path="/purchase-orders"
                getTitle={(item) =>
                  item.poNumber || item.po_number || `PO #${item.id}`
                }
                getSubtitle={(item) =>
                  `${item.supplier_name || "Supplier"} • ${item.status || ""}`
                }
              />

              <ResultGroup
                title="Sales"
                icon={DollarSign}
                items={searchResults.sales}
                path="/sales-billing"
                getTitle={(item) => item.invoice_number || `Sale #${item.id}`}
                getSubtitle={(item) =>
                  item.customer_name || item.patient_name || "Sale"
                }
              />

              <ResultGroup
                title="Staff"
                icon={Users}
                items={searchResults.staff}
                path="/staff"
                getTitle={(item) => item.name}
                getSubtitle={(item) =>
                  item.role || item.email || "Staff member"
                }
              />
            </div>
          )}
        </div>

        {/* ====================================================
            NOTIFICATION BELL
        ===================================================== */}

        <div ref={notificationRef} className="relative">
          <button
            type="button"
            onClick={handleNotificationClick}
            title="Notifications"
            className="relative cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Bell className="w-[18px] h-[18px] text-slate-500" />

            {/* Notification Count */}

            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-3.5 h-3.5 px-0.5 bg-red-500 text-[9px] font-bold text-white flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {/* ==================================================
              NOTIFICATION DROPDOWN
          =================================================== */}

          {showNotifications && (
            <div className="absolute right-0 top-11 w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
              {/* Header */}

              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Notifications
                  </h3>

                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Inventory alerts requiring attention
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-md hover:bg-slate-50 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Notification List */}

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <Bell className="w-6 h-6 text-slate-300 mx-auto mb-2" />

                    <p className="text-xs font-semibold text-slate-500">
                      No alerts
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1">
                      Your inventory looks good.
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = notification.icon;

                    return (
                      <button
                        type="button"
                        key={notification.id}
                        onClick={() => handleResultClick(notification.path)}
                        className="w-full px-4 py-3 flex items-start gap-3 text-left border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-amber-50 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-amber-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-700">
                            {notification.title}
                          </p>

                          <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}

              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications(false);
                      navigate("/expiry-alerts");
                    }}
                    className="w-full text-[10px] font-bold text-teal-600 hover:text-teal-700"
                  >
                    View All Alerts
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ====================================================
            USER
        ===================================================== */}

        <div className="flex items-center gap-3 border-l border-slate-200 pl-5 h-8">
          <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 text-[10px] font-bold">
            {nameInitials}
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold text-slate-700 leading-tight">
              {fullName}
            </span>

            <span className="text-[10px] font-medium text-slate-400 mt-0.5">
              {displayRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
