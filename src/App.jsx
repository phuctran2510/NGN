import { useState, useEffect } from "react";

// ============================================================
// LOGIN COMPONENT
// ============================================================
function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (password === "ngn2025") {
      localStorage.setItem("auth", "true");
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      height:"100vh", display:"flex", justifyContent:"center", alignItems:"center",
      background:"#020d18", fontFamily:"'Share Tech Mono','Courier New',monospace",
      flexDirection:"column", gap:0
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@600;700&display=swap');
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px #00d4ff22}50%{box-shadow:0 0 40px #00d4ff44}}
        .login-box{animation:glow 3s infinite}
        .shake{animation:shake 0.4s ease}
        input:focus{outline:none!important;border-color:#00d4ff!important;box-shadow:0 0 0 2px #00d4ff22!important}
      `}</style>
      <div style={{
        textAlign:"center", marginBottom:32,
      }}>
        <div style={{fontSize:48, marginBottom:8}}>🌐</div>
        <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:22,color:"#00d4ff",letterSpacing:4}}>DLU NETWORK LAB</div>
        <div style={{fontSize:12,color:"#1a4a6a",marginTop:4,letterSpacing:2}}>TRƯỜNG ĐẠI HỌC ĐÀ LẠT</div>
      </div>
      <div className={`login-box ${shake?"shake":""}`} style={{
        background:"#040f18", border:"1px solid #0a2a40", borderRadius:12,
        padding:"32px 40px", width:320, textAlign:"center"
      }}>
        <div style={{color:"#3a6a8a",fontSize:12,letterSpacing:3,marginBottom:20}}>ACCESS PORTAL</div>
        <input
          type="password"
          placeholder="Nhập mật khẩu..."
          value={password}
          onChange={e=>{setPassword(e.target.value);setError(false);}}
          onKeyDown={e=>e.key==="Enter"&&handleLogin()}
          style={{
            width:"100%", padding:"10px 14px", background:"#020d18",
            border:`1px solid ${error?"#ff4444":"#1a3a5a"}`,
            borderRadius:6, color:"#c0d8f0", fontSize:13,
            fontFamily:"Share Tech Mono,monospace", boxSizing:"border-box",
            transition:"all 0.2s"
          }}
        />
        {error&&<div style={{color:"#ff4444",fontSize:11,marginTop:6}}>⚠ Sai mật khẩu</div>}
        <button onClick={handleLogin} style={{
          width:"100%", marginTop:14, padding:"10px", background:"#0a2a3a",
          border:"1px solid #00d4ff", borderRadius:6, color:"#00d4ff",
          fontFamily:"Share Tech Mono,monospace", fontSize:13, cursor:"pointer",
          transition:"all 0.2s", letterSpacing:2
        }}
          onMouseOver={e=>e.target.style.background="#041a2a"}
          onMouseOut={e=>e.target.style.background="#0a2a3a"}
        >ĐĂNG NHẬP</button>
      </div>
      <div style={{marginTop:20,color:"#0a2a40",fontSize:11}}>Trần Vĩnh Phúc · phuctv@dlu.edu.vn</div>
    </div>
  );
}

// ============================================================
// NGN DATA
// ============================================================
const NGN_MODULES = [
  {
    id:1, icon:"🔧", color:"#00d4ff", dark:"#002a3f",
    title:"DEPLOY HẠ TẦNG IPv6 NGN",
    labs:"6 Labs", tags:["OSPFv3","BGP","Tunneling","DHCPv6","HSRP"],
    desc:"Xây dựng hạ tầng mạng thế hệ mới hoàn chỉnh trên nền IPv6.",
    labList:[
      { num:"1.1", name:"Thiết Lập EVE-NG & IPv6 Cơ Bản", dur:"90 phút", diff:1,
        deploy:["Cài EVE-NG Community 5.0+ trên VMware (RAM≥32GB, SSD 500GB)","Import Cisco IOL L3/L2 images vào /opt/unetlab/addons/iol/bin/","Chạy: /opt/unetlab/wrappers/unl_wrapper -a fixpermissions","Tạo topology 4 node: R1─R2─R3─R4 trên EVE-NG Web UI","Enable IPv6: ipv6 unicast-routing + ipv6 cef trên tất cả routers","Cấu hình địa chỉ IPv6 + link-local FE80:: trên từng interface","Verify: ping ipv6, show ipv6 neighbors, show ipv6 route"],
        cmds:`ipv6 unicast-routing\nipv6 cef\n!\ninterface GigabitEthernet0/0\n  ipv6 address 2001:db8:10:12::1/64\n  ipv6 address FE80::1 link-local\n  ipv6 enable\n  no shutdown\n!\nshow ipv6 interface brief\nshow ipv6 neighbors\nping ipv6 2001:db8:10:12::2 source Lo0`,
        topo:`R1(EDGE)─Gi0/0─R2(CORE)─Gi0/1─R3(DIST)\n                    │\n              R4(ACCESS)\nR1-Lo0: 2001:db8:FFFF:1::1/128\nR2-Lo0: 2001:db8:FFFF:2::1/128\nR1-Gi0/0: 2001:db8:10:12::1/64\nR2-Gi0/0: 2001:db8:10:12::2/64`,
        result:["Tất cả interfaces IPv6 UP/UP","Ping IPv6 thành công giữa các routers","show ipv6 neighbors: REACH state","Dual-stack IPv4+IPv6 song song"],
        hints:["Nếu ping fail: kiểm tra 'no shutdown' và IPv6 enable","Link-local FE80:: cần cấu hình thủ công để dễ debug","Dùng 'debug ipv6 icmp' để xem ICMPv6 messages","EVE-NG IOL cần file iourc license hợp lệ"]
      },
      { num:"1.2", name:"OSPFv3 Multi-Area", dur:"120 phút", diff:2,
        deploy:["Tạo OSPFv3 process ID 1: ipv6 router ospf 1 trên mỗi router","Thiết lập router-id dạng IPv4: router-id 1.1.1.1","Gán interface vào Area: ipv6 ospf 1 area 0/1/2","CORE-R1 (ABR): area 1 range 2001:db8:1::/48","EDGE-R1 (ASBR): redistribute connected subnets","IPsec Auth: ipv6 ospf authentication ipsec spi 256 sha1 KEY","Verify: show ipv6 ospf neighbor phải Full state"],
        cmds:`ipv6 router ospf 1\n  router-id 1.1.1.1\n  auto-cost reference-bandwidth 10000\n  area 1 range 2001:db8:1::/48\n!\ninterface GigabitEthernet0/0\n  ipv6 ospf 1 area 0\n  ipv6 ospf network point-to-point\n!\nshow ipv6 ospf neighbor\nshow ipv6 ospf database\nshow ipv6 route ospf`,
        topo:`Area 0 (Backbone): CORE-R1─CORE-R2─EDGE-R1─EDGE-R2\nArea 1 (Data):     DIST-SW1─ACC-SW1─ACC-SW2\nArea 2 (Voice):    DIST-SW2─ACC-SW3─CME-GW\nArea 10 (Mgmt):    OOB Management\nABR: CORE-R1 (Area0+1+2)`,
        result:["Tất cả OSPF neighbor ở trạng thái Full","Route summarization tại ABR hoạt động","show ipv6 route ospf: đầy đủ routes","Authentication IPsec thành công"],
        hints:["Router-ID bắt buộc nếu không có IPv4 interface","'reference-bandwidth 10000' = 10Gbps","Dùng 'debug ipv6 ospf adj' khi neighbor không lên","Point-to-point network type bỏ DR/BDR election"]
      },
      { num:"1.3", name:"BGP IPv6 Multi-Homing", dur:"150 phút", diff:3,
        deploy:["router bgp 65001 + no bgp default ipv4-unicast","Khai báo eBGP ISP-A(AS100), ISP-B(AS200)","iBGP EDGE-R1↔R2: update-source Lo0, next-hop-self","address-family ipv6 → neighbor activate","Announce: network 2001:db8::/32","AS-PATH prepend×3 trên ISP-B (prefer ISP-A)"],
        cmds:`router bgp 65001\n  bgp router-id 1.1.1.1\n  no bgp default ipv4-unicast\n  neighbor 2001:db8:FFFF:2::1 remote-as 65001\n  neighbor 2001:db8:20:1::1 remote-as 100\n  !\n  address-family ipv6\n    network 2001:db8::/32\n    neighbor 2001:db8:FFFF:2::1 activate\n    neighbor 2001:db8:FFFF:2::1 next-hop-self\n    neighbor 2001:db8:20:1::1 activate\n!\nshow bgp ipv6 unicast summary`,
        topo:`ISP-A(AS100)─eBGP─EDGE-R1(AS65001)\niBGP: EDGE-R1 ↔ EDGE-R2\nISP-B(AS200)─eBGP─EDGE-R2(AS65001)\nPolicy: ISP-A LP=200 (primary)\n        ISP-B LP=100 + prepend×3 (backup)`,
        result:["BGP sessions Established với 2 ISP","Traffic ưu tiên qua ISP-A","Failover sang ISP-B < 30 giây","Prefix-list chặn bogon IPv6"],
        hints:["'no bgp default ipv4-unicast' bắt buộc","Dùng 'clear bgp ipv6 unicast * soft'","TTL security: neighbor X ttl-security hops 1","show bgp ipv6 unicast 2001:db8::/32 detail"]
      },
      { num:"1.4", name:"IPv6 Tunneling", dur:"100 phút", diff:2,
        deploy:["6in4: tunnel mode ipv6ip, src/dst IPv4, MTU 1480","GRE IPv6: tunnel mode gre ip, MTU 1476","ISATAP: tunnel mode ipv6ip isatap, EUI-64","6to4: tunnel mode ipv6ip 6to4, prefix 2002::/16","Test MTU: ping ipv6 extended df-bit size 1400"],
        cmds:`interface Tunnel0\n  ipv6 address 2001:db8:T1::1/64\n  tunnel source GigabitEthernet0/0\n  tunnel destination 192.168.2.1\n  tunnel mode ipv6ip\n  ipv6 mtu 1480\n!\ninterface Tunnel3\n  ipv6 address 2002:C0A8:0101::/48\n  tunnel mode ipv6ip 6to4\nipv6 route 2002::/16 Tunnel3`,
        topo:`R1(192.168.1.1)══[6in4 Proto41]══R2(192.168.2.1)\nTunnel0: 2001:db8:T1::1/64\nMTU: 6in4=1480, GRE=1476\n6to4 prefix = 2002:hex(IPv4)::/48`,
        result:["4 loại tunnel hoạt động và ping được","MTU đúng, không bị fragmentation","Wireshark thấy IPv6-in-IPv4 encapsulation","traceroute IPv6 qua tunnel thành công"],
        hints:["6to4: 2002 + hex(IPv4). VD: 192.168.1.1=2002:C0A8:0101","ISATAP EUI-64 tự generate từ IPv4","Kiểm tra MTU: ping ipv6 X size 1500 df-bit","show interface Tunnel0 kiểm tra encaps counter"]
      },
      { num:"1.5", name:"VLAN Trunking & HSRPv2 IPv6", dur:"90 phút", diff:2,
        deploy:["Tạo VLAN 10,20,100,999","Trunk 802.1Q: switchport trunk encapsulation dot1q","SVI với IPv6: interface Vlan10 → ipv6 address","HSRPv2: standby version 2, standby 10 ipv6 VIP/64","DIST-SW1 priority 110 (Active), SW2 priority 90","DHCPv6 relay: ipv6 dhcp relay destination CORE-R1"],
        cmds:`interface GigabitEthernet0/1\n  switchport mode trunk\n  switchport trunk encapsulation dot1q\n  switchport trunk allowed vlan 10,20,100,999\n!\ninterface Vlan10\n  ipv6 address 2001:db8:1:10::1/64\n  standby version 2\n  standby 10 ipv6 2001:db8:1:10::F/64\n  standby 10 priority 110\n  standby 10 preempt\n!\nshow standby brief`,
        topo:`DIST-SW1(Active,Pri=110)──DIST-SW2(Standby,Pri=90)\nVIP VLAN10:  2001:db8:1:10::F/64\nVIP VLAN100: 2001:db8:1:100::F/64`,
        result:["HSRPv2 Active/Standby đúng","Failover < 3 giây","VIP IPv6 ping được từ clients","VLAN isolation hoạt động"],
        hints:["'standby version 2' bắt buộc cho IPv6","Preempt cần thiết để Active quay lại","MD5 auth: standby 10 authentication md5","'debug standby events' trace HSRP changes"]
      },
      { num:"1.6", name:"DHCPv6 Stateful & SLAAC", dur:"90 phút", diff:2,
        deploy:["DHCPv6 pool: address prefix 2001:db8:1:10::/64","Gán pool vào SVI: ipv6 dhcp server POOL","RA flags: managed-config-flag (M=1), other-config-flag (O=1)","DHCPv6 Relay tại distribution","SLAAC test: no ipv6 nd suppress-ra","Verify: show ipv6 dhcp binding"],
        cmds:`ipv6 dhcp pool VLAN10-POOL\n  address prefix 2001:db8:1:10::/64 lifetime 86400 3600\n  dns-server 2001:db8:1:10::53\n  domain-name lab.ngn.local\n!\ninterface Vlan10\n  ipv6 dhcp server VLAN10-POOL\n  ipv6 nd managed-config-flag\n  ipv6 nd other-config-flag\n!\nshow ipv6 dhcp pool\nshow ipv6 dhcp binding`,
        topo:`DHCPv6 Server (CORE-R1)\n       │ Relay\n  DIST-SW1 (Relay Agent)\n   │           │\nACC-SW1    ACC-SW2\n(DHCPv6    (SLAAC)`,
        result:["Clients nhận IPv6 via DHCPv6 stateful","SLAAC clients tự configure từ RA","DNS server được cấp đúng","show ipv6 dhcp binding: entries đầy đủ"],
        hints:["M-flag=1: dùng DHCPv6 cho address","O-flag=1: DHCPv6 cho DNS","Relay cần route đến DHCPv6 server","'debug ipv6 dhcp' trace messages"]
      }
    ]
  },
  {
    id:2, icon:"📡", color:"#ff6b35", dark:"#2a1000",
    title:"IPv6 MULTICAST",
    labs:"4 Labs", tags:["PIM-SM","MLDv2","Anycast RP","BSR","SSM"],
    desc:"Triển khai hạ tầng multicast IPv6 cho IPTV và video conference.",
    labList:[
      { num:"2.1", name:"MLD - Multicast Listener Discovery", dur:"90 phút", diff:2,
        deploy:["Enable: ipv6 multicast-routing trên tất cả routers","MLDv2: ipv6 mld version 2 trên interfaces","Query: ipv6 mld query-interval 60","MLD Snooping switch: ipv6 mld snooping vlan 10","Static join: ipv6 mld join-group FF1E::100","Verify: show ipv6 mld groups"],
        cmds:`ipv6 multicast-routing\n!\ninterface GigabitEthernet0/1\n  ipv6 mld join-group FF1E::100\n  ipv6 mld query-interval 60\n  ipv6 mld version 2\n!\nipv6 mld snooping\nipv6 mld snooping vlan 10\n!\nshow ipv6 mld groups\nshow ipv6 mld interface Gi0/1`,
        topo:`Router (MLD Querier)\n     │\n Switch (MLD Snooping)\n  ┌──┴──┐\nHost1  Host2\n(Join FF1E::100)`,
        result:["show ipv6 mld groups: entries hiển thị","MLD Snooping ngăn flooding","MLDv2 hỗ trợ SSM","Query/Response cycle đúng"],
        hints:["MLDv1 = IGMPv2, MLDv2 = IGMPv3 cho IPv6","Snooping ngăn multicast flood","'debug ipv6 mld' xem messages","Solicited-node: FF02::1:FF00:0/104"]
      },
      { num:"2.2", name:"PIM-SM Full Deployment", dur:"150 phút", diff:3,
        deploy:["PIM-SM: ipv6 pim sparse-mode trên tất cả interfaces","RP tĩnh: ipv6 pim rp-address 2001:db8:FFFF:1::1","BSR: ipv6 pim bsr candidate bsr priority 100","Candidate RP: ipv6 pim bsr candidate rp","SSM: ipv6 pim ssm default (FF3x::/96)","Test: source gửi stream, receivers join"],
        cmds:`ipv6 multicast-routing\nipv6 pim rp-address 2001:db8:FFFF:1::1 FF1E::/16\n!\ninterface GigabitEthernet0/0\n  ipv6 pim sparse-mode\n!\nipv6 pim bsr candidate bsr 2001:db8:FFFF:2::1 priority 100\nipv6 pim ssm default\n!\nshow ipv6 pim neighbor\nshow ipv6 pim rp mapping\nshow ipv6 mroute`,
        topo:`Source─→CORE-R1(RP)\n              │  CORE-R2(BSR)\n       ┌──────┴──────┐\n  DIST-SW1       DIST-SW2\nGroup: FF1E::STREAM`,
        result:["PIM neighbors established","RP election thành công","show ipv6 mroute: (*,G) và (S,G)","SPT switchover hoạt động"],
        hints:["PIM sparse-mode cần RP","BSR tự động distribute RP info","SSM không cần RP","'debug ipv6 pim' trace join/prune"]
      },
      { num:"2.3", name:"Anycast RP Redundancy", dur:"120 phút", diff:3,
        deploy:["Tạo Lo100 với cùng anycast addr trên R1 và R2","ipv6 pim anycast-rp ANYCAST peer1 peer2","Distribute anycast prefix vào OSPFv3","Test: shutdown RP1, kiểm tra switchover"],
        cmds:`interface Loopback100\n  ipv6 address 2001:db8:FF:RP::1/128\n!\nipv6 pim anycast-rp 2001:db8:FF:RP::1 2001:db8:FFFF:1::1\nipv6 pim anycast-rp 2001:db8:FF:RP::1 2001:db8:FFFF:2::1\n!\nshow ipv6 pim rp mapping\nshow ipv6 mroute`,
        topo:`CORE-R1(Lo100: 2001:db8:FF:RP::1)\nCORE-R2(Lo100: 2001:db8:FF:RP::1)\n← same anycast address\nFailover: tự động khi RP1 down`,
        result:["Redundancy RP hoạt động","Failover < 5 giây","Stream không bị interrupt","Load sharing theo topology"],
        hints:["Anycast = nhiều RP cùng 1 địa chỉ","IPv6 Anycast RP không cần MSDP","Verify: ping anycast từ nhiều điểm","traceroute xem path đến RP"]
      },
      { num:"2.4", name:"Multicast + QoS Integration", dur:"90 phút", diff:3,
        deploy:["Class-map: match protocol rtp video","Set DSCP AF41 cho video multicast","CBWFQ: bandwidth percent 25 cho VIDEO","WRED: random-detect dscp af41 30 50 10","CME MoH: multicast moh 239.0.0.1","Đo: show policy-map interface"],
        cmds:`class-map match-any VIDEO-MULTICAST\n  match dscp af41\n!\npolicy-map CORE-QUEUING\n  class VIDEO-MULTICAST\n    bandwidth percent 25\n    random-detect dscp-based\n  class VOIP-RTP\n    priority percent 15\n!\ntelephony-service\n  moh flash:/moh.wav\n  multicast moh 239.0.0.1 port 16384`,
        topo:`VideoServer─[AF41]─→Core─[CBWFQ 25%]─→Receivers\nMoH─[239.0.0.1]─→CME─→Phones on hold\nDSCP: Video=AF41, Voice=EF, Data=AF31`,
        result:["Video DSCP AF41 end-to-end","WRED giảm congestion","MoH phát khi call bị hold","Jitter video < 30ms"],
        hints:["WRED drop sớm trước khi queue đầy","AF41 > AF31 > AF11 > BE","Kiểm tra MoH: gọi rồi hold","show queue Gi0/0 xem queue status"]
      }
    ]
  },
  {
    id:3, icon:"⚡", color:"#f59e0b", dark:"#1f1200",
    title:"QUALITY OF SERVICE (QoS)",
    labs:"5 Labs", tags:["DSCP","CBWFQ","LLQ","Shaping","WRED"],
    desc:"Đảm bảo chất lượng dịch vụ end-to-end cho VoIP, Video và dữ liệu.",
    labList:[
      { num:"3.1", name:"DSCP Marking & Classification", dur:"100 phút", diff:2,
        deploy:["Class-map VoIP: match dscp ef + rtp audio","Class-map Video: match dscp af41 + rtp video","IPv6 ACL: permit tcp src dst eq 1433","Policy-map MARK-IN: set dscp ef/af41","Apply input: service-policy input MARK-DSCP-IN"],
        cmds:`class-map match-any VOIP-RTP\n  match protocol rtp audio\n  match dscp ef\n!\nipv6 access-list CRITICAL-APPS\n  permit tcp 2001:db8:1::/48 any eq 1433\n!\npolicy-map MARK-DSCP-IN\n  class VOIP-RTP\n    set dscp ef\n  class class-default\n    set dscp default\n!\ninterface GigabitEthernet0/0\n  service-policy input MARK-DSCP-IN`,
        topo:`[Untrusted]→[Marking at Edge]→[Trusted Core]\nVoIP RTP   → DSCP EF  (46)\nVideo Conf → DSCP AF41(34)\nBusiness   → DSCP AF31(26)\nInternet   → DSCP BE  (0)`,
        result:["Traffic mark đúng DSCP","Counters tăng theo class","DSCP trust từ IP Phone","Re-marking tại untrusted ports"],
        hints:["DSCP trong IPv6 Traffic Class byte","match-any = OR, match-all = AND","Wireshark: ipv6 && ip.dsfield","show class-map xem config"]
      },
      { num:"3.2", name:"LLQ & CBWFQ Queuing", dur:"120 phút", diff:3,
        deploy:["LLQ VoIP: priority percent 15","Police LLQ: conform transmit, exceed drop","CBWFQ Video: bandwidth percent 25 + WRED","CBWFQ Business: bandwidth percent 30","Scavenger: bandwidth percent 5","Apply output: service-policy output WAN-QUEUING"],
        cmds:`policy-map WAN-QUEUING-OUT\n  class VOIP-RTP\n    priority percent 15\n    police rate percent 15\n      conform-action transmit\n      exceed-action drop\n  class VIDEO-CONF\n    bandwidth percent 25\n    random-detect dscp-based\n  class class-default\n    bandwidth percent 25\n    fair-queue\n!\nshow policy-map interface Gi0/0 output`,
        topo:`WAN Egress Interface\n├─LLQ 15%──VoIP EF (strict)\n├─CBWFQ 25%─Video AF41 (WRED)\n├─CBWFQ 30%─Business AF31\n├─CBWFQ 5%──Scavenger CS1\n└─Default 25%─Best Effort`,
        result:["VoIP phục vụ trước tiên","Video không drop normal load","Scavenger < 3% bandwidth","Queue depth và drops OK"],
        hints:["LLQ priority percent = max BW","Priority > 15% sẽ starve data","WRED tốt hơn tail-drop cho TCP","show interface Gi0/0 xem drops"]
      },
      { num:"3.3", name:"Traffic Shaping & Policing", dur:"100 phút", diff:2,
        deploy:["Shaping: shape average 100000000 (100Mbps)","Nested policy: shape → service-policy queuing","Policing inbound: police rate 150Mbps","Test với iperf3 -6 -b 200M"],
        cmds:`policy-map WAN-SHAPE\n  class class-default\n    shape average 100000000\n    service-policy WAN-QUEUING-OUT\n!\npolicy-map POLICE-INBOUND\n  class class-default\n    police rate 150000000\n      conform-action transmit\n      exceed-action drop\n!\niperf3 -c 2001:db8:1:10::100 -6 -b 200M -t 30`,
        topo:`Physical: 1Gbps Link\n→ Shape output: 100Mbps\n  → Nested QoS: LLQ+CBWFQ\nInbound:\n→ Police: 150Mbps\n  → conform: transmit\n  → exceed: drop`,
        result:["Output không vượt 100Mbps","show traffic-shape: Active","Inbound policed 150Mbps","iperf3 xác nhận limit"],
        hints:["Shaping = buffer, Policing = drop","Bc = committed burst, Be = excess","show traffic-shape queue","Nested: shape phải outermost"]
      },
      { num:"3.4", name:"QoS Trust Boundary", dur:"90 phút", diff:2,
        deploy:["IP Phone port: mls qos trust dscp","Data port: không trust, re-mark về BE","Auto QoS: auto qos voip cisco-phone","DSCP-to-CoS mapping","Verify chain phone→access→WAN"],
        cmds:`mls qos\n!\ninterface GigabitEthernet0/1\n  description IP-PHONE-PORT\n  mls qos trust dscp\n  switchport voice vlan 100\n  spanning-tree portfast\n!\nmls qos map dscp-to-cos 46 to 5\nmls qos map dscp-to-cos 34 to 4\n!\nshow mls qos interface Gi0/1`,
        topo:`Trust Boundary at Access Switch:\nIP Phone→[DSCP EF trusted]→Access→WAN\nPC──────→[CoS 0→DSCP BE]──→Access\n\nTrust: IP Phone DSCP preserved\nUntrust: PC re-marked to BE`,
        result:["VoIP DSCP EF preserved E2E","PC re-marked về BE","No DSCP từ end users","QoS consistent E2E"],
        hints:["Trust boundary ngăn users set DSCP cao","'auto qos voip' tự tạo policy","CoS = Layer 2, DSCP = Layer 3","show mls qos interface statistics"]
      },
      { num:"3.5", name:"QoS Verification & Tuning", dur:"90 phút", diff:2,
        deploy:["Baseline: show policy-map interface","Simulate congestion: iperf3 fill 95%","IP SLA VoIP: udp-jitter target 16384","WRED tuning: adjust thresholds","Report: jitter, latency, loss per class"],
        cmds:`ip sla 1\n  udp-jitter 2001:db8:5:1::1 16384 codec g711ulaw\n  frequency 60\nip sla schedule 1 life forever start-time now\n!\nshow ip sla statistics 1\n!\n! iperf3 load test\niperf3 -c TARGET -6 -b 950M -t 60\n!\nrandom-detect dscp af41 25 45 8`,
        topo:`[IP SLA Probes] → all critical paths\n[iperf3] → 95% load test\nTargets:\n  VoIP: Jitter<10ms, Loss=0%\n  Video: Jitter<30ms, Loss<0.1%`,
        result:["IP SLA report jitter/loss","WRED giảm drops proactively","QoS OK dưới 95% load","Baseline vs loaded report"],
        hints:["IP SLA cần: ip sla responder","MOS target ≥ 4.0","show ip sla statistics sau 5 phút","Lower WRED threshold = earlier drops"]
      }
    ]
  },
  {
    id:4, icon:"📞", color:"#7c3aed", dark:"#12004a",
    title:"VoIP - CISCO CME",
    labs:"4 Labs", tags:["SCCP","SIP","Dial-Plan","Conference","MoH"],
    desc:"Triển khai tổng đài IP nội bộ Cisco CME với đầy đủ tính năng enterprise.",
    labList:[
      { num:"4.1", name:"CME Setup & Phone Registration", dur:"120 phút", diff:2,
        deploy:["DHCP pool: option 150 ip CME-IP (TFTP)","telephony-service: max-ephones 50, max-dn 100","ip source-address CME-IP port 2000","ephone-dn: number 1001, call-forward","ephone: mac-address, type 7962, button 1:1","create cnf-files → phone download config"],
        cmds:`ip dhcp pool VOICE-POOL\n  network 192.168.100.0 255.255.255.0\n  default-router 192.168.100.1\n  option 150 ip 192.168.100.1\n!\ntelephony-service\n  max-ephones 50\n  max-dn 100\n  ip source-address 192.168.100.1 port 2000\n  create cnf-files version-stamp\n!\nephone-dn 1 dual-line\n  number 1001\n  name Alice Nguyen\n!\nephone 1\n  mac-address 0011.2233.4401\n  type 7962\n  button 1:1\n!\nshow ephone registered`,
        topo:`IP Phone→[DHCP opt150]→CME-GW\n         →[TFTP SEP*.cnf]\n         →[SCCP TCP:2000 Register]\nExt: 1001-1050\nCME: Cisco ISR 2911, IOS 15.x`,
        result:["Phones hiển thị Registered","show ephone registered OK","Gọi nội bộ 1001→1002 OK","Display name, time đúng"],
        hints:["option 150 = TFTP server IP","'create cnf-files' sau thay đổi","Type 7962 = Cisco IP Phone 7962G","Kiểm tra VLAN, DHCP, TFTP"]
      },
      { num:"4.2", name:"Dial Plan & PSTN Integration", dur:"120 phút", diff:3,
        deploy:["Internal dial peer: dest 1..., session 127.0.0.1","PSTN FXO: dest 0[2-9]........, port 0/0/0","SIP trunk FreePBX: dest 2..., session FreePBX-IP","Emergency: 113/114/115 → FXO direct","Codec: g711u/g711a/g729"],
        cmds:`dial-peer voice 1 voip\n  destination-pattern 1...\n  session protocol sipv2\n  session target ipv4:127.0.0.1\n  codec g711ulaw\n!\ndial-peer voice 100 pots\n  destination-pattern 0[2-9]........\n  port 0/0/0\n  forward-digits all\n!\ndial-peer voice 200 voip\n  destination-pattern 2...\n  session protocol sipv2\n  session target ipv4:192.168.5.2\n  codec g729r8\n  dtmf-relay rtp-nte\n  no vad\n!\nshow dial-peer voice summary`,
        topo:`1XXX → CME Internal\n0[2-9]XXXXXXXX → FXO → PSTN\n2XXX → SIP Trunk → FreePBX\n113/114/115 → Emergency FXO\n6000 → Conference\n5000 → Voicemail`,
        result:["Dial plan hoàn chỉnh","PSTN outbound OK","CME↔FreePBX calls OK","Emergency không bị restrict"],
        hints:["'T' = thêm digits, '.' = bất kỳ digit","'no vad' tắt VAD","DTMF relay rtp-nte cần khớp","'debug voip dialpeer' trace matching"]
      },
      { num:"4.3", name:"Advanced Features", dur:"120 phút", diff:3,
        deploy:["DSPfarm: dspfarm profile 1 conference, max 4","SCCP: sccp local Gi0/0, sccp ccm local","Conference DN: ephone-dn 60, number 6000","MoH: moh flash:/moh.wav, multicast 239.0.0.1","Call Park: ephone-dn 70, park-slot timeout 60","Call Pickup: pickup-group 1"],
        cmds:`dspfarm profile 1 conference\n  codec g711ulaw\n  maximum sessions 4\n  associate application SCCP\n  no shutdown\n!\nsccp local GigabitEthernet0/0\nsccp ccm 192.168.100.1 identifier 1\nsccp\n!\nephone-dn 60\n  number 6000\n  conference meetme\n!\ntelephony-service\n  moh flash:/moh.wav\n  multicast moh 239.0.0.1 port 16384\n!\nshow dspfarm profile`,
        topo:`CME Features:\n─Conference: DN 6000 (4-party)\n─Call Park: DN 7001-7010 (60s)\n─MoH: 239.0.0.1:16384\n─Pickup Group: 1 (1001-1005)\n─Voicemail: 5000`,
        result:["3/4-party conference OK","MoH phát khi hold","Park & Retrieve OK","Pickup group đúng"],
        hints:["DSPfarm cần PVDM2 module","MoH file: mono 8kHz G.711 WAV","show ephone-dn summary","Park: nhấn Park → dial 7001 retrieve"]
      },
      { num:"4.4", name:"CME + QoS End-to-End", dur:"90 phút", diff:3,
        deploy:["Verify DSCP EF phone → access → core","Jitter buffer: playout-delay adaptive nominal 60","voice service voip → ip address trusted","IP SLA: udp-jitter CME port 16384","Wireshark RTP stream, MOS analysis"],
        cmds:`voice service voip\n  ip address trusted list\n    ipv4 192.168.100.0 255.255.255.0\n    ipv6 2001:db8:5::/48\n!\ndial-peer voice 200 voip\n  playout-delay mode adaptive\n  playout-delay nominal 60\n  playout-delay maximum 200\n!\nip sla 10\n  udp-jitter 192.168.100.1 16384 codec g711ulaw\n  frequency 30\nip sla schedule 10 life forever start-time now\n!\nshow ip sla statistics 10`,
        topo:`CME QoS Path:\nPhone→[EF]→AccessSW→[LLQ]→DistSW\n→[CBWFQ]→Core→[Priority]→CME\nJitter Buffer: adaptive 60-200ms\nTarget: MOS≥4.0, Jitter<10ms`,
        result:["MOS ≥ 4.0 từ IP SLA","Jitter < 10ms E2E","Zero packet loss VoIP","G.711/G.729 negotiation OK"],
        hints:["Adaptive jitter buffer tự điều chỉnh","G.711 = 64kbps, MOS cao hơn G.729","show voice call active real-time","Wireshark: Telephony→RTP→Stream Analysis"]
      }
    ]
  },
  {
    id:5, icon:"🐧", color:"#10b981", dark:"#002218",
    title:"VoIP - FreePBX",
    labs:"3 Labs", tags:["Install","PJSIP","IVR","CDR","Trunk"],
    desc:"Cài đặt FreePBX/Asterisk trên Linux, tích hợp với Cisco CME.",
    labList:[
      { num:"5.1", name:"FreePBX Installation & IPv6", dur:"150 phút", diff:2,
        deploy:["Ubuntu 22.04 VM: 4GB RAM, 2vCPU, 60GB","Netplan: dual-stack IPv4 + IPv6","Download & run: ./sng_freepbx_debian_install.sh","PJSIP IPv6: transport-udp6 bind=[::]:5060","Truy cập GUI: http://192.168.5.2/admin","fwconsole start → Apply Config"],
        cmds:`# /etc/netplan/00-installer-config.yaml\nnetwork:\n  version: 2\n  ethernets:\n    ens3:\n      addresses:\n        - 192.168.5.2/24\n        - 2001:db8:5:2::2/64\n\nsudo netplan apply\n\n# /etc/asterisk/pjsip.conf\n[transport-udp6]\ntype=transport\nprotocol=udp\nbind=[::]:5060\n\nsudo asterisk -rvvv\nCLI> pjsip show transports`,
        topo:`Ubuntu 22.04 VM (EVE-NG QEMU)\nIPv4: 192.168.5.2/24\nIPv6: 2001:db8:5:2::2/64\nAsterisk 21 + FreePBX 17\nSIP: UDP:5060, TLS:5061\nRTP: 10000-20000/udp`,
        result:["FreePBX Web GUI accessible","fwconsole status: all green","PJSIP transports IPv4+IPv6","Firewall allow SIP/RTP"],
        hints:["Install mất 20-30 phút, cần internet","fwconsole ma upgradeall update modules","ufw allow 5060/udp","tail -f /var/log/asterisk/full"]
      },
      { num:"5.2", name:"Extensions, Trunks & IVR", dur:"120 phút", diff:2,
        deploy:["Extensions: Add pjSIP 2001-2010","SIP Trunk: Connectivity→Trunks→PJSIP trunk","Outbound Route: TO-CME, pattern 1XXX","Inbound Route: FROM-CME → IVR","IVR: Applications→IVR, record greeting","Ring Groups: sales (2001-2003), support (2004-2006)"],
        cmds:`sudo asterisk -rvvv\n\nCLI> pjsip show registrations\nCLI> pjsip show endpoints\nCLI> pjsip set logger on\n\n# Test call\nCLI> channel originate PJSIP/2001 extension 1001@from-internal\n\nCLI> dialplan show from-internal`,
        topo:`FreePBX Dialplan:\nInbound→IVR 9000\n  1→Ring Group: Sales (2001-2003)\n  2→Ring Group: Support (2004-2005)\n  0→Ext 2000 (Operator)\nOutbound:\n  1XXX→CME-Trunk\n  0.  →CME-Trunk→PSTN`,
        result:["Extensions register từ Zoiper","SIP trunk CME↔FreePBX UP","IVR routing đúng","Cross-system calls OK"],
        hints:["Softphone: Zoiper Free hoặc Linphone","pjsip show endpoints: Online","pjsip set logger on: SIP INVITE","IVR: upload WAV mono 8kHz G.711"]
      },
      { num:"5.3", name:"CDR, Recording & Monitoring", dur:"90 phút", diff:2,
        deploy:["Call Recording: Module Admin→CallRecording","CDR MySQL: /etc/asterisk/cdr_mysql.conf","CDR Reports: Admin→CDR Reports","Fail2ban: bảo vệ SIP brute-force","CSV export: CDR Reports→Download"],
        cmds:`# /etc/asterisk/cdr_mysql.conf\n[global]\nhostname=localhost\ndbname=asteriskcdrdb\ntable=cdr\npassword=secret\nuser=asterisk\n\nmysql -u asterisk -p asteriskcdrdb\nSELECT src,dst,disposition,duration\nFROM cdr ORDER BY calldate DESC LIMIT 20;\n\nsudo fail2ban-client status asterisk\nls /var/spool/asterisk/monitor/`,
        topo:`FreePBX Stack:\n├─CDR→MySQL(asteriskcdrdb)\n├─Recordings→/var/spool/asterisk/monitor/\n├─Logs→/var/log/asterisk/full\n├─Fail2ban→blocks brute-force\n└─Dashboard→Admin→System Status`,
        result:["CDR lưu vào MySQL","Recordings download từ GUI","Dashboard active calls","Fail2ban block sau 3 fail"],
        hints:["CDR lưu sau call kết thúc","Recording: wav49 nén hơn wav","Fail2ban: /var/log/fail2ban.log","fwconsole reload sau thay đổi"]
      }
    ]
  },
  {
    id:6, icon:"🌐", color:"#a855f7", dark:"#150025",
    title:"TÍCH HỢP TỔNG HỢP",
    labs:"3 Labs", tags:["Full NGN","Security","Monitoring","Integration"],
    desc:"Kết hợp tất cả thành phần thành hệ thống NGN hoàn chỉnh.",
    labList:[
      { num:"6.1", name:"Full System Integration", dur:"240 phút", diff:4,
        deploy:["Deploy theo thứ tự: L2→OSPFv3→BGP→Multicast→QoS","CME: register phones, test dial plan","FreePBX: extensions, SIP trunk CME","Cross-system: 1001 gọi 2001 (CME↔FreePBX)","E2E QoS: DSCP EF phone đến phone","Multicast: stream đến VLAN10,20"],
        cmds:`! Verification Checklist\nshow ipv6 ospf neighbor\nshow bgp ipv6 unicast summary\nshow standby brief\nshow ipv6 pim neighbor\nshow ipv6 mroute\nshow policy-map interface Gi0/0\nshow ipv6 dhcp binding\nshow ephone registered\nasterisk -rx 'pjsip show endpoints'\nshow sip-ua status registrar\niperf3 -c TARGET -6 -b 800M -t 30 -P 4`,
        topo:`FULL NGN:\nISP-A/B─eBGP─EDGE-R1/R2(AS65001)\n─iBGP─OSPFv3─CORE-R1/R2(RP,BSR)\n─HSRPv2─DIST-SW1/SW2\n─VLANs─ACC-SW1/SW2/SW3\n─CME(1XXX)─SIPTrunk─FreePBX(2XXX)`,
        result:["Tất cả checklist items PASS","Cross-system calls OK","Video stream đến all clients","QoS metrics trong ngưỡng"],
        hints:["Deploy từng layer, verify trước","show tech-support lưu state","EVE-NG packet capture debug","Document IP scheme trước deploy"]
      },
      { num:"6.2", name:"Security Hardening", dur:"150 phút", diff:3,
        deploy:["RA Guard: policy BLOCK-RA, apply access ports","DHCPv6 Snooping: vlan 10,20,100, trust uplink","IPv6 Source Guard: access ports","uRPF strict: ipv6 verify unicast","VoIP trusted list + SIP auth","Pentest: Scapy IPv6 RA flood"],
        cmds:`ipv6 nd raguard policy BLOCK-RA\n  device-role host\ninterface range Gi0/1-24\n  ipv6 nd raguard attach-policy BLOCK-RA\n!\nipv6 dhcp snooping\nipv6 dhcp snooping vlan 10,20,100\ninterface GigabitEthernet0/25\n  ipv6 dhcp snooping trust\n!\nshow ipv6 nd raguard policy`,
        topo:`Security Layers:\n[uRPF+BGP Filter]──────EDGE\n[OSPFv3 IPsec Auth]────CORE\n[RA Guard+DHCPv6 Snoop]DIST\n[Src Guard+Port Sec]───ACCESS\n[SIP Auth+Trusted List]VoIP`,
        result:["Rogue RA bị chặn 100%","DHCPv6 spoofing thất bại","uRPF drop spoofed packets","VoIP toll fraud prevented"],
        hints:["Test: Scapy 'sendp(IPv6/ICMPv6ND_RA())'","uRPF strict cần symmetric routing","show ipv6 dhcp snooping statistics","Fail2ban auto-block sau 3 fail"]
      },
      { num:"6.3", name:"Monitoring & Management", dur:"120 phút", diff:2,
        deploy:["SNMPv3: group NGN-ADMIN v3 priv, sha+aes256","Syslog: logging 2001:db8:1:999::30","NetFlow v9: export destination","IP SLA: udp-jitter VoIP quality probes","Cài Zabbix/Grafana trên mgmt server","Dashboard: BGP, OSPF, VoIP, alerts"],
        cmds:`snmp-server group NGN-ADMIN v3 priv\nsnmp-server user admin NGN-ADMIN v3\n  auth sha AuthPass123\n  priv aes 256 PrivPass456\nsnmp-server host 2001:db8:1:999::10 version 3 priv admin\n!\nlogging 2001:db8:1:999::30\nlogging trap informational\n!\nip flow-export version 9\nip flow-export destination 2001:db8:1:999::20 9995\n!\nshow snmp\nshow logging`,
        topo:`Management VLAN999 (2001:db8:1:999::/64):\n├─NMS Zabbix: ::10\n├─Syslog: ::30\n├─NetFlow: ::20\n└─TFTP: ::40\nAll devices → SNMPv3/Syslog/NetFlow`,
        result:["SNMP polls thành công","Syslog tập trung OK","NetFlow dashboard traffic","Alerts khi BGP/interface down"],
        hints:["SNMPv3 priv mã hóa","Syslog: 0=emerg, 7=debug","NetFlow v9 hỗ trợ IPv6","Zabbix template: Cisco IOS SNMPv3"]
      }
    ]
  }
];

