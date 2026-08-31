export const MOCK_STATS = [
  { title: "Total Drugs In Catalog", value: "2,847", subtext: "+4 new items added today", color: "text-emerald-600", bg: "bg-emerald-50", icon: "Package", badgeColor: "text-emerald-500" },
  { title: "Low Stock Alerts", value: "23", subtext: "8 items critical (zero stock)", color: "text-amber-600", bg: "bg-amber-50", icon: "AlertTriangle", badgeColor: "text-amber-500" },
  { title: "Expiring Soon", value: "14", subtext: "3 batches expired today", color: "text-rose-600", bg: "bg-rose-50", icon: "Clock", badgeColor: "text-rose-400" },
  { title: "Today's Sales", value: "$4,280", subtext: "+12% increase from yesterday", color: "text-blue-600", bg: "bg-blue-50", icon: "DollarSign", badgeColor: "text-emerald-500" },
];

export const MOCK_CATEGORIES = [
  { name: "Antibiotics", percentage: "35%", color: "bg-teal-600" },
  { name: "Painkillers", percentage: "25%", color: "bg-blue-500" },
  { name: "Vitamins", percentage: "15%", color: "bg-emerald-400" },
  { name: "Cardiac", percentage: "15%", color: "bg-amber-400" },
  { name: "Respiratory", percentage: "10%", color: "bg-rose-500" },
];

export const MOCK_BILLING = [
  { name: "Amoxicillin 500mg", qty: "40 Tabs", user: "John Doe", price: "$55.00", time: "10:12 AM" },
  { name: "Atorvastatin 20mg", qty: "90 Tabs", user: "Jane Smith", price: "$120.00", time: "11:05 AM" },
  { name: "Lisinopril 10mg", qty: "30 Tabs", user: "Robert Johnson", price: "$45.00", time: "11:45 AM" },
  { name: "Metformin 850mg", qty: "60 Tabs", user: "Emily Davis", price: "$85.00", time: "12:15 PM" },
  { name: "Ibuprofen 400mg", qty: "100 Tabs", user: "Michael Brown", price: "$30.00", time: "01:30 PM" },
];

export const MOCK_LOW_STOCK = [
  { name: "Amlodipine 5mg", info: "Stock: 8 / Min Reorder: 20", pct: "40%", color: "bg-amber-400 text-amber-700 bg-amber-50" },
  { name: "Gabapentin 300mg", info: "Stock: 12 / Min Reorder: 50", pct: "24%", color: "bg-amber-400 text-amber-700 bg-amber-50" },
  { name: "Albuterol Inhaler", info: "Stock: 2 / Min Reorder: 15", pct: "13%", color: "bg-rose-500 text-rose-700 bg-rose-50" },
  { name: "Levothyroxine 50mcg", info: "Stock: 5 / Min Reorder: 30", pct: "17%", color: "bg-amber-400 text-amber-700 bg-amber-50" },
];

export const MOCK_INVENTORY = [
  { id: 1, name: 'Amoxicillin 500mg', generic: 'Amoxicillin Trihydrate', sku: 'AMX-500-100', category: 'Antibiotics', stock: 120, reorder: 30, price: '$1.50', supplier: 'Pfizer India Ltd', status: 'IN STOCK' },
  { id: 2, name: 'Lisinopril 10mg', generic: 'Lisinopril Dihydrate', sku: 'LIS-010-050', category: 'Cardiac', stock: 14, reorder: 25, price: '$0.80', supplier: 'Novartis AG', status: 'LOW STOCK' },
  { id: 3, name: 'Ibuprofen 400mg', generic: 'Ibuprofen', sku: 'IBU-400-100', category: 'Painkillers', stock: 350, reorder: 50, price: '$0.30', supplier: 'Teva Pharma', status: 'IN STOCK' },
  { id: 4, name: 'Metformin 850mg', generic: 'Metformin HCL', sku: 'MET-850-050', category: 'Vitamins', stock: 0, reorder: 40, price: '$0.95', supplier: 'Cipla Labs', status: 'OUT OF STOCK' },
  { id: 5, name: 'Atorvastatin 20mg', generic: 'Atorvastatin', sku: 'ATO-020-050', category: 'Cardiac', stock: 95, reorder: 30, price: '$1.10', supplier: 'Pfizer India Ltd', status: 'IN STOCK' },
];

/**
 * FUTURE PROOFING: 
 * This simulates how Axios will deliver data later. 
 * Your components can use this function right now!
 */
export const fetchDashboardData = async () => {
  // Simulates network latency delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          stats: MOCK_STATS,
          categories: MOCK_CATEGORIES,
          billing: MOCK_BILLING,
          lowStock: MOCK_LOW_STOCK,
          inventory: MOCK_INVENTORY
        }
      });
    }, 300); 
  });
};

