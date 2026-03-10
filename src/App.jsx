import { useState } from "react";

const MODULES = [
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
        cmds:`ipv6 nd raguard policy BLOCK-RA\n  device-role host\ninterface range Gi0/1-24\n  ipv6 nd raguard attach-policy BLOCK-RA\n!\nipv6 dhcp snooping\nipv6 dhcp snooping vlan 10,20,100\ninterface GigabitEthernet0/25\n  ipv6 dhcp snooping trust\n!\ninterface GigabitEthernet0/1\n  ipv6 source-guard\n  ipv6 verify unicast source reachable-via rx\n!\nshow ipv6 nd raguard policy`,
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

const THESIS = [
  { id:1, icon:"🏢", color:"#00d4ff", level:"medium", dur:"6-8 tuần", team:"2-5 SV",
    title:"Mạng LAN Doanh Nghiệp Nhỏ IPv6 Dual-Stack",
    sub:"SME Dual-Stack LAN",
    overview:"Thiết kế mạng LAN 50-100 nhân viên với IPv6 dual-stack, OSPFv3, HSRP và VoIP cơ bản.",
    scope:["IPv6 dual-stack cho 3 VLAN","OSPFv3 single-area + HSRP","Cisco CME 20 IP phones","QoS 3 lớp: Voice/Video/Data","DHCPv6 và SLAAC"],
    topo:"ISP─BGP─EDGE-R1\n─OSPFv3─CORE-SW\n─VLAN10/20/100─ACCESS\n─CME(20 phones)",
    deploy:["Tuần 1-2: Thiết kế addressing, VLAN","Tuần 3-4: OSPFv3, HSRP, DHCPv6","Tuần 5-6: CME, QoS, testing","Tuần 7-8: Security, documentation"],
    result:["IPv6 E2E connectivity","VoIP MOS ≥ 3.8","HSRP failover < 5s","Dual-stack hoạt động"],
    tech:["Cisco IOL","OSPFv3","HSRPv2","CME","DHCPv6","QoS"]
  },
  { id:2, icon:"🎓", color:"#f59e0b", level:"medium", dur:"6-8 tuần", team:"2-5 SV",
    title:"Hệ Thống VoIP FreePBX cho Giáo Dục",
    sub:"Education VoIP Platform",
    overview:"FreePBX cho trường học với IVR tự động, call recording cho giảng dạy và voicemail-to-email.",
    scope:["50 extensions giảng viên + nhân viên","IVR: Tuyển sinh, Đào tạo, Hành chính","Call Recording cho hội thảo","Ring Groups theo phòng ban","Voicemail-to-Email"],
    topo:"FreePBX Server\n├─Ext 1XXX: Giảng viên\n├─Ext 2XXX: VP/Phòng ban\n├─IVR 9000: Auto Attendant\n└─SIP Trunk: PSTN",
    deploy:["Tuần 1-2: Cài FreePBX, ext plan","Tuần 3-4: IVR, Ring Groups","Tuần 5-6: Recording, Reporting","Tuần 7-8: Testing, docs"],
    result:["50 extensions ổn định","IVR routing 95%+","Recordings phục vụ đào tạo","CDR báo cáo chi phí"],
    tech:["FreePBX","Asterisk","PJSIP","IVR","CDR","Voicemail"]
  },
  { id:3, icon:"🔐", color:"#10b981", level:"medium", dur:"6-8 tuần", team:"2-5 SV",
    title:"Bảo Mật IPv6 First-Hop & Layer 2",
    sub:"IPv6 First-Hop Security",
    overview:"Phân tích tấn công RA flood, DHCPv6 spoofing và triển khai giải pháp phòng thủ.",
    scope:["Tấn công: RA flood, DHCPv6 rouge","RA Guard, DHCPv6 Snooping","IPv6 Source Guard, DAD Proxy","So sánh trước/sau bảo mật","Vulnerability assessment"],
    topo:"Attack Lab:\n[Attacker]─[Access SW]─[Victim]\nDefense:\n[RA Guard + DHCPv6 Snoop + uRPF]",
    deploy:["Tuần 1-2: Lab setup, nghiên cứu","Tuần 3-4: Thực hiện tấn công","Tuần 5-6: Deploy defenses","Tuần 7-8: Đánh giá, báo cáo"],
    result:["RA flood thành công lab","RA Guard chặn 100%","DHCPv6 Snooping OK","Report với recommendations"],
    tech:["Scapy","THC-IPv6","RA Guard","DHCPv6 Snooping","uRPF","Wireshark"]
  },
  { id:4, icon:"📊", color:"#a855f7", level:"medium", dur:"7-9 tuần", team:"2-5 SV",
    title:"Giám Sát NGN với Zabbix & ELK Stack",
    sub:"NGN Network Monitoring",
    overview:"Hệ thống giám sát toàn diện với Zabbix, ELK Stack, NetFlow và alerting tự động.",
    scope:["Zabbix 6.x SNMPv3 Cisco devices","ELK Stack Syslog aggregation","NetFlow v9 traffic patterns","IP SLA VoIP MOS probes","Alerting Telegram/Email"],
    topo:"Devices─SNMPv3─→Zabbix\n─Syslog─→ELK Stack\n─NetFlow─→Grafana\nAlert: Telegram Bot",
    deploy:["Tuần 1-2: Zabbix, Cisco templates","Tuần 3-4: ELK, Syslog","Tuần 5-6: NetFlow, Grafana","Tuần 7-9: IP SLA, alerting"],
    result:["Dashboard real-time","Syslog detect anomalies","NetFlow top talkers","VoIP MOS trend"],
    tech:["Zabbix","ELK","Grafana","NetFlow","SNMPv3","IP SLA"]
  },
  { id:5, icon:"🌍", color:"#ff6b35", level:"medium", dur:"8-10 tuần", team:"3-5 SV",
    title:"Campus Đa Tòa Nhà IPv6 cho Đại Học",
    sub:"Campus Network IPv6",
    overview:"Campus 3 tòa nhà với IPv6, WAN redundancy, QoS cho e-learning và VoIP.",
    scope:["3 tòa nhà: Giảng đường, Thư viện, KTX","OSPFv3 multi-area, BGP dual ISP","QoS: e-learning, video conf, VoIP","CME 100 phones + FreePBX","Multicast IPTV"],
    topo:"Internet─BGP─EDGE(HQ)\n─OSPFv3─CORE\n─Area1: Giảng Đường\n─Area2: Thư Viện\n─Area3: KTX",
    deploy:["Tuần 1-2: Thiết kế 3 tòa","Tuần 3-4: Backbone inter-building","Tuần 5-6: CME + FreePBX","Tuần 7-8: Multicast, QoS","Tuần 9-10: Security, monitoring"],
    result:["IPv6 kết nối 3 tòa","150 VoIP endpoints","IPTV 10 channels","QoS đảm bảo e-learning"],
    tech:["OSPFv3","MP-BGP","CME","FreePBX","PIM-SM","CBWFQ"]
  },
  { id:6, icon:"🏆", color:"#00d4ff", level:"hard", dur:"8-10 tuần", team:"3-5 SV",
    title:"NGN Doanh Nghiệp Toàn Diện IPv6",
    sub:"SME IPv6 NGN Full ★ NCKH/Luận Văn Tốt Nghiệp",
    overview:"Hệ thống NGN hoàn chỉnh 100-500 nhân viên, 3 chi nhánh, dual ISP, Multicast, QoS, CME+FreePBX.",
    scope:["3 chi nhánh WAN IPv6","OSPFv3 multi-area, BGP multi-homing","PIM-SM Multicast video","QoS 6 lớp E2E","CME 50 + FreePBX 30","Security + Monitoring"],
    topo:"HQ─BGP─ISP-A/B\n─OSPFv3─BRANCH1/2\nCME(50)+FreePBX(30)\nMulticast + QoS 6 classes",
    deploy:["Phase1(T1-2): Design","Phase2(T3-4): OSPFv3+BGP","Phase3(T5-6): QoS+Multicast","Phase4(T7-8): CME+FreePBX","Phase5(T9-10): Security+Monitor"],
    result:["BGP failover < 30s","VoIP MOS ≥ 4.0","Video multicast OK","Zero critical vulns"],
    tech:["OSPFv3","MP-BGP","HSRPv2","CME","FreePBX","PIM-SM","LLQ","uRPF"]
  },
  { id:7, icon:"☁️", color:"#ff6b35", level:"hard", dur:"10-12 tuần", team:"3-5 SV",
    title:"IPTV IPv6 Multicast cho ISP/Campus",
    sub:"IPv6 Multicast IPTV ★ NCKH/Luận Văn Tốt Nghiệp",
    overview:"Nền tảng IPTV 500+ subscribers, 50 kênh HD qua IPv6 Multicast với redundancy và QoS.",
    scope:["PIM-SM Anycast RP 50+ kênh HD","MLDv2 snooping tối ưu BW","QoS AF41 video, WRED","SSM (FF3x::) on-demand","Load test 500 streams"],
    topo:"VideoServer─PIM-SM─RP1/RP2(Anycast)\n─BSR─DIST/ACCESS\nGroup: FF1E::/16 (50 ch)\nSSM: FF3E::/32 (on-demand)",
    deploy:["T1-2: PIM-SM + Anycast RP","T3-4: MLDv2, SSM","T5-6: QoS, load test","T7-8: Redundancy, failover","T9-10: CDN, benchmark"],
    result:["50 streams không drop","RP failover < 5s","BW 95% tiết kiệm vs unicast","Jitter, loss, capacity report"],
    tech:["PIM-SM","Anycast RP","MLDv2","SSM","AF41","WRED","iperf3"]
  },
  { id:8, icon:"🔒", color:"#10b981", level:"hard", dur:"10-12 tuần", team:"3-5 SV",
    title:"Zero Trust Security NGN/IPv6",
    sub:"IPv6 Zero Trust ★ NCKH/Luận Văn Tốt Nghiệp",
    overview:"Zero Trust cho NGN/IPv6 với threat modeling, penetration testing và automated response.",
    scope:["Threat: RA flood, BGP hijack","IPv6 First-Hop Security","Zone-Based Firewall, uRPF","SIP TLS, SRTP, toll fraud","SIEM: log correlation"],
    topo:"[Internet]─uRPF─EDGE\n[LAN]─RA Guard─ACCESS\n[VoIP]─SIP TLS/SRTP─CME\nSIEM: ELK + rules",
    deploy:["T1-2: Threat modeling","T3-4: First-Hop Security","T5-6: Zone FW, VoIP sec","T7-8: SIEM, correlation","T9-10: Pentest, report"],
    result:["Zero critical vulns","SIEM detect < 60s","SIP TLS/SRTP 100%","Pentest CVSS scoring"],
    tech:["RA Guard","uRPF","Zone-FW","SIP TLS","SRTP","ELK","Fail2ban"]
  },
  { id:9, icon:"🚀", color:"#a855f7", level:"hard", dur:"12 tuần", team:"2-5 SV",
    title:"Migration IPv4→IPv6 ISP với MPLS 6VPE",
    sub:"ISP IPv6 Migration ★ Luận Văn",
    overview:"Lộ trình chuyển đổi mạng IPv4 ISP sang IPv6 với MPLS backbone, 6VPE, NAT64, DS-Lite.",
    scope:["Audit IPv4, migration roadmap","Dual-Stack coexistence","MPLS 6VPE/6PE","NAT64/DNS64","DS-Lite CGN","Performance eval"],
    topo:"IPv4 Legacy\n→ Dual-Stack\n→ MPLS 6VPE\n→ NAT64/DNS64\n→ DS-Lite CGN\n→ Pure IPv6",
    deploy:["T1-2: Audit + roadmap","T3-4: Dual-Stack","T5-6: MPLS 6VPE","T7-8: NAT64+DNS64","T9-10: DS-Lite","T11-12: Test+report"],
    result:["6VPE L3VPN OK","NAT64 transparent","DS-Lite IPv4 via IPv6","Performance report"],
    tech:["MPLS","LDP","6VPE","6PE","NAT64","DNS64","DS-Lite","BGP"]
  },
  { id:10, icon:"🤖", color:"#f59e0b", level:"hard", dur:"12 tuần", team:"2-5 SV",
    title:"SDN IPv6 NGN: ONOS & QoS Automation",
    sub:"SDN IPv6 NGN ★ Luận Văn",
    overview:"ONOS SDN controller với NGN/IPv6, tự động hóa QoS policy qua REST API.",
    scope:["ONOS quản lý OpenFlow switches","IPv6 forwarding SDN","QoS automation REST API","So sánh SDN vs Traditional","Performance benchmark"],
    topo:"ONOS Controller\n─OpenFlow─OVS Switches\n─REST API─Apps\nIPv6: OVS1─OVS2─OVS3",
    deploy:["T1-2: ONOS, OpenFlow","T3-4: IPv6 forwarding","T5-6: QoS REST API","T7-8: VoIP/Video","T9-10: Benchmark","T11-12: Report"],
    result:["ONOS IPv6 OK","Auto QoS policy","REST API < 100ms","SDN vs Traditional report"],
    tech:["ONOS","OpenFlow","OVS","REST API","Python","IPv6","QoS"]
  }
];

const TOPOS=[{id:"full",label:"Tổng Thể"},{id:"ospf",label:"OSPFv3"},{id:"bgp",label:"BGP"},{id:"mcast",label:"Multicast"},{id:"voip",label:"VoIP"}];

function SvgWrap({children}){
  return <svg viewBox="0 0 800 460" style={{width:"100%",height:"100%",display:"block"}}>
    <rect width="800" height="460" fill="#020d18"/>
    {[...Array(17)].map((_,i)=><line key={`v${i}`} x1={i*50} y1="0" x2={i*50} y2="460" stroke="#0a2030" strokeWidth="0.5"/>)}
    {[...Array(10)].map((_,i)=><line key={`h${i}`} x1="0" y1={i*50} x2="800" y2={i*50} stroke="#0a2030" strokeWidth="0.5"/>)}
    {children}
  </svg>;
}

function TopoFull(){
  return <SvgWrap>
    <ellipse cx="400" cy="36" rx="80" ry="20" fill="#041520" stroke="#00d4ff" strokeWidth="1.5"/>
    <text x="400" y="40" textAnchor="middle" fill="#00d4ff" fontSize="11" fontFamily="monospace" fontWeight="bold">INTERNET</text>
    {[{x:30,l:"ISP-A",s:"AS100"},{x:622,l:"ISP-B",s:"AS200"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={72} width={108} height={40} rx="6" fill="#100800" stroke="#ff6b35" strokeWidth="1.5"/>
      <text x={n.x+54} y={90} textAnchor="middle" fill="#ff6b35" fontSize="15" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+54} y={104} textAnchor="middle" fill="#6a2a00" fontSize="8" fontFamily="monospace">{n.s}</text></g>
    ))}
    <line x1="340" y1="52" x2="138" y2="72" stroke="#ff6b35" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="460" y1="52" x2="652" y2="72" stroke="#ff6b35" strokeWidth="1.5" strokeDasharray="5,3"/>
    {[{x:100,l:"EDGE-R1",s:"AS65001"},{x:540,l:"EDGE-R2",s:"AS65001"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={158} width={130} height={48} rx="7" fill="#041520" stroke="#00d4ff" strokeWidth="2"/>
      <text x={n.x+65} y={178} textAnchor="middle" fill="#00d4ff" fontSize="11" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+65} y={194} textAnchor="middle" fill="#1a7a9a" fontSize="9" fontFamily="monospace">{n.s}</text></g>
    ))}
    <line x1="84" y1="112" x2="148" y2="158" stroke="#ff6b35" strokeWidth="1.5"/>
    <line x1="676" y1="112" x2="622" y2="158" stroke="#ff6b35" strokeWidth="1.5"/>
    <line x1="230" y1="182" x2="540" y2="182" stroke="#00d4ff" strokeWidth="1" strokeDasharray="5,3"/>
    <text x="400" y="177" textAnchor="middle" fill="#00d4ff" fontSize="8" fontFamily="monospace">iBGP</text>
    {[{x:210,l:"CORE-R1",s:"RP·OSPFv3"},{x:430,l:"CORE-R2",s:"BSR·ABR"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={262} width={130} height={46} rx="7" fill="#041a10" stroke="#10b981" strokeWidth="2"/>
      <text x={n.x+65} y={282} textAnchor="middle" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+65} y={298} textAnchor="middle" fill="#1a7a4a" fontSize="9" fontFamily="monospace">{n.s}</text></g>
    ))}
    <line x1="165" y1="206" x2="248" y2="262" stroke="#00d4ff" strokeWidth="1.5"/>
    <line x1="605" y1="206" x2="528" y2="262" stroke="#00d4ff" strokeWidth="1.5"/>
    <line x1="340" y1="285" x2="430" y2="285" stroke="#10b981" strokeWidth="1.5"/>
    {[{x:148,l:"DIST-SW1",s:"HSRP·VLAN10"},{x:488,l:"DIST-SW2",s:"HSRP·VLAN100"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={364} width={120} height={42} rx="6" fill="#080e18" stroke="#a855f7" strokeWidth="1.5"/>
      <text x={n.x+60} y={383} textAnchor="middle" fill="#a855f7" fontSize="15" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+60} y={397} textAnchor="middle" fill="#5a1a9a" fontSize="8" fontFamily="monospace">{n.s}</text></g>
    ))}
    <line x1="258" y1="308" x2="232" y2="364" stroke="#a855f7" strokeWidth="1.5"/>
    <line x1="502" y1="308" x2="522" y2="364" stroke="#a855f7" strokeWidth="1.5"/>
    {[{x:52,l:"ACC-SW1"},{x:175,l:"ACC-SW2"},{x:478,l:"ACC-SW3"},{x:600,l:"CME+PBX"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={425} width={98} height={30} rx="4" fill="#06080e" stroke={i<3?"#f59e0b":"#a855f7"} strokeWidth="1"/>
      <text x={n.x+49} y={444} textAnchor="middle" fill={i<3?"#f59e0b":"#a855f7"} fontSize="9" fontFamily="monospace">{n.l}</text></g>
    ))}
    <line x1="190" y1="406" x2="112" y2="425" stroke="#f59e0b" strokeWidth="1"/>
    <line x1="205" y1="406" x2="218" y2="425" stroke="#f59e0b" strokeWidth="1"/>
    <line x1="520" y1="406" x2="516" y2="425" stroke="#f59e0b" strokeWidth="1"/>
    <line x1="550" y1="406" x2="640" y2="425" stroke="#a855f7" strokeWidth="1"/>
  </SvgWrap>;
}

