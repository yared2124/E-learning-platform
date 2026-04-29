import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { UserPlus, User, Mail, Lock, Sparkles } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <div className="auth-glow"></div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us and start learning today</p>

        {error && (
          <div
            className="form-error"
            style={{ textAlign: "center", marginBottom: "1rem" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-3d"
              required
            />
            <User className="input-icon" size={18} />
          </div>

          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-3d"
              required
            />
            <Mail className="input-icon" size={18} />
          </div>

          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-3d"
              required
            />
            <Lock className="input-icon" size={18} />
          </div>

          <button
            type="submit"
            className="btn-3d"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            <UserPlus size={18} style={{ marginRight: "8px" }} />
            Create Account
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
