import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { Trash2, Shield, Users as UsersIcon, UserCheck, UserX, Crown } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      await api.admin.deleteUser(userId);
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin": return <Crown size={14} />;
      case "instructor": return <UserCheck size={14} />;
      default: return <UserX size={14} />;
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case "admin": return "role-badge admin";
      case "instructor": return "role-badge instructor";
      default: return "role-badge student";
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-content">
          <Shield size={32} />
          <div>
            <h1>User Management</h1>
            <p>Manage all registered users and their roles</p>
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card" style={{ flex: 1 }}>
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}>
            <UsersIcon size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card" style={{ flex: 1 }}>
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #f472b6, #c026d3)" }}>
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{users.filter(u => u.role === "instructor").length}</span>
            <span className="stat-label">Instructors</span>
          </div>
        </div>
        <div className="stat-card" style={{ flex: 1 }}>
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
            <Crown size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{users.filter(u => u.role === "admin").length}</span>
            <span className="stat-label">Admins</span>
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="search-box">
          <UsersIcon size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-3d"
          />
        </div>
      </div>

      <div className="glass-card" style={{ overflowX: "auto", padding: "0" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user.user_id}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="user-name">{user.name}</span>
                  </div>
                </td>
                <td>
                  <span className="user-email">{user.email}</span>
                </td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.user_id, e.target.value)}
                    className="role-select"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn-icon delete"
                    onClick={() => deleteUser(user.user_id)}
                    title="Delete user"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <UsersIcon size={48} />
            <p>No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
