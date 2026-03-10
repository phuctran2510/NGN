import { useState } from "react"

export default function TerminalGate({ onEnter }) {

const [cmd,setCmd] = useState("")
const [log,setLog] = useState([
"DLU NETWORK LAB TERMINAL",
"login: student"
])

function handleEnter(){

if(cmd === "enter-lab"){

setLog(l=>[...l,"access granted..."])

setTimeout(()=>{
onEnter()
},800)

}else{

setLog(l=>[...l,"command not recognized"])

}

setCmd("")
}

return(

<div style={{

height:"100vh",
background:"#02060c",
color:"#00ff9c",
fontFamily:"monospace",
padding:40

}}>

{log.map((l,i)=>(

<div key={i}>{l}</div>
))}

<div style={{marginTop:20}}>

<span>$ </span>

<input
value={cmd}
onChange={e=>setCmd(e.target.value)}
onKeyDown={e=>{
if(e.key==="Enter") handleEnter()
}}

style={{

background:"transparent",
border:"none",
color:"#00ff9c",
outline:"none",
fontFamily:"monospace",
fontSize:16

}}

/>

</div>

<div style={{
marginTop:20,
fontSize:12,
color:"#4da67f"
}}>
type: enter-lab
</div>

</div>

)
}
