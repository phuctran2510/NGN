// ── Instructor ──────────────────────────────────────────────
export const instructor = {
  name: 'Phúc Trần',
  fullName: 'Trần Vĩnh Phúc',
  email: 'phuctv@dlu.edu.vn',
  phone: '0976 353 606',
  university: 'Đại học Đà Lạt (DLU)',
  dept: 'Khoa Công nghệ Thông tin',
  avatar: 'PT',
  expertise: ['NGN / IPv6', 'VoIP / Asterisk', 'Network Security', 'QoS', 'SDN'],
  bio: 'Giảng viên chuyên ngành Mạng Máy Tính & Viễn thông. Nghiên cứu về Mạng Thế Hệ Mới (NGN), IPv6, VoIP và an toàn mạng.',
}

// ── Quiz data ────────────────────────────────────────────────
export const QUIZ = [
  // === NGN / IPv6 ===
  {
    id:'q1', cat:'NGN/IPv6',
    q:'Lệnh nào bắt buộc phải cấu hình để bật IPv6 routing trên Cisco IOS?',
    opts:['ip routing','ipv6 unicast-routing','ipv6 cef','ipv6 enable'],
    ans:1, exp:'ipv6 unicast-routing kích hoạt IPv6 routing table. ipv6 cef bật Cisco Express Forwarding (khuyến nghị thêm vào). ipv6 enable chỉ bật IPv6 trên interface.'
  },
  {
    id:'q2', cat:'NGN/IPv6',
    q:'Địa chỉ IPv6 Link-Local được tự động tạo từ?',
    opts:['Địa chỉ IPv4','MAC address (EUI-64)','DHCPv6 server','Router Advertisement'],
    ans:1, exp:'SLAAC tự động tạo Link-Local FE80::/10 bằng cách kết hợp prefix FE80:: với EUI-64 (48-bit MAC mở rộng thành 64-bit bằng cách chèn FF:FE ở giữa và flip bit 7).'
  },
  {
    id:'q3', cat:'NGN/IPv6',
    q:'OSPFv3 khác OSPFv2 ở điểm nào quan trọng nhất?',
    opts:['Router ID dùng IPv6','Chạy trực tiếp trên IPv6, cấu hình per-interface','Không cần Area 0','Hỗ trợ VLSM'],
    ans:1, exp:'OSPFv3 cấu hình trực tiếp trên interface (ipv6 ospf 1 area 0) thay vì khai báo network. Router-ID vẫn là định dạng IPv4 (32-bit). OSPFv3 vẫn cần Area 0 Backbone.'
  },
  {
    id:'q4', cat:'NGN/IPv6',
    q:'BGP IPv6 cần lệnh gì để activate neighbor trong address-family ipv6?',
    opts:['neighbor X activate','neighbor X ipv6 activate','neighbor X send-community','no bgp default ipv4-unicast'],
    ans:0, exp:'Trong address-family ipv6, cần "neighbor X activate" để bật IPv6 session. Lệnh "no bgp default ipv4-unicast" cần thiết để ngăn BGP tự tạo IPv4 session mặc định.'
  },
  {
    id:'q5', cat:'NGN/IPv6',
    q:'MTU của tunnel 6in4 (Protocol 41) là bao nhiêu?',
    opts:['1500 bytes','1492 bytes','1480 bytes','1476 bytes'],
    ans:2, exp:'6in4 thêm 20-byte IPv4 header vào IPv6 packet. Do đó MTU = 1500 - 20 = 1480 bytes. GRE IPv6 có MTU = 1476 (1500 - 20 IPv4 - 4 GRE headers).'
  },
  {
    id:'q6', cat:'NGN/IPv6',
    q:'HSRPv2 khác HSRPv1 ở điểm nào quan trọng?',
    opts:['Priority cao hơn','Hỗ trợ IPv6 và group 0-4095','Failover nhanh hơn','Dùng Multicast khác'],
    ans:1, exp:'HSRPv2 hỗ trợ IPv6 (lệnh standby version 2 bắt buộc), group ID 0-4095 (v1 chỉ 0-255), dùng multicast 224.0.0.102 (v1 dùng 224.0.0.2).'
  },
  {
    id:'q7', cat:'NGN/IPv6',
    q:'DHCPv6 với M-flag=1 và O-flag=0 có ý nghĩa gì?',
    opts:['Client dùng SLAAC','Client dùng DHCPv6 stateful cho address','Client dùng DHCPv6 chỉ lấy DNS','Client không cần DHCPv6'],
    ans:1, exp:'M-flag (Managed)=1: client dùng DHCPv6 stateful để lấy địa chỉ IPv6. O-flag (Other)=1: lấy thêm DNS, domain từ DHCPv6. Nếu M=0,O=0: chỉ SLAAC.'
  },
  {
    id:'q8', cat:'NGN/IPv6',
    q:'Lệnh nào verify OSPFv3 neighbor đã đạt trạng thái FULL?',
    opts:['show ip ospf neighbor','show ipv6 ospf neighbor','show ospf neighbor detail','debug ipv6 ospf adj'],
    ans:1, exp:'"show ipv6 ospf neighbor" hiển thị neighbor state. FULL = adjacency hoàn chỉnh. DR/BDR election: FULL/DR, FULL/BDR. P2P link: FULL/  (không có DR/BDR).'
  },
  {
    id:'q9', cat:'NGN/IPv6',
    q:'Prefix 6to4 được tạo như thế nào từ địa chỉ IPv4 192.168.1.1?',
    opts:['2002:192:168:1::/48','2002:c0a8:0101::/48','2002:c0a8:01::/48','2002:192.168.1.1::/48'],
    ans:1, exp:'6to4: prefix 2002::/16 + hex(IPv4). 192=0xC0, 168=0xA8, 1=0x01, 1=0x01 → 2002:C0A8:0101::/48. Đây là cơ chế transition tự động không cần cấu hình tunnel đích.'
  },
  {
    id:'q10', cat:'NGN/IPv6',
    q:'Trong BGP multi-homing, AS-PATH prepend dùng để làm gì?',
    opts:['Tăng Local Preference','Giả lập đường đi dài hơn để traffic ưu tiên đường khác','Chặn prefix từ ISP','Cân bằng tải'],
    ans:1, exp:'AS-PATH prepend thêm AS number vào attribute, làm đường đi "dài hơn". BGP ưu tiên đường ngắn nhất → traffic sẽ đi qua ISP không có prepend. Dùng kết hợp Local Preference cho inbound/outbound.'
  },

  // === VoIP ===
  {
    id:'q11', cat:'VoIP',
    q:'SIP là gì và hoạt động ở tầng nào của OSI?',
    opts:['Giao thức Layer 2','Session Initiation Protocol - tầng Application (L7)','Giao thức truyền tải audio','Giao thức Layer 4'],
    ans:1, exp:'SIP (Session Initiation Protocol) - RFC 3261, hoạt động ở Application Layer (L7). SIP thiết lập, duy trì và kết thúc multimedia sessions. Audio/video thực sự truyền qua RTP (Layer 7, port động).'
  },
  {
    id:'q12', cat:'VoIP',
    q:'Codec G.711 có bandwidth bao nhiêu?',
    opts:['8 Kbps','16 Kbps','64 Kbps','128 Kbps'],
    ans:2, exp:'G.711 (PCM) - 64 Kbps, chất lượng cao nhất (MOS ~4.4), không nén. G.729 = 8 Kbps, nén nhiều hơn (MOS ~3.9). Tổng bandwidth thực tế ~80-87 Kbps khi tính RTP/UDP/IP headers.'
  },
  {
    id:'q13', cat:'VoIP',
    q:'DSCP value nào được dùng cho VoIP RTP traffic?',
    opts:['DSCP 0 (BE)','DSCP 26 (AF31)','DSCP 46 (EF)','DSCP 34 (AF41)'],
    ans:2, exp:'DSCP EF (Expedited Forwarding) = 46 (binary: 101110) dành cho VoIP RTP. EF đảm bảo jitter thấp và priority cao nhất. AF41=34 cho video conference, AF31=26 cho business data.'
  },
  {
    id:'q14', cat:'VoIP',
    q:'Cisco CME dùng giao thức nào để điều khiển IP Phone?',
    opts:['SIP','SCCP (Skinny)','H.323','MGCP'],
    ans:1, exp:'Cisco CME mặc định dùng SCCP (Skinny Client Control Protocol) - giao thức độc quyền của Cisco. CME cũng hỗ trợ SIP với lệnh "voice register global" + "mode cme". SCCP cần ephone + ephone-dn config.'
  },
  {
    id:'q15', cat:'VoIP',
    q:'Lệnh nào kiểm tra IP Phone đã đăng ký với Cisco CME?',
    opts:['show voice register all','show ephone registered','show telephony-service','show call active voice'],
    ans:1, exp:'"show ephone registered" hiển thị IP Phone đã đăng ký với CME: MAC, IP, extension, codec. "show ephone" không có tham số hiển thị tất cả. "show voice register all" dùng cho SIP phones trong CME.'
  },
  {
    id:'q16', cat:'VoIP',
    q:'Jitter buffer trong VoIP dùng để làm gì?',
    opts:['Tăng tốc độ đường truyền','Compensate biến động thời gian đến của các RTP packets','Nén audio','Mã hóa cuộc gọi'],
    ans:1, exp:'Jitter là sự biến động trong thời gian truyền packet. Jitter buffer giữ packets một khoảng thời gian ngắn để sắp xếp lại thứ tự và phát đều đặn. Quá nhỏ → packet loss, quá lớn → tăng latency.'
  },
  {
    id:'q17', cat:'VoIP',
    q:'FreePBX dùng giao thức SIP driver nào hiện đại nhất?',
    opts:['chan_sip','chan_pjsip','chan_iax2','chan_dahdi'],
    ans:1, exp:'chan_pjsip là SIP driver hiện đại trong Asterisk 13+, thay thế chan_sip (deprecated). pjsip hỗ trợ TLS, SRTP, WebRTC, multi-registration tốt hơn. FreePBX 14+ khuyến nghị dùng pjsip.'
  },
  {
    id:'q18', cat:'VoIP',
    q:'MOS (Mean Opinion Score) tối thiểu cho chất lượng VoIP chấp nhận được là?',
    opts:['2.0','3.5','4.0','4.5'],
    ans:1, exp:'MOS scale 1-5. MOS ≥ 3.5 = acceptable quality. MOS ≥ 4.0 = good quality (G.711 mục tiêu). Dưới 3.5 người dùng cảm thấy chất lượng kém. Các yếu tố ảnh hưởng: codec, jitter, packet loss, latency.'
  },
  {
    id:'q19', cat:'VoIP',
    q:'Lệnh nào debug SIP messages trong Cisco IOS?',
    opts:['debug voip','debug ccsip messages','debug ephone detail','debug ip rtp'],
    ans:1, exp:'"debug ccsip messages" trace SIP INVITE, 200 OK, BYE... "debug ephone detail" trace SCCP phones. "debug voip ccapi inout" trace call processing. Cẩn thận: debug ảnh hưởng performance, dùng trên lab.'
  },
  {
    id:'q20', cat:'VoIP',
    q:'SIP INVITE message được dùng để làm gì?',
    opts:['Kết thúc cuộc gọi','Khởi tạo cuộc gọi, chứa SDP offer','Đăng ký với SIP server','Transfer cuộc gọi'],
    ans:1, exp:'SIP INVITE = khởi tạo session, chứa SDP (Session Description Protocol) mô tả codec, IP, port RTP. 200 OK = chấp nhận + SDP answer. ACK = xác nhận. BYE = kết thúc. REGISTER = đăng ký với SIP proxy.'
  },

  // === QoS ===
  {
    id:'q21', cat:'QoS',
    q:'Sự khác biệt giữa Traffic Shaping và Traffic Policing?',
    opts:['Shaping drop packets, Policing buffer','Shaping buffer packets, Policing drop hoặc re-mark','Cả hai đều drop','Cả hai đều buffer'],
    ans:1, exp:'Shaping: buffer (delay) traffic khi vượt rate → không drop, nhưng tăng latency/jitter. Policing: drop hoặc re-mark khi vượt rate → không buffer. VoIP cần Shaping (ít drop hơn), nhưng inbound dùng Policing.'
  },
  {
    id:'q22', cat:'QoS',
    q:'LLQ (Low Latency Queuing) ưu tiên traffic nào?',
    opts:['Tất cả traffic','Chỉ traffic được gán priority','HTTP traffic','BGP traffic'],
    ans:1, exp:'LLQ = Strict Priority Queue. Traffic trong class priority được phục vụ trước tiên, không phải đợi queue khác. Dùng cho VoIP EF. Cần police để tránh starve các class khác: "priority percent 15" = max 15% BW.'
  },
  {
    id:'q23', cat:'QoS',
    q:'WRED khác Tail-drop như thế nào?',
    opts:['WRED drop ngẫu nhiên sớm trước khi queue đầy','Tail-drop nhanh hơn','WRED chỉ dùng cho UDP','Không có sự khác biệt'],
    ans:0, exp:'WRED (Weighted Random Early Detection) drop packet ngẫu nhiên khi queue đạt minimum threshold, tăng xác suất drop đến maximum threshold. Tránh TCP synchronization (nhiều flows cùng giảm rate). Tail-drop chỉ drop khi queue đầy hoàn toàn.'
  },

  // === Multicast ===
  {
    id:'q24', cat:'Multicast',
    q:'PIM-SM cần thành phần nào để phân phối thông tin RP?',
    opts:['OSPF','BGP','BSR (Bootstrap Router)','HSRP'],
    ans:2, exp:'BSR (Bootstrap Router) tự động distribute thông tin Candidate-RP đến tất cả routers trong PIM domain. Thay thế Auto-RP (Cisco proprietary). BSR election: router với priority cao nhất hoặc IP cao nhất thắng.'
  },
  {
    id:'q25', cat:'Multicast',
    q:'MLDv2 tương đương với giao thức nào trong IPv4?',
    opts:['IGMPv2','IGMPv3','PIM-SM','DVMRP'],
    ans:1, exp:'MLD (Multicast Listener Discovery) là IPv6 equivalent của IGMP. MLDv1 = IGMPv2, MLDv2 = IGMPv3 (hỗ trợ SSM - Source Specific Multicast). MLDv2 cho phép host chỉ định source cụ thể muốn nhận.'
  },
]