const NGN_THESIS = [
  { id:1, icon:"🏢", color:"#00d4ff", level:"medium", dur:"6-8 tuần", team:"2-5 SV",
    title:"Mạng LAN Doanh Nghiệp Nhỏ IPv6 Dual-Stack",
    overview:"Thiết kế mạng LAN 50-100 nhân viên với IPv6 dual-stack, OSPFv3, HSRP và VoIP cơ bản.",
    scope:["IPv6 dual-stack cho 3 VLAN","OSPFv3 single-area + HSRP","Cisco CME 20 IP phones","QoS 3 lớp: Voice/Video/Data","DHCPv6 và SLAAC"],
    topo:"ISP─BGP─EDGE-R1\n─OSPFv3─CORE-SW\n─VLAN10/20/100─ACCESS\n─CME(20 phones)",
    deploy:["Tuần 1-2: Thiết kế addressing, VLAN","Tuần 3-4: OSPFv3, HSRP, DHCPv6","Tuần 5-6: CME, QoS, testing","Tuần 7-8: Security, documentation"],
    result:["IPv6 E2E connectivity","VoIP MOS ≥ 3.8","HSRP failover < 5s","Dual-stack hoạt động"],
    tech:["Cisco IOL","OSPFv3","HSRPv2","CME","DHCPv6","QoS"]
  },
  { id:2, icon:"🎓", color:"#f59e0b", level:"medium", dur:"6-8 tuần", team:"2-5 SV",
    title:"Hệ Thống VoIP FreePBX cho Giáo Dục",
    overview:"FreePBX cho trường học với IVR tự động, call recording cho giảng dạy và voicemail-to-email.",
    scope:["50 extensions giảng viên + nhân viên","IVR: Tuyển sinh, Đào tạo, Hành chính","Call Recording cho hội thảo","Ring Groups theo phòng ban","Voicemail-to-Email"],
    topo:"FreePBX Server\n├─Ext 1XXX: Giảng viên\n├─Ext 2XXX: VP/Phòng ban\n├─IVR 9000: Auto Attendant\n└─SIP Trunk: PSTN",
    deploy:["Tuần 1-2: Cài FreePBX, ext plan","Tuần 3-4: IVR, Ring Groups","Tuần 5-6: Recording, Reporting","Tuần 7-8: Testing, docs"],
    result:["50 extensions ổn định","IVR routing 95%+","Recordings phục vụ đào tạo","CDR báo cáo chi phí"],
    tech:["FreePBX","Asterisk","PJSIP","IVR","CDR","Voicemail"]
  },
  { id:3, icon:"🔐", color:"#10b981", level:"medium", dur:"6-8 tuần", team:"2-5 SV",
    title:"Bảo Mật IPv6 First-Hop & Layer 2",
    overview:"Phân tích tấn công RA flood, DHCPv6 spoofing và triển khai giải pháp phòng thủ.",
    scope:["Tấn công: RA flood, DHCPv6 rouge","RA Guard, DHCPv6 Snooping","IPv6 Source Guard, DAD Proxy","So sánh trước/sau bảo mật","Vulnerability assessment"],
    topo:"Attack Lab:\n[Attacker]─[Access SW]─[Victim]\nDefense:\n[RA Guard + DHCPv6 Snoop + uRPF]",
    deploy:["Tuần 1-2: Lab setup, nghiên cứu","Tuần 3-4: Thực hiện tấn công","Tuần 5-6: Deploy defenses","Tuần 7-8: Đánh giá, báo cáo"],
    result:["RA flood thành công lab","RA Guard chặn 100%","DHCPv6 Snooping OK","Report với recommendations"],
    tech:["Scapy","THC-IPv6","RA Guard","DHCPv6 Snooping","uRPF","Wireshark"]
  },
  { id:4, icon:"🏆", color:"#ff6b35", level:"hard", dur:"8-10 tuần", team:"3-5 SV",
    title:"NGN Doanh Nghiệp Toàn Diện IPv6",
    overview:"Hệ thống NGN hoàn chỉnh 100-500 nhân viên, 3 chi nhánh, dual ISP, Multicast, QoS, CME+FreePBX.",
    scope:["3 chi nhánh WAN IPv6","OSPFv3 multi-area, BGP multi-homing","PIM-SM Multicast video","QoS 6 lớp E2E","CME 50 + FreePBX 30","Security + Monitoring"],
    topo:"HQ─BGP─ISP-A/B\n─OSPFv3─BRANCH1/2\nCME(50)+FreePBX(30)\nMulticast + QoS 6 classes",
    deploy:["Phase1(T1-2): Design","Phase2(T3-4): OSPFv3+BGP","Phase3(T5-6): QoS+Multicast","Phase4(T7-8): CME+FreePBX","Phase5(T9-10): Security+Monitor"],
    result:["BGP failover < 30s","VoIP MOS ≥ 4.0","Video multicast OK","Zero critical vulns"],
    tech:["OSPFv3","MP-BGP","HSRPv2","CME","FreePBX","PIM-SM","LLQ","uRPF"]
  },
  { id:5, icon:"🤖", color:"#a855f7", level:"hard", dur:"10-12 tuần", team:"3-5 SV",
    title:"SDN IPv6 NGN: ONOS & QoS Automation",
    overview:"ONOS SDN controller với NGN/IPv6, tự động hóa QoS policy qua REST API.",
    scope:["ONOS quản lý OpenFlow switches","IPv6 forwarding SDN","QoS automation REST API","So sánh SDN vs Traditional","Performance benchmark"],
    topo:"ONOS Controller\n─OpenFlow─OVS Switches\n─REST API─Apps\nIPv6: OVS1─OVS2─OVS3",
    deploy:["T1-2: ONOS, OpenFlow","T3-4: IPv6 forwarding","T5-6: QoS REST API","T7-8: VoIP/Video","T9-10: Benchmark","T11-12: Report"],
    result:["ONOS IPv6 OK","Auto QoS policy","REST API < 100ms","SDN vs Traditional report"],
    tech:["ONOS","OpenFlow","OVS","REST API","Python","IPv6","QoS"]
  }
];

