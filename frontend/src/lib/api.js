const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
const API_BASE = API_ORIGIN ? `${API_ORIGIN}/api` : "/api";

/**
 * Lightweight fetch wrapper with timeout, error handling, and response parsing.
 */
export async function apiFetch(endpoint, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(new DOMException("Request timed out after 30 seconds", "TimeoutError")),
    30000
  );

  try {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Attach auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      signal: controller.signal,
      headers,
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    let data;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
    }

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    return data;
  } catch (err) {
    // Handle abort/timeout errors with a clear message
    if (err.name === "AbortError" || err.name === "TimeoutError") {
      throw new Error(". Please check your internet connection or try again.");
    }
    // Handle network failures (backend not running)
    if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
      throw new Error("Cannot connect to server. Please make sure the backend is running.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/* ── Convenience methods ── */

export const api = {
  // Homes
  getHomes: () => apiFetch("/homes"),
  getHome: (id) => apiFetch(`/homes/${id}`),

  // Bookings
  bookHome: (id, userName) =>
    apiFetch(`/book/${id}`, {
      method: "POST",
      body: { userName },
    }),

  getBookings: () => apiFetch("/bookings"),

  deleteBooking: (id, bookedAt) =>
    apiFetch(`/delete-booking/${id}`, {
      method: "POST",
      body: { bookedAt },
    }),

  // Favourites
  getFavourites: () => apiFetch("/favourites"),

  addFavourite: (id) =>
    apiFetch(`/add-favourite/${id}`, {
      method: "POST",
    }),

  removeFavourite: (id) =>
    apiFetch(`/remove-favourite/${id}`, {
      method: "POST",
    }),

  // Host
  getHostHomes: () => apiFetch("/host/homes"),

  addHome: (data) =>
    apiFetch("/host/add-home", {
      method: "POST",
      body: data,
    }),

  updateHome: (id, data) =>
    apiFetch(`/host/edit-home/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteHome: (id) =>
    apiFetch(`/host/delete-home/${id}`, {
      method: "DELETE",
    }),

  // User Auth
  register: (data) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: data,
    }),

  login: (data) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: data,
    }),

  getMe: () => apiFetch("/auth/me"),

  updateProfile: (data) =>
    apiFetch("/auth/update-profile", {
      method: "PUT",
      body: data,
    }),

  changePassword: (data) =>
    apiFetch("/auth/change-password", {
      method: "PUT",
      body: data,
    }),

  forgotPassword: (email) =>
    apiFetch("/auth/forgot-password", {
      method: "POST",
      body: { email },
    }),

  resetPassword: (token, data) =>
    apiFetch(`/auth/reset-password/${token}`, {
      method: "POST",
      body: data,
    }),

  verifyEmail: (token) => apiFetch(`/auth/verify-email/${token}`),

  sendVerification: (data) =>
    apiFetch("/auth/send-verification", {
      method: "POST",
      body: data,
    }),

  // Admin Auth
  adminLogin: (data) =>
    apiFetch("/admin/login", {
      method: "POST",
      body: data,
    }),

  adminRegister: (data) =>
    apiFetch("/admin/register", {
      method: "POST",
      body: data,
    }),

  adminGetMe: () => apiFetch("/admin/me"),

  createAdmin: (data) =>
    apiFetch("/admin/register", {
      method: "POST",
      body: data,
    }),

  listAdmins: () => apiFetch("/admin/list"),

  listUsers: () => apiFetch("/admin/users"),

  adminUpdateUser: (id, data) =>
    apiFetch(`/admin/users/${id}`, {
      method: "PUT",
      body: data,
    }),

  adminDeleteUser: (id) =>
    apiFetch(`/admin/users/${id}`, {
      method: "DELETE",
    }),

  toggleAdminStatus: (id) =>
    apiFetch(`/admin/toggle-status/${id}`, {
      method: "PUT",
    }),
};
