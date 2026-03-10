import { useState, useEffect } from "react";

// ── Shared Login ─────────────────────────────────────────────
export function Login({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);

  const attempt = () => {
    if (pw === "ngn2025") { localStorage.setItem("auth","true"); onLogin(); }
    else { setErr(true); setShake(true); setTimeout(()=>setShake(false),500); }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",background:"#050b14",fontFamily:"'JetBrains Mono','Courier New',monospace"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@700;900&display=swap');
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}}
        @keyframes borderPulse{0%,100%{box-shadow:0 0 0 0 #00d4ff33}50%{box-shadow:0 0 0 8px #00d4ff00}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .login-glow{animation:borderPulse 3s infinite}
        .shake-it{animation:shake 0.4s ease}
        .logo-float{animation:float 4s ease-in-out infinite}
      `}</style>
      <div className="logo-float" style={{marginBottom:32,textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:8}}>🌐</div>
        <div style={{fontFamily:"Orbitron,sans-serif",fontWeight:900,fontSize:20,color:"#00d4ff",letterSpacing:4}}>DLU · NETWORK LAB</div>
        <div style={{fontSize:11,color:"#1a4a6a",letterSpacing:3,marginTop:4}}>TRƯỜNG ĐẠI HỌC ĐÀ LẠT</div>
      </div>
      <div className={`login-glow ${shake?"shake-it":""}`} style={{background:"#07111c",border:"1px solid #0a2a40",borderRadius:12,padding:"32px 40px",width:320,textAlign:"center"}}>
        <div style={{fontSize:11,color:"#1a4a6a",letterSpacing:3,marginBottom:20}}>— ACCESS PORTAL —</div>
        <input type="password" placeholder="Nhập mật khẩu..." value={pw}
          onChange={e=>{setPw(e.target.value);setErr(false);}}
          onKeyDown={e=>e.key==="Enter"&&attempt()}
          style={{width:"100%",padding:"11px 14px",background:"#020a14",border:`1px solid ${err?"#ff4444":"#0a2a40"}`,borderRadius:6,color:"#c0d8f0",fontSize:12,fontFamily:"JetBrains Mono,monospace",boxSizing:"border-box",outline:"none",transition:"border 0.2s"}}/>
        {err && <div style={{color:"#ff4444",fontSize:11,marginTop:6}}>⚠ Sai mật khẩu</div>}
        <button onClick={attempt} style={{width:"100%",marginTop:14,padding:"11px",background:"linear-gradient(135deg,#0a2a3a,#041a2a)",border:"1px solid #00d4ff",borderRadius:6,color:"#00d4ff",fontFamily:"Orbitron,sans-serif",fontSize:11,cursor:"pointer",letterSpacing:3,transition:"all 0.2s"}}
          onMouseOver={e=>{e.target.style.background="linear-gradient(135deg,#041a2a,#021018)";e.target.style.boxShadow="0 0 20px #00d4ff22";}}
          onMouseOut={e=>{e.target.style.background="linear-gradient(135deg,#0a2a3a,#041a2a)";e.target.style.boxShadow="none";}}>
          ĐĂNG NHẬP
        </button>
      </div>
      <div style={{marginTop:20,fontSize:10,color:"#0a2a40"}}>phuctv@dlu.edu.vn · quanvm@dlu.edu.vn</div>
    </div>
  );
}

// ── Home Page ────────────────────────────────────────────────
export default function HomePage({ onNavigate }) {
  const [hovered, setHovered] = useState(null);
  const [tick, setTick] = useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(p=>p+1),2000);return()=>clearInterval(t);},[]);

  const courses = [
    {
      id:"ngn",
      icon:"🌐",
      color:"#00d4ff",
      glow:"#00d4ff",
      title:"MẠNG THẾ HỆ MỚI & VoIP",
      code:"MMT-NGN",
      sub:"Next Generation Networks · IPv6 · VoIP",
      desc:"Triển khai hạ tầng mạng thế hệ mới IPv6, BGP, OSPFv3, Multicast, QoS, Cisco CME và FreePBX trên nền tảng EVE-NG.",
      stats:[{v:"6",l:"Modules"},{v:"25",l:"Labs"},{v:"10",l:"Đề Tài"},{v:"IPv6",l:"Protocol"}],
      tags:["OSPFv3","BGP","IPv6","QoS","Cisco CME","FreePBX","PIM-SM","HSRP"],
      instructor:"Trần Vĩnh Phúc",
      email:"phuctv@dlu.edu.vn",
      level:"Advanced",
      credits:"4 TC",
    },
    {
      id:"sdn",
      icon:"🧠",
      color:"#38bdf8",
      glow:"#38bdf8",
      title:"CHUYÊN ĐỀ MẠNG MÁY TÍNH 1",
      code:"20CT3124",
      sub:"SDN · Python · APIC-EM · Network Automation",
      desc:"Lập trình mạng với Python, REST API và bộ điều khiển SDN (Cisco APIC-EM, Mininet). Tự động hóa quản lý mạng và xây dựng ứng dụng điều khiển tập trung.",
      stats:[{v:"6",l:"Chương"},{v:"8",l:"Labs TH"},{v:"5",l:"Đề Tài"},{v:"Python",l:"Language"}],
      tags:["Python","REST API","APIC-EM","OpenFlow","Mininet","JSON","Postman","Ryu"],
      instructor:"Vũ Minh Quan",
      email:"quanvm@dlu.edu.vn",
      level:"Intermediate",
      credits:"4 TC",
    },
  ];

  const news = [
    {icon:"📢",text:"Lab EVE-NG đã cập nhật Cisco IOL 15.9 — sinh viên cần re-import images",time:"Mới nhất"},
    {icon:"📅",text:"Hạn nộp báo cáo nhóm Chuyên Đề 1: cuối tuần 12",time:"Sắp tới"},
    {icon:"✅",text:"Kết quả kiểm tra giữa kỳ NGN đã được cập nhật trên hệ thống",time:"3 ngày trước"},
    {icon:"🆕",text:"Đề tài mới: SDN Intent-Based Config Tool — xem mục Đề Tài",time:"1 tuần trước"},
  ];

  return (
    <div style={{minHeight:"100vh",background:"#050b14",fontFamily:"'JetBrains Mono','Courier New',monospace",color:"#c0d8f0",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#050b14}::-webkit-scrollbar-thumb{background:#00d4ff22;border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes gridMove{0%{transform:translateY(0)}100%{transform:translateY(50px)}}
        .fadein{animation:fadeUp 0.5s ease both}
        .blink{animation:blink 1.5s infinite}
        .course-card{transition:all 0.3s ease;cursor:pointer}
        .course-card:hover{transform:translateY(-4px)}
        a{color:inherit;text-decoration:none}
      `}</style>

      {/* Animated grid background */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(#00d4ff06 1px,transparent 1px),linear-gradient(90deg,#00d4ff06 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
        <div style={{position:"absolute",top:0,left:"20%",width:1,height:"100%",background:"linear-gradient(to bottom,transparent,#00d4ff08,transparent)",animation:"scanline 8s linear infinite"}}/>
        <div style={{position:"absolute",top:0,left:"70%",width:1,height:"100%",background:"linear-gradient(to bottom,transparent,#38bdf808,transparent)",animation:"scanline 12s linear infinite 4s"}}/>
      </div>

      {/* Header */}
      <header style={{position:"relative",zIndex:10,borderBottom:"1px solid #0a2a40",background:"rgba(5,11,20,0.95)",backdropFilter:"blur(10px)",padding:"12px 24px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:8,background:"#00d4ff0d",border:"1.5px solid #00d4ff33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🌐</div>
        <div>
          <div style={{fontFamily:"Orbitron,sans-serif",fontWeight:900,fontSize:14,color:"#00d4ff",letterSpacing:3}}>DLU · NETWORK LAB</div>
          <div style={{fontSize:10,color:"#1a5a7a",letterSpacing:2}}>Khoa CNTT · Trường Đại học Đà Lạt</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <div style={{fontSize:10,color:"#1a4a6a"}}>
            <span className="blink" style={{color:"#10b981",marginRight:4}}>●</span>ONLINE
          </div>
          <button onClick={()=>{localStorage.removeItem("auth");window.location.reload();}} style={{background:"transparent",border:"1px solid #1a3a5a",borderRadius:5,color:"#3a6a8a",padding:"4px 10px",fontSize:10,cursor:"pointer",letterSpacing:1}}>LOGOUT</button>
        </div>
      </header>

      <main style={{position:"relative",zIndex:10,maxWidth:1100,margin:"0 auto",padding:"32px 20px"}}>

        {/* Hero */}
        <div className="fadein" style={{textAlign:"center",marginBottom:48}}>
          <div style={{fontSize:12,color:"#1a5a7a",letterSpacing:4,marginBottom:12}}>— HỆ THỐNG HỌC TẬP —</div>
          <h1 style={{fontFamily:"Orbitron,sans-serif",fontWeight:900,fontSize:"clamp(22px,4vw,40px)",color:"#fff",lineHeight:1.2,marginBottom:12}}>
            NETWORK ENGINEERING<br/>
            <span style={{color:"#00d4ff"}}>LAB PORTAL</span>
          </h1>
          <p style={{fontSize:12,color:"#4a7a9a",maxWidth:520,margin:"0 auto",lineHeight:1.9}}>
            Nền tảng học tập chuyên sâu về mạng máy tính — từ IPv6 NGN đến SDN automation.<br/>
            Chọn môn học để bắt đầu.
          </p>
        </div>

        {/* Course Cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:20,marginBottom:40}}>
          {courses.map((c,i) => (
            <div key={c.id} className="course-card fadein"
              style={{animationDelay:`${i*0.15}s`,background:hovered===c.id?`linear-gradient(135deg,#07111c,#040d18)`:"#07111c",border:`1px solid ${hovered===c.id?c.color:"#0a2030"}`,borderRadius:12,overflow:"hidden",boxShadow:hovered===c.id?`0 0 40px ${c.glow}22`:"none"}}
              onMouseEnter={()=>setHovered(c.id)} onMouseLeave={()=>setHovered(null)}
              onClick={()=>onNavigate(c.id)}>

              {/* Card top accent */}
              <div style={{height:3,background:`linear-gradient(90deg,transparent,${c.color},transparent)`}}/>

              <div style={{padding:"24px"}}>
                {/* Badge row */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <div style={{display:"flex",gap:6}}>
                    <span style={{background:`${c.color}15`,border:`1px solid ${c.color}40`,borderRadius:4,padding:"2px 8px",fontSize:10,color:c.color,fontFamily:"Orbitron,sans-serif",letterSpacing:1}}>{c.code}</span>
                    <span style={{background:"#1a3a5a20",border:"1px solid #1a3a5a",borderRadius:4,padding:"2px 8px",fontSize:10,color:"#4a8a9a"}}>{c.credits}</span>
                  </div>
                  <span style={{fontSize:28}}>{c.icon}</span>
                </div>

                <h2 style={{fontFamily:"Orbitron,sans-serif",fontWeight:700,fontSize:14,color:"#fff",lineHeight:1.3,marginBottom:6}}>{c.title}</h2>
                <div style={{fontSize:10,color:c.color,marginBottom:12,letterSpacing:1}}>{c.sub}</div>
                <p style={{fontSize:11,color:"#5a8aaa",lineHeight:1.8,marginBottom:16}}>{c.desc}</p>

                {/* Stats */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
                  {c.stats.map((s,si)=>(
                    <div key={si} style={{textAlign:"center",background:`${c.color}08`,borderRadius:6,padding:"8px 4px",border:`1px solid ${c.color}15`}}>
                      <div style={{fontFamily:"Orbitron,sans-serif",fontWeight:700,fontSize:14,color:c.color}}>{s.v}</div>
                      <div style={{fontSize:9,color:"#3a6a8a",marginTop:2}}>{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:16}}>
                  {c.tags.map(t=><span key={t} style={{background:"#020a14",border:`1px solid ${c.color}25`,borderRadius:3,padding:"2px 6px",fontSize:9,color:c.color}}>{t}</span>)}
                </div>

                {/* Instructor */}
                <div style={{borderTop:`1px solid ${c.color}15`,paddingTop:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:10,color:"#3a5a7a"}}>Giảng viên</div>
                    <div style={{fontSize:11,color:"#c0d8f0",fontWeight:700}}>{c.instructor}</div>
                    <div style={{fontSize:10,color:c.color}}>{c.email}</div>
                  </div>
                  <div style={{background:`${c.color}15`,border:`1px solid ${c.color}40`,borderRadius:8,padding:"8px 16px",color:c.color,fontSize:11,fontFamily:"Orbitron,sans-serif",fontWeight:700,letterSpacing:1,display:"flex",alignItems:"center",gap:6}}>
                    VÀO HỌC <span style={{fontSize:14}}>→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info grid */}
        <div className="fadein" style={{animationDelay:"0.4s",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginBottom:32}}>
          {/* Announcements */}
          <div style={{background:"#07111c",border:"1px solid #0a2030",borderRadius:10,padding:"18px",gridColumn:"span 2"}}>
            <div style={{fontFamily:"Orbitron,sans-serif",fontWeight:700,fontSize:11,color:"#f59e0b",marginBottom:14,letterSpacing:2}}>📢 THÔNG BÁO</div>
            {news.map((n,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<news.length-1?"1px solid #0a1828":"none",alignItems:"flex-start"}}>
                <span style={{fontSize:14,flexShrink:0}}>{n.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:"#8ab0c8",lineHeight:1.6}}>{n.text}</div>
                </div>
                <span style={{fontSize:9,color:"#1a4a6a",flexShrink:0,marginTop:2}}>{n.time}</span>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div style={{background:"#07111c",border:"1px solid #0a2030",borderRadius:10,padding:"18px"}}>
            <div style={{fontFamily:"Orbitron,sans-serif",fontWeight:700,fontSize:11,color:"#10b981",marginBottom:14,letterSpacing:2}}>🔗 LIÊN KẾT NHANH</div>
            {[
              {l:"EVE-NG Web UI",u:"http://192.168.1.100",c:"#00d4ff"},
              {l:"Cisco DevNet Sandbox",u:"https://devnetsandbox.cisco.com",c:"#38bdf8"},
              {l:"APIC-EM Sandbox",u:"https://sandboxapicem.cisco.com",c:"#38bdf8"},
              {l:"Zoiper Softphone",u:"https://www.zoiper.com",c:"#a855f7"},
              {l:"Wireshark Download",u:"https://www.wireshark.org",c:"#10b981"},
              {l:"Python 3 Docs",u:"https://docs.python.org",c:"#4ade80"},
            ].map((lk,i)=>(
              <div key={i} style={{padding:"6px 0",borderBottom:i<5?"1px solid #0a1828":"none"}}>
                <a href={lk.u} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:lk.c,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:9,opacity:0.6}}>→</span>{lk.l}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="fadein" style={{animationDelay:"0.5s",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
          {[
            {label:"Hệ thống",items:["EVE-NG Community 5.0+","Cisco IOL L3/L2","Ubuntu 22.04 LTS","Python 3.10+"]},
            {label:"Môn NGN/IPv6",items:["IPv6 Dual-Stack","OSPFv3 Multi-Area","BGP Multi-Homing","Cisco CME + FreePBX"]},
            {label:"Môn Chuyên Đề 1",items:["SDN Architecture","Python REST API","Cisco APIC-EM","Mininet + OpenFlow"]},
            {label:"Liên hệ",items:["phuctv@dlu.edu.vn","quanvm@dlu.edu.vn","Khoa CNTT — DLU","Lâm Đồng 2024"]},
          ].map((col,i)=>(
            <div key={i} style={{background:"#07111c",border:"1px solid #0a2030",borderRadius:8,padding:"14px"}}>
              <div style={{fontSize:10,color:"#3a6a8a",letterSpacing:2,marginBottom:8,fontFamily:"Orbitron,sans-serif"}}>{col.label.toUpperCase()}</div>
              {col.items.map((item,j)=><div key={j} style={{fontSize:11,color:"#4a7a9a",padding:"3px 0",borderBottom:j<col.items.length-1?"1px solid #0a1828":"none"}}>{item}</div>)}
            </div>
          ))}
        </div>
      </main>

      <footer style={{position:"relative",zIndex:10,borderTop:"1px solid #0a2030",padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:10,color:"#0a2a40",flexWrap:"wrap",gap:6}}>
        <span>DLU Network Lab Portal · Khoa CNTT</span>
        <span>© 2025 Trường Đại học Đà Lạt</span>
        <span>NGN/IPv6 · SDN/Python · VoIP</span>
      </footer>
    </div>
  );
}
