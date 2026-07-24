// BASE should NOT include a trailing /api — every call below passes a path
// that already starts with /api/... (matching the backend's route prefixes).
const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

function authHeaders() {
  const t = localStorage.getItem("adminToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// Reads a JSON error body defensively and returns a human-readable message.
// The backend returns either { message } or, for validation failures,
// { message: "Validation failed", errors: [{ field, message }] }.
async function extractError(res) {
  try {
    const body = await res.json();
    if (body.errors && Array.isArray(body.errors) && body.errors.length) {
      return body.errors.map((e) => e.message).join(", ");
    }
    return body.message || body.error || "Request failed";
  } catch {
    return `Request failed (${res.status})`;
  }
}

// If the admin's token is missing/expired, every admin-only endpoint returns
// 401. Send them back to the login screen instead of showing a dead dashboard.
function handleUnauthorized(res) {
  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("adminToken");
    if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
      window.location.href = "/admin/login";
    }
  }
}

export async function apiGet(path) {
  const res = await fetch(`${BASE}${path}`, { headers: { ...authHeaders() } });
  if (!res.ok) {
    handleUnauthorized(res);
    throw new Error(await extractError(res));
  }
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    handleUnauthorized(res);
    throw new Error(await extractError(res));
  }
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    handleUnauthorized(res);
    throw new Error(await extractError(res));
  }
  return res.json();
}

export async function apiPatch(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    handleUnauthorized(res);
    throw new Error(await extractError(res));
  }
  return res.json();
}

// For multipart/form-data uploads (media library). Do NOT set a
// Content-Type header here — the browser needs to add its own boundary,
// which it can only do if we let fetch set the header itself.
export async function apiUpload(path, formData) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  });
  if (!res.ok) {
    handleUnauthorized(res);
    throw new Error(await extractError(res));
  }
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${BASE}${path}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    handleUnauthorized(res);
    throw new Error(await extractError(res));
  }
  return res.json();
}

// Resumes require the admin's Bearer token, so a plain <a href> won't work —
// fetch the bytes ourselves, then either open them in a new tab (view) or
// trigger a browser download (download), and revoke the blob URL afterwards.
export async function apiOpenFile(path, { filename, download = false } = {}) {
  const res = await fetch(`${BASE}${path}`, { headers: { ...authHeaders() } });
  if (!res.ok) {
    handleUnauthorized(res);
    throw new Error(await extractError(res));
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  if (download) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
