import { useState } from "react"
import TerminalGate from "./TerminalGate"

export default function HomePage({ onNavigate }) {

const [entered,setEntered] = useState(false)
const [hover,setHover] = useState(null)

const [selectedCourse,setSelectedCourse] = useState(null)
const [password,setPassword] = useState("")
const [error,setError] = useState("")

const courses = [

{
id:"ngn",
password:"ngn2025",
icon:"🌐",
title:"Next Generation Network",
color:"#00d4ff",
topology:"Router ─ Router ─ Switch ─ IP Phone"
},

{
id:"sdn",
password:"sdn2025",
icon:"🧠",
title:"Software Defined Networking",
color:"#38bdf8",
topology:"Controller → OpenFlow → Switch"
},

{
id:"python",
password:"python2025",
icon:"🐍",
title:"Python Automation",
color:"#4ade80",
topology:"API → Script → Network Device"
},

{
id:"aiot",
password:"aiot2025",
icon:"🤖",
title:"AIoT Systems",
color:"#a78bfa",
topology:"Sensor → Edge → Cloud AI"
},

{
id:"edgeai",
password:"edge2025",
icon:"⚡",
title:"Edge AI Computing",
color:"#f59e0b",
topology:"Camera → Edge GPU → AI Detection"
},

{
id:"embedded",
password:"embed2025",
icon:"🔧",
title:"Embedded Systems",
color:"#ef4444",
topology:"MCU → Sensors → Actuators"
},

{
id:"research",
password:"edgefpga",
icon:"🔐",
title:"Edge AI Security Research",
color:"#22c55e",
topology:"Edge AI → FPGA → Environmental Fingerprint"
}

]

if(!entered){
return <TerminalGate onEnter={()=>setEntered(true)}/>
}

function handleLogin(){

if(password === selectedCourse.password){

const id = selectedCourse.id

setSelectedCourse(null)
setPassword("")
setError("")

onNavigate(id)

}else{

setError("Sai mật khẩu lớp")

}

}

return(

<div style={{

minHeight:"100vh",
background:"radial-gradient(circle at top,#071a2f,#02060c)",
color:"#c0d8f0",
fontFamily:"monospace",
position:"relative",
overflow:"hidden"

}}>

{/* HEADER */}

<div style={{

padding:"30px 40px",
display:"flex",
justifyContent:"space-between",
alignItems:"center"

}}>

<div style={{

fontSize:36,
color:"#00d4ff",
fontWeight:700,
letterSpacing:2

}}>
DLU NETWORK LAB
</div>

<div style={{
textAlign:"right",
fontSize:14,
color:"#7aa9d6"
}}>
Giảng viên: Phúc Trần<br/>
📞 0976353606<br/>
✉ phuctv@dlu.edu.vn
</div>

</div>

{/* COURSE GRID */}

<div style={{

display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",
gap:30,
padding:"40px"

}}>

{courses.map(c=>{

const h = hover===c.id

return(

<div
key={c.id}
onMouseEnter={()=>setHover(c.id)}
onMouseLeave={()=>setHover(null)}
onClick={()=>{

setSelectedCourse(c)
setPassword("")
setError("")

}}

style={{

background:"#07111c",
border:`1px solid ${c.color}`,
borderRadius:14,
padding:30,
cursor:"pointer",
transition:"0.25s",
transform:h?"translateY(-8px)":"none",
boxShadow:h?`0 0 30px ${c.color}40`:"none"

}}

>

<div style={{fontSize:36}}>
{c.icon}
</div>

<div style={{
fontSize:18,
fontWeight:700,
marginTop:12
}}>
{c.title}
</div>

<div style={{
marginTop:10,
fontSize:13,
color:"#7aa9d6"
}}>
Topology
</div>

<div style={{
marginTop:4,
fontSize:13,
color:"#4db8ff"
}}>
{c.topology}
</div>

</div>

)

})}

</div>

{/* PASSWORD POPUP */}

{selectedCourse && (

<div style={{

position:"fixed",
inset:0,
background:"rgba(0,0,0,0.85)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:999

}}>

<div style={{

background:"#061524",
padding:40,
borderRadius:16,
border:"1px solid #00d4ff",
display:"flex",
flexDirection:"column",
gap:16,
minWidth:320

}}>

<div style={{
fontSize:18,
color:"#00d4ff",
textAlign:"center"
}}>
🔐 Nhập password lớp
</div>

<input
type="password"
value={password}
placeholder="Nhập mật khẩu..."
onChange={(e)=>setPassword(e.target.value)}

style={{

padding:12,
background:"#02070f",
border:"1px solid #0a2a40",
borderRadius:8,
color:"#c0d8f0"

}}
/>

{error && (

<div style={{color:"#ff4d4f"}}>
{error}
</div>
)}

<div style={{display:"flex",gap:10}}>

<button
onClick={handleLogin}
style={{
flex:1,
padding:"10px",
background:"#00d4ff",
border:"none",
borderRadius:6,
fontWeight:700,
cursor:"pointer"
}}

>

Vào lớp

</button>

<button
onClick={()=>setSelectedCourse(null)}
style={{
flex:1,
padding:"10px",
background:"transparent",
border:"1px solid #0a2a40",
color:"#c0d8f0",
borderRadius:6
}}

>

Hủy

</button>

</div>

</div>

</div>

)}
{/* NETWORK PACKET ANIMATION */}

<div className="packet p1"></div>
<div className="packet p2"></div>
<div className="packet p3"></div>

<style>{`

/* floating packets */

.packet{
position:absolute;
width:6px;
height:6px;
background:#00d4ff;
border-radius:50%;
opacity:0.7;
}

.p1{
top:20%;
left:-50px;
animation:packetMove 12s linear infinite;
}

.p2{
top:60%;
left:-120px;
animation:packetMove 18s linear infinite;
}

.p3{
top:40%;
left:-200px;
animation:packetMove 22s linear infinite;
}

@keyframes packetMove{

0%{
transform:translateX(0);
opacity:0;
}

10%{
opacity:1;
}

90%{
opacity:1;
}

100%{
transform:translateX(2000px);
opacity:0;
}

}

/* card glow animation */

div[style*="borderRadius:14"]{
transition:all 0.25s ease;
}

div[style*="borderRadius:14"]:hover{
transform:translateY(-10px) scale(1.02);
}

/* footer style */

.lab-footer{
margin-top:60px;
border-top:1px solid #0a2a40;
padding:40px;
display:flex;
justify-content:space-between;
flex-wrap:wrap;
font-size:13px;
color:#7aa9d6;
background:linear-gradient(to bottom,#02060c,#01040a);
}

.lab-footer h4{
color:#00d4ff;
margin-bottom:10px;
}

.lab-footer div{
margin-bottom:10px;
}

`}</style>

{/* PROFESSIONAL FOOTER */}

<div className="lab-footer">

<div>

<h4>DLU Network & AI Laboratory</h4>

Advanced lab environment for:

Network Engineering
Software Defined Networking
AIoT & Edge Computing
Python Network Automation

</div>

<div>

<h4>Instructor</h4>

Phúc Trần
📞 0976353606
✉ [phuctv@dlu.edu.vn](mailto:phuctv@dlu.edu.vn)

</div>

<div>

<h4>Infrastructure</h4>

Cisco • Docker • Linux
TensorFlow • Jetson • STM32
MQTT • Python Automation

</div>

<div>

<h4>Portal</h4>

DLU Network Lab Portal
© 2026 Dalat University

</div>

</div>
    
</div>

)
}