function TopoOSPF(){
  return <SvgWrap>
    <ellipse cx="400" cy="185" rx="190" ry="108" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="8,4" opacity="0.7"/>
    <text x="400" y="92" textAnchor="middle" fill="#10b981" fontSize="12" fontFamily="monospace" fontWeight="bold">AREA 0 — BACKBONE</text>
    {[{x:270,l:"CORE-R1",s:"ABR·RP"},{x:410,l:"CORE-R2",s:"ABR·BSR"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={155} width={115} height={44} rx="7" fill="#041a10" stroke="#10b981" strokeWidth="2"/>
      <text x={n.x+57} y={174} textAnchor="middle" fill="#10b981" fontSize="15" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+57} y={190} textAnchor="middle" fill="#1a7a4a" fontSize="8" fontFamily="monospace">{n.s}</text></g>
    ))}
    <line x1="385" y1="177" x2="410" y2="177" stroke="#10b981" strokeWidth="1.5"/>
    {[{x:286,l:"EDGE-R1"},{x:396,l:"EDGE-R2"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={242} width={100} height={36} rx="6" fill="#041520" stroke="#00d4ff" strokeWidth="1.5"/>
      <text x={n.x+50} y={258} textAnchor="middle" fill="#00d4ff" fontSize="9" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+50} y={272} textAnchor="middle" fill="#1a5a8a" fontSize="7" fontFamily="monospace">ASBR·BGP</text></g>
    ))}
    <line x1="328" y1="199" x2="328" y2="242" stroke="#10b981" strokeWidth="1.5"/>
    <line x1="452" y1="199" x2="446" y2="242" stroke="#10b981" strokeWidth="1.5"/>
    <ellipse cx="148" cy="360" rx="138" ry="86" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.6"/>
    <text x="148" y="282" textAnchor="middle" fill="#00d4ff" fontSize="11" fontFamily="monospace" fontWeight="bold">AREA 1 — DATA</text>
    <rect x="88" y={315} width={120} height={38} rx="6" fill="#041520" stroke="#00d4ff" strokeWidth="1.5"/>
    <text x="148" y="332" textAnchor="middle" fill="#00d4ff" fontSize="9" fontFamily="monospace" fontWeight="bold">DIST-SW1</text>
    <text x="148" y="346" textAnchor="middle" fill="#1a5a8a" fontSize="7" fontFamily="monospace">VLAN10,20·HSRP</text>
    {[{x:44,l:"ACC-SW1"},{x:153,l:"ACC-SW2"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={390} width={88} height={30} rx="4" fill="#03080e" stroke="#4a8aae" strokeWidth="1"/>
      <text x={n.x+44} y={409} textAnchor="middle" fill="#4a8aae" fontSize="8" fontFamily="monospace">{n.l}</text></g>
    ))}
    <line x1="133" y1="353" x2="100" y2="390" stroke="#4a8aae" strokeWidth="1"/>
    <line x1="163" y1="353" x2="195" y2="390" stroke="#4a8aae" strokeWidth="1"/>
    <line x1="297" y1="177" x2="210" y2="315" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="4,3"/>
    <ellipse cx="638" cy="360" rx="138" ry="86" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.6"/>
    <text x="638" y="282" textAnchor="middle" fill="#a855f7" fontSize="11" fontFamily="monospace" fontWeight="bold">AREA 2 — VOICE</text>
    <rect x="578" y={315} width={120} height={38} rx="6" fill="#0a0618" stroke="#a855f7" strokeWidth="1.5"/>
    <text x="638" y="332" textAnchor="middle" fill="#a855f7" fontSize="9" fontFamily="monospace" fontWeight="bold">DIST-SW2</text>
    <text x="638" y="346" textAnchor="middle" fill="#5a1a9a" fontSize="7" fontFamily="monospace">VLAN100·Voice</text>
    {[{x:538,l:"ACC-SW3"},{x:643,l:"CME-GW"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={390} width={88} height={30} rx="4" fill="#03080e" stroke="#7c3aed" strokeWidth="1"/>
      <text x={n.x+44} y={409} textAnchor="middle" fill="#7c3aed" fontSize="8" fontFamily="monospace">{n.l}</text></g>
    ))}
    <line x1="623" y1="353" x2="594" y2="390" stroke="#7c3aed" strokeWidth="1"/>
    <line x1="651" y1="353" x2="681" y2="390" stroke="#7c3aed" strokeWidth="1"/>
    <line x1="464" y1="177" x2="572" y2="315" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <rect x="320" y={420} width={155} height={34} rx="5" fill="#06060a" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
    <text x="397" y="437" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">AREA 10 — MGMT</text>
    <text x="397" y="449" textAnchor="middle" fill="#7a5a00" fontSize="7" fontFamily="monospace">OOB · VLAN999</text>
  </SvgWrap>;
}

