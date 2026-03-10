import { useState } from "react";
import HomePage from "./HomePage";
import SDNApp from "./SDNApp";
import NGNApp from "./NGNApp";
import PythonApp from "./PythonApp";

// ──────────────────────────────────────────────
// CẤU HÌNH MẬT KHẨU TỪNG LỚP
// ──────────────────────────────────────────────
const CLASS_PASSWORDS = {
  ngn:    "ngn2025",    // Mạng Thế Hệ Mới
  sdn:    "sdn2025",    // Chuyên Đề MMT 1
  python: "python2025", // Lập Trình Python
};

const CLASS_INFO = {
  ngn:    { label: "NGN",    color: "#00d4ff" },
  sdn:    { label: "SDN",    color: "#38bdf8" },
  python: { label: "Python", color: "#4ade80" },
};

function Login({ onLogin }) {
  const [pwd, setPwd] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const matched = Object.entries(CLASS_PASSWORDS).find(([, pass]) => pass === pwd);
    if (matched) {
      onLogin(matched[0]);
    } else {
      setShake(true);
      setError("Sai mật khẩu. Vui lòng thử lại.");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#020d18",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Share Tech Mono','Courier New',monospace"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@700&display=swap');
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        .shake { animation: shake 0.4s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fadein { animation: fadeIn 0.5s ease; }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        .pulse { animation: pulse 2s infinite; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: #00d4ff66 !important; outline: none; }
      `}</style>

      <div className={`fadein ${shake ? "shake" : ""}`} style={{
        background: "#040f1c", border: "1px solid #00d4ff22",
        borderRadius: 14, padding: "40px 36px", width: "100%", maxWidth: 420,
        boxShadow: "0 0 60px #00d4ff06"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 14,
            background: "#00d4ff0a", border: "1.5px solid #00d4ff22",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 14px"
          }}>🌐</div>
          <div style={{
            fontFamily: "Rajdhani,sans-serif", fontWeight: 700,
            fontSize: 20, color: "#00d4ff", letterSpacing: 3
          }}>NETWORK LAB PORTAL</div>
          <div style={{ fontSize: 11, color: "#1a5a7a", marginTop: 4, letterSpacing: 2 }}>
            ĐẠI HỌC ĐÀ LẠT · KHOA CNTT
          </div>
        </div>

        {/* Class badges */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {Object.values(CLASS_INFO).map(c => (
            <div key={c.label} style={{
              background: `${c.color}10`, border: `1px solid ${c.color}30`,
              borderRadius: 6, padding: "4px 12px", fontSize: 10, color: c.color
            }}>
              <span className="pulse">●</span> {c.label}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#3a6a8a", marginBottom: 6, letterSpacing: 1 }}>
            MẬT KHẨU LỚP HỌC
          </div>
          <input
            type="password"
            value={pwd}
            onChange={e => { setPwd(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Nhập mật khẩu lớp..."
            autoFocus
            style={{
              width: "100%", background: "#020d18",
              border: `1px solid ${error ? "#ff4444" : "#0a2a40"}`,
              borderRadius: 7, padding: "11px 14px",
              color: "#c0d8f0", fontSize: 13,
              fontFamily: "inherit", transition: "border 0.2s"
            }}
          />
          {error && (
            <div style={{ fontSize: 11, color: "#ff6666", marginTop: 6 }}>⚠ {error}</div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%", background: "linear-gradient(135deg,#0a2a3a,#041a2a)",
            border: "1px solid #00d4ff33", borderRadius: 7,
            color: "#00d4ff", padding: "11px", fontSize: 12,
            fontFamily: "inherit", cursor: "pointer", letterSpacing: 2,
            transition: "all 0.2s"
          }}
          onMouseOver={e => e.target.style.background = "#0a1a2a"}
          onMouseOut={e => e.target.style.background = "linear-gradient(135deg,#0a2a3a,#041a2a)"}
        >
          ĐĂNG NHẬP →
        </button>

        <div style={{ textAlign: "center", fontSize: 10, color: "#1a3a5a", marginTop: 18 }}>
          phuctv@dlu.edu.vn · quanvm@dlu.edu.vn
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [classKey, setClassKey] = useState(() => localStorage.getItem("classKey") || null);

  const handleLogin = (key) => {
    localStorage.setItem("classKey", key);
    localStorage.setItem("auth", "true");
    setClassKey(key);
  };

  const handleLogout = () => {
    localStorage.removeItem("classKey");
    localStorage.removeItem("auth");
    setClassKey(null);
  };

  if (!classKey)            return <Login onLogin={handleLogin} />;
  if (classKey === "ngn")   return <NGNApp    onHome={handleLogout} />;
  if (classKey === "sdn")   return <SDNApp    onHome={handleLogout} />;
  if (classKey === "python") return <PythonApp onHome={handleLogout} />;

  return <Login onLogin={handleLogin} />;
}