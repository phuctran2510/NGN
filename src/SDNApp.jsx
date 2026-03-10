import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// FULL LAB DATA
// ═══════════════════════════════════════════════════════════════════
const LABS = [
  {
    id:"L1", num:"Lab 01", color:"#38bdf8",
    title:"Cài đặt & Khám phá Mininet",
    category:"SDN Fundamentals",
    duration:"90 phút", difficulty:1, prereq:"Ubuntu 20.04+",
    objective:"Cài đặt Mininet, tạo các topology cơ bản, thao tác CLI và quan sát OpenFlow flow tables.",
    theory:`► MININET LÀ GÌ?
Mininet là nền tảng mô phỏng mạng chạy hoàn toàn trên 1 máy Linux.
Nó tạo ra hosts, switches, controllers và links ảo sử dụng:
  · Linux namespaces (cô lập tiến trình/network)
  · Open vSwitch (OVS) — phần mềm OpenFlow switch
  · veth pairs — cặp giao diện ảo nối hai namespace

KIẾN TRÚC:
  ┌─────────────────────────────────────┐
  │ Mininet Process (Python)            │
  │  ├─ Host h1 (namespace + eth0)      │
  │  ├─ Host h2 (namespace + eth0)      │
  │  └─ Switch s1 (OVS + OpenFlow)      │
  │       ├─ Port 1 ─── h1-eth0         │
  │       └─ Port 2 ─── h2-eth0         │
  └─────────────────────────────────────┘`,
    install:[
      "# Cập nhật hệ thống",
      "sudo apt-get update && sudo apt-get upgrade -y",
      "",
      "# Cài Mininet và Open vSwitch",
      "sudo apt-get install -y mininet openvswitch-switch openvswitch-testcontroller",
      "",
      "# Kiểm tra OVS",
      "sudo ovs-vsctl show",
      "",
      "# Test Mininet nhanh",
      "sudo mn --test pingall",
      "",
      "# Kết quả mong muốn:",
      "# *** All hosts can reach each other",
      "# *** Results: 0% dropped (2/2 received)",
    ],
    steps:[
      {title:"Khởi động topology đơn giản", cmd:`# Topo: 1 switch, 3 hosts, controller mặc định
sudo mn --topo single,3 --mac --arp

# --topo single,3 : 1 switch + 3 hosts
# --mac           : MAC address đơn giản (00:00:00:00:00:01)
# --arp           : pre-populate ARP tables`},
      {title:"Khám phá topology", cmd:`# Trong Mininet CLI:
mininet> nodes         # Liệt kê: h1 h2 h3 s1 c0
mininet> links         # h1-eth0:s1-eth1  h2-eth0:s1-eth2 ...
mininet> net           # Topology đầy đủ
mininet> dump          # PID và interface của từng node
mininet> h1 ifconfig   # IP của host h1: 10.0.0.1/8
mininet> h2 ifconfig   # IP của host h2: 10.0.0.2/8`},
      {title:"Test kết nối", cmd:`# Ping cơ bản
mininet> h1 ping h2 -c 3
# → PING 10.0.0.2 ... 64 bytes from 10.0.0.2: icmp_seq=1 ttl=64

# Ping toàn bộ
mininet> pingall
# → *** Results: 0% dropped (6/6 received)

# Đo bandwidth
mininet> iperf h1 h3
# → *** Results: ['17.4 Gbits/sec', '17.4 Gbits/sec']`},
      {title:"Xem và thao tác Flow Table", cmd:`# Xem flow table của switch s1
mininet> sh ovs-ofctl dump-flows s1
# → NXST_FLOW reply: (id=0): cookie=0x0, ...

# Xóa tất cả flows
mininet> sh ovs-ofctl del-flows s1

# Thêm flow thủ công: h1→h2
mininet> sh ovs-ofctl add-flow s1 "in_port=1,actions=output:2"
mininet> sh ovs-ofctl add-flow s1 "in_port=2,actions=output:1"

# Test lại sau khi thêm flow
mininet> h1 ping h2 -c 3
mininet> sh ovs-ofctl dump-flows s1`},
      {title:"Chạy commands trên host", cmd:`# Chạy lệnh Linux trực tiếp trên host
mininet> h1 ip route show
mininet> h1 netstat -rn
mininet> h2 python3 -m http.server 8080 &
mininet> h1 wget -q -O- http://10.0.0.2:8080 | head -5

# Mở terminal riêng cho từng host
mininet> xterm h1 h2     # Mở 2 terminal riêng

# Thoát
mininet> exit
sudo mn -c               # Cleanup`},
    ],
    expected:[
      "✅ Mininet khởi động, không có lỗi",
      "✅ nodes hiển thị: h1 h2 h3 s1 c0",
      "✅ pingall: 0% dropped (6/6 received)",
      "✅ iperf: >1 Gbps throughput",
      "✅ dump-flows: hiển thị entries sau khi add",
      "✅ wget http server: kết nối thành công",
    ],
    advanced:`# NÂNG CAO: Custom topology bằng Python
from mininet.net import Mininet
from mininet.topo import Topo
from mininet.node import OVSSwitch, Controller
from mininet.log import setLogLevel, info
from mininet.link import TCLink

class RingTopo(Topo):
    """Ring topology: s1─s2─s3─s1 với 6 hosts"""
    def build(self, n=3):
        switches = [self.addSwitch(f's{i}') for i in range(1,n+1)]
        for i in range(n):
            h = self.addHost(f'h{i+1}',
                ip=f'10.0.{i}.1/24')
            self.addLink(switches[i], h,
                bw=100, delay='5ms', loss=0)
        # Tạo ring
        for i in range(n):
            self.addLink(switches[i], switches[(i+1)%n],
                bw=1000, delay='1ms')

setLogLevel('info')
net = Mininet(topo=RingTopo(), switch=OVSSwitch,
              link=TCLink, autoSetMacs=True)
net.start()
info("*** Testing ring topology\\n")
net.pingAll()
net.stop()`,
    troubleshoot:[
      "Lỗi 'OVS not running': sudo service openvswitch-switch start",
      "Lỗi 'Address already in use': sudo mn -c && sudo fuser -k 6633/tcp",
      "Ping thất bại: kiểm tra controller đang chạy (c0)",
      "Permission denied: thêm sudo trước lệnh mn",
    ]
  },
  {
    id:"L2", num:"Lab 02", color:"#4ade80",
    title:"Ryu Controller — L2 Switch & L3 Router",
    category:"SDN Controller",
    duration:"150 phút", difficulty:2, prereq:"Lab 01 hoàn thành, Python 3.8+",
    objective:"Viết Ryu application thực hiện L2 MAC learning switch và L3 routing cơ bản. Quan sát Packet-In/Flow-Mod messages.",
    theory:`► RYU CONTROLLER
Ryu là SDN controller viết bằng Python, hỗ trợ OpenFlow 1.0–1.5.
Architecture: Event-driven — mỗi OpenFlow message là 1 event.

FLOW:
  Packet đến switch (s1)
    → Không match flow table (table-miss)
    → Packet-In message → Ryu controller
    → Ryu quyết định: forward/flood/drop
    → Flow-Mod: cài rule vào switch
    → Packet-Out: forward packet hiện tại

MAC LEARNING:
  mac_to_port = {dpid: {mac: port}}
  Ví dụ: {1: {"00:00:00:00:00:01": 1,
               "00:00:00:00:00:02": 2}}`,
    install:[
      "# Cài Ryu",
      "pip install ryu",
      "",
      "# Kiểm tra cài đặt",
      "ryu-manager --version",
      "",
      "# Cài thêm thư viện cần thiết",
      "pip install eventlet oslo.config",
      "",
      "# Verify",
      "python3 -c 'from ryu.base import app_manager; print(\"OK\")'",
    ],
    steps:[
      {title:"Viết L2 Learning Switch", cmd:`# Tạo file: simple_switch_13.py
cat > simple_switch_13.py << 'EOF'
from ryu.base import app_manager
from ryu.controller import ofp_event
from ryu.controller.handler import (CONFIG_DISPATCHER,
    MAIN_DISPATCHER, set_ev_cls)
from ryu.ofproto import ofproto_v1_3
from ryu.lib.packet import packet, ethernet, ether_types
import logging

LOG = logging.getLogger('SimpleSwitch')

class SimpleSwitch13(app_manager.RyuApp):
    OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.mac_to_port = {}   # {dpid: {mac: port}}

    @set_ev_cls(ofp_event.EventOFPSwitchFeatures,
                CONFIG_DISPATCHER)
    def features_handler(self, ev):
        """Cài table-miss rule: gửi lên controller"""
        dp     = ev.msg.datapath
        ofp    = dp.ofproto
        parser = dp.ofproto_parser
        match   = parser.OFPMatch()
        actions = [parser.OFPActionOutput(
            ofp.OFPP_CONTROLLER, ofp.OFPCML_NO_BUFFER)]
        inst = [parser.OFPInstructionActions(
            ofp.OFPIT_APPLY_ACTIONS, actions)]
        mod = parser.OFPFlowMod(
            datapath=dp, priority=0,
            match=match, instructions=inst)
        dp.send_msg(mod)
        LOG.info(f"Switch {dp.id} connected — table-miss installed")

    def add_flow(self, dp, priority, match, actions, idle=0):
        ofp    = dp.ofproto
        parser = dp.ofproto_parser
        inst   = [parser.OFPInstructionActions(
            ofp.OFPIT_APPLY_ACTIONS, actions)]
        mod = parser.OFPFlowMod(
            datapath=dp, priority=priority,
            idle_timeout=idle,
            match=match, instructions=inst)
        dp.send_msg(mod)

    @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
    def packet_in_handler(self, ev):
        msg     = ev.msg
        dp      = msg.datapath
        ofp     = dp.ofproto
        parser  = dp.ofproto_parser
        in_port = msg.match['in_port']

        pkt = packet.Packet(msg.data)
        eth = pkt.get_protocols(ethernet.ethernet)[0]

        # Bỏ qua LLDP
        if eth.ethertype == ether_types.ETH_TYPE_LLDP:
            return

        dst, src, dpid = eth.dst, eth.src, dp.id
        self.mac_to_port.setdefault(dpid, {})
        self.mac_to_port[dpid][src] = in_port
        LOG.info(f"Learn: DPID={dpid} {src} → port{in_port}")

        if dst in self.mac_to_port[dpid]:
            out_port = self.mac_to_port[dpid][dst]
            # Cài flow rule
            match   = parser.OFPMatch(
                in_port=in_port, eth_dst=dst, eth_src=src)
            actions = [parser.OFPActionOutput(out_port)]
            self.add_flow(dp, 1, match, actions, idle=30)
            LOG.info(f"Flow installed: port{in_port}→port{out_port}")
        else:
            out_port = ofp.OFPP_FLOOD

        actions = [parser.OFPActionOutput(out_port)]
        data    = msg.data if msg.buffer_id == ofp.OFP_NO_BUFFER \
                  else None
        out = parser.OFPPacketOut(
            datapath=dp, buffer_id=msg.buffer_id,
            in_port=in_port, actions=actions, data=data)
        dp.send_msg(out)

EOF
echo "File created OK"`},
      {title:"Chạy Ryu Controller", cmd:`# Terminal 1: Chạy Ryu
ryu-manager simple_switch_13.py --verbose

# Output mong muốn:
# loading app simple_switch_13.py
# loading app ryu.controller.ofp_handler
# BRICK SimpleSwitch13 instantiated
# connected to OFX switch ...`},
      {title:"Kết nối Mininet", cmd:`# Terminal 2: Khởi động Mininet
sudo mn --controller=remote,ip=127.0.0.1,port=6633 \\
        --topo tree,2 --mac --switch ovsk,protocols=OpenFlow13

# Trong Mininet CLI:
mininet> pingall
# → *** Results: 0% dropped (12/12 received)

mininet> sh ovs-ofctl -O OpenFlow13 dump-flows s1
# → Thấy các flow entries học được

mininet> h1 ping h4 -c 5`},
      {title:"L3 Router Ryu (nâng cao)", cmd:`# Tạo file: simple_router.py
cat > simple_router.py << 'EOF'
from ryu.base import app_manager
from ryu.controller import ofp_event
from ryu.controller.handler import (CONFIG_DISPATCHER,
    MAIN_DISPATCHER, set_ev_cls)
from ryu.ofproto import ofproto_v1_3
from ryu.lib.packet import (packet, ethernet, ether_types,
    ipv4, arp, icmp)

class SimpleRouter(app_manager.RyuApp):
    OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]

    # Cấu hình router interfaces
    INTERFACES = {
        1: {"ip":"10.0.1.1","mac":"00:00:00:01:00:01","net":"10.0.1.0/24"},
        2: {"ip":"10.0.2.1","mac":"00:00:00:01:00:02","net":"10.0.2.0/24"},
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.arp_table  = {}  # ip → mac
        self.port_table = {}  # ip → port

    def _build_arp_reply(self, pkt_eth, pkt_arp, port_info):
        """Tạo ARP reply từ router"""
        pkt = packet.Packet()
        pkt.add_protocol(ethernet.ethernet(
            ethertype=ether_types.ETH_TYPE_ARP,
            dst=pkt_eth.src, src=port_info["mac"]))
        pkt.add_protocol(arp.arp(
            opcode=arp.ARP_REPLY,
            src_mac=port_info["mac"],
            src_ip=pkt_arp.dst_ip,
            dst_mac=pkt_arp.src_mac,
            dst_ip=pkt_arp.src_ip))
        pkt.serialize()
        return pkt

    @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
    def packet_in_handler(self, ev):
        msg     = ev.msg
        dp      = msg.datapath
        in_port = msg.match['in_port']
        pkt     = packet.Packet(msg.data)
        eth     = pkt.get_protocols(ethernet.ethernet)[0]

        if eth.ethertype == ether_types.ETH_TYPE_ARP:
            self._handle_arp(dp, in_port, pkt, eth)
        elif eth.ethertype == ether_types.ETH_TYPE_IP:
            self._handle_ip(dp, in_port, pkt, eth)

    def _handle_arp(self, dp, in_port, pkt, eth):
        pkt_arp = pkt.get_protocols(arp.arp)[0]
        if pkt_arp.opcode == arp.ARP_REQUEST:
            if in_port in self.INTERFACES:
                port_info = self.INTERFACES[in_port]
                if pkt_arp.dst_ip == port_info["ip"]:
                    reply = self._build_arp_reply(
                        eth, pkt_arp, port_info)
                    self._send_packet(dp, in_port, reply)

    def _handle_ip(self, dp, in_port, pkt, eth):
        pkt_ipv4 = pkt.get_protocols(ipv4.ipv4)[0]
        dst_ip   = pkt_ipv4.dst
        # Routing đơn giản: tìm port đích
        for port_no, iface in self.INTERFACES.items():
            if self._same_subnet(dst_ip, iface["net"]):
                if dst_ip in self.arp_table:
                    self._install_route(dp, dst_ip,
                        self.arp_table[dst_ip], port_no)

    def _same_subnet(self, ip, cidr):
        import ipaddress
        try:
            return (ipaddress.ip_address(ip) in
                    ipaddress.ip_network(cidr, strict=False))
        except: return False

    def _install_route(self, dp, dst_ip, dst_mac, out_port):
        parser = dp.ofproto_parser
        match  = parser.OFPMatch(eth_type=0x0800,
                                  ipv4_dst=dst_ip)
        actions = [parser.OFPActionSetField(eth_dst=dst_mac),
                   parser.OFPActionOutput(out_port)]
        inst = [parser.OFPInstructionActions(
            dp.ofproto.OFPIT_APPLY_ACTIONS, actions)]
        mod = parser.OFPFlowMod(datapath=dp, priority=10,
            match=match, instructions=inst)
        dp.send_msg(mod)

    def _send_packet(self, dp, port, pkt):
        ofp    = dp.ofproto
        parser = dp.ofproto_parser
        actions = [parser.OFPActionOutput(port)]
        out = parser.OFPPacketOut(
            datapath=dp, buffer_id=ofp.OFP_NO_BUFFER,
            in_port=ofp.OFPP_CONTROLLER,
            actions=actions, data=pkt.data)
        dp.send_msg(out)

EOF`},
      {title:"Test L3 Router", cmd:`# Terminal 1: Chạy L3 router
ryu-manager simple_router.py --verbose

# Terminal 2: Mininet với 2 subnets
sudo mn --controller=remote,ip=127.0.0.1,port=6633 \\
    --switch ovsk,protocols=OpenFlow13 \\
    --custom router_topo.py --topo routertopo

# Hoặc đơn giản:
sudo mn --controller=remote \\
    --topo single,4 --switch ovsk,protocols=OpenFlow13

mininet> pingall
mininet> h1 traceroute h4`},
    ],
    expected:[
      "✅ Ryu khởi động, kết nối với switches",
      "✅ pingall 100% qua L2 switch",
      "✅ Logs MAC learning đúng (src→port)",
      "✅ Flow entries được cài sau ping",
      "✅ Flow timeout 30s hoạt động",
      "✅ L3 router: ping cross-subnet thành công",
    ],
    advanced:`# NÂNG CAO: Firewall App với Ryu
# File: ryu_firewall.py
from ryu.base import app_manager
from ryu.controller import ofp_event
from ryu.controller.handler import (CONFIG_DISPATCHER,
    MAIN_DISPATCHER, set_ev_cls)
from ryu.ofproto import ofproto_v1_3
from ryu.lib.packet import packet, ethernet, ipv4, tcp

class RyuFirewall(app_manager.RyuApp):
    OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]

    # Quy tắc tường lửa: (src_ip, dst_ip, dst_port) → allow/deny
    RULES = [
        {"src":"10.0.0.1","dst":"10.0.0.2","port":80,"action":"ALLOW"},
        {"src":"10.0.0.1","dst":"10.0.0.2","port":22,"action":"DENY"},
        {"src":"any",     "dst":"any",      "port":"any","action":"ALLOW"},
    ]

    def _match_rule(self, src_ip, dst_ip, dst_port):
        for rule in self.RULES:
            if (rule["src"] in (src_ip, "any") and
                rule["dst"] in (dst_ip, "any") and
                rule["port"] in (dst_port, "any")):
                return rule["action"]
        return "ALLOW"

    @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
    def packet_in_handler(self, ev):
        msg = ev.msg
        dp  = msg.datapath
        pkt = packet.Packet(msg.data)
        pkt_ip  = pkt.get_protocols(ipv4.ipv4)
        pkt_tcp = pkt.get_protocols(tcp.tcp)
        if not pkt_ip: return

        src = pkt_ip[0].src
        dst = pkt_ip[0].dst
        dport = pkt_tcp[0].dst_port if pkt_tcp else None

        action = self._match_rule(src, dst, dport)
        self.logger.info(
            f"Firewall: {src}→{dst}:{dport} → {action}")

        if action == "DENY":
            # Cài DROP rule
            parser = dp.ofproto_parser
            match  = parser.OFPMatch(
                eth_type=0x0800,
                ipv4_src=src, ipv4_dst=dst)
            mod = parser.OFPFlowMod(
                datapath=dp, priority=100,
                match=match, instructions=[])
            dp.send_msg(mod)`,
    troubleshoot:[
      "Lỗi 'Connection refused port 6633': Ryu chưa chạy hoặc sai port",
      "Packet-In loop: kiểm tra table-miss priority=0 đã cài",
      "Flow không được cài: kiểm tra OFP_VERSION giữa switch và controller",
      "Ryu crash với 'eventlet': pip install eventlet==0.30.2",
    ]
  },
  {
    id:"L3", num:"Lab 03", color:"#fb923c",
    title:"APIC-EM REST API — Authentication & Inventory",
    category:"Network Automation",
    duration:"120 phút", difficulty:2, prereq:"Python requests, JSON cơ bản",
    objective:"Xây dựng Python client kết nối Cisco APIC-EM Sandbox: lấy token, thu thập device inventory đầy đủ, export báo cáo.",
    theory:`► CISCO APIC-EM REST API
Base URL: https://sandboxapicem.cisco.com
Auth: Token-based (ServiceTicket, TTL ~60 phút)

ENDPOINTS CHÍNH:
  POST /api/v1/ticket              → lấy token
  GET  /api/v1/network-device      → danh sách thiết bị
  GET  /api/v1/network-device/{id} → chi tiết 1 thiết bị
  GET  /api/v1/topology/physical-topology → topology
  POST /api/v1/flow-analysis       → khởi tạo path trace
  GET  /api/v1/flow-analysis/{id}  → kết quả path trace
  GET  /api/v1/interface/network-device/{id} → interfaces

RESPONSE FORMAT:
  { "response": [...], "version": "1.0" }`,
    install:[
      "# Cài thư viện cần thiết",
      "pip install requests urllib3",
      "",
      "# Test kết nối sandbox",
      "curl -k -X POST https://sandboxapicem.cisco.com/api/v1/ticket \\",
      "  -H 'Content-Type: application/json' \\",
      "  -d '{\"username\":\"devnetuser\",\"password\":\"Cisco123!\"}'",
      "",
      "# Kết quả mong muốn:",
      "# {\"response\":{\"serviceTicket\":\"ST-...\",\"idleTimeout\":1800,...}}",
    ],
    steps:[
      {title:"Tạo Authentication Module", cmd:`# File: apic_auth.py
import requests, time, os
requests.packages.urllib3.disable_warnings()

class APICEMAuth:
    """Quản lý token với auto-refresh"""
    BASE = "https://sandboxapicem.cisco.com"
    TTL  = 3400  # Refresh trước khi hết hạn (3600s)

    def __init__(self, username=None, password=None):
        self.user      = username or os.getenv("APIC_USER","devnetuser")
        self.pwd       = password or os.getenv("APIC_PASS","Cisco123!")
        self._token    = None
        self._exp      = 0
        self._refresh()

    def _refresh(self):
        url = f"{self.BASE}/api/v1/ticket"
        r   = requests.post(url,
              json={"username":self.user,"password":self.pwd},
              verify=False, timeout=15)
        r.raise_for_status()
        self._token = r.json()["response"]["serviceTicket"]
        self._exp   = time.time() + self.TTL
        print(f"[AUTH] Token refreshed: {self._token[:20]}...")

    @property
    def token(self):
        if time.time() > self._exp:
            print("[AUTH] Token expired, refreshing...")
            self._refresh()
        return self._token

    @property
    def headers(self):
        return {
            "X-Auth-Token"  : self.token,
            "Content-Type"  : "application/json",
            "Accept"        : "application/json"
        }

if __name__ == "__main__":
    auth = APICEMAuth()
    print(f"Token OK: {len(auth.token)} chars")`},
      {title:"Device Inventory với Pagination", cmd:`# File: inventory.py
import requests, json, csv
from datetime import datetime
from apic_auth import APICEMAuth
requests.packages.urllib3.disable_warnings()

class InventoryCollector:
    BASE = "https://sandboxapicem.cisco.com"

    def __init__(self):
        self.auth    = APICEMAuth()
        self.devices = []

    def _get(self, endpoint, params=None):
        """Generic GET với retry"""
        url = f"{self.BASE}{endpoint}"
        for attempt in range(3):
            try:
                r = requests.get(url,
                    headers=self.auth.headers,
                    params=params,
                    verify=False, timeout=20)
                r.raise_for_status()
                return r.json().get("response", [])
            except requests.exceptions.RequestException as e:
                print(f"[!] Attempt {attempt+1} failed: {e}")
                if attempt == 2: raise
                time.sleep(2)

    def collect_all(self):
        """Thu thập tất cả devices (có pagination)"""
        print("[*] Collecting devices...")
        # APIC-EM có thể giới hạn offset/limit
        all_devices = []
        offset = 1
        limit  = 20
        while True:
            batch = self._get("/api/v1/network-device",
                params={"offset":offset,"limit":limit})
            if not batch:
                break
            all_devices.extend(batch)
            print(f"    Collected: {len(all_devices)}")
            if len(batch) < limit:
                break
            offset += limit
        self.devices = all_devices
        print(f"[+] Total: {len(self.devices)} devices")
        return self.devices

    def collect_interfaces(self, device_id):
        return self._get(
            f"/api/v1/interface/network-device/{device_id}")

    def build_full_profile(self):
        """Build profile đầy đủ với interfaces"""
        profiles = []
        for d in self.devices:
            print(f"    Profiling: {d['hostname']}...", end="")
            intfs = self.collect_interfaces(d["id"])
            up    = sum(1 for i in intfs if i.get("status")=="up")
            profiles.append({
                **d,
                "interfaces_detail": intfs,
                "intf_total": len(intfs),
                "intf_up"   : up,
                "intf_down" : len(intfs)-up,
            })
            print(f" {len(intfs)} intfs")
        return profiles

    def print_table(self):
        print(f"\\n{'═'*72}")
        print(f"  NETWORK DEVICE INVENTORY — {datetime.now():%Y-%m-%d %H:%M}")
        print(f"{'═'*72}")
        h = f"{'#':>3} {'St':2} {'Hostname':<28} {'IP':<16} {'Role':<14} {'SW Ver'}"
        print(h); print("─"*72)
        for i,d in enumerate(self.devices,1):
            ok = "✓" if d["reachabilityStatus"]=="Reachable" else "✗"
            print(f"{i:>3} {ok:2} {d['hostname'][:27]:<28} "
                  f"{d['managementIpAddress']:<16} "
                  f"{d.get('role','?')[:13]:<14} "
                  f"{d.get('softwareVersion','N/A')}")
        print("─"*72)
        ok_cnt = sum(1 for d in self.devices
                     if d["reachabilityStatus"]=="Reachable")
        print(f"  Total: {len(self.devices)} | "
              f"Reachable: {ok_cnt} | "
              f"Down: {len(self.devices)-ok_cnt}")

    def export_json(self, fn="inventory.json"):
        with open(fn,"w",encoding="utf-8") as f:
            json.dump(self.devices, f, indent=2,
                      ensure_ascii=False)
        print(f"[+] JSON exported: {fn}")

    def export_csv(self, fn="inventory.csv"):
        fields = ["hostname","managementIpAddress","type",
                  "softwareVersion","reachabilityStatus",
                  "role","upTime","serialNumber"]
        with open(fn,"w",newline="",encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=fields,
                               extrasaction="ignore")
            w.writeheader()
            w.writerows(self.devices)
        print(f"[+] CSV exported: {fn}")

    def export_html(self, fn="inventory.html"):
        rows = ""
        for d in self.devices:
            ok    = d["reachabilityStatus"]=="Reachable"
            color = "#061a0e" if ok else "#1a0606"
            st    = "✅" if ok else "❌"
            rows += (f"<tr style='background:{color}'>"
                     f"<td>{st}</td>"
                     f"<td>{d['hostname']}</td>"
                     f"<td>{d['managementIpAddress']}</td>"
                     f"<td>{d.get('role','?')}</td>"
                     f"<td>{d.get('softwareVersion','?')}</td>"
                     f"<td>{d['reachabilityStatus']}</td></tr>")
        html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>Network Inventory</title>
<style>
body{{background:#050b14;color:#c0d8f0;font-family:monospace;padding:20px}}
h1{{color:#38bdf8}} p{{color:#4a8a9a}}
table{{border-collapse:collapse;width:100%;margin-top:16px}}
th{{background:#0a2030;color:#38bdf8;padding:10px;text-align:left}}
td{{padding:8px;border-bottom:1px solid #0a2030;font-size:13px}}
</style></head><body>
<h1>🌐 Network Device Inventory</h1>
<p>Generated: {datetime.now():%Y-%m-%d %H:%M} | 
   Total: {len(self.devices)}</p>
<table><tr>
<th>Status</th><th>Hostname</th><th>IP</th>
<th>Role</th><th>Version</th><th>Reachability</th>
</tr>{rows}</table></body></html>"""
        with open(fn,"w",encoding="utf-8") as f:
            f.write(html)
        print(f"[+] HTML exported: {fn}")

if __name__ == "__main__":
    col = InventoryCollector()
    col.collect_all()
    col.print_table()
    col.export_json()
    col.export_csv()
    col.export_html()`},
      {title:"Chạy và kiểm tra", cmd:`# Chạy inventory collector
python3 inventory.py

# Kiểm tra output files
ls -la *.json *.csv *.html

# Xem CSV
cat inventory.csv | column -t -s,

# Mở HTML report (nếu có browser)
# Mở file inventory.html trong browser`},
      {title:"Statistics & Analysis", cmd:`# File: analyze.py
import json
from collections import Counter

with open("inventory.json") as f:
    devices = json.load(f)

# Thống kê
by_role    = Counter(d.get("role","?") for d in devices)
by_version = Counter(d.get("softwareVersion","?") for d in devices)
by_status  = Counter(d["reachabilityStatus"] for d in devices)

print("=== INVENTORY ANALYSIS ===")
print(f"\\nBy Role:")
for role, count in sorted(by_role.items(),key=lambda x:-x[1]):
    bar = "█" * count
    print(f"  {role:<20} {count:>3} {bar}")

print(f"\\nBy Software Version:")
for ver, count in sorted(by_version.items()):
    print(f"  {ver:<20} {count:>3}")

print(f"\\nReachability:")
print(f"  Reachable  : {by_status.get('Reachable',0)}")
print(f"  Unreachable: {by_status.get('Unreachable',0)}")

# Tìm thiết bị cần chú ý
issues = [d for d in devices
          if d["reachabilityStatus"] != "Reachable"]
if issues:
    print(f"\\n⚠  UNREACHABLE DEVICES:")
    for d in issues:
        print(f"  ✗ {d['hostname']:30} {d['managementIpAddress']}")
else:
    print(f"\\n✅ All devices reachable")`},
    ],
    expected:[
      "✅ Authentication thành công, token nhận được",
      "✅ collect_all() trả về list devices (≥1 device)",
      "✅ Bảng inventory in đẹp, đúng dữ liệu",
      "✅ inventory.json tạo thành công",
      "✅ inventory.csv mở được trong Excel",
      "✅ inventory.html render đúng trong browser",
      "✅ analyze.py in thống kê chính xác",
    ],
    advanced:`# NÂNG CAO: Scheduled Auto-Refresh với notifications
import schedule, time, smtplib
from email.mime.text import MIMEText

class MonitoringAgent:
    def __init__(self):
        self.col        = InventoryCollector()
        self.prev_state = {}  # hostname → status

    def check_changes(self):
        self.col.collect_all()
        changes = []
        for d in self.col.devices:
            hostname = d["hostname"]
            new_status = d["reachabilityStatus"]
            old_status = self.prev_state.get(hostname)
            if old_status and old_status != new_status:
                changes.append({
                    "hostname": hostname,
                    "from": old_status,
                    "to": new_status,
                    "time": datetime.now().isoformat()
                })
                print(f"[ALERT] {hostname}: {old_status} → {new_status}")
            self.prev_state[hostname] = new_status
        return changes

    def run(self, interval_min=5):
        print(f"Monitoring started (interval: {interval_min}min)")
        schedule.every(interval_min).minutes.do(
            self.check_changes)
        while True:
            schedule.run_pending()
            time.sleep(30)

agent = MonitoringAgent()
agent.run(interval_min=1)  # Check mỗi 1 phút`,
    troubleshoot:[
      "SSL Error: thêm verify=False vào requests (sandbox dùng self-signed cert)",
      "401 Unauthorized: token hết hạn, cần re-authenticate",
      "Timeout: tăng timeout=30 hoặc kiểm tra internet connection",
      "Empty response: kiểm tra endpoint URL đúng",
    ]
  },
  {
    id:"L4", num:"Lab 04", color:"#c084fc",
    title:"Topology Discovery & Path Trace",
    category:"Network Automation",
    duration:"150 phút", difficulty:3, prereq:"Lab 03 hoàn thành",
    objective:"Thu thập và phân tích topology mạng, thực hiện path trace E2E, visualize topology dùng networkx và phát hiện bottlenecks.",
    theory:`► TOPOLOGY DATA STRUCTURE
Nodes: thiết bị mạng (router, switch, firewall)
Links: kết nối vật lý giữa các thiết bị

NODE OBJECT:
  id, label, ip, nodeType (ROUTER/SWITCH/FIREWALL)
  x, y (vị trí trên map)

LINK OBJECT:
  source, target (node IDs)
  startPortName, endPortName
  linkStatus (UP/DOWN)
  startPortSpeed, endPortSpeed

PATH TRACE FLOW:
  1. POST /flow-analysis {srcIP, dstIP}
  2. Nhận flowAnalysisId
  3. Poll GET /flow-analysis/{id} cho đến COMPLETED
  4. Parse networkElementsInfo → hop list`,
    install:[
      "# Cài networkx và matplotlib để vẽ topology",
      "pip install networkx matplotlib",
      "",
      "# Verify",
      "python3 -c 'import networkx; import matplotlib; print(\"OK\")'",
    ],
    steps:[
      {title:"Topology Collector & Parser", cmd:`# File: topology.py
import requests, json, time
from apic_auth import APICEMAuth
requests.packages.urllib3.disable_warnings()

class TopologyAnalyzer:
    BASE = "https://sandboxapicem.cisco.com"

    def __init__(self):
        self.auth  = APICEMAuth()
        self.topo  = {}
        self.nodes = {}  # id → node_info
        self.links = []

    def load(self):
        r = requests.get(
            f"{self.BASE}/api/v1/topology/physical-topology",
            headers=self.auth.headers, verify=False, timeout=20)
        r.raise_for_status()
        self.topo  = r.json()["response"]
        self.nodes = {n["id"]: n
                      for n in self.topo.get("nodes",[])}
        self.links = self.topo.get("links", [])
        print(f"[+] Topology: {len(self.nodes)} nodes, "
              f"{len(self.links)} links")
        return self.topo

    def get_label(self, node_id):
        n = self.nodes.get(node_id, {})
        return n.get("label") or n.get("ip","?")

    def print_ascii(self):
        """In topology dạng ASCII art"""
        print(f"\\n{'═'*65}")
        print(f"  PHYSICAL NETWORK TOPOLOGY")
        print(f"{'═'*65}")
        # Group theo status
        up_links   = [l for l in self.links if l.get("linkStatus")=="UP"]
        down_links = [l for l in self.links if l.get("linkStatus")!="UP"]

        print(f"  Links UP ({len(up_links)}):")
        for lk in up_links:
            src  = self.get_label(lk["source"])
            dst  = self.get_label(lk["target"])
            sp   = lk.get("startPortName","")[:15]
            ep   = lk.get("endPortName","")[:15]
            spd  = int(lk.get("startPortSpeed","0"))
            spd_l = f"{spd//1_000_000}M" if spd else "?"
            print(f"    {src:<22}[{sp:<15}]━━[{spd_l}]━━"
                  f"[{ep:<15}]{dst}")

        if down_links:
            print(f"\\n  Links DOWN ({len(down_links)}) ⚠:")
            for lk in down_links:
                src = self.get_label(lk["source"])
                dst = self.get_label(lk["target"])
                print(f"    {src:<22} ╌╌╌╌╌ {dst} (DOWN)")

    def print_node_list(self):
        """In danh sách nodes"""
        print(f"\\n  Nodes ({len(self.nodes)}):")
        for nid, n in self.nodes.items():
            label = n.get("label","?")
            ip    = n.get("ip","?")
            ntype = n.get("nodeType","?")
            print(f"    [{ntype:8}] {label:<28} {ip}")`},
      {title:"Path Trace Engine", cmd:`# Tiếp file: topology.py (thêm vào class)

    def trace_path(self, src_ip, dst_ip, max_wait=30):
        """Thực hiện path trace với polling"""
        print(f"\\n[*] Path trace: {src_ip} → {dst_ip}")

        # Khởi tạo trace
        r = requests.post(
            f"{self.BASE}/api/v1/flow-analysis",
            json={"sourceIP":src_ip,"destIP":dst_ip},
            headers=self.auth.headers,
            verify=False, timeout=15)
        r.raise_for_status()
        fid = r.json()["response"]["flowAnalysisId"]
        print(f"    Flow ID: {fid}")

        # Poll cho đến COMPLETED
        elapsed = 0
        while elapsed < max_wait:
            time.sleep(2)
            elapsed += 2
            r = requests.get(
                f"{self.BASE}/api/v1/flow-analysis/{fid}",
                headers=self.auth.headers,
                verify=False, timeout=15)
            data   = r.json()["response"]
            status = data["request"]["status"]
            print(f"    [{elapsed:2}s] Status: {status}")

            if status == "COMPLETED":
                hops = data.get("networkElementsInfo", [])
                self._print_path(src_ip, dst_ip, hops)
                return hops
            elif status == "FAILED":
                print(f"    [!] Path trace FAILED")
                return []

        print(f"    [!] Timeout after {max_wait}s")
        return []

    def _print_path(self, src, dst, hops):
        """In path trace kết quả đẹp"""
        print(f"\\n  PATH: {src} ──→ {dst}")
        print(f"  {'─'*60}")
        for i, hop in enumerate(hops):
            name = hop.get("name","?")
            ip   = hop.get("ip","?")
            ing  = (hop.get("ingressInterface",{})
                    .get("physicalInterface",{})
                    .get("name","?"))
            eg   = (hop.get("egressInterface",{})
                    .get("physicalInterface",{})
                    .get("name","?"))
            role = "SRC" if i==0 else \
                   ("DST" if i==len(hops)-1 else f"HOP{i}")
            print(f"  [{role:4}] {name:<28} ({ip})")
            if ing != "?": print(f"         ← in:{ing}")
            if eg  != "?": print(f"         → out:{eg}")
        print(f"  {'─'*60}")
        print(f"  Total hops: {len(hops)}")

    def batch_trace(self, pairs):
        """Batch trace nhiều cặp src-dst"""
        results = []
        for src, dst in pairs:
            hops = self.trace_path(src, dst)
            results.append({
                "src"    : src,
                "dst"    : dst,
                "hops"   : len(hops),
                "path"   : [h.get("name","?") for h in hops],
                "success": len(hops) > 0
            })
        return results

    def export_topology_json(self, fn="topology.json"):
        with open(fn,"w") as f:
            json.dump({
                "nodes": list(self.nodes.values()),
                "links": self.links
            }, f, indent=2)
        print(f"[+] Topology saved: {fn}")`},
      {title:"Visualize với NetworkX", cmd:`# File: visualize_topo.py
import json, networkx as nx
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

def visualize_topology(topo_file="topology.json",
                       out_file="topology.png"):
    with open(topo_file) as f:
        data = json.load(f)

    G = nx.Graph()
    node_colors = []
    node_labels = {}
    pos_dict    = {}

    # Node type → color mapping
    type_colors = {
        "ROUTER"  : "#00d4ff",
        "SWITCH"  : "#4ade80",
        "FIREWALL": "#f472b6",
        "WIRELESS": "#fbbf24",
    }

    # Thêm nodes
    for n in data["nodes"]:
        nid   = n["id"]
        label = n.get("label") or n.get("ip","?")
        ntype = n.get("nodeType","ROUTER")
        G.add_node(nid, label=label, type=ntype)
        node_labels[nid] = label[:15]
        # Dùng vị trí từ API nếu có
        if "x" in n and "y" in n:
            pos_dict[nid] = (float(n["x"]), -float(n["y"]))

    # Màu node theo type
    for nid in G.nodes():
        ntype = G.nodes[nid].get("type","ROUTER")
        node_colors.append(type_colors.get(ntype,"#888"))

    # Thêm edges
    edge_colors = []
    for lk in data["links"]:
        G.add_edge(lk["source"], lk["target"],
                   status=lk.get("linkStatus","?"),
                   sp=lk.get("startPortName",""),
                   ep=lk.get("endPortName",""))
        edge_colors.append(
            "#00ff88" if lk.get("linkStatus")=="UP" else "#ff4444")

    # Layout
    if len(pos_dict) == len(G.nodes()):
        pos = pos_dict
    else:
        pos = nx.spring_layout(G, seed=42, k=2.0)

    # Vẽ
    fig, ax = plt.subplots(1, 1, figsize=(16, 10))
    fig.patch.set_facecolor("#050b14")
    ax.set_facecolor("#050b14")

    nx.draw_networkx_edges(G, pos, ax=ax,
        edge_color=edge_colors, width=2, alpha=0.8)
    nx.draw_networkx_nodes(G, pos, ax=ax,
        node_color=node_colors, node_size=800, alpha=0.9)
    nx.draw_networkx_labels(G, pos, node_labels, ax=ax,
        font_size=8, font_color="#ffffff",
        font_family="monospace")

    # Legend
    patches = [mpatches.Patch(color=c, label=t)
               for t,c in type_colors.items()]
    ax.legend(handles=patches, loc="upper left",
              facecolor="#0a1828", edgecolor="#1a3a5a",
              labelcolor="white")

    ax.set_title("Network Physical Topology",
        color="#38bdf8", fontsize=14, pad=15)
    ax.axis("off")
    plt.tight_layout()
    plt.savefig(out_file, dpi=150,
        facecolor=fig.get_facecolor())
    print(f"[+] Topology image saved: {out_file}")

visualize_topology()`},
      {title:"Main: Chạy toàn bộ", cmd:`# File: main_topology.py
from topology import TopologyAnalyzer
from visualize_topo import visualize_topology

def main():
    ta = TopologyAnalyzer()

    # 1. Load topology
    ta.load()
    ta.print_ascii()
    ta.print_node_list()
    ta.export_topology_json()

    # 2. Visualize
    visualize_topology("topology.json", "topology.png")

    # 3. Path traces
    print("\\n=== PATH TRACE TESTS ===")
    pairs = [
        ("10.10.22.98", "10.10.22.114"),
        ("10.10.22.66", "10.10.22.98"),
    ]
    results = ta.batch_trace(pairs)

    # 4. Summary
    print("\\n=== BATCH TRACE SUMMARY ===")
    for r in results:
        status = "✓" if r["success"] else "✗"
        path   = " → ".join(r["path"]) or "NO PATH"
        print(f"  {status} {r['src']} → {r['dst']}")
        print(f"    Hops: {r['hops']} | {path}")

main()`},
    ],
    expected:[
      "✅ Topology loaded: nodes và links đúng",
      "✅ ASCII topology in rõ connections + speed",
      "✅ topology.json tạo thành công",
      "✅ topology.png visualize đẹp với màu theo node type",
      "✅ Path trace COMPLETED trong <30s",
      "✅ Hop list hiển thị in/out ports",
      "✅ Batch trace chạy tất cả pairs",
    ],
    advanced:`# NÂNG CAO: Shortest Path & Redundancy Analysis
import networkx as nx, json

def analyze_redundancy(topo_file="topology.json"):
    with open(topo_file) as f:
        data = json.load(f)

    G    = nx.Graph()
    nmap = {n["id"]: n.get("label",n.get("ip","?"))
            for n in data["nodes"]}

    for lk in data["links"]:
        if lk.get("linkStatus") == "UP":
            spd = int(lk.get("startPortSpeed","0"))
            G.add_edge(lk["source"], lk["target"],
                       weight=1/(spd+1))  # Ưu tiên link nhanh

    ids = list(G.nodes())
    print("\\n=== REDUNDANCY ANALYSIS ===")

    # Kiểm tra connectivity
    print(f"Connected: {nx.is_connected(G)}")
    print(f"Nodes: {G.number_of_nodes()}, "
          f"Edges: {G.number_of_edges()}")

    # Tìm single points of failure
    cuts = list(nx.articulation_points(G))
    print(f"\\nSingle Points of Failure (cut vertices):")
    for node_id in cuts:
        print(f"  ⚠  {nmap.get(node_id, node_id)}")

    # Tìm bridges (single links)
    bridges = list(nx.bridges(G))
    print(f"\\nCritical Links (bridges):")
    for u, v in bridges:
        print(f"  ⚠  {nmap.get(u,'?')} ──── {nmap.get(v,'?')}")

    # Diameter
    if nx.is_connected(G):
        diam = nx.diameter(G)
        print(f"\\nNetwork diameter: {diam} hops")

analyze_redundancy()`,
    troubleshoot:[
      "flowAnalysisId 404: Đợi thêm hoặc thử lại — sandbox có thể bận",
      "FAILED status: src/dst IP không tồn tại trong network",
      "networkx ImportError: pip install networkx matplotlib",
      "PNG trống: kiểm tra topology.json có nodes/links",
    ]
  },
  {
    id:"L5", num:"Lab 05", color:"#f472b6",
    title:"Network Automation — Config Push & Verify",
    category:"Network Automation",
    duration:"180 phút", difficulty:3, prereq:"Lab 03-04, Netmiko",
    objective:"Tự động push cấu hình lên thiết bị qua SSH (Netmiko), verify kết quả và implement rollback khi lỗi.",
    theory:`► NETMIKO
Netmiko = thư viện Python đơn giản hóa SSH đến network devices.
Hỗ trợ 75+ loại thiết bị: Cisco IOS/XE/XR/NX-OS, Juniper, Arista...

SSH WORKFLOW:
  Python → SSH connect → send commands → capture output → close

NETMIKO VS PARAMIKO:
  Paramiko: raw SSH, phải tự handle prompts
  Netmiko : abstraction layer, tự handle: login prompt,
            enable mode, config mode, pagination`,
    install:[
      "# Cài Netmiko",
      "pip install netmiko",
      "",
      "# Cài thêm",
      "pip install pyyaml jinja2 textfsm",
      "",
      "# Test với Cisco DevNet Always-On Sandbox",
      "# Host: sandbox-iosxe-latest-1.cisco.com",
      "# User: developer / Password: C1sco12345",
      "# Port: 22",
    ],
    steps:[
      {title:"Kết nối SSH với Netmiko", cmd:`# File: netmiko_basics.py
from netmiko import ConnectHandler
from netmiko import NetmikoTimeoutException, NetmikoAuthenticationException

# Device definition
DEVICE = {
    "device_type"     : "cisco_ios",
    "host"            : "sandbox-iosxe-latest-1.cisco.com",
    "username"        : "developer",
    "password"        : "C1sco12345",
    "secret"          : "C1sco12345",  # enable password
    "port"            : 22,
    "timeout"         : 30,
    "session_log"     : "session.log",  # log toàn bộ session
}

try:
    print(f"Connecting to {DEVICE['host']}...")
    conn = ConnectHandler(**DEVICE)
    print(f"[+] Connected!")
    print(f"    Hostname: {conn.find_prompt()}")

    # Enable mode
    conn.enable()
    print(f"    Mode: {conn.find_prompt()}")

    # Show basic info
    output = conn.send_command("show version | include Version")
    print(f"    {output.strip()}")

    output = conn.send_command("show ip interface brief")
    print("\\n" + output)

    conn.disconnect()
    print("[+] Disconnected")

except NetmikoAuthenticationException:
    print("[!] Authentication failed — check credentials")
except NetmikoTimeoutException:
    print("[!] Timeout — check host/port")
except Exception as e:
    print(f"[!] Error: {e}")`},
      {title:"Config Push với Verify", cmd:`# File: config_manager.py
from netmiko import ConnectHandler
import time, logging

logging.basicConfig(level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

class ConfigManager:
    def __init__(self, device_params):
        self.device = device_params
        self.conn   = None
        self.backup = None

    def connect(self):
        log.info(f"Connecting to {self.device['host']}")
        self.conn = ConnectHandler(**self.device)
        self.conn.enable()
        log.info(f"Connected: {self.conn.find_prompt()}")

    def disconnect(self):
        if self.conn:
            self.conn.disconnect()
            log.info("Disconnected")

    def backup_config(self):
        """Lưu running-config trước khi thay đổi"""
        log.info("Backing up running-config...")
        self.backup = self.conn.send_command(
            "show running-config")
        with open("backup_config.txt","w") as f:
            f.write(self.backup)
        log.info(f"Backup: {len(self.backup)} chars")
        return self.backup

    def push_config(self, commands):
        """Push danh sách commands vào config mode"""
        log.info(f"Pushing {len(commands)} commands...")
        output = self.conn.send_config_set(commands)
        log.info("Config pushed")
        return output

    def verify(self, check_commands, expected_strings):
        """Verify cấu hình đã được áp dụng"""
        results = []
        for cmd, expected in zip(check_commands, expected_strings):
            output = self.conn.send_command(cmd)
            found  = expected in output
            results.append({
                "cmd"     : cmd,
                "expected": expected,
                "found"   : found,
                "output"  : output
            })
            status = "✓" if found else "✗"
            log.info(f"  [{status}] {cmd}: '{expected}'")
        return results

    def rollback(self):
        """Khôi phục lại backup config"""
        if not self.backup:
            log.error("No backup to rollback!")
            return False
        log.warning("ROLLING BACK to backup config!")
        # Xóa config hiện tại và apply backup
        self.conn.send_command(
            "write erase", expect_string=r"\[confirm\]")
        self.conn.send_command("")  # Confirm
        # Push backup (chia từng dòng)
        lines = [l for l in self.backup.split("\\n")
                 if l and not l.startswith("!")]
        self.conn.send_config_set(lines[:50])  # Giới hạn
        log.info("Rollback completed")
        return True

    def save_config(self):
        """write memory"""
        self.conn.send_command("write memory",
            expect_string=r"OK|\\[OK\\]")
        log.info("Config saved to NVRAM")

# ── Demo Usage ──────────────────────────────────────
def demo_config_push():
    DEVICE = {
        "device_type": "cisco_ios",
        "host"       : "sandbox-iosxe-latest-1.cisco.com",
        "username"   : "developer",
        "password"   : "C1sco12345",
        "secret"     : "C1sco12345",
    }

    mgr = ConfigManager(DEVICE)
    mgr.connect()

    # 1. Backup trước
    mgr.backup_config()

    # 2. Định nghĩa config cần push
    new_config = [
        "interface Loopback100",
        "description LAB-TEST-INTERFACE",
        "ip address 172.16.100.1 255.255.255.0",
        "no shutdown",
        "exit",
        "ip route 192.168.99.0 255.255.255.0 Null0",
    ]

    # 3. Push config
    output = mgr.push_config(new_config)
    print(output)

    # 4. Verify
    checks = [
        ("show interface Lo100 | include Description",
         "LAB-TEST-INTERFACE"),
        ("show interface Lo100 | include Internet address",
         "172.16.100.1"),
        ("show ip route 192.168.99.0",
         "192.168.99.0"),
    ]
    results = mgr.verify(
        [c[0] for c in checks],
        [c[1] for c in checks])

    # 5. Quyết định: save hoặc rollback
    all_ok = all(r["found"] for r in results)
    if all_ok:
        print("\\n✅ All verifications passed — saving config")
        mgr.save_config()
    else:
        print("\\n❌ Verification failed — rolling back!")
        mgr.rollback()

    mgr.disconnect()

demo_config_push()`},
      {title:"Bulk Config từ CSV + Jinja2", cmd:`# File: bulk_config.py
import csv, yaml
from jinja2 import Template
from netmiko import ConnectHandler

# Template Jinja2 cho VLAN config
VLAN_TEMPLATE = Template("""
{% for vlan in vlans %}
vlan {{ vlan.id }}
 name {{ vlan.name }}
!
{% endfor %}
{% for intf in access_ports %}
interface {{ intf.name }}
 switchport mode access
 switchport access vlan {{ intf.vlan }}
 spanning-tree portfast
!
{% endfor %}
""")

# devices.yaml
DEVICES_YAML = """
devices:
  - host: sandbox-iosxe-latest-1.cisco.com
    username: developer
    password: C1sco12345
    device_type: cisco_ios
    vlans:
      - {id: 10, name: USERS}
      - {id: 20, name: SERVERS}
      - {id: 99, name: MGMT}
    access_ports:
      - {name: GigabitEthernet2, vlan: 10}
"""

import yaml

data = yaml.safe_load(DEVICES_YAML)

for dev in data["devices"]:
    config_text = VLAN_TEMPLATE.render(
        vlans       = dev.get("vlans",[]),
        access_ports= dev.get("access_ports",[]))

    commands = [l.strip() for l in config_text.split("\\n")
                if l.strip() and not l.strip().startswith("!")]

    print(f"\\nPushing to {dev['host']}:")
    print("─" * 40)
    print("\\n".join(commands[:10]), "...")

    conn_params = {k:v for k,v in dev.items()
                   if k not in ("vlans","access_ports")}
    try:
        with ConnectHandler(**conn_params) as conn:
            conn.enable()
            output = conn.send_config_set(commands)
            print(f"✓ Done: {len(commands)} commands pushed")
    except Exception as e:
        print(f"✗ Error: {e}")`},
    ],
    expected:[
      "✅ Kết nối SSH thành công",
      "✅ backup_config.txt được tạo",
      "✅ push_config: không có lỗi IOS",
      "✅ verify: tất cả check passed",
      "✅ 'write memory' thành công",
      "✅ Rollback hoạt động khi verify fail",
      "✅ Jinja2 template generate commands đúng",
    ],
    advanced:`# NÂNG CAO: Multi-device Parallel Config với ThreadPoolExecutor
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def configure_device(device_params, commands):
    """Cấu hình 1 thiết bị — chạy trong thread"""
    host   = device_params["host"]
    result = {"host":host, "success":False,
              "error":None, "duration":0}
    t0 = time.time()
    try:
        with ConnectHandler(**device_params) as conn:
            conn.enable()
            output = conn.send_config_set(commands)
            conn.send_command("write memory",
                expect_string=r"OK|\\[OK\\]")
            result["success"] = True
            result["output"]  = output
    except Exception as e:
        result["error"] = str(e)
    result["duration"] = round(time.time()-t0, 2)
    return result

devices = [...]  # list of device dicts
commands = [
    "logging buffered 10000",
    "no logging console",
    "service timestamps log datetime msec",
]

print(f"Configuring {len(devices)} devices in parallel...")
with ThreadPoolExecutor(max_workers=5) as executor:
    futures = {
        executor.submit(configure_device, d, commands): d
        for d in devices}
    for future in as_completed(futures):
        r = future.result()
        status = "✓" if r["success"] else "✗"
        print(f"  [{status}] {r['host']} — {r['duration']}s"
              + (f" — {r['error']}" if r['error'] else ""))`,
    troubleshoot:[
      "SSH Connection refused: kiểm tra host/port, thiết bị có SSH enabled không",
      "Authentication failed: kiểm tra username/password/secret",
      "Config rejected: kiểm tra syntax IOS, có thể thiếu 'exit'",
      "Timeout: tăng timeout=60, kiểm tra network latency",
    ]
  },
  {
    id:"L6", num:"Lab 06", color:"#34d399",
    title:"Full Network Management App — Dashboard CLI",
    category:"Capstone Project",
    duration:"240 phút", difficulty:3, prereq:"Lab 01–05 hoàn thành",
    objective:"Xây dựng ứng dụng quản lý mạng hoàn chỉnh tích hợp tất cả Lab trước: discovery, inventory, topology, path trace, config push — với CLI menu và logging.",
    theory:`► KIẾN TRÚC ỨNG DỤNG
NetworkManager
├── core/
│   ├── auth.py          APICEMAuth (token mgr)
│   ├── inventory.py     InventoryCollector
│   ├── topology.py      TopologyAnalyzer
│   └── config_mgr.py    ConfigManager (Netmiko)
├── reports/
│   ├── html_report.py   HTML exporter
│   └── csv_report.py    CSV exporter
├── utils/
│   ├── logger.py        Logging setup
│   └── helpers.py       Utility functions
├── config.yaml          Cấu hình ứng dụng
└── main.py              CLI entry point`,
    install:[
      "# Cài tất cả dependencies",
      "pip install requests netmiko networkx matplotlib",
      "pip install pyyaml jinja2 schedule rich",
      "",
      "# 'rich' cho CLI đẹp hơn",
      "pip install rich",
    ],
    steps:[
      {title:"Config & Utils Layer", cmd:`# File: config.yaml
app:
  name: "Network Manager — DLU Lab"
  version: "1.0.0"
  log_level: INFO
  log_file: network_manager.log

apic_em:
  base_url: https://sandboxapicem.cisco.com
  username: devnetuser
  password: Cisco123!
  timeout: 20
  retry: 3

ssh:
  default_user: developer
  default_pass: C1sco12345
  timeout: 30
  sandbox_host: sandbox-iosxe-latest-1.cisco.com

export:
  output_dir: ./reports

─────────────────────────────────────────────────
# File: utils/logger.py
import logging
from datetime import datetime

def setup_logger(name="NetworkManager", level="INFO",
                 log_file="network_manager.log"):
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level))

    fmt = logging.Formatter(
        "%(asctime)s [%(levelname)7s] %(name)s — %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S")

    # File handler
    fh = logging.FileHandler(log_file, encoding="utf-8")
    fh.setFormatter(fmt)
    logger.addHandler(fh)

    # Console handler
    ch = logging.StreamHandler()
    ch.setFormatter(fmt)
    ch.setLevel(logging.WARNING)
    logger.addHandler(ch)

    return logger`},
      {title:"Core Application Class", cmd:`# File: network_manager.py
import yaml, json, os, time
from datetime import datetime
from core.auth      import APICEMAuth
from core.inventory import InventoryCollector
from core.topology  import TopologyAnalyzer
from utils.logger   import setup_logger

class NetworkManager:
    """Ứng dụng quản lý mạng tích hợp"""

    def __init__(self, config_file="config.yaml"):
        with open(config_file) as f:
            self.cfg = yaml.safe_load(f)

        self.log = setup_logger(
            level=self.cfg["app"]["log_level"],
            log_file=self.cfg["app"]["log_file"])

        self.log.info(f"Starting {self.cfg['app']['name']}")
        self.auth    = APICEMAuth(**self.cfg["apic_em"])
        self.inv_col = InventoryCollector(self.auth)
        self.topo_an = TopologyAnalyzer(self.auth)

        os.makedirs(self.cfg["export"]["output_dir"],
                    exist_ok=True)

    def discover_network(self):
        self.log.info("Starting network discovery...")
        devices = self.inv_col.collect_all()
        self.log.info(f"Discovery complete: {len(devices)}")
        return devices

    def show_inventory(self):
        if not self.inv_col.devices:
            self.discover_network()
        self.inv_col.print_table()

    def show_topology(self):
        self.topo_an.load()
        self.topo_an.print_ascii()

    def trace(self, src, dst):
        return self.topo_an.trace_path(src, dst)

    def export_all(self):
        ts  = datetime.now().strftime("%Y%m%d_%H%M")
        out = self.cfg["export"]["output_dir"]
        if not self.inv_col.devices:
            self.discover_network()
        self.inv_col.export_json(f"{out}/inv_{ts}.json")
        self.inv_col.export_csv(f"{out}/inv_{ts}.csv")
        self.inv_col.export_html(f"{out}/inv_{ts}.html")
        self.log.info(f"Reports exported to {out}/")`},
      {title:"CLI Menu (Main)", cmd:`# File: main.py
#!/usr/bin/env python3
"""Network Management Application — DLU Chuyên Đề MMT 1"""
import sys
from network_manager import NetworkManager

BANNER = """
╔══════════════════════════════════════════════════════╗
║   🌐  NETWORK MANAGEMENT APPLICATION  v1.0           ║
║   Chuyên Đề Mạng Máy Tính 1 — Đại học Đà Lạt         ║
╚══════════════════════════════════════════════════════╝"""

MENU = """
  ┌─────────────────────────────────────────────┐
  │  [1] Network Discovery & Summary            │
  │  [2] Device Inventory Table                 │
  │  [3] Physical Topology Map                  │
  │  [4] Path Trace (src → dst)                 │
  │  [5] Device Profile Detail                  │
  │  [6] Batch Path Trace từ file               │
  │  [7] Export Reports (JSON + CSV + HTML)     │
  │  [8] Auto Monitor (real-time polling)       │
  │  [0] Exit                                   │
  └─────────────────────────────────────────────┘"""

def main():
    print(BANNER)
    print("  Initializing...")
    mgr = NetworkManager()
    print("  Ready!\\n")

    while True:
        print(MENU)
        choice = input("  → ").strip()

        if choice == "1":
            devices = mgr.discover_network()
            ok = sum(1 for d in devices
                     if d["reachabilityStatus"]=="Reachable")
            print(f"\\n  ✓ Found: {len(devices)} devices | "
                  f"Up: {ok} | Down: {len(devices)-ok}")

        elif choice == "2":
            mgr.show_inventory()

        elif choice == "3":
            mgr.show_topology()

        elif choice == "4":
            src = input("  Source IP: ").strip()
            dst = input("  Dest   IP: ").strip()
            mgr.trace(src, dst)

        elif choice == "5":
            if not mgr.inv_col.devices:
                mgr.discover_network()
            q = input("  Hostname/IP: ").strip().lower()
            hits = [d for d in mgr.inv_col.devices
                    if q in d["hostname"].lower()
                    or q in d["managementIpAddress"]]
            for d in hits:
                intfs = mgr.inv_col.collect_interfaces(d["id"])
                print(f"\\n  {d['hostname']} [{d['managementIpAddress']}]")
                print(f"  {'─'*50}")
                print(f"  Platform : {d.get('platformId','?')}")
                print(f"  Version  : {d.get('softwareVersion','?')}")
                print(f"  Uptime   : {d.get('upTime','?')}")
                print(f"  Interfaces ({len(intfs)}):")
                for i in sorted(intfs,
                        key=lambda x:x.get("portName","")):
                    s  = "↑" if i.get("status")=="up" else "↓"
                    ip = i.get("ipv4Address","")
                    print(f"    {s} {i['portName']:<22} {ip}")

        elif choice == "6":
            fn = input("  File CSV (src,dst per line): ").strip()
            try:
                import csv
                pairs = []
                with open(fn) as f:
                    for row in csv.reader(f):
                        if len(row) >= 2:
                            pairs.append((row[0].strip(),
                                          row[1].strip()))
                results = mgr.topo_an.batch_trace(pairs)
                print(f"\\n  Batch trace: {len(pairs)} pairs")
                for r in results:
                    st = "✓" if r["success"] else "✗"
                    print(f"  [{st}] {r['src']:16} → "
                          f"{r['dst']:16} ({r['hops']} hops)")
            except FileNotFoundError:
                print(f"  [!] File not found: {fn}")

        elif choice == "7":
            mgr.export_all()
            print("  ✓ Reports exported to ./reports/")

        elif choice == "8":
            import schedule, time
            interval = int(input("  Check every N seconds [30]: ").strip() or "30")
            prev = {}
            def monitor():
                devices = mgr.discover_network()
                for d in devices:
                    h  = d["hostname"]
                    st = d["reachabilityStatus"]
                    if h in prev and prev[h] != st:
                        print(f"  [ALERT] {h}: {prev[h]} → {st}")
                    prev[h] = st
            print(f"  Monitoring... (Ctrl+C to stop)")
            schedule.every(interval).seconds.do(monitor)
            try:
                while True:
                    schedule.run_pending()
                    time.sleep(5)
            except KeyboardInterrupt:
                print("\\n  Monitoring stopped")

        elif choice == "0":
            print("\\n  Goodbye! 👋")
            sys.exit(0)
        else:
            print("  Invalid choice")

if __name__ == "__main__":
    main()`},
    ],
    expected:[
      "✅ App khởi động, không lỗi import",
      "✅ Menu hiển thị đúng",
      "✅ Tất cả 8 chức năng hoạt động",
      "✅ Reports/ thư mục được tạo",
      "✅ network_manager.log ghi đúng",
      "✅ Monitor: phát hiện status change",
      "✅ Demo live 10 phút không crash",
    ],
    advanced:`# NÂNG CAO: Flask Web Interface
from flask import Flask, jsonify, render_template_string
import threading

app_flask = Flask(__name__)
mgr       = NetworkManager()

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
<title>Network Manager Dashboard</title>
<meta http-equiv="refresh" content="30">
<style>
body{background:#050b14;color:#c0d8f0;font-family:monospace;padding:20px}
h1{color:#38bdf8} .card{background:#07111c;border:1px solid #0a2030;
border-radius:8px;padding:16px;margin:10px 0}
.up{color:#10b981} .down{color:#ef4444}
table{border-collapse:collapse;width:100%}
th{background:#0a2030;color:#38bdf8;padding:8px}
td{padding:6px 8px;border-bottom:1px solid #0a1828}
</style>
</head>
<body>
<h1>🌐 Network Dashboard — {{ now }}</h1>
<div class="card">
<h3>Devices: {{ total }} | 
  <span class="up">Up: {{ ok }}</span> | 
  <span class="down">Down: {{ down }}</span>
</h3>
</div>
<table>
<tr><th>Status</th><th>Hostname</th><th>IP</th>
    <th>Role</th><th>Version</th></tr>
{% for d in devices %}
<tr>
<td class="{{ 'up' if d.reachabilityStatus=='Reachable' else 'down' }}">
  {{ '✓' if d.reachabilityStatus=='Reachable' else '✗' }}</td>
<td>{{ d.hostname }}</td>
<td>{{ d.managementIpAddress }}</td>
<td>{{ d.get('role','?') }}</td>
<td>{{ d.get('softwareVersion','?') }}</td>
</tr>
{% endfor %}
</table>
</body></html>
"""

@app_flask.route("/")
def dashboard():
    from jinja2 import Template
    devs = mgr.discover_network()
    ok   = sum(1 for d in devs if d["reachabilityStatus"]=="Reachable")
    return Template(HTML_TEMPLATE).render(
        devices=devs, total=len(devs), ok=ok,
        down=len(devs)-ok,
        now=datetime.now().strftime("%Y-%m-%d %H:%M"))

@app_flask.route("/api/devices")
def api_devices():
    return jsonify(mgr.discover_network())

if __name__ == "__main__":
    app_flask.run(host="0.0.0.0", port=5000, debug=False)
# Mở: http://localhost:5000`,
    troubleshoot:[
      "Import error: kiểm tra cấu trúc thư mục, chạy từ thư mục root",
      "config.yaml not found: đảm bảo file trong cùng thư mục với main.py",
      "APIC-EM timeout: kiểm tra internet và sandbox availability",
      "rich module not found: pip install rich",
    ]
  },
  {
    id:"L7", num:"Lab 07", color:"#a78bfa",
    title:"OpenFlow QoS & Traffic Engineering",
    category:"Advanced SDN",
    duration:"150 phút", difficulty:3, prereq:"Lab 01-02",
    objective:"Implement QoS policies qua OpenFlow: phân loại traffic, rate limiting, priority queuing và traffic engineering với Ryu.",
    theory:`► QoS TRONG SDN
Ưu điểm SDN cho QoS: cấu hình tập trung, thay đổi real-time

DSCP MARKING VÀ CLASSES:
  EF  (101110) → VoIP, delay < 10ms
  AF41(100010) → Video streaming
  AF21(010010) → Business critical
  CS0 (000000) → Best effort

OPENFLOW QoS MECHANISMS:
  1. Meter bands    — rate limiting per-flow
  2. Queue mapping  — map flow → OVS queue
  3. DSCP remarking — thay đổi DSCP field
  4. Priority flows — high priority rules`,
    install:[
      "# OVS QoS setup",
      "sudo ovs-vsctl set port s1-eth1 qos=@newqos \\",
      "  -- --id=@newqos create qos type=linux-htb \\",
      "  queues:0=@q0 queues:1=@q1 queues:2=@q2 \\",
      "  -- --id=@q0 create queue other-config:max-rate=1000000000 \\",
      "  -- --id=@q1 create queue other-config:max-rate=100000000 \\",
      "  -- --id=@q2 create queue other-config:min-rate=10000000",
    ],
    steps:[
      {title:"Ryu QoS Application", cmd:`# File: ryu_qos.py
from ryu.base import app_manager
from ryu.controller import ofp_event
from ryu.controller.handler import (CONFIG_DISPATCHER,
    MAIN_DISPATCHER, set_ev_cls)
from ryu.ofproto import ofproto_v1_3
from ryu.lib.packet import (packet, ethernet, ipv4,
    tcp, udp, ether_types)

class QoSController(app_manager.RyuApp):
    OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]

    # QoS Policy: protocol/port → queue/priority
    QOS_POLICY = [
        # VoIP: RTP/SIP (port 5060, 5004-5020)
        {"proto":"udp","dport":5060,"queue":1,"priority":300,
         "name":"VoIP-SIP"},
        {"proto":"udp","dport_range":(5004,5020),"queue":1,
         "priority":300,"name":"VoIP-RTP"},
        # Video: port 554 (RTSP), 1935 (RTMP)
        {"proto":"tcp","dport":554, "queue":2,"priority":200,
         "name":"Video-RTSP"},
        {"proto":"tcp","dport":1935,"queue":2,"priority":200,
         "name":"Video-RTMP"},
        # SSH management
        {"proto":"tcp","dport":22,  "queue":1,"priority":250,
         "name":"Management-SSH"},
        # HTTP/HTTPS: best effort
        {"proto":"tcp","dport":80,  "queue":3,"priority":100,
         "name":"HTTP"},
        {"proto":"tcp","dport":443, "queue":3,"priority":100,
         "name":"HTTPS"},
    ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.mac_port = {}

    @set_ev_cls(ofp_event.EventOFPSwitchFeatures,
                CONFIG_DISPATCHER)
    def features_handler(self, ev):
        dp     = ev.msg.datapath
        parser = dp.ofproto_parser

        # Table-miss → controller
        match   = parser.OFPMatch()
        actions = [parser.OFPActionOutput(
            dp.ofproto.OFPP_CONTROLLER,
            dp.ofproto.OFPCML_NO_BUFFER)]
        self._add_flow(dp, 0, match, actions)

        # Cài QoS flows dựa trên policy
        self._install_qos_flows(dp)
        self.logger.info(
            f"QoS flows installed on switch {dp.id}")

    def _install_qos_flows(self, dp):
        parser = dp.ofproto_parser
        for policy in self.QOS_POLICY:
            try:
                if policy["proto"] == "udp":
                    match = parser.OFPMatch(
                        eth_type=0x0800,
                        ip_proto=17,
                        udp_dst=policy["dport"])
                else:
                    match = parser.OFPMatch(
                        eth_type=0x0800,
                        ip_proto=6,
                        tcp_dst=policy["dport"])

                # Action: enqueue (dùng queue_id)
                actions = [parser.OFPActionSetQueue(
                    policy["queue"]),
                    parser.OFPActionOutput(
                        dp.ofproto.OFPP_FLOOD)]
                self._add_flow(dp, policy["priority"],
                               match, actions)
                self.logger.info(
                    f"  QoS: {policy['name']} → queue{policy['queue']}")
            except Exception as e:
                self.logger.error(
                    f"  Error installing {policy['name']}: {e}")

    def _add_flow(self, dp, priority, match, actions):
        parser = dp.ofproto_parser
        inst = [parser.OFPInstructionActions(
            dp.ofproto.OFPIT_APPLY_ACTIONS, actions)]
        mod = parser.OFPFlowMod(
            datapath=dp, priority=priority,
            match=match, instructions=inst,
            idle_timeout=0, hard_timeout=0)
        dp.send_msg(mod)

    @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
    def packet_in_handler(self, ev):
        # L2 learning cho unmatched packets
        msg     = ev.msg
        dp      = msg.datapath
        in_port = msg.match['in_port']
        pkt     = packet.Packet(msg.data)
        eth     = pkt.get_protocols(ethernet.ethernet)[0]

        if eth.ethertype == ether_types.ETH_TYPE_LLDP:
            return

        dpid = dp.id
        self.mac_port.setdefault(dpid, {})
        self.mac_port[dpid][eth.src] = in_port

        out_port = self.mac_port[dpid].get(
            eth.dst, dp.ofproto.OFPP_FLOOD)
        actions  = [dp.ofproto_parser.OFPActionOutput(out_port)]
        data     = msg.data if msg.buffer_id == \
                   dp.ofproto.OFP_NO_BUFFER else None
        out = dp.ofproto_parser.OFPPacketOut(
            datapath=dp, buffer_id=msg.buffer_id,
            in_port=in_port, actions=actions, data=data)
        dp.send_msg(out)`},
      {title:"Setup OVS Queues", cmd:`# Script: setup_qos.sh
#!/bin/bash
# Setup OVS QoS queues cho Mininet switches

SWITCH="s1"
PORT="s1-eth1"

echo "Setting up QoS on $PORT..."

# Xóa QoS cũ
sudo ovs-vsctl clear Port $PORT qos
sudo ovs-vsctl -- --all destroy QoS
sudo ovs-vsctl -- --all destroy Queue

# Tạo queues:
# Queue 0: Unlimited (default)
# Queue 1: Min 10M, Max 100M (VoIP/Management)
# Queue 2: Min 50M, Max 500M (Video)
# Queue 3: Max 100M (Best effort)
sudo ovs-vsctl set Port $PORT qos=@newqos \\
  -- --id=@newqos create qos type=linux-htb \\
     queues:0=@q0 queues:1=@q1 \\
     queues:2=@q2 queues:3=@q3 \\
  -- --id=@q0 create queue \\
     other-config:max-rate=1000000000 \\
  -- --id=@q1 create queue \\
     other-config:min-rate=10000000 \\
     other-config:max-rate=100000000 \\
  -- --id=@q2 create queue \\
     other-config:min-rate=50000000 \\
     other-config:max-rate=500000000 \\
  -- --id=@q3 create queue \\
     other-config:max-rate=100000000

echo "QoS queues created:"
sudo ovs-vsctl list qos
sudo ovs-vsctl list queue`},
      {title:"Test QoS với iperf", cmd:`# Chạy Ryu
ryu-manager ryu_qos.py --verbose &

# Mininet với 4 hosts
sudo mn --controller=remote \\
        --topo single,4 --mac \\
        --switch ovsk,protocols=OpenFlow13

# Setup queues
sudo bash setup_qos.sh

# Test: Gửi traffic VoIP (UDP 5060)
mininet> h3 iperf -s -u -p 5060 &
mininet> h1 iperf -c h3 -u -p 5060 -b 10M -t 10

# Test: Gửi HTTP traffic (TCP 80)
mininet> h4 python3 -m http.server 80 &
mininet> h2 curl http://10.0.0.4/

# Xem flow statistics
mininet> sh ovs-ofctl -O OpenFlow13 dump-flows s1
# Xem queue statistics
mininet> sh ovs-ofctl -O OpenFlow13 dump-ports s1`},
    ],
    expected:[
      "✅ Ryu start, QoS flows installed trên switch",
      "✅ dump-flows: thấy flows với priority cao cho VoIP",
      "✅ OVS queues được tạo (3 queues)",
      "✅ iperf VoIP: bandwidth đúng giới hạn queue 1",
      "✅ dump-ports: thống kê traffic theo port",
    ],
    advanced:`# NÂNG CAO: Dynamic QoS dựa trên bandwidth monitoring
class DynamicQoSController(QoSController):
    """QoS tự động điều chỉnh dựa trên congestion"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.stats = {}      # port → bytes_count
        self.THRESHOLD = 0.8 # 80% utilization → throttle

    @set_ev_cls(ofp_event.EventOFPPortStatsReply, MAIN_DISPATCHER)
    def port_stats_reply_handler(self, ev):
        dpid = ev.msg.datapath.id
        for stat in ev.msg.body:
            port = stat.port_no
            key  = (dpid, port)
            if key in self.stats:
                prev_bytes = self.stats[key]
                curr_bytes = stat.tx_bytes
                # Tính throughput (giả sử poll 5s)
                throughput = (curr_bytes - prev_bytes) * 8 / 5
                utilization = throughput / 1_000_000_000  # vs 1Gbps
                if utilization > self.THRESHOLD:
                    self.logger.warning(
                        f"Port {port} HIGH utilization: "
                        f"{utilization:.1%} — throttling BE traffic")
                    # Giảm bandwidth cho best-effort
            self.stats[key] = stat.tx_bytes`,
    troubleshoot:[
      "Queue creation error: kiểm tra kernel module kernel-htb đã load",
      "Flows không match: kiểm tra ip_proto value (UDP=17, TCP=6)",
      "iperf không đạt bandwidth mong muốn: kiểm tra queue min-rate/max-rate",
    ]
  },
  {
    id:"L8", num:"Lab 08", color:"#fbbf24",
    title:"SDN Security — Anomaly Detection & Mitigation",
    category:"Advanced SDN",
    duration:"180 phút", difficulty:3, prereq:"Lab 01-03",
    objective:"Xây dựng hệ thống phát hiện và mitigation DDoS/port scan bằng SDN controller, tự động block malicious flows.",
    theory:`► SDN SECURITY ADVANTAGES
Phát hiện tập trung: controller thấy toàn bộ traffic
Mitigation nhanh: cài drop rule trong milliseconds
Programmable: thay đổi policy không cần thiết bị mới

ATTACK TYPES PHÁT HIỆN:
  1. DDoS (packet flood): src gửi >X packets/s đến dst
  2. Port scan: 1 src kết nối đến nhiều dst ports
  3. MAC flooding: nhiều MAC mới/giây → fill CAM table
  4. ARP spoofing: nhiều ARP reply không được request`,
    install:[
      "# Không cần cài thêm — dùng Ryu + Mininet",
      "# Có thể cài hping3 để test attack",
      "sudo apt-get install -y hping3",
    ],
    steps:[
      {title:"Security Monitor Ryu App", cmd:`# File: security_monitor.py
from ryu.base import app_manager
from ryu.controller import ofp_event
from ryu.controller.handler import (CONFIG_DISPATCHER,
    MAIN_DISPATCHER, set_ev_cls)
from ryu.ofproto import ofproto_v1_3
from ryu.lib.packet import packet, ethernet, ipv4, tcp, ether_types
from ryu.lib import hub
from collections import defaultdict
import time, logging

LOG = logging.getLogger('SecurityMonitor')

class SecurityMonitor(app_manager.RyuApp):
    OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]

    # Thresholds
    DDOS_PPS_THRESHOLD  = 100  # packets/sec per flow
    SCAN_PORT_THRESHOLD = 15   # unique ports in 5s
    MAC_FLOOD_THRESHOLD = 20   # new MACs per 5s
    BLOCK_DURATION      = 60   # giây block IP

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Counters
        self.pkt_count   = defaultdict(list)
        # (src_ip) → [timestamps]
        self.port_scan   = defaultdict(set)
        # (src_ip) → {dst_ports}
        self.mac_count   = defaultdict(list)
        # dpid → [new_mac_timestamps]
        self.blocked_ips = {}
        # ip → unblock_time
        self.datapaths   = {}
        # dpid → datapath

        # Background thread kiểm tra theo chu kỳ
        self.monitor_thread = hub.spawn(self._monitor_loop)

    @set_ev_cls(ofp_event.EventOFPSwitchFeatures,
                CONFIG_DISPATCHER)
    def features_handler(self, ev):
        dp = ev.msg.datapath
        self.datapaths[dp.id] = dp
        # Table-miss
        parser  = dp.ofproto_parser
        match   = parser.OFPMatch()
        actions = [parser.OFPActionOutput(
            dp.ofproto.OFPP_CONTROLLER,
            dp.ofproto.OFPCML_NO_BUFFER)]
        inst = [parser.OFPInstructionActions(
            dp.ofproto.OFPIT_APPLY_ACTIONS, actions)]
        mod = parser.OFPFlowMod(datapath=dp, priority=0,
            match=match, instructions=inst)
        dp.send_msg(mod)
        LOG.info(f"Switch {dp.id} registered")

    @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
    def packet_in_handler(self, ev):
        msg     = ev.msg
        dp      = msg.datapath
        in_port = msg.match['in_port']
        pkt     = packet.Packet(msg.data)
        eth     = pkt.get_protocols(ethernet.ethernet)[0]

        if eth.ethertype == ether_types.ETH_TYPE_LLDP:
            return

        now = time.time()

        # === Phát hiện DDoS ===
        pkt_ip = pkt.get_protocols(ipv4.ipv4)
        if pkt_ip:
            src_ip = pkt_ip[0].src
            dst_ip = pkt_ip[0].dst

            # Đã bị block
            if src_ip in self.blocked_ips:
                if now < self.blocked_ips[src_ip]:
                    return  # Drop silently
                else:
                    del self.blocked_ips[src_ip]
                    LOG.info(f"Unblocked: {src_ip}")

            # Đếm packets theo flow
            flow_key = (src_ip, dst_ip)
            self.pkt_count[flow_key].append(now)
            # Xóa timestamps cũ (> 1s)
            self.pkt_count[flow_key] = [
                t for t in self.pkt_count[flow_key]
                if now - t < 1.0]
            pps = len(self.pkt_count[flow_key])

            if pps > self.DDOS_PPS_THRESHOLD:
                LOG.warning(
                    f"⚠ DDoS DETECTED: {src_ip} → {dst_ip} "
                    f"({pps} pps) — BLOCKING!")
                self._block_ip(dp, src_ip)
                return

            # === Phát hiện Port Scan ===
            pkt_tcp = pkt.get_protocols(tcp.tcp)
            if pkt_tcp and pkt_tcp[0].bits & 0x02:  # SYN flag
                dst_port = pkt_tcp[0].dst_port
                self.port_scan[src_ip].add(dst_port)
                if len(self.port_scan[src_ip]) > \\
                        self.SCAN_PORT_THRESHOLD:
                    LOG.warning(
                        f"⚠ PORT SCAN DETECTED: {src_ip} "
                        f"({len(self.port_scan[src_ip])} ports) "
                        f"— BLOCKING!")
                    self._block_ip(dp, src_ip)
                    return

        # Normal L2 learning + forwarding
        self._l2_forward(dp, msg, eth, in_port)

    def _block_ip(self, dp, src_ip):
        """Cài DROP rule cho IP nguồn"""
        self.blocked_ips[src_ip] = (time.time() +
                                     self.BLOCK_DURATION)
        parser = dp.ofproto_parser
        match  = parser.OFPMatch(
            eth_type=0x0800, ipv4_src=src_ip)
        # Drop: instructions rỗng
        mod = parser.OFPFlowMod(
            datapath=dp, priority=1000,
            hard_timeout=self.BLOCK_DURATION,
            match=match, instructions=[])
        dp.send_msg(mod)
        LOG.warning(
            f"BLOCKED: {src_ip} for {self.BLOCK_DURATION}s")

    def _l2_forward(self, dp, msg, eth, in_port):
        """L2 flooding đơn giản"""
        ofp     = dp.ofproto
        parser  = dp.ofproto_parser
        actions = [parser.OFPActionOutput(ofp.OFPP_FLOOD)]
        data    = msg.data if msg.buffer_id == \\
                  ofp.OFP_NO_BUFFER else None
        out = parser.OFPPacketOut(
            datapath=dp, buffer_id=msg.buffer_id,
            in_port=in_port, actions=actions, data=data)
        dp.send_msg(out)

    def _monitor_loop(self):
        """Background: log security status mỗi 10s"""
        while True:
            hub.sleep(10)
            now = time.time()
            # Reset scan counters cũ
            for src in list(self.port_scan.keys()):
                # Không reset nếu đang bị block
                if src not in self.blocked_ips:
                    self.port_scan[src].clear()
            if self.blocked_ips:
                active = {ip: int(t-now)
                          for ip,t in self.blocked_ips.items()
                          if t > now}
                LOG.info(f"Blocked IPs: {active}")`},
      {title:"Test Attack Simulation", cmd:`# Terminal 1: Chạy Security Monitor
ryu-manager security_monitor.py --verbose

# Terminal 2: Mininet
sudo mn --controller=remote \\
        --topo single,4 --mac \\
        --switch ovsk,protocols=OpenFlow13

# Terminal 3: Test thông thường
mininet> pingall
# → Tất cả kết nối bình thường

# Simulate DDoS: h1 → h2 (>100 pps)
mininet> h1 hping3 -S -p 80 --faster 10.0.0.2 &

# Quan sát log Ryu:
# ⚠ DDoS DETECTED: 10.0.0.1 → 10.0.0.2 (150 pps) — BLOCKING!
# BLOCKED: 10.0.0.1 for 60s

# Test: h1 không thể ping h2 nữa
mininet> h1 ping h2 -c 3
# → 100% packet loss (bị block)

# Test: h3 vẫn kết nối bình thường
mininet> h3 ping h2 -c 3
# → 0% packet loss

# Port scan simulation
mininet> h1 nmap -sS 10.0.0.2 -p 1-100 --max-rate 50

# Xem blocked flows
mininet> sh ovs-ofctl -O OpenFlow13 dump-flows s1 | grep priority=1000`},
    ],
    expected:[
      "✅ Normal traffic: pingall 100%",
      "✅ DDoS trigger: IP bị block trong <1s",
      "✅ Block rule hiện trong dump-flows priority=1000",
      "✅ Blocked host: 100% packet loss",
      "✅ Unblocked sau 60s: ping thành công lại",
      "✅ Port scan: phát hiện sau >15 ports",
      "✅ Log đầy đủ attacks với timestamp",
    ],
    advanced:`# NÂNG CAO: ML-based Anomaly Detection
from sklearn.ensemble import IsolationForest
import numpy as np

class MLSecurityMonitor(SecurityMonitor):
    """Dùng Isolation Forest để phát hiện anomaly"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.model    = IsolationForest(
            contamination=0.1, random_state=42)
        self.features = []   # [pps, unique_dsts, syn_ratio]
        self.trained  = False
        self.train_thread = hub.spawn(self._train_loop)

    def _extract_features(self, src_ip):
        """Extract features từ traffic statistics"""
        now = time.time()
        pps = len([t for t in self.pkt_count.get(
                   (src_ip,), []) if now-t < 5])
        ports = len(self.port_scan.get(src_ip, set()))
        return [pps, ports]

    def _train_loop(self):
        """Huấn luyện model sau khi có đủ dữ liệu"""
        hub.sleep(60)  # Đợi 60s lấy baseline data
        while True:
            if len(self.features) > 100:
                X = np.array(self.features[-500:])
                self.model.fit(X)
                self.trained = True
            hub.sleep(30)

    def _is_anomaly(self, features):
        if not self.trained:
            return False
        pred = self.model.predict([features])
        return pred[0] == -1  # -1 = anomaly`,
    troubleshoot:[
      "hping3 not found: sudo apt-get install hping3",
      "nmap not found: sudo apt-get install nmap",
      "DDoS không bị detect: giảm DDOS_PPS_THRESHOLD xuống 20",
      "Block không hoạt động: kiểm tra ip_proto match trong flow",
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════
// 20 THESIS TOPICS
// ═══════════════════════════════════════════════════════════════════
const THESIS = [
  // BASIC (1-5)
  {
    id:1, level:"basic", icon:"📦", color:"#38bdf8",
    title:"Network Inventory & Health Monitoring Tool",
    type:"Đồ án môn học", dur:"4-5 tuần", team:"2-3 SV",
    overview:`Xây dựng hệ thống tự động thu thập và giám sát sức khỏe thiết bị mạng doanh nghiệp qua REST API. 
Hệ thống cảnh báo real-time khi thiết bị down hoặc thay đổi trạng thái.`,
    background:`Trong môi trường mạng doanh nghiệp, việc theo dõi thủ công từng thiết bị là không khả thi khi quy mô lớn. 
APIC-EM cung cấp REST API cho phép tự động hóa quá trình này. Đề tài áp dụng SDN automation để xây dựng 
công cụ giám sát hoàn chỉnh.`,
    objectives:[
      "Xây dựng Python client kết nối APIC-EM REST API",
      "Thu thập đầy đủ thông tin: hostname, IP, platform, version, uptime, role",
      "Phát hiện thiết bị Unreachable và gửi cảnh báo",
      "Export báo cáo JSON, CSV, HTML tự động",
      "Scheduler tự động refresh dữ liệu mỗi N phút",
    ],
    scope:[
      "Python 3.x + requests + schedule",
      "Cisco APIC-EM REST API endpoints",
      "Authentication token management",
      "Multi-format report generation",
    ],
    tech:["Python 3","requests","json","csv","schedule","jinja2"],
    deliverables:[
      "Source code (≥200 dòng) + README.md",
      "requirements.txt",
      "Sample inventory reports (JSON/CSV/HTML)",
      "Báo cáo PDF 8-10 trang",
      "Slide thuyết trình 8-10 slide",
    ],
    evaluation:`Cài đặt & kết nối thành công: 30%
Tính năng inventory đầy đủ: 25%
Export 3 formats: 20%
Code quality + documentation: 15%
Thuyết trình: 10%`,
    extend:`Thêm email notification (smtplib)
Thêm dashboard web đơn giản (Flask)
So sánh trạng thái qua các lần poll`,
  },
  {
    id:2, level:"basic", icon:"🗺️", color:"#4ade80",
    title:"Network Topology Visualizer với Graph Analysis",
    type:"Đồ án môn học", dur:"4-5 tuần", team:"2-3 SV",
    overview:`Thu thập topology từ APIC-EM và vẽ sơ đồ mạng tương tác với networkx/matplotlib. 
Phân tích tính chất đồ thị: diameter, centrality, single points of failure.`,
    background:`Topology visualization giúp admin hiểu cấu trúc mạng trực quan. Graph theory cung cấp 
metrics quan trọng: degree centrality (node quan trọng nhất), betweenness centrality 
(link bottleneck), và articulation points (SPOF).`,
    objectives:[
      "Lấy topology từ APIC-EM /physical-topology",
      "Vẽ network graph với networkx + matplotlib",
      "Color-code theo device type và link status",
      "Tính toán: diameter, centrality, SPOF, bridges",
      "Phân tích redundancy path giữa 2 nodes bất kỳ",
    ],
    scope:[
      "REST API topology collection",
      "Graph theory analysis (networkx)",
      "Visualization (matplotlib)",
      "Redundancy & fault analysis",
    ],
    tech:["Python 3","networkx","matplotlib","requests","PIL"],
    deliverables:[
      "topology_analyzer.py + README",
      "topology.png (graph output)",
      "analysis_report.txt",
      "Báo cáo + Slide",
    ],
    evaluation:`Topology load đúng: 25%
Graph visualization rõ ràng: 30%
Analysis metrics chính xác: 25%
Code + documentation: 10%
Thuyết trình: 10%`,
    extend:`Thêm D3.js interactive topology (web)
Simulate link failure và re-analyze
Hiển thị bandwidth utilization qua màu sắc`,
  },
  {
    id:3, level:"basic", icon:"🔍", color:"#fb923c",
    title:"Automated Path Trace & Connectivity Tester",
    type:"Đồ án môn học", dur:"4-5 tuần", team:"2-3 SV",
    overview:`Công cụ tự động kiểm tra kết nối E2E giữa các cặp thiết bị qua APIC-EM Flow Analysis API. 
Batch test từ file CSV, tự động phát hiện điểm thất bại trong path.`,
    background:`Path trace trong SDN cho phép kiểm tra hop-by-hop đường đi của traffic, bao gồm cả 
phân tích ACL và QoS policies. Đây là công cụ troubleshooting quan trọng thay thế 
traceroute truyền thống.`,
    objectives:[
      "Implement path trace via /api/v1/flow-analysis",
      "Hiển thị chi tiết từng hop: device, in/out port, IP",
      "Phát hiện ACL block trong path",
      "Batch test nhiều cặp từ file CSV",
      "Báo cáo HTML với trạng thái pass/fail",
    ],
    scope:[
      "APIC-EM flow-analysis API",
      "Polling mechanism với timeout",
      "Batch processing từ CSV",
      "HTML report generation",
    ],
    tech:["Python 3","requests","csv","json","jinja2"],
    deliverables:[
      "path_tracer.py + README",
      "pairs_input.csv (mẫu)",
      "path_report.html",
      "Báo cáo + Slide",
    ],
    evaluation:`Path trace đúng: 30%
Batch từ CSV: 25%
Hiển thị hops rõ: 20%
HTML report: 15%
Thuyết trình: 10%`,
    extend:`Thêm concurrent batch trace (threading)
Phân tích common failure points
So sánh actual path vs expected path`,
  },
  {
    id:4, level:"basic", icon:"🐍", color:"#a78bfa",
    title:"Python Network Automation Toolkit",
    type:"Đồ án môn học", dur:"4-5 tuần", team:"2-3 SV",
    overview:`Bộ công cụ Python tổng hợp để quản lý thiết bị mạng: kết hợp APIC-EM REST API 
cho topology/inventory và Netmiko SSH cho config push. CLI menu thân thiện.`,
    background:`Network engineer hiện đại cần nắm vững cả REST API (cho SDN controllers) và 
SSH automation (Netmiko cho thiết bị legacy). Đề tài kết hợp cả hai để tạo 
toolkit thực tế.`,
    objectives:[
      "APIC-EM module: discovery, inventory, topology",
      "Netmiko module: SSH connect, show commands, config push",
      "Verify module: kiểm tra config sau khi push",
      "CLI menu interactive tích hợp",
      "Logging đầy đủ với log file",
    ],
    scope:[
      "APIC-EM REST API",
      "Netmiko SSH automation",
      "Config verification",
      "CLI interface",
    ],
    tech:["Python 3","requests","netmiko","pyyaml","logging"],
    deliverables:["toolkit/ (package)","main.py (CLI)","config.yaml","Báo cáo + Slide"],
    evaluation:`APIC-EM module: 25%
Netmiko module: 25%
CLI integration: 20%
Code quality: 20%
Thuyết trình: 10%`,
    extend:`Thêm Ansible playbook integration
REST API wrapper module cho thiết bị non-Cisco
Thêm configuration compliance checker`,
  },
  {
    id:5, level:"basic", icon:"📊", color:"#fbbf24",
    title:"SDN Network Performance Dashboard (Flask)",
    type:"Đồ án môn học", dur:"5-6 tuần", team:"2-4 SV",
    overview:`Web dashboard Flask hiển thị KPIs mạng real-time: số thiết bị, trạng thái kết nối, 
topology overview. Auto-refresh mỗi 30 giây, lưu history SQLite.`,
    background:`Network Operation Center (NOC) cần dashboard trực quan để giám sát mạng. 
Flask + REST API + Chart.js tạo nền tảng web nhẹ mà không cần 
infrastructure phức tạp.`,
    objectives:[
      "Flask backend với REST endpoints /api/devices, /api/stats",
      "Frontend HTML+JS với auto-refresh",
      "Chart.js hiển thị device status trend",
      "SQLite lưu history theo thời gian",
      "Alert khi device down",
    ],
    scope:[
      "Flask web framework",
      "APIC-EM data collection",
      "SQLite database",
      "Chart.js visualization",
    ],
    tech:["Flask","SQLite","Chart.js","requests","APScheduler"],
    deliverables:["app.py","templates/","static/","db/","Báo cáo + Slide"],
    evaluation:`Flask app chạy: 25%
Dashboard UI: 25%
Charts & history: 25%
Alert system: 15%
Thuyết trình: 10%`,
    extend:`Thêm authentication (Flask-Login)
Thêm Cytoscape.js topology visualization
Push notification (WebSocket)`,
  },
  // MEDIUM (6-12)
  {
    id:6, level:"medium", icon:"🤖", color:"#38bdf8",
    title:"Intent-Based Network Configuration với YAML",
    type:"Đồ án chuyên ngành", dur:"6-8 tuần", team:"2-4 SV",
    overview:`Hệ thống "Intent-to-Config": admin khai báo policy mạng bằng YAML đơn giản, 
engine dịch sang Cisco IOS commands và push qua Netmiko với verify và rollback tự động.`,
    background:`Intent-Based Networking (IBN) là xu hướng quan trọng trong SDN, được Cisco DNA Center 
implement. Đề tài xây dựng phiên bản đơn giản với Python: YAML intent 
→ Jinja2 template → IOS commands → Netmiko push.`,
    objectives:[
      "Thiết kế YAML intent schema cho VLAN, ACL, QoS, routing",
      "Jinja2 template engine dịch intent → IOS commands",
      "Netmiko push config với retry mechanism",
      "Verify: parse show commands, so sánh với intent",
      "Rollback tự động khi verify fail",
      "Audit log toàn bộ thay đổi với timestamp",
    ],
    scope:[
      "YAML schema design",
      "Jinja2 templating",
      "Netmiko config push",
      "Verification & rollback",
    ],
    tech:["PyYAML","Jinja2","Netmiko","textfsm","logging","Git"],
    deliverables:[
      "intent_engine/ (package)",
      "intents/ (YAML examples)",
      "templates/ (Jinja2 IOS templates)",
      "audit.log",
      "Báo cáo 12-15 trang + Slide",
    ],
    evaluation:`YAML schema hợp lý: 15%
Jinja2 template đúng: 25%
Push + verify: 30%
Rollback: 15%
Code quality: 5%
Thuyết trình: 10%`,
    extend:`Thêm diff: hiển thị config changes trước khi apply
Thêm approval workflow (dry-run mode)
Support nhiều vendor: Juniper, Arista`,
  },
  {
    id:7, level:"medium", icon:"🛡️", color:"#f472b6",
    title:"SDN-based DDoS Detection & Mitigation System",
    type:"Đồ án chuyên ngành / NCKH", dur:"7-9 tuần", team:"3-5 SV",
    overview:`Hệ thống phát hiện và tự động ngăn chặn DDoS attacks bằng Ryu SDN controller. 
Sử dụng thống kê traffic flow để detect anomaly và cài drop rules trong microseconds.`,
    background:`DDoS attacks gây thiệt hại nghiêm trọng cho doanh nghiệp. SDN cho phép phản ứng 
nhanh hơn nhiều so với mạng truyền thống: controller thấy toàn bộ traffic, 
cài drop rule ngay lập tức tại nhiều switch đồng thời.

Đề tài implement: threshold-based detection + ML-based anomaly detection (Isolation Forest), 
so sánh hiệu quả giữa hai phương pháp.`,
    objectives:[
      "Ryu app thu thập flow statistics định kỳ",
      "Threshold-based DDoS detection (PPS, bandwidth)",
      "Port scan detection (unique dst ports)",
      "ML-based anomaly detection (Isolation Forest / LOF)",
      "Automatic mitigation: cài drop rules",
      "Visualization: attack timeline, blocked IPs",
      "Performance evaluation: detection rate, false positive",
    ],
    scope:[
      "Ryu SDN controller",
      "OpenFlow flow statistics",
      "Statistical + ML detection",
      "Mininet attack simulation",
    ],
    tech:["Ryu","Mininet","scikit-learn","numpy","pandas","matplotlib"],
    deliverables:[
      "security_monitor.py",
      "ml_detector.py",
      "attack_simulator.py",
      "evaluation_results/",
      "Báo cáo 15-20 trang + Slide",
    ],
    evaluation:`Detection accuracy (>90%): 30%
False positive rate (<5%): 20%
Mitigation speed: 20%
ML vs threshold comparison: 15%
Thuyết trình: 15%`,
    extend:`Thêm Entropy-based detection
Real-time dashboard với blocked IP list
Integration với SIEM (Splunk/ELK)`,
  },
  {
    id:8, level:"medium", icon:"⚡", color:"#34d399",
    title:"SDN-based Load Balancer với Traffic Engineering",
    type:"Đồ án chuyên ngành / NCKH", dur:"6-8 tuần", team:"3-4 SV",
    overview:`Xây dựng load balancer L3/L4 bằng SDN controller (Ryu). Controller thu thập 
bandwidth utilization của các paths, tự động phân phối traffic để tránh congestion.`,
    background:`Load balancing trong SDN hiệu quả hơn hardware LB truyền thống vì:
- Controller thấy toàn bộ network state
- Cài đặt rules trên nhiều switches đồng thời
- Thay đổi policy không cần reboot

Đề tài implement: Round-Robin, Least-Connection, và ECMP (Equal-Cost Multi-Path).`,
    objectives:[
      "Ryu app với traffic engineering capabilities",
      "Thu thập port statistics (bandwidth utilization)",
      "Implement Round-Robin load balancing",
      "Implement Least-Connection algorithm",
      "Implement ECMP với weighted paths",
      "So sánh throughput và latency giữa các algorithms",
      "Mininet benchmark với iperf",
    ],
    scope:[
      "Ryu controller",
      "OpenFlow port statistics",
      "Multiple LB algorithms",
      "Mininet performance testing",
    ],
    tech:["Ryu","Mininet","iperf","matplotlib","numpy"],
    deliverables:[
      "load_balancer.py (3 algorithms)",
      "benchmark_results/",
      "performance_charts.png",
      "Báo cáo + Slide",
    ],
    evaluation:`3 LB algorithms hoạt động: 35%
Performance benchmarks đầy đủ: 30%
So sánh algorithms có graph: 20%
Thuyết trình: 15%`,
    extend:`Thêm content-aware LB (Layer 7)",
Integrate với health check",
Adaptive LB dựa trên latency measurements`,
  },
  {
    id:9, level:"medium", icon:"📡", color:"#c084fc",
    title:"Software-Defined WAN (SD-WAN) Simulation",
    type:"Đồ án chuyên ngành / NCKH", dur:"7-9 tuần", team:"3-5 SV",
    overview:`Mô phỏng SD-WAN trên Mininet: nhiều sites kết nối qua WAN links với bandwidth khác nhau. 
Controller tự động chọn đường tốt nhất dựa trên policy (latency/cost/bandwidth).`,
    background:`SD-WAN thay thế MPLS truyền thống, cho phép doanh nghiệp sử dụng đa kết nối 
(broadband, 4G, MPLS) với cost thấp hơn. Controller đưa ra quyết định 
routing dựa trên application policy.`,
    objectives:[
      "Xây dựng multi-site topology (3+ sites) trên Mininet",
      "Simulate WAN links với TC (traffic control): delay, bandwidth, loss",
      "Ryu controller thu thập link metrics (latency, loss, bandwidth)",
      "Policy engine: VoIP → low latency path, bulk data → high BW path",
      "Automatic failover khi link down",
      "So sánh: SD-WAN vs traditional routing (OSPF)",
    ],
    scope:[
      "Multi-site Mininet topology",
      "TC (netem) link simulation",
      "Ryu policy-based routing",
      "Failover mechanisms",
    ],
    tech:["Ryu","Mininet","tc/netem","scapy","iperf","gnuplot"],
    deliverables:[
      "sdwan_controller.py",
      "topology/multi_site.py",
      "policy.yaml",
      "benchmark/",
      "Báo cáo 15-20 trang + Slide",
    ],
    evaluation:`Multi-site topology hoạt động: 25%
Policy-based routing đúng: 30%
Failover <5s: 20%
Benchmark vs OSPF: 15%
Thuyết trình: 10%`,
    extend:`Thêm Application-Aware routing (Layer 7)
Integrate VoIP (SIP) để test real-time
Zero-touch provisioning cho new site`,
  },
  {
    id:10, level:"medium", icon:"🔐", color:"#ef4444",
    title:"Zero-Trust Network Access với SDN",
    type:"Đồ án chuyên ngành / NCKH", dur:"7-9 tuần", team:"3-5 SV",
    overview:`Implement Zero-Trust principles bằng SDN: default-deny all, dynamic access control 
dựa trên identity + context. Micro-segmentation ngăn lateral movement.`,
    background:`Zero-Trust ("Never trust, always verify") là model bảo mật hiện đại thay thế 
perimeter-based security. SDN là platform lý tưởng để implement ZT vì 
khả năng cài drop rules nhanh và tập trung.`,
    objectives:[
      "Default-deny policy: block tất cả traffic ban đầu",
      "Authentication service: user đăng nhập → nhận session token",
      "Controller xác thực token và cài allow rules per-session",
      "Micro-segmentation: isolate các network segments",
      "Session timeout: tự động revoke access sau N phút",
      "Audit log: mọi access attempt được ghi lại",
    ],
    scope:[
      "Ryu controller với policy engine",
      "Simple auth service (Flask)",
      "Dynamic flow rule management",
      "Micro-segmentation",
    ],
    tech:["Ryu","Mininet","Flask","JWT","SQLite","logging"],
    deliverables:[
      "zt_controller.py",
      "auth_service.py",
      "policy_manager.py",
      "Báo cáo + Slide",
    ],
    evaluation:`Default-deny hoạt động: 25%
Auth flow thành công: 30%
Micro-segmentation đúng: 25%
Audit log đầy đủ: 10%
Thuyết trình: 10%`,
    extend:`Thêm device posture check (OS, patch level)
Multi-factor authentication
Integration với LDAP/Active Directory`,
  },
  {
    id:11, level:"medium", icon:"🌍", color:"#06b6d4",
    title:"IPv6 Transition Automation với SDN",
    type:"Đồ án chuyên ngành", dur:"6-8 tuần", team:"2-4 SV",
    overview:`Tự động hóa quá trình chuyển đổi từ IPv4 sang IPv6 bằng Python và Netmiko. 
Cấu hình Dual-Stack, 6to4 tunneling, và verify connectivity sau migration.`,
    background:`Hết địa chỉ IPv4 buộc mạng doanh nghiệp chuyển sang IPv6. Quá trình này 
phức tạp với hàng trăm thiết bị. Automation bằng Python giảm thiểu 
lỗi và thời gian migration.`,
    objectives:[
      "Script đánh giá hiện trạng IPv4 (inventory)",
      "Generate Jinja2 config cho Dual-Stack trên mỗi thiết bị",
      "Push và verify IPv6 configuration",
      "Configure và test 6to4/6in4 tunneling",
      "OSPFv3 configuration automation",
      "Connectivity test: IPv4 vs IPv6",
    ],
    scope:[
      "IPv6 Dual-Stack configuration",
      "6to4 tunneling",
      "OSPFv3 automation",
      "Netmiko + Jinja2",
    ],
    tech:["Netmiko","Jinja2","PyYAML","ipaddress","requests"],
    deliverables:[
      "ipv6_migrator.py",
      "templates/ipv6_dualstack.j2",
      "migration_report.html",
      "Báo cáo + Slide",
    ],
    evaluation:`IPv4 inventory đúng: 20%
Dual-Stack config đúng: 30%
Verify connectivity: 25%
6to4 tunnel: 15%
Thuyết trình: 10%`,
    extend:`NAT64/DNS64 automation
IPv6 address planning tool (subnetting calculator)
SLAAC vs DHCPv6 comparison`,
  },
  {
    id:12, level:"medium", icon:"📈", color:"#f59e0b",
    title:"Network Telemetry & Analytics Platform",
    type:"Đồ án chuyên ngành / NCKH", dur:"7-9 tuần", team:"3-5 SV",
    overview:`Nền tảng thu thập telemetry (SNMP, NetFlow, sFlow) từ thiết bị mạng, lưu vào 
InfluxDB, visualize với Grafana. Phát hiện bất thường với statistical methods.`,
    background:`Traditional monitoring (SNMP polling) có độ trễ cao. Model-driven telemetry 
(MDT) và streaming đang thay thế. Đề tài kết hợp SNMP (baseline) 
với Python analytics để phát hiện anomalies.`,
    objectives:[
      "SNMP collector với pysnmp (bandwidth, CPU, memory)",
      "NetFlow collector (nfcapd) hoặc sFlow analyzer",
      "Time-series storage với InfluxDB hoặc SQLite",
      "Grafana dashboard (hoặc matplotlib charts)",
      "Anomaly detection: Z-score, moving average",
      "Alert khi KPI vượt ngưỡng",
    ],
    scope:[
      "SNMP polling (pysnmp)",
      "Time-series data storage",
      "Statistical anomaly detection",
      "Visualization (Grafana/matplotlib)",
    ],
    tech:["pysnmp","influxdb-client","pandas","numpy","matplotlib","scipy"],
    deliverables:[
      "telemetry_collector.py",
      "analytics_engine.py",
      "dashboards/",
      "Báo cáo + Slide",
    ],
    evaluation:`SNMP collection đúng: 25%
Time-series storage: 20%
Anomaly detection: 30%
Visualization: 15%
Thuyết trình: 10%`,
    extend:`Thêm streaming telemetry (gRPC/YANG)",
Predict capacity thresold (ML regression)",
Multi-vendor support (Juniper, Arista)`,
  },
  // ADVANCED (13-20)
  {
    id:13, level:"advanced", icon:"🧠", color:"#38bdf8",
    title:"AI-Driven Network Anomaly Detection",
    type:"NCKH / Đồ án tốt nghiệp", dur:"10-14 tuần", team:"3-5 SV",
    overview:`Nghiên cứu và triển khai hệ thống phát hiện bất thường mạng dùng Deep Learning 
(LSTM Autoencoder). Huấn luyện trên traffic bình thường, detect anomalies dựa 
trên reconstruction error. Dataset: CICIDS2017 hoặc tự thu thập từ Mininet.`,
    background:`Machine learning đã được áp dụng rộng rãi trong network security. LSTM Autoencoder 
đặc biệt phù hợp cho time-series network traffic vì khả năng học temporal patterns. 
Đề tài so sánh: thống kê truyền thống vs ML vs Deep Learning.

Tài liệu tham khảo:
- "Network Intrusion Detection using Deep Learning" (IEEE 2020)
- CICIDS2017 dataset: UNB Canadian Institute for Cybersecurity`,
    objectives:[
      "Thu thập và tiền xử lý network traffic data",
      "Feature engineering: 15+ features từ flow statistics",
      "Train LSTM Autoencoder trên traffic bình thường",
      "Detect anomalies bằng reconstruction threshold",
      "So sánh với: Isolation Forest, LOF, One-Class SVM",
      "Evaluate: precision, recall, F1-score, ROC-AUC",
      "Deploy real-time detector tích hợp với Ryu",
    ],
    scope:[
      "Deep Learning (LSTM/Autoencoder)",
      "Network traffic feature extraction",
      "Model evaluation & comparison",
      "Real-time Ryu integration",
    ],
    tech:["TensorFlow/Keras","scikit-learn","pandas","numpy","scapy","Ryu","Mininet"],
    deliverables:[
      "data_collector.py",
      "feature_engineer.py",
      "lstm_autoencoder.py",
      "comparative_study.ipynb",
      "realtime_detector.py",
      "Báo cáo NCKH 20-30 trang + IEEE paper draft",
    ],
    evaluation:`Data collection & feature eng: 20%
LSTM model accuracy (>92%): 25%
Comparative study: 25%
Real-time integration: 15%
Báo cáo NCKH chất lượng: 15%`,
    extend:`Transfer learning từ pre-trained models
Federated learning (privacy-preserving)
Explainability: SHAP/LIME cho model decisions`,
  },
  {
    id:14, level:"advanced", icon:"🏗️", color:"#4ade80",
    title:"Multi-Controller SDN với ONOS Cluster",
    type:"NCKH / Đồ án tốt nghiệp", dur:"10-14 tuần", team:"3-5 SV",
    overview:`Nghiên cứu tính scalability và fault-tolerance của SDN multi-controller. 
Deploy ONOS cluster 3 nodes, đo hiệu suất và so sánh với single-controller Ryu. 
Implement consensus mechanism và controller failover.`,
    background:`SDN controller là single point of failure trong mạng lớn. ONOS giải quyết 
bằng distributed controller cluster với Raft consensus protocol. 
Đề tài so sánh: Ryu (single) vs ONOS (clustered) về latency, throughput, 
failover time.`,
    objectives:[
      "Deploy ONOS cluster 3 nodes (Docker/VMs)",
      "Cấu hình Mininet large-scale topology (50+ switches)",
      "Benchmark: throughput, latency, controller failover time",
      "Implement custom ONOS application (Java)",
      "Stress test với controller failover",
      "So sánh định lượng với Ryu single-controller",
    ],
    scope:[
      "ONOS SDN controller cluster",
      "Raft consensus protocol",
      "Large-scale Mininet topology",
      "Performance benchmarking",
    ],
    tech:["ONOS","Docker","Mininet","Java","Python","JMeter"],
    deliverables:[
      "onos_cluster_setup/",
      "custom_onos_app/ (Java)",
      "benchmark_results/",
      "comparison_report.pdf",
      "Báo cáo NCKH 25-35 trang",
    ],
    evaluation:`ONOS cluster hoạt động: 20%
Custom app: 20%
Benchmark methodology: 25%
Failover đo đúng: 20%
Báo cáo NCKH: 15%`,
    extend:`Integrate với OpenStack (cloud-native SDN)
Eastbound API: controller-to-controller
Deploy trên physical hardware (Raspberry Pi)`,
  },
  {
    id:15, level:"advanced", icon:"🌐", color:"#fb923c",
    title:"5G Network Slicing Simulation với SDN",
    type:"NCKH / Đồ án tốt nghiệp", dur:"12-16 tuần", team:"3-5 SV",
    overview:`Nghiên cứu Network Slicing trong 5G Core Network. Mô phỏng 3 slices trên nền 
SDN/NFV: eMBB (enhanced Mobile Broadband), URLLC (Ultra-Reliable Low Latency), 
mMTC (massive Machine Type Communications). Implement isolation và resource allocation.`,
    background:`5G Network Slicing cho phép tạo nhiều "virtual networks" trên cùng infrastructure, 
mỗi slice có SLA riêng. SDN/NFV là enabling technology. 

Tài liệu:
- 3GPP TS 23.501 (5G System Architecture)
- "Network Slicing in 5G" IEEE Communications Magazine`,
    objectives:[
      "Nghiên cứu 5G core architecture (AMF, SMF, UPF)",
      "Thiết kế 3 network slices với QoS requirements khác nhau",
      "Implement slice isolation bằng OpenFlow (VLAN/VNI)",
      "Resource allocation: bandwidth guarantees per slice",
      "Slice lifecycle management: create, modify, delete",
      "SLA monitoring và violation detection",
      "So sánh performance với non-sliced network",
    ],
    scope:[
      "5G Network Slicing concepts",
      "SDN-based slice management",
      "OpenFlow isolation mechanisms",
      "QoS per-slice enforcement",
    ],
    tech:["Ryu","Mininet","Open5GS","Docker","UERANSIM","InfluxDB"],
    deliverables:[
      "slice_manager.py",
      "qos_enforcer.py",
      "sla_monitor.py",
      "performance_evaluation/",
      "Báo cáo NCKH 30-40 trang + IEEE paper",
    ],
    evaluation:`Slice architecture design: 20%
Isolation mechanism: 25%
QoS enforcement: 25%
SLA monitoring: 15%
Báo cáo NCKH + paper draft: 15%`,
    extend:`Integrate với Open5GS (real 5G core)
Dynamic slice creation via REST API
AI-driven slice resource optimization`,
  },
  {
    id:16, level:"advanced", icon:"☁️", color:"#c084fc",
    title:"Cloud-Native SDN với Kubernetes & Cilium",
    type:"NCKH / Đồ án tốt nghiệp", dur:"12-16 tuần", team:"3-5 SV",
    overview:`Nghiên cứu Container Network Interface (CNI) trong Kubernetes với Cilium (eBPF-based). 
So sánh hiệu suất Cilium vs Flannel vs Calico. Implement Network Policies và 
service mesh (Istio) trên Kubernetes cluster.`,
    background:`Cloud-native networking đang thay thế SDN truyền thống trong môi trường containers. 
eBPF cho phép Cilium thực hiện networking logic trong Linux kernel, 
đạt hiệu suất cao hơn nhiều so với iptables-based solutions.`,
    objectives:[
      "Deploy Kubernetes cluster (kubeadm hoặc k3s)",
      "Cài đặt và cấu hình Cilium CNI",
      "Implement Kubernetes Network Policies",
      "Benchmark: Cilium vs Flannel (throughput, latency)",
      "Triển khai Istio service mesh",
      "mTLS giữa services, traffic management (canary, A/B)",
    ],
    scope:[
      "Kubernetes networking",
      "eBPF/Cilium CNI",
      "Network Policies",
      "Istio service mesh",
    ],
    tech:["Kubernetes","Cilium","Istio","Helm","eBPF","Prometheus","Grafana"],
    deliverables:[
      "k8s_setup/",
      "network_policies/",
      "istio_configs/",
      "benchmark_results/",
      "Báo cáo NCKH 30-40 trang",
    ],
    evaluation:`K8s + Cilium deploy: 20%
Network Policies đúng: 25%
Benchmark methodology: 25%
Istio service mesh: 15%
Báo cáo NCKH: 15%`,
    extend:`Thêm Hubble observability (Cilium)",
Multi-cluster service mesh (Cilium Cluster Mesh)",
eBPF custom program cho custom networking logic`,
  },
  {
    id:17, level:"advanced", icon:"🔄", color:"#f472b6",
    title:"Autonomous Network Healing với Reinforcement Learning",
    type:"NCKH / Đồ án tốt nghiệp", dur:"14-18 tuần", team:"3-5 SV",
    overview:`Hệ thống tự phục hồi mạng dùng Reinforcement Learning (DQN/PPO). Agent học cách 
xử lý các sự cố mạng (link failure, congestion, attack) để maximize uptime và QoS.`,
    background:`Self-healing networks là tầm nhìn của intent-based networking. RL agent nhận 
state (network metrics), chọn action (reroute, block, throttle), 
nhận reward (network health score). Đây là ứng dụng tiên tiến của AI+SDN.

Tài liệu:
- "Deep Reinforcement Learning for Network Slice Management" (IEEE JSAC)
- OpenAI Gym for network environments`,
    objectives:[
      "Xây dựng Gym environment cho Mininet network",
      "State space: link utilization, packet loss, latency, topology",
      "Action space: reroute flow, block IP, adjust QoS, load balance",
      "Reward function: weighted sum của network KPIs",
      "Train DQN agent trên simulated failures",
      "Evaluate: convergence, mean time to recover (MTTR)",
      "So sánh với rule-based vs random policies",
    ],
    scope:[
      "Reinforcement Learning (DQN/PPO)",
      "Custom Gym environment",
      "Ryu-based network simulator",
      "Policy evaluation methodology",
    ],
    tech:["stable-baselines3","gymnasium","PyTorch","Ryu","Mininet","pandas"],
    deliverables:[
      "network_env.py (Gym env)",
      "rl_agent.py (DQN/PPO)",
      "train.py + eval.py",
      "results/",
      "Báo cáo NCKH 35-50 trang + paper submission",
    ],
    evaluation:`Gym env hoạt động: 20%
RL training convergence: 25%
MTTR vs baseline: 25%
Comparison study: 15%
Báo cáo NCKH + paper: 15%`,
    extend:`Multi-agent RL (MARL) cho distributed controllers
Transfer learning: train on sim, deploy on real
Explainable AI: visualize agent decisions`,
  },
  {
    id:18, level:"advanced", icon:"🔗", color:"#34d399",
    title:"Blockchain-based SDN Controller Authentication",
    type:"NCKH / Đồ án tốt nghiệp", dur:"12-16 tuần", team:"3-5 SV",
    overview:`Nghiên cứu tích hợp Blockchain vào SDN để bảo mật communication giữa controllers 
và switches. Distributed trust model thay thế centralized CA. 
Smart contracts quản lý device identity và access policy.`,
    background:`Centralized SDN controller là attack target. Blockchain cung cấp 
decentralized trust mà không cần CA. Hyperledger Fabric phù hợp cho 
enterprise network (permissioned blockchain).

Tài liệu:
- "Blockchain-based SDN Security Framework" (IEEE TrustCom)`,
    objectives:[
      "Deploy Hyperledger Fabric network (3 peers)",
      "Smart contract: device registration, policy management",
      "Ryu controller authenticate với blockchain",
      "Switch identity verification qua blockchain",
      "Revoke compromised controller/switch",
      "Performance: overhead của blockchain authentication",
    ],
    scope:[
      "Hyperledger Fabric blockchain",
      "Smart contracts (chaincode)",
      "Ryu-blockchain integration",
      "Security analysis",
    ],
    tech:["Hyperledger Fabric","Node.js","Python","Ryu","Mininet","Docker"],
    deliverables:[
      "fabric_network/",
      "chaincode/ (smart contracts)",
      "ryu_blockchain_app.py",
      "security_analysis.pdf",
      "Báo cáo NCKH 30-40 trang",
    ],
    evaluation:`Fabric network deploy: 20%
Smart contract đúng: 25%
Ryu integration: 25%
Performance overhead phân tích: 15%
Báo cáo NCKH: 15%`,
    extend:`NFT-based network device certificates
Cross-domain controller federation
Quantum-resistant cryptography`,
  },
  {
    id:19, level:"advanced", icon:"🏭", color:"#a78bfa",
    title:"Industrial IoT Network Management với SDN",
    type:"NCKH / Đồ án tốt nghiệp", dur:"12-16 tuần", team:"3-5 SV",
    overview:`Quản lý mạng IIoT (Industrial IoT) bằng SDN: phân tách OT/IT networks, 
QoS cho real-time control traffic (PROFINET, Modbus), anomaly detection 
cho ICS/SCADA attacks (Stuxnet-type).`,
    background:`Convergence IT/OT tạo ra attack surface mới (Stuxnet, Triton). 
SDN có thể isolate OT networks, monitor traffic bất thường, 
và enforce strict access control. Purdue Model reference architecture.`,
    objectives:[
      "Thiết kế IIoT network với Purdue Model (Level 0-5)",
      "SDN-based IT/OT segmentation (micro-segmentation)",
      "QoS cho real-time PROFINET/Modbus traffic (<1ms jitter)",
      "Anomaly detection: thiết bị ICS bị compromise",
      "Simulate Modbus/DNP3 traffic với Python",
      "Incident response: automatic isolation",
    ],
    scope:[
      "ICS/SCADA network protocols",
      "Purdue Model segmentation",
      "Real-time QoS",
      "OT anomaly detection",
    ],
    tech:["Ryu","Mininet","pymodbus","scapy","pandas","scikit-learn"],
    deliverables:[
      "iot_network_manager.py",
      "ot_anomaly_detector.py",
      "ics_traffic_simulator.py",
      "Báo cáo NCKH 30-40 trang",
    ],
    evaluation:`IT/OT segmentation: 25%
Real-time QoS: 25%
Anomaly detection: 30%
Incident response: 10%
Báo cáo: 10%`,
    extend:`Integrate với IDS (Snort/Suricata)
NERC CIP compliance checking
Digital twin simulation`,
  },
  {
    id:20, level:"advanced", icon:"🚀", color:"#ef4444",
    title:"Autonomous SDN for Edge Computing (MEC)",
    type:"NCKH / Đồ án tốt nghiệp", dur:"14-18 tuần", team:"3-5 SV",
    overview:`Nghiên cứu SDN cho Mobile Edge Computing: tự động offload computation từ thiết bị 
đầu cuối đến edge servers dựa trên network state và latency SLA. 
Multi-access Edge Computing (MEC) theo chuẩn ETSI.`,
    background:`MEC (Mobile Edge Computing) đưa cloud resources về gần người dùng hơn, 
giảm latency cho AR/VR, autonomous vehicles, Industry 4.0. 
SDN cho phép dynamic routing để đảm bảo SLA latency.

Tài liệu:
- ETSI MEC 003: Framework and Reference Architecture
- "SDN-enabled MEC for 5G Networks" IEEE Network`,
    objectives:[
      "Deploy MEC simulation (OpenStack hoặc Docker-based)",
      "SDN controller quản lý edge-cloud network",
      "Offloading decision engine: latency + energy + cost",
      "Dynamic flow routing dựa trên real-time latency probe",
      "SLA enforcement: guarantee latency < threshold",
      "Benchmark: offload vs local computation",
      "Machine learning cho offloading prediction",
    ],
    scope:[
      "MEC architecture (ETSI)",
      "SDN-based dynamic routing",
      "Task offloading algorithms",
      "Latency-aware scheduling",
    ],
    tech:["Ryu","Mininet","Docker","OpenStack","Python","TensorFlow"],
    deliverables:[
      "mec_orchestrator.py",
      "offload_decision_engine.py",
      "latency_monitor.py",
      "evaluation/",
      "Báo cáo NCKH 40-50 trang + IEEE paper",
    ],
    evaluation:`MEC architecture: 20%
Offloading algorithm: 30%
SLA enforcement: 25%
ML-based prediction: 10%
Báo cáo NCKH + paper: 15%`,
    extend:`Federated learning at edge
Energy harvesting integration
Digital twin for MEC optimization`,
  },
];

// ═══════════════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════════════
const C = "#020d18";
const TABS_S = {display:"flex",gap:4,marginBottom:0,overflowX:"auto",paddingBottom:0};

function Pill({label,active,color,onClick}){
  return(
    <button onClick={onClick} style={{
      padding:"5px 12px",borderRadius:20,border:`1px solid ${active?color:"#1a3a5a"}`,
      background:active?`${color}18`:"transparent",color:active?color:"#4a7a9a",
      fontSize:11,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",
      letterSpacing:1,whiteSpace:"nowrap",transition:"all 0.2s"
    }}>{label}</button>
  );
}

function Code({children,color="#00e5aa"}){
  const [cp,setCp]=useState(false);
  return(
    <div style={{position:"relative",margin:"10px 0"}}>
      <button onClick={()=>{navigator.clipboard?.writeText(children);setCp(true);setTimeout(()=>setCp(false),1500);}}
        style={{position:"absolute",top:8,right:8,background:"#0a2030",border:"1px solid #1a3050",
          borderRadius:4,color:"#4a8a9a",fontSize:10,padding:"2px 8px",cursor:"pointer",zIndex:2}}>
        {cp?"✓":"Copy"}
      </button>
      <pre style={{background:"#010810",border:"1px solid #0a2030",borderRadius:8,padding:"14px 12px",
        overflowX:"auto",fontSize:11.5,lineHeight:1.75,color:"#a0d8b0",
        fontFamily:"'JetBrains Mono','Courier New',monospace",margin:0,paddingRight:60}}>
        {children}
      </pre>
    </div>
  );
}

function DiffBadge({d}){
  const labels=["","●○○ Cơ bản","●●○ Trung bình","●●● Nâng cao"];
  const colors=["","#4ade80","#fbbf24","#ef4444"];
  return <span style={{fontSize:10,color:colors[d]}}>{labels[d]}</span>;
}

function LabCard({lab}){
  const [tab,setTab]=useState("install");
  const [stepOpen,setStepOpen]=useState(null);
  const tabs=["install","steps","expected","advanced","troubleshoot"];
  return(
    <div style={{background:"#07111c",border:`1px solid ${lab.color}30`,borderRadius:10,
      overflow:"hidden",marginBottom:14}}>
      {/* Header */}
      <div style={{height:3,background:`linear-gradient(90deg,transparent,${lab.color},transparent)`}}/>
      <div style={{padding:"14px 16px",display:"flex",gap:12,alignItems:"flex-start",
        background:`${lab.color}06`,borderBottom:`1px solid ${lab.color}20`}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <span style={{fontFamily:"Orbitron,sans-serif",fontWeight:700,fontSize:11,
              color:lab.color,border:`1px solid ${lab.color}40`,borderRadius:4,
              padding:"1px 8px"}}>{lab.num}</span>
            <span style={{background:`${lab.color}15`,borderRadius:3,padding:"1px 7px",
              fontSize:10,color:lab.color}}>{lab.category}</span>
            <DiffBadge d={lab.difficulty}/>
          </div>
          <div style={{fontFamily:"Orbitron,sans-serif",fontWeight:700,fontSize:14,
            color:"#fff",marginBottom:4}}>{lab.title}</div>
          <div style={{fontSize:11,color:"#4a7a9a",lineHeight:1.6}}>{lab.objective}</div>
          <div style={{display:"flex",gap:12,marginTop:6,fontSize:10,color:"#2a5a7a"}}>
            <span>⏱ {lab.duration}</span>
            <span>📋 Pre: {lab.prereq}</span>
          </div>
        </div>
      </div>

      {/* Theory (always shown, collapsed) */}
      <details style={{borderBottom:`1px solid #0a2030`}}>
        <summary style={{padding:"8px 16px",cursor:"pointer",fontSize:11,
          color:"#3a8aaa",userSelect:"none"}}>📖 Lý thuyết nền tảng</summary>
        <pre style={{padding:"10px 16px 14px",fontSize:11,lineHeight:1.8,
          color:"#6aaabb",fontFamily:"'JetBrains Mono',monospace",
          background:"#020910",margin:0,overflowX:"auto"}}>{lab.theory}</pre>
      </details>

      {/* Tab bar */}
      <div style={{...TABS_S,padding:"10px 14px 0",background:"#050d18",borderBottom:"1px solid #0a1828"}}>
        {[["install","⚙ Cài đặt"],["steps","📝 Hướng dẫn"],
          ["expected","✅ Kết quả"],["advanced","🚀 Nâng cao"],
          ["troubleshoot","🔧 Xử lý lỗi"]].map(([k,l])=>(
          <Pill key={k} label={l} active={tab===k} color={lab.color}
            onClick={()=>setTab(k)}/>
        ))}
      </div>

      {/* Tab content */}
      <div style={{padding:"14px 16px",minHeight:120}}>
        {tab==="install" && (
          <Code color={lab.color}>{lab.install.join("\n")}</Code>
        )}

        {tab==="steps" && (
          <div>
            {lab.steps.map((s,i)=>(
              <div key={i} style={{marginBottom:8,border:`1px solid #0a2030`,
                borderRadius:7,overflow:"hidden"}}>
                <div onClick={()=>setStepOpen(stepOpen===i?null:i)}
                  style={{padding:"9px 12px",cursor:"pointer",display:"flex",
                    gap:8,alignItems:"center",background:stepOpen===i?`${lab.color}08`:"transparent",
                    userSelect:"none"}}>
                  <span style={{background:lab.color,color:"#000",borderRadius:"50%",
                    width:20,height:20,display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</span>
                  <span style={{fontSize:12,color:"#a0c8e0"}}>{s.title}</span>
                  <span style={{marginLeft:"auto",color:lab.color,fontSize:11}}>
                    {stepOpen===i?"▲":"▼"}</span>
                </div>
                {stepOpen===i && <Code color={lab.color}>{s.cmd}</Code>}
              </div>
            ))}
          </div>
        )}

        {tab==="expected" && (
          <div style={{background:"#020d10",borderRadius:8,padding:"14px"}}>
            <div style={{fontSize:11,color:"#3a8a6a",marginBottom:10,
              fontFamily:"Orbitron,sans-serif",letterSpacing:1}}>KẾT QUẢ MONG MUỐN</div>
            {lab.expected.map((e,i)=>(
              <div key={i} style={{padding:"5px 0",borderBottom:i<lab.expected.length-1?
                "1px solid #0a1820":"none",fontSize:12,color:"#5ab090",lineHeight:1.6}}>
                {e}
              </div>
            ))}
          </div>
        )}

        {tab==="advanced" && (
          <div>
            <div style={{fontSize:11,color:lab.color,marginBottom:8,
              fontFamily:"Orbitron,sans-serif",letterSpacing:1}}>
              ⚡ MỞ RỘNG NÂNG CAO</div>
            <Code color={lab.color}>{lab.advanced}</Code>
          </div>
        )}

        {tab==="troubleshoot" && (
          <div style={{background:"#1a0a06",borderRadius:8,padding:"14px",
            border:"1px solid #3a1a0a"}}>
            <div style={{fontSize:11,color:"#f59e0b",marginBottom:10,
              fontFamily:"Orbitron,sans-serif",letterSpacing:1}}>⚠ XỬ LÝ LỖI THƯỜNG GẶP</div>
            {lab.troubleshoot.map((t,i)=>(
              <div key={i} style={{padding:"6px 0",borderBottom:i<lab.troubleshoot.length-1?
                "1px solid #2a1a0a":"none",fontSize:11,color:"#d0905a",lineHeight:1.7}}>
                <span style={{color:"#f59e0b",marginRight:6}}>›</span>{t}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ThesisCard({t}){
  const [open,setOpen]=useState(false);
  const lvColors={basic:"#4ade80",medium:"#fbbf24",advanced:"#ef4444"};
  const lvLabels={basic:"Cơ bản",medium:"Trung bình",advanced:"Nâng cao"};
  const lvc=lvColors[t.level];
  return(
    <div style={{background:"#07111c",border:`1px solid ${t.color}25`,borderRadius:10,
      overflow:"hidden",marginBottom:10,transition:"border 0.2s"}}>
      <div style={{height:2,background:`linear-gradient(90deg,transparent,${t.color},transparent)`}}/>
      <div onClick={()=>setOpen(o=>!o)}
        style={{padding:"14px 16px",cursor:"pointer",display:"flex",gap:10,
          alignItems:"flex-start",userSelect:"none"}}>
        <span style={{fontSize:24,flexShrink:0}}>{t.icon}</span>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:6,marginBottom:5,flexWrap:"wrap"}}>
            <span style={{background:`${lvc}15`,border:`1px solid ${lvc}40`,
              borderRadius:3,padding:"1px 7px",fontSize:10,color:lvc}}>
              {lvLabels[t.level]}</span>
            <span style={{background:`${t.color}10`,border:`1px solid ${t.color}30`,
              borderRadius:3,padding:"1px 7px",fontSize:10,color:t.color}}>{t.type}</span>
            <span style={{fontSize:10,color:"#2a5a7a"}}>⏱ {t.dur}</span>
            <span style={{fontSize:10,color:"#2a5a7a"}}>👥 {t.team}</span>
          </div>
          <div style={{fontFamily:"Orbitron,sans-serif",fontWeight:700,fontSize:13,
            color:"#fff",lineHeight:1.3,marginBottom:4}}>
            [{String(t.id).padStart(2,"0")}] {t.title}</div>
          <p style={{fontSize:11,color:"#4a8a9a",lineHeight:1.7,margin:0}}>{t.overview}</p>
        </div>
        <span style={{color:t.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
      </div>

      {open && (
        <div style={{borderTop:`1px solid ${t.color}15`,padding:"0 16px 16px"}}>
          {/* Background */}
          <div style={{background:"#020910",borderRadius:7,padding:"12px",
            margin:"12px 0",borderLeft:`3px solid ${t.color}50`}}>
            <div style={{fontSize:10,color:t.color,marginBottom:6,
              fontFamily:"Orbitron,sans-serif"}}>BỐI CẢNH & Ý NGHĨA</div>
            <p style={{fontSize:11,color:"#5a9ab0",lineHeight:1.8,margin:0,
              whiteSpace:"pre-line"}}>{t.background}</p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {/* Objectives */}
            <div style={{background:"#020910",borderRadius:7,padding:"12px"}}>
              <div style={{fontSize:10,color:t.color,marginBottom:8,
                fontFamily:"Orbitron,sans-serif"}}>MỤC TIÊU</div>
              {t.objectives.map((o,i)=>(
                <div key={i} style={{display:"flex",gap:6,padding:"3px 0",
                  fontSize:11,color:"#6a9ab0",lineHeight:1.6}}>
                  <span style={{color:t.color,flexShrink:0}}>›</span>{o}
                </div>
              ))}
            </div>

            {/* Scope & Tech */}
            <div>
              <div style={{background:"#020910",borderRadius:7,padding:"12px",marginBottom:8}}>
                <div style={{fontSize:10,color:t.color,marginBottom:8,
                  fontFamily:"Orbitron,sans-serif"}}>PHẠM VI</div>
                {t.scope.map((s,i)=>(
                  <div key={i} style={{fontSize:11,color:"#6a9ab0",
                    padding:"2px 0",display:"flex",gap:6}}>
                    <span style={{color:t.color}}>›</span>{s}
                  </div>
                ))}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {t.tech.map(tk=>(
                  <span key={tk} style={{background:`${t.color}10`,
                    border:`1px solid ${t.color}30`,borderRadius:3,
                    padding:"2px 6px",fontSize:10,color:t.color}}>{tk}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Deliverables */}
          <div style={{background:"#020910",borderRadius:7,padding:"12px",
            margin:"10px 0"}}>
            <div style={{fontSize:10,color:t.color,marginBottom:8,
              fontFamily:"Orbitron,sans-serif"}}>SẢN PHẨM NỘP</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {t.deliverables.map((d,i)=>(
                <span key={i} style={{background:"#050d18",
                  border:"1px solid #1a3a5a",borderRadius:4,
                  padding:"3px 9px",fontSize:10,color:"#4a8aaa",
                  fontFamily:"'JetBrains Mono',monospace"}}>📁 {d}</span>
              ))}
            </div>
          </div>

          {/* Evaluation + Extend */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{background:"#020910",borderRadius:7,padding:"12px"}}>
              <div style={{fontSize:10,color:"#10b981",marginBottom:8,
                fontFamily:"Orbitron,sans-serif"}}>TIÊU CHÍ ĐÁNH GIÁ</div>
              <pre style={{fontSize:11,color:"#4a8a7a",lineHeight:1.8,
                margin:0,fontFamily:"'JetBrains Mono',monospace",
                whiteSpace:"pre-wrap"}}>{t.evaluation}</pre>
            </div>
            <div style={{background:"#020910",borderRadius:7,padding:"12px"}}>
              <div style={{fontSize:10,color:"#fbbf24",marginBottom:8,
                fontFamily:"Orbitron,sans-serif"}}>HƯỚNG MỞ RỘNG</div>
              <pre style={{fontSize:11,color:"#8a8a5a",lineHeight:1.8,
                margin:0,fontFamily:"'JetBrains Mono',monospace",
                whiteSpace:"pre-wrap"}}>{t.extend}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function SDNApp({ onHome }) {
  const [mainTab, setMainTab] = useState("labs");
  const [labFilter, setLabFilter] = useState("all");
  const [thesisFilter, setThesisFilter] = useState("all");
  const [labSearch, setLabSearch] = useState("");
  const [thesisSearch, setThesisSearch] = useState("");

  const labCategories = ["all",...new Set(LABS.map(l=>l.category))];
  const filteredLabs = LABS.filter(l=>{
    const catOk = labFilter==="all" || l.category===labFilter;
    const srOk  = !labSearch || l.title.toLowerCase().includes(labSearch.toLowerCase())
                  || l.objective.toLowerCase().includes(labSearch.toLowerCase());
    return catOk && srOk;
  });

  const filteredThesis = THESIS.filter(t=>{
    const lvOk = thesisFilter==="all" || t.level===thesisFilter;
    const srOk = !thesisSearch || t.title.toLowerCase().includes(thesisSearch.toLowerCase())
                 || t.overview.toLowerCase().includes(thesisSearch.toLowerCase());
    return lvOk && srOk;
  });

  const colors={basic:"#4ade80",medium:"#fbbf24",advanced:"#ef4444"};

  return (
    <div style={{minHeight:"100vh",background:C,
      fontFamily:"'JetBrains Mono','Courier New',monospace",color:"#c0d8f0"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#020d18}
        ::-webkit-scrollbar-thumb{background:#0a2a3a;border-radius:2px}
        details summary{list-style:none}
        details summary::-webkit-details-marker{display:none}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        .fu{animation:fadeUp 0.4s ease both}
        input::placeholder{color:#1a4a6a}
      `}</style>

      {/* Header */}
      <header style={{background:"rgba(2,13,24,0.97)",borderBottom:"1px solid #0a2030",
        padding:"10px 20px",display:"flex",alignItems:"center",gap:12,
        position:"sticky",top:0,zIndex:100,backdropFilter:"blur(10px)"}}>
        <button onClick={onHome} style={{background:"transparent",border:"1px solid #0a2a3a",
          borderRadius:5,color:"#2a6a8a",padding:"4px 10px",cursor:"pointer",
          fontSize:10,letterSpacing:1}}>← HOME</button>
        <div style={{width:1,height:24,background:"#0a2030"}}/>
        <span style={{fontSize:18}}>🧠</span>
        <div>
          <div style={{fontFamily:"Orbitron,sans-serif",fontWeight:900,fontSize:13,
            color:"#38bdf8",letterSpacing:3}}>CHUYÊN ĐỀ MMT 1</div>
          <div style={{fontSize:10,color:"#1a4a6a",letterSpacing:2}}>
            20CT3124 · SDN · Python · Network Automation</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          {[["labs","🔬 Labs TH"],["thesis","📚 Đề Tài NCKH"],["rubric","📊 Rubric"]].map(([k,l])=>(
            <button key={k} onClick={()=>setMainTab(k)}
              style={{background:mainTab===k?"#0a2a3a":"transparent",
                border:`1px solid ${mainTab===k?"#38bdf8":"#0a2030"}`,
                borderRadius:5,color:mainTab===k?"#38bdf8":"#2a5a7a",
                padding:"5px 12px",cursor:"pointer",fontSize:10,
                fontFamily:"Orbitron,sans-serif",letterSpacing:1,transition:"all 0.2s"}}>
              {l}
            </button>
          ))}
        </div>
      </header>

      <main style={{maxWidth:1100,margin:"0 auto",padding:"20px 16px"}}>

        {/* ── LABS TAB ── */}
        {mainTab==="labs" && (
          <div className="fu">
            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",
              gap:10,marginBottom:20}}>
              {[
                {v:LABS.length,l:"Bài Lab",c:"#38bdf8"},
                {v:LABS.filter(l=>l.difficulty===3).length,l:"Nâng cao",c:"#ef4444"},
                {v:"Python",l:"Language",c:"#4ade80"},
                {v:"SDN",l:"Platform",c:"#c084fc"},
              ].map((s,i)=>(
                <div key={i} style={{background:"#07111c",border:`1px solid ${s.c}20`,
                  borderRadius:8,padding:"12px",textAlign:"center"}}>
                  <div style={{fontFamily:"Orbitron,sans-serif",fontWeight:700,
                    fontSize:22,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:10,color:"#3a6a8a",marginTop:3}}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Filter & Search */}
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",
              alignItems:"center"}}>
              <input value={labSearch} onChange={e=>setLabSearch(e.target.value)}
                placeholder="🔍 Tìm kiếm lab..."
                style={{background:"#07111c",border:"1px solid #0a2030",borderRadius:6,
                  color:"#c0d8f0",padding:"6px 12px",fontSize:11,outline:"none",
                  fontFamily:"'JetBrains Mono',monospace",width:200}}/>
              {labCategories.map(c=>(
                <Pill key={c} label={c==="all"?"Tất cả":c}
                  active={labFilter===c} color="#38bdf8"
                  onClick={()=>setLabFilter(c)}/>
              ))}
            </div>

            {/* Lab list */}
            {filteredLabs.map(l=><LabCard key={l.id} lab={l}/>)}
          </div>
        )}

        {/* ── THESIS TAB ── */}
        {mainTab==="thesis" && (
          <div className="fu">
            {/* Header */}
            <div style={{background:"#07111c",border:"1px solid #38bdf820",
              borderRadius:10,padding:"16px",marginBottom:16}}>
              <div style={{fontFamily:"Orbitron,sans-serif",fontWeight:700,
                fontSize:14,color:"#38bdf8",marginBottom:8}}>
                📚 20 ĐỀ TÀI NCKH & ĐỒ ÁN CHUYÊN NGÀNH</div>
              <p style={{fontSize:11,color:"#4a8a9a",lineHeight:1.8}}>
                Từ đồ án môn học (cơ bản) đến đề tài nghiên cứu khoa học (nâng cao).
                Tất cả đề tài đều liên quan trực tiếp đến sản xuất, điều khiển mạng, 
                SDN và network automation.
              </p>
              {/* Stats */}
              <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
                {[["basic","Cơ bản","#4ade80"],["medium","Trung bình","#fbbf24"],
                  ["advanced","Nâng cao","#ef4444"]].map(([l,lb,c])=>(
                  <div key={l} style={{background:`${c}10`,border:`1px solid ${c}30`,
                    borderRadius:6,padding:"6px 14px",textAlign:"center"}}>
                    <div style={{fontFamily:"Orbitron,sans-serif",fontWeight:700,
                      fontSize:18,color:c}}>
                      {THESIS.filter(t=>t.level===l).length}</div>
                    <div style={{fontSize:10,color:c}}>{lb}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter & Search */}
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",
              alignItems:"center"}}>
              <input value={thesisSearch} onChange={e=>setThesisSearch(e.target.value)}
                placeholder="🔍 Tìm kiếm đề tài..."
                style={{background:"#07111c",border:"1px solid #0a2030",borderRadius:6,
                  color:"#c0d8f0",padding:"6px 12px",fontSize:11,outline:"none",
                  fontFamily:"'JetBrains Mono',monospace",width:220}}/>
              {["all","basic","medium","advanced"].map(l=>(
                <Pill key={l} label={l==="all"?"Tất cả":
                  l==="basic"?"Cơ bản":l==="medium"?"Trung bình":"Nâng cao"}
                  active={thesisFilter===l}
                  color={l==="all"?"#38bdf8":colors[l]}
                  onClick={()=>setThesisFilter(l)}/>
              ))}
            </div>

            {filteredThesis.map(t=><ThesisCard key={t.id} t={t}/>)}
          </div>
        )}

        {/* ── RUBRIC TAB ── */}
        {mainTab==="rubric" && (
          <div className="fu">
            <div style={{background:"#07111c",border:"1px solid #38bdf820",
              borderRadius:10,padding:"16px",marginBottom:16}}>
              <div style={{fontFamily:"Orbitron,sans-serif",fontWeight:700,
                fontSize:14,color:"#38bdf8",marginBottom:4}}>
                📊 RUBRIC ĐÁNH GIÁ — 20CT3124</div>
              <div style={{fontSize:11,color:"#3a6a8a"}}>
                Thang điểm: QT 50% + Thi cuối kỳ 50%</div>
            </div>

            {/* QT Breakdown */}
            <div style={{background:"#07111c",border:"1px solid #0a2030",
              borderRadius:10,padding:"16px",marginBottom:12}}>
              <div style={{fontSize:11,color:"#fbbf24",fontFamily:"Orbitron,sans-serif",
                marginBottom:12}}>ĐIỂM QUÁ TRÌNH (50%)</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  {n:"Thảo luận trên lớp",w:"10%",d:"Tham gia phát biểu, trả lời câu hỏi"},
                  {n:"Thực hành (Labs 1-6)",w:"10%",d:"Hoàn thành báo cáo TH đúng hạn"},
                  {n:"Kiểm tra giữa kỳ",w:"15%",d:"Bài thi tự luận 60 phút — Lab 1-4"},
                  {n:"Đề tài nhóm (báo cáo)",w:"15%",d:"Báo cáo + thuyết trình + demo"},
                ].map((r,i)=>(
                  <div key={i} style={{background:"#020910",borderRadius:7,
                    padding:"12px",border:"1px solid #0a2030"}}>
                    <div style={{display:"flex",justifyContent:"space-between",
                      marginBottom:4}}>
                      <span style={{fontSize:12,color:"#c0d8f0"}}>{r.n}</span>
                      <span style={{fontFamily:"Orbitron,sans-serif",fontWeight:700,
                        fontSize:14,color:"#38bdf8"}}>{r.w}</span>
                    </div>
                    <div style={{fontSize:10,color:"#3a6a8a"}}>{r.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Rubric */}
            <div style={{background:"#07111c",border:"1px solid #0a2030",
              borderRadius:10,padding:"16px",marginBottom:12}}>
              <div style={{fontSize:11,color:"#10b981",fontFamily:"Orbitron,sans-serif",
                marginBottom:12}}>CHI TIẾT ĐÁNH GIÁ THỰC HÀNH</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{background:"#0a2030"}}>
                      {["Bài TH","Trọng số","Xuất sắc (9-10)","Khá (7-8)","TB (5-6)","Yếu (<5)"]
                        .map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",
                          color:"#38bdf8"}}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["TH1: Mininet + OpenFlow","15%","Topo chạy, flows đúng, báo cáo đầy đủ","Topo chạy, flows có lỗi nhỏ","Cài được Mininet, chưa test flows","Không hoàn thành"],
                      ["TH2: Ryu Controller","20%","L2 switch + L3 router đều hoạt động","Một trong 2 chức năng OK","Ryu start, chưa cài flows đúng","Không hoàn thành"],
                      ["TH3: APIC-EM API","20%","Auth + inventory + export 3 formats","Auth OK, inventory chưa đầy đủ","Lấy được token, API chưa hoàn chỉnh","Không hoàn thành"],
                      ["TH4: Topology + Path","20%","Topology + path trace + visualize","Topology OK, path trace chưa xong","Lấy được topology, chưa parse đúng","Không hoàn thành"],
                      ["TH5: Config Push","10%","Push + verify + rollback thành công","Push OK, verify chưa đầy đủ","Kết nối SSH, chưa push được","Không hoàn thành"],
                      ["TH6: Full App + Demo","15%","App hoàn chỉnh, demo mượt mà","Hầu hết tính năng OK","1-2 tính năng hoạt động","Không demo"],
                    ].map((row,i)=>(
                      <tr key={i} style={{background:i%2===0?"#050d18":"#07111c"}}>
                        {row.map((cell,j)=>(
                          <td key={j} style={{padding:"8px 10px",
                            borderBottom:"1px solid #0a1828",
                            color:j===0?"#c0d8f0":j===1?"#38bdf8":
                                  j===2?"#10b981":j===3?"#4ade80":
                                  j===4?"#fbbf24":"#ef4444",
                            fontSize:j===1?"12px":"11px",
                            fontWeight:j===1?"700":"400"}}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CĐR mapping */}
            <div style={{background:"#07111c",border:"1px solid #0a2030",
              borderRadius:10,padding:"16px"}}>
              <div style={{fontSize:11,color:"#c084fc",fontFamily:"Orbitron,sans-serif",
                marginBottom:12}}>CHUẨN ĐẦU RA (CĐR) MAPPING</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  {cdr:"CĐR1","desc":"Hiểu kiến trúc SDN 3-layer, OpenFlow","type":"I"},
                  {cdr:"CĐR2","desc":"Triển khai Mininet + Ryu controller","type":"T"},
                  {cdr:"CĐR3","desc":"Sử dụng REST API (APIC-EM)","type":"T"},
                  {cdr:"CĐR4","desc":"Lập trình Python xử lý JSON","type":"T"},
                  {cdr:"CĐR5","desc":"Thu thập và phân tích topology","type":"T"},
                  {cdr:"CĐR6","desc":"Xây dựng ứng dụng quản lý mạng","type":"U"},
                  {cdr:"CĐR7","desc":"Viết báo cáo kỹ thuật","type":"U"},
                  {cdr:"CĐR8","desc":"Làm việc nhóm và thuyết trình","type":"U"},
                ].map(r=>(
                  <div key={r.cdr} style={{background:"#020910",borderRadius:7,
                    padding:"10px",display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{fontFamily:"Orbitron,sans-serif",fontWeight:700,
                      fontSize:11,color:"#c084fc",flexShrink:0}}>{r.cdr}</span>
                    <span style={{fontSize:11,color:"#5a8aaa",flex:1,lineHeight:1.5}}>
                      {r.desc}</span>
                    <span style={{background:
                        r.type==="I"?"#38bdf820":r.type==="T"?"#4ade8020":"#c084fc20",
                      color:r.type==="I"?"#38bdf8":r.type==="T"?"#4ade80":"#c084fc",
                      border:`1px solid ${r.type==="I"?"#38bdf830":r.type==="T"?"#4ade8030":"#c084fc30"}`,
                      borderRadius:4,padding:"1px 7px",fontSize:10,flexShrink:0}}>
                      {r.type}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:12,marginTop:12}}>
                {[["I","Introduce","#38bdf8"],["T","Teach","#4ade80"],["U","Utilize","#c084fc"]]
                  .map(([k,l,c])=>(
                  <span key={k} style={{fontSize:10,color:c}}>
                    <span style={{background:`${c}20`,border:`1px solid ${c}40`,
                      borderRadius:3,padding:"1px 6px",marginRight:4}}>{k}</span>
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{borderTop:"1px solid #0a2030",padding:"10px 20px",
        display:"flex",justifyContent:"space-between",fontSize:10,
        color:"#0a2a40",flexWrap:"wrap",gap:4}}>
        <span>CHUYÊN ĐỀ MMT 1 ·</span>
        <span>GV: Trần Vĩnh Phúc · phuctv@dlu.edu.vn</span>
        <span>© 2026 Khoa CNTT · ĐH Đà Lạt</span>
      </footer>
    </div>
  );
}