// ── Exercises ────────────────────────────────────────────────
export const EXERCISES = [
  {
    id:'ex1', cat:'NGN/IPv6', diff:'easy', time:'45 phút',
    title:'Cấu hình IPv6 Dual-Stack cơ bản',
    desc:'Tạo topology 3 router nối tiếp. Cấu hình IPv6 unicast-routing, địa chỉ global và link-local trên tất cả interfaces. Verify ping IPv6 end-to-end.',
    steps:['Tạo topology: R1─R2─R3 trong EVE-NG','Enable: ipv6 unicast-routing + ipv6 cef trên 3 router','Cấu hình địa chỉ 2001:db8:12::/64 (R1-R2), 2001:db8:23::/64 (R2-R3)','Cấu hình link-local FE80::1, FE80::2, FE80::3','Verify: show ipv6 interface brief','Test: ping ipv6 từ R1 đến R3 source Lo0'],
    expected:'Ping IPv6 thành công, RTT < 5ms trong EVE-NG'
  },
  {
    id:'ex2', cat:'NGN/IPv6', diff:'medium', time:'90 phút',
    title:'OSPFv3 Single Area',
    desc:'Thêm OSPFv3 vào topology 4 router, tất cả trong Area 0. Cấu hình authentication IPsec.',
    steps:['Tạo topology: R1─R2─R3─R4 (ring)','Cấu hình OSPFv3 process 1 trên tất cả router','Thiết lập router-id thủ công (1.1.1.1 → 4.4.4.4)','Gán tất cả interfaces vào Area 0','Verify: show ipv6 ospf neighbor (tất cả FULL)','Cấu hình authentication: ipv6 ospf authentication ipsec','Test failover: shutdown interface, kiểm tra convergence'],
    expected:'4 routers FULL neighbor, routes học qua OSPFv3'
  },
  {
    id:'ex3', cat:'NGN/IPv6', diff:'hard', time:'150 phút',
    title:'BGP IPv6 Dual-ISP với Policy Routing',
    desc:'Cấu hình BGP multi-homing với 2 ISP, áp dụng policy Local Preference và AS-PATH prepend.',
    steps:['Setup 4 router: ISP-A, ISP-B, EDGE-R1, EDGE-R2','Cấu hình eBGP R1↔ISP-A (AS100), R2↔ISP-B (AS200)','Cấu hình iBGP R1↔R2 với update-source Loopback','address-family ipv6, network 2001:db8::/32','LP=200 cho ISP-A (primary path)','Prepend ×3 khi announce sang ISP-B','Verify failover: shutdown ISP-A, traffic sang ISP-B'],
    expected:'BGP Established, failover < 30s, AS-PATH prepend hoạt động'
  },
  {
    id:'ex4', cat:'VoIP', diff:'easy', time:'60 phút',
    title:'Cisco CME cơ bản - 4 IP Phones',
    desc:'Cài đặt Cisco CME, đăng ký 4 IP Phone SCCP, dial plan nội bộ.',
    steps:['Cấu hình telephony-service: max-ephones 10, max-dn 20','Thiết lập ip source-address và auto-reg-ephone','Tạo ephone-dn 1-4: số nội bộ 1001-1004','Đăng ký phones: show ephone registered','Test: phone 1001 gọi 1002','Cấu hình MoH với file âm thanh WAV'],
    expected:'4 phones registered, calls nội bộ thành công, MoH phát khi hold'
  },
  {
    id:'ex5', cat:'VoIP', diff:'medium', time:'120 phút',
    title:'FreePBX - IVR và Ring Groups',
    desc:'Cài FreePBX, tạo IVR auto-attendant, ring groups và SIP trunk.',
    steps:['Cài FreePBX trên Ubuntu Server 20.04','Tạo extensions 2001-2010 (pjsip)','Cấu hình IVR với greeting: option 1→Sales, 2→Support','Tạo Ring Groups: Sales (2001-2003), Support (2004-2006)','Cấu hình SIP Trunk kết nối CME','Test: gọi vào IVR, routing đúng option','CDR: kiểm tra call records trong MySQL'],
    expected:'IVR routing đúng, cross-system calls CME↔FreePBX OK'
  },
  {
    id:'ex6', cat:'QoS', diff:'medium', time:'90 phút',
    title:'QoS End-to-End VoIP',
    desc:'Cấu hình QoS đầy đủ: marking tại edge, LLQ cho voice, shaping WAN.',
    steps:['Tạo class-map: VOIP-RTP (match dscp ef), VIDEO (match dscp af41)','Policy-map MARK-IN: set dscp ef cho RTP','Policy-map WAN-OUT: LLQ 15%, CBWFQ 25% video','Apply: input tại access, output tại WAN','Shape WAN: 100Mbps với nested policy','Test: iperf3 -6 fill bandwidth, đo jitter VoIP','show policy-map interface: verify counters'],
    expected:'VoIP jitter < 10ms, loss = 0% dưới congestion'
  },
  {
    id:'ex7', cat:'Security', diff:'hard', time:'120 phút',
    title:'IPv6 First-Hop Security',
    desc:'Triển khai RA Guard, DHCPv6 Snooping, Source Guard và uRPF.',
    steps:['Tạo RA Guard policy BLOCK-RA: device-role host','Apply BLOCK-RA trên tất cả access ports','Enable DHCPv6 Snooping: ipv6 dhcp snooping','Trust uplink port: ipv6 dhcp snooping trust','IPv6 Source Guard: ipv6 source-guard trên access ports','uRPF: ipv6 verify unicast source reachable-via rx','Test: Scapy gửi RA flood, kiểm tra bị chặn'],
    expected:'Rogue RA 100% bị chặn, DHCPv6 spoofing thất bại'
  },
  {
    id:'ex8', cat:'Multicast', diff:'hard', time:'150 phút',
    title:'PIM-SM với Anycast RP',
    desc:'Triển khai PIM-SM, BSR, Anycast RP cho IPTV multicast.',
    steps:['Enable: ipv6 multicast-routing trên tất cả routers','PIM-SM: ipv6 pim sparse-mode tất cả interfaces','Anycast RP: 2 RP cùng địa chỉ 2001:db8:FF:RP::1','BSR: candidate bsr priority 100','SSM: ipv6 pim ssm default (FF3x::)','Test: nguồn gửi multicast, 5 receivers join','Failover: shutdown RP1, kiểm tra RP2 tiếp quản'],
    expected:'show ipv6 mroute: (*,G) và (S,G) entries, RP failover < 5s'
  },
]

