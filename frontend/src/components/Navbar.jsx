import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GraduationCap, LogOut, User, Shield } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <GraduationCap size={28} />
        <span style={{ fontWeight: "bold", fontSize: "1.25rem" }}>E-Learn</span>
      </div>
      <div className="nav-links">
        <Link to="/">Courses</Link>
        {user && <Link to="/dashboard">Dashboard</Link>}
        {user?.role === "admin" && <Link to="/admin/users">Users</Link>}
        {user ? (
          <button
            onClick={logout}
            style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
          >
            <LogOut size={18} /> Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
