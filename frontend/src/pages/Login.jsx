import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  LineChart,
  Lock,
  LogIn,
  Mail,
  Sparkles,
} from "lucide-react";

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
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-brand-mark">
          <GraduationCap size={34} />
        </div>
        <p className="eyebrow">Smart learning portal</p>
        <h1>Build skills with a dashboard that keeps every lesson moving.</h1>
        <p>
          Track progress, continue courses, and manage learning activity from
          one modern workspace.
        </p>
        <div className="auth-preview">
          <div className="preview-row">
            <span><BookOpen size={16} /> Active courses</span>
            <strong>12</strong>
          </div>
          <div className="preview-meter">
            <span style={{ width: "76%" }}></span>
          </div>
          <div className="preview-row">
            <span><LineChart size={16} /> Weekly progress</span>
            <strong>+24%</strong>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-icon">
            <Sparkles size={22} />
          </div>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to continue learning.</p>

          {error && <div className="form-error auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="input-wrapper">
              <span>Email address</span>
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-3d"
                required
              />
            </label>

            <label className="input-wrapper">
              <span>Password</span>
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-3d"
                required
              />
            </label>

            <button type="submit" className="btn-3d auth-submit">
              <LogIn size={18} />
              Sign in
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
