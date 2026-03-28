import { useState } from 'react'

function SvgWrap({children}){
  return <svg viewBox="0 0 800 460" style={{width:"100%",height:"100%",display:"block"}}>
    <rect width="800" height="460" fill="#020d18"/>
    {[...Array(17)].map((_,i)=><line key={`v${i}`} x1={i*50} y1="0" x2={i*50} y2="460" stroke="#0a2030" strokeWidth="0.5"/>)}
    {[...Array(10)].map((_,i)=><line key={`h${i}`} x1="0" y1={i*50} x2="800" y2={i*50} stroke="#0a2030" strokeWidth="0.5"/>)}
    {children}
  </svg>
}

function TopoFull(){
  return <SvgWrap>
    {[{x:270,l:"ISP-A",s:"AS 100"},{x:530,l:"ISP-B",s:"AS 200"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={20} width={130} height={45} rx="7" fill="#0f0500" stroke="#ff6b35" strokeWidth="2"/>
      <text x={n.x+65} y={38} textAnchor="middle" fill="#ff6b35" fontSize="11" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+65} y={54} textAnchor="middle" fill="#8a3000" fontSize="9" fontFamily="monospace">{n.s}</text></g>
    ))}
    {[{x:220,l:"EDGE-R1",s:"AS65001"},{x:450,l:"EDGE-R2",s:"AS65001"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={110} width={130} height={48} rx="7" fill="#041520" stroke="#00d4ff" strokeWidth="2"/>
      <text x={n.x+65} y={130} textAnchor="middle" fill="#00d4ff" fontSize="11" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+65} y={148} textAnchor="middle" fill="#1a7a9a" fontSize="9" fontFamily="monospace">{n.s}</text></g>
    ))}
    <line x1="335" y1="65" x2="285" y2="110" stroke="#ff6b35" strokeWidth="1.5"/>
    <line x1="595" y1="65" x2="515" y2="110" stroke="#ff6b35" strokeWidth="1.5"/>
    <line x1="350" y1="134" x2="450" y2="134" stroke="#00d4ff" strokeWidth="1" strokeDasharray="5,3"/>
    <text x="400" y="129" textAnchor="middle" fill="#00d4ff" fontSize="8" fontFamily="monospace">iBGP</text>
    {[{x:210,l:"CORE-R1",s:"RP·OSPFv3"},{x:430,l:"CORE-R2",s:"BSR·ABR"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={210} width={130} height={46} rx="7" fill="#041a10" stroke="#10b981" strokeWidth="2"/>
      <text x={n.x+65} y={230} textAnchor="middle" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+65} y={246} textAnchor="middle" fill="#1a7a4a" fontSize="9" fontFamily="monospace">{n.s}</text></g>
    ))}
    <line x1="285" y1="158" x2="275" y2="210" stroke="#00d4ff" strokeWidth="1.5"/>
    <line x1="515" y1="158" x2="495" y2="210" stroke="#00d4ff" strokeWidth="1.5"/>
    <line x1="340" y1="233" x2="430" y2="233" stroke="#10b981" strokeWidth="1.5"/>
    {[{x:148,l:"DIST-SW1",s:"HSRP·VLAN10"},{x:488,l:"DIST-SW2",s:"HSRP·VLAN100"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={310} width={120} height={42} rx="6" fill="#080e18" stroke="#a855f7" strokeWidth="1.5"/>
      <text x={n.x+60} y={329} textAnchor="middle" fill="#a855f7" fontSize="10" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+60} y={344} textAnchor="middle" fill="#5a1a9a" fontSize="8" fontFamily="monospace">{n.s}</text></g>
    ))}
    <line x1="258" y1="256" x2="222" y2="310" stroke="#a855f7" strokeWidth="1.5"/>
    <line x1="502" y1="256" x2="532" y2="310" stroke="#a855f7" strokeWidth="1.5"/>
    {[{x:52,l:"ACC-SW1"},{x:175,l:"ACC-SW2"},{x:478,l:"ACC-SW3"},{x:600,l:"CME+PBX"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={395} width={98} height={30} rx="4" fill="#06080e" stroke={i<3?"#f59e0b":"#a855f7"} strokeWidth="1"/>
      <text x={n.x+49} y={414} textAnchor="middle" fill={i<3?"#f59e0b":"#a855f7"} fontSize="9" fontFamily="monospace">{n.l}</text></g>
    ))}
    <line x1="190" y1="352" x2="112" y2="395" stroke="#f59e0b" strokeWidth="1"/>
    <line x1="205" y1="352" x2="220" y2="395" stroke="#f59e0b" strokeWidth="1"/>
    <line x1="525" y1="352" x2="516" y2="395" stroke="#f59e0b" strokeWidth="1"/>
    <line x1="553" y1="352" x2="640" y2="395" stroke="#a855f7" strokeWidth="1"/>
  </SvgWrap>
}