// ── Resources ────────────────────────────────────────────────
export const RESOURCES = [
  {
    cat: 'Tài liệu RFC & Tiêu chuẩn',
    items: [
      { name:'RFC 8200 — IPv6 Specification', url:'https://tools.ietf.org/html/rfc8200', desc:'Đặc tả IPv6 chính thức, thay thế RFC 2460' },
      { name:'RFC 4291 — IPv6 Addressing Architecture', url:'https://tools.ietf.org/html/rfc4291', desc:'Quy tắc địa chỉ IPv6, loại địa chỉ' },
      { name:'RFC 5340 — OSPFv3', url:'https://tools.ietf.org/html/rfc5340', desc:'OSPF cho IPv6' },
      { name:'RFC 4271 — BGP-4', url:'https://tools.ietf.org/html/rfc4271', desc:'Border Gateway Protocol phiên bản 4' },
      { name:'RFC 3261 — SIP', url:'https://tools.ietf.org/html/rfc3261', desc:'Session Initiation Protocol - giao thức VoIP chính' },
      { name:'RFC 3550 — RTP', url:'https://tools.ietf.org/html/rfc3550', desc:'Real-time Transport Protocol cho audio/video' },
      { name:'RFC 4566 — SDP', url:'https://tools.ietf.org/html/rfc4566', desc:'Session Description Protocol' },
      { name:'RFC 4271 — BGP-4', url:'https://tools.ietf.org/html/rfc4271', desc:'BGP Multi-Protocol Extensions' },
    ]
  },
  {
    cat: 'Cisco Documentation',
    items: [
      { name:'Cisco IPv6 Configuration Guide', url:'https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipv6/configuration/xe-16/ipv6-xe-16-book.html', desc:'Hướng dẫn cấu hình IPv6 trên IOS XE' },
      { name:'Cisco CME 12.x Admin Guide', url:'https://www.cisco.com/c/en/us/td/docs/voice_ip_comm/cucme/admin/configuration/guide/cmeadm.html', desc:'Hướng dẫn quản trị Cisco Unified CME' },
      { name:'Cisco QoS Configuration Guide', url:'https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/qos_classn/configuration/xe-16/qos-classn-xe-16-book.html', desc:'Cấu hình QoS trên IOS XE' },
      { name:'Cisco OSPFv3 Guide', url:'https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/configuration/xe-16/iro-xe-16-book.html', desc:'OSPFv3 và IPv6 routing' },
    ]
  },
  {
    cat: 'Sách tham khảo',
    items: [
      { name:'IPv6 Fundamentals (Cisco Press)', url:'https://www.ciscopress.com/store/ipv6-fundamentals-9781587144776', desc:'Rick Graziani - Nền tảng IPv6 toàn diện' },
      { name:'VoIP Hacks (O\'Reilly)', url:'https://www.oreilly.com/library/view/voip-hacks/0596101333/', desc:'Hướng dẫn thực hành VoIP với Asterisk' },
      { name:'NGN Architectures (Wiley)', url:'https://www.wiley.com/en-us/Next+Generation+Networks-p-9780470019382', desc:'Kiến trúc mạng thế hệ mới' },
      { name:'Definitive Guide to Asterisk', url:'https://www.oreilly.com/library/view/asterisk-the-definitive/9781492031598/', desc:'Hướng dẫn Asterisk toàn diện (FreePBX)' },
      { name:'IP Quality of Service (Cisco Press)', url:'https://www.ciscopress.com/store/ip-quality-of-service-9781578701124', desc:'Pawan Bharat - QoS cho enterprise networks' },
    ]
  },
  {
    cat: 'Công cụ & Phần mềm Lab',
    items: [
      { name:'EVE-NG Community', url:'https://www.eve-ng.net/', desc:'Network emulator - dùng cho tất cả labs trong môn học' },
      { name:'Wireshark', url:'https://www.wireshark.org/', desc:'Packet analyzer - phân tích IPv6, SIP, RTP' },
      { name:'iperf3', url:'https://iperf.fr/', desc:'Đo bandwidth và jitter cho VoIP QoS testing' },
      { name:'FreePBX Distro', url:'https://www.freepbx.org/downloads/', desc:'VoIP PBX platform dựa trên Asterisk' },
      { name:'Linphone / Zoiper', url:'https://www.linphone.org/', desc:'SIP softphone để test VoIP' },
      { name:'Scapy', url:'https://scapy.net/', desc:'Packet crafting - test IPv6 security (RA flood, DHCPv6)' },
      { name:'Zabbix', url:'https://www.zabbix.com/', desc:'Network monitoring - SNMPv3, ICMP, JMX' },
    ]
  },
  {
    cat: 'Khóa học & Video',
    items: [
      { name:'IPv6.he.net Certification', url:'https://ipv6.he.net/certification/', desc:'Hurricane Electric - Chứng chỉ IPv6 miễn phí, 6 cấp độ' },
      { name:'Cisco Netacad - CCNA', url:'https://www.netacad.com/', desc:'Khóa học CCNA IPv6 có phần mô phỏng' },
      { name:'Professor Messer (CompTIA Network+)', url:'https://www.professormesser.com/', desc:'Video IPv6, VoIP, QoS miễn phí' },
      { name:'David Bombals YouTube', url:'https://www.youtube.com/c/DavidBombal', desc:'EVE-NG tutorials, CCNP IPv6 labs' },
      { name:'VoIP-Info.org', url:'https://www.voip-info.org/', desc:'Wiki VoIP toàn diện: Asterisk, SIP, codecs' },
    ]
  },
]