function TopoBGP(){
  return <SvgWrap>
    {[{x:25,l:"ISP-A",s:"AS 100"},{x:610,l:"ISP-B",s:"AS 200"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={30} width={165} height={55} rx="8" fill="#0f0500" stroke="#ff6b35" strokeWidth="2"/>
      <text x={n.x+82} y={53} textAnchor="middle" fill="#ff6b35" fontSize="12" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+82} y={70} textAnchor="middle" fill="#8a3000" fontSize="9" fontFamily="monospace">{n.s}</text></g>
    ))}
    {[{x:110,l:"EDGE-R1",s1:"AS 65001",s2:"LP:200 Primary"},{x:470,l:"EDGE-R2",s1:"AS 65001",s2:"LP:100+Prepend×3"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={160} width={165} height={68} rx="9" fill="#041520" stroke="#00d4ff" strokeWidth="2.5"/>
      <text x={n.x+82} y={182} textAnchor="middle" fill="#00d4ff" fontSize="12" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+82} y={200} textAnchor="middle" fill="#1a7a9a" fontSize="15" fontFamily="monospace">{n.s1}</text>
      <text x={n.x+82} y={218} textAnchor="middle" fill="#0a4a6a" fontSize="8" fontFamily="monospace">{n.s2}</text></g>
    ))}
    <line x1="190" y1="85" x2="185" y2="160" stroke="#ff6b35" strokeWidth="2"/>
    <line x1="618" y1="85" x2="610" y2="160" stroke="#ff6b35" strokeWidth="2"/>
    <text x="160" y="128" fill="#ff6b35" fontSize="9" fontFamily="monospace">eBGP</text>
    <text x="618" y="128" fill="#ff6b35" fontSize="9" fontFamily="monospace">eBGP</text>
    <line x1="275" y1="194" x2="470" y2="194" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="6,3"/>
    <text x="400" y="188" textAnchor="middle" fill="#00d4ff" fontSize="9" fontFamily="monospace">iBGP (next-hop-self)</text>
    <rect x="278" y={300} width={244} height={50} rx="8" fill="#040e08" stroke="#10b981" strokeWidth="2"/>
    <text x="400" y="320" textAnchor="middle" fill="#10b981" fontSize="15" fontFamily="monospace" fontWeight="bold">OUR PREFIX: 2001:db8::/32</text>
    <text x="400" y="340" textAnchor="middle" fill="#1a6a3a" fontSize="8" fontFamily="monospace">→ ISP-A (primary) & ISP-B (backup)</text>
    <line x1="240" y1="228" x2="325" y2="300" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,2"/>
    <line x1="560" y1="228" x2="475" y2="300" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,2"/>
    <text x="400" y="400" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">ISP-A Primary (LP=200) → Failover ISP-B (LP=100 + Prepend×3)</text>
  </SvgWrap>;
}

