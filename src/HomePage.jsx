import { useState, useEffect } from "react";

export default function HomePage({ onNavigate }) {
  const [hovered, setHovered] = useState(null);
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(p => p + 1), 2000); return () => clearInterval(t); }, []);

  const courses = [
    {
      id: "ngn",
      icon: "🌐",
      color: "#00d4ff",
      title: "MẠNG THẾ HỆ MỚI & VoIP",
      code: "MMT-NGN",
      sub: "Next Generation Networks · IPv6 · VoIP",
      desc: "Triển khai hạ tầng IPv6, BGP, OSPFv3, Multicast, QoS, Cisco CME và FreePBX trên nền tảng EVE-NG.",
      stats: [{ v: "6", l: "Modules" }, { v: "25", l: "Labs" }, { v: "10", l: "Đề Tài" }, { v: "IPv6", l: "Protocol" }],
      tags: ["OSPFv3", "BGP", "IPv6", "QoS", "Cisco CME", "FreePBX"],
      instructor: "Trần Vĩnh Phúc",
      email: "phuctv@dlu.edu.vn",
      level: "Advanced",
      credits: "4 TC",
    },
    {
      id: "sdn",
      icon: "🧠",
      color: "#38bdf8",
      title: "CHUYÊN ĐỀ MẠNG MÁY TÍNH 1",
      code: "20CT3124",
      sub: "SDN · Python · APIC-EM · Automation",
      desc: "Lập trình mạng với Python, REST API và bộ điều khiển SDN (APIC-EM, Mininet, Ryu). Tự động hóa quản lý mạng.",
      stats: [{ v: "8", l: "Labs TH" }, { v: "20", l: "Đề Tài" }, { v: "Python", l: "Language" }, { v: "SDN", l: "Paradigm" }],
      tags: ["Python", "REST API", "APIC-EM", "OpenFlow", "Mininet", "Ryu"],
      instructor: "Vũ Minh Quan",
      email: "quanvm@dlu.edu.vn",
      level: "Intermediate",
      credits: "4 TC",
    },
    {
      id: "python",
      icon: "🐍",
      color: "#4ade80",
      title: "LẬP TRÌNH PYTHON",
      code: "20CT3125",
      sub: "Python Cơ Bản → Nâng Cao · OOP · Data · API",
      desc: "Toàn diện từ cú pháp cơ bản, cấu trúc dữ liệu, OOP, đến xử lý File/DB, Async, Testing và dự án thực tiễn.",
      stats: [{ v: "6", l: "Modules" }, { v: "33", l: "Labs" }, { v: "80+", l: "Bài Tập" }, { v: "🐍", l: "Python 3.10+" }],
      tags: ["OOP", "Pandas", "FastAPI", "pytest", "asyncio", "Regex"],
      instructor: "Vũ Minh Quan",
      email: "quanvm@dlu.edu.vn",
      level: "Beginner→Advanced",
      credits: "3 TC",
    },
  ];

  const news = [
    { icon: "🐍", text: "Lớp Python mới khai giảng — mật khẩu: python2025", time: "Mới nhất" },
    { icon: "📢", text: "Lab EVE-NG đã cập nhật Cisco IOL 15.9 — sinh viên cần re-import images", time: "2 ngày trước" },
    { icon: "📅", text: "Hạn nộp báo cáo nhóm Chuyên Đề 1: cuối tuần 12", time: "Sắp tới" },
    { icon: "✅", text: "Kết quả kiểm tra giữa kỳ NGN đã được cập nhật trên hệ thống", time: "1 tuần trước" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#050b14", fontFamily: "'JetBrains Mono','Courier New',monospace", color: "#c0d8f0", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#050b14}::-webkit-scrollbar-thumb{background:#00d4ff22;border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        .fadein{animation:fadeUp 0.5s ease both}
        .blink{animation:blink 1.5s infinite}
        .course-card{transition:all 0.3s ease;cursor:pointer}
        .course-card:hover{transform:translateY(-3px)}
        a{color:inherit;text-decoration:none}
        @media(max-width:640px){.desk-only{display:none!important}}
      `}</style>

      {/* Animated grid background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#00d4ff05 1px,transparent 1px),linear-gradient(90deg,#00d4ff05 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div style={{ position: "absolute", top: 0, left: "25%", width: 1, height: "100%", background: "linear-gradient(to bottom,transparent,#00d4ff07,transparent)", animation: "scanline 9s linear infinite" }} />
        <div style={{ position: "absolute", top: 0, left: "70%", width: 1, height: "100%", background: "linear-gradient(to bottom,transparent,#4ade8005,transparent)", animation: "scanline 13s linear infinite 5s" }} />
      </div>

      {/* Header */}
      <div style={{ position: "relative", zIndex: 1, borderBottom: "1px solid #0a2a40", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: "#00d4ff0a", border: "1px solid #00d4ff22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🌐</div>
          <div>
            <div style={{ fontFamily: "Orbitron,sans-serif", fontWeight: 900, fontSize: 17, color: "#00d4ff", letterSpacing: 2 }}>DLU NETWORK LAB</div>
            <div style={{ fontSize: 9, color: "#1a4a6a", letterSpacing: 3, marginTop: 1 }}>TRƯỜNG ĐẠI HỌC ĐÀ LẠT · KHOA CNTT</div>
          </div>
        </div>
        <div className="desk-only" style={{ display: "flex", gap: 6 }}>
          {courses.map(c => (
            <div key={c.id} style={{ background: `${c.color}08`, border: `1px solid ${c.color}22`, borderRadius: 6, padding: "3px 10px", fontSize: 9, color: c.color }}>
              {c.icon} {c.code}
            </div>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "36px 20px 28px" }}>
        <div className="fadein" style={{ fontSize: 10, color: "#1a4a6a", letterSpacing: 4, marginBottom: 12 }}>
          <span className="blink">▮</span> PORTAL THỰC HÀNH — HỌC KỲ 2 · 2024-2025
        </div>
        <div className="fadein" style={{ fontFamily: "Orbitron,sans-serif", fontWeight: 900, fontSize: "clamp(22px,5vw,38px)", color: "#ffffff", lineHeight: 1.2, marginBottom: 10 }}>
          CHỌN <span style={{ color: "#00d4ff" }}>LỚP HỌC</span> CỦA BẠN
        </div>
        <div className="fadein" style={{ fontSize: 11, color: "#2a6a8a", maxWidth: 500, margin: "0 auto" }}>
          Mỗi lớp có mật khẩu riêng · {courses.length} khóa học · {courses.reduce((s, c) => s + parseInt(c.stats[1].v || 0), 0)}+ Labs thực hành
        </div>
      </div>

      {/* Course Cards */}
      <div style={{ position: "relative", zIndex: 1, padding: "0 16px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
          {courses.map((course, i) => {
            const isH = hovered === course.id;
            return (
              <div key={course.id} className="course-card fadein"
                style={{
                  background: "#07111c",
                  border: `1px solid ${isH ? course.color : course.color + "22"}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: isH ? `0 0 30px ${course.color}15` : "none",
                  animationDelay: `${i * 0.1}s`,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={() => setHovered(course.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onNavigate(course.id)}
              >
                {/* Top accent */}
                <div style={{ height: 3, background: `linear-gradient(90deg,${course.color}88,${course.color}22)` }} />

                <div style={{ padding: "18px 18px 14px" }}>
                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 11, background: `${course.color}0f`, border: `1.5px solid ${course.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                      {course.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ background: `${course.color}18`, border: `1px solid ${course.color}35`, borderRadius: 4, padding: "1px 7px", fontSize: 9, color: course.color, fontWeight: 700 }}>
                          {course.code}
                        </span>
                        <span style={{ background: "#0a1a2a", border: "1px solid #0a2a40", borderRadius: 4, padding: "1px 7px", fontSize: 9, color: "#2a6a8a" }}>
                          {course.level}
                        </span>
                        <span style={{ fontSize: 9, color: "#1a4a6a" }}>{course.credits}</span>
                      </div>
                      <div style={{ fontFamily: "Orbitron,sans-serif", fontWeight: 700, fontSize: 12, color: "#e0ecf8", lineHeight: 1.3 }}>
                        {course.title}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: 10, color: "#2a6a8a", marginBottom: 8 }}>{course.sub}</div>
                  <div style={{ fontSize: 11, color: "#3a7a9a", lineHeight: 1.7, marginBottom: 12 }}>{course.desc}</div>

                  {/* Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 12 }}>
                    {course.stats.map((s, j) => (
                      <div key={j} style={{ background: "#020a14", border: `1px solid ${course.color}15`, borderRadius: 6, padding: "7px 4px", textAlign: "center" }}>
                        <div style={{ fontFamily: "Orbitron,sans-serif", fontSize: 13, color: course.color, fontWeight: 700 }}>{s.v}</div>
                        <div style={{ fontSize: 8, color: "#1a4a6a", marginTop: 2 }}>{s.l}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                    {course.tags.map(t => (
                      <span key={t} style={{ background: "#020a14", border: `1px solid ${course.color}20`, borderRadius: 4, padding: "2px 7px", fontSize: 9, color: course.color + "99" }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Instructor + CTA */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${course.color}15`, paddingTop: 12 }}>
                    <div style={{ fontSize: 9, color: "#1a4a6a" }}>
                      <div style={{ color: "#2a7a9a" }}>👨‍🏫 {course.instructor}</div>
                      <div style={{ marginTop: 2, color: course.color + "66" }}>{course.email}</div>
                    </div>
                    <div style={{
                      background: `${course.color}12`,
                      border: `1px solid ${course.color}40`,
                      borderRadius: 7, padding: "7px 14px",
                      fontSize: 10, color: course.color,
                      fontFamily: "Orbitron,sans-serif",
                      letterSpacing: 1,
                      boxShadow: isH ? `0 0 12px ${course.color}25` : "none",
                      transition: "all 0.2s"
                    }}>
                      VÀO LỚP →
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Announcements + Quick Links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14, marginTop: 20 }}>
          {/* News */}
          <div style={{ background: "#07111c", border: "1px solid #0a2a40", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ background: "#041420", borderBottom: "1px solid #0a2a40", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#00d4ff", fontSize: 13 }}>📡</span>
              <span style={{ fontFamily: "Orbitron,sans-serif", fontSize: 10, color: "#00d4ff", letterSpacing: 2 }}>THÔNG BÁO</span>
            </div>
            <div style={{ padding: "8px 0" }}>
              {news.map((n, i) => (
                <div key={i} style={{ padding: "9px 14px", borderBottom: i < news.length - 1 ? "1px solid #0a1a2a" : "none" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 13, flexShrink: 0 }}>{n.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, color: "#4a8aaa", lineHeight: 1.6 }}>{n.text}</div>
                      <div style={{ fontSize: 9, color: "#1a4a6a", marginTop: 3 }}>{n.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div style={{ background: "#07111c", border: "1px solid #0a2a40", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ background: "#041420", borderBottom: "1px solid #0a2a40", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#38bdf8", fontSize: 13 }}>🔗</span>
              <span style={{ fontFamily: "Orbitron,sans-serif", fontSize: 10, color: "#38bdf8", letterSpacing: 2 }}>QUICK LINKS</span>
            </div>
            <div style={{ padding: "8px" }}>
              {[
                { icon: "🖥️", label: "EVE-NG Lab", url: "http://192.168.1.10", color: "#00d4ff" },
                { icon: "📚", label: "Tài liệu khoa", url: "https://fit.dlu.edu.vn", color: "#38bdf8" },
                { icon: "🐍", label: "Python Docs", url: "https://docs.python.org/3", color: "#4ade80" },
                { icon: "📊", label: "Cisco DevNet", url: "https://developer.cisco.com", color: "#38bdf8" },
                { icon: "🎓", label: "E-Learning DLU", url: "https://elearning.dlu.edu.vn", color: "#a78bfa" },
              ].map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noreferrer">
                  <div style={{
                    display: "flex", gap: 10, alignItems: "center",
                    padding: "9px 10px", borderRadius: 6, marginBottom: 4,
                    background: "#041020", border: `1px solid ${link.color}15`,
                    transition: "all 0.2s", cursor: "pointer"
                  }}>
                    <span style={{ fontSize: 15 }}>{link.icon}</span>
                    <span style={{ fontSize: 11, color: link.color }}>{link.label}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, color: "#1a4a6a" }}>→</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 28, padding: "16px", borderTop: "1px solid #0a1a2a" }}>
          <div style={{ fontSize: 9, color: "#1a3a5a", letterSpacing: 2, marginBottom: 6 }}>
            DLU NETWORK LAB PORTAL · KHOA CNTT · ĐẠI HỌC ĐÀ LẠT
          </div>
          <div style={{ fontSize: 9, color: "#1a4a6a" }}>
            GV: Trần Vĩnh Phúc (phuctv@dlu.edu.vn) · Vũ Minh Quan (quanvm@dlu.edu.vn)
          </div>
        </div>
      </div>
    </div>
  );
}