// ── Theory sections ──────────────────────────────────────────
export const THEORY = [
  {
    id:'t1', cat:'NGN', title:'Mạng Thế Hệ Mới (NGN) — Tổng quan',
    sections:[
      {
        id:'t1-1', title:'NGN là gì?',
        content:`## Mạng Thế Hệ Mới (Next Generation Network)

NGN là kiến trúc mạng viễn thông hội tụ, truyền tải tất cả dịch vụ (thoại, dữ liệu, video) trên nền IP duy nhất.

### Đặc điểm chính của NGN

- **Packet-based**: Tất cả traffic truyền dạng gói tin IP (không phải circuit-switching)
- **Convergence**: Hội tụ mạng cố định, di động, internet trên 1 hạ tầng
- **Service separation**: Tách biệt dịch vụ (service layer) khỏi hạ tầng (transport layer)
- **Openness**: Giao diện mở, chuẩn hóa quốc tế (SIP, H.248, Megaco)
- **IPv6 native**: Thiết kế cho IPv6, không gian địa chỉ vô hạn

### So sánh PSTN vs NGN

| Tiêu chí | PSTN (legacy) | NGN |
|---------|-------------|-----|
| Chuyển mạch | Circuit-switching | Packet-switching |
| Giao thức | SS7, ISDN | SIP, H.323, Megaco |
| Địa chỉ | Số điện thoại | URI (sip:user@domain) |
| QoS | Dedicated circuit | DiffServ, DSCP |
| Tích hợp | Khó | Dễ (web, app, API) |
| Chi phí | Cao | Thấp (commodity HW) |

### Kiến trúc phân lớp NGN

\`\`\`
┌─────────────────────────────────┐
│      Service/Application Layer   │ ← SIP Server, IVR, WebRTC
├─────────────────────────────────┤
│         Control Layer            │ ← Softswitch, MGC, SBC  
├─────────────────────────────────┤
│         Transport Layer          │ ← IPv6, MPLS, QoS
├─────────────────────────────────┤
│         Access Layer             │ ← xDSL, GPON, LTE, WiFi
└─────────────────────────────────┘
\`\`\`

### ITU-T Recommendations về NGN

- **Y.2001**: Khái niệm và nguyên tắc chung NGN
- **Y.2011**: Kiến trúc chức năng NGN
- **Y.2012**: Khả năng chức năng NGN
- **Y.2021**: IMS (IP Multimedia Subsystem) cho NGN`
      },
      {
        id:'t1-2', title:'IPv6 — Lý do và lợi ích',
        content:`## Tại sao cần IPv6?

### Vấn đề cạn kiệt IPv4

IPv4 chỉ có ~4.3 tỷ địa chỉ (2^32). IANA phân phối hết địa chỉ IPv4 tháng 2/2011. Các khu vực đã cạn kiệt:
- APNIC (Châu Á): Tháng 4/2011
- RIPE NCC (Châu Âu): Tháng 9/2012  
- LACNIC (Mỹ Latin): Tháng 6/2014

### Không gian địa chỉ IPv6

- **128-bit**: 2^128 ≈ 3.4 × 10^38 địa chỉ
- Đủ cho 670 triệu tỷ địa chỉ mỗi mm² bề mặt Trái Đất
- Mỗi thiết bị IoT có địa chỉ riêng không cần NAT

### Cải tiến kỹ thuật so với IPv4

| Tính năng | IPv4 | IPv6 |
|-----------|------|------|
| Địa chỉ | 32-bit (4.3B) | 128-bit (3.4×10^38) |
| Header | Variable, 20-60 bytes | Fixed 40 bytes |
| Fragmentation | Routers & hosts | Chỉ hosts (Path MTU) |
| ARP | Broadcast ARP | NDP (Multicast) |
| DHCP | Tùy chọn | SLAAC + DHCPv6 |
| IPsec | Tùy chọn | Tích hợp (khuyến nghị) |
| Autoconfiguration | Không | SLAAC tự động |
| QoS | ToS/DSCP | Flow Label (20-bit) |

### Cấu trúc header IPv6

\`\`\`
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Version| Traffic Class |           Flow Label                  |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Payload Length        |  Next Header  |   Hop Limit   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                                                               +
|                         Source Address                        |
+                         (128 bits)                            +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                                                               +
|                      Destination Address                      |
+                         (128 bits)                            +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
\`\`\`

### Loại địa chỉ IPv6

- **Global Unicast (2000::/3)**: Tương đương IPv4 public — routable trên internet
- **Link-Local (FE80::/10)**: Chỉ trong 1 link — OSPF, NDP dùng link-local
- **Unique Local (FC00::/7)**: Tương đương RFC1918 private — routing nội bộ
- **Multicast (FF00::/8)**: Thay thế broadcast IPv4
- **Loopback (::1/128)**: Tương đương 127.0.0.1`
      },
      {
        id:'t1-3', title:'NDP — Neighbor Discovery Protocol',
        content:`## NDP thay thế ARP trong IPv6

NDP (Neighbor Discovery Protocol - RFC 4861) thực hiện nhiều chức năng hơn ARP trong IPv4.

### 5 loại ICMPv6 message của NDP

| Message | Type | Chức năng |
|---------|------|-----------|
| Router Solicitation (RS) | 133 | Host yêu cầu RA ngay lập tức |
| Router Advertisement (RA) | 134 | Router thông báo prefix, gateway |
| Neighbor Solicitation (NS) | 135 | Hỏi MAC address (thay ARP Request) |
| Neighbor Advertisement (NA) | 136 | Trả lời MAC (thay ARP Reply) |
| Redirect | 137 | Thông báo đường đi tốt hơn |

### Solicited-Node Multicast

NDP dùng multicast thay vì broadcast để tìm MAC:
\`\`\`
IPv6: 2001:db8::1234:5678
Solicited-node: FF02::1:FF34:5678
(Lấy 24-bit cuối: 34:5678)
\`\`\`

Chỉ host có địa chỉ matching phải xử lý → giảm tải so với ARP broadcast.

### SLAAC — Stateless Address Autoconfiguration

\`\`\`
1. Host gửi RS (FF02::2 — All-Routers multicast)
2. Router trả RA chứa: prefix 2001:db8:1::/64, MTU, lifetime
3. Host tạo địa chỉ: prefix + EUI-64 (từ MAC)
4. DAD (Duplicate Address Detection): NS tự địa chỉ mình
5. Nếu không ai NA → địa chỉ là duy nhất → dùng được
\`\`\`

### Bảo mật NDP: RA Guard

RA Guard chặn RA giả mạo từ hosts:
\`\`\`
ipv6 nd raguard policy BLOCK-RA
  device-role host
interface range Gi0/1-24  
  ipv6 nd raguard attach-policy BLOCK-RA
\`\`\``
      }
    ]
  },
  {
    id:'t2', cat:'VoIP', title:'Voice over IP — Nền tảng',
    sections:[
      {
        id:'t2-1', title:'Kiến trúc VoIP',
        content:`## Tổng quan Voice over IP

VoIP (Voice over Internet Protocol) truyền thoại qua mạng IP thay vì mạng PSTN truyền thống.

### Các thành phần chính

\`\`\`
┌──────────┐    SIP/H.323    ┌──────────────┐    SIP/H.323    ┌──────────┐
│ IP Phone ├─────────────────┤  SIP Proxy   ├─────────────────┤ IP Phone │
└────┬─────┘                 │  (Call Agent)│                 └─────┬────┘
     │ RTP Audio/Video        └──────────────┘     RTP Audio/Video  │
     └─────────────────────────────────────────────────────────────┘
\`\`\`

### Giao thức signaling vs media

| Loại | Giao thức | Port | Chức năng |
|------|-----------|------|-----------|
| Signaling | SIP | UDP/TCP 5060, TLS 5061 | Setup/teardown call |
| Signaling | H.323 | TCP 1720 | Legacy VoIP |
| Signaling | SCCP | TCP 2000 | Cisco proprietary |
| Media | RTP | UDP dynamic (16384-32767) | Audio/Video stream |
| Media | RTCP | UDP (RTP+1) | Control, statistics |
| Media | SRTP | UDP dynamic | Encrypted RTP |

### Luồng cuộc gọi SIP

\`\`\`
Caller          SIP Proxy        Callee
  │─── INVITE ────→│────INVITE ────→│
  │←─── 100 Trying ─┤               │
  │               │←──── 180 Ringing│
  │←── 180 Ringing─┤               │
  │               │←──── 200 OK ────│
  │←─── 200 OK ────┤               │
  │─────────────────────── ACK ────→│
  │═══════════════ RTP Audio ═══════│ (peer-to-peer)
  │─────────────────────── BYE ────→│
  │←────────────────────── 200 OK ──│
\`\`\`

### Codec và chất lượng

| Codec | Bitrate | MOS | Ứng dụng |
|-------|---------|-----|---------|
| G.711 (ulaw/alaw) | 64 Kbps | 4.4 | PSTN replacement, LAN |
| G.729 | 8 Kbps | 3.9 | WAN bandwidth saving |
| G.722 | 48-64 Kbps | 4.5 | HD voice, wideband |
| G.726 | 16-40 Kbps | 3.8-4.0 | Adaptive |
| Opus | 6-510 Kbps | 4.5+ | WebRTC, modern |`
      },
      {
        id:'t2-2', title:'SIP — Session Initiation Protocol',
        content:`## SIP - RFC 3261

SIP là giao thức Application Layer dùng text-based (như HTTP) để thiết lập multimedia sessions.

### SIP Messages

**Requests (Methods):**
- REGISTER — Đăng ký địa chỉ với SIP server
- INVITE — Mời join session (gọi điện)
- ACK — Xác nhận nhận INVITE response
- BYE — Kết thúc session
- CANCEL — Hủy INVITE đang xử lý
- OPTIONS — Query khả năng của server
- INFO — Gửi thông tin trong session (DTMF)

**Response codes:**
- 1xx — Provisional (100 Trying, 180 Ringing)
- 2xx — Success (200 OK)
- 3xx — Redirection
- 4xx — Client Error (401 Unauthorized, 403 Forbidden, 404 Not Found)
- 5xx — Server Error
- 6xx — Global Failure (600 Busy Everywhere)

### SIP URI và Addressing

\`\`\`
sip:user@domain.com           ← Standard SIP URI
sip:alice@192.168.1.100:5060  ← Direct IP
sips:bob@secure.example.com   ← SIP over TLS
tel:+84976353606              ← Telephone URI
\`\`\`

### SIP REGISTER Message

\`\`\`
REGISTER sip:dlu.edu.vn SIP/2.0
Via: SIP/2.0/UDP 192.168.1.10:5060
From: <sip:alice@dlu.edu.vn>;tag=abc123
To: <sip:alice@dlu.edu.vn>
Call-ID: unique-call-id@192.168.1.10
CSeq: 1 REGISTER
Contact: <sip:alice@192.168.1.10:5060>
Expires: 3600
Content-Length: 0
\`\`\`

### SDP trong INVITE

\`\`\`
v=0
o=alice 2890844526 2890844526 IN IP6 2001:db8::1
s=VoIP Session
c=IN IP6 2001:db8::1
t=0 0
m=audio 49170 RTP/AVP 0 8 97
a=rtpmap:0 PCMU/8000     ← G.711 ulaw
a=rtpmap:8 PCMA/8000     ← G.711 alaw
a=rtpmap:97 iLBC/8000
\`\`\``
      },
      {
        id:'t2-3', title:'QoS cho VoIP',
        content:`## Quality of Service cho Voice

VoIP cực kỳ nhạy cảm với network quality. Cần QoS để đảm bảo chất lượng cuộc gọi.

### Ba tham số quan trọng

| Tham số | Ngưỡng tốt | Ngưỡng tối đa | Ảnh hưởng |
|---------|-----------|-------------|---------|
| Latency (one-way) | < 50ms | < 150ms | Delay cảm nhận |
| Jitter | < 10ms | < 30ms | Tiếng rè, ngắt quãng |
| Packet Loss | 0% | < 1% | Mất âm thanh |

### DiffServ và DSCP Marking

\`\`\`
 Bits: 7  6  5  4  3  2  1  0
      ┌──┬──┬──┬──┬──┬──┬──┬──┐
ToS:  │  │  │  │  │  │  │  │  │
      └──┴──┴──┴──┴──┴──┴──┴──┘
       ←── DSCP (6 bits) ──→←ECN→

DSCP EF  (101110) = 46  → VoIP RTP
DSCP AF41(100010) = 34  → Video
DSCP AF31(011010) = 26  → Business data  
DSCP CS1 (001000) = 8   → Scavenger
DSCP BE  (000000) = 0   → Best Effort
\`\`\`

### Cisco QoS MQC (Modular QoS CLI)

\`\`\`
! Step 1: Classify
class-map match-any VOIP-RTP
  match dscp ef
  match protocol rtp audio

! Step 2: Policy
policy-map WAN-EGRESS
  class VOIP-RTP
    priority percent 15       ← LLQ strict priority
    police rate percent 15    ← Prevent starvation
      conform-action transmit
      exceed-action drop
  class VIDEO-CONF
    bandwidth percent 25      ← CBWFQ
    random-detect dscp-based  ← WRED
  class class-default
    fair-queue

! Step 3: Apply
interface GigabitEthernet0/1
  service-policy output WAN-EGRESS
\`\`\`

### Tính toán bandwidth VoIP

G.711 với Ethernet:
\`\`\`
Audio payload:    160 bytes (20ms @ 64Kbps)
RTP header:        12 bytes
UDP header:         8 bytes
IP header:         20 bytes (IPv4) / 40 bytes (IPv6)
Ethernet header:   18 bytes (với 802.1Q)
─────────────────────────────
Total frame:      218 bytes (IPv4) / 238 bytes (IPv6)
Rate: 218 × 8 / 0.02s = 87,200 bps ≈ 87 Kbps/call (IPv4)
\`\`\``
      }
    ]
  },
]