// ============================================================
// SDN DATA (Chuyên Đề MMT 1)
// ============================================================
const SDN_CHAPTERS = [
  {
    id:1, icon:"🧠", color:"#38bdf8", title:"TỔNG QUAN SDN",
    desc:"Kiến trúc, mô hình và giao thức điều khiển trong Software-Defined Networking.",
    theory:[
      { title:"1.1 Tổng quan về SDN", content:`Software-Defined Networking (SDN) là kiến trúc mạng tách biệt control plane khỏi data plane.

Đặc điểm chính:
• Centralized Control: Bộ điều khiển tập trung quản lý toàn bộ mạng
• Programmability: Lập trình mạng qua API (REST, gRPC)
• Open Standards: OpenFlow, NETCONF, RESTCONF
• Abstraction: Tách biệt hardware và software

Mô hình 3 tầng SDN:
┌─────────────────────────────┐
│  Application Layer (Apps)   │ ← Business Logic
├─────────────────────────────┤
│  Control Layer (Controller) │ ← Cisco APIC-EM, ONOS, ODL
├─────────────────────────────┤
│  Infrastructure Layer       │ ← Switches, Routers (Data Plane)
└─────────────────────────────┘

Northbound API: Controller ↔ Applications (REST/JSON)
Southbound API: Controller ↔ Devices (OpenFlow, NETCONF)` },
      { title:"1.2 Cisco APIC-EM", content:`Cisco Application Policy Infrastructure Controller Enterprise Module

Chức năng:
• Network Discovery: Tự động khám phá thiết bị qua SNMP/CDP
• Path Trace: Phân tích đường truyền giữa 2 điểm
• ACL Analysis: Kiểm tra và debug ACLs
• EasyQoS: Tự động cấu hình QoS
• Topology Viewer: Bản đồ mạng visual

REST API APIC-EM:
Base URL: https://sandboxapicem.cisco.com
Auth: POST /api/v1/ticket → ServiceTicket
Headers: X-Auth-Token: <ticket>

Workflow:
1. Lấy Service Ticket (auth)
2. GET /api/v1/network-device → device list  
3. GET /api/v1/topology/physical-topology → topology
4. POST /api/v1/flow-analysis → path trace` },
      { title:"1.3 Mininet", content:`Mininet: Network Emulator cho SDN Research

Cài đặt:
sudo apt-get install mininet
sudo mn --test pingall

Tạo topology:
from mininet.net import Mininet
from mininet.topo import Topo

class MyTopo(Topo):
    def build(self):
        s1 = self.addSwitch('s1')
        h1 = self.addHost('h1')
        h2 = self.addHost('h2')
        self.addLink(h1, s1)
        self.addLink(h2, s1)

net = Mininet(topo=MyTopo())
net.start()
net.pingAll()
net.stop()

Kết nối với OpenFlow controller:
sudo mn --controller=remote,ip=127.0.0.1,port=6633 --topo=tree,2` },
      { title:"1.4 Giao thức OpenFlow", content:`OpenFlow: Southbound Protocol SDN

Phiên bản: 1.0, 1.3 (phổ biến nhất)

Flow Table Entry:
┌──────────┬──────────┬──────────────┐
│ Match    │ Priority │ Instructions │
│ Fields   │          │ (Actions)    │
├──────────┼──────────┼──────────────┤
│ in_port  │  65535   │ output:port  │
│ eth_dst  │          │ drop         │
│ ip_src   │          │ goto_table   │
│ tcp_dst  │          │ send_controller│
└──────────┴──────────┴──────────────┘

OpenFlow Messages:
• Hello: Thiết lập kết nối
• Features Request/Reply: Lấy thông tin switch
• Packet-In: Switch gửi packet lên controller
• Flow-Mod: Controller cài flow rules
• Stats Request/Reply: Lấy thống kê

Controller-Switch Communication:
TCP Port: 6633 (OF 1.0), 6653 (OF 1.3)` }
    ],
    labs:[
      { num:"L1.1", name:"Cài đặt Mininet & Khám phá", dur:"90 phút", diff:1,
        steps:["sudo apt-get update && apt-get install mininet","sudo mn --test pingall","sudo mn --topo linear,3 --mac","h1 ping h2 -c 3","dpctl dump-flows","Vẽ topology trên giấy"],
        code:`# Tạo simple topology
sudo mn --topo single,3

# Trong Mininet CLI:
mininet> nodes
mininet> links
mininet> h1 ping h2
mininet> pingall
mininet> iperf h1 h2
mininet> h1 ifconfig
mininet> sh ovs-ofctl dump-flows s1`,
        result:["Mininet chạy thành công","pingall: 100% packets received","Flow table hiển thị entries","Topology được vẽ đúng"]
      },
      { num:"L1.2", name:"OpenFlow Controller với Ryu", dur:"120 phút", diff:2,
        steps:["pip install ryu","Viết SimpleSwitch controller","ryu-manager simple_switch.py","Kết nối Mininet với Ryu","Test packet forwarding","Kiểm tra flow tables"],
        code:`# simple_switch.py
from ryu.base import app_manager
from ryu.controller import ofp_event
from ryu.controller.handler import MAIN_DISPATCHER
from ryu.controller.handler import set_ev_cls
from ryu.ofproto import ofproto_v1_0

class SimpleSwitch(app_manager.RyuApp):
    OFP_VERSIONS = [ofproto_v1_0.OFP_VERSION]
    
    def __init__(self, *args, **kwargs):
        super(SimpleSwitch, self).__init__(*args, **kwargs)
        self.mac_to_port = {}
    
    @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
    def packet_in_handler(self, ev):
        msg = ev.msg
        dp = msg.datapath
        ofp = dp.ofproto
        ofp_parser = dp.ofproto_parser
        in_port = msg.in_port
        # Learn MAC
        # Forward or flood
        ...

# Chạy:
# Terminal 1: ryu-manager simple_switch.py
# Terminal 2: sudo mn --controller=remote,ip=127.0.0.1`,
        result:["Ryu controller chạy","Mininet kết nối controller","Ping thành công qua SDN","Flow rules được cài tự động"]
      }
    ]
  },
  {
    id:2, icon:"🐍", color:"#4ade80", title:"PYTHON & JSON CHO MẠNG",
    desc:"Lập trình Python, xử lý JSON và sử dụng REST API để quản lý thiết bị mạng.",
    theory:[
      { title:"2.1 Python cơ bản cho Network", content:`Python Network Programming Basics

Data Types:
• str: "192.168.1.1", "GigabitEthernet0/0"
• list: [device1, device2, device3]
• dict: {"ip": "10.0.0.1", "type": "router"}
• tuple: (hostname, ip, port)

Cấu trúc điều khiển:
devices = ["R1", "R2", "SW1"]
for device in devices:
    if device.startswith("R"):
        print(f"Router: {device}")
    else:
        print(f"Switch: {device}")

Functions:
def get_device_info(hostname, ip):
    return {
        "hostname": hostname,
        "ip": ip,
        "reachable": ping_test(ip)
    }

File I/O:
import json
with open("topology.json", "r") as f:
    data = json.load(f)

with open("output.json", "w") as f:
    json.dump(data, f, indent=2)` },
      { title:"2.2 JSON & REST API", content:`JSON Format & REST API Usage

JSON Structure:
{
  "devices": [
    {
      "id": "router-1",
      "hostname": "EDGE-R1",
      "ip": "192.168.1.1",
      "type": "Cisco IOS",
      "interfaces": [
        {"name": "Gi0/0", "ip": "10.0.0.1", "status": "up"},
        {"name": "Gi0/1", "ip": "10.0.0.2", "status": "up"}
      ]
    }
  ]
}

Python requests Library:
import requests
import json

# GET Request
url = "https://api.example.com/devices"
headers = {"Content-Type": "application/json",
           "X-Auth-Token": "your_token"}

response = requests.get(url, headers=headers, verify=False)
if response.status_code == 200:
    data = response.json()
    for device in data["response"]:
        print(device["hostname"], device["managementIpAddress"])

# POST Request  
payload = {"username": "admin", "password": "password"}
r = requests.post(url + "/ticket", json=payload, verify=False)
ticket = r.json()["response"]["serviceTicket"]` },
      { title:"2.3 Postman Tool", content:`Postman: API Testing và Development

Workflow với APIC-EM:
1. GET Service Ticket:
   POST https://sandboxapicem.cisco.com/api/v1/ticket
   Body: {"username":"devnetuser","password":"Cisco123!"}
   → Copy serviceTicket value

2. List Devices:
   GET https://sandboxapicem.cisco.com/api/v1/network-device
   Header: X-Auth-Token: <ticket>

3. Get Topology:
   GET /api/v1/topology/physical-topology

4. Path Trace:
   POST /api/v1/flow-analysis
   Body: {"sourceIP":"10.10.22.98","destIP":"10.10.22.114"}

Postman Collections:
• Tạo Collection "APIC-EM Lab"
• Add Requests: Auth, Devices, Topology, PathTrace
• Set Environment Variables: {{base_url}}, {{token}}
• Run Collection với Newman` }
    ],
    labs:[
      { num:"L2.1", name:"Python JSON Processing", dur:"90 phút", diff:1,
        steps:["Cài đặt Python 3.x + pip","Tạo JSON file thiết bị mạng","Viết script đọc và parse JSON","Filter devices theo type/status","Export kết quả ra CSV"],
        code:`import json
import csv

# Đọc topology JSON
with open("network_topology.json") as f:
    topology = json.load(f)

# Filter routers
routers = [d for d in topology["devices"] 
           if d["type"] == "router"]

# In thông tin
for r in routers:
    print(f"Hostname: {r['hostname']}")
    print(f"  IP: {r['managementIp']}")
    for intf in r.get("interfaces", []):
        status = "✓" if intf["status"]=="up" else "✗"
        print(f"  {status} {intf['name']}: {intf['ip']}")

# Export CSV
with open("routers.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Hostname","IP","Interfaces"])
    for r in routers:
        writer.writerow([r["hostname"], 
                         r["managementIp"],
                         len(r.get("interfaces",[]))])`,
        result:["Script chạy không lỗi","JSON parse thành công","Filter đúng device type","CSV export đọc được trong Excel"]
      },
      { num:"L2.2", name:"REST API với Postman", dur:"120 phút", diff:2,
        steps:["Cài Postman","Tạo Collection APIC-EM","POST lấy Service Ticket","GET danh sách network devices","GET physical topology","Export Collection để nộp bài"],
        code:`# Tương đương Python:
import requests
requests.packages.urllib3.disable_warnings()

BASE_URL = "https://sandboxapicem.cisco.com"

# Bước 1: Lấy token
auth_data = {
    "username": "devnetuser",
    "password": "Cisco123!"
}
r = requests.post(
    f"{BASE_URL}/api/v1/ticket",
    json=auth_data, verify=False
)
token = r.json()["response"]["serviceTicket"]
print(f"Token: {token[:20]}...")

# Bước 2: Lấy devices  
headers = {"X-Auth-Token": token,
           "Content-Type": "application/json"}
r = requests.get(
    f"{BASE_URL}/api/v1/network-device",
    headers=headers, verify=False
)
devices = r.json()["response"]
print(f"Total devices: {len(devices)}")
for d in devices:
    print(f"  {d['hostname']} - {d['managementIpAddress']}")`,
        result:["Service Ticket nhận được","Device list trả về JSON","Topology data parsed","Python script reproduce kết quả Postman"]
      }
    ]
  },
  {
    id:3, icon:"🔌", color:"#fb923c", title:"BỘ ĐIỀU KHIỂN MẠNG TẬP TRUNG",
    desc:"Kết nối và điều khiển bộ điều khiển mạng qua Postman và Python.",
    theory:[
      { title:"3.1 Service Ticket & Authentication", content:`APIC-EM Authentication Flow

Token-Based Auth:
1. Client gửi credentials → POST /api/v1/ticket
2. Server trả về serviceTicket (JWT-like)
3. Client dùng token trong header mọi request
4. Token hết hạn sau 1 giờ (default)

Security:
• HTTPS only (TLS 1.2+)
• Token rotation
• Role-based access: SUPER-ADMIN, ADMIN, OBSERVER

Python với Environment Variables:
import os
import requests

BASE_URL = os.getenv("APIC_BASE_URL")
USERNAME = os.getenv("APIC_USER") 
PASSWORD = os.getenv("APIC_PASS")

def get_token():
    url = f"{BASE_URL}/api/v1/ticket"
    payload = {"username": USERNAME, "password": PASSWORD}
    r = requests.post(url, json=payload, verify=False)
    r.raise_for_status()
    return r.json()["response"]["serviceTicket"]

def api_get(endpoint, token):
    headers = {"X-Auth-Token": token,
               "Content-Type": "application/json"}
    r = requests.get(f"{BASE_URL}{endpoint}", 
                     headers=headers, verify=False)
    return r.json()` },
      { title:"3.2 Network Discovery & Inventory", content:`Network Device Inventory via API

Device Properties:
{
  "id": "uuid",
  "hostname": "CORE-R1",
  "managementIpAddress": "10.10.22.74",
  "platformId": "cisco Catalyst 3850",
  "softwareVersion": "16.6.4a",
  "type": "Cisco Catalyst 3850 Series...",
  "role": "DISTRIBUTION",
  "reachabilityStatus": "Reachable",
  "upTime": "14 days, 3:21:05.98",
  "interfaceCount": "48",
  "lineCardCount": "1"
}

Lọc và phân tích devices:
def analyze_inventory(devices):
    summary = {
        "routers": [], "switches": [],
        "unreachable": []
    }
    for d in devices:
        if "router" in d["type"].lower():
            summary["routers"].append(d)
        elif "switch" in d["type"].lower():
            summary["switches"].append(d)
        if d["reachabilityStatus"] != "Reachable":
            summary["unreachable"].append(d["hostname"])
    return summary` }
    ],
    labs:[
      { num:"L3.1", name:"Thu thập thông tin mạng", dur:"120 phút", diff:2,
        steps:["Lấy Service Ticket","GET /network-device → lưu JSON","Parse và hiển thị hostname, IP, type","Filter theo reachabilityStatus","Tạo báo cáo inventory text/CSV","Visualize topology đơn giản"],
        code:`import requests
import json
from datetime import datetime
requests.packages.urllib3.disable_warnings()

class APICEMClient:
    def __init__(self, base_url, username, password):
        self.base_url = base_url
        self.token = self._get_token(username, password)
    
    def _get_token(self, username, password):
        r = requests.post(
            f"{self.base_url}/api/v1/ticket",
            json={"username": username, "password": password},
            verify=False
        )
        return r.json()["response"]["serviceTicket"]
    
    def get_devices(self):
        r = requests.get(
            f"{self.base_url}/api/v1/network-device",
            headers={"X-Auth-Token": self.token},
            verify=False
        )
        return r.json()["response"]
    
    def get_topology(self):
        r = requests.get(
            f"{self.base_url}/api/v1/topology/physical-topology",
            headers={"X-Auth-Token": self.token},
            verify=False
        )
        return r.json()["response"]

# Sử dụng
client = APICEMClient(
    "https://sandboxapicem.cisco.com",
    "devnetuser", "Cisco123!"
)
devices = client.get_devices()
print(f"📊 Inventory Report - {datetime.now()}")
print(f"Total: {len(devices)} devices")`,
        result:["APICEMClient class hoạt động","Device list đầy đủ","Báo cáo inventory xuất được","CSV/JSON file đúng format"]
      }
    ]
  },
  {
    id:4, icon:"📊", color:"#c084fc", title:"THU THẬP THÔNG TIN NÚT MẠNG",
    desc:"Sử dụng Postman và Python để thu thập thông tin chi tiết từ các nút mạng.",
    theory:[
      { title:"4.1 Device Details & Interfaces", content:`Thu thập thông tin chi tiết thiết bị

Interface Details:
GET /api/v1/interface/network-device/{deviceId}

Response:
{
  "portName": "GigabitEthernet1/0/1",
  "ipv4Address": "10.0.0.1",
  "ipv4Mask": "255.255.255.0",
  "status": "up",
  "speed": "1000000",
  "duplex": "FullDuplex",
  "vlanId": "100",
  "macAddress": "00:11:22:33:44:55"
}

Module thông tin:
GET /api/v1/network-device/{id}/equipment
GET /api/v1/network-device/{id}/functional-capability

Neighbor Discovery:
GET /api/v1/topology/physical-topology
→ nodes: [{id, label, ip, deviceType}]
→ links: [{source, target, startPortName, endPortName}]` },
      { title:"4.2 Path Trace Analysis", content:`Flow Analysis & Path Trace

POST /api/v1/flow-analysis
{
  "sourceIP": "10.10.22.98",
  "destIP": "10.10.22.114",
  "sourcePort": "80",
  "destPort": "80",
  "protocol": "tcp",
  "inclusions": ["INTERFACE-STATS","QOS-STATS","ACL-TRACE"]
}

Response: flowAnalysisId → Poll status

GET /api/v1/flow-analysis/{id}
→ networkElementsInfo[]: path hops
  → name: device name
  → ip: device IP  
  → egressInterface: {name, ip}
  → ingressInterface: {name, ip}
  → perfMonStatistics: {bytesRate, packetLoss}

Visualize Path:
Source(10.10.22.98)
  → AccessSW1 [Gi1/0/1 → Gi1/0/24]
  → DistSW1   [Gi1/0/1 → Gi1/0/2]  
  → CoreR1    [Gi0/0   → Gi0/1]
  → Dest(10.10.22.114)` }
    ],
    labs:[
      { num:"L4.1", name:"Device Profile Builder", dur:"120 phút", diff:2,
        steps:["Lấy danh sách tất cả devices","Với mỗi device: GET interfaces","Tạo profile dict đầy đủ","Lưu vào JSON database","Query: tìm device theo IP","Tạo báo cáo HTML đơn giản"],
        code:`def build_device_profiles(client):
    devices = client.get_devices()
    profiles = []
    
    for device in devices:
        device_id = device["id"]
        
        # Lấy interfaces
        r = requests.get(
            f"{client.base_url}/api/v1/interface/network-device/{device_id}",
            headers={"X-Auth-Token": client.token},
            verify=False
        )
        interfaces = r.json().get("response", [])
        
        profile = {
            "hostname": device["hostname"],
            "ip": device["managementIpAddress"],
            "type": device["type"],
            "software": device["softwareVersion"],
            "uptime": device["upTime"],
            "interfaces": [
                {
                    "name": i["portName"],
                    "ip": i.get("ipv4Address","N/A"),
                    "status": i["status"],
                    "speed": i.get("speed","N/A")
                }
                for i in interfaces
            ]
        }
        profiles.append(profile)
    
    return profiles

profiles = build_device_profiles(client)
with open("device_profiles.json", "w") as f:
    json.dump(profiles, f, indent=2)
print(f"Saved {len(profiles)} device profiles")`,
        result:["Profile JSON cho mỗi device","Interface details đầy đủ","JSON database query hoạt động","HTML report hiển thị đẹp"]
      }
    ]
  },
  {
    id:5, icon:"🕸️", color:"#f472b6", title:"LIÊN KẾT THIẾT BỊ & BỘ ĐIỀU KHIỂN",
    desc:"Xây dựng ứng dụng hoàn chỉnh quản lý mạng qua SDN controller API.",
    theory:[
      { title:"5.1 Network Topology Visualization", content:`Hiển thị Topology Mạng qua API

Lấy dữ liệu topology:
GET /api/v1/topology/physical-topology

Cấu trúc response:
{
  "nodes": [
    {"id": "uuid1", "label": "CORE-R1", 
     "ip": "10.10.22.74", "nodeType": "ROUTER",
     "x": 120.5, "y": 250.3}
  ],
  "links": [
    {"source": "uuid1", "target": "uuid2",
     "startPortName": "Gi0/0", "endPortName": "Gi1/0/1",
     "linkStatus": "UP"}
  ]
}

Python → Text Topology:
def print_topology(topo_data):
    nodes = {n["id"]: n["label"] 
             for n in topo_data["nodes"]}
    print("=== NETWORK TOPOLOGY ===")
    for link in topo_data["links"]:
        src = nodes.get(link["source"], "?")
        dst = nodes.get(link["target"], "?")
        status = "✓" if link["linkStatus"]=="UP" else "✗"
        print(f"{status} {src}[{link['startPortName']}]"
              f" ─── {dst}[{link['endPortName']}]")` },
      { title:"5.2 Kiểm Thử Kết Nối", content:`End-to-End Connectivity Testing

Path Trace Application:
def check_connectivity(client, src_ip, dst_ip):
    # Khởi tạo path trace
    payload = {
        "sourceIP": src_ip,
        "destIP": dst_ip,
        "inclusions": ["ACL-TRACE","INTERFACE-STATS"]
    }
    r = requests.post(
        f"{client.base_url}/api/v1/flow-analysis",
        json=payload,
        headers={"X-Auth-Token": client.token},
        verify=False
    )
    flow_id = r.json()["response"]["flowAnalysisId"]
    
    # Poll kết quả
    import time
    for _ in range(10):
        time.sleep(2)
        r = requests.get(
            f"{client.base_url}/api/v1/flow-analysis/{flow_id}",
            headers={"X-Auth-Token": client.token},
            verify=False
        )
        result = r.json()["response"]
        if result["request"]["status"] == "COMPLETED":
            return result
    return None

Kết quả:
• Path: danh sách hops
• ACL hits: có bị chặn không
• Interface stats: packet loss, latency` }
    ],
    labs:[
      { num:"L5.1", name:"Ứng Dụng Quản Lý Mạng", dur:"180 phút", diff:3,
        steps:["Xây dựng class APICEMClient đầy đủ","Implement: discover, inventory, topology","Implement: path_trace, connectivity_check","Thêm error handling và retry","Tạo CLI menu interface","Demo trước lớp"],
        code:`#!/usr/bin/env python3
"""
Network Management Application
Chuyên Đề Mạng Máy Tính 1 - DLU
"""
import requests
import json
import time
requests.packages.urllib3.disable_warnings()

class NetworkManager:
    def __init__(self):
        self.BASE_URL = "https://sandboxapicem.cisco.com"
        self.token = None
        self.devices = []
        self.topology = {}
    
    def login(self, username, password):
        r = requests.post(
            f"{self.BASE_URL}/api/v1/ticket",
            json={"username": username, "password": password},
            verify=False
        )
        self.token = r.json()["response"]["serviceTicket"]
        print("✓ Đăng nhập thành công")
    
    def discover_devices(self):
        r = requests.get(
            f"{self.BASE_URL}/api/v1/network-device",
            headers={"X-Auth-Token": self.token},
            verify=False
        )
        self.devices = r.json()["response"]
        print(f"✓ Phát hiện {len(self.devices)} thiết bị")
        return self.devices
    
    def show_inventory(self):
        print("\\n=== NETWORK INVENTORY ===")
        for i, d in enumerate(self.devices, 1):
            status = "🟢" if d["reachabilityStatus"]=="Reachable" else "🔴"
            print(f"{i:2}. {status} {d['hostname']:20} {d['managementIpAddress']:15} {d['type'][:30]}")
    
    def get_topology(self):
        r = requests.get(
            f"{self.BASE_URL}/api/v1/topology/physical-topology",
            headers={"X-Auth-Token": self.token},
            verify=False
        )
        self.topology = r.json()["response"]
        self.show_topology()
    
    def show_topology(self):
        nodes = {n["id"]: n["label"] for n in self.topology.get("nodes",[])}
        print("\\n=== TOPOLOGY LINKS ===")
        for link in self.topology.get("links",[]):
            src = nodes.get(link["source"],"?")
            dst = nodes.get(link["target"],"?")
            status = "UP" if link.get("linkStatus")=="UP" else "DOWN"
            print(f"  {src} ──[{status}]── {dst}")
    
    def check_path(self, src_ip, dst_ip):
        print(f"\\n🔍 Path trace: {src_ip} → {dst_ip}")
        payload = {"sourceIP": src_ip, "destIP": dst_ip}
        r = requests.post(
            f"{self.BASE_URL}/api/v1/flow-analysis",
            json=payload,
            headers={"X-Auth-Token": self.token},
            verify=False
        )
        flow_id = r.json()["response"]["flowAnalysisId"]
        for _ in range(10):
            time.sleep(2)
            r = requests.get(
                f"{self.BASE_URL}/api/v1/flow-analysis/{flow_id}",
                headers={"X-Auth-Token": self.token},
                verify=False
            )
            data = r.json()["response"]
            if data["request"]["status"] == "COMPLETED":
                hops = data.get("networkElementsInfo",[])
                print(f"  Path ({len(hops)} hops):")
                for h in hops:
                    print(f"  → {h.get('name','?')} [{h.get('ip','?')}]")
                return
        print("  ⚠ Path trace timeout")

# Main
mgr = NetworkManager()
mgr.login("devnetuser", "Cisco123!")
mgr.discover_devices()
mgr.show_inventory()
mgr.get_topology()
mgr.check_path("10.10.22.98", "10.10.22.114")`,
        result:["App chạy end-to-end","Inventory hiển thị đầy đủ","Topology in ra dạng text","Path trace trả về đường đi","Demo live trước lớp OK"]
      }
    ]
  },
  {
    id:6, icon:"🎯", color:"#34d399", title:"TỔNG KẾT & BÁO CÁO",
    desc:"Tổng kết lý thuyết SDN, thuyết trình đề tài và báo cáo cuối kỳ.",
    theory:[
      { title:"6.1 Tổng kết SDN", content:`SDN Summary & Future Directions

So sánh Traditional vs SDN:
┌────────────────┬───────────────┬──────────────────┐
│ Tiêu chí       │ Traditional   │ SDN              │
├────────────────┼───────────────┼──────────────────┤
│ Configuration  │ Per-device    │ Centralized      │
│ Programmability│ CLI/SNMP      │ REST API         │
│ Visibility     │ Limited       │ Full topology    │
│ Automation     │ Scripts       │ Intent-based     │
│ Failover       │ STP/OSPF      │ Proactive        │
│ Cost           │ High CapEx    │ Lower with OVS   │
└────────────────┴───────────────┴──────────────────┘

SDN Use Cases:
• Data Center: VMware NSX, Cisco ACI
• WAN: SD-WAN (Viptela, Meraki)  
• Campus: Cisco DNA Center (DNAC)
• Service Provider: Nokia SR Linux

Xu hướng tương lai:
• Intent-Based Networking (IBN)
• AI/ML Network Automation
• Cloud-Native Networking
• eBPF in Linux networking` },
      { title:"6.2 Hướng dẫn Báo Cáo", content:`Cấu trúc Báo Cáo Cuối Kỳ

Báo cáo nhóm (15%) - Format:
1. Trang bìa: Tên đề tài, nhóm, MSSV
2. Mục lục
3. Tổng quan đề tài (1 trang)
4. Công nghệ sử dụng (2-3 trang)
5. Thiết kế kiến trúc (topology, flowchart)
6. Implementation (code + screenshots)
7. Kết quả thực nghiệm (benchmark)
8. Kết luận và hướng phát triển
9. Tài liệu tham khảo

Slide thuyết trình (10 slide):
• Slide 1: Tên đề tài, nhóm
• Slide 2-3: Giới thiệu vấn đề
• Slide 4-5: Giải pháp đề xuất
• Slide 6-7: Demo/Implementation
• Slide 8: Kết quả đạt được
• Slide 9: Khó khăn & bài học
• Slide 10: Q&A

Chấm điểm demo:
• App chạy được: 40%
• Code chất lượng: 30%  
• Thuyết trình: 20%
• Q&A: 10%` }
    ],
    labs:[
      { num:"L6.1", name:"Báo Cáo & Demo Cuối Kỳ", dur:"120 phút", diff:2,
        steps:["Hoàn thiện NetworkManager app","Viết báo cáo theo template","Tạo slide thuyết trình","Chuẩn bị demo script","Thuyết trình nhóm (10 phút)","Q&A với giảng viên (5 phút)"],
        code:`# Demo Script Gợi Ý

print("=" * 50)
print("DEMO: Network Management Application")
print("Nhóm: [Tên nhóm] - Chuyên Đề MMT 1")
print("=" * 50)

# 1. Khởi tạo
print("\\n[1] Đăng nhập vào APIC-EM Controller...")
mgr = NetworkManager()
mgr.login("devnetuser", "Cisco123!")

# 2. Discovery
print("\\n[2] Network Discovery...")
mgr.discover_devices()

# 3. Inventory
print("\\n[3] Inventory Report:")
mgr.show_inventory()

# 4. Topology
print("\\n[4] Network Topology:")
mgr.get_topology()

# 5. Path Trace
print("\\n[5] Kiểm tra kết nối...")
mgr.check_path("10.10.22.98", "10.10.22.114")

# 6. Export
print("\\n[6] Export báo cáo...")
mgr.export_report("network_report.json")
print("✓ Demo hoàn tất!")`,
        result:["App demo không lỗi","Inventory hiển thị","Topology vẽ được","Path trace trả kết quả","Báo cáo file xuất OK"]
      }
    ]
  }
];