/**
 * FUTURE PROOFING AXIOS FOR INVENTORY:
 * This simulates a database response delay.
 */
export const fetchInventoryData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: MOCK_INVENTORY
      });
    }, 1000); // 250ms network loading latency simulation
  });
};
// Add to the bottom of src/data/mockData.js

export const MOCK_PO_SUMMARY = [
  { label: "Pending Approvals", value: "8", icon: "ShoppingCart", bg: "bg-amber-50", color: "text-amber-500" },
  { label: "Orders In Transit", value: "12", icon: "Truck", bg: "bg-blue-50", color: "text-blue-500" },
  { label: "Received (This Month)", value: "34", icon: "CheckCircle", bg: "bg-emerald-50", color: "text-emerald-500" },
  { label: "Total Committed Value", value: "$127,450", icon: "DollarSign", bg: "bg-teal-50", color: "text-teal-600" }
];

export const MOCK_PURCHASE_ORDERS = [
  { id: 1, poNumber: "#PO-2024-0847", supplier: "Pfizer India Ltd", orderDate: "2024-06-12", expectedDelivery: "2024-06-18", itemsCount: "15 items", totalAmount: "$12,450.00", status: "PENDING" },
  { id: 2, poNumber: "#PO-2024-0846", supplier: "Novartis Pharmaceuticals", orderDate: "2024-06-10", expectedDelivery: "2024-06-14", itemsCount: "8 items", totalAmount: "$8,200.00", status: "APPROVED" },
  { id: 3, poNumber: "#PO-2024-0845", supplier: "Teva Pharma Industries", orderDate: "2024-06-05", expectedDelivery: "2024-06-09", itemsCount: "24 items", totalAmount: "$24,150.00", status: "RECEIVED" },
  { id: 4, poNumber: "#PO-2024-0844", supplier: "Cipla Laboratories", orderDate: "2024-06-01", expectedDelivery: "2024-06-05", itemsCount: "5 items", totalAmount: "$3,100.00", status: "CANCELLED" }
];

export const fetchPurchaseOrderData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          summary: MOCK_PO_SUMMARY,
          orders: MOCK_PURCHASE_ORDERS
        }
      });
    }, 1000);
  });
};
// Add to the bottom of src/data/mockData.js

export const MOCK_SUPPLIERS = [
  {
    id: 1,
    name: "Bayer Healthcare AG",
    rep: "Hans Schultz",
    totalDrugs: "112 items",
    lastShipment: "2024-05-20",
    rating: 5,
    statusColor: "bg-teal-500"
  }
];

export const SELECTED_SUPPLIER_DETAIL = {
  name: "Pfizer India Ltd",
  tier: "TIER-1 PREFERRED",
  contact: {
    name: "Rajesh Kumar",
    role: "Director Distribution",
    phone: "+91 22 6650 3000",
    email: "orders@pfizer-india.com"
  },
  terms: {
    window: "Net 30 Days",
    leadTime: "3 - 5 Business Days"
  },
  performance: {
    deliveryRate: "98.4%",
    accuracyRate: "99.1%"
  }
};

export const fetchSupplierData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          suppliers: MOCK_SUPPLIERS,
          selected: SELECTED_SUPPLIER_DETAIL
        }
      });
    }, 1000);
  });
};

// Add to the bottom of src/data/mockData.js

export const MOCK_EXPIRY_SUMMARY = {
  totalValueAtRisk: "$12,340",
  batchesToDispose: 3,
  batchesEligibleForReturn: 8
};

