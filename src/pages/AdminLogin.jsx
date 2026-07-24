import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react"; 
import { apiPost } from "../lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  // Any time this page is reached — typed directly, clicked to, or landed on
  // via the browser's back/forward buttons — any existing session is thrown
  // away. That way "back" then "forward" into /admin never finds a live
  // token and always re-prompts for the password.
  useEffect(() => {
    localStorage.removeItem("adminToken");
  }, []);

  async function submit(e) {
    e.preventDefault();
    setErr(""); // Clear previous errors
    
    try {
      const r = await apiPost("/api/admin/login", { email, password });

      if (r && r.token) {
        localStorage.setItem("adminToken", r.token);
        nav("/admin");
      } else {
        setErr("Login failed. Please verify credentials.");
      }
    } catch (error) {
      console.error("Login authorization error:", error);
      setErr(error.message || "Network error. Unable to connect to control terminal.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7f6] font-sans text-[#4b5563] px-4">
      
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold tracking-wider text-[#343a40] uppercase">Console Terminal</h2>
        <p className="text-xs text-gray-500">Vishweb / Access Point</p>
      </div>

      <div className="w-full max-w-md bg-white rounded shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-[#343a40] text-white px-6 py-4">
          <h1 className="text-sm font-semibold tracking-wide uppercase">Admin Authentication</h1>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          
          {err && (
            <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2.5 text-red-700 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium">{err}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
              Secure Terminal Email
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
              Access Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm text-white py-2.5 rounded shadow-xs transition-colors focus:outline-none"
            >
              Initialize Session
            </button>
          </div>
        </form>
      </div>

      <p className="text-[11px] text-gray-400 mt-8">
        &copy; Sdb International . System Restricted.
      </p>
    </div>
  );
}