function TopoVoIP(){
  return <SvgWrap>
    <rect x="40" y="30" width="720" height="400" rx="12" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="8,4" opacity="0.5"/>
    <text x="400" y="22" textAnchor="middle" fill="#7c3aed" fontSize="11" fontFamily="monospace" fontWeight="bold">VoIP INFRASTRUCTURE</text>
    {[{x:160,y:80,l:"CME ROUTER",s:"1XXX Extensions",c:"#7c3aed"},{x:450,y:80,l:"FreePBX",s:"2XXX Extensions",c:"#10b981"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={n.y} width={150} height={55} rx="8" fill="#0a0618" stroke={n.c} strokeWidth="2"/>
      <text x={n.x+75} y={n.y+22} textAnchor="middle" fill={n.c} fontSize="12" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+75} y={n.y+40} textAnchor="middle" fill={n.c} fontSize="9" fontFamily="monospace">{n.s}</text></g>
    ))}
    <line x1="310" y1="107" x2="450" y2="107" stroke="#10b981" strokeWidth="2" strokeDasharray="6,3"/>
    <text x="380" y="100" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace">SIP Trunk</text>
    {[{x:60,y:220,l:"IP Phone",s:"1001-Alice",c:"#7c3aed"},{x:200,y:220,l:"IP Phone",s:"1002-Bob",c:"#7c3aed"},{x:340,y:220,l:"IP Phone",s:"1003-Carol",c:"#7c3aed"},{x:480,y:220,l:"Softphone",s:"2001 Zoiper",c:"#10b981"},{x:610,y:220,l:"Softphone",s:"2002 Linphone",c:"#10b981"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={n.y} width={110} height={45} rx="6" fill="#050510" stroke={n.c} strokeWidth="1.5"/>
      <text x={n.x+55} y={n.y+18} textAnchor="middle" fill={n.c} fontSize="9" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+55} y={n.y+34} textAnchor="middle" fill={n.c} fontSize="8" fontFamily="monospace">{n.s}</text></g>
    ))}
    {[{fx:115,fy:220,tx:235,ty:135},{fx:255,fy:220,tx:235,ty:135},{fx:395,fy:220,tx:235,ty:135},{fx:535,fy:220,tx:525,ty:135},{fx:665,fy:220,tx:525,ty:135}].map((l,i)=>(
      <line key={i} x1={l.fx} y1={l.fy} x2={l.tx} y2={l.ty} stroke={i<3?"#7c3aed":"#10b981"} strokeWidth="1" strokeDasharray="4,3"/>
    ))}
    <rect x="300" y="330" width="200" height="50" rx="8" fill="#0a0815" stroke="#f59e0b" strokeWidth="1.5"/>
    <text x="400" y="350" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">QoS: DSCP EF = 46</text>
    <text x="400" y="367" textAnchor="middle" fill="#7a5a00" fontSize="9" fontFamily="monospace">LLQ 15% · Jitter {'<'}10ms · Loss 0%</text>
    <text x="130" y="310" textAnchor="middle" fill="#7c3aed" fontSize="9" fontFamily="monospace">SCCP port 2000</text>
    <text x="600" y="310" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace">SIP port 5060</text>
  </SvgWrap>
}

