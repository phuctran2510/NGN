const CARDS = [
  {title:'Khởi động EVE-NG',color:'#00d4ff',items:['Truy cập EVE-NG Web UI: http://EVE-NG-IP','Tạo New Lab, Add Node → Cisco IOL','Kết nối nodes bằng drag-and-drop','Start all nodes, đợi boot ~30s','Click node → Console để terminal','File → Save (Ctrl+S) lưu lab']},
  {title:'Cấu hình IPv6 nhanh',color:'#10b981',items:['enable → configure terminal','ipv6 unicast-routing (bắt buộc!)','ipv6 cef (Cisco Express Forwarding)','interface Gi0/0 → ipv6 address X/prefix','ipv6 address FE80::1 link-local','no shutdown → end → wr mem']},
  {title:'Debug IPv6',color:'#f59e0b',items:['show ipv6 interface brief','show ipv6 neighbors (NDP cache)','show ipv6 route (routing table)','ping ipv6 X source Y repeat 100','traceroute ipv6 X source Y','debug ipv6 icmp / debug ipv6 ospf']},
  {title:'OSPFv3 Reference',color:'#a855f7',items:['ipv6 router ospf 1 → router-id X.X.X.X','interface Gi0/0 → ipv6 ospf 1 area 0','show ipv6 ospf neighbor (Full = OK)','show ipv6 ospf database','clear ipv6 ospf process','debug ipv6 ospf adj']},
  {title:'BGP IPv6 Checklist',color:'#ff6b35',items:['router bgp 65001 + no bgp default ipv4-unicast','neighbor X remote-as Y (IPv6 addr)','address-family ipv6 → neighbor activate','network 2001:db8::/32','show bgp ipv6 unicast summary','clear bgp ipv6 unicast * soft']},
  {title:'VoIP Troubleshoot',color:'#7c3aed',items:['show ephone registered (CME phones)','show dial-peer voice summary','debug ccsip messages (SIP trace)','debug ephone detail (SCCP)','show call active voice brief','pjsip set logger on (FreePBX)']},
  {title:'QoS Verification',color:'#f59e0b',items:['show policy-map interface Gi0/0 input','show policy-map interface Gi0/0 output','show class-map','show queue GigabitEthernet0/0','show interface Gi0/0 | include drop','show ip sla statistics']},
  {title:'Security Commands',color:'#10b981',items:['show ipv6 nd raguard policy','show ipv6 dhcp snooping','show ipv6 source-guard policy','show ip verify source (uRPF)','fail2ban-client status asterisk','show ip access-lists']},
]

const VERIFY = [
  ["IPv6 Interface","show ipv6 interface brief","UP/UP, global+link-local"],
  ["OSPFv3 Neighbor","show ipv6 ospf neighbor","FULL/DR hoặc FULL/BDR"],
  ["BGP Session","show bgp ipv6 unicast summary","Established"],
  ["HSRP","show standby brief","Active/Standby đúng priority"],
  ["DHCPv6","show ipv6 dhcp binding","IAID + địa chỉ đầy đủ"],
  ["PIM Neighbor","show ipv6 pim neighbor","Neighbors + uptime"],
  ["Multicast","show ipv6 mroute","(*,G) và (S,G) entries"],
  ["QoS Policy","show policy-map interface","Hit counters tăng"],
  ["CME Phones","show ephone registered","MAC, IP, extension"],
  ["SIP Trunk","show sip-ua status registrar","Registered: Yes"],
  ["FreePBX","pjsip show endpoints","Status: Online"],
]

export default function Guide() {
  return (
    <div className="fu">
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'clamp(1.3rem,3.5vw,1.8rem)',fontWeight:800}}><span className="gt">Hướng dẫn nhanh</span></h1>
        <p style={{color:'var(--txt3)',fontSize:'.86rem',marginTop:'.3rem'}}>Quick reference cards và bảng verify đầy đủ</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(260px,100%),1fr))',gap:'.75rem',marginBottom:'1.5rem'}}>
        {CARDS.map((c,i)=>(
          <div key={i} className="card" style={{padding:'1rem',borderLeft:`3px solid ${c.color}`,borderColor:`${c.color}22`,borderLeftColor:c.color}}>
            <div style={{fontWeight:700,fontSize:'.83rem',color:c.color,marginBottom:'.65rem',fontFamily:'var(--fc)',letterSpacing:.5}}>{c.title}</div>
            {c.items.map((item,j)=>(
              <div key={j} style={{display:'flex',gap:6,marginBottom:5,alignItems:'flex-start'}}>
                <span style={{color:c.color,fontSize:'.7rem',flexShrink:0,marginTop:'3px'}}>▸</span>
                <code style={{fontSize:'.77rem',color:'var(--txt2)',lineHeight:1.6,wordBreak:'break-all',fontFamily:'var(--fc)'}}>{item}</code>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{fontWeight:700,fontSize:'.88rem',color:'var(--txt)',marginBottom:'.75rem'}}>Bảng verify đầy đủ</div>
      <div className="tw">
        <table>
          <thead><tr><th>Tính năng</th><th>Lệnh verify</th><th>Kết quả mong đợi</th></tr></thead>
          <tbody>
            {VERIFY.map((row,i)=>(
              <tr key={i}>
                <td style={{color:'var(--txt)',fontWeight:500}}>{row[0]}</td>
                <td><code style={{color:'var(--grn)',fontSize:'.78rem'}}>{row[1]}</code></td>
                <td style={{fontSize:'.8rem'}}>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