export const MOCK_EXPIRY_BATCHES = [
  // Section 1: Expired Batches
  { id: 1, type: 'EXPIRED', name: 'Ciprofloxacin 250mg', batchNo: 'B-CIP-9082', expiryDate: '2024-05-15', daysLeft: 'EXPIRED', stockQty: '140 Caps', valueAtRisk: '$420.00' },
  { id: 2, type: 'EXPIRED', name: 'Atropine Injection', batchNo: 'B-ATR-1120', expiryDate: '2024-06-01', daysLeft: 'EXPIRED', stockQty: '25 Amps', valueAtRisk: '$180.00' },
  { id: 3, type: 'EXPIRED', name: 'Ranitidine 150mg', batchNo: 'B-RAN-3344', expiryDate: '2024-06-05', daysLeft: 'EXPIRED', stockQty: '300 Tabs', valueAtRisk: '$90.00' },

  // Section 2: Expiring Within 30 Days
  { id: 4, type: '30_DAYS', name: 'Metoprolol Succinate 50mg', batchNo: 'B-MET-0044', expiryDate: '2024-06-25', daysLeft: '11 DAYS', stockQty: '120 Tabs', valueAtRisk: '$340.00', color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { id: 5, type: '30_DAYS', name: 'Doxycycline 100mg', batchNo: 'B-DOX-9988', expiryDate: '2024-06-28', daysLeft: '14 DAYS', stockQty: '80 Caps', valueAtRisk: '$160.00', color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { id: 6, type: '30_DAYS', name: 'Lisinopril 10mg', batchNo: 'B-LIS-1111', expiryDate: '2024-07-05', daysLeft: '21 DAYS', stockQty: '240 Tabs', valueAtRisk: '$190.00', color: 'text-amber-500 bg-amber-50 border-amber-200' },

  // Section 3: Expiring Within 90 Days
  { id: 7, type: '90_DAYS', name: 'Insulin Glargine', batchNo: 'B-INS-3322', expiryDate: '2024-08-15', daysLeft: '62 DAYS', stockQty: '15 Vials', valueAtRisk: '$1,250.00', color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { id: 8, type: '90_DAYS', name: 'Simvastatin 20mg', batchNo: 'B-SIM-4422', expiryDate: '2024-08-20', daysLeft: '67 DAYS', stockQty: '400 Tabs', valueAtRisk: '$280.00', color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { id: 9, type: '90_DAYS', name: 'Omeprazole 20mg', batchNo: 'B-OME-6677', expiryDate: '2024-09-02', daysLeft: '80 DAYS', stockQty: '500 Caps', valueAtRisk: '$450.00', color: 'text-teal-600 bg-teal-50 border-teal-200' }
];

export const fetchExpiryAlertData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          summary: MOCK_EXPIRY_SUMMARY,
          batches: MOCK_EXPIRY_BATCHES
        }
      });
    }, 1000);
  });
};

// Add to the bottom of src/data/mockData.js

export const MOCK_BILLING_CART = [
  { id: 1, name: "Amoxicillin 500mg", qty: 2, price: 15.00, discount: 5, total: 28.50 },
  { id: 2, name: "Atorvastatin 20mg", qty: 1, price: 45.00, discount: 0, total: 45.00 },
  { id: 3, name: "Lisinopril 10mg", qty: 3, price: 12.00, discount: 10, total: 32.40 },
  { id: 4, name: "Metformin 850mg", qty: 2, price: 18.50, discount: 0, total: 37.00 }
];

export const MOCK_BILLING_LOGS = [
  { id: 1, invoiceId: "#INV-2024-9041", customer: "John Doe", amount: "$65.00", time: "10:12 AM", status: "Completed" },
  { id: 2, invoiceId: "#INV-2024-9040", customer: "Jane Smith", amount: "$120.00", time: "09:45 AM", status: "Completed" },
  { id: 3, invoiceId: "#INV-2024-9039", customer: "Robert Johnson", amount: "$45.00", time: "09:12 AM", status: "On Hold" },
  { id: 4, invoiceId: "#INV-2024-9038", customer: "Emily Davis", amount: "$85.00", time: "08:30 AM", status: "Completed" },
  { id: 5, invoiceId: "#INV-2024-9037", customer: "Michael Brown", amount: "$30.00", time: "08:15 AM", status: "Returned" }
];

export const fetchBillingData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          cart: MOCK_BILLING_CART,
          logs: MOCK_BILLING_LOGS
        }
      });
    }, 150);
  });
};
// Add to the bottom of src/data/mockData.js

export const MASTER_DRUG_CATALOG = [
  { id: 101, name: 'Amoxicillin 500mg', generic: 'Amoxicillin Trihydrate', labelDetail: '120 Tabs left (Batch B-AMX-21)', price: 15.00 },
  { id: 102, name: 'Amoxicillin 250mg Suspension', generic: 'Amoxicillin Trihydrate', labelDetail: '45 Bottles left', price: 18.50 },
  { id: 103, name: 'Atorvastatin 20mg', generic: 'Atorvastatin Calcium', labelDetail: '95 Tabs left (Batch B-ATO-09)', price: 45.00 },
  { id: 104, name: 'Lisinopril 10mg', generic: 'Lisinopril Dihydrate', labelDetail: '14 Tabs left (Batch B-LIS-88)', price: 12.00 },
  { id: 105, name: 'Metformin 850mg', generic: 'Metformin HCL', labelDetail: '600 Tabs left (Batch B-MET-52)', price: 18.50 },
];
// Add to the bottom of src/data/mockData.js