function TopoMcast(){
  return <SvgWrap>
    <rect x="305" y="12" width="190" height="46" rx="8" fill="#100a00" stroke="#f59e0b" strokeWidth="2"/>
    <text x="400" y="32" textAnchor="middle" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">📹 VIDEO SOURCE</text>
    <text x="400" y="50" textAnchor="middle" fill="#7a5a00" fontSize="8" fontFamily="monospace">2001:db8:1:20::100</text>
    {[{x:305,l:"CORE-R1 (RP)",s1:"Anycast RP Primary",c:"#ff6b35"},{x:482,l:"CORE-R2 (BSR)",s1:"BSR Priority:100",c:"#a855f7"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={122} width={165} height={52} rx="8" fill={i===0?"#0f0500":"#0a0818"} stroke={n.c} strokeWidth="2"/>
      <text x={n.x+82} y={143} textAnchor="middle" fill={n.c} fontSize="15" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+82} y={160} textAnchor="middle" fill={n.c} fontSize="8" fontFamily="monospace">{n.s1}</text></g>
    ))}
    <line x1="400" y1="58" x2="388" y2="122" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2"/>
    <line x1="470" y1="148" x2="482" y2="148" stroke="#a855f7" strokeWidth="1.5"/>
    {[{x:85,l:"DIST-SW1"},{x:412,l:"DIST-SW2"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={250} width={130} height={38} rx="6" fill="#040e0a" stroke="#10b981" strokeWidth="1.5"/>
      <text x={n.x+65} y={268} textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+65} y={282} textAnchor="middle" fill="#1a5a2a" fontSize="7" fontFamily="monospace">PIM-SM · MLDv2</text></g>
    ))}
    <line x1="360" y1="174" x2="205" y2="250" stroke="#ff6b35" strokeWidth="1.5"/>
    <line x1="393" y1="174" x2="446" y2="250" stroke="#ff6b35" strokeWidth="1.5"/>
    {[{x:22,l:"VLAN10"},{x:148,l:"VLAN20"},{x:388,l:"VoIP/MoH"},{x:508,l:"VLAN20"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={354} width={110} height={52} rx="5" fill="#030808" stroke={i===2?"#a855f7":"#00d4ff"} strokeWidth="1"/>
      <text x={n.x+55} y={373} textAnchor="middle" fill={i===2?"#a855f7":"#00d4ff"} fontSize="9" fontFamily="monospace">{n.l}</text>
      <text x={n.x+55} y={390} textAnchor="middle" fill={i===2?"#a855f7":"#00d4ff"} fontSize="7" fontFamily="monospace">MLDv2 Join</text>
      <text x={n.x+55} y={402} textAnchor="middle" fill={i===2?"#a855f7":"#00d4ff"} fontSize="7" fontFamily="monospace">FF1E::STREAM</text></g>
    ))}
    <line x1="138" y1="288" x2="100" y2="354" stroke="#00d4ff" strokeWidth="1"/>
    <line x1="165" y1="288" x2="200" y2="354" stroke="#00d4ff" strokeWidth="1"/>
    <line x1="448" y1="288" x2="432" y2="354" stroke="#00d4ff" strokeWidth="1"/>
    <line x1="470" y1="288" x2="548" y2="354" stroke="#a855f7" strokeWidth="1"/>
    <rect x="622" y={248} width={160} height={108} rx="6" fill="#040a04" stroke="#10b981" strokeWidth="1" strokeDasharray="3,2"/>
    <text x="702" y="266" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">PIM-SM FLOW</text>
    {["1. Receiver joins (MLD)","2. PIM Join → RP","3. Source register","4. SPT switchover","5. Native delivery"].map((s,i)=>(
      <text key={i} x="702" y={282+i*15} textAnchor="middle" fill="#1a5a2a" fontSize="7" fontFamily="monospace">{s}</text>
    ))}
  </SvgWrap>;
}

