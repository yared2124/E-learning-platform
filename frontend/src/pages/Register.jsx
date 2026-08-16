import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Rocket,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";

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
    <div className="auth-page">
      <section className="auth-visual register-visual">
        <div className="auth-brand-mark">
          <Rocket size={34} />
        </div>
        <p className="eyebrow">Start your path</p>
        <h1>Create your learning account and unlock your next course.</h1>
        <p>
          Join as a learner, then grow into guided lessons, quizzes, and clear
          progress tracking.
        </p>
        <div className="auth-benefits">
          <span><CheckCircle2 size={16} /> Personal course progress</span>
          <span><CheckCircle2 size={16} /> Clean student dashboard</span>
          <span><CheckCircle2 size={16} /> Quiz and lesson tracking</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-icon">
            <Sparkles size={22} />
          </div>
          <h2 className="auth-title">Create account</h2>
          <p className="auth-subtitle">Join and start learning today.</p>

          {error && <div className="form-error auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="input-wrapper">
              <span>Full name</span>
              <User className="input-icon" size={18} />
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-3d"
                required
              />
            </label>

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
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-3d"
                required
              />
            </label>

            <button type="submit" className="btn-3d auth-submit">
              <UserPlus size={18} />
              Create account
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