export const MOCK_ANALYTICS_SUMMARY = [
  { title: "Net Revenue YTD", value: "$128,450", change: "+14% vs last month", isPositive: true },
  { title: "Gross Profit Margin", value: "34.2%", change: "Target: 32.0%", isPositive: true, isTarget: true },
  { title: "Units Dispensed YTD", value: "8,247", change: "Avg 270 / day", isPositive: true, isTarget: true },
  { title: "Avg Order Value (AOV)", value: "$67.30", change: "-2.4% vs last week", isPositive: false }
];

export const MOCK_TOP_SELLING = [
  { name: "Amoxicillin 500mg", units: 1240, percentage: "100%" },
  { name: "Atorvastatin 20mg", units: 980, percentage: "79%" },
  { name: "Lisinopril 10mg", units: 850, percentage: "68%" },
  { name: "Metformin 850mg", units: 620, percentage: "50%" },
  { name: "Ibuprofen 400mg", units: 590, percentage: "47%" }
];

export const MOCK_CATEGORY_PERFORMANCE = [
  { category: "Antibiotics", q1: "$24,500", q2: "$32,100", sparkPath: "M 0 15 Q 15 5 30 12 T 60 2" },
  { category: "Cardiac", q1: "$18,200", q2: "$22,400", sparkPath: "M 0 18 Q 15 10 30 14 T 60 5" },
  { category: "Painkillers", q1: "$12,400", q2: "$15,600", sparkPath: "M 0 12 Q 15 15 30 8 T 60 4" },
  { category: "Anesthetics", q1: "$9,100", q2: "$11,200", sparkPath: "M 0 15 Q 15 15 30 10 T 60 8" },
  { category: "Vitamins", q1: "$6,500", q2: "$8,200", sparkPath: "M 0 19 Q 15 12 30 15 T 60 10" }
];

export const fetchAnalyticsData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          summary: MOCK_ANALYTICS_SUMMARY,
          topSelling: MOCK_TOP_SELLING,
          performance: MOCK_CATEGORY_PERFORMANCE
        }
      });
    }, 200);
  });
};
// Add to the bottom of src/data/mockData.js

export const MOCK_STAFF = [
  { id: 1, name: "Dr. Sarah Jenkins", role: "Chief Pharmacist", roleColor: "text-teal-600 bg-teal-50", email: "sarah.j@medvault.com", phone: "+1 555-8192", lastActive: "Active Now", access: true },
  { id: 2, name: "Alex Mercer", role: "Inventory Manager", roleColor: "text-blue-600 bg-blue-50", email: "alex.m@medvault.com", phone: "+1 555-0143", lastActive: "15 mins ago", access: true },
  { id: 3, name: "Elena Rostova", role: "Pharmacist", roleColor: "text-teal-600 bg-teal-50", email: "elena.r@medvault.com", phone: "+1 555-7321", lastActive: "1 hour ago", access: true },
  { id: 4, name: "Marcus Brody", role: "Billing Clerk", roleColor: "text-purple-600 bg-purple-50", email: "marcus.b@medvault.com", phone: "+1 555-9041", lastActive: "34 mins ago", access: false },
  { id: 5, name: "Dr. Julian Bashir", role: "Pharmacist", roleColor: "text-teal-600 bg-teal-50", email: "julian.b@medvault.com", phone: "+1 555-3820", lastActive: "4 hours ago", access: true }
];

export const MOCK_ACTIVITY_LOGS = [
  { id: 1, text: "Sarah Jenkins authorized PO-2024-0847", time: "2 mins ago" },
  { id: 2, text: "Alex Mercer updated stock for Ibuprofen", time: "15 mins ago" },
  { id: 3, text: "Marcus Brody processed bill #INV-2024-9041", time: "34 mins ago" },
  { id: 4, text: "Elena Rostova resolved batch expiry alert", time: "1 hour ago" },
  { id: 5, text: "Julian Bashir added Pfizer Inc as Supplier", time: "4 hours ago" }
];

export const fetchStaffData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          staff: MOCK_STAFF,
          logs: MOCK_ACTIVITY_LOGS
        }
      });
    }, 150);
  });
};
// Add to the bottom of src/data/mockData.js

export const MOCK_SETTINGS_DATA = {
  general: {
    storeName: "MedVault Main Dispensary",
    timezone: "Eastern Standard Time (EST / GMT-5)",
    licenseNumber: "RX-LIC-2024-99801",
    currency: "USD ($) - US Dollars",
    phone: "+1 (555) 902-1243",
    address: "451 Health Science Blvd, Suite B"
  },
  thresholds: {
    lowStockThreshold: 30,
    autoReorder: true
  },
  channels: {
    criticalLowAlert: true,
    batchExpiryWarning: true,
    dailySalesPdf: false
  }
};

export const fetchSettingsData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: MOCK_SETTINGS_DATA });
    }, 150);
  });
};
