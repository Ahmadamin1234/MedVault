import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../data/authApi";

export default function ProtectedRoute() {
  const [status, setStatus] = useState("checking");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        // 🍏 VERIFIED PATH: Captures the complete user profile data payload securely 
        setCurrentUser(data); 
        setStatus("authenticated");
      })
      .catch((err) => {
        console.warn("Session token verification rejected by Django:", err.message);
        setStatus("unauthenticated");
      });
  }, []);

  // While waiting for Django to decrypt the HttpOnly cookie, keep the canvas blank or loading
  if (status === "checking") {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 text-slate-400 font-medium text-xs">
         Verifying secure administrative session...
      </div>
    );
  }

  return status === "authenticated" ? (
    // Outlet context makes 'currentUser' available universally to all secure children pages
    <Outlet context={{ currentUser }} />
  ) : (
    <Navigate to="/login" replace />
  );
}
