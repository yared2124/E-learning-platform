import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <div className="auth-glow"></div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">
          Sign in to continue your learning journey
        </p>

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
              placeholder="Password"
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
            <LogIn size={18} style={{ marginRight: "8px" }} />
            Sign In
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
