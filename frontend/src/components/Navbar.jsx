import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { BookOpen, GraduationCap, LogOut, Shield, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="brand-mark">
          <GraduationCap size={24} />
        </span>
        <span>E-Learn</span>
      </Link>
      <div className="nav-links">
        <NavLink to="/">
          <BookOpen size={18} style={{ marginRight: "6px" }} />
          Courses
        </NavLink>
        {user && (
          <NavLink to="/dashboard">
            <User size={18} style={{ marginRight: "6px" }} />
            Dashboard
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/admin/users">
            <Shield size={18} style={{ marginRight: "6px" }} />
            Users
          </NavLink>
        )}
        {user ? (
          <button onClick={logout} className="btn-logout">
            <LogOut size={18} />
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