function TopoQoS(){
  return <SvgWrap>
    <text x="400" y="25" textAnchor="middle" fill="#f59e0b" fontSize="12" fontFamily="monospace" fontWeight="bold">QoS ARCHITECTURE — DiffServ Model</text>
    {[{x:30,y:60,l:"IP Phone",s:"DSCP EF=46",c:"#7c3aed"},{x:30,y:140,l:"Video",s:"DSCP AF41=34",c:"#ff6b35"},{x:30,y:220,l:"Business",s:"DSCP AF31=26",c:"#10b981"},{x:30,y:300,l:"Internet",s:"DSCP BE=0",c:"#4a8a9a"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={n.y} width={110} height={40} rx="6" fill="#050510" stroke={n.c} strokeWidth="1.5"/>
      <text x={n.x+55} y={n.y+16} textAnchor="middle" fill={n.c} fontSize="9" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+55} y={n.y+30} textAnchor="middle" fill={n.c} fontSize="8" fontFamily="monospace">{n.s}</text></g>
    ))}
    <rect x="190" y="40" width="140" height="320" rx="8" fill="#0a0815" stroke="#f59e0b" strokeWidth="2"/>
    <text x="260" y="60" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">EDGE</text>
    <text x="260" y="75" textAnchor="middle" fill="#7a5a00" fontSize="8" fontFamily="monospace">Trust Boundary</text>
    {[{y:90,l:"LLQ 15%",s:"Voice EF",c:"#7c3aed"},{y:160,l:"CBWFQ 25%",s:"Video AF41",c:"#ff6b35"},{y:230,l:"CBWFQ 30%",s:"Biz AF31",c:"#10b981"},{y:300,l:"Best Effort",s:"Default BE",c:"#4a8a9a"}].map((b,i)=>(
      <g key={i}><rect x={205} y={b.y} width={110} height={45} rx="5" fill={`${b.c}12`} stroke={b.c} strokeWidth="1"/>
      <text x={260} y={b.y+17} textAnchor="middle" fill={b.c} fontSize="9" fontFamily="monospace" fontWeight="bold">{b.l}</text>
      <text x={260} y={b.y+32} textAnchor="middle" fill={b.c} fontSize="8" fontFamily="monospace">{b.s}</text></g>
    ))}
    {[[80,110],[160,185],[240,252],[320,322]].map((p,i)=>(
      <line key={i} x1={140} y1={p[0]} x2={205} y2={p[1]} stroke={["#7c3aed","#ff6b35","#10b981","#4a8a9a"][i]} strokeWidth="1.5"/>
    ))}
    <rect x="390" y="40" width="160" height="320" rx="8" fill="#0a0815" stroke="#00d4ff" strokeWidth="2"/>
    <text x="470" y="65" textAnchor="middle" fill="#00d4ff" fontSize="10" fontFamily="monospace" fontWeight="bold">CORE ROUTING</text>
    {[{y:90,l:"LLQ Strict"},{y:160,l:"WRED + AF41"},{y:230,l:"CBWFQ Fair"},{y:300,l:"Tail Drop"}].map((b,i)=>(
      <g key={i}><rect x={405} y={b.y} width={130} height={45} rx="5" fill={`${["#7c3aed","#ff6b35","#10b981","#4a8a9a"][i]}0e`} stroke={["#7c3aed","#ff6b35","#10b981","#4a8a9a"][i]} strokeWidth="1"/>
      <text x={470} y={b.y+26} textAnchor="middle" fill={["#7c3aed","#ff6b35","#10b981","#4a8a9a"][i]} fontSize="9" fontFamily="monospace" fontWeight="bold">{b.l}</text></g>
    ))}
    {[[112,112],[187,187],[252,252],[322,322]].map((p,i)=>(
      <line key={i} x1={330} y1={p[0]} x2={405} y2={p[1]} stroke={["#7c3aed","#ff6b35","#10b981","#4a8a9a"][i]} strokeWidth="1.5"/>
    ))}
    <rect x="610" y="160" width="120" height="100" rx="8" fill="#041520" stroke="#00d4ff" strokeWidth="2"/>
    <text x="670" y="185" textAnchor="middle" fill="#00d4ff" fontSize="10" fontFamily="monospace">DEST</text>
    <text x="670" y="202" textAnchor="middle" fill="#1a5a8a" fontSize="9" fontFamily="monospace">E2E QoS</text>
    <text x="670" y="216" textAnchor="middle" fill="#1a5a8a" fontSize="8" fontFamily="monospace">Preserved</text>
    <text x="670" y="230" textAnchor="middle" fill="#1a5a8a" fontSize="8" fontFamily="monospace">DSCP intact</text>
    {[112,187,210,235].map((y,i)=>(
      <line key={i} x1={550} y1={y} x2={610} y2={210} stroke={["#7c3aed","#ff6b35","#10b981","#4a8a9a"][i]} strokeWidth="1"/>
    ))}
  </SvgWrap>
}

const TOPOS = [
  {id:'full', label:'Tổng thể NGN', comp: TopoFull},
  {id:'voip', label:'VoIP / CME / FreePBX', comp: TopoVoIP},
  {id:'qos',  label:'QoS DiffServ', comp: TopoQoS},
]

export default function Topology() {
  const [sel, setSel] = useState('full')
  const T = TOPOS.find(t=>t.id===sel)
  const Comp = T.comp

  return (
    <div className="fu">
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'clamp(1.3rem,3.5vw,1.8rem)',fontWeight:800}}><span className="gt">Topology Viewer</span></h1>
        <p style={{color:'var(--txt3)',fontSize:'.86rem',marginTop:'.3rem'}}>Sơ đồ mạng NGN, VoIP và QoS</p>
      </div>
      <div style={{display:'flex',gap:'.5rem',marginBottom:'1rem',flexWrap:'wrap'}}>
        {TOPOS.map(t=>(
          <button key={t.id} onClick={()=>setSel(t.id)}
            style={{background:sel===t.id?'rgba(0,212,255,.12)':'var(--sur)',border:`1px solid ${sel===t.id?'rgba(0,212,255,.4)':'var(--brd)'}`,color:sel===t.id?'var(--acc)':'var(--txt2)',padding:'.45rem .9rem',borderRadius:7,fontSize:'.83rem',cursor:'pointer',transition:'all .14s'}}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="card" style={{overflow:'hidden'}}>
        <div style={{background:'var(--bg2)',borderBottom:'1px solid var(--brd)',padding:'.65rem 1rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{color:'var(--acc)',fontFamily:'var(--fc)',fontWeight:700,fontSize:'.82rem'}}>{T.label}</span>
          <span style={{color:'var(--txt3)',fontSize:'.75rem'}}>EVE-NG Lab</span>
        </div>
        <div style={{width:'100%',aspectRatio:'16/9',minHeight:240}}><Comp/></div>
      </div>
    </div>
  )
}
