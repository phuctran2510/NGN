import { useState } from "react";
import HomePage from "./HomePage";
import SDNApp from "./SDNApp";
import NGNApp from "./NGNApp";

// ============================================
// CẤU HÌNH MẬT KHẨU TỪNG LỚP
// ============================================
const CLASS_PASSWORDS = {
  ngn: "ngn2025",   // Lớp Mạng Thế Hệ Mới
  sdn: "sdn2025",   // Lớp Chuyên Đề MMT 1
};

function Login({ onLogin }) {
  const [pwd, setPwd] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const matched = Object.entries(CLASS_PASSWORDS).find(([, pass]) => pass === pwd);
    if (matched) {
      onLogin(matched[0]); // trả về key: "ngn" hoặc "sdn"
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
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%,60%{transform:translateX(-8px)}
          40%,80%{transform:translateX(8px)}
        }
        .shake { animation: shake 0.4s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fadein { animation: fadeIn 0.5s ease; }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        .pulse { animation: pulse 2s infinite; }
      `}</style>

      <div className={`fadein ${shake ? "shake" : ""}`} style={{
        background: "#040f1c", border: "1px solid #00d4ff22",
        borderRadius: 14, padding: "40px 36px", width: "100%", maxWidth: 400,
        boxShadow: "0 0 40px #00d4ff08"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 14,
            background: "#00d4ff0f", border: "1.5px solid #00d4ff33",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 14px"
          }}>🔐</div>
          <div style={{
            fontFamily: "Rajdhani,sans-serif", fontWeight: 700,
            fontSize: 20, color: "#00d4ff", letterSpacing: 3
          }}>NETWORK LAB PORTAL</div>
          <div style={{ fontSize: 11, color: "#1a5a7a", marginTop: 4 }}>
            Đại học Đà Lạt · Khoa CNTT
          </div>
        </div>

        {/* Classes hint */}
        <div style={{
          display: "flex", gap: 8, marginBottom: 20, justifyContent: "center"
        }}>
          {[
            { label: "NGN", color: "#00d4ff" },
            { label: "SDN", color: "#38bdf8" },
          ].map(c => (
            <div key={c.label} style={{
              background: `${c.color}10`, border: `1px solid ${c.color}30`,
              borderRadius: 6, padding: "4px 14px", fontSize: 11, color: c.color
            }}>
              <span className="pulse">●</span> {c.label}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#3a6a8a", marginBottom: 6 }}>
            MẬT KHẨU LỚP
          </div>
          <input
            type="password"
            value={pwd}
            onChange={e => { setPwd(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Nhập mật khẩu lớp học..."
            autoFocus
            style={{
              width: "100%", background: "#020d18",
              border: `1px solid ${error ? "#ff4444" : "#0a2a40"}`,
              borderRadius: 7, padding: "10px 14px",
              color: "#c0d8f0", fontSize: 13,
              fontFamily: "inherit", outline: "none",
              boxSizing: "border-box", transition: "border 0.2s"
            }}
          />
          {error && (
            <div style={{ fontSize: 11, color: "#ff6666", marginTop: 6 }}>
              ⚠ {error}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%", background: "linear-gradient(135deg,#0a2a3a,#041a2a)",
            border: "1px solid #00d4ff33", borderRadius: 7,
            color: "#00d4ff", padding: "11px", fontSize: 13,
            fontFamily: "inherit", cursor: "pointer", letterSpacing: 1,
            transition: "all 0.2s"
          }}
        >
          ĐĂNG NHẬP →
        </button>

        <div style={{ textAlign: "center", fontSize: 10, color: "#1a3a5a", marginTop: 18 }}>
          GV: Trần Vĩnh Phúc · phuctv@dlu.edu.vn
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // classKey: null | "ngn" | "sdn"
  const [classKey, setClassKey] = useState(() => {
    return localStorage.getItem("classKey") || null;
  });

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

  if (!classKey) return <Login onLogin={handleLogin} />;
  if (classKey === "ngn") return <NGNApp onHome={handleLogout} />;
  if (classKey === "sdn") return <SDNApp onHome={handleLogout} />;

  // fallback: unknown key
  return <Login onLogin={handleLogin} />;
}