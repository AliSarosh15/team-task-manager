import { useState, useEffect, useCallback } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8000"; // 🔁 REPLACE WITH YOUR DEPLOYED URL

// ─── API HELPERS ──────────────────────────────────────────────────────────────
const api = {
  async request(path, options = {}) {
    const token = localStorage.getItem("token");
    const headers = { ...options.headers };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || "Request failed");
    }
    return res.json();
  },
  async login(username, password) {
    const body = new URLSearchParams({ username, password });
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(err.detail || "Login failed");
    }
    return res.json();
  },
  async signup(username, password, role) {
    return api.request("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });
  },
  async getDashboard() { return api.request("/dashboard/"); },
  async getProjects() { return api.request("/projects/"); },
  async createProject(data) {
    return api.request("/projects/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  async getTasks() { return api.request("/tasks/"); },
  async getTasksByProject(pid) { return api.request(`/tasks/project/${pid}`); },
  async createTask(data) {
    return api.request("/tasks/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  async updateTask(id, status) {
    return api.request(`/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  },
  async deleteTask(id) {
    return api.request(`/tasks/${id}`, { method: "DELETE" });
  },
};

// ─── DECODE JWT ───────────────────────────────────────────────────────────────
function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch { return null; }
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --bg2: #111118;
    --bg3: #18181f;
    --border: #2a2a38;
    --border2: #3a3a50;
    --text: #e8e8f0;
    --text2: #9090aa;
    --text3: #5a5a72;
    --accent: #6c63ff;
    --accent2: #4a43cc;
    --gold: #f0c040;
    --red: #ff4d6d;
    --green: #2ddf8f;
    --orange: #ff8c42;
    --card: #13131a;
    --card2: #1a1a24;
  }

  body {
    font-family: 'DM Mono', monospace;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── AUTH PAGE ── */
  .auth-wrap {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
  }
  @media (max-width: 768px) { .auth-wrap { grid-template-columns: 1fr; } }

  .auth-left {
    background: linear-gradient(135deg, #0d0d1a 0%, #1a1030 50%, #0a0a15 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    position: relative;
    overflow: hidden;
  }
  .auth-left::before {
    content: '';
    position: absolute;
    top: -100px; left: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%);
    border-radius: 50%;
  }
  .auth-left::after {
    content: '';
    position: absolute;
    bottom: -80px; right: -80px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(240,192,64,0.08) 0%, transparent 70%);
    border-radius: 50%;
  }
  .auth-logo {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 60px;
    z-index: 1;
  }
  .auth-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: 52px;
    font-weight: 800;
    line-height: 1.1;
    z-index: 1;
    margin-bottom: 20px;
  }
  .auth-hero-title span { color: var(--accent); }
  .auth-hero-sub {
    font-size: 14px;
    color: var(--text2);
    line-height: 1.7;
    z-index: 1;
    max-width: 380px;
    margin-bottom: 48px;
  }
  .auth-features { z-index: 1; display: flex; flex-direction: column; gap: 14px; }
  .auth-feature {
    display: flex; align-items: center; gap: 12px;
    font-size: 13px; color: var(--text2);
  }
  .auth-feature-dot {
    width: 8px; height: 8px;
    background: var(--accent);
    border-radius: 50%;
    flex-shrink: 0;
  }

  .auth-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 40px;
    background: var(--bg);
  }
  .auth-form-box {
    width: 100%;
    max-width: 400px;
  }
  .auth-tabs {
    display: flex;
    gap: 0;
    margin-bottom: 36px;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }
  .auth-tab {
    flex: 1;
    padding: 12px;
    background: transparent;
    border: none;
    color: var(--text2);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 1px;
  }
  .auth-tab.active {
    background: var(--accent);
    color: #fff;
  }
  .auth-form-title {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 6px;
  }
  .auth-form-sub { font-size: 12px; color: var(--text3); margin-bottom: 32px; }

  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 11px; color: var(--text2); margin-bottom: 8px; letter-spacing: 1.5px; text-transform: uppercase; }
  .form-input {
    width: 100%;
    padding: 13px 16px;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--accent); }
  .form-input::placeholder { color: var(--text3); }
  .form-select {
    width: 100%;
    padding: 13px 16px;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235a5a72' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
  }
  .form-select option { background: var(--bg3); }

  .btn-primary {
    width: 100%;
    padding: 14px;
    background: var(--accent);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 8px;
  }
  .btn-primary:hover { background: var(--accent2); transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .error-msg {
    background: rgba(255,77,109,0.1);
    border: 1px solid rgba(255,77,109,0.3);
    border-radius: 8px;
    padding: 12px 14px;
    font-size: 12px;
    color: var(--red);
    margin-bottom: 16px;
  }
  .success-msg {
    background: rgba(45,223,143,0.1);
    border: 1px solid rgba(45,223,143,0.3);
    border-radius: 8px;
    padding: 12px 14px;
    font-size: 12px;
    color: var(--green);
    margin-bottom: 16px;
  }

  /* ── DASHBOARD ── */
  .app-layout { display: flex; min-height: 100vh; }

  .sidebar {
    width: 240px;
    flex-shrink: 0;
    background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 28px 0;
    position: fixed;
    height: 100vh;
    overflow-y: auto;
    z-index: 100;
  }
  .sidebar-logo {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 4px;
    color: var(--accent);
    padding: 0 24px;
    margin-bottom: 36px;
    text-transform: uppercase;
  }
  .sidebar-section-label {
    font-size: 9px;
    letter-spacing: 3px;
    color: var(--text3);
    text-transform: uppercase;
    padding: 0 24px;
    margin-bottom: 8px;
    margin-top: 24px;
  }
  .sidebar-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 12px; }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    color: var(--text2);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }
  .nav-item:hover { background: var(--bg3); color: var(--text); }
  .nav-item.active { background: rgba(108,99,255,0.15); color: var(--accent); }
  .nav-icon { font-size: 15px; width: 20px; text-align: center; }

  .sidebar-footer {
    margin-top: auto;
    padding: 16px 12px;
    border-top: 1px solid var(--border);
  }
  .user-chip {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    background: var(--bg3);
  }
  .user-avatar {
    width: 32px; height: 32px;
    background: var(--accent);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .user-info { flex: 1; overflow: hidden; }
  .user-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role {
    font-size: 10px;
    color: var(--gold);
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .logout-btn {
    background: none; border: none;
    color: var(--text3); cursor: pointer;
    font-size: 16px; padding: 4px;
    transition: color 0.2s;
  }
  .logout-btn:hover { color: var(--red); }

  .main-content {
    flex: 1;
    margin-left: 240px;
    padding: 36px 40px;
    min-height: 100vh;
    background: var(--bg);
  }

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 36px;
    flex-wrap: wrap;
    gap: 16px;
  }
  .page-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
  }
  .page-sub { font-size: 12px; color: var(--text3); margin-top: 4px; }

  /* ── STATS CARDS ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
  .stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 22px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: var(--border2); }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent-line, var(--accent));
  }
  .stat-label { font-size: 10px; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; line-height: 1; }
  .stat-icon { position: absolute; top: 20px; right: 20px; font-size: 20px; opacity: 0.3; }

  /* ── SECTION ── */
  .section { margin-bottom: 36px; }
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }
  .section-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; }
  .section-count {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 2px 10px;
    font-size: 11px;
    color: var(--text2);
  }

  /* ── CARDS ── */
  .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }

  .task-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 18px;
    transition: all 0.2s;
    position: relative;
  }
  .task-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .task-card-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; margin-bottom: 6px; }
  .task-card-desc { font-size: 12px; color: var(--text2); line-height: 1.5; margin-bottom: 14px; }
  .task-card-meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 14px; }
  .task-card-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 10px;
    letter-spacing: 0.5px;
    font-weight: 500;
  }
  .badge-pending { background: rgba(255,140,66,0.15); color: var(--orange); border: 1px solid rgba(255,140,66,0.3); }
  .badge-in_progress { background: rgba(108,99,255,0.15); color: var(--accent); border: 1px solid rgba(108,99,255,0.3); }
  .badge-completed { background: rgba(45,223,143,0.15); color: var(--green); border: 1px solid rgba(45,223,143,0.3); }
  .badge-overdue { background: rgba(255,77,109,0.15); color: var(--red); border: 1px solid rgba(255,77,109,0.3); }
  .badge-admin { background: rgba(240,192,64,0.12); color: var(--gold); border: 1px solid rgba(240,192,64,0.25); }

  .deadline-text { font-size: 11px; color: var(--text3); }
  .deadline-text.overdue { color: var(--red); }

  .btn-sm {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    cursor: pointer;
    border: 1px solid var(--border);
    background: var(--bg3);
    color: var(--text2);
    transition: all 0.15s;
    letter-spacing: 0.5px;
  }
  .btn-sm:hover { border-color: var(--accent); color: var(--accent); }
  .btn-sm.danger:hover { border-color: var(--red); color: var(--red); }
  .btn-sm.active-status { background: rgba(108,99,255,0.15); border-color: var(--accent); color: var(--accent); }

  /* ── PROJECT CARD ── */
  .project-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 22px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .project-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .project-card.selected { border-color: var(--accent); background: rgba(108,99,255,0.05); }
  .project-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 8px; }
  .project-deadline { font-size: 11px; color: var(--text3); }
  .project-by { font-size: 10px; color: var(--text3); margin-top: 4px; }

  /* ── MODAL ── */
  .modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
    padding: 20px;
  }
  .modal {
    background: var(--bg2);
    border: 1px solid var(--border2);
    border-radius: 16px;
    padding: 32px;
    width: 100%;
    max-width: 460px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.2s ease;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; margin-bottom: 6px; }
  .modal-sub { font-size: 12px; color: var(--text3); margin-bottom: 28px; }
  .modal-actions { display: flex; gap: 10px; margin-top: 24px; }
  .btn-cancel {
    flex: 1; padding: 12px;
    background: none; border: 1px solid var(--border);
    border-radius: 8px; color: var(--text2);
    font-family: 'DM Mono', monospace; font-size: 13px;
    cursor: pointer; transition: all 0.15s;
  }
  .btn-cancel:hover { border-color: var(--border2); color: var(--text); }
  .btn-submit {
    flex: 2; padding: 12px;
    background: var(--accent); border: none;
    border-radius: 8px; color: #fff;
    font-family: 'Syne', sans-serif; font-size: 14px;
    font-weight: 700; cursor: pointer; transition: all 0.15s;
  }
  .btn-submit:hover { background: var(--accent2); }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── ADD BUTTON ── */
  .btn-add {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px;
    background: var(--accent);
    border: none; border-radius: 8px;
    color: #fff;
    font-family: 'DM Mono', monospace; font-size: 12px;
    cursor: pointer; transition: all 0.15s;
    letter-spacing: 0.5px;
  }
  .btn-add:hover { background: var(--accent2); transform: translateY(-1px); }

  /* ── EMPTY STATE ── */
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text3);
  }
  .empty-icon { font-size: 36px; margin-bottom: 12px; opacity: 0.4; }
  .empty-text { font-size: 13px; }

  /* ── LOADING ── */
  .loading {
    display: flex; align-items: center; justify-content: center;
    padding: 60px; color: var(--text3); font-size: 13px;
    gap: 10px;
  }
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── OVERDUE BANNER ── */
  .overdue-banner {
    background: rgba(255,77,109,0.08);
    border: 1px solid rgba(255,77,109,0.2);
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: var(--red);
  }

  /* ── STATUS SELECT ── */
  .status-select-row {
    display: flex; gap: 6px; flex-wrap: wrap;
    margin-top: 10px;
  }
  .status-btn {
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    cursor: pointer;
    border: 1px solid var(--border);
    background: var(--bg3);
    color: var(--text3);
    transition: all 0.15s;
    letter-spacing: 0.5px;
  }
  .status-btn:hover, .status-btn.current { background: var(--accent); border-color: var(--accent); color: #fff; }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--border2); }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .sidebar { width: 200px; }
    .main-content { margin-left: 200px; padding: 24px 20px; }
  }
  @media (max-width: 640px) {
    .sidebar { display: none; }
    .main-content { margin-left: 0; }
  }
`;

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ username: "", password: "", role: "member" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!form.username || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      if (tab === "login") {
        const data = await api.login(form.username, form.password);
        localStorage.setItem("token", data.access_token);
        const payload = decodeToken(data.access_token);
        onLogin({ ...payload, username: form.username });
      } else {
        await api.signup(form.username, form.password, form.role);
        setSuccess("Account created! Please log in.");
        setTab("login");
        setForm((f) => ({ ...f, password: "" }));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-logo">◈ TaskForge</div>
        <h1 className="auth-hero-title">
          Ship projects.<br /><span>Not excuses.</span>
        </h1>
        <p className="auth-hero-sub">
          A focused task management platform for teams that move fast. Assign, track, and close — with role-based clarity.
        </p>
        <div className="auth-features">
          {["Role-based access (Admin / Member)", "Real-time task status tracking", "Overdue detection & dashboard insights", "Project-scoped task assignment"].map((f) => (
            <div className="auth-feature" key={f}>
              <div className="auth-feature-dot" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <div className="auth-tabs">
            <button className={`auth-tab${tab === "login" ? " active" : ""}`} onClick={() => { setTab("login"); setError(""); setSuccess(""); }}>LOGIN</button>
            <button className={`auth-tab${tab === "signup" ? " active" : ""}`} onClick={() => { setTab("signup"); setError(""); setSuccess(""); }}>SIGN UP</button>
          </div>

          <h2 className="auth-form-title">{tab === "login" ? "Welcome back" : "Create account"}</h2>
          <p className="auth-form-sub">{tab === "login" ? "Sign in to your workspace" : "Join your team on TaskForge"}</p>

          {error && <div className="error-msg">⚠ {error}</div>}
          {success && <div className="success-msg">✓ {success}</div>}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" value={form.username} onChange={handle("username")} placeholder="your_username" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={form.password} onChange={handle("password")} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>
          {tab === "signup" && (
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={handle("role")}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Please wait..." : tab === "login" ? "SIGN IN →" : "CREATE ACCOUNT →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function CreateProjectModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ project_name: "", deadline: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.project_name) { setError("Project name is required."); return; }
    setLoading(true);
    try {
      await api.createProject({ project_name: form.project_name, deadline: form.deadline || null });
      onCreated();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">New Project</div>
        <div className="modal-sub">Create a new project for your team</div>
        {error && <div className="error-msg">⚠ {error}</div>}
        <div className="form-group">
          <label className="form-label">Project Name</label>
          <input className="form-input" value={form.project_name} onChange={handle("project_name")} placeholder="e.g. Website Redesign" />
        </div>
        <div className="form-group">
          <label className="form-label">Deadline (optional)</label>
          <input className="form-input" type="date" value={form.deadline} onChange={handle("deadline")} />
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={submit} disabled={loading}>{loading ? "Creating..." : "Create Project"}</button>
        </div>
      </div>
    </div>
  );
}

function CreateTaskModal({ projects, users, onClose, onCreated }) {
  const [form, setForm] = useState({ title: "", description: "", project_id: "", assigned_to: "", deadline: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.title || !form.project_id || !form.assigned_to) { setError("Title, project, and assignee are required."); return; }
    setLoading(true);
    try {
      await api.createTask({
        title: form.title,
        description: form.description,
        project_id: parseInt(form.project_id),
        assigned_to: parseInt(form.assigned_to),
        deadline: form.deadline || null,
      });
      onCreated();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">New Task</div>
        <div className="modal-sub">Assign a task to a team member</div>
        {error && <div className="error-msg">⚠ {error}</div>}
        <div className="form-group">
          <label className="form-label">Task Title</label>
          <input className="form-input" value={form.title} onChange={handle("title")} placeholder="e.g. Design landing page" />
        </div>
        <div className="form-group">
          <label className="form-label">Description (optional)</label>
          <input className="form-input" value={form.description} onChange={handle("description")} placeholder="Brief description..." />
        </div>
        <div className="form-group">
          <label className="form-label">Project</label>
          <select className="form-select" value={form.project_id} onChange={handle("project_id")}>
            <option value="">Select project</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.project_name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Assign To (User ID)</label>
          <input className="form-input" type="number" value={form.assigned_to} onChange={handle("assigned_to")} placeholder="User ID" />
        </div>
        <div className="form-group">
          <label className="form-label">Deadline (optional)</label>
          <input className="form-input" type="date" value={form.deadline} onChange={handle("deadline")} />
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={submit} disabled={loading}>{loading ? "Creating..." : "Create Task"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── TASK CARD ────────────────────────────────────────────────────────────────
function TaskCard({ task, isAdmin, userId, onStatusChange, onDelete, projects }) {
  const [updating, setUpdating] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const isOverdue = task.deadline && task.deadline < today && task.status !== "completed";
  const projectName = projects?.find((p) => p.id === task.project_id)?.project_name;

  const changeStatus = async (status) => {
    if (status === task.status) return;
    setUpdating(true);
    try { await api.updateTask(task.id, status); onStatusChange(); }
    catch { }
    finally { setUpdating(false); }
  };

  const canEdit = isAdmin || task.assigned_to === userId;

  return (
    <div className="task-card">
      <div className="task-card-title">{task.title}</div>
      {task.description && <div className="task-card-desc">{task.description}</div>}
      <div className="task-card-meta">
        <span className={`badge badge-${task.status}`}>{task.status.replace("_", " ")}</span>
        {isOverdue && <span className="badge badge-overdue">overdue</span>}
        {projectName && <span className="badge" style={{ background: "rgba(90,90,114,0.2)", color: "var(--text2)", border: "1px solid var(--border)" }}>{projectName}</span>}
      </div>
      {task.deadline && (
        <div className={`deadline-text${isOverdue ? " overdue" : ""}`}>
          {isOverdue ? "⚠" : "📅"} Due {task.deadline}
        </div>
      )}
      {task.assigned_to && (
        <div className="deadline-text" style={{ marginTop: 4 }}>👤 User #{task.assigned_to}</div>
      )}
      {canEdit && (
        <div className="status-select-row">
          {["pending", "in_progress", "completed"].map((s) => (
            <button
              key={s}
              className={`status-btn${task.status === s ? " current" : ""}`}
              onClick={() => changeStatus(s)}
              disabled={updating}
            >
              {s.replace("_", " ")}
            </button>
          ))}
          {isAdmin && (
            <button className="status-btn" style={{ marginLeft: "auto", color: "var(--red)", borderColor: "rgba(255,77,109,0.3)" }} onClick={() => onDelete(task.id)}>
              delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
function DashboardView({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await api.getDashboard()); }
    catch { }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="loading"><div className="spinner" /> Loading dashboard…</div>;
  if (!data) return <div className="empty-state"><div className="empty-icon">⚠</div><div className="empty-text">Failed to load dashboard</div></div>;

  const { summary, overdue_tasks, tasks_by_status } = data;

  const stats = [
    { label: "Total Tasks", value: summary.total, icon: "◈", color: "var(--accent)" },
    { label: "Pending", value: summary.pending, icon: "○", color: "var(--orange)" },
    { label: "In Progress", value: summary.in_progress, icon: "◐", color: "var(--accent)" },
    { label: "Completed", value: summary.completed, icon: "●", color: "var(--green)" },
    { label: "Overdue", value: summary.overdue, icon: "⚠", color: "var(--red)" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Overview of all tasks and team progress</div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label} style={{ "--accent-line": s.color }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-icon">{s.icon}</div>
          </div>
        ))}
      </div>

      {overdue_tasks.length > 0 && (
        <div className="overdue-banner">
          <span style={{ fontSize: 20 }}>⚠</span>
          <span><strong>{overdue_tasks.length} overdue task{overdue_tasks.length > 1 ? "s" : ""}</strong> — {overdue_tasks.map(t => t.title).join(", ")}</span>
        </div>
      )}

      {[
        { key: "pending", label: "Pending" },
        { key: "in_progress", label: "In Progress" },
        { key: "completed", label: "Completed" },
      ].map(({ key, label }) => (
        tasks_by_status[key]?.length > 0 && (
          <div className="section" key={key}>
            <div className="section-header">
              <span className="section-title">{label}</span>
              <span className="section-count">{tasks_by_status[key].length}</span>
            </div>
            <div className="cards-grid">
              {tasks_by_status[key].map((t) => (
                <div className="task-card" key={t.id} style={{ opacity: key === "completed" ? 0.7 : 1 }}>
                  <div className="task-card-title">{t.title}</div>
                  <div className="task-card-meta">
                    <span className={`badge badge-${t.status}`}>{t.status.replace("_", " ")}</span>
                    {t.deadline && <span className="deadline-text">📅 {t.deadline}</span>}
                  </div>
                  {t.assigned_to && <div className="deadline-text">👤 User #{t.assigned_to}</div>}
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}

// ─── PROJECTS VIEW ────────────────────────────────────────────────────────────
function ProjectsView({ user }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const isAdmin = user?.role === "admin";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, t] = await Promise.all([api.getProjects(), api.getTasks()]);
      setProjects(p);
      setTasks(t);
      if (!selected && p.length > 0) setSelected(p[0].id);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const projectTasks = tasks.filter((t) => t.project_id === selected);

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try { await api.deleteTask(id); await load(); }
    catch (e) { alert(e.message); }
  };

  if (loading) return <div className="loading"><div className="spinner" /> Loading projects…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Projects</div>
          <div className="page-sub">{projects.length} project{projects.length !== 1 ? "s" : ""} in your workspace</div>
        </div>
        {isAdmin && <button className="btn-add" onClick={() => setShowModal(true)}>+ New Project</button>}
      </div>

      {error && <div className="error-msg">⚠ {error}</div>}

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <div className="empty-text">No projects yet{isAdmin ? " — create one above" : ""}</div>
        </div>
      ) : (
        <>
          <div className="section">
            <div className="section-title" style={{ marginBottom: 14, fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700 }}>Select a Project</div>
            <div className="cards-grid">
              {projects.map((p) => (
                <div key={p.id} className={`project-card${selected === p.id ? " selected" : ""}`} onClick={() => setSelected(p.id)}>
                  <div className="project-name">{p.project_name}</div>
                  {p.deadline && <div className="project-deadline">📅 Due {p.deadline}</div>}
                  <div className="project-by">ID #{p.id}</div>
                </div>
              ))}
            </div>
          </div>

          {selected && (
            <div className="section">
              <div className="section-header">
                <span className="section-title">Tasks — {projects.find(p => p.id === selected)?.project_name}</span>
                <span className="section-count">{projectTasks.length}</span>
              </div>
              {projectTasks.length === 0 ? (
                <div className="empty-state" style={{ padding: "40px 20px" }}>
                  <div className="empty-icon">📋</div>
                  <div className="empty-text">No tasks in this project yet</div>
                </div>
              ) : (
                <div className="cards-grid">
                  {projectTasks.map((t) => (
                    <TaskCard key={t.id} task={t} isAdmin={isAdmin} userId={user?.user_id} onStatusChange={load} onDelete={handleDelete} projects={projects} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} onCreated={() => { setShowModal(false); load(); }} />}
    </div>
  );
}

// ─── TASKS VIEW ───────────────────────────────────────────────────────────────
function TasksView({ user }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const isAdmin = user?.role === "admin";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, p] = await Promise.all([api.getTasks(), api.getProjects()]);
      setTasks(t);
      setProjects(p);
    } catch { }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const today = new Date().toISOString().split("T")[0];
  const filtered = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "overdue") return t.deadline && t.deadline < today && t.status !== "completed";
    if (filter === "mine") return t.assigned_to === user?.user_id;
    return t.status === filter;
  });

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try { await api.deleteTask(id); await load(); }
    catch (e) { alert(e.message); }
  };

  if (loading) return <div className="loading"><div className="spinner" /> Loading tasks…</div>;

  const filterOpts = [
    { val: "all", label: "All" },
    { val: "mine", label: "My Tasks" },
    { val: "pending", label: "Pending" },
    { val: "in_progress", label: "In Progress" },
    { val: "completed", label: "Completed" },
    { val: "overdue", label: "Overdue" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tasks</div>
          <div className="page-sub">{filtered.length} task{filtered.length !== 1 ? "s" : ""} shown</div>
        </div>
        {isAdmin && <button className="btn-add" onClick={() => setShowModal(true)}>+ New Task</button>}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {filterOpts.map((f) => (
          <button
            key={f.val}
            className={`status-btn${filter === f.val ? " current" : ""}`}
            style={{ padding: "6px 14px" }}
            onClick={() => setFilter(f.val)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✓</div>
          <div className="empty-text">No tasks matching this filter</div>
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map((t) => (
            <TaskCard key={t.id} task={t} isAdmin={isAdmin} userId={user?.user_id} onStatusChange={load} onDelete={handleDelete} projects={projects} />
          ))}
        </div>
      )}

      {showModal && (
        <CreateTaskModal projects={projects} users={[]} onClose={() => setShowModal(false)} onCreated={() => { setShowModal(false); load(); }} />
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = decodeToken(token);
      if (payload) {
        setUser({ ...payload, username: localStorage.getItem("username") || "user" });
      } else {
        localStorage.removeItem("token");
      }
    }
    setAuthChecked(true);
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("username", userData.username || "user");
    setUser(userData);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  if (!authChecked) return null;

  return (
    <>
      <style>{styles}</style>
      {!user ? (
        <AuthPage onLogin={handleLogin} />
      ) : (
        <div className="app-layout">
          <div className="sidebar">
            <div className="sidebar-logo">◈ TaskForge</div>
            <div className="sidebar-section-label">Navigation</div>
            <div className="sidebar-nav">
              {[
                { id: "dashboard", icon: "◈", label: "Dashboard" },
                { id: "projects", icon: "▦", label: "Projects" },
                { id: "tasks", icon: "◻", label: "Tasks" },
              ].map((item) => (
                <button key={item.id} className={`nav-item${page === item.id ? " active" : ""}`} onClick={() => setPage(item.id)}>
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="sidebar-footer">
              <div className="user-chip">
                <div className="user-avatar">{(user.username || "U")[0].toUpperCase()}</div>
                <div className="user-info">
                  <div className="user-name">{user.username || `User #${user.user_id}`}</div>
                  <div className="user-role">{user.role}</div>
                </div>
                <button className="logout-btn" onClick={handleLogout} title="Logout">⏏</button>
              </div>
            </div>
          </div>

          <div className="main-content">
            {page === "dashboard" && <DashboardView user={user} />}
            {page === "projects" && <ProjectsView user={user} />}
            {page === "tasks" && <TasksView user={user} />}
          </div>
        </div>
      )}
    </>
  );
}