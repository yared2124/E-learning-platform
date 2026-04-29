import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GraduationCap, LogOut, User, Shield, BookOpen } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <GraduationCap size={32} />
        <span>E-Learn</span>
      </Link>
      <div className="nav-links">
        <Link to="/">
          <BookOpen size={18} style={{ marginRight: "6px" }} />
          Courses
        </Link>
        {user && (
          <Link to="/dashboard">
            <User size={18} style={{ marginRight: "6px" }} />
            Dashboard
          </Link>
        )}
        {user?.role === "admin" && (
          <Link to="/admin/users">
            <Shield size={18} style={{ marginRight: "6px" }} />
            Users
          </Link>
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
