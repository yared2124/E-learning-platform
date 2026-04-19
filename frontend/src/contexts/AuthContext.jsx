import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api/client";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.auth
      .getMe()
      .then((res) => {
        setUser(res.user);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const res = await api.auth.login(email, password);
    if (res.token) localStorage.setItem("token", res.token);
    setUser(res.user);
    const from = location.state?.from?.pathname || "/dashboard";
    navigate(from, { replace: true });
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.auth.register(name, email, password);
    if (res.token) localStorage.setItem("token", res.token);
    setUser(res.user);
    const from = location.state?.from?.pathname || "/dashboard";
    navigate(from, { replace: true });
    return res;
  };

  const logout = async () => {
    await api.auth.logout();
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const value = { user, loading, login, register, logout };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