function TopoVoIP(){
  return <SvgWrap>
    <ellipse cx="110" cy="70" rx="90" ry="36" fill="#0f0505" stroke="#ff4444" strokeWidth="1.5"/>
    <text x="110" y="65" textAnchor="middle" fill="#ff4444" fontSize="11" fontFamily="monospace" fontWeight="bold">☎ PSTN</text>
    <text x="110" y="82" textAnchor="middle" fill="#7a2222" fontSize="8" fontFamily="monospace">FXO/T1/E1</text>
    {[{x:195,l:"CME-GW",s1:"Cisco ISR 2911",s2:"2001:db8:5:1::1",c:"#00d4ff"},{x:425,l:"FreePBX",s1:"Asterisk 21",s2:"2001:db8:5:2::2",c:"#a855f7"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={130} width={175} height={80} rx="9" fill={i===0?"#041a08":"#0a0418"} stroke={n.c} strokeWidth="2.5"/>
      <text x={n.x+87} y={153} textAnchor="middle" fill={n.c} fontSize="12" fontFamily="monospace" fontWeight="bold">{n.l}</text>
      <text x={n.x+87} y={170} textAnchor="middle" fill={n.c} fontSize="9" fontFamily="monospace">{n.s1}</text>
      <text x={n.x+87} y={186} textAnchor="middle" fill={n.c} fontSize="8" fontFamily="monospace">{n.s2}</text>
      <text x={n.x+87} y={202} textAnchor="middle" fill={n.c} fontSize="7" fontFamily="monospace">{i===0?"SCCP/SIP · CME 15.x":"PJSIP · IVR · CDR"}</text></g>
    ))}
    <line x1="370" y1="170" x2="425" y2="170" stroke="#10b981" strokeWidth="2.5"/>
    <text x="397" y="163" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace">SIP Trunk</text>
    <line x1="178" y1="88" x2="230" y2="130" stroke="#ff4444" strokeWidth="1.5"/>
    {[1001,1002,1003,1004].map((ext,i)=>(
      <g key={ext}><rect x={62+i*90} y={290} width={80} height={52} rx="5" fill="#040810" stroke="#00d4ff" strokeWidth="1"/>
      <text x={62+i*90+40} y={312} textAnchor="middle" fill="#00d4ff" fontSize="13">📱</text>
      <text x={62+i*90+40} y={328} textAnchor="middle" fill="#1a6a8e" fontSize="8" fontFamily="monospace">Ext:{ext}</text>
      <text x={62+i*90+40} y={338} textAnchor="middle" fill="#0a3a5e" fontSize="7" fontFamily="monospace">7962G</text>
      <line x1={62+i*90+40} y1={290} x2={280} y2={210} stroke="#00d4ff" strokeWidth="0.7" strokeDasharray="3,2" opacity="0.4"/></g>
    ))}
    {[2001,2002,2003].map((ext,i)=>(
      <g key={ext}><rect x={430+i*110} y={290} width={96} height={52} rx="5" fill="#06040e" stroke="#a855f7" strokeWidth="1"/>
      <text x={430+i*110+48} y={312} textAnchor="middle" fill="#a855f7" fontSize="13">💻</text>
      <text x={430+i*110+48} y={328} textAnchor="middle" fill="#6a2ab5" fontSize="8" fontFamily="monospace">Ext:{ext}</text>
      <text x={430+i*110+48} y={338} textAnchor="middle" fill="#3a007e" fontSize="7" fontFamily="monospace">Softphone</text>
      <line x1={430+i*110+48} y1={290} x2={510} y2={210} stroke="#a855f7" strokeWidth="0.7" strokeDasharray="3,2" opacity="0.4"/></g>
    ))}
    <rect x="170" y="372" width="460" height="46" rx="6" fill="#040a04" stroke="#10b981" strokeWidth="1.5"/>
    <text x="400" y="391" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">DIAL PLAN</text>
    <text x="400" y="410" textAnchor="middle" fill="#6a9a8a" fontSize="8" fontFamily="monospace">1XXX→CME | 2XXX→FreePBX | 0.→PSTN | 9000→IVR | 6000→Conf</text>
  </SvgWrap>;
}

const TMAP={full:TopoFull,ospf:TopoOSPF,bgp:TopoBGP,mcast:TopoMcast,voip:TopoVoIP};

