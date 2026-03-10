import { useState } from "react";

const MODULES = [
  {
    id:1, icon:"🔧", color:"#00d4ff", dark:"#002a3f",
    title:"DEPLOY HẠ TẦNG IPv6 NGN",
    labs:"6 Labs", tags:["OSPFv3","BGP","Tunneling","DHCPv6","HSRP","Dual-Stack"],
    desc:"Xây dựng hạ tầng mạng thế hệ mới hoàn chỉnh trên nền IPv6.",
    labList:[
      { num:"1.1", name:"Thiết Lập EVE-NG & IPv6 Cơ Bản", dur:"90 phút", diff:1,
        deploy:["Cài EVE-NG Community 5.0+ trên VMware (RAM≥32GB, SSD 500GB)","Import Cisco IOL L3/L2 images vào /opt/unetlab/addons/iol/bin/","Chạy: /opt/unetlab/wrappers/unl_wrapper -a fixpermissions","Tạo topology 4 node: R1─R2─R3─R4 trên EVE-NG Web UI","Enable IPv6: ipv6 unicast-routing + ipv6 cef trên tất cả routers","Cấu hình địa chỉ IPv6 + link-local FE80:: trên từng interface","Verify: ping ipv6, show ipv6 neighbors, show ipv6 route"],
        cmds:["ipv6 unicast-routing\nipv6 cef\n!\ninterface GigabitEthernet0/0\n  ipv6 address 2001:db8:10:12::1/64\n  ipv6 address FE80::1 link-local\n  ipv6 enable\n  no shutdown\n!\n! Verify\nshow ipv6 interface brief\nshow ipv6 neighbors\nping ipv6 2001:db8:10:12::2 source Lo0"],
        topo:"R1(EDGE)─Gi0/0─R2(CORE)─Gi0/1─R3(DIST)\n                    │\n              R4(ACCESS)\nR1-Lo0: 2001:db8:FFFF:1::1/128\nR2-Lo0: 2001:db8:FFFF:2::1/128\nR1-Gi0/0: 2001:db8:10:12::1/64\nR2-Gi0/0: 2001:db8:10:12::2/64",
        result:["Tất cả interfaces IPv6 UP/UP","Ping IPv6 thành công giữa các routers","show ipv6 neighbors: REACH state","Dual-stack IPv4+IPv6 song song"],
        hints:["Nếu ping fail: kiểm tra 'no shutdown' và IPv6 enable","Link-local FE80:: cần cấu hình thủ công để dễ debug","Dùng 'debug ipv6 icmp' để xem ICMPv6 messages","EVE-NG IOL cần file iourc license hợp lệ"]
      },
      { num:"1.2", name:"OSPFv3 Multi-Area", dur:"120 phút", diff:2,
        deploy:["Tạo OSPFv3 process ID 1: ipv6 router ospf 1 trên mỗi router","Thiết lập router-id dạng IPv4: router-id 1.1.1.1","Gán interface vào Area: ipv6 ospf 1 area 0/1/2","CORE-R1 (ABR): area 1 range 2001:db8:1::/48","EDGE-R1 (ASBR): redistribute connected subnets","IPsec Auth: ipv6 ospf authentication ipsec spi 256 sha1 KEY","Verify: show ipv6 ospf neighbor phải Full state"],
        cmds:["ipv6 router ospf 1\n  router-id 1.1.1.1\n  auto-cost reference-bandwidth 10000\n  area 1 range 2001:db8:1::/48\n  passive-interface GigabitEthernet0/3\n!\ninterface GigabitEthernet0/0\n  ipv6 ospf 1 area 0\n  ipv6 ospf network point-to-point\n  ipv6 ospf hello-interval 5\n  ipv6 ospf dead-interval 20\n!\nshow ipv6 ospf neighbor\nshow ipv6 ospf database\nshow ipv6 route ospf"],
        topo:"Area 0 (Backbone): CORE-R1─CORE-R2─EDGE-R1─EDGE-R2\nArea 1 (Data):     DIST-SW1─ACC-SW1─ACC-SW2\nArea 2 (Voice):    DIST-SW2─ACC-SW3─CME-GW\nArea 10 (Mgmt):    OOB Management\nABR: CORE-R1 (Area0+1+2)\nASBR: EDGE-R1 (redistribute→OSPF)",
        result:["Tất cả OSPF neighbor ở trạng thái Full","Route summarization tại ABR hoạt động","show ipv6 route ospf: đầy đủ routes","Authentication IPsec thành công"],
        hints:["Router-ID bắt buộc nếu không có IPv4 interface","'reference-bandwidth 10000' = 10Gbps để cost chính xác","Dùng 'debug ipv6 ospf adj' khi neighbor không lên","Point-to-point network type bỏ DR/BDR election"]
      },
      { num:"1.3", name:"BGP IPv6 Multi-Homing", dur:"150 phút", diff:3,
        deploy:["router bgp 65001 + no bgp default ipv4-unicast","Khai báo eBGP ISP-A(AS100), ISP-B(AS200)","iBGP EDGE-R1↔R2: update-source Lo0, next-hop-self","address-family ipv6 → neighbor activate","Announce: network 2001:db8::/32","Tạo prefix-list DENY-BOGONS, route-map communities","AS-PATH prepend×3 trên ISP-B (prefer ISP-A)"],
        cmds:["router bgp 65001\n  bgp router-id 1.1.1.1\n  no bgp default ipv4-unicast\n  neighbor 2001:db8:FFFF:2::1 remote-as 65001\n  neighbor 2001:db8:FFFF:2::1 update-source Lo0\n  neighbor 2001:db8:20:1::1 remote-as 100\n  !\n  address-family ipv6\n    network 2001:db8::/32\n    neighbor 2001:db8:FFFF:2::1 activate\n    neighbor 2001:db8:FFFF:2::1 next-hop-self\n    neighbor 2001:db8:20:1::1 activate\n!\nshow bgp ipv6 unicast summary\nshow bgp ipv6 unicast neighbors X routes"],
        topo:"ISP-A(AS100)─eBGP─EDGE-R1(AS65001)\niBGP: EDGE-R1 ↔ EDGE-R2\nISP-B(AS200)─eBGP─EDGE-R2(AS65001)\nPrefix: 2001:db8::/32 announced to both\nPolicy: ISP-A LP=200 (primary)\n        ISP-B LP=100 + prepend×3 (backup)",
        result:["BGP sessions Established với 2 ISP","Traffic ưu tiên qua ISP-A (Local Pref 200)","Failover sang ISP-B < 30 giây","Prefix-list chặn bogon IPv6 address"],
        hints:["'no bgp default ipv4-unicast' bắt buộc cho IPv6-only BGP","Dùng 'clear bgp ipv6 unicast * soft' để reset mà không drop","TTL security: neighbor X ttl-security hops 1","Kiểm tra: show bgp ipv6 unicast 2001:db8::/32 detail"]
      },
      { num:"1.4", name:"IPv6 Tunneling", dur:"100 phút", diff:2,
        deploy:["6in4: tunnel mode ipv6ip, src/dst IPv4, MTU 1480","GRE IPv6: tunnel mode gre ip, MTU 1476","ISATAP: tunnel mode ipv6ip isatap, EUI-64","6to4: tunnel mode ipv6ip 6to4, prefix 2002::/16","Static routes qua tunnel interfaces","Test MTU: ping ipv6 extended df-bit size 1400"],
        cmds:["! 6in4 Manual Tunnel\ninterface Tunnel0\n  ipv6 address 2001:db8:T1::1/64\n  tunnel source GigabitEthernet0/0\n  tunnel destination 192.168.2.1\n  tunnel mode ipv6ip\n  ipv6 mtu 1480\n!\n! GRE\ninterface Tunnel1\n  tunnel mode gre ip\n  ipv6 mtu 1476\n!\n! 6to4\ninterface Tunnel3\n  ipv6 address 2002:C0A8:0101::/48\n  tunnel mode ipv6ip 6to4\nipv6 route 2002::/16 Tunnel3"],
        topo:"R1(192.168.1.1)══[6in4 Proto41]══R2(192.168.2.1)\nTunnel0: 2001:db8:T1::1/64\n\nMTU: 6in4=1480, GRE=1476, 6to4=auto\n6to4 prefix = 2002:hex(IPv4)::/48",
        result:["4 loại tunnel hoạt động và ping được","MTU đúng, không bị fragmentation","Wireshark thấy IPv6-in-IPv4 encapsulation","traceroute IPv6 qua tunnel thành công"],
        hints:["6to4 prefix = 2002 + hex(IPv4). VD: 192.168.1.1=2002:C0A8:0101","ISATAP EUI-64 tự generate từ IPv4 embedded","Kiểm tra MTU: ping ipv6 X repeat 1 size 1500 df-bit","Dùng 'show interface Tunnel0' kiểm tra encaps counter"]
      },
      { num:"1.5", name:"VLAN Trunking & HSRPv2 IPv6", dur:"90 phút", diff:2,
        deploy:["Tạo VLAN 10(Data),20(Server),100(Voice),999(Mgmt)","Trunk 802.1Q: switchport trunk encapsulation dot1q","SVI với IPv6: interface Vlan10 → ipv6 address","HSRPv2: standby version 2, standby 10 ipv6 VIP/64","DIST-SW1 priority 110 (Active), SW2 priority 90","DHCPv6 relay: ipv6 dhcp relay destination CORE-R1"],
        cmds:["vlan 10\n  name DATA-USERS\nvlan 100\n  name VOICE-VLAN\n!\ninterface GigabitEthernet0/1\n  switchport mode trunk\n  switchport trunk encapsulation dot1q\n  switchport trunk allowed vlan 10,20,100,999\n!\ninterface Vlan10\n  ipv6 address 2001:db8:1:10::1/64\n  standby version 2\n  standby 10 ipv6 2001:db8:1:10::F/64\n  standby 10 priority 110\n  standby 10 preempt\n!\nshow standby brief\nshow ipv6 interface Vlan10"],
        topo:"DIST-SW1(Active,Pri=110)──DIST-SW2(Standby,Pri=90)\n         │                          │\n     ACC-SW1                   ACC-SW2\nVIP VLAN10:  2001:db8:1:10::F/64\nVIP VLAN100: 2001:db8:1:100::F/64",
        result:["HSRPv2 Active/Standby đúng trên cả 2 SW","Failover < 3 giây khi shutdown Active SW","VIP IPv6 ping được từ clients","VLAN isolation hoạt động"],
        hints:["'standby version 2' bắt buộc cho IPv6 HSRP","Preempt cần thiết để Active quay lại sau recovery","MD5 auth: standby 10 authentication md5 key-string KEY","'debug standby events' để trace HSRP state changes"]
      },
      { num:"1.6", name:"DHCPv6 Stateful & SLAAC", dur:"90 phút", diff:2,
        deploy:["DHCPv6 pool: address prefix 2001:db8:1:10::/64 lifetime","Gán pool vào SVI: ipv6 dhcp server POOL-NAME","RA flags: managed-config-flag (M=1), other-config-flag (O=1)","DHCPv6 Relay tại distribution: ipv6 dhcp relay destination","SLAAC test: no ipv6 nd suppress-ra trên gateway","Verify client: show ipv6 dhcp binding"],
        cmds:["ipv6 dhcp pool VLAN10-POOL\n  address prefix 2001:db8:1:10::/64 lifetime 86400 3600\n  dns-server 2001:db8:1:10::53\n  domain-name lab.ngn.local\n!\ninterface Vlan10\n  ipv6 dhcp server VLAN10-POOL\n  ipv6 nd managed-config-flag\n  ipv6 nd other-config-flag\n  no ipv6 nd suppress-ra\n!\ninterface Vlan10  ! on relay switch\n  ipv6 dhcp relay destination 2001:db8:FFFF:1::1\n!\nshow ipv6 dhcp pool\nshow ipv6 dhcp binding\nshow ipv6 dhcp statistics"],
        topo:"DHCPv6 Server (CORE-R1: 2001:db8:FFFF:1::1)\n       │ Relay\n  DIST-SW1 (Relay Agent)\n   │           │\nACC-SW1    ACC-SW2\n(DHCPv6    (SLAAC\n Clients)   Clients)",
        result:["Clients nhận IPv6 via DHCPv6 stateful","SLAAC clients tự configure từ RA prefix","DNS server được cấp đúng qua DHCPv6","show ipv6 dhcp binding: entries đầy đủ"],
        hints:["M-flag=1: dùng DHCPv6 cho address","O-flag=1: DHCPv6 cho other info (DNS)","Relay agent cần route đến DHCPv6 server","'debug ipv6 dhcp' để trace DHCPv6 messages"]
      }
    ]
  },
  {
    id:2, icon:"📡", color:"#ff6b35", dark:"#2a1000",
    title:"IPv6 MULTICAST",
    labs:"4 Labs", tags:["PIM-SM","MLDv2","Anycast RP","BSR","SSM"],
    desc:"Triển khai hạ tầng multicast IPv6 cho IPTV, video conference và streaming.",
    labList:[
      { num:"2.1", name:"MLD - Multicast Listener Discovery", dur:"90 phút", diff:2,
        deploy:["Enable: ipv6 multicast-routing trên tất cả routers","MLDv2: ipv6 mld version 2 trên interfaces","Query: ipv6 mld query-interval 60","MLD Snooping switch: ipv6 mld snooping vlan 10","Static join: ipv6 mld join-group FF1E::100","Verify: show ipv6 mld groups"],
        cmds:["ipv6 multicast-routing\n!\ninterface GigabitEthernet0/1\n  ipv6 mld join-group FF1E::100\n  ipv6 mld query-interval 60\n  ipv6 mld version 2\n!\n! Switch MLD Snooping\nipv6 mld snooping\nipv6 mld snooping vlan 10\n!\nshow ipv6 mld groups\nshow ipv6 mld interface GigabitEthernet0/1\nshow ipv6 mld snooping"],
        topo:"Router (MLD Querier)\n     │\n Switch (MLD Snooping)\n  ┌──┴──┐\nHost1  Host2\n(Join FF1E::100)",
        result:["show ipv6 mld groups: entries hiển thị","MLD Snooping ngăn flooding multicast","MLDv2 hỗ trợ Source-Specific Multicast","Query/Response cycle hoạt động đúng"],
        hints:["MLDv1 = IGMPv2, MLDv2 = IGMPv3 cho IPv6","Snooping ngăn multicast flood ra tất cả ports","'debug ipv6 mld' để xem MLD messages","Solicited-node: FF02::1:FF00:0/104"]
      },
      { num:"2.2", name:"PIM-SM Full Deployment", dur:"150 phút", diff:3,
        deploy:["PIM-SM: ipv6 pim sparse-mode trên tất cả interfaces","RP tĩnh: ipv6 pim rp-address 2001:db8:FFFF:1::1","BSR: ipv6 pim bsr candidate bsr priority 100","Candidate RP: ipv6 pim bsr candidate rp group-list FF1E::/16","SSM: ipv6 pim ssm default (FF3x::/96)","Test: source gửi stream, receivers join group"],
        cmds:["ipv6 multicast-routing\nipv6 pim rp-address 2001:db8:FFFF:1::1 FF1E::/16\n!\ninterface GigabitEthernet0/0\n  ipv6 pim sparse-mode\n!\n! BSR (CORE-R2)\nipv6 pim bsr candidate bsr 2001:db8:FFFF:2::1 priority 100\nipv6 pim bsr candidate rp 2001:db8:FFFF:1::1 priority 10\n!\nipv6 pim ssm default\n!\nshow ipv6 pim neighbor\nshow ipv6 pim rp mapping\nshow ipv6 mroute"],
        topo:"Source─→CORE-R1(RP: 2001:db8:FFFF:1::1)\n              │        CORE-R2(BSR)\n       ┌──────┴──────┐\n  DIST-SW1       DIST-SW2\n     │                │\n  VLAN10/20       VoIP\nGroup: FF1E::STREAM",
        result:["PIM neighbors established","RP election thành công qua BSR","show ipv6 mroute: (*,G) và (S,G) entries","SPT switchover hoạt động"],
        hints:["PIM sparse-mode cần RP để forward multicast","BSR tự động distribute RP info qua mạng","SSM không cần RP: receiver specify cả source","'debug ipv6 pim' để trace join/prune messages"]
      },
      { num:"2.3", name:"Anycast RP Redundancy", dur:"120 phút", diff:3,
        deploy:["Tạo Lo100 với cùng anycast addr trên R1 và R2","ipv6 pim anycast-rp ANYCAST peer1 peer2","Distribute anycast prefix vào OSPFv3","Test: shutdown RP1, kiểm tra switchover","Verify: show ipv6 pim rp mapping"],
        cmds:["! CORE-R1 và CORE-R2 cùng địa chỉ anycast\ninterface Loopback100\n  ipv6 address 2001:db8:FF:RP::1/128\n!\nipv6 pim anycast-rp 2001:db8:FF:RP::1 2001:db8:FFFF:1::1\nipv6 pim anycast-rp 2001:db8:FF:RP::1 2001:db8:FFFF:2::1\n!\nipv6 router ospf 1\n  redistribute connected\n!\nshow ipv6 pim rp mapping\nshow ipv6 mroute"],
        topo:"CORE-R1(Lo100: 2001:db8:FF:RP::1)\nCORE-R2(Lo100: 2001:db8:FF:RP::1) ←same anycast\n\nRouters chọn RP gần nhất theo OSPF cost\nFailover: tự động khi RP1 down",
        result:["Redundancy RP hoạt động","Failover < 5 giây khi RP1 down","Multicast stream không bị interrupt","Load sharing giữa 2 RP theo topology"],
        hints:["Anycast = nhiều RP dùng chung 1 địa chỉ","IPv6 Anycast RP không cần MSDP như IPv4","Verify: ping anycast từ nhiều điểm","traceroute xem path đến RP"]
      },
      { num:"2.4", name:"Multicast + QoS Integration", dur:"90 phút", diff:3,
        deploy:["Class-map: match protocol rtp video (Video class)","Set DSCP AF41 cho video multicast stream","CBWFQ: bandwidth percent 25 cho VIDEO class","WRED: random-detect dscp af41 30 50 10","CME MoH Multicast: multicast moh 239.0.0.1","Đo: show policy-map interface, Wireshark RTP"],
        cmds:["class-map match-any VIDEO-MULTICAST\n  match dscp af41\n!\npolicy-map CORE-QUEUING\n  class VIDEO-MULTICAST\n    bandwidth percent 25\n    random-detect dscp-based\n    random-detect dscp af41 30 50 10\n  class VOIP-RTP\n    priority percent 15\n!\n! CME Music on Hold\ntelephony-service\n  moh flash:/moh.wav\n  multicast moh 239.0.0.1 port 16384\n!\nshow policy-map interface Gi0/0"],
        topo:"VideoServer─[DSCP AF41]─→Core─[CBWFQ 25%]─→Receivers\nMoH─[Multicast 239.0.0.1]─→CME─→IP Phones hold\n\nDSCP: Video=AF41, Voice=EF, Data=AF31\nWRED: drop AF41 sớm khi congestion",
        result:["Video DSCP AF41 end-to-end","WRED giảm congestion proactively","MoH phát khi IP Phone ở hold","Jitter video < 30ms dưới load"],
        hints:["WRED drop packets sớm trước khi queue đầy","AF41 > AF31 > AF11 > BE về priority","Kiểm tra MoH: gọi call rồi hold","'show queue Gi0/0' xem real-time queue status"]
      }
    ]
  },
  {
    id:3, icon:"⚡", color:"#f59e0b", dark:"#1f1200",
    title:"QUALITY OF SERVICE (QoS)",
    labs:"5 Labs", tags:["DSCP","CBWFQ","LLQ","Shaping","WRED","Policing"],
    desc:"Đảm bảo chất lượng dịch vụ end-to-end cho VoIP, Video và dữ liệu.",
    labList:[
      { num:"3.1", name:"DSCP Marking & Classification", dur:"100 phút", diff:2,
        deploy:["Class-map VoIP: match dscp ef + match protocol rtp audio","Class-map Video: match dscp af41 + rtp video","Class-map Critical: match dscp af31 + ACL","IPv6 ACL: permit tcp src dst eq 1433","Policy-map MARK-IN: set dscp ef/af41/af31","Apply input: service-policy input MARK-DSCP-IN"],
        cmds:["class-map match-any VOIP-RTP\n  match protocol rtp audio\n  match dscp ef\nclass-map match-any VIDEO-CONF\n  match protocol rtp video\n  match dscp af41\n!\nipv6 access-list CRITICAL-APPS\n  permit tcp 2001:db8:1::/48 any eq 1433\n!\npolicy-map MARK-DSCP-IN\n  class VOIP-RTP\n    set dscp ef\n  class VIDEO-CONF\n    set dscp af41\n  class class-default\n    set dscp default\n!\ninterface GigabitEthernet0/0\n  service-policy input MARK-DSCP-IN\n!\nshow policy-map interface Gi0/0 input"],
        topo:"[Untrusted]→[Marking at Edge]→[Trusted Core]\nVoIP RTP   → DSCP EF  (46)\nVoIP SIP   → DSCP CS3 (24)\nVideo Conf → DSCP AF41(34)\nBusiness   → DSCP AF31(26)\nInternet   → DSCP BE  (0)",
        result:["Traffic được mark đúng DSCP tại ingress","Counters tăng theo class","DSCP trust từ IP Phone port","Re-marking tại untrusted ports về BE"],
        hints:["DSCP field nằm trong IPv6 Traffic Class byte","match-any = OR, match-all = AND","Verify DSCP: Wireshark filter 'ipv6 && ip.dsfield'","'show class-map' xem cấu hình class hiện tại"]
      },
      { num:"3.2", name:"LLQ & CBWFQ Queuing", dur:"120 phút", diff:3,
        deploy:["LLQ VoIP: priority percent 15 (strict priority queue)","Police LLQ: conform transmit, exceed drop","CBWFQ Video: bandwidth percent 25 + WRED","CBWFQ Business: bandwidth percent 30 + fair-queue","Scavenger: bandwidth percent 5 + police 3%","Apply output: service-policy output WAN-QUEUING"],
        cmds:["policy-map WAN-QUEUING-OUT\n  class VOIP-RTP\n    priority percent 15\n    police rate percent 15\n      conform-action transmit\n      exceed-action drop\n  class VIDEO-CONF\n    bandwidth percent 25\n    random-detect dscp-based\n  class CRITICAL-DATA\n    bandwidth percent 30\n    fair-queue\n  class class-default\n    bandwidth percent 25\n    fair-queue\n!\ninterface GigabitEthernet0/0\n  service-policy output WAN-QUEUING-OUT\n!\nshow policy-map interface Gi0/0 output"],
        topo:"WAN Egress Interface\n┌─LLQ 15%──────VoIP EF  (strict)\n├─CBWFQ 25%────Video AF41 (WRED)\n├─CBWFQ 30%────Business AF31\n├─CBWFQ 5%─────Scavenger CS1\n└─Default 25%──Best Effort",
        result:["VoIP luôn được phục vụ trước","Video không bị drop normal load","Scavenger limited < 3% bandwidth","show policy-map: queue depth và drops"],
        hints:["LLQ priority percent = max BW, không phải min","Nếu priority > 15%, data classes bị starve","WRED tốt hơn tail-drop cho TCP traffic","'show interface Gi0/0' xem output drops"]
      },
      { num:"3.3", name:"Traffic Shaping & Policing", dur:"100 phút", diff:2,
        deploy:["Shaping: shape average 100000000 (100Mbps WAN)","Nested policy: shape → service-policy queuing","Policing inbound: police rate 150Mbps conform/exceed","Dual-rate: police rate cir bc be actions","Test với iperf3: iperf3 -c target -6 -b 200M","Verify: show policy-map interface output"],
        cmds:["policy-map WAN-SHAPE\n  class class-default\n    shape average 100000000\n    service-policy WAN-QUEUING-OUT\n!\npolicy-map POLICE-INBOUND\n  class class-default\n    police rate 150000000\n      conform-action transmit\n      exceed-action drop\n!\ninterface GigabitEthernet0/0\n  service-policy input POLICE-INBOUND\n  service-policy output WAN-SHAPE\n!\niperf3 -c 2001:db8:1:10::100 -6 -b 200M -t 30\nshow policy-map interface Gi0/0\nshow traffic-shape Gi0/0"],
        topo:"Physical: 1Gbps Link\n→ Shape output to 100Mbps\n  → Nested QoS: LLQ+CBWFQ\nInbound:\n→ Police at 150Mbps\n  → conform: transmit\n  → exceed: drop/remark",
        result:["Output không vượt 100Mbps","show traffic-shape: Active","Inbound policed tại 150Mbps","iperf3 report xác nhận bandwidth limit"],
        hints:["Shaping = buffer excess, Policing = drop excess","Bc = committed burst, Be = excess burst","'show traffic-shape queue' xem shaping buffer","Nested policy: shape phải là outermost"]
      },
      { num:"3.4", name:"QoS Trust Boundary", dur:"90 phút", diff:2,
        deploy:["IP Phone port: mls qos trust dscp","Data port: không trust, re-mark về BE","Auto QoS: auto qos voip cisco-phone tự động","DSCP-to-CoS mapping: mls qos map dscp-to-cos","Verify chain từ phone → access → distribution → WAN","Test: gọi call, Wireshark capture DSCP EF"],
        cmds:["mls qos\n!\ninterface GigabitEthernet0/1\n  description IP-PHONE-PORT\n  mls qos trust dscp\n  switchport voice vlan 100\n  spanning-tree portfast\n!\ninterface GigabitEthernet0/2\n  description PC-DATA-PORT\n  mls qos trust cos\n!\nmls qos map dscp-to-cos 46 to 5\nmls qos map dscp-to-cos 34 to 4\n!\nshow mls qos interface Gi0/1\nshow mls qos maps dscp-to-cos"],
        topo:"Trust Boundary at Access Switch:\nIP Phone→[DSCP EF trusted]→Access→Core→WAN\nPC──────→[CoS 0→DSCP BE]──→Access (re-mark)\n\nTrust: IP Phone DSCP preserved\nUntrust: PC traffic always re-marked to BE",
        result:["VoIP DSCP EF preserved end-to-end","PC traffic re-marked về BE tại access","No DSCP manipulation từ end users","QoS consistent E2E"],
        hints:["Trust boundary ngăn users tự set DSCP cao","'auto qos voip' tự tạo policy cho voice port","CoS = Layer 2, DSCP = Layer 3","Kiểm tra: show mls qos interface statistics"]
      },
      { num:"3.5", name:"QoS Verification & Tuning", dur:"90 phút", diff:2,
        deploy:["Baseline: show policy-map interface (all counters)","Simulate congestion: iperf3 fill link 95%","Monitor real-time: watch show interface stats","IP SLA VoIP: ip sla 1 udp-jitter target 16384","WRED tuning: adjust min/max-threshold","Report: jitter, latency, loss per class"],
        cmds:["ip sla 1\n  udp-jitter 2001:db8:5:1::1 16384 codec g711ulaw\n  frequency 60\nip sla schedule 1 life forever start-time now\n!\nshow ip sla statistics 1\nshow ip sla summary\n!\n! Congestion test\n! Server: iperf3 -s -6\n! Client: iperf3 -c TARGET -6 -b 950M -t 60\n!\nshow policy-map interface Gi0/0 output\nshow queue GigabitEthernet0/0\nshow interface Gi0/0 | include drop\n!\n! WRED tuning\nrandom-detect dscp af41 25 45 8"],
        topo:"[IP SLA Probes] → all critical paths\n[iperf3 Traffic Gen] → simulate 95% load\n[show policy-map] → queue statistics\nTargets:\n  VoIP: Jitter<10ms, Loss=0%\n  Video: Jitter<30ms, Loss<0.1%\n  Data: Best effort",
        result:["IP SLA report jitter/loss/delay","WRED giảm drops trước khi queue full","QoS hiệu quả dưới 95% load","Báo cáo baseline vs loaded performance"],
        hints:["IP SLA cần responder: ip sla responder trên target","MOS = Mean Opinion Score, target ≥ 4.0","'show ip sla statistics' sau 5 phút có data","Tune WRED: lower thresholds = earlier drops = less jitter"]
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
        deploy:["DHCP pool: option 150 ip CME-IP (TFTP server)","telephony-service: max-ephones 50, max-dn 100","ip source-address CME-IP port 2000","ephone-dn 1: number 1001, name, call-forward","ephone 1: mac-address, type 7962, button 1:1","create cnf-files → phone download config","Phone: DHCP → option150 TFTP → SCCP register"],
        cmds:["ip dhcp pool VOICE-POOL\n  network 192.168.100.0 255.255.255.0\n  default-router 192.168.100.1\n  option 150 ip 192.168.100.1\n  lease 1\nip dhcp excluded-address 192.168.100.1 192.168.100.100\n!\ntelephony-service\n  max-ephones 50\n  max-dn 100\n  ip source-address 192.168.100.1 port 2000\n  create cnf-files version-stamp\n!\nephone-dn 1 dual-line\n  number 1001\n  name Alice Nguyen\n  call-forward busy 5000\n  call-forward noan 5000 timeout 15\n!\nephone 1\n  mac-address 0011.2233.4401\n  type 7962\n  button 1:1\n!\nshow ephone registered\nshow telephony-service all"],
        topo:"IP Phone→[DHCP opt150]→CME-GW\n         →[TFTP SEP*.cnf]\n         →[SCCP TCP:2000 Register]\nExt: 1001-1050\nVoice VLAN: 2001:db8:1:100::/64\nCME: Cisco ISR 2911, IOS 15.x",
        result:["Phones hiển thị Registered","show ephone registered: đầy đủ entries","Gọi nội bộ 1001→1002 thành công","Display name, time hiển thị đúng"],
        hints:["option 150 = TFTP server IP cho phone config","'create cnf-files' sau mỗi lần thay đổi","Type 7962 = Cisco IP Phone 7962G","Nếu phone không register: kiểm tra VLAN, DHCP, TFTP"]
      },
      { num:"4.2", name:"Dial Plan & PSTN Integration", dur:"120 phút", diff:3,
        deploy:["Internal dial peer: dest 1..., session target 127.0.0.1","PSTN FXO: dest 0[2-9]........, port 0/0/0","SIP trunk FreePBX: dest 2..., session FreePBX-IP","Emergency: 113/114/115 → FXO direct","Codec class: preference g711u/g711a/g729","Digit manipulation: forward-digits all"],
        cmds:["! Internal calls\ndial-peer voice 1 voip\n  destination-pattern 1...\n  session protocol sipv2\n  session target ipv4:127.0.0.1\n  codec g711ulaw\n!\n! PSTN via FXO\ndial-peer voice 100 pots\n  destination-pattern 0[2-9]........\n  port 0/0/0\n  forward-digits all\n!\n! SIP Trunk to FreePBX\ndial-peer voice 200 voip\n  destination-pattern 2...\n  session protocol sipv2\n  session target ipv4:192.168.5.2\n  codec g729r8\n  dtmf-relay rtp-nte\n  no vad\n!\nshow dial-peer voice summary\ndebug ccsip messages"],
        topo:"1XXX → CME Internal\n0[2-9]XXXXXXXX → FXO → PSTN\n2XXX → SIP Trunk → FreePBX\n113/114/115 → Emergency FXO\n6000 → Conference\n5000 → Voicemail\nCodec: G.711u first, G.729 fallback",
        result:["Dial plan hoàn chỉnh","PSTN outbound call qua FXO OK","Cross-system CME↔FreePBX calls OK","Emergency calls không bị restrict"],
        hints:["'T' wildcard = thêm digits, '.' = bất kỳ digit","'no vad' tắt Voice Activity Detection","DTMF relay rtp-nte cần khớp 2 đầu","'debug voip dialpeer' trace digit matching"]
      },
      { num:"4.3", name:"Advanced Features", dur:"120 phút", diff:3,
        deploy:["DSPfarm: dspfarm profile 1 conference, max sessions 4","SCCP: sccp local Gi0/0, sccp ccm local, sccp","Conference DN: ephone-dn 60, number 6000, conference meetme","MoH: moh flash:/moh.wav, multicast moh 239.0.0.1","Call Park: ephone-dn 70, park-slot timeout 60 recall","Call Pickup: pickup-group 1"],
        cmds:["dspfarm profile 1 conference\n  codec g711ulaw\n  maximum sessions 4\n  associate application SCCP\n  no shutdown\n!\nsccp local GigabitEthernet0/0\nsccp ccm 192.168.100.1 identifier 1\nsccp\n!\nephone-dn 60\n  number 6000\n  conference meetme\n!\ntelephony-service\n  moh flash:/moh.wav\n  multicast moh 239.0.0.1 port 16384\n!\nephone-dn 70\n  number 7001\n  park-slot timeout 60 recall\n!\nshow dspfarm profile\nshow sccp connections"],
        topo:"CME Features:\n─Conference: DN 6000 (4-party meetme)\n─Call Park: DN 7001-7010 (60s timeout)\n─MoH: 239.0.0.1:16384 (multicast)\n─Pickup Group: 1 (phones 1001-1005)\n─Voicemail: 5000 (call-forward)",
        result:["3-party/4-party conference hoạt động","MoH phát nhạc khi call bị hold","Park & Retrieve trong timeout","Pickup group nhận call đúng"],
        hints:["DSPfarm cần PVDM2 module hoặc software","MoH file: mono, 8kHz, G.711 WAV format","'show ephone-dn summary' xem tất cả DNs","Call Park: nhấn Park button → dial 7001 để retrieve"]
      },
      { num:"4.4", name:"CME + QoS End-to-End", dur:"90 phút", diff:3,
        deploy:["Verify DSCP EF từ phone qua access→dist→core","Jitter buffer: playout-delay mode adaptive nominal 60","Voice class codec: g711 > g729","Trusted list: voice service voip → ip address trusted","IP SLA probe: udp-jitter đến CME port 16384","Wireshark capture RTP stream, phân tích MOS"],
        cmds:["voice service voip\n  ip address trusted list\n    ipv4 192.168.100.0 255.255.255.0\n    ipv6 2001:db8:5::/48\n!\ndial-peer voice 200 voip\n  playout-delay mode adaptive\n  playout-delay nominal 60\n  playout-delay maximum 200\n!\nip sla 10\n  udp-jitter 192.168.100.1 16384 codec g711ulaw\n  frequency 30\nip sla schedule 10 life forever start-time now\n!\nshow ip sla statistics 10\nshow call active voice brief\nshow ephone statistics"],
        topo:"CME QoS Path:\nPhone→[EF DSCP]→AccessSW→[LLQ]→DistSW\n→[CBWFQ]→CoreRouter→[Priority]→CME\nJitter Buffer: adaptive 60-200ms\nCodec: G.711u (MOS~4.4)\nTarget: MOS≥4.0, Jitter<10ms, Loss=0%",
        result:["MOS score ≥ 4.0 từ IP SLA","Jitter < 10ms end-to-end","Zero packet loss trên VoIP path","G.711/G.729 codec negotiation OK"],
        hints:["Adaptive jitter buffer tự điều chỉnh theo network","G.711 = 64kbps nhưng MOS cao hơn G.729","'show voice call active' xem real-time stats","Wireshark: Telephony→RTP→Stream Analysis"]
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
        deploy:["Ubuntu 22.04 VM: 4GB RAM, 2vCPU, 60GB, dual NIC","Netplan: dual-stack IPv4 192.168.5.2/24 + IPv6","Download & run installer: ./sng_freepbx_debian_install.sh","PJSIP IPv6: tạo transport-udp6 bind=[::]:5060","Thiết lập localnet, externaddr IPv6","Truy cập GUI: http://192.168.5.2/admin","fwconsole start → Apply Config"],
        cmds:["# /etc/netplan/00-installer-config.yaml\nnetwork:\n  version: 2\n  ethernets:\n    ens3:\n      addresses:\n        - 192.168.5.2/24\n        - 2001:db8:5:2::2/64\n      routes:\n        - to: ::/0\n          via: 2001:db8:5:2::1\n      nameservers:\n        addresses: [2001:db8:1:10::53]\n\nsudo netplan apply\n\n# /etc/asterisk/pjsip.conf\n[transport-udp6]\ntype=transport\nprotocol=udp\nbind=[::]:5060\n\n# Verify\nsudo asterisk -rvvv\nCLI> pjsip show transports\nCLI> core show version"],
        topo:"Ubuntu 22.04 VM (EVE-NG QEMU)\nIPv4: 192.168.5.2/24\nIPv6: 2001:db8:5:2::2/64\nAsterisk 21 + FreePBX 17\nSIP: UDP:5060, TLS:5061\nRTP: 10000-20000/udp",
        result:["FreePBX Web GUI accessible","fwconsole status: all green","PJSIP transports IPv4+IPv6 active","Firewall rules allow SIP/RTP"],
        hints:["FreePBX install mất 20-30 phút, cần internet","'fwconsole ma upgradeall' update modules","Firewall: ufw allow 5060/udp","Debug: tail -f /var/log/asterisk/full"]
      },
      { num:"5.2", name:"Extensions, Trunks & IVR", dur:"120 phút", diff:2,
        deploy:["Extensions: Applications→Extensions→Add pjSIP (2001-2010)","SIP Trunk đến CME: Connectivity→Trunks→PJSIP trunk","Outbound Route: TO-CME, pattern 1XXX và 0.","Inbound Route: FROM-CME, destination IVR","IVR: Applications→IVR, record greeting, menu entries","Ring Groups: dept-sales (2001-2003), support (2004-2006)"],
        cmds:["# Asterisk CLI debug\nsudo asterisk -rvvv\n\nCLI> pjsip show registrations\nCLI> pjsip show endpoints\nCLI> pjsip show contacts\n\n# Debug SIP\nCLI> pjsip set logger on\n\n# Test call\nCLI> channel originate PJSIP/2001 extension 1001@from-internal\n\n# Check dialplan\nCLI> dialplan show from-internal\nCLI> core show channels verbose"],
        topo:"FreePBX Dialplan:\nInbound→IVR 9000\n  1→Ring Group: Sales (2001,2002,2003)\n  2→Ring Group: Support (2004,2005)\n  0→Ext 2000 (Operator)\n  t→VoiceMail 2000\nOutbound:\n  1XXX→CME-Trunk\n  0.  →CME-Trunk→PSTN",
        result:["Extensions register từ Zoiper/Linphone","SIP trunk CME↔FreePBX UP","IVR auto routing đúng menu","Cross-system calls hoạt động"],
        hints:["Softphone: Zoiper Free hoặc Linphone","pjsip show endpoints: Unavailable→Online","'pjsip set logger on' xem SIP INVITE/200 OK","IVR: upload WAV file mono 8kHz G.711"]
      },
      { num:"5.3", name:"CDR, Recording & Monitoring", dur:"90 phút", diff:2,
        deploy:["Call Recording: Admin→Module Admin→CallRecording","CDR MySQL: cấu hình /etc/asterisk/cdr_mysql.conf","CDR Reports: Admin→CDR Reports filter theo date/ext","Asterisk CLI: core show channels, pjsip show endpoints","Fail2ban: bảo vệ SIP registration brute-force","CSV export: Admin→CDR Reports→Download"],
        cmds:["# /etc/asterisk/cdr_mysql.conf\n[global]\nhostname=localhost\ndbname=asteriskcdrdb\ntable=cdr\npassword=secret\nuser=asterisk\n\n# Kiểm tra CDR\nmysql -u asterisk -p asteriskcdrdb\nSELECT src,dst,disposition,duration\nFROM cdr ORDER BY calldate DESC LIMIT 20;\n\n# Asterisk monitoring\nsudo asterisk -rvvv\nCLI> core show channels verbose\nCLI> core show calls\n\n# Fail2ban\nsudo fail2ban-client status asterisk\n\n# Recordings\nls /var/spool/asterisk/monitor/"],
        topo:"FreePBX Stack:\n├─CDR→MySQL(asteriskcdrdb)\n│   ↓ Reports & CSV Export\n├─Recordings→/var/spool/asterisk/monitor/\n├─Logs→/var/log/asterisk/full\n├─Fail2ban→blocks brute-force\n└─Dashboard→Admin→System Status",
        result:["CDR lưu mọi cuộc gọi vào MySQL","Recordings download từ GUI","Dashboard real-time active calls","Fail2ban block sau 3 failed auth"],
        hints:["CDR lưu sau call kết thúc, không real-time","Recording format: wav49 nén nhỏ hơn wav","Fail2ban log: /var/log/fail2ban.log","'fwconsole reload' sau thay đổi config"]
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
        deploy:["Deploy theo thứ tự: Layer2→OSPFv3→BGP→Multicast→QoS","CME: register phones, test dial plan","FreePBX: extensions, SIP trunk CME","Cross-system: gọi 1001 từ 2001 (CME↔FreePBX)","E2E QoS: DSCP EF từ phone đến phone","Multicast: stream từ source đến VLAN10,20"],
        cmds:["! Verification Checklist\n! 1. OSPFv3\nshow ipv6 ospf neighbor\n! 2. BGP\nshow bgp ipv6 unicast summary\n! 3. HSRP\nshow standby brief\n! 4. PIM Multicast\nshow ipv6 pim neighbor\nshow ipv6 mroute\n! 5. QoS\nshow policy-map interface Gi0/0\n! 6. DHCPv6\nshow ipv6 dhcp binding\n! 7. CME\nshow ephone registered\n! 8. FreePBX\nasterisk -rx 'pjsip show endpoints'\n! 9. SIP Trunk\nshow sip-ua status registrar\n! 10. E2E QoS under load\niperf3 -c TARGET -6 -b 800M -t 30 -P 4"],
        topo:"FULL NGN:\nISP-A/B─eBGP─EDGE-R1/R2(AS65001)\n─iBGP─OSPFv3─CORE-R1/R2(RP,BSR)\n─HSRPv2─DIST-SW1/SW2\n─VLANs─ACC-SW1/SW2/SW3\n─CME(1XXX)─SIPTrunk─FreePBX(2XXX)\n─PSTN(FXO)─PIM-SM Multicast─QoS",
        result:["Tất cả 10 checklist items PASS","Cross-system calls OK","Video stream đến all clients","QoS metrics trong ngưỡng"],
        hints:["Deploy từng layer, verify trước khi next","'show tech-support' lưu toàn bộ state","EVE-NG packet capture để debug","Document IP scheme trước khi deploy"]
      },
      { num:"6.2", name:"Security Hardening", dur:"150 phút", diff:3,
        deploy:["RA Guard: policy BLOCK-RA, apply access ports","DHCPv6 Snooping: vlan 10,20,100, trust uplink","IPv6 Source Guard: access ports","uRPF strict: ipv6 verify unicast source reachable-via rx","VoIP trusted list + SIP authentication","Pentest: Scapy IPv6 RA flood test"],
        cmds:["! RA Guard\nipv6 nd raguard policy BLOCK-RA\n  device-role host\ninterface range Gi0/1-24\n  ipv6 nd raguard attach-policy BLOCK-RA\n!\n! DHCPv6 Snooping\nipv6 dhcp snooping\nipv6 dhcp snooping vlan 10,20,100\ninterface GigabitEthernet0/25  ! uplink\n  ipv6 dhcp snooping trust\n!\n! IPv6 Source Guard\ninterface GigabitEthernet0/1\n  ipv6 source-guard\n!\n! uRPF\ninterface GigabitEthernet0/0\n  ipv6 verify unicast source reachable-via rx\n!\nshow ipv6 nd raguard policy\nshow ipv6 dhcp snooping\nshow ipv6 source-guard policy"],
        topo:"Security Layers:\n[uRPF+BGP Filter]──────EDGE\n[OSPFv3 IPsec Auth]────CORE\n[RA Guard+DHCPv6 Snoop]DIST\n[Src Guard+Port Sec]───ACCESS\n[SIP Auth+Trusted List]VoIP",
        result:["Rogue RA bị chặn hoàn toàn","DHCPv6 spoofing không hoạt động","uRPF drop 100% spoofed packets","VoIP toll fraud prevented"],
        hints:["Test RA Guard: Scapy 'sendp(IPv6/ICMPv6ND_RA())'","uRPF strict cần symmetric routing","'show ipv6 dhcp snooping statistics' đếm violations","Fail2ban FreePBX auto-block sau 3 fail"]
      },
      { num:"6.3", name:"Monitoring & Management", dur:"120 phút", diff:2,
        deploy:["SNMPv3: group NGN-ADMIN v3 priv, user admin sha+aes256","Syslog: logging 2001:db8:1:999::30, trap informational","NetFlow v9: export destination, ingress/egress","IP SLA: udp-jitter probes VoIP quality","Cài Zabbix/Grafana trên mgmt server","Dashboard: BGP state, OSPF, VoIP, alerts"],
        cmds:["! SNMPv3\nsnmp-server group NGN-ADMIN v3 priv\nsnmp-server user admin NGN-ADMIN v3\n  auth sha AuthPass123\n  priv aes 256 PrivPass456\nsnmp-server host 2001:db8:1:999::10 version 3 priv admin\nsnmp-server enable traps\n!\n! Syslog\nlogging 2001:db8:1:999::30\nlogging trap informational\nlogging source-interface Loopback0\n!\n! NetFlow v9\nip flow-export version 9\nip flow-export destination 2001:db8:1:999::20 9995\ninterface GigabitEthernet0/0\n  ip flow ingress\n  ip flow egress\n!\nshow snmp\nshow logging\nshow ip flow export"],
        topo:"Management VLAN999 (2001:db8:1:999::/64):\n┌─NMS Zabbix: ::10\n├─Syslog: ::30\n├─NetFlow: ::20\n└─TFTP: ::40\nAll devices → SNMPv3/Syslog/NetFlow",
        result:["SNMP polls thành công từ NMS","Syslog tập trung đầy đủ","NetFlow dashboard hiện traffic","Alerts khi BGP drop/interface down"],
        hints:["SNMPv3 priv mã hóa, auth verify sender","Syslog: 0=emerg, 6=info, 7=debug","NetFlow v9 hỗ trợ IPv6, v5 chỉ IPv4","Zabbix template: Cisco IOS SNMPv3"]
      }
    ]
  }
];

