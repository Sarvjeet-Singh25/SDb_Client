import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiGet } from "../lib/api";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(() => localStorage.getItem("adminTheme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("adminTheme", dark ? "dark" : "light");
  }, [dark]);

  const refreshAdmin = useCallback(async () => {
    try {
      const r = await apiGet("/api/admin/me");
      setAdmin(r.admin);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAdmin();
  }, [refreshAdmin]);

  return (
    <AdminContext.Provider value={{ admin, loading, refreshAdmin, dark, setDark }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within an AdminProvider");
  return ctx;
}
