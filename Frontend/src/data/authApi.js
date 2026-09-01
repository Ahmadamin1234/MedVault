const API_BASE_URL = "http://localhost:8000/api";

let csrfToken = null;

// =====================================================
// CSRF TOKEN
// =====================================================

export async function ensureCsrfToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/csrf/`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.csrfToken) {
      csrfToken = data.csrfToken;
    }

    return csrfToken;

  } catch (error) {
    console.error("Failed to get CSRF token:", error);
    return null;
  }
}


// =====================================================
// MAIN REQUEST FUNCTION
// =====================================================

async function request(
  path,
  {
    method = "GET",
    payload,
    retry = true,
  } = {}
) {

  const headers = {};

  if (payload) {
    headers["Content-Type"] = "application/json";
  }

  // CSRF for state-changing requests
  if (
    ["POST", "PUT", "PATCH", "DELETE"].includes(method)
  ) {

    if (!csrfToken) {
      await ensureCsrfToken();
    }

    if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken;
    }
  }

  let response;

  try {

    response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        method,
        credentials: "include",
        cache: "no-store",
        headers,
        body: payload
          ? JSON.stringify(payload)
          : undefined,
      }
    );

  } catch {

    throw new Error(
      "Cannot connect to the server. Please verify Django is running."
    );

  }

  const data = await response
    .json()
    .catch(() => ({}));


  // ===================================================
  // SUCCESS
  // ===================================================

  if (response.ok) {
    return data;
  }


  // ===================================================
  // ACCESS TOKEN EXPIRED
  // ===================================================

  if (
    response.status === 401 &&
    retry &&
    path !== "/auth/refresh/"
  ) {

    try {

      console.log(
        "Access token expired. Refreshing token..."
      );

      await refreshAccessToken();

      console.log(
        "Access token refreshed. Retrying request..."
      );

      return await request(path, {
        method,
        payload,
        retry: false,
      });

    } catch (refreshError) {

      console.error(
        "Refresh token failed:",
        refreshError
      );

      const error = new Error(
        "Session expired. Please log in again."
      );

      error.status = 401;

      throw error;
    }
  }


  // ===================================================
  // NORMAL ERROR
  // ===================================================

  let message = "Request failed. Please try again.";

  if (data && typeof data === "object") {

    message = Object.values(data)
      .flat()
      .join(" ");

  }

  const error = new Error(message);

  error.status = response.status;

  throw error;
}


// =====================================================
// LOGIN
// =====================================================

export async function login(credentials) {

  await ensureCsrfToken();

  const data = await request(
    "/auth/login/",
    {
      method: "POST",
      payload: credentials,
    }
  );

  localStorage.setItem(
    "is_logged_in",
    "true"
  );

  return data;
}


// =====================================================
// REGISTER
// =====================================================

export async function register(formData) {

  await ensureCsrfToken();

  const data = await request(
    "/auth/register/",
    {
      method: "POST",
      payload: formData,
    }
  );

  localStorage.setItem(
    "is_logged_in",
    "true"
  );

  return data;
}


// =====================================================
// REFRESH ACCESS TOKEN
// =====================================================

export async function refreshAccessToken() {

  await ensureCsrfToken();

  return request(
    "/auth/refresh/",
    {
      method: "POST",
      retry: false,
    }
  );
}


// =====================================================
// CURRENT USER
// =====================================================

export async function getCurrentUser() {

  return request(
    "/auth/me/"
  );
}


// =====================================================
// LOGOUT
// =====================================================

export async function logout() {

  await ensureCsrfToken();

  const data = await request(
    "/auth/logout/",
    {
      method: "POST",
      retry: false,
    }
  );

  localStorage.clear();

  return data;
}


// =====================================================
// MEDICATIONS
// =====================================================

export async function getMedications() {

  return request(
    "/inventory/medications/"
  );
}


export async function createMedication(payload) {

  await ensureCsrfToken();

  return request(
    "/inventory/medications/",
    {
      method: "POST",
      payload,
    }
  );
}


export async function getMedication(id) {

  return request(
    `/inventory/medications/${id}/`
  );
}


export async function updateMedication(id, payload) {

  await ensureCsrfToken();

  return request(
    `/inventory/medications/${id}/`,
    {
      method: "PATCH",
      payload,
    }
  );
}


export async function deleteMedication(id) {

  await ensureCsrfToken();

  return request(
    `/inventory/medications/${id}/`,
    {
      method: "DELETE",
    }
  );
}


// =====================================================
// SUPPLIERS
// =====================================================

export async function getSuppliers() {

  return request(
    "/suppliers/"
  );
}


export async function createSupplier(payload) {

  await ensureCsrfToken();

  return request(
    "/suppliers/",
    {
      method: "POST",
      payload,
    }
  );
}


export async function updateSupplier(id, payload) {

  await ensureCsrfToken();

  return request(
    `/suppliers/${id}/`,
    {
      method: "PATCH",
      payload,
    }
  );
}


export async function deleteSupplier(id) {

  await ensureCsrfToken();

  return request(
    `/suppliers/${id}/`,
    {
      method: "DELETE",
    }
  );
}


// =====================================================
// PURCHASE ORDERS
// =====================================================

export async function getPurchaseOrders() {

  return request(
    "/orders/"
  );
}


export async function getPurchaseOrderSummary() {

  return request(
    "/orders/summary/"
  );
}


export async function createPurchaseOrder(payload) {

  await ensureCsrfToken();

  return request(
    "/orders/",
    {
      method: "POST",
      payload,
    }
  );
}


export async function approvePurchaseOrder(id) {

  await ensureCsrfToken();

  return request(
    `/orders/${id}/approve/`,
    {
      method: "POST",
    }
  );
}


export async function receivePurchaseOrder(id) {

  await ensureCsrfToken();

  return request(
    `/orders/${id}/receive/`,
    {
      method: "POST",
    }
  );
}


export async function cancelPurchaseOrder(id) {

  await ensureCsrfToken();

  return request(
    `/orders/${id}/cancel/`,
    {
      method: "POST",
    }
  );
}


// =====================================================
// EXPIRY
// =====================================================

export async function getExpiryAlerts() {

  return request(
    "/expiry/"
  );
}


export async function resolveExpiry(
  batchId,
  action
) {

  await ensureCsrfToken();

  return request(
    `/expiry/${batchId}/action/`,
    {
      method: "POST",
      payload: {
        action,
      },
    }
  );
}


// =====================================================
// SALES
// =====================================================

export async function getSales() {

  return request(
    "/billing/"
  );
}


export async function createSale(payload) {

  await ensureCsrfToken();

  return request(
    "/billing/",
    {
      method: "POST",
      payload,
    }
  );
}


// =====================================================
// ANALYTICS
// =====================================================

export async function getDashboardAnalytics() {

  return request(
    "/analytics/dashboard/"
  );
}


export async function getReportsAnalytics() {

  return request(
    "/analytics/reports/"
  );
}


// =====================================================
// STAFF
// =====================================================

export async function getStaff() {

  return request(
    "/staff/"
  );
}


export async function createStaff(payload) {

  await ensureCsrfToken();

  return request(
    "/staff/",
    {
      method: "POST",
      payload,
    }
  );
}


export async function updateStaff(id, payload) {

  await ensureCsrfToken();

  return request(
    `/staff/${id}/`,
    {
      method: "PATCH",
      payload,
    }
  );
}


export async function deleteStaff(id) {

  await ensureCsrfToken();

  return request(
    `/staff/${id}/`,
    {
      method: "DELETE",
    }
  );
}

export async function globalSearch(query) {
  const search = query.trim();

  if (!search) {
    return {
      medications: [],
      suppliers: [],
      purchaseOrders: [],
      sales: [],
      staff: [],
    };
  }

  try {
    const [
      medications,
      suppliers,
      purchaseOrders,
      sales,
      staff,
    ] = await Promise.all([
      getMedications(),
      getSuppliers(),
      getPurchaseOrders(),
      getSales(),
      getStaff(),
    ]);

    const searchLower = search.toLowerCase();

    const medicationsResult = (
      Array.isArray(medications) ? medications : []
    ).filter((item) =>
      [
        item.name,
        item.generic,
        item.generic_name,
        item.sku,
        item.category,
        item.supplier_name,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(searchLower)
        )
    );

    const suppliersResult = (
      Array.isArray(suppliers) ? suppliers : []
    ).filter((item) =>
      [
        item.name,
        item.email,
        item.phone,
        item.address,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(searchLower)
        )
    );

    const purchaseOrdersResult = (
      Array.isArray(purchaseOrders)
        ? purchaseOrders
        : []
    ).filter((item) =>
      [
        item.poNumber,
        item.po_number,
        item.supplier_name,
        item.status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(searchLower)
        )
    );

    const salesResult = (
      Array.isArray(sales) ? sales : []
    ).filter((item) =>
      [
        item.id,
        item.invoice_number,
        item.customer_name,
        item.patient_name,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(searchLower)
        )
    );

    const staffResult = (
      Array.isArray(staff) ? staff : []
    ).filter((item) =>
      [
        item.name,
        item.email,
        item.role,
        item.phone,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(searchLower)
        )
    );

    return {
      medications: medicationsResult,
      suppliers: suppliersResult,
      purchaseOrders: purchaseOrdersResult,
      sales: salesResult,
      staff: staffResult,
    };

  } catch (error) {
    console.error("Global search failed:", error);
    throw error;
  }
}