const THESIS = [
  { id:1, icon:"🏢", color:"#00d4ff", level:"medium", dur:"6-8 tuần", team:"2-3 SV",
    title:"Mạng LAN Doanh Nghiệp Nhỏ với IPv6 Dual-Stack",
    sub:"SME Dual-Stack LAN",
    overview:"Thiết kế mạng LAN cho 50-100 nhân viên với IPv6 dual-stack, OSPFv3, HSRP và VoIP cơ bản.",
    scope:["IPv6 dual-stack cho 3 VLAN (Data/Voice/Mgmt)","OSPFv3 single-area + HSRP redundancy","Cisco CME 20 IP phones, dial plan cơ bản","QoS 3 lớp: Voice/Video/Data","DHCPv6 và SLAAC cho end users"],
    topo:"ISP─BGP─EDGE-R1\n─OSPFv3─CORE-SW\n─VLAN10/20/100─ACCESS\n─CME(20 phones)\nScale: 50-100 users",
    deploy:["Tuần 1-2: Thiết kế addressing, VLAN, topo","Tuần 3-4: Deploy OSPFv3, HSRP, DHCPv6","Tuần 5-6: CME setup, basic QoS, testing","Tuần 7-8: Security basics, documentation"],
    result:["IPv6 connectivity end-to-end","VoIP MOS ≥ 3.8, 20 phones OK","HSRP failover < 5 giây","Dual-stack hoạt động"],
    tech:["Cisco IOL","OSPFv3","HSRPv2","CME","DHCPv6","QoS"]
  },
  { id:2, icon:"🎓", color:"#f59e0b", level:"medium", dur:"6-8 tuần", team:"2-3 SV",
    title:"Hệ Thống VoIP FreePBX cho Tổ Chức Giáo Dục",
    sub:"Education VoIP Platform",
    overview:"FreePBX cho trường học với IVR tự động, call recording cho giảng dạy và voicemail-to-email.",
    scope:["50 extensions: giảng viên + nhân viên","IVR: Tuyển sinh, Đào tạo, Hành chính","Call Recording cho hội thảo/giờ học","Ring Groups theo phòng ban","Voicemail-to-Email tích hợp"],
    topo:"FreePBX Server\n├─Ext 1XXX: Giảng viên\n├─Ext 2XXX: VP/Phòng ban\n├─IVR 9000: Auto Attendant\n└─SIP Trunk: PSTN provider",
    deploy:["Tuần 1-2: Cài FreePBX, thiết kế ext plan","Tuần 3-4: IVR, Ring Groups, Voicemail","Tuần 5-6: Call Recording, Reporting","Tuần 7-8: Testing, documentation"],
    result:["50 extensions hoạt động ổn định","IVR routing đúng 95%+","Recordings phục vụ đào tạo","CDR báo cáo chi phí cuộc gọi"],
    tech:["FreePBX","Asterisk","PJSIP","IVR","CDR","Voicemail"]
  },
  { id:3, icon:"🔐", color:"#10b981", level:"medium", dur:"6-8 tuần", team:"2-3 SV",
    title:"Bảo Mật IPv6 First-Hop & Phòng Chống Tấn Công Layer 2",
    sub:"IPv6 First-Hop Security",
    overview:"Phân tích tấn công RA flood, DHCPv6 spoofing, NDP spoofing và triển khai giải pháp phòng thủ.",
    scope:["Tấn công thực nghiệm: RA flood, DHCPv6 rouge","Triển khai RA Guard, DHCPv6 Snooping","IPv6 Source Guard, DAD Proxy","So sánh hiệu quả trước/sau bảo mật","Vulnerability assessment report"],
    topo:"Attack Lab:\n[Attacker VM]─[Access SW]─[Victim]\nDefense Lab:\n[RA Guard + DHCPv6 Snoop + uRPF]\nTools: Scapy, THC-IPv6, Wireshark",
    deploy:["Tuần 1-2: Lab setup, nghiên cứu attacks","Tuần 3-4: Thực hiện tấn công, evidence","Tuần 5-6: Deploy defenses, re-test","Tuần 7-8: Đánh giá, báo cáo"],
    result:["Demonstrate RA flood thành công","RA Guard chặn 100% rogue RA","DHCPv6 Snooping ngăn rouge DHCP","Vulnerability report với recommendations"],
    tech:["Scapy","THC-IPv6","RA Guard","DHCPv6 Snooping","uRPF","Wireshark"]
  },
  { id:4, icon:"📊", color:"#a855f7", level:"medium", dur:"7-9 tuần", team:"3 SV",
    title:"Giám Sát & Phân Tích Mạng NGN với Zabbix và ELK Stack",
    sub:"NGN Network Monitoring",
    overview:"Hệ thống giám sát toàn diện với Zabbix, ELK Stack, NetFlow analytics và alerting tự động.",
    scope:["Zabbix 6.x monitor Cisco devices SNMPv3","ELK Stack: Syslog aggregation","NetFlow v9 phân tích traffic patterns","IP SLA probes: VoIP MOS, latency","Alerting: Telegram/Email on breach"],
    topo:"Devices─SNMPv3─→Zabbix\n─Syslog─→Logstash─→Elasticsearch\n─NetFlow─→nfcapd─→Grafana\n─IP SLA─→Dashboard\nAlert: Telegram Bot",
    deploy:["Tuần 1-2: Zabbix, import Cisco templates","Tuần 3-4: ELK Stack, Syslog","Tuần 5-6: NetFlow, Grafana dashboards","Tuần 7-9: IP SLA, alerting, reporting"],
    result:["Dashboard real-time tất cả devices","Syslog correlation detect anomalies","NetFlow: top talkers/protocols","VoIP MOS trend chart"],
    tech:["Zabbix","ELK Stack","Grafana","NetFlow","SNMPv3","IP SLA"]
  },
  { id:5, icon:"🌍", color:"#ff6b35", level:"medium", dur:"8-10 tuần", team:"3-4 SV",
    title:"Mạng Campus Đa Tòa Nhà IPv6 cho Đại Học",
    sub:"Campus Network IPv6",
    overview:"Campus đại học 3 tòa nhà với IPv6, WAN redundancy, QoS cho e-learning, video conference và VoIP.",
    scope:["3 tòa nhà: Giảng đường, Thư viện, KTX","OSPFv3 multi-area, WAN dual ISP BGP","QoS: e-learning, video conf, VoIP","CME 100 phones + FreePBX softphones","Multicast IPTV cho giảng đường"],
    topo:"Internet─BGP─EDGE(HQ)\n─OSPFv3─CORE\n─Area1: Giảng Đường\n─Area2: Thư Viện\n─Area3: KTX\nCME: 100 phones",
    deploy:["Tuần 1-2: Thiết kế 3 tòa nhà","Tuần 3-4: Backbone + inter-building","Tuần 5-6: VoIP CME + FreePBX","Tuần 7-8: Multicast IPTV, QoS","Tuần 9-10: Security, monitoring, testing"],
    result:["IPv6 kết nối 3 tòa nhà","150 VoIP endpoints OK","IPTV 10 channels multicast","QoS đảm bảo e-learning"],
    tech:["OSPFv3","MP-BGP","CME","FreePBX","PIM-SM","CBWFQ"]
  },
  { id:6, icon:"🏆", color:"#00d4ff", level:"hard", dur:"8-10 tuần", team:"3-4 SV",
    title:"NGN Doanh Nghiệp Vừa và Nhỏ trên IPv6 Toàn Diện",
    sub:"SME IPv6 NGN Full ★ NCKH",
    overview:"Hệ thống NGN hoàn chỉnh cho 100-500 nhân viên, 3 chi nhánh, dual ISP, Multicast, QoS, CME+FreePBX.",
    scope:["3 chi nhánh kết nối WAN IPv6","OSPFv3 multi-area, BGP multi-homing","PIM-SM Multicast video conferencing","QoS 6 lớp end-to-end","CME 50 phones + FreePBX 30 softphones","Security hardening + Monitoring"],
    topo:"HQ─BGP─ISP-A/B\n─OSPFv3─BRANCH1/2\nCME(50)+FreePBX(30)\nMulticast: video conf\nQoS: 6 classes E2E",
    deploy:["Phase1(T1-2): Design addressing,VLAN","Phase2(T3-4): OSPFv3 + BGP","Phase3(T5-6): QoS + Multicast","Phase4(T7-8): CME + FreePBX","Phase5(T9-10): Security + Monitor"],
    result:["BGP failover < 30s, OSPF < 5s","VoIP MOS ≥ 4.0, jitter < 10ms","Video multicast đến tất cả sites","Zero critical vulnerabilities"],
    tech:["OSPFv3","MP-BGP","HSRPv2","CME","FreePBX","PIM-SM","LLQ","uRPF"]
  },
  { id:7, icon:"☁️", color:"#ff6b35", level:"hard", dur:"10-12 tuần", team:"3-4 SV",
    title:"IPTV & Video Streaming IPv6 Multicast cho ISP/Campus",
    sub:"IPv6 Multicast IPTV ★ NCKH",
    overview:"Nền tảng IPTV 500+ subscribers, 50 kênh HD đồng thời qua IPv6 Multicast với redundancy và QoS.",
    scope:["PIM-SM Anycast RP cho 50+ kênh HD","MLDv2 snooping tối ưu bandwidth","QoS AF41 video, WRED, shaping","SSM (FF3x::) cho on-demand","Load test 500 concurrent streams"],
    topo:"VideoServer─PIM-SM─RP1/RP2(Anycast)\n─BSR─DIST/ACCESS\n─Set-top/PC Receivers\nGroup: FF1E::/16 (50 channels)\nSSM: FF3E::/32 (on-demand)",
    deploy:["T1-2: PIM-SM + Anycast RP","T3-4: MLDv2, snooping, SSM","T5-6: QoS video, load testing","T7-8: Redundancy, failover","T9-10: CDN design, benchmark"],
    result:["50 streams đồng thời không drop","RP failover < 5s","Bandwidth 95% tiết kiệm vs unicast","Report: jitter, loss, capacity"],
    tech:["PIM-SM","Anycast RP","MLDv2","SSM","DSCP AF41","WRED","iperf3"]
  },
  { id:8, icon:"🔒", color:"#10b981", level:"hard", dur:"10-12 tuần", team:"3-4 SV",
    title:"Bảo Mật NGN/IPv6: Zero Trust & Phòng Thủ Đa Lớp",
    sub:"IPv6 Zero Trust ★ NCKH",
    overview:"Zero Trust framework cho NGN/IPv6 với threat modeling, penetration testing và automated response.",
    scope:["Threat: RA flood, DHCPv6 spoof, BGP hijack","IPv6 First-Hop Security hoàn chỉnh","Zone-Based Firewall, uRPF strict","VoIP: SIP TLS, SRTP, toll fraud","SIEM: log correlation, anomaly detection"],
    topo:"[Internet]─uRPF/ACL─EDGE\n[LAN]─RA Guard/Snoop─ACCESS\n[VoIP]─SIP TLS/SRTP─CME\n[Internal]─Zone FW─CORE\nSIEM: ELK + custom rules",
    deploy:["T1-2: Threat modeling, attack lab","T3-4: First-Hop Security","T5-6: Zone FW, VoIP security","T7-8: SIEM, log correlation","T9-10: Pentest, remediation, report"],
    result:["Zero critical vulnerabilities","SIEM detect attacks < 60s","SIP TLS/SRTP 100% voice encrypted","Pentest report CVSS scoring"],
    tech:["RA Guard","uRPF","Zone-Based FW","SIP TLS","SRTP","ELK","Fail2ban"]
  },
  { id:9, icon:"🚀", color:"#a855f7", level:"hard", dur:"12 tuần", team:"4 SV",
    title:"Migration IPv4 → IPv6 NGN cho ISP với MPLS 6VPE",
    sub:"ISP IPv6 Migration ★ Luận Văn",
    overview:"Lộ trình chuyển đổi mạng IPv4 ISP sang IPv6 với MPLS backbone, 6VPE/6PE, NAT64, DS-Lite.",
    scope:["Audit IPv4 legacy, migration roadmap","Dual-Stack transition, tunneling coexistence","MPLS 6VPE (IPv6 VPN over MPLS)","NAT64/DNS64 cho IPv6-only clients","DS-Lite: IPv4 via IPv6 core","Performance evaluation"],
    topo:"IPv4 Legacy Core\n→ Dual-Stack\n→ MPLS 6VPE backbone\n→ NAT64/DNS64 gateway\n→ DS-Lite CGN\n→ Pure IPv6 edge",
    deploy:["T1-2: Audit + roadmap","T3-4: Dual-Stack + tunneling","T5-6: MPLS LDP + 6VPE/6PE","T7-8: NAT64 + DNS64","T9-10: DS-Lite + CGN","T11-12: Testing + report"],
    result:["6VPE L3VPN IPv6 qua MPLS core","NAT64 transparent cho IPv6-only","DS-Lite: IPv4 via IPv6 core","Performance: before vs after"],
    tech:["MPLS","LDP","6VPE","6PE","NAT64","DNS64","DS-Lite","BGP"]
  },
  { id:10, icon:"🤖", color:"#f59e0b", level:"hard", dur:"12 tuần", team:"4 SV",
    title:"SDN-Enabled IPv6 NGN: ONOS Controller & QoS Automation",
    sub:"SDN IPv6 NGN ★ Luận Văn",
    overview:"Tích hợp ONOS SDN controller với NGN/IPv6, tự động hóa QoS policy dựa trên application awareness.",
    scope:["ONOS controller quản lý OpenFlow switches","IPv6 forwarding tự động qua SDN","Application-aware QoS automation","REST API cho policy deployment","So sánh SDN vs Traditional NGN","Performance: control plane latency"],
    topo:"ONOS Controller\n─OpenFlow─OVS Switches\n─REST API─Apps\nIPv6 Data Plane:\nOVS1─OVS2─OVS3\nFallback: Cisco IOS",
    deploy:["T1-2: ONOS setup, OpenFlow lab","T3-4: IPv6 forwarding SDN","T5-6: QoS REST API automation","T7-8: VoIP/Video integration","T9-10: Benchmarks","T11-12: SDN vs Traditional report"],
    result:["ONOS IPv6 forwarding OK","Auto QoS policy deployment","REST API response < 100ms","Benchmark: SDN overhead vs benefits"],
    tech:["ONOS","OpenFlow","OVS","REST API","Python","IPv6","QoS Auto"]
  }
];

