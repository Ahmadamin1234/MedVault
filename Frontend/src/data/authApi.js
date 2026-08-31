// src/data/authApi.js

// 🍏 VERIFIED PATH: Point to your local Django REST core prefix url channel
const API_BASE_URL = "http://localhost:8000/api";
let csrfToken = null;

async function request(path, { method = "GET", payload } = {}) {
  const headers = {};
  if (payload) headers["Content-Type"] = "application/json";

  // 🍏 HIGH SECURITY OVERRIDE: Prioritize our verified memory variable 
  // to avoid cross-origin cookie-reading issues on localhost
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken;
    }
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include", // ⚠️ CRITICAL: Instructs the browser to pass HttpOnly session cookies automatically
      cache: "no-store",
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
    });
  } catch {
    throw new Error(
      "Cannot connect to the server. Please verify Django is running on http://127.0.0.1:8000"
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof data === 'object' 
      ? Object.values(data).flat().join(" ") 
      : "Request failed. Please try again.";
    
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function ensureCsrfToken() {
  try {
    // 🍏 THE WORKAROUND: Extract the clean token value string from the JSON response body
    // instead of depending on document.cookie parsing across localhost ports
    const data = await request("/auth/csrf/");
    if (data && data.csrfToken) {
      csrfToken = data.csrfToken;
    }
    return csrfToken;
  } catch (error) {
    console.error("Failed to secure CSRF cookie footprint:", error);
  }
}

export async function login(credentials) {
  await ensureCsrfToken();
  const data = await request("/auth/login/", { method: "POST", payload: credentials });
  localStorage.setItem('is_logged_in', 'true');
  return data;
}

export async function register(formData) {
  await ensureCsrfToken();
  const data = await request("/auth/register/", { method: "POST", payload: formData });
  localStorage.setItem('is_logged_in', 'true');
  return data;
}

export async function refreshAccessToken() {
  await ensureCsrfToken();
  return request("/auth/refresh/", { method: "POST" });
}

export async function getCurrentUser() {
  try {
    return await request("/auth/me/");
  } catch (error) {
    if (error.status !== 401) throw error;
    await refreshAccessToken();
    return request("/auth/me/");
  }
}

export async function logout() {
  await ensureCsrfToken();
  const data = await request("/auth/logout/", { method: "POST" });
  localStorage.clear();
  return data;
}

export async function getMedications() {
  return request("/inventory/medications/");
}

export async function createMedication(payload) {
  await ensureCsrfToken();
  return request("/inventory/medications/", { method: "POST", payload });
}
export async function getMedication(id) {
  return request(`/inventory/medications/${id}/`);
}


export async function updateMedication(id, payload) {
  await ensureCsrfToken();

  return request(`/inventory/medications/${id}/`, {
    method: "PATCH",
    payload,
  });
}


export async function deleteMedication(id) {
  await ensureCsrfToken();

  return request(`/inventory/medications/${id}/`, {
    method: "DELETE",
  });
}
export async function getSuppliers() {
  return request("/suppliers/");
}

export async function createSupplier(payload) {
  await ensureCsrfToken();
  return request("/suppliers/", { method: "POST", payload });
}
export async function updateSupplier(id, payload) {
  await ensureCsrfToken();

  return request(`/suppliers/${id}/`, {
    method: "PATCH",
    payload,
  });
}


export async function deleteSupplier(id) {
  await ensureCsrfToken();

  return request(`/suppliers/${id}/`, {
    method: "DELETE",
  });
}
export async function getPurchaseOrders() {
  return request("/orders/");
}

export async function getPurchaseOrderSummary() {
  return request("/orders/summary/");
}

export async function createPurchaseOrder(payload) {
  await ensureCsrfToken();
  return request("/orders/", { method: "POST", payload });
}
export async function approvePurchaseOrder(id) {
  await ensureCsrfToken();

  return request(`/orders/${id}/approve/`, {
    method: "POST",
  });
}

export async function receivePurchaseOrder(id) {
  await ensureCsrfToken();

  return request(`/orders/${id}/receive/`, {
    method: "POST",
  });
}
export async function cancelPurchaseOrder(id) {
  await ensureCsrfToken();

  return request(`/orders/${id}/cancel/`, {
    method: "POST",
  });
}

export async function getExpiryAlerts() {
  return request("/expiry/");
}

export async function resolveExpiry(batchId, action) {
  await ensureCsrfToken();
  return request(`/expiry/${batchId}/action/`, {
    method: "POST",
    payload: { action },
  });
}

export async function getSales() {
  return request("/billing/");
}

export async function createSale(payload) {
  await ensureCsrfToken();
  return request("/billing/", { method: "POST", payload });
}

export async function getDashboardAnalytics() {
  return request("/analytics/dashboard/");
}

export async function getReportsAnalytics() {
  return request("/analytics/reports/");
}

export async function getStaff() {
  return request("/staff/");
}

export async function createStaff(payload) {
  await ensureCsrfToken();
  return request("/staff/", { method: "POST", payload });
}
export async function updateStaff(id, payload){
  await ensureCsrfToken();
  return request(`/staff/${id}/`, {method: "PATCH", payload});
}
export async function deleteStaff(id) {
  await ensureCsrfToken();
  return  request(`/staff/${id}/`, {method: "DELETE"});
}

export async function getSettings() {
  return request("/settings/");
}

export async function updateSettings(payload) {
  await ensureCsrfToken();
  return request("/settings/", { method: "PUT", payload });
}