const SDN_THESIS = [
  { id:1, icon:"🤖", color:"#38bdf8", level:"easy", dur:"3-4 tuần", team:"2-3 SV",
    title:"Network Inventory Tool với Python",
    overview:"Xây dựng công cụ tự động thu thập và báo cáo inventory thiết bị mạng qua APIC-EM API.",
    scope:["Kết nối APIC-EM API","Thu thập: hostname, IP, type, software version","Export CSV/JSON/HTML report","Filter và search devices","Auto-refresh định kỳ"],
    code:`class InventoryTool:
    def collect(self): ...
    def export_csv(self, filename): ...
    def export_html(self, filename): ...
    def search(self, query): ...`,
    deploy:["Tuần 1: Setup, API connection","Tuần 2: Collect + parse data","Tuần 3: Report generation","Tuần 4: Testing, docs"],
    result:["Inventory đầy đủ","3 format export","Search hoạt động","Scheduled refresh"],
    tech:["Python","requests","APIC-EM API","CSV","HTML","Pandas"]
  },
  { id:2, icon:"🗺️", color:"#4ade80", level:"easy", dur:"3-4 tuần", team:"2-3 SV",
    title:"Topology Visualizer",
    overview:"Ứng dụng hiển thị topology mạng dạng đồ thị từ dữ liệu APIC-EM, với highlight trạng thái link.",
    scope:["Lấy topology data từ API","Parse nodes và links","Vẽ đồ thị với networkx/matplotlib","Color-code theo device type","Link status visualization"],
    code:`import networkx as nx
import matplotlib.pyplot as plt

G = nx.Graph()
for node in nodes: G.add_node(node["label"])
for link in links: G.add_edge(...)
nx.draw(G, with_labels=True)`,
    deploy:["Tuần 1: Data collection","Tuần 2: Graph building","Tuần 3: Visualization","Tuần 4: Polish & demo"],
    result:["Topology graph đúng","Color coding theo type","Link status hiện thị","Export PNG/SVG"],
    tech:["Python","networkx","matplotlib","APIC-EM API","Graphviz"]
  },
  { id:3, icon:"🔍", color:"#fb923c", level:"medium", dur:"4-6 tuần", team:"2-4 SV",
    title:"Path Trace & Connectivity Checker",
    overview:"Tool kiểm tra kết nối end-to-end giữa các cặp thiết bị, phân tích ACL, hiển thị đường đi chi tiết.",
    scope:["Nhập source/dest IP","Gọi flow-analysis API","Hiển thị từng hop trên đường đi","Detect ACL blocks","Đo latency ước tính","Batch test nhiều cặp"],
    code:`def trace_all_pairs(pairs):
    results = []
    for src, dst in pairs:
        result = mgr.check_path(src, dst)
        results.append(analyze_path(result))
    return generate_report(results)`,
    deploy:["Tuần 1-2: Path trace implementation","Tuần 3-4: ACL analysis","Tuần 5: Batch testing","Tuần 6: Report + demo"],
    result:["Path trace đúng","ACL blocks detected","Batch test 10+ pairs","Report với hop details"],
    tech:["Python","APIC-EM API","JSON","Tabulate","HTML Report"]
  },
  { id:4, icon:"🧩", color:"#c084fc", level:"medium", dur:"5-7 tuần", team:"3-5 SV",
    title:"SDN Network Monitor Dashboard",
    overview:"Dashboard giám sát mạng SDN real-time: device status, topology, alerts, auto-refresh.",
    scope:["Web app Flask/FastAPI","Real-time device status","Topology visualization (D3.js/Cytoscape)","Alert khi device down","Historical data logging","REST API endpoint"],
    code:`from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/api/devices')
def get_devices():
    return jsonify(mgr.get_devices())

@app.route('/api/topology')
def get_topology():
    return jsonify(mgr.get_topology())

if __name__ == '__main__':
    app.run(debug=True)`,
    deploy:["Tuần 1-2: Backend API","Tuần 3-4: Frontend Dashboard","Tuần 5: Alerts & Logging","Tuần 6-7: Integration, demo"],
    result:["Dashboard web accessible","Real-time refresh 30s","Alert email/Telegram","REST API documented"],
    tech:["Python","Flask","JavaScript","D3.js","APIC-EM API","SQLite"]
  },
  { id:5, icon:"🚀", color:"#f472b6", level:"hard", dur:"7-9 tuần", team:"3-5 SV",
    title:"SDN Intent-Based Configuration Tool",
    overview:"Ứng dụng cho phép admin định nghĩa policy bằng ngôn ngữ tự nhiên, tự động dịch sang cấu hình mạng.",
    scope:["YAML intent definition","Map intent → Cisco IOS commands","Push config qua NETCONF/Paramiko","Verify sau khi apply","Rollback mechanism","Audit log"],
    code:`# intent.yaml
policies:
  - name: "QoS for VoIP"
    match: "dscp ef"
    action: "priority 20%"
  
# Auto-generate:
# class-map VOIP
#   match dscp ef
# policy-map QOS
#   class VOIP
#     priority percent 20`,
    deploy:["Tuần 1-2: Intent language design","Tuần 3-4: Translator engine","Tuần 5-6: NETCONF push","Tuần 7: Verify+rollback","Tuần 8-9: Testing, docs"],
    result:["YAML intent parsed","Commands generated đúng","Push via NETCONF OK","Rollback hoạt động"],
    tech:["Python","NETCONF","ncclient","Paramiko","YAML","Jinja2"]
  }
];