const TOPOS = [
  {id:"full",label:"Topology Tổng Thể"},
  {id:"ospf",label:"OSPFv3 Multi-Area"},
  {id:"bgp",label:"BGP Multi-Homing"},
  {id:"mcast",label:"PIM-SM Multicast"},
  {id:"voip",label:"VoIP Integration"},
];

function TopoFull() {
  return <svg viewBox="0 0 800 480" style={{width:"100%",height:"100%"}}>
    <defs>
      <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <marker id="ar1" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0L0,6L7,3z" fill="#00d4ff"/></marker>
      <marker id="ar2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0L0,6L7,3z" fill="#ff6b35"/></marker>
      <marker id="ar3" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0L0,6L7,3z" fill="#a855f7"/></marker>
    </defs>
    <rect width="800" height="480" fill="#020d18"/>
    {[...Array(17)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="480" stroke="#0a2030" strokeWidth="0.5"/>)}
    {[...Array(10)].map((_,i)=><line key={i} x1="0" y1={i*50} x2="800" y2={i*50} stroke="#0a2030" strokeWidth="0.5"/>)}
    <ellipse cx="400" cy="38" rx="85" ry="22" fill="#041520" stroke="#00d4ff" strokeWidth="1.5" filter="url(#glow)"/>
    <text x="400" y="33" textAnchor="middle" fill="#00d4ff" fontSize="10" fontWeight="bold" fontFamily="monospace">INTERNET</text>
    <text x="400" y="49" textAnchor="middle" fill="#1a5a7a" fontSize="8" fontFamily="monospace">Upstream BGP</text>
    {[{x:40,label:"ISP-A",sub:"AS 100"},{x:660,label:"ISP-B",sub:"AS 200"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={78} width={108} height={42} rx="6" fill="#100800" stroke="#ff6b35" strokeWidth="1.5"/>
      <text x={n.x+54} y={96} textAnchor="middle" fill="#ff6b35" fontSize="10" fontWeight="bold" fontFamily="monospace">{n.label}</text>
      <text x={n.x+54} y={111} textAnchor="middle" fill="#6a2a00" fontSize="8" fontFamily="monospace">{n.sub}</text></g>
    ))}
    <line x1="335" y1="55" x2="148" y2="78" stroke="#ff6b35" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#ar2)"/>
    <line x1="465" y1="55" x2="660" y2="78" stroke="#ff6b35" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#ar2)"/>
    <text x="225" y="64" fill="#ff6b35" fontSize="8" fontFamily="monospace">eBGP</text>
    <text x="545" y="64" fill="#ff6b35" fontSize="8" fontFamily="monospace">eBGP</text>
    {[{x:110,label:"EDGE-R1",sub1:"AS65001·QoS",sub2:"FFFF:1::1"},{x:560,label:"EDGE-R2",sub1:"AS65001·QoS",sub2:"FFFF:2::1"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={162} width={130} height={50} rx="7" fill="#041520" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)"/>
      <text x={n.x+65} y={181} textAnchor="middle" fill="#00d4ff" fontSize="10" fontWeight="bold" fontFamily="monospace">{n.label}</text>
      <text x={n.x+65} y={196} textAnchor="middle" fill="#1a7a9a" fontSize="9" fontFamily="monospace">{n.sub1}</text>
      <text x={n.x+65} y={207} textAnchor="middle" fill="#0a4a6a" fontSize="7" fontFamily="monospace">2001:db8:{n.sub2}</text></g>
    ))}
    <line x1="94" y1="120" x2="150" y2="162" stroke="#ff6b35" strokeWidth="1.5" markerEnd="url(#ar2)"/>
    <line x1="714" y1="120" x2="660" y2="162" stroke="#ff6b35" strokeWidth="1.5" markerEnd="url(#ar2)"/>
    <line x1="240" y1="187" x2="560" y2="187" stroke="#00d4ff" strokeWidth="1" strokeDasharray="5,3"/>
    <text x="400" y="182" textAnchor="middle" fill="#00d4ff" fontSize="8" fontFamily="monospace">iBGP</text>
    {[{x:218,label:"CORE-R1",sub1:"OSPFv3 ABR",sub2:"PIM-RP·DHCPv6"},{x:452,label:"CORE-R2",sub1:"OSPFv3 ABR",sub2:"BSR·Multicast"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={262} width={130} height={52} rx="7" fill="#041a10" stroke="#10b981" strokeWidth="2" filter="url(#glow)"/>
      <text x={n.x+65} y={282} textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">{n.label}</text>
      <text x={n.x+65} y={296} textAnchor="middle" fill="#1a7a4a" fontSize="9" fontFamily="monospace">{n.sub1}</text>
      <text x={n.x+65} y={308} textAnchor="middle" fill="#0a4a2a" fontSize="7" fontFamily="monospace">{n.sub2}</text></g>
    ))}
    <line x1="175" y1="212" x2="255" y2="262" stroke="#00d4ff" strokeWidth="1.5" markerEnd="url(#ar1)"/>
    <line x1="625" y1="212" x2="545" y2="262" stroke="#00d4ff" strokeWidth="1.5" markerEnd="url(#ar1)"/>
    <line x1="348" y1="288" x2="452" y2="288" stroke="#10b981" strokeWidth="1.5"/>
    <text x="400" y="283" textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="monospace">OSPFv3 Area0</text>
    {[{x:162,label:"DIST-SW1",sub:"HSRP·VLAN10,20"},{x:508,label:"DIST-SW2",sub:"HSRP·VLAN100"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={365} width={126} height={44} rx="6" fill="#080e18" stroke="#a855f7" strokeWidth="1.5"/>
      <text x={n.x+63} y={384} textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="bold" fontFamily="monospace">{n.label}</text>
      <text x={n.x+63} y={399} textAnchor="middle" fill="#5a1a9a" fontSize="8" fontFamily="monospace">{n.sub}</text></g>
    ))}
    <line x1="268" y1="314" x2="242" y2="365" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#ar3)"/>
    <line x1="482" y1="314" x2="535" y2="365" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#ar3)"/>
    {[{x:48,l:"ACC-SW1",s:"VLAN10",c:"#f59e0b"},{x:165,l:"ACC-SW2",s:"VLAN20",c:"#f59e0b"},{x:497,l:"ACC-SW3",s:"Voice",c:"#f59e0b"},{x:618,l:"CME+PBX",s:"VoIP",c:"#a855f7"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={430} width={98} height={36} rx="5" fill="#06080e" stroke={n.c} strokeWidth="1"/>
      <text x={n.x+49} y={446} textAnchor="middle" fill={n.c} fontSize="9" fontFamily="monospace">{n.l}</text>
      <text x={n.x+49} y={460} textAnchor="middle" fill={n.c} fontSize="7" fontFamily="monospace">{n.s}</text></g>
    ))}
    <line x1="195" y1="409" x2="118" y2="430" stroke="#f59e0b" strokeWidth="1"/>
    <line x1="220" y1="409" x2="210" y2="430" stroke="#f59e0b" strokeWidth="1"/>
    <line x1="535" y1="409" x2="520" y2="430" stroke="#f59e0b" strokeWidth="1"/>
    <line x1="565" y1="409" x2="648" y2="430" stroke="#a855f7" strokeWidth="1"/>
  </svg>;
}
function TopoOSPF() {
  return <svg viewBox="0 0 800 460" style={{width:"100%",height:"100%"}}>
    <rect width="800" height="460" fill="#020d18"/>
    {[...Array(17)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="460" stroke="#0a2030" strokeWidth="0.5"/>)}
    {[...Array(10)].map((_,i)=><line key={i} x1="0" y1={i*50} x2="800" y2={i*50} stroke="#0a2030" strokeWidth="0.5"/>)}
    <ellipse cx="400" cy="185" rx="195" ry="110" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="8,4" opacity="0.7"/>
    <text x="400" y="90" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold" fontFamily="monospace">AREA 0 — BACKBONE</text>
    {[{x:278,label:"CORE-R1",s1:"ABR·RP·DHCP",s2:"ID:1.1.1.1"},{x:410,label:"CORE-R2",s1:"ABR·BSR",s2:"ID:2.2.2.2"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={155} width={116} height={48} rx="7" fill="#041a10" stroke="#10b981" strokeWidth="2"/>
      <text x={n.x+58} y={174} textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">{n.label}</text>
      <text x={n.x+58} y={188} textAnchor="middle" fill="#1a7a4a" fontSize="8" fontFamily="monospace">{n.s1}</text>
      <text x={n.x+58} y={199} textAnchor="middle" fill="#0a4a2a" fontSize="7" fontFamily="monospace">{n.s2}</text></g>
    ))}
    <line x1="394" y1="179" x2="410" y2="179" stroke="#10b981" strokeWidth="1.5"/>
    {[{x:295,label:"EDGE-R1",s:"ASBR·BGP"},{x:399,label:"EDGE-R2",s:"ASBR·BGP"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={240} width={96} height={38} rx="6" fill="#041520" stroke="#00d4ff" strokeWidth="1.5"/>
      <text x={n.x+48} y={257} textAnchor="middle" fill="#00d4ff" fontSize="9" fontWeight="bold" fontFamily="monospace">{n.label}</text>
      <text x={n.x+48} y={271} textAnchor="middle" fill="#1a5a8a" fontSize="7" fontFamily="monospace">{n.s}</text></g>
    ))}
    <line x1="336" y1="203" x2="335" y2="240" stroke="#10b981" strokeWidth="1.5"/>
    <line x1="452" y1="203" x2="445" y2="240" stroke="#10b981" strokeWidth="1.5"/>
    <ellipse cx="155" cy="360" rx="145" ry="90" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.6"/>
    <text x="155" y="280" textAnchor="middle" fill="#00d4ff" fontSize="11" fontWeight="bold" fontFamily="monospace">AREA 1 — DATA</text>
    <rect x="95" y={315} width={120} height={40} rx="6" fill="#041520" stroke="#00d4ff" strokeWidth="1.5"/>
    <text x="155" y="332" textAnchor="middle" fill="#00d4ff" fontSize="9" fontWeight="bold" fontFamily="monospace">DIST-SW1</text>
    <text x="155" y="347" textAnchor="middle" fill="#1a5a8a" fontSize="7" fontFamily="monospace">VLAN10,20·HSRP</text>
    {[{x:50,l:"ACC-SW1"},{x:160,l:"ACC-SW2"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={390} width={90} height={32} rx="5" fill="#03080e" stroke="#4a8aae" strokeWidth="1"/>
      <text x={n.x+45} y={410} textAnchor="middle" fill="#4a8aae" fontSize="8" fontFamily="monospace">{n.l}</text></g>
    ))}
    <line x1="140" y1="355" x2="105" y2="390" stroke="#4a8aae" strokeWidth="1"/>
    <line x1="172" y1="355" x2="200" y2="390" stroke="#4a8aae" strokeWidth="1"/>
    <line x1="305" y1="179" x2="210" y2="315" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="4,3"/>
    <text x="242" y="252" fill="#00d4ff" fontSize="8" fontFamily="monospace" transform="rotate(-35,242,252)">ABR</text>
    <ellipse cx="645" cy="360" rx="145" ry="90" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.6"/>
    <text x="645" y="280" textAnchor="middle" fill="#a855f7" fontSize="11" fontWeight="bold" fontFamily="monospace">AREA 2 — VOICE</text>
    <rect x="585" y={315} width={120} height={40} rx="6" fill="#0a0618" stroke="#a855f7" strokeWidth="1.5"/>
    <text x="645" y="332" textAnchor="middle" fill="#a855f7" fontSize="9" fontWeight="bold" fontFamily="monospace">DIST-SW2</text>
    <text x="645" y="347" textAnchor="middle" fill="#5a1a9a" fontSize="7" fontFamily="monospace">VLAN100·Voice</text>
    {[{x:545,l:"ACC-SW3"},{x:650,l:"CME-GW"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={390} width={90} height={32} rx="5" fill="#03080e" stroke="#7c3aed" strokeWidth="1"/>
      <text x={n.x+45} y={410} textAnchor="middle" fill="#7c3aed" fontSize="8" fontFamily="monospace">{n.l}</text></g>
    ))}
    <line x1="630" y1="355" x2="600" y2="390" stroke="#7c3aed" strokeWidth="1"/>
    <line x1="658" y1="355" x2="688" y2="390" stroke="#7c3aed" strokeWidth="1"/>
    <line x1="478" y1="179" x2="580" y2="315" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <text x="545" y="252" fill="#a855f7" fontSize="8" fontFamily="monospace" transform="rotate(35,545,252)">ABR</text>
    <rect x="326" y={420} width={148} height={36} rx="6" fill="#06060a" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
    <text x="400" y="437" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="bold" fontFamily="monospace">AREA 10 — MGMT</text>
    <text x="400" y="449" textAnchor="middle" fill="#7a5a00" fontSize="7" fontFamily="monospace">OOB · 2001:db8:1:999::/64</text>
  </svg>;
}
function TopoBGP() {
  return <svg viewBox="0 0 800 430" style={{width:"100%",height:"100%"}}>
    <rect width="800" height="430" fill="#020d18"/>
    {[...Array(17)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="430" stroke="#0a2030" strokeWidth="0.5"/>)}
    {[...Array(9)].map((_,i)=><line key={i} x1="0" y1={i*50} x2="800" y2={i*50} stroke="#0a2030" strokeWidth="0.5"/>)}
    {[{x:30,l:"ISP-A",s:"AS 100",d:"2001:db8:20:1::/64"},{x:618,l:"ISP-B",s:"AS 200",d:"2001:db8:20:2::/64"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={38} width={152} height={58} rx="8" fill="#0f0500" stroke="#ff6b35" strokeWidth="2"/>
      <text x={n.x+76} y={58} textAnchor="middle" fill="#ff6b35" fontSize="11" fontWeight="bold" fontFamily="monospace">{n.l}</text>
      <text x={n.x+76} y={74} textAnchor="middle" fill="#8a3000" fontSize="9" fontFamily="monospace">{n.s}</text>
      <text x={n.x+76} y={88} textAnchor="middle" fill="#5a2000" fontSize="7" fontFamily="monospace">{n.d}</text></g>
    ))}
    {[{x:120,l:"EDGE-R1",s1:"AS 65001",s2:"Lo:FFFF:1::1",s3:"LP:200 Primary"},{x:480,l:"EDGE-R2",s1:"AS 65001",s2:"Lo:FFFF:2::1",s3:"LP:100+Prepend×3"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={168} width={160} height={70} rx="9" fill="#041520" stroke="#00d4ff" strokeWidth="2.5"/>
      <text x={n.x+80} y={188} textAnchor="middle" fill="#00d4ff" fontSize="11" fontWeight="bold" fontFamily="monospace">{n.l}</text>
      <text x={n.x+80} y={204} textAnchor="middle" fill="#1a7a9a" fontSize="9" fontFamily="monospace">{n.s1}</text>
      <text x={n.x+80} y={218} textAnchor="middle" fill="#0a4a6a" fontSize="8" fontFamily="monospace">{n.s2}</text>
      <text x={n.x+80} y={230} textAnchor="middle" fill="#062a3a" fontSize="7" fontFamily="monospace">{n.s3}</text></g>
    ))}
    <line x1="182" y1="96" x2="195" y2="168" stroke="#ff6b35" strokeWidth="2"/>
    <line x1="618" y1="96" x2="608" y2="168" stroke="#ff6b35" strokeWidth="2"/>
    <text x="168" y="135" fill="#ff6b35" fontSize="9" fontFamily="monospace">eBGP</text>
    <text x="618" y="135" fill="#ff6b35" fontSize="9" fontFamily="monospace">eBGP</text>
    <line x1="280" y1="203" x2="480" y2="203" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="6,3"/>
    <text x="400" y="197" textAnchor="middle" fill="#00d4ff" fontSize="9" fontFamily="monospace">iBGP (next-hop-self)</text>
    <rect x="280" y={305} width={240} height={52} rx="8" fill="#040e08" stroke="#10b981" strokeWidth="2"/>
    <text x="400" y="325" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">OUR PREFIX: 2001:db8::/32</text>
    <text x="400" y="343" textAnchor="middle" fill="#1a6a3a" fontSize="8" fontFamily="monospace">Announced to ISP-A (primary) & ISP-B (backup)</text>
    <line x1="240" y1="238" x2="330" y2="305" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,2"/>
    <line x1="560" y1="238" x2="470" y2="305" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,2"/>
    <text x="400" y="398" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">Traffic Engineering: ISP-A Primary (LP=200) → Failover ISP-B (LP=100 + AS-Prepend×3)</text>
  </svg>;
}
function TopoMcast() {
  return <svg viewBox="0 0 800 440" style={{width:"100%",height:"100%"}}>
    <rect width="800" height="440" fill="#020d18"/>
    {[...Array(17)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="440" stroke="#0a2030" strokeWidth="0.5"/>)}
    {[...Array(9)].map((_,i)=><line key={i} x1="0" y1={i*50} x2="800" y2={i*50} stroke="#0a2030" strokeWidth="0.5"/>)}
    <rect x="310" y="16" width="180" height="48" rx="8" fill="#100a00" stroke="#f59e0b" strokeWidth="2"/>
    <text x="400" y="36" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace">📹 VIDEO SOURCE</text>
    <text x="400" y="52" textAnchor="middle" fill="#7a5a00" fontSize="8" fontFamily="monospace">2001:db8:1:20::100</text>
    {[{x:312,l:"CORE-R1 (RP)",s1:"Anycast RP Primary",s2:"2001:db8:FF:RP::1"},{x:490,l:"CORE-R2 (BSR)",s1:"BSR Priority:100",s2:"Anycast RP Backup"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={128} width={162} height={54} rx="8" fill={i===0?"#0f0500":"#0a0818"} stroke={i===0?"#ff6b35":"#a855f7"} strokeWidth="2"/>
      <text x={n.x+81} y={148} textAnchor="middle" fill={i===0?"#ff6b35":"#a855f7"} fontSize="10" fontWeight="bold" fontFamily="monospace">{n.l}</text>
      <text x={n.x+81} y={163} textAnchor="middle" fill={i===0?"#9a3a00":"#6a1aa5"} fontSize="9" fontFamily="monospace">{n.s1}</text>
      <text x={n.x+81} y={175} textAnchor="middle" fill={i===0?"#5a2000":"#3a0075"} fontSize="7" fontFamily="monospace">{n.s2}</text></g>
    ))}
    <line x1="400" y1="64" x2="393" y2="128" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2"/>
    <line x1="474" y1="155" x2="490" y2="155" stroke="#a855f7" strokeWidth="1.5"/>
    {[{x:95,l:"DIST-SW1"},{x:420,l:"DIST-SW2"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={258} width={130} height={40} rx="6" fill="#040e0a" stroke="#10b981" strokeWidth="1.5"/>
      <text x={n.x+65} y={276} textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace">{n.l}</text>
      <text x={n.x+65} y={290} textAnchor="middle" fill="#1a5a2a" fontSize="7" fontFamily="monospace">PIM-SM · MLDv2</text></g>
    ))}
    <line x1="370" y1="182" x2="215" y2="258" stroke="#ff6b35" strokeWidth="1.5"/>
    <line x1="400" y1="182" x2="450" y2="258" stroke="#ff6b35" strokeWidth="1.5"/>
    {[{x:32,l:"VLAN10",s:"MLDv2 Join",c:"#00d4ff"},{x:148,l:"VLAN20",s:"MLDv2 Join",c:"#00d4ff"},{x:396,l:"VoIP/MoH",s:"239.0.0.1",c:"#a855f7"},{x:516,l:"VLAN20",s:"MLDv2 Join",c:"#00d4ff"}].map((n,i)=>(
      <g key={i}><rect x={n.x} y={362} width={108} height={54} rx="5" fill="#030808" stroke={n.c} strokeWidth="1"/>
      <text x={n.x+54} y={381} textAnchor="middle" fill={n.c} fontSize="9" fontFamily="monospace">{n.l}</text>
      <text x={n.x+54} y={395} textAnchor="middle" fill={n.c} fontSize="7" fontFamily="monospace">{n.s}</text>
      <text x={n.x+54} y={408} textAnchor="middle" fill={n.c} fontSize="7" fontFamily="monospace">FF1E::STREAM</text></g>
    ))}
    <line x1="148" y1="298" x2="108" y2="362" stroke="#00d4ff" strokeWidth="1"/>
    <line x1="178" y1="298" x2="202" y2="362" stroke="#00d4ff" strokeWidth="1"/>
    <line x1="456" y1="298" x2="438" y2="362" stroke="#00d4ff" strokeWidth="1"/>
    <line x1="478" y1="298" x2="542" y2="362" stroke="#a855f7" strokeWidth="1"/>
    <rect x="626" y={258} width={154} height={100} rx="6" fill="#040a04" stroke="#10b981" strokeWidth="1" strokeDasharray="3,2"/>
    <text x="703" y="276" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace">PIM-SM FLOW</text>
    {["1. Receiver joins (MLD)","2. PIM Join → RP","3. Source register RP","4. SPT switchover","5. Native delivery"].map((s,i)=>(
      <text key={i} x="703" y={292+i*15} textAnchor="middle" fill="#1a5a2a" fontSize="7" fontFamily="monospace">{s}</text>
    ))}
  </svg>;
}
function TopoVoIP() {
  return <svg viewBox="0 0 800 430" style={{width:"100%",height:"100%"}}>
    <rect width="800" height="430" fill="#020d18"/>
    {[...Array(17)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="430" stroke="#0a2030" strokeWidth="0.5"/>)}
    {[...Array(9)].map((_,i)=><line key={i} x1="0" y1={i*50} x2="800" y2={i*50} stroke="#0a2030" strokeWidth="0.5"/>)}
    <ellipse cx="118" cy="74" rx="94" ry="38" fill="#0f0505" stroke="#ff4444" strokeWidth="1.5"/>
    <text x="118" y="68" textAnchor="middle" fill="#ff4444" fontSize="10" fontWeight="bold" fontFamily="monospace">☎ PSTN</text>
    <text x="118" y="84" textAnchor="middle" fill="#7a2222" fontSize="8" fontFamily="monospace">FXO/T1/E1</text>
    <rect x="202" y="140" width="168" height="80" rx="9" fill="#041a08" stroke="#00d4ff" strokeWidth="2.5"/>
    <text x="286" y="160" textAnchor="middle" fill="#00d4ff" fontSize="11" fontWeight="bold" fontFamily="monospace">CME-GW</text>
    <text x="286" y="176" textAnchor="middle" fill="#1a8a9a" fontSize="9" fontFamily="monospace">Cisco ISR 2911</text>
    <text x="286" y="192" textAnchor="middle" fill="#0a5a6a" fontSize="8" fontFamily="monospace">telephony-service</text>
    <text x="286" y="206" textAnchor="middle" fill="#063a4a" fontSize="7" fontFamily="monospace">2001:db8:5:1::1/64</text>
    <text x="286" y="216" textAnchor="middle" fill="#042a3a" fontSize="7" fontFamily="monospace">SCCP/SIP · CME 15.x</text>
    <rect x="430" y="140" width="168" height="80" rx="9" fill="#0a0418" stroke="#a855f7" strokeWidth="2.5"/>
    <text x="514" y="160" textAnchor="middle" fill="#a855f7" fontSize="11" fontWeight="bold" fontFamily="monospace">FreePBX</text>
    <text x="514" y="176" textAnchor="middle" fill="#7a35c7" fontSize="9" fontFamily="monospace">Asterisk 21</text>
    <text x="514" y="192" textAnchor="middle" fill="#5a15a7" fontSize="8" fontFamily="monospace">Ubuntu 22.04 LTS</text>
    <text x="514" y="206" textAnchor="middle" fill="#3a0087" fontSize="7" fontFamily="monospace">2001:db8:5:2::2/64</text>
    <text x="514" y="216" textAnchor="middle" fill="#280067" fontSize="7" fontFamily="monospace">PJSIP · IVR · CDR</text>
    <line x1="370" y1="180" x2="430" y2="180" stroke="#10b981" strokeWidth="2.5"/>
    <text x="400" y="174" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace">SIP Trunk</text>
    <line x1="186" y1="93" x2="240" y2="140" stroke="#ff4444" strokeWidth="1.5"/>
    <text x="204" y="119" fill="#ff4444" fontSize="8" fontFamily="monospace">FXO</text>
    {[1001,1002,1003,1004].map((ext,i)=>(
      <g key={ext}>
        <rect x={72+i*92} y={302} width={82} height={54} rx="5" fill="#040810" stroke="#00d4ff" strokeWidth="1"/>
        <text x={72+i*92+41} y={322} textAnchor="middle" fill="#00d4ff" fontSize="12" fontFamily="monospace">📱</text>
        <text x={72+i*92+41} y={339} textAnchor="middle" fill="#1a6a8e" fontSize="8" fontFamily="monospace">Ext: {ext}</text>
        <text x={72+i*92+41} y={350} textAnchor="middle" fill="#0a3a5e" fontSize="7" fontFamily="monospace">Cisco 7962</text>
        <line x1={72+i*92+41} y1={302} x2={286} y2={220} stroke="#00d4ff" strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5"/>
      </g>
    ))}
    {[2001,2002,2003].map((ext,i)=>(
      <g key={ext}>
        <rect x={440+i*108} y={302} width={94} height={54} rx="5" fill="#06040e" stroke="#a855f7" strokeWidth="1"/>
        <text x={440+i*108+47} y={322} textAnchor="middle" fill="#a855f7" fontSize="12" fontFamily="monospace">💻</text>
        <text x={440+i*108+47} y={339} textAnchor="middle" fill="#6a2ab5" fontSize="8" fontFamily="monospace">Ext: {ext}</text>
        <text x={440+i*108+47} y={350} textAnchor="middle" fill="#3a007e" fontSize="7" fontFamily="monospace">Softphone</text>
        <line x1={440+i*108+47} y1={302} x2={514} y2={220} stroke="#a855f7" strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5"/>
      </g>
    ))}
    <rect x="176" y="374" width="448" height="48" rx="6" fill="#040a04" stroke="#10b981" strokeWidth="1.5"/>
    <text x="400" y="392" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace">DIAL PLAN</text>
    <text x="280" y="410" textAnchor="middle" fill="#00d4ff" fontSize="8" fontFamily="monospace">1XXX→CME | 0.→PSTN | 6000→Conf</text>
    <text x="520" y="410" textAnchor="middle" fill="#a855f7" fontSize="8" fontFamily="monospace">2XXX→FreePBX | 9000→IVR | 5000→VM</text>
  </svg>;
}
const TMAP = {full:TopoFull,ospf:TopoOSPF,bgp:TopoBGP,mcast:TopoMcast,voip:TopoVoIP};

