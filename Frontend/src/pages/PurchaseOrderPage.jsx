import React, { useEffect, useState } from "react";
import { Plus, Filter } from "lucide-react";
import { useOutletContext } from "react-router-dom";

import POSummary from "../components/POSummary";
import CreateOrderForm from "../components/CreateOrderForm";

import {
  getMedications,
  getPurchaseOrderSummary,
  getPurchaseOrders,
  getSuppliers,
  approvePurchaseOrder,
  receivePurchaseOrder,
  cancelPurchaseOrder,
} from "../data/authApi";

export default function PurchaseOrdersPage() {
  const { setHeaderOverride } = useOutletContext();

  // ============================================================
  // STATE
  // ============================================================

  const [poData, setPoData] = useState({
    orders: [],
    summary: [],
  });

  const [suppliers, setSuppliers] = useState([]);
  const [medications, setMedications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreating, setIsCreating] = useState(false);

  const [activeFilter, setActiveFilter] = useState("All Orders");

  const [actionLoading, setActionLoading] = useState(null);

  // ============================================================
  // LOAD ORDERS + SUMMARY
  // ============================================================

  const refreshOrders = async () => {
    try {
      const [orders, summary] = await Promise.all([
        getPurchaseOrders(),
        getPurchaseOrderSummary(),
      ]);

      setPoData({
        orders: Array.isArray(orders) ? orders : [],
        summary: Array.isArray(summary) ? summary : [],
      });
    } catch (requestError) {
      console.error("Failed to refresh purchase orders:", requestError);

      throw requestError;
    }
  };

  // ============================================================
  // APPROVE PURCHASE ORDER
  // ============================================================

  const handleApprove = async (orderId) => {
    setError("");

    const confirmed = window.confirm(
      "Are you sure you want to approve this purchase order?",
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(`approve-${orderId}`);

    try {
      await approvePurchaseOrder(orderId);

      await refreshOrders();
    } catch (requestError) {
      console.error("Failed to approve purchase order:", requestError);

      setError(requestError.message || "Failed to approve purchase order.");
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // RECEIVE PURCHASE ORDER
  // ============================================================

  const handleReceive = async (orderId) => {
    setError("");

    const confirmed = window.confirm(
      "Are you sure you want to receive this purchase order? The medicine quantity will be added to inventory.",
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(`receive-${orderId}`);

    try {
      await receivePurchaseOrder(orderId);

      await refreshOrders();
    } catch (requestError) {
      console.error("Failed to receive purchase order:", requestError);

      setError(requestError.message || "Failed to receive purchase order.");
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // CANCEL PURCHASE ORDER
  // ============================================================

  const handleCancel = async (orderId) => {
    setError("");

    const confirmed = window.confirm(
      "Are you sure you want to cancel this purchase order?",
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(`cancel-${orderId}`);

    try {
      await cancelPurchaseOrder(orderId);

      await refreshOrders();
    } catch (requestError) {
      console.error("Failed to cancel purchase order:", requestError);

      setError(requestError.message || "Failed to cancel purchase order.");
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // INITIAL PAGE LOAD
  // ============================================================

  useEffect(() => {
    let isMounted = true;

    const loadPage = async () => {
      try {
        setLoading(true);
        setError("");

        const [orders, summary, supplierList, medicationList] =
          await Promise.all([
            getPurchaseOrders(),
            getPurchaseOrderSummary(),
            getSuppliers(),
            getMedications(),
          ]);

        if (!isMounted) return;

        setPoData({
          orders: Array.isArray(orders) ? orders : [],
          summary: Array.isArray(summary) ? summary : [],
        });

        setSuppliers(Array.isArray(supplierList) ? supplierList : []);

        setMedications(Array.isArray(medicationList) ? medicationList : []);
      } catch (requestError) {
        if (!isMounted) return;

        console.error("Failed to load purchase order page:", requestError);

        setError(requestError.message || "Failed to load purchase orders.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      isMounted = false;
    };
  }, []);

  // ============================================================
  // CREATE ORDER FORM TOGGLE
  // ============================================================

  const handleToggleForm = (showForm) => {
    setIsCreating(showForm);

    setHeaderOverride(showForm ? "Create Purchase Order" : "");
  };

  // ============================================================
  // AFTER ORDER CREATED
  // ============================================================

  const handleOrderCreated = async () => {
    try {
      setError("");

      await refreshOrders();

      handleToggleForm(false);
    } catch (requestError) {
      console.error("Failed to refresh after creating order:", requestError);

      setError(
        requestError.message ||
          "Order was created, but the list could not be refreshed.",
      );
    }
  };

  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-500 " + "border-amber-100";

      case "APPROVED":
        return "bg-blue-50 text-blue-500 " + "border-blue-100";

      case "RECEIVED":
        return "bg-emerald-50 text-emerald-500 " + "border-emerald-100";

      case "CANCELLED":
        return "bg-rose-50 text-rose-500 " + "border-rose-100";

      default:
        return "bg-slate-50 text-slate-500 " + "border-slate-100";
    }
  };

  // ============================================================
  // FILTER ORDERS
  // ============================================================

  const filteredOrders = poData.orders.filter((order) => {
    if (activeFilter === "All Orders") {
      return true;
    }

    return order.status === activeFilter.toUpperCase();
  });

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-teal-600 font-semibold animate-pulse text-sm">
          Loading Order Ledgers...
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="h-full overflow-y-auto p-8 bg-slate-50 space-y-6">
      {/* ======================================================
          CREATE PURCHASE ORDER
      ======================================================= */}

      {isCreating ? (
        <CreateOrderForm
          suppliers={suppliers}
          medications={medications}
          onCancel={() => handleToggleForm(false)}
          onCreated={handleOrderCreated}
        />
      ) : (
        <>
          {/* ==================================================
              ERROR MESSAGE
          =================================================== */}

          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-100 px-4 py-3 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          {/* ==================================================
              SUMMARY
          =================================================== */}

          <POSummary summaryData={poData.summary} />

          {/* ==================================================
              FILTER + ACTION ROW
          =================================================== */}

          <div className="flex items-center justify-between">
            {/* STATUS FILTER */}

            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm text-xs font-semibold text-slate-500">
              {[
                "All Orders",
                "Pending",
                "Approved",
                "Received",
                "Cancelled",
              ].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-1.5 rounded-md transition-all ${
                    activeFilter === tab
                      ? "bg-slate-100 text-slate-800 font-bold"
                      : "hover:text-slate-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* RIGHT ACTIONS */}

            <div className="flex items-center gap-3">
              {/* <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />

                Filter Suppliers
              </button> */}

              <button
                type="button"
                onClick={() => handleToggleForm(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                Create New Order
              </button>
            </div>
          </div>

          {/* ==================================================
              PURCHASE ORDERS TABLE
          =================================================== */}

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                {/* =================================================
                    HEADER
                ================================================== */}

                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    <th className="py-3 px-6">PO Number</th>

                    <th className="py-3 px-6">Supplier</th>

                    <th className="py-3 px-6">Order Date</th>

                    <th className="py-3 px-6">Expected Delivery</th>

                    <th className="py-3 px-6 text-center">Items Count</th>

                    <th className="py-3 px-6 text-right">Total Amount</th>

                    <th className="py-3 px-6 text-center">Status</th>

                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>

                {/* =================================================
                    BODY
                ================================================== */}

                <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-12 text-center">
                        <div className="text-sm font-semibold text-slate-500">
                          No purchase orders found.
                        </div>

                        <div className="text-xs text-slate-400 mt-1">
                          Create a new purchase order to get started.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-50/40 transition-colors"
                      >
                        {/* =========================================
                            PO NUMBER
                        ========================================== */}

                        <td className="py-3.5 px-6 font-bold text-teal-600 font-mono">
                          {order.poNumber || "-"}
                        </td>

                        {/* =========================================
                            SUPPLIER
                        ========================================== */}

                        <td className="py-3.5 px-6 font-semibold text-slate-800">
                          {order.supplier_name || "-"}
                        </td>

                        {/* =========================================
                            ORDER DATE
                        ========================================== */}

                        <td className="py-3.5 px-6 text-slate-400">
                          {order.orderDate || "-"}
                        </td>

                        {/* =========================================
                            EXPECTED DELIVERY
                        ========================================== */}

                        <td className="py-3.5 px-6 text-slate-500">
                          {order.expectedDelivery || "-"}
                        </td>

                        {/* =========================================
                            ITEMS COUNT
                        ========================================== */}

                        <td className="py-3.5 px-6 text-center text-slate-400">
                          {order.itemsCount || "0 items"}
                        </td>

                        {/* =========================================
                            TOTAL AMOUNT
                        ========================================== */}

                        <td className="py-3.5 px-6 text-right font-extrabold text-slate-900">
                          {order.totalAmount || "$0.00"}
                        </td>

                        {/* =========================================
                            STATUS
                        ========================================== */}

                        <td className="py-3.5 px-6 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 text-[9px] font-extrabold rounded border tracking-wider ${getStatusStyle(
                              order.status,
                            )}`}
                          >
                            {order.status || "UNKNOWN"}
                          </span>
                        </td>

                        {/* =========================================
                            ACTIONS
                        ========================================== */}

                        <td className="py-3.5 px-6">
                          <div className="flex items-center justify-center gap-2">
                            {/* ==================================
                                PENDING
                            =================================== */}

                            {order.status === "PENDING" && (
                              <>
                                {/* APPROVE */}

                                <button
                                  type="button"
                                  onClick={() => handleApprove(order.id)}
                                  disabled={actionLoading !== null}
                                  className="px-2.5 py-1 text-[10px] font-semibold rounded-md border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {actionLoading === `approve-${order.id}`
                                    ? "Approving..."
                                    : "Approve"}
                                </button>

                                {/* CANCEL */}

                                <button
                                  type="button"
                                  onClick={() => handleCancel(order.id)}
                                  disabled={actionLoading !== null}
                                  className="px-2.5 py-1 text-[10px] font-semibold rounded-md border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {actionLoading === `cancel-${order.id}`
                                    ? "Cancelling..."
                                    : "Cancel"}
                                </button>
                              </>
                            )}

                            {/* ==================================
                                APPROVED
                            =================================== */}

                            {order.status === "APPROVED" && (
                              <>
                                {/* RECEIVE */}

                                <button
                                  type="button"
                                  onClick={() => handleReceive(order.id)}
                                  disabled={actionLoading !== null}
                                  className="px-2.5 py-1 text-[10px] font-semibold rounded-md border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {actionLoading === `receive-${order.id}`
                                    ? "Receiving..."
                                    : "Receive"}
                                </button>

                                {/* CANCEL */}

                                <button
                                  type="button"
                                  onClick={() => handleCancel(order.id)}
                                  disabled={actionLoading !== null}
                                  className="px-2.5 py-1 text-[10px] font-semibold rounded-md border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {actionLoading === `cancel-${order.id}`
                                    ? "Cancelling..."
                                    : "Cancel"}
                                </button>
                              </>
                            )}
                            {/* ==================================
                                RECEIVED
                            =================================== */}

                            {order.status === "RECEIVED" && (
                              <span className="text-[10px] font-semibold text-emerald-600">
                                Completed
                              </span>
                            )}

                            {/* ==================================
                                CANCELLED
                            =================================== */}

                            {order.status === "CANCELLED" && (
                              <span className="text-[10px] font-semibold text-rose-500">
                                Cancelled
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
