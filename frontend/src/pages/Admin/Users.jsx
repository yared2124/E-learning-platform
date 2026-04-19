import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { Trash2, Shield } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    api.admin.getUsers().then((res) => {
      setUsers(res.users);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId, role) => {
    await api.admin.updateRole(userId, role);
    fetchUsers();
  };

  const deleteUser = async (userId) => {
    if (confirm("Delete user?")) {
      await api.admin.deleteUser(userId);
      fetchUsers();
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container">
      <h1>
        <Shield /> Manage Users
      </h1>
      <div
        className="glass-card"
        style={{ overflowX: "auto", padding: "1rem" }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.user_id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
              >
                <td style={{ padding: "0.75rem" }}>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.user_id, e.target.value)}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "0.5rem",
                      padding: "0.25rem",
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => deleteUser(user.user_id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#ff6b6b",
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