export default function App() {
  const [view,setView] = useState("modules");
  const [topo,setTopo] = useState("full");
  const [expMod,setExpMod] = useState(null);
  const [expLab,setExpLab] = useState(null);
  const [labTab,setLabTab] = useState("deploy");
  const [expThesis,setExpThesis] = useState(null);
  const [thesisTab,setThesisTab] = useState("overview");
  const [filter,setFilter] = useState("all");
  const TopoComp = TMAP[topo];
  const filtered = filter==="all"?THESIS:THESIS.filter(t=>t.level===filter);

  const s = {
    root:{background:"#020d18",minHeight:"100vh",fontFamily:"'Share Tech Mono','Courier New',monospace",color:"#c0d8f0",width:"100%",overflowX:"hidden"},
    hdr:{background:"linear-gradient(180deg,#091e30 0%,#020d18 100%)",borderBottom:"1px solid #00d4ff1a",padding:"12px 20px",display:"flex",alignItems:"center",gap:12,width:"100%",boxSizing:"border-box"},
    bar:{background:"#040f1c",borderBottom:"1px solid #0a2a40",padding:"6px 20px",display:"flex",gap:10,alignItems:"center",fontSize:15,flexWrap:"wrap"},
    nav:{display:"flex",borderBottom:"1px solid #0a2a40",background:"#030e1a",flexWrap:"wrap"},
    cnt:{padding:"16px 20px",width:"100%",boxSizing:"border-box"},
    card:{background:"#040f18",borderRadius:8,padding:"13px 16px",cursor:"pointer",transition:"all 0.18s"},
    pre:{background:"#010810",borderRadius:7,padding:"12px 14px",fontSize:15,color:"#00e5aa",lineHeight:1.8,overflowX:"auto",fontFamily:"Share Tech Mono,monospace"},
    tpre:{background:"#010810",borderRadius:7,padding:"12px 14px",fontSize:15,color:"#00d4ff",lineHeight:1.9,overflowX:"auto",fontFamily:"Share Tech Mono,monospace"},
  };

  return (
    <div style={s.root}>
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
        .hov:hover{opacity:.85;transform:translateY(-1px)}
        .hov{transition:all .18s}
        .row:hover{background:#061018!important}
        .row{transition:background .15s;cursor:pointer}
        pre{white-space:pre-wrap;word-break:break-all}
      `}</style>

      {/* HEADER */}
      <div style={s.hdr}>
        <div style={{width:40,height:40,borderRadius:7,background:"#00d4ff12",border:"1.5px solid #00d4ff33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🌐</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:17,color:"#00d4ff",letterSpacing:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>NGN / IPv6 LAB TOPOLOGY VIEWER</div>
          <div style={{fontSize:17,color:"#1a5a7a",marginTop:1}}>EVE-NG • OSPFv3 • BGP • Multicast • QoS • Cisco CME • FreePBX</div>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end"}}>
          {[["🟢","IPv6","#10b981"],["🔵","OSPFv3","#00d4ff"],["🟠","BGP","#ff6b35"],["🟣","VoIP","#a855f7"]].map(([e,l,c])=>(
            <div key={l} style={{background:"#0a1e2a",border:`1px solid ${c}33`,borderRadius:12,padding:"2px 9px",fontSize:17,color:c,display:"flex",gap:3,alignItems:"center"}}>
              <span className="pulse">{e}</span><span>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* INSTRUCTOR */}
      <div style={s.bar}>
        <span style={{color:"#3a6a8a"}}>👨‍🏫</span>
        <span style={{color:"#00d4ff",fontWeight:"bold"}}>Trần Vĩnh Phúc</span>
        <span style={{color:"#1a3a5a"}}>|</span>
        <a href="mailto:phuctv@dlu.edu.vn" style={{color:"#10b981",textDecoration:"none"}}>phuctv@dlu.edu.vn</a>
        <span style={{color:"#1a3a5a"}}>|</span>
        <span style={{color:"#3a6a8a"}}>Đại học Đà Lạt — Mạng Thế Hệ Mới</span>
        <div style={{marginLeft:"auto",background:"#0a1e2a",border:"1px solid #00d4ff1a",borderRadius:10,padding:"2px 10px",fontSize:17,color:"#4a8a9a"}}>6 Modules · 25 Labs · 10 Đề Tài</div>
      </div>

      {/* NAV */}
      <div style={s.nav}>
        {[["topology","🗺 Topology"],["modules","📚 Modules & Labs"],["thesis","🎓 Đề Tài"],["guide","📖 Hướng Dẫn"]].map(([k,l])=>(
          <button key={k} onClick={()=>setView(k)} style={{background:view===k?"#041a2a":"transparent",border:"none",borderBottom:view===k?"2px solid #00d4ff":"2px solid transparent",color:view===k?"#00d4ff":"#3a6a8a",padding:"10px 18px",cursor:"pointer",fontSize:17,fontFamily:"inherit",transition:"all 0.2s",flexShrink:0}}>{l}</button>
        ))}
      </div>

      <div style={s.cnt}>

        {/* TOPOLOGY */}
        {view==="topology" && (
          <div className="fade">
            <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:17,color:"#3a6a8a",letterSpacing:3,marginBottom:10}}>▸ SƠ ĐỒ TOPOLOGY MẠNG</div>
            <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
              {TOPOS.map(t=>(
                <button key={t.id} onClick={()=>setTopo(t.id)} style={{background:topo===t.id?"#0a2a3a":"#050f18",border:`1px solid ${topo===t.id?"#00d4ff":"#1a3a5a"}`,color:topo===t.id?"#00d4ff":"#3a6a8a",padding:"6px 14px",borderRadius:5,cursor:"pointer",fontSize:15,fontFamily:"inherit",transition:"all 0.2s",whiteSpace:"nowrap"}}>{t.label}</button>
              ))}
            </div>
            <div style={{background:"#020d18",border:"1px solid #0a2a40",borderRadius:9,overflow:"hidden"}}>
              <div style={{background:"#030f1a",borderBottom:"1px solid #0a2a40",padding:"7px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"#00d4ff",fontSize:17,fontFamily:"Rajdhani,sans-serif",fontWeight:700}}>{TOPOS.find(t=>t.id===topo)?.label}</span>
                <span style={{color:"#1a4a6a",fontSize:17}}>EVE-NG Lab</span>
              </div>
              <div style={{height:480,width:"100%"}}><TopoComp/></div>
            </div>
          </div>
        )}

        {/* MODULES */}
        {view==="modules" && (
          <div className="fade">
            <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:17,color:"#3a6a8a",letterSpacing:3,marginBottom:12}}>▸ 6 MODULES · 25 LABS CHI TIẾT</div>
            {MODULES.map(mod=>(
              <div key={mod.id} style={{marginBottom:8}}>
                <div className="hov" onClick={()=>{setExpMod(expMod===mod.id?null:mod.id);setExpLab(null);}}
                  style={{...s.card,border:`1px solid ${expMod===mod.id?mod.color:"#0a2030"}`,borderLeft:`4px solid ${mod.color}`,borderRadius:expMod===mod.id?"8px 8px 0 0":8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{fontSize:20,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",background:`${mod.color}12`,border:`1px solid ${mod.color}30`,borderRadius:6,flexShrink:0}}>{mod.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{color:mod.color,fontWeight:700,fontSize:17,letterSpacing:2}}>MODULE {mod.id}</span>
                        <span style={{color:"#1a4a6a",fontSize:17}}>|</span>
                        <span style={{color:"#3a6a8a",fontSize:17}}>{mod.labs}</span>
                      </div>
                      <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:14,color:"#d0e8ff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{mod.title}</div>
                      <div style={{fontSize:17,color:"#3a6a8a",marginTop:2}}>{mod.desc}</div>
                    </div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",maxWidth:220,justifyContent:"flex-end",flexShrink:0}}>
                      {mod.tags.map(t=><span key={t} style={{background:"#020d18",border:`1px solid ${mod.color}40`,borderRadius:3,padding:"1px 6px",fontSize:15,color:mod.color}}>{t}</span>)}
                    </div>
                    <span style={{color:mod.color,fontSize:15,marginLeft:6,flexShrink:0}}>{expMod===mod.id?"▲":"▼"}</span>
                  </div>
                </div>
                {expMod===mod.id && (
                  <div className="fade" style={{background:"#030b16",border:`1px solid ${mod.color}1a`,borderTop:"none",borderRadius:"0 0 8px 8px"}}>
                    {mod.labList.map(lab=>{
                      const k=`${mod.id}-${lab.num}`;
                      const open=expLab===k;
                      return (
                        <div key={lab.num}>
                          <div className="row" onClick={()=>{setExpLab(open?null:k);setLabTab("deploy");}}
                            style={{padding:"10px 16px",borderBottom:`1px solid #0a1828`,display:"flex",alignItems:"center",gap:9}}>
                            <div style={{width:30,height:30,borderRadius:5,background:`${mod.color}15`,border:`1px solid ${mod.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:mod.color,flexShrink:0,fontWeight:700}}>{lab.num}</div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:15,color:"#b0cce0",fontFamily:"Rajdhani,sans-serif",fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{lab.name}</div>
                              <div style={{display:"flex",gap:9,marginTop:2}}>
                                <span style={{fontSize:15,color:"#3a5a7a"}}>⏱ {lab.dur}</span>
                                <span style={{fontSize:15,color:"#3a5a7a"}}>{"★".repeat(lab.diff)}{"☆".repeat(4-lab.diff)}</span>
                              </div>
                            </div>
                            <span style={{color:"#1a3a5a",fontSize:15,flexShrink:0}}>{open?"▲":"▼"}</span>
                          </div>
                          {open && (
                            <div className="fade" style={{padding:"12px 16px",background:"#020910",borderBottom:`1px solid #0a1828`}}>
                              <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
                                {[["deploy","🔧 Deploy"],["cmds","💻 Lệnh"],["topo","📐 Topo"],["result","✅ Kết Quả"],["hints","💡 Gợi Ý"]].map(([k2,l])=>(
                                  <button key={k2} onClick={e=>{e.stopPropagation();setLabTab(k2);}} style={{background:labTab===k2?`${mod.color}1a`:"#030c18",border:`1px solid ${labTab===k2?mod.color:"#0a1828"}`,color:labTab===k2?mod.color:"#3a6a8a",padding:"4px 11px",borderRadius:4,cursor:"pointer",fontSize:17,fontFamily:"inherit",whiteSpace:"nowrap"}}>{l}</button>
                                ))}
                              </div>
                              {labTab==="deploy" && (
                                <div>
                                  <div style={{fontSize:17,color:mod.color,fontWeight:700,letterSpacing:1,marginBottom:7}}>HƯỚNG DẪN TRIỂN KHAI</div>
                                  {lab.deploy.map((st,i)=>(
                                    <div key={i} style={{display:"flex",gap:7,marginBottom:6,alignItems:"flex-start"}}>
                                      <div style={{width:19,height:19,borderRadius:"50%",background:`${mod.color}15`,border:`1px solid ${mod.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,color:mod.color,flexShrink:0,fontWeight:700}}>{i+1}</div>
                                      <span style={{fontSize:15,color:"#7a9aba",lineHeight:1.6}}>{st}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {labTab==="cmds" && (
                                <div>
                                  <div style={{fontSize:17,color:mod.color,fontWeight:700,letterSpacing:1,marginBottom:7}}>LỆNH CẤU HÌNH & VERIFY</div>
                                  <pre style={{...s.pre,borderLeft:`3px solid ${mod.color}`}}>{lab.cmds}</pre>
                                </div>
                              )}
                              {labTab==="topo" && (
                                <div>
                                  <div style={{fontSize:17,color:mod.color,fontWeight:700,letterSpacing:1,marginBottom:7}}>TOPOLOGY LAB</div>
                                  <pre style={{...s.tpre,borderLeft:`3px solid ${mod.color}`}}>{lab.topo}</pre>
                                </div>
                              )}
                              {labTab==="result" && (
                                <div>
                                  <div style={{fontSize:17,color:mod.color,fontWeight:700,letterSpacing:1,marginBottom:7}}>KẾT QUẢ DỰ KIẾN</div>
                                  {lab.result.map((r,i)=>(
                                    <div key={i} style={{display:"flex",gap:7,marginBottom:5,background:"#031208",border:"1px solid #0a2018",borderRadius:4,padding:"6px 9px"}}>
                                      <span style={{color:"#10b981",fontSize:17,flexShrink:0}}>✓</span>
                                      <span style={{fontSize:15,color:"#6ab09a"}}>{r}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {labTab==="hints" && (
                                <div>
                                  <div style={{fontSize:17,color:"#f59e0b",fontWeight:700,letterSpacing:1,marginBottom:7}}>💡 GỢI Ý & TROUBLESHOOTING</div>
                                  {lab.hints.map((h,i)=>(
                                    <div key={i} style={{display:"flex",gap:7,marginBottom:5,background:"#0f0d02",border:"1px solid #2a1a00",borderRadius:4,padding:"6px 9px"}}>
                                      <span style={{color:"#f59e0b",fontSize:17,flexShrink:0}}>→</span>
                                      <span style={{fontSize:15,color:"#b09a4a"}}>{h}</span>
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
        {view==="thesis" && (
          <div className="fade">
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,flexWrap:"wrap"}}>
              <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:17,color:"#3a6a8a",letterSpacing:3}}>▸ {filtered.length} ĐỀ TÀI ĐỒ ÁN</div>
              <div style={{display:"flex",gap:5,marginLeft:"auto",flexWrap:"wrap"}}>
                {[["all","Tất Cả","#00d4ff"],["medium","⭐⭐⭐ Trung Bình","#f59e0b"],["hard","⭐⭐⭐⭐⭐ NCKH","#ff6b35"]].map(([k,l,c])=>(
                  <button key={k} onClick={()=>setFilter(k)} style={{background:filter===k?`${c}18`:"#050f18",border:`1px solid ${filter===k?c:"#1a3050"}`,color:filter===k?c:"#3a6a8a",padding:"4px 11px",borderRadius:4,cursor:"pointer",fontSize:17,fontFamily:"inherit",whiteSpace:"nowrap"}}>{l}</button>
                ))}
              </div>
            </div>
            {filtered.map(t=>(
              <div key={t.id} style={{marginBottom:8}}>
                <div className="hov" onClick={()=>{setExpThesis(expThesis===t.id?null:t.id);setThesisTab("overview");}}
                  style={{...s.card,border:`1px solid ${expThesis===t.id?t.color:"#0a2030"}`,borderLeft:`4px solid ${t.color}`,borderRadius:expThesis===t.id?"8px 8px 0 0":8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{fontSize:22,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",background:`${t.color}12`,border:`1px solid ${t.color}30`,borderRadius:7,flexShrink:0}}>{t.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{color:t.color,fontWeight:700,fontSize:17,letterSpacing:2}}>ĐỀ TÀI {t.id}</span>
                        <span style={{background:`${t.color}15`,border:`1px solid ${t.color}40`,borderRadius:3,padding:"1px 7px",fontSize:15,color:t.color}}>{t.level==="medium"?"⭐⭐⭐ Trung Bình":"⭐⭐⭐⭐⭐ NCKH/Luận Văn"}</span>
                      </div>
                      <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"#d0e8ff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.title}</div>
                      <div style={{display:"flex",gap:10,marginTop:3,flexWrap:"wrap"}}>
                        <span style={{fontSize:15,color:"#3a6a8a"}}>⏱ {t.dur}</span>
                        <span style={{fontSize:15,color:"#3a6a8a"}}>👥 {t.team}</span>
                        <span style={{fontSize:15,color:"#3a6a8a",fontStyle:"italic"}}>{t.sub}</span>
                      </div>
                    </div>
                    <span style={{color:t.color,fontSize:15,flexShrink:0}}>{expThesis===t.id?"▲":"▼"}</span>
                  </div>
                </div>
                {expThesis===t.id && (
                  <div className="fade" style={{background:"#030b16",border:`1px solid ${t.color}1a`,borderTop:"none",borderRadius:"0 0 8px 8px",padding:"14px 16px"}}>
                    <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
                      {[["overview","📋 Tổng Quan"],["topo","📐 Topology"],["deploy","🔧 Kế Hoạch"],["result","✅ Kết Quả"]].map(([k,l])=>(
                        <button key={k} onClick={e=>{e.stopPropagation();setThesisTab(k);}} style={{background:thesisTab===k?`${t.color}1a`:"#030c18",border:`1px solid ${thesisTab===k?t.color:"#0a1828"}`,color:thesisTab===k?t.color:"#3a6a8a",padding:"4px 11px",borderRadius:4,cursor:"pointer",fontSize:17,fontFamily:"inherit",whiteSpace:"nowrap"}}>{l}</button>
                      ))}
                    </div>
                    {thesisTab==="overview" && (
                      <div>
                        <div style={{background:`${t.color}08`,border:`1px solid ${t.color}1a`,borderRadius:6,padding:"10px 12px",marginBottom:10}}>
                          <div style={{fontSize:17,color:t.color,fontWeight:700,marginBottom:4,letterSpacing:1}}>TỔNG QUAN</div>
                          <div style={{fontSize:17,color:"#7a9aba",lineHeight:1.7}}>{t.overview}</div>
                        </div>
                        <div style={{fontSize:17,color:t.color,fontWeight:700,marginBottom:7,letterSpacing:1}}>PHẠM VI</div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:5}}>
                          {t.scope.map((sc,i)=>(
                            <div key={i} style={{display:"flex",gap:6,background:"#030c18",border:`1px solid ${t.color}1a`,borderRadius:4,padding:"6px 9px"}}>
                              <span style={{color:t.color,fontSize:17,flexShrink:0}}>▸</span>
                              <span style={{fontSize:17,color:"#7a9aba",lineHeight:1.5}}>{sc}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{marginTop:10,display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                          <span style={{fontSize:17,color:"#3a6a8a"}}>🛠</span>
                          {t.tech.map(tc=><span key={tc} style={{background:"#020d18",border:`1px solid ${t.color}40`,borderRadius:3,padding:"2px 7px",fontSize:15,color:t.color}}>{tc}</span>)}
                        </div>
                      </div>
                    )}
                    {thesisTab==="topo" && <pre style={{...s.tpre,borderLeft:`3px solid ${t.color}`}}>{t.topo}</pre>}
                    {thesisTab==="deploy" && (
                      <div>
                        {t.deploy.map((d,i)=>(
                          <div key={i} style={{display:"flex",gap:7,marginBottom:6,alignItems:"flex-start"}}>
                            <div style={{width:20,height:20,borderRadius:4,background:`${t.color}15`,border:`1px solid ${t.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,color:t.color,flexShrink:0,fontWeight:700}}>{i+1}</div>
                            <span style={{fontSize:15,color:"#7a9aba",lineHeight:1.6}}>{d}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {thesisTab==="result" && (
                      <div>
                        {t.result.map((r,i)=>(
                          <div key={i} style={{display:"flex",gap:7,marginBottom:5,background:"#031208",border:"1px solid #0a2018",borderRadius:4,padding:"7px 10px"}}>
                            <span style={{color:"#10b981",fontSize:17,flexShrink:0}}>✓</span>
                            <span style={{fontSize:15,color:"#6ab09a"}}>{r}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div style={{marginTop:12,padding:"10px 14px",background:"#040f18",border:"1px solid #0a2a40",borderRadius:7,fontSize:17,color:"#3a6a8a",lineHeight:1.7}}>
              💡 <span style={{color:"#00d4ff"}}>Đề tài 1-5</span>: phù hợp đồ án môn học (6-10 tuần) •
              <span style={{color:"#ff6b35"}}> Đề tài 6-10</span>: NCKH/luận văn tốt nghiệp •
              Liên hệ: <a href="mailto:phuctv@dlu.edu.vn" style={{color:"#10b981",textDecoration:"none"}}>phuctv@dlu.edu.vn</a>
            </div>
          </div>
        )}

        {/* GUIDE */}
        {view==="guide" && (
          <div className="fade">
            <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:17,color:"#3a6a8a",letterSpacing:3,marginBottom:12}}>▸ HƯỚNG DẪN NHANH & LỆNH THƯỜNG DÙNG</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:10,marginBottom:14}}>
              {[
                {t:"🚀 Khởi Động EVE-NG",c:"#00d4ff",items:["Truy cập EVE-NG Web UI: http://EVE-NG-IP","Tạo New Lab → Add Node → Cisco IOL","Kết nối nodes bằng drag-and-drop","Start all nodes, đợi boot ~30s","Click node → Console để terminal","File → Save (Ctrl+S) lưu lab"]},
                {t:"⚙️ Cấu Hình IPv6 Nhanh",c:"#10b981",items:["enable → configure terminal","ipv6 unicast-routing (bắt buộc!)","ipv6 cef (Cisco Express Forwarding)","interface Gi0/0 → ipv6 address X/prefix","ipv6 address FE80::1 link-local","no shutdown → end → wr"]},
                {t:"🔍 Debug IPv6",c:"#f59e0b",items:["show ipv6 interface brief","show ipv6 neighbors (NDP cache)","show ipv6 route (routing table)","ping ipv6 X source Y repeat 100","traceroute ipv6 X source Y","debug ipv6 icmp / debug ipv6 ospf"]},
                {t:"📡 OSPFv3 Reference",c:"#7c3aed",items:["ipv6 router ospf 1 → router-id X.X.X.X","interface Gi0/0 → ipv6 ospf 1 area 0","show ipv6 ospf neighbor (Full = OK)","show ipv6 ospf database","clear ipv6 ospf process (reset)","debug ipv6 ospf adj (adjacency)"]},
                {t:"🌍 BGP IPv6 Checklist",c:"#ff6b35",items:["router bgp 65001 + no bgp default ipv4-unicast","neighbor X remote-as Y (IPv6 addr)","address-family ipv6 → neighbor X activate","network 2001:db8::/32 (announce)","show bgp ipv6 unicast summary","clear bgp ipv6 unicast * soft"]},
                {t:"📞 VoIP Troubleshoot",c:"#a855f7",items:["show ephone registered (phones?)","show dial-peer voice summary","debug ccsip messages (SIP trace)","debug ephone detail (SCCP)","show call active voice brief","pjsip set logger on (FreePBX)"]},
                {t:"⚡ QoS Verification",c:"#f59e0b",items:["show policy-map interface Gi0/0 input","show policy-map interface Gi0/0 output","show class-map (definitions)","show queue GigabitEthernet0/0","show interface Gi0/0 | include drop","show ip sla statistics (VoIP quality)"]},
                {t:"🔒 Security Commands",c:"#10b981",items:["show ipv6 nd raguard policy","show ipv6 dhcp snooping","show ipv6 source-guard policy","show ip verify source (uRPF)","fail2ban-client status asterisk","show ip access-lists (ACL hits)"]}
              ].map((card,i)=>(
                <div key={i} style={{background:"#040f18",border:`1px solid ${card.c}22`,borderLeft:`3px solid ${card.c}`,borderRadius:7,padding:"12px"}}>
                  <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:15,color:card.c,marginBottom:8}}>{card.t}</div>
                  {card.items.map((item,j)=>(
                    <div key={j} style={{display:"flex",gap:6,marginBottom:5,alignItems:"flex-start"}}>
                      <span style={{color:card.c,fontSize:15,flexShrink:0,marginTop:2}}>▸</span>
                      <code style={{fontSize:17,color:"#6a9aba",lineHeight:1.6,fontFamily:"Share Tech Mono,monospace",wordBreak:"break-all"}}>{item}</code>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{background:"#040f18",border:"1px solid #0a2a40",borderRadius:8,overflow:"hidden"}}>
              <div style={{background:"#030e1a",padding:"8px 14px",borderBottom:"1px solid #0a2a40"}}>
                <span style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:15,color:"#00d4ff"}}>📋 BẢNG LỆNH VERIFY ĐẦY ĐỦ</span>
              </div>
              <div style={{padding:"10px 14px",overflowX:"auto"}}>
                {[
                  ["Feature","Lệnh Verify","Kết Quả Mong Đợi"],
                  ["IPv6 Interface","show ipv6 interface brief","UP/UP, global+link-local address"],
                  ["OSPFv3 Neighbor","show ipv6 ospf neighbor","State: FULL/DR or FULL/BDR"],
                  ["BGP Session","show bgp ipv6 unicast summary","State: Established"],
                  ["HSRP Status","show standby brief","Active/Standby theo priority"],
                  ["DHCPv6","show ipv6 dhcp binding","Clients với IAID + địa chỉ"],
                  ["PIM Neighbor","show ipv6 pim neighbor","Neighbors + uptime"],
                  ["Multicast Route","show ipv6 mroute","(*,G) và (S,G) entries"],
                  ["QoS Policy","show policy-map interface","Hit counters tăng"],
                  ["CME Phones","show ephone registered","MAC, IP, extension"],
                  ["SIP Trunk","show sip-ua status registrar","Registered: Yes"],
                  ["FreePBX","pjsip show endpoints (Asterisk)","Status: Online"],
                ].map((row,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"140px 260px 1fr",gap:8,padding:"5px 3px",borderBottom:"1px solid #0a1828",alignItems:"start",minWidth:520}}>
                    {row.map((cell,j)=>(
                      <span key={j} style={{fontSize:i===0?8:9,color:i===0?"#3a6a8a":j===0?"#c0d8f0":j===1?"#00e5aa":"#5a8a7a",fontWeight:i===0||j===0?"bold":"normal",fontFamily:j===1?"Share Tech Mono,monospace":"inherit"}}>{cell}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{borderTop:"1px solid #0a2a40",padding:"8px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:17,color:"#1a4a6a",flexWrap:"wrap",gap:6}}>
        <span>NGN/IPv6 Lab — Đại học Đà Lạt</span>
        <span>GV: Trần Vĩnh Phúc | <a href="mailto:phuctv@dlu.edu.vn" style={{color:"#10b981",textDecoration:"none"}}>phuctv@dlu.edu.vn</a></span>
        <span>6 Modules · 25 Labs · 10 Đề Tài</span>
      </div>
    </div>
  );
}