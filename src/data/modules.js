// MODULES data — giữ nguyên từ file gốc NGNApp.jsx
export const MODULES = [
  {
    id:1, color:"#00d4ff", dark:"#002a3f",
    title:"DEPLOY HẠ TẦNG IPv6 NGN",
    labs:"6 Labs", tags:["OSPFv3","BGP","Tunneling","DHCPv6","HSRP"],
    desc:"Xây dựng hạ tầng mạng thế hệ mới hoàn chỉnh trên nền IPv6.",
    labList:[
      { num:"1.1", name:"Thiết Lập EVE-NG & IPv6 Cơ Bản", dur:"90 phút", diff:1,
        deploy:["Cài EVE-NG Community 5.0+ trên VMware (RAM≥32GB, SSD 500GB)","Import Cisco IOL L3/L2 images vào /opt/unetlab/addons/iol/bin/","Chạy: /opt/unetlab/wrappers/unl_wrapper -a fixpermissions","Tạo topology 4 node: R1─R2─R3─R4 trên EVE-NG Web UI","Enable IPv6: ipv6 unicast-routing + ipv6 cef trên tất cả routers","Cấu hình địa chỉ IPv6 + link-local FE80:: trên từng interface","Verify: ping ipv6, show ipv6 neighbors, show ipv6 route"],
        cmds:`ipv6 unicast-routing\nipv6 cef\n!\ninterface GigabitEthernet0/0\n  ipv6 address 2001:db8:10:12::1/64\n  ipv6 address FE80::1 link-local\n  ipv6 enable\n  no shutdown\n!\nshow ipv6 interface brief\nshow ipv6 neighbors\nping ipv6 2001:db8:10:12::2 source Lo0`,
        topo:`R1(EDGE)─Gi0/0─R2(CORE)─Gi0/1─R3(DIST)\n                    |\n              R4(ACCESS)\nR1-Lo0: 2001:db8:FFFF:1::1/128\nR2-Lo0: 2001:db8:FFFF:2::1/128\nR1-Gi0/0: 2001:db8:10:12::1/64\nR2-Gi0/0: 2001:db8:10:12::2/64`,
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
      { num:"1.4", name:"IPv6 Tunneling (6in4/GRE/6to4)", dur:"100 phút", diff:2,
        deploy:["6in4: tunnel mode ipv6ip, src/dst IPv4, MTU 1480","GRE IPv6: tunnel mode gre ip, MTU 1476","ISATAP: tunnel mode ipv6ip isatap, EUI-64","6to4: tunnel mode ipv6ip 6to4, prefix 2002::/16","Test MTU: ping ipv6 extended df-bit size 1400"],
        cmds:`interface Tunnel0\n  ipv6 address 2001:db8:T1::1/64\n  tunnel source GigabitEthernet0/0\n  tunnel destination 192.168.2.1\n  tunnel mode ipv6ip\n  ipv6 mtu 1480\n!\ninterface Tunnel3\n  ipv6 address 2002:C0A8:0101::/48\n  tunnel mode ipv6ip 6to4\nipv6 route 2002::/16 Tunnel3`,
        topo:`R1(192.168.1.1)==[6in4 Proto41]==R2(192.168.2.1)\nTunnel0: 2001:db8:T1::1/64\nMTU: 6in4=1480, GRE=1476\n6to4 prefix = 2002:hex(IPv4)::/48`,
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
        topo:`DHCPv6 Server (CORE-R1)\n       | Relay\n  DIST-SW1 (Relay Agent)\n   |           |\nACC-SW1    ACC-SW2\n(DHCPv6    (SLAAC)`,
        result:["Clients nhận IPv6 via DHCPv6 stateful","SLAAC clients tự configure từ RA","DNS server được cấp đúng","show ipv6 dhcp binding: entries đầy đủ"],
        hints:["M-flag=1: dùng DHCPv6 cho address","O-flag=1: DHCPv6 cho DNS","Relay cần route đến DHCPv6 server","'debug ipv6 dhcp' trace messages"]
      }
    ]
  },
  {
    id:2, color:"#ff6b35", dark:"#2a1000",
    title:"IPv6 MULTICAST",
    labs:"4 Labs", tags:["PIM-SM","MLDv2","Anycast RP","BSR","SSM"],
    desc:"Triển khai hạ tầng multicast IPv6 cho IPTV và video conference.",
    labList:[
      { num:"2.1", name:"MLD - Multicast Listener Discovery", dur:"90 phút", diff:2,
        deploy:["Enable: ipv6 multicast-routing trên tất cả routers","MLDv2: ipv6 mld version 2 trên interfaces","Query: ipv6 mld query-interval 60","MLD Snooping switch: ipv6 mld snooping vlan 10","Static join: ipv6 mld join-group FF1E::100","Verify: show ipv6 mld groups"],
        cmds:`ipv6 multicast-routing\n!\ninterface GigabitEthernet0/1\n  ipv6 mld join-group FF1E::100\n  ipv6 mld query-interval 60\n  ipv6 mld version 2\n!\nipv6 mld snooping\nipv6 mld snooping vlan 10\n!\nshow ipv6 mld groups\nshow ipv6 mld interface Gi0/1`,
        topo:`Router (MLD Querier)\n     |\n Switch (MLD Snooping)\n  +──+──+\nHost1  Host2\n(Join FF1E::100)`,
        result:["show ipv6 mld groups: entries hiển thị","MLD Snooping ngăn flooding","MLDv2 hỗ trợ SSM","Query/Response cycle đúng"],
        hints:["MLDv1 = IGMPv2, MLDv2 = IGMPv3 cho IPv6","Snooping ngăn multicast flood","'debug ipv6 mld' xem messages","Solicited-node: FF02::1:FF00:0/104"]
      },
      { num:"2.2", name:"PIM-SM Full Deployment", dur:"150 phút", diff:3,
        deploy:["PIM-SM: ipv6 pim sparse-mode trên tất cả interfaces","RP tĩnh: ipv6 pim rp-address 2001:db8:FFFF:1::1","BSR: ipv6 pim bsr candidate bsr priority 100","Candidate RP: ipv6 pim bsr candidate rp","SSM: ipv6 pim ssm default (FF3x::/96)","Test: source gửi stream, receivers join"],
        cmds:`ipv6 multicast-routing\nipv6 pim rp-address 2001:db8:FFFF:1::1 FF1E::/16\n!\ninterface GigabitEthernet0/0\n  ipv6 pim sparse-mode\n!\nipv6 pim bsr candidate bsr 2001:db8:FFFF:2::1 priority 100\nipv6 pim ssm default\n!\nshow ipv6 pim neighbor\nshow ipv6 pim rp mapping\nshow ipv6 mroute`,
        topo:`Source─CORE-R1(RP)\n              |  CORE-R2(BSR)\n       +──────+──────+\n  DIST-SW1       DIST-SW2\nGroup: FF1E::STREAM`,
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
        topo:`VideoServer─[AF41]─Core─[CBWFQ 25%]─Receivers\nMoH─[239.0.0.1]─CME─Phones on hold\nDSCP: Video=AF41, Voice=EF, Data=AF31`,
        result:["Video DSCP AF41 end-to-end","WRED giảm congestion","MoH phát khi call bị hold","Jitter video < 30ms"],
        hints:["WRED drop sớm trước khi queue đầy","AF41 > AF31 > AF11 > BE","Kiểm tra MoH: gọi rồi hold","show queue Gi0/0 xem queue status"]
      }
    ]
  },
  {
    id:3, color:"#f59e0b", dark:"#1f1200",
    title:"QUALITY OF SERVICE (QoS)",
    labs:"5 Labs", tags:["DSCP","CBWFQ","LLQ","Shaping","WRED"],
    desc:"Đảm bảo chất lượng dịch vụ end-to-end cho VoIP, Video và dữ liệu.",
    labList:[
      { num:"3.1", name:"DSCP Marking & Classification", dur:"100 phút", diff:2,
        deploy:["Class-map VoIP: match dscp ef + rtp audio","Class-map Video: match dscp af41 + rtp video","IPv6 ACL: permit tcp src dst eq 1433","Policy-map MARK-IN: set dscp ef/af41","Apply input: service-policy input MARK-DSCP-IN"],
        cmds:`class-map match-any VOIP-RTP\n  match protocol rtp audio\n  match dscp ef\n!\nipv6 access-list CRITICAL-APPS\n  permit tcp 2001:db8:1::/48 any eq 1433\n!\npolicy-map MARK-DSCP-IN\n  class VOIP-RTP\n    set dscp ef\n  class class-default\n    set dscp default\n!\ninterface GigabitEthernet0/0\n  service-policy input MARK-DSCP-IN`,
        topo:`[Untrusted]─[Marking at Edge]─[Trusted Core]\nVoIP RTP   → DSCP EF  (46)\nVideo Conf → DSCP AF41(34)\nBusiness   → DSCP AF31(26)\nInternet   → DSCP BE  (0)`,
        result:["Traffic mark đúng DSCP","Counters tăng theo class","DSCP trust từ IP Phone","Re-marking tại untrusted ports"],
        hints:["DSCP trong IPv6 Traffic Class byte","match-any = OR, match-all = AND","Wireshark: ipv6 && ip.dsfield","show class-map xem config"]
      },
      { num:"3.2", name:"LLQ & CBWFQ Queuing", dur:"120 phút", diff:3,
        deploy:["LLQ VoIP: priority percent 15","Police LLQ: conform transmit, exceed drop","CBWFQ Video: bandwidth percent 25 + WRED","CBWFQ Business: bandwidth percent 30","Scavenger: bandwidth percent 5","Apply output: service-policy output WAN-QUEUING"],
        cmds:`policy-map WAN-QUEUING-OUT\n  class VOIP-RTP\n    priority percent 15\n    police rate percent 15\n      conform-action transmit\n      exceed-action drop\n  class VIDEO-CONF\n    bandwidth percent 25\n    random-detect dscp-based\n  class class-default\n    bandwidth percent 25\n    fair-queue\n!\nshow policy-map interface Gi0/0 output`,
        topo:`WAN Egress Interface\n+─LLQ 15%──VoIP EF (strict)\n+─CBWFQ 25%─Video AF41 (WRED)\n+─CBWFQ 30%─Business AF31\n+─CBWFQ 5%──Scavenger CS1\n+─Default 25%─Best Effort`,
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
        deploy:["IP Phone port: mls qos trust dscp","Data port: không trust, re-mark về BE","Auto QoS: auto qos voip cisco-phone","DSCP-to-CoS mapping","Verify chain phone─access─WAN"],
        cmds:`mls qos\n!\ninterface GigabitEthernet0/1\n  description IP-PHONE-PORT\n  mls qos trust dscp\n  switchport voice vlan 100\n  spanning-tree portfast\n!\nmls qos map dscp-to-cos 46 to 5\nmls qos map dscp-to-cos 34 to 4\n!\nshow mls qos interface Gi0/1`,
        topo:`Trust Boundary at Access Switch:\nIP Phone─[DSCP EF trusted]─Access─WAN\nPC──────[CoS 0─DSCP BE]──Access\n\nTrust: IP Phone DSCP preserved\nUntrust: PC re-marked to BE`,
        result:["VoIP DSCP EF preserved E2E","PC re-marked về BE","No DSCP từ end users","QoS consistent E2E"],
        hints:["Trust boundary ngăn users set DSCP cao","'auto qos voip' tự tạo policy","CoS = Layer 2, DSCP = Layer 3","show mls qos interface statistics"]
      },
      { num:"3.5", name:"QoS Verification & IP SLA", dur:"90 phút", diff:2,
        deploy:["Baseline: show policy-map interface","Simulate congestion: iperf3 fill 95%","IP SLA VoIP: udp-jitter target 16384","WRED tuning: adjust thresholds","Report: jitter, latency, loss per class"],
        cmds:`ip sla 1\n  udp-jitter 2001:db8:5:1::1 16384 codec g711ulaw\n  frequency 60\nip sla schedule 1 life forever start-time now\n!\nshow ip sla statistics 1\n!\n! iperf3 load test\niperf3 -c TARGET -6 -b 950M -t 60\n!\nrandom-detect dscp af41 25 45 8`,
        topo:`[IP SLA Probes] → all critical paths\n[iperf3] → 95% load test\nTargets:\n  VoIP: Jitter<10ms, Loss=0%\n  Video: Jitter<30ms, Loss<0.1%`,
        result:["IP SLA report jitter/loss","WRED giảm drops proactively","QoS OK dưới 95% load","Baseline vs loaded report"],
        hints:["IP SLA cần: ip sla responder","MOS target ≥ 4.0","show ip sla statistics sau 5 phút","Lower WRED threshold = earlier drops"]
      }
    ]
  },
  {
    id:4, color:"#7c3aed", dark:"#12004a",
    title:"VoIP - CISCO CME",
    labs:"4 Labs", tags:["SCCP","SIP","Dial-Plan","Conference","MoH"],
    desc:"Triển khai tổng đài IP nội bộ Cisco CME với đầy đủ tính năng enterprise.",
    labList:[
      { num:"4.1", name:"CME Setup & Phone Registration", dur:"120 phút", diff:2,
        deploy:["Cài IOS 15.x với voice feature set trên EVE-NG","telephony-service: max-ephones 50, max-dn 100","ip source-address X.X.X.X port 2000","auto-reg-ephone: tự đăng ký phone mới","ephone-dn 1 dual-line: số 1001, name Alice","ephone 1: mac-address, button 1:1"],
        cmds:`telephony-service\n  max-ephones 50\n  max-dn 100\n  ip source-address 10.0.100.1 port 2000\n  auto-reg-ephone\n  create cnf-files\n!\nephone-dn 1 dual-line\n  number 1001\n  name Alice\n!\nephone 1\n  mac-address 0004.F2AA.BB01\n  type 7960\n  button 1:1\n!\nshow ephone registered\nshow ephone summary`,
        topo:`CME Router (10.0.100.1)\n+─VLAN100─IP Phone 1001 (Alice)\n+─VLAN100─IP Phone 1002 (Bob)\n+─VLAN100─IP Phone 1003 (Carol)\nSCCP port: TCP 2000`,
        result:["Phones show 'registered'","show telephony-service: OK","Internal calls thành công","Conference 3 parties OK"],
        hints:["'create cnf-files' tạo config files cho phones","Phone cần DHCP để lấy IP và TFTP server","TFTP phải là IP của CME","Nếu phone không đăng ký: kiểm tra VLAN và DHCP"]
      },
      { num:"4.2", name:"Dial-Plan & PSTN Trunk", dur:"120 phút", diff:2,
        deploy:["Dial-peer voip: destination-pattern 1..., session target","Dial-peer POTS: port 0/0/0 cho PSTN","Translation-rules: 9T → PSTN number","Call forward: cfwd-all, cfwd-busy","Hunt group: pickup-group","Transfer & hold features"],
        cmds:`dial-peer voice 100 voip\n  destination-pattern 1...\n  session target ipv4:10.0.100.1\n  codec g711ulaw\n!\ndial-peer voice 901 pots\n  destination-pattern 9T\n  port 0/0/0\n  prefix 0\n!\nvoice translation-rule 1\n  rule 1 /^9\\(.*\\)$/ /\\1/\n!\nshow dial-peer voice summary`,
        topo:`IP Phone─CME─[dial-peer voip]─FreePBX\n              ─[dial-peer pots]─PSTN\nPattern: 1XXX=internal, 9T=PSTN\nTranslation: strip leading 9`,
        result:["Internal calls 1XXX OK","PSTN calls qua dial-peer pots","Translation rules đúng","Hunt group ring sequential"],
        hints:["'T' = wait for complete number","Digit-strip tự động bỏ leading digit","show dial-peer voice summary: verify","debug ccsip events xem SIP signaling"]
      },
      { num:"4.3", name:"SIP Trunk CME - FreePBX", dur:"120 phút", diff:3,
        deploy:["CME SIP trunk: voice service voip → sip","SIP server: sip-server ipv4:FreePBX-IP","Dial-peer SIP trunk: session protocol sipv2","FreePBX: Trunks → PJSIP trunk → SIP server CME","Outbound route: pattern 1XXX → CME trunk","Inbound route: từ CME → extension FreePBX"],
        cmds:`voice service voip\n  sip\n    registrar server expires max 600 min 60\n!\nvoice register global\n  mode cme\n  source-address 10.0.100.1 port 5060\n!\ndial-peer voice 200 voip\n  destination-pattern 2...\n  session protocol sipv2\n  session target ipv4:10.0.200.1\n  codec g711ulaw\n!\nshow sip-ua status registrar`,
        topo:`CME(1XXX)─[SIP Trunk]─FreePBX(2XXX)\nR1-10.0.100.1:5060 ↔ PBX-10.0.200.1:5060\nDial: 1001 gọi 2001 (cross-system)`,
        result:["SIP trunk UP","Cross calls CME↔FreePBX OK","show sip-ua: Registered","debug ccsip messages: 200 OK"],
        hints:["SIP port 5060 phải thông firewall","codec phải match 2 phía","'show sip-ua status' verify registration","Linphone/Zoiper để test từ PC"]
      },
      { num:"4.4", name:"MoH, Conference & Features", dur:"90 phút", diff:2,
        deploy:["MoH từ file WAV: moh flash:/moh.wav","Multicast MoH: 239.0.0.1 port 16384","Ad-hoc conference: max-conferences 8","Meetme conference: ephone-dn conference","Music on Hold khi transfer","Call park + pickup"],
        cmds:`telephony-service\n  moh enable-g711 flash:/moh.wav\n  multicast moh 239.0.0.1 port 16384\n  max-conferences 8 gain -6\n  transfer-system full-consult\n!\nephone-dn 100\n  number 8000\n  conference ad-hoc\n  no huntstop\n!\nshow ephone detail | include moh\nshow voice dsp group all`,
        topo:`Hold─MoH─[239.0.0.1]─Phones on hold\nConference: 3-party ad-hoc\nMeetme: 8000 (permanent bridge)`,
        result:["MoH phát khi hold","Conference 3 parties thành công","Call park/pickup hoạt động","Transfer consult OK"],
        hints:["WAV: 8kHz, mono, 8-bit G.711","Multicast MoH tiết kiệm BW","'gain -6' giảm volume MoH","show ephone | include conf"]
      }
    ]
  },
  {
    id:5, color:"#10b981", dark:"#001a10",
    title:"VoIP - FREEPBX / ASTERISK",
    labs:"3 Labs", tags:["FreePBX","pjSIP","IVR","CDR","Voicemail"],
    desc:"Triển khai hệ thống tổng đài mã nguồn mở FreePBX/Asterisk.",
    labList:[
      { num:"5.1", name:"Cài Đặt FreePBX & Cơ Bản", dur:"120 phút", diff:2,
        deploy:["Cài Ubuntu Server 20.04 LTS (EVE-NG hoặc VMware)","Download FreePBX 16 ISO hoặc script install","Chạy: bash -c \"$(curl -fsSL http://getfreepbx.org/install)\"","Truy cập: http://IP/admin → Setup wizard","Admin Module → Core, PJSIP, CDR","fwconsole reload để apply config"],
        cmds:`# Cài dependencies\napt update && apt install -y php curl wget\n\n# FreePBX install script\nbash -c "$(curl -fsSL http://getfreepbx.org/install)"\n\n# Sau install\nfwconsole ma upgradeall\nfwconsole reload\n\n# Verify\nasterisk -rx 'core show version'\nasterisk -rx 'pjsip show endpoints'`,
        topo:`FreePBX Server (Ubuntu)\n+─Admin: http://IP/admin\n+─SIP: UDP/TCP 5060\n+─RTP: UDP 10000-20000\n+─MySQL: localhost\n+─Asterisk 18/20`,
        result:["FreePBX web UI accessible","Asterisk running","Admin dashboard OK","Module admin show modules"],
        hints:["RAM ≥ 2GB cho FreePBX","Disable SELinux trên CentOS","fwconsole ma upgradeall update modules","ufw allow 5060/udp; ufw allow 10000:20000/udp"]
      },
      { num:"5.2", name:"Extensions, Trunks & IVR", dur:"120 phút", diff:2,
        deploy:["Extensions: Add pjSIP 2001-2010","SIP Trunk: Connectivity→Trunks→PJSIP trunk","Outbound Route: TO-CME, pattern 1XXX","Inbound Route: FROM-CME → IVR","IVR: Applications→IVR, record greeting","Ring Groups: sales (2001-2003), support (2004-2006)"],
        cmds:`sudo asterisk -rvvv\n\nCLI> pjsip show registrations\nCLI> pjsip show endpoints\nCLI> pjsip set logger on\n\n# Test call\nCLI> channel originate PJSIP/2001 extension 1001@from-internal\n\nCLI> dialplan show from-internal`,
        topo:`FreePBX Dialplan:\nInbound─IVR 9000\n  1─Ring Group: Sales (2001-2003)\n  2─Ring Group: Support (2004-2005)\n  0─Ext 2000 (Operator)\nOutbound:\n  1XXX─CME-Trunk`,
        result:["Extensions register từ Zoiper","SIP trunk CME↔FreePBX UP","IVR routing đúng","Cross-system calls OK"],
        hints:["Softphone: Zoiper Free hoặc Linphone","pjsip show endpoints: Online","pjsip set logger on: SIP INVITE","IVR: upload WAV mono 8kHz G.711"]
      },
      { num:"5.3", name:"CDR, Recording & Security", dur:"90 phút", diff:2,
        deploy:["Call Recording: Module Admin→CallRecording","CDR MySQL: /etc/asterisk/cdr_mysql.conf","CDR Reports: Admin→CDR Reports","Fail2ban: bảo vệ SIP brute-force","SIP TLS: enable WebRTC module","CSV export: CDR Reports→Download"],
        cmds:`# /etc/asterisk/cdr_mysql.conf\n[global]\nhostname=localhost\ndbname=asteriskcdrdb\ntable=cdr\npassword=secret\nuser=asterisk\n\nmysql -u asterisk -p asteriskcdrdb\nSELECT src,dst,disposition,duration\nFROM cdr ORDER BY calldate DESC LIMIT 20;\n\nsudo fail2ban-client status asterisk`,
        topo:`FreePBX Stack:\n+─CDR─MySQL(asteriskcdrdb)\n+─Recordings─/var/spool/asterisk/monitor/\n+─Logs─/var/log/asterisk/full\n+─Fail2ban─blocks brute-force\n+─Dashboard─Admin─System Status`,
        result:["CDR lưu vào MySQL","Recordings download từ GUI","Dashboard active calls","Fail2ban block sau 3 fail"],
        hints:["CDR lưu sau call kết thúc","Recording: wav49 nén hơn wav","Fail2ban: /var/log/fail2ban.log","fwconsole reload sau thay đổi"]
      }
    ]
  },
  {
    id:6, color:"#a855f7", dark:"#150025",
    title:"TÍCH HỢP TỔNG HỢP",
    labs:"3 Labs", tags:["Full NGN","Security","Monitoring","Integration"],
    desc:"Kết hợp tất cả thành phần thành hệ thống NGN hoàn chỉnh.",
    labList:[
      { num:"6.1", name:"Full System Integration", dur:"240 phút", diff:4,
        deploy:["Deploy theo thứ tự: L2─OSPFv3─BGP─Multicast─QoS","CME: register phones, test dial plan","FreePBX: extensions, SIP trunk CME","Cross-system: 1001 gọi 2001 (CME↔FreePBX)","E2E QoS: DSCP EF phone đến phone","Multicast: stream đến VLAN10,20"],
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
        cmds:`snmp-server group NGN-ADMIN v3 priv\nsnmp-server user admin NGN-ADMIN v3\n  auth sha AuthPass123\n  priv aes 256 PrivPass456\nsnmp-server host 2001:db8:1:999::10 version 3 priv admin\n!\nlogging 2001:db8:1:999::30\nlogging trap informational\n!\nip flow-export version 9\nip flow-export destination 2001:db8:1:999::20 9995`,
        topo:`Management VLAN999 (2001:db8:1:999::/64):\n+─NMS Zabbix: ::10\n+─Syslog: ::30\n+─NetFlow: ::20\n+─TFTP: ::40\nAll devices → SNMPv3/Syslog/NetFlow`,
        result:["SNMP polls thành công","Syslog tập trung OK","NetFlow dashboard traffic","Alerts khi BGP/interface down"],
        hints:["SNMPv3 priv mã hóa","Syslog: 0=emerg, 7=debug","NetFlow v9 hỗ trợ IPv6","Zabbix template: Cisco IOS SNMPv3"]
      }
    ]
  }
]
