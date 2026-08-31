// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Core Authorization Pages
import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';

// Layout & Protection Wrappers
import LayoutShell from './components/LayoutShell';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Standard Secure Dashboard Screens
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import PurchaseOrdersPage from './pages/PurchaseOrderPage';
import SuppliersPage from './pages/SupplierPage';
import ExpiryAlertsPage from './pages/ExpiryAlertsPage';
import SalesBillingPage from './pages/SalesBillingPage';
import ReportsPage from './pages/ReportsPage';
import StaffPage from './pages/StaffPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        
        {/* 🔓 PUBLIC OPEN ROUTES: Sidebar and Navbar are completely inaccessible */}
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/signup" element={<SignupPage />} /> */}

        {/* 🔒 PROTECTED ROUTE SHELL: Forces login state validation */}
        <Route element={<ProtectedRoute />}>
          <Route element={
            <LayoutShell 
              isSidebarCollapsed={isSidebarCollapsed} 
              setIsSidebarCollapsed={setIsSidebarCollapsed} 
            />
          }>
            {/* Nested Secure Application Workspaces */}
            <Route element={<RoleProtectedRoute page='dashboard'/>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            <Route element = {<RoleProtectedRoute page='inventory'/>}>
            <Route path="/inventory" element={<InventoryPage />} />
            </Route>
            <Route element={<RoleProtectedRoute page='purchase-orders'/>}>
            <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
            </Route>
            <Route element={<RoleProtectedRoute page='suppliers'/>}>
            <Route path="/suppliers" element={<SuppliersPage />} />
            </Route>
            <Route element={<RoleProtectedRoute page='expiry-alerts'/>}>
            <Route path="/expiry-alerts" element={<ExpiryAlertsPage />} />
            </Route>
            <Route element={<RoleProtectedRoute page='sales-billing'/>}>
            <Route path="/sales-billing" element={<SalesBillingPage />} />
            </Route>
            <Route element={<RoleProtectedRoute page='reports'/>}>
            <Route path="/reports" element={<ReportsPage />} />
            </Route>
            <Route element={<RoleProtectedRoute page='staff'/>}>
            <Route path="/staff" element={<StaffPage />} />
            </Route>
            <Route element={<RoleProtectedRoute page='settings'/>}>
            <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>
        {/* If a user hits a blank URL, automatically check auth and forward them */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* Catch-all unknown paths redirect back to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
