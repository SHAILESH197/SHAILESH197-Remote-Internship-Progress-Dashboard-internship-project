import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [tasks, setTasks] = useState([]);

  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_URL = "http://127.0.0.1:8000";

  const loginUser = async () => {
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      // 🔐 LOGIN
      const res = await axios.post(`${API_URL}/users/login`, formData);
      setToken(res.data.access_token);

      // 👤 PROFILE
      const profileRes = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${res.data.access_token}`,
        },
      });

      setRole(profileRes.data.role);

      // 📋 TASKS
      const taskRes = await axios.get(`${API_URL}/users/tasks`, {
        headers: {
          Authorization: `Bearer ${res.data.access_token}`,
        },
      });

      setTasks(taskRes.data.tasks);

      setIsLoggedIn(true);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Login failed");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken("");
    setRole("");
    setTasks([]);
    setEmail("");
    setPassword("");
    setMessage("");
  };

  const testAdminAccess = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Access denied");
    }
  };

  // ================= DASHBOARD =================
  if (isLoggedIn) {
    const isAdmin = role === "admin";

    return (
      <div className="dashboard-layout">
        <aside className="sidebar">
          <h2>InternDash</h2>
          <p className="role-badge">{role}</p>

          <nav>
            <a>Dashboard</a>
            <a>Tasks</a>
            <a>Reports</a>
            <a>Feedback</a>
            {isAdmin && <a>Admin Panel</a>}
          </nav>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </aside>

        <main className="dashboard-main">
          <div className="topbar">
            <div>
              <h1>Remote Internship Progress Dashboard</h1>
              <p>Logged in as: {email}</p>
            </div>

            {isAdmin && (
              <button onClick={testAdminAccess}>
                Check Admin Access
              </button>
            )}
          </div>

          {message && <div className="alert">{message}</div>}

          {/* 🔹 STATS */}
          <div className="stats-grid">
            {isAdmin ? (
              <>
                <div className="stat-card">
                  <h3>Total Students</h3>
                  <p>24</p>
                </div>
                <div className="stat-card">
                  <h3>Active Tasks</h3>
                  <p>18</p>
                </div>
                <div className="stat-card">
                  <h3>Pending Reports</h3>
                  <p>7</p>
                </div>
                <div className="stat-card">
                  <h3>Access Level</h3>
                  <p>Admin</p>
                </div>
              </>
            ) : (
              <>
                <div className="stat-card">
                  <h3>Assigned Tasks</h3>
                  <p>{tasks.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Status</h3>
                  <p>Active</p>
                </div>
                <div className="stat-card">
                  <h3>Role</h3>
                  <p>{role}</p>
                </div>
              </>
            )}
          </div>

          {/* 🔹 TASKS */}
          <div className="content-grid">
            <section className="panel">
              <h2>My Tasks</h2>
              <ul>
                {tasks.map((task, index) => (
                  <li key={index}>
                    {task.title} - {task.status}
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <h2>Recent Activity</h2>
              <ul>
                <li>Login authentication completed</li>
                <li>JWT token generated</li>
                <li>Tasks loaded from backend</li>
                <li>Role-based dashboard enabled</li>
              </ul>
            </section>
          </div>
        </main>
      </div>
    );
  }

  // ================= LOGIN PAGE =================
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Internship Dashboard</h1>

        <div className="login-type">
          <button className="active">Student Login</button>
          <button>Admin Login</button>
        </div>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={loginUser}>Login</button>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;