export default function App(){
  const [view,setView]=useState("modules");
  const [topo,setTopo]=useState("full");
  const [expMod,setExpMod]=useState(null);
  const [expLab,setExpLab]=useState(null);
  const [labTab,setLabTab]=useState("deploy");
  const [expThesis,setExpThesis]=useState(null);
  const [thesisTab,setThesisTab]=useState("overview");
  const [filter,setFilter]=useState("all");
  const TopoComp=TMAP[topo];
  const filtered=filter==="all"?THESIS:THESIS.filter(t=>t.level===filter);

  return(
    <div style={{background:"#020d18",minHeight:"100vh",fontFamily:"'Share Tech Mono','Courier New',monospace",color:"#c0d8f0",width:"100%",overflowX:"hidden"}}>
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
        a{color:#10b981;text-decoration:none}
        button{cursor:pointer;font-family:inherit}
        @media(max-width:600px){
          .hdr-title{font-size:14px!important;letter-spacing:1px!important}
          .hdr-sub{display:none!important}
          .badges{display:none!important}
          .mod-tags{display:none!important}
          .inst-bar{font-size:10px!important;gap:5px!important;padding:6px 12px!important}
          .nav-btn{padding:9px 10px!important;font-size:11px!important}
          .section-title{font-size:10px!important}
          .topo-btn{padding:5px 10px!important;font-size:10px!important}
          .desk-only{display:none!important}
        }
        @media(min-width:601px){
          .mob-only{display:none!important}
        }
      `}</style>

      {/* HEADER */}
      <div style={{background:"linear-gradient(180deg,#091e30 0%,#020d18 100%)",borderBottom:"1px solid #00d4ff1a",padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:38,height:38,borderRadius:7,background:"#00d4ff12",border:"1.5px solid #00d4ff33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🌐</div>
        <div style={{flex:1,minWidth:0}}>
          <div className="hdr-title" style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:16,color:"#00d4ff",letterSpacing:2}}>NGN / IPv6 LAB TOPOLOGY VIEWER</div>
          <div className="hdr-sub" style={{fontSize:16,color:"#1a5a7a",marginTop:1}}>EVE-NG • OSPFv3 • BGP • Multicast • QoS • Cisco CME • FreePBX</div>
        </div>
        <div className="badges" style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"flex-end"}}>
          {[["🟢","IPv6","#10b981"],["🔵","OSPFv3","#00d4ff"],["🟠","BGP","#ff6b35"],["🟣","VoIP","#a855f7"]].map(([e,l,c])=>(
            <div key={l} style={{background:"#0a1e2a",border:`1px solid ${c}33`,borderRadius:10,padding:"2px 8px",fontSize:16,color:c,display:"flex",gap:3,alignItems:"center"}}>
              <span className="pulse">{e}</span><span>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* INSTRUCTOR BAR */}
      <div className="inst-bar" style={{background:"#040f1c",borderBottom:"1px solid #0a2a40",padding:"7px 16px",display:"flex",gap:8,alignItems:"center",fontSize:16,flexWrap:"wrap"}}>
        <span>👨‍🏫</span>
        <span style={{color:"#00d4ff",fontWeight:"bold"}}>Trần Vĩnh Phúc</span>
        <span style={{color:"#1a3a5a"}}>|</span>
        <a href="mailto:phuctv@dlu.edu.vn">phuctv@dlu.edu.vn</a>
        <span className="desk-only" style={{color:"#1a3a5a"}}>|</span>
        <span className="desk-only" style={{color:"#3a6a8a"}}>Đại học Đà Lạt</span>
        <div style={{marginLeft:"auto",background:"#0a1e2a",border:"1px solid #00d4ff1a",borderRadius:10,padding:"2px 10px",fontSize:16,color:"#4a8a9a",whiteSpace:"nowrap"}}>6 Modules · 25 Labs · 10 Đề Tài</div>
      </div>

      {/* NAV */}
      <div style={{display:"flex",borderBottom:"1px solid #0a2a40",background:"#030e1a",overflowX:"auto"}}>
        {[["topology","🗺","Topology"],["modules","📚","Modules & Labs"],["thesis","🎓","Đề Tài"],["guide","📖","Hướng Dẫn"]].map(([k,ic,l])=>(
          <button key={k} onClick={()=>setView(k)} className="nav-btn" style={{background:view===k?"#041a2a":"transparent",border:"none",borderBottom:view===k?"2px solid #00d4ff":"2px solid transparent",color:view===k?"#00d4ff":"#3a6a8a",padding:"10px 14px",fontSize:16,transition:"all 0.2s",flexShrink:0,whiteSpace:"nowrap"}}>
            <span className="mob-only">{ic}</span>
            <span className="desk-only">{ic} {l}</span>
            <span className="mob-only"> {l}</span>
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{padding:"14px 14px",width:"100%"}}>

        {/* TOPOLOGY */}
        {view==="topology"&&(
          <div className="fade">
            <div className="section-title" style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:16,color:"#3a6a8a",letterSpacing:3,marginBottom:10}}>▸ SƠ ĐỒ TOPOLOGY MẠNG</div>
            <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
              {TOPOS.map(t=>(
                <button key={t.id} onClick={()=>setTopo(t.id)} className="topo-btn" style={{background:topo===t.id?"#0a2a3a":"#050f18",border:`1px solid ${topo===t.id?"#00d4ff":"#1a3a5a"}`,color:topo===t.id?"#00d4ff":"#3a6a8a",padding:"6px 12px",borderRadius:5,fontSize:16,transition:"all 0.2s",whiteSpace:"nowrap"}}>{t.label}</button>
              ))}
            </div>
            <div style={{background:"#020d18",border:"1px solid #0a2a40",borderRadius:9,overflow:"hidden"}}>
              <div style={{background:"#030f1a",borderBottom:"1px solid #0a2a40",padding:"7px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"#00d4ff",fontSize:16,fontFamily:"Rajdhani,sans-serif",fontWeight:700}}>{TOPOS.find(t=>t.id===topo)?.label}</span>
                <span style={{color:"#1a4a6a",fontSize:16}}>EVE-NG Lab</span>
              </div>
              <div style={{width:"100%",aspectRatio:"16/9",minHeight:240}}><TopoComp/></div>
            </div>
          </div>
        )}

        {/* MODULES */}
        {view==="modules"&&(
          <div className="fade">
            <div className="section-title" style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:16,color:"#3a6a8a",letterSpacing:3,marginBottom:12}}>▸ 6 MODULES · 25 LABS CHI TIẾT</div>
            {MODULES.map(mod=>(
              <div key={mod.id} style={{marginBottom:8}}>
                <div onClick={()=>{setExpMod(expMod===mod.id?null:mod.id);setExpLab(null);}}
                  style={{background:"#040f18",borderRadius:expMod===mod.id?"8px 8px 0 0":8,padding:"12px 14px",cursor:"pointer",border:`1px solid ${expMod===mod.id?mod.color:"#0a2030"}`,borderLeft:`4px solid ${mod.color}`,transition:"all 0.18s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{fontSize:20,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",background:`${mod.color}12`,border:`1px solid ${mod.color}30`,borderRadius:6,flexShrink:0}}>{mod.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:2,flexWrap:"wrap"}}>
                        <span style={{color:mod.color,fontWeight:700,fontSize:15,letterSpacing:2}}>MODULE {mod.id}</span>
                        <span style={{color:"#1a4a6a",fontSize:16}}>|</span>
                        <span style={{color:"#3a6a8a",fontSize:15}}>{mod.labs}</span>
                      </div>
                      <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:16,color:"#d0e8ff"}}>{mod.title}</div>
                      <div style={{fontSize:15,color:"#3a6a8a",marginTop:2}}>{mod.desc}</div>
                    </div>
                    <div className="mod-tags" style={{display:"flex",gap:4,flexWrap:"wrap",maxWidth:200,justifyContent:"flex-end",flexShrink:0}}>
                      {mod.tags.map(t=><span key={t} style={{background:"#020d18",border:`1px solid ${mod.color}40`,borderRadius:3,padding:"1px 6px",fontSize:16,color:mod.color}}>{t}</span>)}
                    </div>
                    <span style={{color:mod.color,fontSize:14,marginLeft:4,flexShrink:0}}>{expMod===mod.id?"▲":"▼"}</span>
                  </div>
                </div>

                {expMod===mod.id&&(
                  <div className="fade" style={{background:"#030b16",border:`1px solid ${mod.color}1a`,borderTop:"none",borderRadius:"0 0 8px 8px"}}>
                    {mod.labList.map(lab=>{
                      const k=`${mod.id}-${lab.num}`;
                      const open=expLab===k;
                      return(
                        <div key={lab.num}>
                          <div onClick={()=>{setExpLab(open?null:k);setLabTab("deploy");}}
                            style={{padding:"10px 14px",borderBottom:"1px solid #0a1828",display:"flex",alignItems:"center",gap:8,cursor:"pointer",transition:"background 0.15s"}}>
                            <div style={{width:32,height:32,borderRadius:5,background:`${mod.color}15`,border:`1px solid ${mod.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:mod.color,flexShrink:0,fontWeight:700}}>{lab.num}</div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:13,color:"#b0cce0",fontFamily:"Rajdhani,sans-serif",fontWeight:600}}>{lab.name}</div>
                              <div style={{display:"flex",gap:8,marginTop:2}}>
                                <span style={{fontSize:15,color:"#3a5a7a"}}>⏱ {lab.dur}</span>
                                <span style={{fontSize:15,color:"#3a5a7a"}}>{"★".repeat(lab.diff)}{"☆".repeat(4-lab.diff)}</span>
                              </div>
                            </div>
                            <span style={{color:"#1a3a5a",fontSize:16,flexShrink:0}}>{open?"▲":"▼"}</span>
                          </div>

                          {open&&(
                            <div className="fade" style={{padding:"12px 14px",background:"#020910",borderBottom:"1px solid #0a1828"}}>
                              <div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap"}}>
                                {[["deploy","🔧 Deploy"],["cmds","💻 Lệnh"],["topo","📐 Topo"],["result","✅ Kết Quả"],["hints","💡 Gợi Ý"]].map(([k2,l])=>(
                                  <button key={k2} onClick={e=>{e.stopPropagation();setLabTab(k2);}} style={{background:labTab===k2?`${mod.color}1a`:"#030c18",border:`1px solid ${labTab===k2?mod.color:"#0a1828"}`,color:labTab===k2?mod.color:"#3a6a8a",padding:"5px 10px",borderRadius:4,fontSize:15,whiteSpace:"nowrap"}}>{l}</button>
                                ))}
                              </div>

                              {labTab==="deploy"&&(
                                <div>
                                  <div style={{fontSize:15,color:mod.color,fontWeight:700,letterSpacing:1,marginBottom:8}}>HƯỚNG DẪN TRIỂN KHAI</div>
                                  {lab.deploy.map((st,i)=>(
                                    <div key={i} style={{display:"flex",gap:8,marginBottom:7,alignItems:"flex-start"}}>
                                      <div style={{width:20,height:20,borderRadius:"50%",background:`${mod.color}15`,border:`1px solid ${mod.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:mod.color,flexShrink:0,fontWeight:700}}>{i+1}</div>
                                      <span style={{fontSize:16,color:"#7a9aba",lineHeight:1.7}}>{st}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {labTab==="cmds"&&(
                                <div>
                                  <div style={{fontSize:15,color:mod.color,fontWeight:700,letterSpacing:1,marginBottom:8}}>LỆNH CẤU HÌNH & VERIFY</div>
                                  <pre style={{background:"#010810",borderRadius:7,padding:"12px",fontSize:16,color:"#00e5aa",lineHeight:1.9,overflowX:"auto",borderLeft:`3px solid ${mod.color}`}}>{lab.cmds}</pre>
                                </div>
                              )}
                              {labTab==="topo"&&(
                                <div>
                                  <div style={{fontSize:15,color:mod.color,fontWeight:700,letterSpacing:1,marginBottom:8}}>TOPOLOGY LAB</div>
                                  <pre style={{background:"#010810",borderRadius:7,padding:"12px",fontSize:16,color:"#00d4ff",lineHeight:1.9,overflowX:"auto",borderLeft:`3px solid ${mod.color}`}}>{lab.topo}</pre>
                                </div>
                              )}
                              {labTab==="result"&&(
                                <div>
                                  <div style={{fontSize:15,color:mod.color,fontWeight:700,letterSpacing:1,marginBottom:8}}>KẾT QUẢ DỰ KIẾN</div>
                                  {lab.result.map((r,i)=>(
                                    <div key={i} style={{display:"flex",gap:8,marginBottom:6,background:"#031208",border:"1px solid #0a2018",borderRadius:4,padding:"7px 10px"}}>
                                      <span style={{color:"#10b981",fontSize:13,flexShrink:0}}>✓</span>
                                      <span style={{fontSize:16,color:"#6ab09a"}}>{r}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {labTab==="hints"&&(
                                <div>
                                  <div style={{fontSize:15,color:"#f59e0b",fontWeight:700,letterSpacing:1,marginBottom:8}}>💡 GỢI Ý & TROUBLESHOOTING</div>
                                  {lab.hints.map((h,i)=>(
                                    <div key={i} style={{display:"flex",gap:8,marginBottom:6,background:"#0f0d02",border:"1px solid #2a1a00",borderRadius:4,padding:"7px 10px"}}>
                                      <span style={{color:"#f59e0b",fontSize:15,flexShrink:0}}>→</span>
                                      <span style={{fontSize:16,color:"#b09a4a"}}>{h}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
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
        {view==="thesis"&&(
          <div className="fade">
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              <div className="section-title" style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:16,color:"#3a6a8a",letterSpacing:3}}>{filtered.length} ĐỀ TÀI ĐỒ ÁN</div>
              <div style={{display:"flex",gap:5,marginLeft:"auto",flexWrap:"wrap"}}>
                {[["all","Tất Cả","#00d4ff"],["medium","Đồ Án Môn Học","#f59e0b"],["hard","NCKH/Luận Văn Tốt Nghiệp","#ff6b35"]].map(([k,l,c])=>(
                  <button key={k} onClick={()=>setFilter(k)} style={{background:filter===k?`${c}18`:"#050f18",border:`1px solid ${filter===k?c:"#1a3050"}`,color:filter===k?c:"#3a6a8a",padding:"5px 12px",borderRadius:4,fontSize:16,whiteSpace:"nowrap"}}>{l}</button>
                ))}
              </div>
            </div>

            {filtered.map(t=>(
              <div key={t.id} style={{marginBottom:8}}>
                <div onClick={()=>{setExpThesis(expThesis===t.id?null:t.id);setThesisTab("overview");}}
                  style={{background:"#040f18",borderRadius:expThesis===t.id?"8px 8px 0 0":8,padding:"12px 14px",cursor:"pointer",border:`1px solid ${expThesis===t.id?t.color:"#0a2030"}`,borderLeft:`4px solid ${t.color}`,transition:"all 0.18s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{fontSize:22,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",background:`${t.color}12`,border:`1px solid ${t.color}30`,borderRadius:7,flexShrink:0}}>{t.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:2,flexWrap:"wrap"}}>
                        <span style={{color:t.color,fontWeight:700,fontSize:15}}>ĐỀ TÀI {t.id}</span>
                        <span style={{background:`${t.color}15`,border:`1px solid ${t.color}40`,borderRadius:3,padding:"1px 7px",fontSize:16,color:t.color}}>{t.level==="medium"?"⭐⭐⭐ Đồ Án Môn Học":"⭐⭐⭐⭐⭐ NCKH/Luận Văn Tốt Nghiệp"}</span>
                      </div>
                      <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:14,color:"#d0e8ff"}}>{t.title}</div>
                      <div style={{display:"flex",gap:10,marginTop:2,flexWrap:"wrap"}}>
                        <span style={{fontSize:15,color:"#3a6a8a"}}>⏱ {t.dur}</span>
                        <span style={{fontSize:15,color:"#3a6a8a"}}>👥 {t.team}</span>
                      </div>
                    </div>
                    <span style={{color:t.color,fontSize:14,flexShrink:0}}>{expThesis===t.id?"▲":"▼"}</span>
                  </div>
                </div>

                {expThesis===t.id&&(
                  <div className="fade" style={{background:"#030b16",border:`1px solid ${t.color}1a`,borderTop:"none",borderRadius:"0 0 8px 8px",padding:"14px"}}>
                    <div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap"}}>
                      {[["overview","📋 Tổng Quan"],["topo","📐 Topology"],["deploy","🔧 Kế Hoạch"],["result","✅ Kết Quả"]].map(([k,l])=>(
                        <button key={k} onClick={e=>{e.stopPropagation();setThesisTab(k);}} style={{background:thesisTab===k?`${t.color}1a`:"#030c18",border:`1px solid ${thesisTab===k?t.color:"#0a1828"}`,color:thesisTab===k?t.color:"#3a6a8a",padding:"5px 10px",borderRadius:4,fontSize:15,whiteSpace:"nowrap"}}>{l}</button>
                      ))}
                    </div>

                    {thesisTab==="overview"&&(
                      <div>
                        <div style={{background:`${t.color}08`,border:`1px solid ${t.color}1a`,borderRadius:6,padding:"10px 12px",marginBottom:10}}>
                          <div style={{fontSize:15,color:t.color,fontWeight:700,marginBottom:4}}>TỔNG QUAN</div>
                          <div style={{fontSize:16,color:"#7a9aba",lineHeight:1.7}}>{t.overview}</div>
                        </div>
                        <div style={{fontSize:15,color:t.color,fontWeight:700,marginBottom:8}}>PHẠM VI</div>
                        {t.scope.map((sc,i)=>(
                          <div key={i} style={{display:"flex",gap:6,background:"#030c18",border:`1px solid ${t.color}1a`,borderRadius:4,padding:"7px 10px",marginBottom:5}}>
                            <span style={{color:t.color,fontSize:15,flexShrink:0}}>▸</span>
                            <span style={{fontSize:16,color:"#7a9aba",lineHeight:1.5}}>{sc}</span>
                          </div>
                        ))}
                        <div style={{marginTop:10,display:"flex",gap:5,flexWrap:"wrap"}}>
                          {t.tech.map(tc=><span key={tc} style={{background:"#020d18",border:`1px solid ${t.color}40`,borderRadius:3,padding:"2px 8px",fontSize:15,color:t.color}}>{tc}</span>)}
                        </div>
                      </div>
                    )}
                    {thesisTab==="topo"&&<pre style={{background:"#010810",borderRadius:7,padding:"12px",fontSize:16,color:"#00d4ff",lineHeight:1.9,overflowX:"auto",borderLeft:`3px solid ${t.color}`}}>{t.topo}</pre>}
                    {thesisTab==="deploy"&&(
                      <div>
                        {t.deploy.map((d,i)=>(
                          <div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
                            <div style={{width:22,height:22,borderRadius:4,background:`${t.color}15`,border:`1px solid ${t.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:t.color,flexShrink:0,fontWeight:700}}>{i+1}</div>
                            <span style={{fontSize:16,color:"#7a9aba",lineHeight:1.7}}>{d}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {thesisTab==="result"&&(
                      <div>
                        {t.result.map((r,i)=>(
                          <div key={i} style={{display:"flex",gap:8,marginBottom:6,background:"#031208",border:"1px solid #0a2018",borderRadius:4,padding:"7px 10px"}}>
                            <span style={{color:"#10b981",fontSize:13,flexShrink:0}}>✓</span>
                            <span style={{fontSize:16,color:"#6ab09a"}}>{r}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* GUIDE */}
        {view==="guide"&&(
          <div className="fade">
            <div className="section-title" style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:16,color:"#3a6a8a",letterSpacing:3,marginBottom:12}}>▸ HƯỚNG DẪN NHANH</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:10,marginBottom:14}}>
              {[
                {t:"🚀 Khởi Động EVE-NG",c:"#00d4ff",items:["Truy cập EVE-NG Web UI: http://EVE-NG-IP","Tạo New Lab → Add Node → Cisco IOL","Kết nối nodes bằng drag-and-drop","Start all nodes, đợi boot ~30s","Click node → Console để terminal","File → Save (Ctrl+S) lưu lab"]},
                {t:"⚙️ Cấu Hình IPv6 Nhanh",c:"#10b981",items:["enable → configure terminal","ipv6 unicast-routing (bắt buộc!)","ipv6 cef (Cisco Express Forwarding)","interface Gi0/0 → ipv6 address X/prefix","ipv6 address FE80::1 link-local","no shutdown → end → wr"]},
                {t:"🔍 Debug IPv6",c:"#f59e0b",items:["show ipv6 interface brief","show ipv6 neighbors (NDP cache)","show ipv6 route (routing table)","ping ipv6 X source Y repeat 100","traceroute ipv6 X source Y","debug ipv6 icmp / debug ipv6 ospf"]},
                {t:"📡 OSPFv3 Reference",c:"#7c3aed",items:["ipv6 router ospf 1 → router-id X.X.X.X","interface Gi0/0 → ipv6 ospf 1 area 0","show ipv6 ospf neighbor (Full = OK)","show ipv6 ospf database","clear ipv6 ospf process","debug ipv6 ospf adj"]},
                {t:"🌍 BGP IPv6 Checklist",c:"#ff6b35",items:["router bgp 65001 + no bgp default ipv4-unicast","neighbor X remote-as Y (IPv6 addr)","address-family ipv6 → neighbor activate","network 2001:db8::/32","show bgp ipv6 unicast summary","clear bgp ipv6 unicast * soft"]},
                {t:"📞 VoIP Troubleshoot",c:"#a855f7",items:["show ephone registered","show dial-peer voice summary","debug ccsip messages (SIP trace)","debug ephone detail (SCCP)","show call active voice brief","pjsip set logger on (FreePBX)"]},
                {t:"⚡ QoS Verification",c:"#f59e0b",items:["show policy-map interface Gi0/0 input","show policy-map interface Gi0/0 output","show class-map","show queue GigabitEthernet0/0","show interface Gi0/0 | include drop","show ip sla statistics"]},
                {t:"🔒 Security Commands",c:"#10b981",items:["show ipv6 nd raguard policy","show ipv6 dhcp snooping","show ipv6 source-guard policy","show ip verify source (uRPF)","fail2ban-client status asterisk","show ip access-lists"]}
              ].map((card,i)=>(
                <div key={i} style={{background:"#040f18",border:`1px solid ${card.c}22`,borderLeft:`3px solid ${card.c}`,borderRadius:7,padding:"12px"}}>
                  <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:card.c,marginBottom:8}}>{card.t}</div>
                  {card.items.map((item,j)=>(
                    <div key={j} style={{display:"flex",gap:6,marginBottom:5}}>
                      <span style={{color:card.c,fontSize:16,flexShrink:0,marginTop:2}}>▸</span>
                      <code style={{fontSize:15,color:"#6a9aba",lineHeight:1.6,fontFamily:"Share Tech Mono,monospace",wordBreak:"break-all"}}>{item}</code>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Verify Table */}
            <div style={{background:"#040f18",border:"1px solid #0a2a40",borderRadius:8,overflow:"hidden"}}>
              <div style={{background:"#030e1a",padding:"8px 14px",borderBottom:"1px solid #0a2a40"}}>
                <span style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"#00d4ff"}}>📋 BẢNG VERIFY ĐẦY ĐỦ</span>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:480}}>
                  <thead>
                    <tr style={{background:"#030c18"}}>
                      {["Feature","Lệnh Verify","Kết Quả Mong Đợi"].map(h=>(
                        <th key={h} style={{padding:"7px 12px",textAlign:"left",fontSize:15,color:"#3a6a8a",fontWeight:700,borderBottom:"1px solid #0a2a40",whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
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
                    ].map((row,i)=>(
                      <tr key={i} style={{borderBottom:"1px solid #0a1828",background:i%2===0?"#030b16":"#020910"}}>
                        <td style={{padding:"7px 12px",fontSize:16,color:"#c0d8f0",whiteSpace:"nowrap"}}>{row[0]}</td>
                        <td style={{padding:"7px 12px"}}><code style={{fontSize:15,color:"#00e5aa",fontFamily:"Share Tech Mono,monospace"}}>{row[1]}</code></td>
                        <td style={{padding:"7px 12px",fontSize:15,color:"#5a8a7a"}}>{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{borderTop:"1px solid #0a2a40",padding:"8px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:15,color:"#1a4a6a",flexWrap:"wrap",gap:6}}>
        <span>NGN/IPv6 Lab — ĐH Đà Lạt</span>
        <span>GV: Trần Vĩnh Phúc | <a href="mailto:phuctv@dlu.edu.vn" style={{color:"#10b981"}}>phuctv@dlu.edu.vn</a></span>
        <span className="desk-only">6 Modules · 25 Labs · 10 Đề Tài</span>
      </div>
    </div>
  );
}