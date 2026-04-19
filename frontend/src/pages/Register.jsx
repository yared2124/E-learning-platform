import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

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
    <div
      className="container"
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="glass-card"
        style={{ padding: "2rem", width: "100%", maxWidth: "400px" }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Register
        </h2>
        {error && (
          <div
            style={{
              color: "#ff6b6b",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-3d"
            style={{ width: "100%", marginBottom: "1rem" }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-3d"
            style={{ width: "100%", marginBottom: "1rem" }}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-3d"
            style={{ width: "100%", marginBottom: "1.5rem" }}
            required
          />
          <button
            type="submit"
            className="btn-3d"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <UserPlus size={18} /> Register
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#a777e3" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