// ============================================================
// SHARED COMPONENTS
// ============================================================
function LabCard({ lab, color, isOpen, onToggle }) {
  const [tab, setTab] = useState("steps");
  const tabs = [["steps","🔧 Bước"], ["code","💻 Code"], ["result","✅ Kết quả"]];

  return (
    <div>
      <div onClick={onToggle} style={{
        padding:"10px 14px", borderBottom:"1px solid #0a1828",
        display:"flex", alignItems:"center", gap:8, cursor:"pointer",
        background: isOpen ? `${color}08` : "transparent"
      }}>
        <div style={{
          width:32, height:32, borderRadius:5, background:`${color}15`,
          border:`1px solid ${color}40`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:11, color, flexShrink:0, fontWeight:700
        }}>{lab.num}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13, color:"#b0cce0", fontFamily:"Rajdhani,sans-serif", fontWeight:600}}>{lab.name}</div>
          <div style={{display:"flex", gap:8, marginTop:2}}>
            <span style={{fontSize:11, color:"#3a5a7a"}}>⏱ {lab.dur}</span>
            <span style={{fontSize:11, color:"#3a5a7a"}}>{"★".repeat(lab.diff)}{"☆".repeat(4-lab.diff)}</span>
          </div>
        </div>
        <span style={{color:"#1a3a5a", fontSize:14, flexShrink:0}}>{isOpen?"▲":"▼"}</span>
      </div>
      {isOpen && (
        <div style={{padding:"12px 14px", background:"#020910", borderBottom:"1px solid #0a1828"}}>
          <div style={{display:"flex", gap:4, marginBottom:10, flexWrap:"wrap"}}>
            {tabs.map(([k,l]) => (
              <button key={k} onClick={e=>{e.stopPropagation();setTab(k);}} style={{
                background: tab===k ? `${color}1a` : "#030c18",
                border:`1px solid ${tab===k ? color : "#0a1828"}`,
                color: tab===k ? color : "#3a6a8a",
                padding:"5px 10px", borderRadius:4, fontSize:11, whiteSpace:"nowrap", cursor:"pointer"
              }}>{l}</button>
            ))}
          </div>
          {tab==="steps" && (
            <div>
              {(lab.steps || lab.deploy || []).map((st,i) => (
                <div key={i} style={{display:"flex", gap:8, marginBottom:6, alignItems:"flex-start"}}>
                  <div style={{
                    width:18, height:18, borderRadius:"50%", background:`${color}15`,
                    border:`1px solid ${color}50`, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:10, color, flexShrink:0, fontWeight:700
                  }}>{i+1}</div>
                  <span style={{fontSize:12, color:"#7a9aba", lineHeight:1.6}}>{st}</span>
                </div>
              ))}
            </div>
          )}
          {tab==="code" && (
            <pre style={{
              background:"#010810", borderRadius:7, padding:"12px", fontSize:11,
              color:"#00e5aa", lineHeight:1.8, overflowX:"auto",
              borderLeft:`3px solid ${color}`, margin:0
            }}>{lab.code || lab.cmds || ""}</pre>
          )}
          {tab==="result" && (
            <div>
              {(lab.result || []).map((r,i) => (
                <div key={i} style={{
                  display:"flex", gap:8, marginBottom:6, background:"#031208",
                  border:"1px solid #0a2018", borderRadius:4, padding:"6px 10px"
                }}>
                  <span style={{color:"#10b981", fontSize:11, flexShrink:0}}>✓</span>
                  <span style={{fontSize:12, color:"#6ab09a"}}>{r}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// NGN COURSE VIEW
// ============================================================
function NGNCourse() {
  const [view, setView] = useState("modules");
  const [expMod, setExpMod] = useState(null);
  const [expLab, setExpLab] = useState(null);
  const [labTab, setLabTab] = useState("deploy");
  const [expThesis, setExpThesis] = useState(null);
  const [thesisTab, setThesisTab] = useState("overview");
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? NGN_THESIS : NGN_THESIS.filter(t=>t.level===filter);

  return (
    <div>
      {/* Sub Nav */}
      <div style={{display:"flex", borderBottom:"1px solid #0a2a40", background:"#030e1a", overflowX:"auto"}}>
        {[["modules","📚","Modules & Labs"],["thesis","🎓","Đề Tài NGN"],["guide","📖","Hướng Dẫn"]].map(([k,ic,l])=>(
          <button key={k} onClick={()=>setView(k)} style={{
            background:view===k?"#041a2a":"transparent",
            border:"none", borderBottom:view===k?"2px solid #00d4ff":"2px solid transparent",
            color:view===k?"#00d4ff":"#3a6a8a",
            padding:"9px 14px", fontSize:12, cursor:"pointer", transition:"all 0.2s", flexShrink:0, whiteSpace:"nowrap"
          }}>{ic} {l}</button>
        ))}
      </div>

      <div style={{padding:"14px"}}>
        {/* MODULES */}
        {view==="modules" && (
          <div>
            <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"#3a6a8a",letterSpacing:3,marginBottom:12}}>▸ 6 MODULES · 25 LABS CHI TIẾT</div>
            {NGN_MODULES.map(mod => (
              <div key={mod.id} style={{marginBottom:8}}>
                <div onClick={()=>{setExpMod(expMod===mod.id?null:mod.id);setExpLab(null);}} style={{
                  background:"#040f18", borderRadius:expMod===mod.id?"8px 8px 0 0":8,
                  padding:"12px 14px", cursor:"pointer",
                  border:`1px solid ${expMod===mod.id?mod.color:"#0a2030"}`,
                  borderLeft:`4px solid ${mod.color}`, transition:"all 0.18s"
                }}>
                  <div style={{display:"flex", alignItems:"center", gap:10}}>
                    <div style={{fontSize:18, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", background:`${mod.color}12`, border:`1px solid ${mod.color}30`, borderRadius:6, flexShrink:0}}>{mod.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex", gap:6, alignItems:"center", marginBottom:2, flexWrap:"wrap"}}>
                        <span style={{color:mod.color, fontWeight:700, fontSize:13}}>MODULE {mod.id}</span>
                        <span style={{color:"#1a4a6a", fontSize:12}}>|</span>
                        <span style={{color:"#3a6a8a", fontSize:12}}>{mod.labs}</span>
                      </div>
                      <div style={{fontFamily:"Rajdhani,sans-serif", fontWeight:700, fontSize:14, color:"#d0e8ff"}}>{mod.title}</div>
                      <div style={{fontSize:11, color:"#3a6a8a", marginTop:2}}>{mod.desc}</div>
                    </div>
                    <div style={{display:"flex", gap:3, flexWrap:"wrap", maxWidth:160, justifyContent:"flex-end", flexShrink:0}}>
                      {mod.tags.map(t=><span key={t} style={{background:"#020d18",border:`1px solid ${mod.color}40`,borderRadius:3,padding:"1px 5px",fontSize:10,color:mod.color}}>{t}</span>)}
                    </div>
                    <span style={{color:mod.color, fontSize:12, marginLeft:4, flexShrink:0}}>{expMod===mod.id?"▲":"▼"}</span>
                  </div>
                </div>
                {expMod===mod.id && (
                  <div style={{background:"#030b16", border:`1px solid ${mod.color}1a`, borderTop:"none", borderRadius:"0 0 8px 8px"}}>
                    {mod.labList.map(lab => {
                      const k = `${mod.id}-${lab.num}`;
                      const open = expLab===k;
                      return (
                        <div key={lab.num}>
                          <div onClick={()=>{setExpLab(open?null:k);setLabTab("deploy");}} style={{
                            padding:"10px 14px", borderBottom:"1px solid #0a1828",
                            display:"flex", alignItems:"center", gap:8, cursor:"pointer"
                          }}>
                            <div style={{width:32, height:32, borderRadius:5, background:`${mod.color}15`, border:`1px solid ${mod.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:mod.color, flexShrink:0, fontWeight:700}}>{lab.num}</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13, color:"#b0cce0", fontFamily:"Rajdhani,sans-serif", fontWeight:600}}>{lab.name}</div>
                              <div style={{display:"flex", gap:8, marginTop:2}}>
                                <span style={{fontSize:11, color:"#3a5a7a"}}>⏱ {lab.dur}</span>
                                <span style={{fontSize:11, color:"#3a5a7a"}}>{"★".repeat(lab.diff)}{"☆".repeat(4-lab.diff)}</span>
                              </div>
                            </div>
                            <span style={{color:"#1a3a5a", fontSize:12, flexShrink:0}}>{open?"▲":"▼"}</span>
                          </div>
                          {open && (
                            <div style={{padding:"12px 14px", background:"#020910", borderBottom:"1px solid #0a1828"}}>
                              <div style={{display:"flex", gap:4, marginBottom:10, flexWrap:"wrap"}}>
                                {[["deploy","🔧 Deploy"],["cmds","💻 Lệnh"],["topo","📐 Topo"],["result","✅ Kết Quả"],["hints","💡 Gợi Ý"]].map(([k2,l])=>(
                                  <button key={k2} onClick={e=>{e.stopPropagation();setLabTab(k2);}} style={{background:labTab===k2?`${mod.color}1a`:"#030c18",border:`1px solid ${labTab===k2?mod.color:"#0a1828"}`,color:labTab===k2?mod.color:"#3a6a8a",padding:"4px 9px",borderRadius:4,fontSize:11,whiteSpace:"nowrap",cursor:"pointer"}}>{l}</button>
                                ))}
                              </div>
                              {labTab==="deploy" && <div>{lab.deploy.map((st,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}><div style={{width:18,height:18,borderRadius:"50%",background:`${mod.color}15`,border:`1px solid ${mod.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:mod.color,flexShrink:0,fontWeight:700}}>{i+1}</div><span style={{fontSize:12,color:"#7a9aba",lineHeight:1.6}}>{st}</span></div>)}</div>}
                              {labTab==="cmds" && <pre style={{background:"#010810",borderRadius:7,padding:"12px",fontSize:11,color:"#00e5aa",lineHeight:1.8,overflowX:"auto",borderLeft:`3px solid ${mod.color}`,margin:0}}>{lab.cmds}</pre>}
                              {labTab==="topo" && <pre style={{background:"#010810",borderRadius:7,padding:"12px",fontSize:11,color:"#00d4ff",lineHeight:1.8,overflowX:"auto",borderLeft:`3px solid ${mod.color}`,margin:0}}>{lab.topo}</pre>}
                              {labTab==="result" && <div>{lab.result.map((r,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6,background:"#031208",border:"1px solid #0a2018",borderRadius:4,padding:"6px 10px"}}><span style={{color:"#10b981",fontSize:11,flexShrink:0}}>✓</span><span style={{fontSize:12,color:"#6ab09a"}}>{r}</span></div>)}</div>}
                              {labTab==="hints" && <div>{lab.hints.map((h,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6,background:"#0f0d02",border:"1px solid #2a1a00",borderRadius:4,padding:"6px 10px"}}><span style={{color:"#f59e0b",fontSize:11,flexShrink:0}}>→</span><span style={{fontSize:12,color:"#b09a4a"}}>{h}</span></div>)}</div>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* THESIS */}
        {view==="thesis" && (
          <div>
            <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap"}}>
              <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"#3a6a8a",letterSpacing:3}}>{filtered.length} ĐỀ TÀI NGN</div>
              <div style={{display:"flex", gap:5, marginLeft:"auto", flexWrap:"wrap"}}>
                {[["all","Tất Cả","#00d4ff"],["medium","Đồ Án","#f59e0b"],["hard","NCKH/LV","#ff6b35"]].map(([k,l,c])=>(
                  <button key={k} onClick={()=>setFilter(k)} style={{background:filter===k?`${c}18`:"#050f18",border:`1px solid ${filter===k?c:"#1a3050"}`,color:filter===k?c:"#3a6a8a",padding:"4px 10px",borderRadius:4,fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}>{l}</button>
                ))}
              </div>
            </div>
            {filtered.map(t => (
              <div key={t.id} style={{marginBottom:8}}>
                <div onClick={()=>setExpThesis(expThesis===t.id?null:t.id)} style={{background:"#040f18",borderRadius:expThesis===t.id?"8px 8px 0 0":8,padding:"12px 14px",cursor:"pointer",border:`1px solid ${expThesis===t.id?t.color:"#0a2030"}`,borderLeft:`4px solid ${t.color}`,transition:"all 0.18s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{fontSize:20,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",background:`${t.color}12`,border:`1px solid ${t.color}30`,borderRadius:7,flexShrink:0}}>{t.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:2,flexWrap:"wrap"}}>
                        <span style={{color:t.color,fontWeight:700,fontSize:13}}>ĐỀ TÀI {t.id}</span>
                        <span style={{background:`${t.color}15`,border:`1px solid ${t.color}40`,borderRadius:3,padding:"1px 6px",fontSize:10,color:t.color}}>{t.level==="medium"?"⭐⭐⭐ Đồ Án Môn Học":t.level==="easy"?"⭐⭐ Cơ Bản":"⭐⭐⭐⭐⭐ NCKH/LV"}</span>
                      </div>
                      <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"#d0e8ff"}}>{t.title}</div>
                      <div style={{display:"flex",gap:10,marginTop:2,flexWrap:"wrap"}}>
                        <span style={{fontSize:11,color:"#3a6a8a"}}>⏱ {t.dur}</span>
                        <span style={{fontSize:11,color:"#3a6a8a"}}>👥 {t.team}</span>
                      </div>
                    </div>
                    <span style={{color:t.color,fontSize:12,flexShrink:0}}>{expThesis===t.id?"▲":"▼"}</span>
                  </div>
                </div>
                {expThesis===t.id && (
                  <div style={{background:"#030b16",border:`1px solid ${t.color}1a`,borderTop:"none",borderRadius:"0 0 8px 8px",padding:"14px"}}>
                    <div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap"}}>
                      {[["overview","📋 Tổng Quan"],["topo","📐 Deploy"],["result","✅ Kết Quả"]].map(([k,l])=>(
                        <button key={k} onClick={e=>{e.stopPropagation();setThesisTab(k);}} style={{background:thesisTab===k?`${t.color}1a`:"#030c18",border:`1px solid ${thesisTab===k?t.color:"#0a1828"}`,color:thesisTab===k?t.color:"#3a6a8a",padding:"4px 9px",borderRadius:4,fontSize:11,whiteSpace:"nowrap",cursor:"pointer"}}>{l}</button>
                      ))}
                    </div>
                    {thesisTab==="overview" && (
                      <div>
                        <div style={{background:`${t.color}08`,border:`1px solid ${t.color}1a`,borderRadius:6,padding:"10px 12px",marginBottom:10}}>
                          <div style={{fontSize:11,color:t.color,fontWeight:700,marginBottom:4}}>TỔNG QUAN</div>
                          <div style={{fontSize:12,color:"#7a9aba",lineHeight:1.7}}>{t.overview}</div>
                        </div>
                        {t.scope.map((sc,i)=><div key={i} style={{display:"flex",gap:6,background:"#030c18",border:`1px solid ${t.color}1a`,borderRadius:4,padding:"6px 10px",marginBottom:5}}><span style={{color:t.color,fontSize:11,flexShrink:0}}>▸</span><span style={{fontSize:12,color:"#7a9aba"}}>{sc}</span></div>)}
                        <div style={{marginTop:10,display:"flex",gap:4,flexWrap:"wrap"}}>
                          {t.tech.map(tc=><span key={tc} style={{background:"#020d18",border:`1px solid ${t.color}40`,borderRadius:3,padding:"2px 7px",fontSize:10,color:t.color}}>{tc}</span>)}
                        </div>
                      </div>
                    )}
                    {thesisTab==="topo" && (
                      <div>
                        {t.deploy.map((d,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6}}><div style={{width:20,height:20,borderRadius:4,background:`${t.color}15`,border:`1px solid ${t.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:t.color,flexShrink:0,fontWeight:700}}>{i+1}</div><span style={{fontSize:12,color:"#7a9aba",lineHeight:1.7}}>{d}</span></div>)}
                      </div>
                    )}
                    {thesisTab==="result" && (
                      <div>
                        {t.result.map((r,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6,background:"#031208",border:"1px solid #0a2018",borderRadius:4,padding:"6px 10px"}}><span style={{color:"#10b981",fontSize:11,flexShrink:0}}>✓</span><span style={{fontSize:12,color:"#6ab09a"}}>{r}</span></div>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* GUIDE */}
        {view==="guide" && (
          <div>
            <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"#3a6a8a",letterSpacing:3,marginBottom:12}}>▸ HƯỚNG DẪN NHANH NGN/IPv6</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:10,marginBottom:14}}>
              {[
                {t:"🚀 Khởi Động EVE-NG",c:"#00d4ff",items:["Truy cập EVE-NG Web UI: http://EVE-NG-IP","Tạo New Lab → Add Node → Cisco IOL","Kết nối nodes bằng drag-and-drop","Start all nodes, đợi boot ~30s","ipv6 unicast-routing (bắt buộc)","show ipv6 interface brief"]},
                {t:"⚙️ IPv6 Quick Config",c:"#10b981",items:["ipv6 unicast-routing + ipv6 cef","interface Gi0/0 → ipv6 address X/prefix","ipv6 address FE80::1 link-local","no shutdown → end → wr","ping ipv6 X source Y","show ipv6 neighbors"]},
                {t:"🔍 Debug IPv6",c:"#f59e0b",items:["show ipv6 interface brief","show ipv6 neighbors (NDP cache)","show ipv6 route (routing table)","ping ipv6 X source Y repeat 100","traceroute ipv6 X source Y","debug ipv6 icmp"]},
                {t:"📡 OSPFv3",c:"#7c3aed",items:["ipv6 router ospf 1 → router-id X","interface Gi0/0 → ipv6 ospf 1 area 0","show ipv6 ospf neighbor (Full=OK)","show ipv6 ospf database","clear ipv6 ospf process","debug ipv6 ospf adj"]},
              ].map((card,i)=>(
                <div key={i} style={{background:"#040f18",border:`1px solid ${card.c}22`,borderLeft:`3px solid ${card.c}`,borderRadius:7,padding:"12px"}}>
                  <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:12,color:card.c,marginBottom:8}}>{card.t}</div>
                  {card.items.map((item,j)=><div key={j} style={{display:"flex",gap:5,marginBottom:4}}><span style={{color:card.c,fontSize:10,flexShrink:0,marginTop:2}}>▸</span><code style={{fontSize:11,color:"#6a9aba",lineHeight:1.5,fontFamily:"Share Tech Mono,monospace",wordBreak:"break-all"}}>{item}</code></div>)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SDN COURSE VIEW
// ============================================================
function SDNCourse() {
  const [view, setView] = useState("chapters");
  const [expChap, setExpChap] = useState(null);
  const [chapTab, setChapTab] = useState("theory");
  const [expTheory, setExpTheory] = useState(null);
  const [expLab, setExpLab] = useState(null);
  const [expThesis, setExpThesis] = useState(null);
  const [thesisTab, setThesisTab] = useState("overview");
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? SDN_THESIS : SDN_THESIS.filter(t=>t.level===filter);

  return (
    <div>
      {/* Sub Nav */}
      <div style={{display:"flex", borderBottom:"1px solid #0a2a40", background:"#030e1a", overflowX:"auto"}}>
        {[["chapters","📚","Nội Dung & Labs"],["thesis","🎓","Đề Tài SDN"],["rubric","📋","Rubric & Điểm"],["guide","📖","Hướng Dẫn"]].map(([k,ic,l])=>(
          <button key={k} onClick={()=>setView(k)} style={{
            background:view===k?"#041a2a":"transparent",
            border:"none", borderBottom:view===k?"2px solid #38bdf8":"2px solid transparent",
            color:view===k?"#38bdf8":"#3a6a8a",
            padding:"9px 14px", fontSize:12, cursor:"pointer", transition:"all 0.2s", flexShrink:0, whiteSpace:"nowrap"
          }}>{ic} {l}</button>
        ))}
      </div>

      <div style={{padding:"14px"}}>
        {/* CHAPTERS */}
        {view==="chapters" && (
          <div>
            {/* Course Info Banner */}
            <div style={{background:"#040f18", border:"1px solid #0a2030", borderLeft:"4px solid #38bdf8", borderRadius:8, padding:"12px 14px", marginBottom:14}}>
              <div style={{display:"flex", gap:12, flexWrap:"wrap", alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:15,color:"#38bdf8"}}>CHUYÊN ĐỀ MẠNG MÁY TÍNH 1 · 20CT3124</div>
                  <div style={{fontSize:11,color:"#3a6a8a",marginTop:3}}>Mã HP: 20CT3124 · 4 tín chỉ (2-0-2) · Tự chọn · Tiên quyết: Mạng Máy Tính</div>
                  <div style={{display:"flex",gap:12,marginTop:8,flexWrap:"wrap"}}>
                    {[["📖","30 tiết LT"],["💻","60 tiết TH"],["🏠","60 giờ Tự học"],["👨‍🏫","Vũ Minh Quan"]].map(([ic,l])=>(
                      <span key={l} style={{fontSize:11,color:"#4a8a9a"}}>
                        {ic} {l}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
                  {[["📊","50% QT"],["📝","50% Thi"]].map(([ic,l])=>(
                    <div key={l} style={{background:"#38bdf815",border:"1px solid #38bdf840",borderRadius:5,padding:"4px 10px",fontSize:11,color:"#38bdf8",textAlign:"center"}}>
                      {ic} {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"#3a6a8a",letterSpacing:3,marginBottom:12}}>▸ 6 CHƯƠNG · LÝ THUYẾT + LABS</div>
            {SDN_CHAPTERS.map(chap => (
              <div key={chap.id} style={{marginBottom:8}}>
                <div onClick={()=>{setExpChap(expChap===chap.id?null:chap.id);setChapTab("theory");setExpTheory(null);setExpLab(null);}} style={{
                  background:"#040f18", borderRadius:expChap===chap.id?"8px 8px 0 0":8,
                  padding:"12px 14px", cursor:"pointer",
                  border:`1px solid ${expChap===chap.id?chap.color:"#0a2030"}`,
                  borderLeft:`4px solid ${chap.color}`, transition:"all 0.18s"
                }}>
                  <div style={{display:"flex", alignItems:"center", gap:10}}>
                    <div style={{fontSize:18, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", background:`${chap.color}12`, border:`1px solid ${chap.color}30`, borderRadius:6, flexShrink:0}}>{chap.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{color:chap.color, fontWeight:700, fontSize:13, marginBottom:2}}>CHƯƠNG {chap.id}</div>
                      <div style={{fontFamily:"Rajdhani,sans-serif", fontWeight:700, fontSize:14, color:"#d0e8ff"}}>{chap.title}</div>
                      <div style={{fontSize:11, color:"#3a6a8a", marginTop:2}}>{chap.desc}</div>
                    </div>
                    <div style={{display:"flex", gap:4, flexShrink:0}}>
                      <span style={{background:`${chap.color}15`, border:`1px solid ${chap.color}40`, borderRadius:3, padding:"1px 6px", fontSize:10, color:chap.color}}>{chap.theory.length} Bài LT</span>
                      <span style={{background:"#1a3a5a22", border:"1px solid #2a4a6a", borderRadius:3, padding:"1px 6px", fontSize:10, color:"#4a8a9a"}}>{chap.labs.length} Labs</span>
                    </div>
                    <span style={{color:chap.color, fontSize:12, marginLeft:4, flexShrink:0}}>{expChap===chap.id?"▲":"▼"}</span>
                  </div>
                </div>

                {expChap===chap.id && (
                  <div style={{background:"#030b16", border:`1px solid ${chap.color}1a`, borderTop:"none", borderRadius:"0 0 8px 8px"}}>
                    {/* Tab bar */}
                    <div style={{display:"flex", gap:4, padding:"10px 14px", borderBottom:"1px solid #0a1828"}}>
                      {[["theory","📖 Lý Thuyết"],["labs","🔬 Labs"]].map(([k,l])=>(
                        <button key={k} onClick={e=>{e.stopPropagation();setChapTab(k);}} style={{
                          background:chapTab===k?`${chap.color}1a`:"#030c18",
                          border:`1px solid ${chapTab===k?chap.color:"#0a1828"}`,
                          color:chapTab===k?chap.color:"#3a6a8a",
                          padding:"5px 12px", borderRadius:4, fontSize:12, cursor:"pointer", whiteSpace:"nowrap"
                        }}>{l}</button>
                      ))}
                    </div>

                    {chapTab==="theory" && (
                      <div style={{padding:"0"}}>
                        {chap.theory.map((th,ti) => (
                          <div key={ti}>
                            <div onClick={()=>setExpTheory(expTheory===`${chap.id}-${ti}`?null:`${chap.id}-${ti}`)} style={{
                              padding:"10px 14px", borderBottom:"1px solid #0a1828",
                              cursor:"pointer", display:"flex", alignItems:"center", gap:8
                            }}>
                              <span style={{color:chap.color, fontSize:11, flexShrink:0}}>§</span>
                              <span style={{fontSize:13, color:"#b0cce0", fontFamily:"Rajdhani,sans-serif", fontWeight:600, flex:1}}>{th.title}</span>
                              <span style={{color:"#1a3a5a", fontSize:12}}>{expTheory===`${chap.id}-${ti}`?"▲":"▼"}</span>
                            </div>
                            {expTheory===`${chap.id}-${ti}` && (
                              <div style={{padding:"12px 14px 14px", background:"#020910", borderBottom:"1px solid #0a1828"}}>
                                <pre style={{
                                  background:"#010810", borderRadius:7, padding:"14px",
                                  fontSize:11, color:"#c0d8f0", lineHeight:2,
                                  overflowX:"auto", borderLeft:`3px solid ${chap.color}`,
                                  margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word",
                                  fontFamily:"Share Tech Mono,monospace"
                                }}>{th.content}</pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {chapTab==="labs" && (
                      <div>
                        {chap.labs.map((lab, li) => (
                          <LabCard
                            key={li}
                            lab={lab}
                            color={chap.color}
                            isOpen={expLab===`${chap.id}-${li}`}
                            onToggle={()=>setExpLab(expLab===`${chap.id}-${li}`?null:`${chap.id}-${li}`)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* THESIS */}
        {view==="thesis" && (
          <div>
            <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap"}}>
              <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"#3a6a8a",letterSpacing:3}}>{filtered.length} ĐỀ TÀI SDN</div>
              <div style={{display:"flex", gap:5, marginLeft:"auto", flexWrap:"wrap"}}>
                {[["all","Tất Cả","#38bdf8"],["easy","Cơ Bản","#4ade80"],["medium","Đồ Án","#f59e0b"],["hard","Nâng Cao","#f472b6"]].map(([k,l,c])=>(
                  <button key={k} onClick={()=>setFilter(k)} style={{background:filter===k?`${c}18`:"#050f18",border:`1px solid ${filter===k?c:"#1a3050"}`,color:filter===k?c:"#3a6a8a",padding:"4px 9px",borderRadius:4,fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}>{l}</button>
                ))}
              </div>
            </div>
            {filtered.map(t => (
              <div key={t.id} style={{marginBottom:8}}>
                <div onClick={()=>{setExpThesis(expThesis===t.id?null:t.id);setThesisTab("overview");}} style={{background:"#040f18",borderRadius:expThesis===t.id?"8px 8px 0 0":8,padding:"12px 14px",cursor:"pointer",border:`1px solid ${expThesis===t.id?t.color:"#0a2030"}`,borderLeft:`4px solid ${t.color}`,transition:"all 0.18s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{fontSize:20,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",background:`${t.color}12`,border:`1px solid ${t.color}30`,borderRadius:7,flexShrink:0}}>{t.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:2,flexWrap:"wrap"}}>
                        <span style={{color:t.color,fontWeight:700,fontSize:13}}>ĐỀ TÀI {t.id}</span>
                        <span style={{background:`${t.color}15`,border:`1px solid ${t.color}40`,borderRadius:3,padding:"1px 6px",fontSize:10,color:t.color}}>{t.level==="easy"?"⭐⭐":t.level==="medium"?"⭐⭐⭐":"⭐⭐⭐⭐⭐"} {t.level==="easy"?"Cơ Bản":t.level==="medium"?"Đồ Án":"Nâng Cao"}</span>
                      </div>
                      <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"#d0e8ff"}}>{t.title}</div>
                      <div style={{display:"flex",gap:10,marginTop:2}}>
                        <span style={{fontSize:11,color:"#3a6a8a"}}>⏱ {t.dur}</span>
                        <span style={{fontSize:11,color:"#3a6a8a"}}>👥 {t.team}</span>
                      </div>
                    </div>
                    <span style={{color:t.color,fontSize:12,flexShrink:0}}>{expThesis===t.id?"▲":"▼"}</span>
                  </div>
                </div>
                {expThesis===t.id && (
                  <div style={{background:"#030b16",border:`1px solid ${t.color}1a`,borderTop:"none",borderRadius:"0 0 8px 8px",padding:"14px"}}>
                    <div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap"}}>
                      {[["overview","📋 Tổng Quan"],["code","💻 Code Mẫu"],["result","✅ Kết Quả"]].map(([k,l])=>(
                        <button key={k} onClick={e=>{e.stopPropagation();setThesisTab(k);}} style={{background:thesisTab===k?`${t.color}1a`:"#030c18",border:`1px solid ${thesisTab===k?t.color:"#0a1828"}`,color:thesisTab===k?t.color:"#3a6a8a",padding:"4px 9px",borderRadius:4,fontSize:11,whiteSpace:"nowrap",cursor:"pointer"}}>{l}</button>
                      ))}
                    </div>
                    {thesisTab==="overview" && (
                      <div>
                        <div style={{background:`${t.color}08`,border:`1px solid ${t.color}1a`,borderRadius:6,padding:"10px 12px",marginBottom:10}}>
                          <div style={{fontSize:11,color:t.color,fontWeight:700,marginBottom:4}}>TỔNG QUAN</div>
                          <div style={{fontSize:12,color:"#7a9aba",lineHeight:1.7}}>{t.overview}</div>
                        </div>
                        {t.scope.map((sc,i)=><div key={i} style={{display:"flex",gap:6,background:"#030c18",border:`1px solid ${t.color}1a`,borderRadius:4,padding:"6px 10px",marginBottom:4}}><span style={{color:t.color,fontSize:11}}>▸</span><span style={{fontSize:12,color:"#7a9aba"}}>{sc}</span></div>)}
                        <div style={{marginTop:10,display:"flex",gap:4,flexWrap:"wrap"}}>
                          {t.tech.map(tc=><span key={tc} style={{background:"#020d18",border:`1px solid ${t.color}40`,borderRadius:3,padding:"2px 7px",fontSize:10,color:t.color}}>{tc}</span>)}
                        </div>
                      </div>
                    )}
                    {thesisTab==="code" && (
                      <pre style={{background:"#010810",borderRadius:7,padding:"12px",fontSize:11,color:"#00e5aa",lineHeight:1.8,overflowX:"auto",borderLeft:`3px solid ${t.color}`,margin:0}}>{t.code}</pre>
                    )}
                    {thesisTab==="result" && (
                      <div>
                        {t.result.map((r,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6,background:"#031208",border:"1px solid #0a2018",borderRadius:4,padding:"6px 10px"}}><span style={{color:"#10b981",fontSize:11}}>✓</span><span style={{fontSize:12,color:"#6ab09a"}}>{r}</span></div>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* RUBRIC */}
        {view==="rubric" && (
          <div>
            <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"#3a6a8a",letterSpacing:3,marginBottom:12}}>▸ RUBRIC & THANG ĐIỂM</div>

            {/* Điểm tổng */}
            <div style={{background:"#040f18",border:"1px solid #38bdf822",borderLeft:"4px solid #38bdf8",borderRadius:8,padding:"12px 14px",marginBottom:12}}>
              <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"#38bdf8",marginBottom:10}}>CẤU TRÚC ĐIỂM (10 điểm)</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8}}>
                {[
                  {name:"Thảo luận lớp",pct:"10%",note:"Từng buổi học",cdr:"CĐR1,2,8",c:"#38bdf8"},
                  {name:"Thực hành (1-8)",pct:"10%",note:"Từng buổi",cdr:"CĐR1-6,8",c:"#4ade80"},
                  {name:"Kiểm tra giữa kỳ",pct:"15%",note:"Buổi 4",cdr:"CĐR1-4",c:"#fb923c"},
                  {name:"Bài tập nhóm",pct:"15%",note:"Buổi 7,8",cdr:"CĐR1-8",c:"#c084fc"},
                  {name:"Thi cuối kỳ",pct:"50%",note:"Tự luận",cdr:"CĐR1-6",c:"#f472b6"},
                ].map((item,i)=>(
                  <div key={i} style={{background:"#020d18",border:`1px solid ${item.c}22`,borderRadius:6,padding:"10px 12px"}}>
                    <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:12,color:item.c}}>{item.name}</div>
                    <div style={{fontSize:22,color:item.c,fontWeight:700,margin:"4px 0"}}>{item.pct}</div>
                    <div style={{fontSize:10,color:"#3a5a7a"}}>{item.note}</div>
                    <div style={{fontSize:10,color:"#2a4a6a",marginTop:2}}>{item.cdr}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rubric thực hành */}
            <div style={{background:"#040f18",border:"1px solid #0a2a40",borderRadius:8,overflow:"hidden",marginBottom:12}}>
              <div style={{background:"#030e1a",padding:"8px 14px",borderBottom:"1px solid #0a2a40"}}>
                <span style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:12,color:"#4ade80"}}>📋 RUBRIC KỸ NĂNG THỰC HÀNH</span>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
                  <thead>
                    <tr style={{background:"#030c18"}}>
                      {["Bài TH","Trọng Số","Giỏi (8.5-10)","Khá (7-8.4)","TB (5-6.9)","Yếu (<5)"].map(h=>(
                        <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:11,color:"#3a6a8a",fontWeight:700,borderBottom:"1px solid #0a2a40",whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["TH1: Python cơ bản","10%","Hoàn thành + Python OK","Hiểu SDN, chưa TH đủ","Hiểu SDN, chưa Python","Không hoàn thành"],
                      ["TH2: JSON & API","20%","JSON + API thành công","JSON OK, API chưa đủ","Chưa hiểu API/JSON","Không hoàn thành"],
                      ["TH3: Service Ticket","20%","Postman + Python OK","1 trong 2 thành công","Còn lỗi cả 2","Không hoàn thành"],
                      ["TH4: Thu thập TT","20%","2 tool thành công","1 tool, còn lỗi","Dữ liệu chưa đúng","Không hoàn thành"],
                      ["TH5: Full App","20%","API + Python hoàn chỉnh","Chỉ 1 tool OK","Trích xuất còn lỗi","Không hoàn thành"],
                      ["TH6: Báo cáo","10%","Báo cáo hoàn tất","Thiếu một số phần","Còn nhiều lỗi","Không nộp"],
                    ].map((row,i)=>(
                      <tr key={i} style={{borderBottom:"1px solid #0a1828",background:i%2===0?"#030b16":"#020910"}}>
                        {row.map((cell,j)=>(
                          <td key={j} style={{padding:"6px 10px",fontSize:11,color:j===0?"#c0d8f0":j===1?"#4ade80":j===2?"#38bdf8":j===3?"#fb923c":j===4?"#f59e0b":"#ef4444",whiteSpace:j<2?"nowrap":"normal"}}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chuẩn đầu ra */}
            <div style={{background:"#040f18",border:"1px solid #0a2a40",borderRadius:8,overflow:"hidden"}}>
              <div style={{background:"#030e1a",padding:"8px 14px",borderBottom:"1px solid #0a2a40"}}>
                <span style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:12,color:"#38bdf8"}}>🎯 CHUẨN ĐẦU RA HỌC PHẦN</span>
              </div>
              <div style={{padding:"14px"}}>
                {[
                  {cdr:"CĐR1",desc:"Hiểu kiến thức cơ bản về SDN và các mô hình thực tế",level:"T"},
                  {cdr:"CĐR2",desc:"Phân tích vai trò từng tầng trong mô hình SDN",level:"T"},
                  {cdr:"CĐR3",desc:"Xây dựng ứng dụng tạo bộ điều khiển mạng cơ bản",level:"T"},
                  {cdr:"CĐR4",desc:"Phân tích yêu cầu và xây dựng SDN controller",level:"T"},
                  {cdr:"CĐR5",desc:"Thử nghiệm, phân tích dữ liệu mạng",level:"T"},
                  {cdr:"CĐR6",desc:"Trình bày báo cáo, thuyết trình, làm việc nhóm",level:"T"},
                  {cdr:"CĐR7",desc:"Thái độ ham học hỏi, nhiệt tình, nghiêm túc",level:"TU"},
                  {cdr:"CĐR8",desc:"Ý thức học tập tốt, chủ động",level:"U"},
                ].map((item,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:8,padding:"8px 10px",background:"#020910",borderRadius:5,border:"1px solid #0a1828",alignItems:"center"}}>
                    <span style={{background:"#38bdf815",border:"1px solid #38bdf840",borderRadius:4,padding:"2px 8px",fontSize:11,color:"#38bdf8",flexShrink:0,fontWeight:700}}>{item.cdr}</span>
                    <span style={{fontSize:12,color:"#7a9aba",flex:1}}>{item.desc}</span>
                    <span style={{background:"#4ade8015",border:"1px solid #4ade8030",borderRadius:3,padding:"1px 6px",fontSize:10,color:"#4ade80",flexShrink:0}}>{item.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GUIDE */}
        {view==="guide" && (
          <div>
            <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"#3a6a8a",letterSpacing:3,marginBottom:12}}>▸ HƯỚNG DẪN CHUYÊN ĐỀ MMT 1</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:10}}>
              {[
                {t:"🐍 Python Quick Ref",c:"#4ade80",items:["python3 --version","pip install requests pandas","import requests, json","response.json() → dict","json.dump(data, f, indent=2)","f-string: f'{var} text'"]},
                {t:"🌐 APIC-EM API",c:"#38bdf8",items:["BASE: https://sandboxapicem.cisco.com","POST /api/v1/ticket → token","GET /api/v1/network-device","GET /api/v1/topology/physical-topology","POST /api/v1/flow-analysis","Header: X-Auth-Token: <token>"]},
                {t:"🔧 Postman Tips",c:"#fb923c",items:["New Request → POST Auth first","Copy serviceTicket value","Set Environment Variable: token","Use {{token}} in headers","Save to Collection","Export để nộp bài"]},
                {t:"🧪 Debug Python",c:"#c084fc",items:["print(response.status_code)","print(response.json())","import pdb; pdb.set_trace()","try/except requests.exceptions","requests.packages.urllib3.disable_warnings()","response.raise_for_status()"]},
                {t:"📁 Project Structure",c:"#f472b6",items:["network_manager.py (main class)","config.py (BASE_URL, credentials)","utils.py (helpers)","reports/ (output files)","tests/ (test scripts)","README.md (documentation)"]},
                {t:"📝 Báo Cáo Nhóm",c:"#34d399",items:["Format: PDF, Arial 12, 1.5 spacing","Trang bìa + Mục lục bắt buộc","Code: monospace font, có comment","Screenshots: annotated","Min 10 trang nội dung","Slide: 10 slide, 10 phút trình bày"]},
              ].map((card,i)=>(
                <div key={i} style={{background:"#040f18",border:`1px solid ${card.c}22`,borderLeft:`3px solid ${card.c}`,borderRadius:7,padding:"12px"}}>
                  <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:12,color:card.c,marginBottom:8}}>{card.t}</div>
                  {card.items.map((item,j)=><div key={j} style={{display:"flex",gap:5,marginBottom:4}}><span style={{color:card.c,fontSize:10,flexShrink:0,marginTop:2}}>▸</span><code style={{fontSize:11,color:"#6a9aba",lineHeight:1.5,fontFamily:"Share Tech Mono,monospace",wordBreak:"break-all"}}>{item}</code></div>)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [course, setCourse] = useState("ngn"); // "ngn" | "sdn"

  useEffect(() => {
    if (localStorage.getItem("auth") === "true") setLoggedIn(true);
  }, []);

  if (!loggedIn) return <Login onLogin={()=>setLoggedIn(true)} />;

  return (
    <div style={{background:"#020d18", minHeight:"100vh", fontFamily:"'Share Tech Mono','Courier New',monospace", color:"#c0d8f0", width:"100%", overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#020d18}
        ::-webkit-scrollbar-thumb{background:#00d4ff22;border-radius:2px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        .fade{animation:fadeIn 0.2s ease}
        @keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
        .pulse{animation:pulse 2.5s infinite}
        pre{white-space:pre-wrap;word-break:break-all;font-family:'Share Tech Mono',monospace}
        button{cursor:pointer;font-family:inherit}
      `}</style>

      {/* HEADER */}
      <div style={{background:"linear-gradient(180deg,#091e30 0%,#020d18 100%)", borderBottom:"1px solid #00d4ff1a", padding:"10px 16px", display:"flex", alignItems:"center", gap:10}}>
        <div style={{width:38, height:38, borderRadius:7, background:"#00d4ff12", border:"1.5px solid #00d4ff33", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0}}>🌐</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"Rajdhani,sans-serif", fontWeight:700, fontSize:15, color:"#00d4ff", letterSpacing:2}}>DLU NETWORK LAB PORTAL</div>
          <div style={{fontSize:11, color:"#1a5a7a", marginTop:1}}>Trường Đại học Đà Lạt · Khoa CNTT</div>
        </div>
        <div style={{display:"flex", gap:4, flexWrap:"wrap", justifyContent:"flex-end"}}>
          {[["🟢","IPv6","#10b981"],["🐍","SDN","#38bdf8"],["📞","VoIP","#a855f7"]].map(([e,l,c])=>(
            <div key={l} style={{background:"#0a1e2a", border:`1px solid ${c}33`, borderRadius:10, padding:"2px 8px", fontSize:11, color:c, display:"flex", gap:3, alignItems:"center"}}>
              <span className="pulse">{e}</span><span>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* INSTRUCTOR BAR */}
      <div style={{background:"#040f1c", borderBottom:"1px solid #0a2a40", padding:"6px 16px", display:"flex", gap:8, alignItems:"center", fontSize:11, flexWrap:"wrap"}}>
        <span>👨‍🏫</span>
        <span style={{color:"#00d4ff", fontWeight:"bold"}}>Trần Vĩnh Phúc</span>
        <span style={{color:"#1a3a5a"}}>|</span>
        <a href="mailto:phuctv@dlu.edu.vn" style={{color:"#10b981", textDecoration:"none"}}>phuctv@dlu.edu.vn</a>
        <span style={{color:"#1a3a5a"}}>|</span>
        <span style={{color:"#3a6a8a"}}>Vũ Minh Quan</span>
        <span style={{color:"#1a3a5a"}}>|</span>
        <a href="mailto:quanvm@dlu.edu.vn" style={{color:"#38bdf8", textDecoration:"none"}}>quanvm@dlu.edu.vn</a>
        <div style={{marginLeft:"auto", background:"#0a1e2a", border:"1px solid #00d4ff1a", borderRadius:10, padding:"2px 10px", fontSize:11, color:"#4a8a9a", whiteSpace:"nowrap"}}>2 Môn học · 31 Labs</div>
      </div>

      {/* COURSE SWITCHER */}
      <div style={{padding:"12px 14px 0", background:"#030c18", borderBottom:"1px solid #0a2a40"}}>
        <div style={{display:"flex", gap:6, marginBottom:0}}>
          <button onClick={()=>setCourse("ngn")} style={{
            background: course==="ngn" ? "#041a2a" : "#020910",
            border: course==="ngn" ? "1px solid #00d4ff" : "1px solid #0a2030",
            borderBottom: course==="ngn" ? "1px solid #041a2a" : "1px solid #0a2030",
            borderRadius:"8px 8px 0 0", color: course==="ngn" ? "#00d4ff" : "#3a6a8a",
            padding:"8px 16px", fontSize:12, fontWeight:700, transition:"all 0.2s",
            display:"flex", alignItems:"center", gap:6
          }}>
            🌐 <span style={{fontFamily:"Rajdhani,sans-serif", letterSpacing:1}}>MẠNG THẾ HỆ MỚI & VoIP</span>
            <span style={{background:course==="ngn"?"#00d4ff20":"#1a3a5a30", borderRadius:10, padding:"0 6px", fontSize:10}}>NGN/IPv6</span>
          </button>
          <button onClick={()=>setCourse("sdn")} style={{
            background: course==="sdn" ? "#041a2a" : "#020910",
            border: course==="sdn" ? "1px solid #38bdf8" : "1px solid #0a2030",
            borderBottom: course==="sdn" ? "1px solid #041a2a" : "1px solid #0a2030",
            borderRadius:"8px 8px 0 0", color: course==="sdn" ? "#38bdf8" : "#3a6a8a",
            padding:"8px 16px", fontSize:12, fontWeight:700, transition:"all 0.2s",
            display:"flex", alignItems:"center", gap:6
          }}>
            🧠 <span style={{fontFamily:"Rajdhani,sans-serif", letterSpacing:1}}>CHUYÊN ĐỀ MMT 1</span>
            <span style={{background:course==="sdn"?"#38bdf820":"#1a3a5a30", borderRadius:10, padding:"0 6px", fontSize:10}}>SDN/Python</span>
          </button>
        </div>
      </div>

      {/* COURSE CONTENT */}
      <div className="fade" key={course}>
        {course==="ngn" ? <NGNCourse /> : <SDNCourse />}
      </div>

      {/* FOOTER */}
      <div style={{borderTop:"1px solid #0a2a40", padding:"8px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:11, color:"#1a4a6a", flexWrap:"wrap", gap:6}}>
        <span>DLU Network Lab Portal</span>
        <span>© 2025 Đại học Đà Lạt · Khoa CNTT</span>
        <span>NGN/IPv6 · SDN/Python · VoIP</span>
      </div>
    </div>
  );
}