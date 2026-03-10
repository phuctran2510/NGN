export default function EdgeAIResearch({ onHome }) {

const papers = [

{
title:"Federated Learning and Blockchain Integration for Secure and Trustworthy Edge AI Systems",
authors:"Phuc Tran-Vinh, Cuong Pham-Quoc"
},

{
title:"Environmental Fingerprint-Based Access Control for Edge-AI Inference on FPGA",
authors:"Phuc Tran-Vinh, Cuong Pham-Quoc"
},

{
title:"Edge AI: A Comprehensive Survey on Applications, Challenges, and Future Directions",
authors:"Tran Vinh Phuc, Cuong Pham-Quoc"
},

{
title:"TrustAware-X: Integrating Game-Theoretic Incentives, Reinforcement Learning, and Shapley Value Compensation in Blockchain-Secured Federated Learning",
authors:"Phuc Tran-Vinh, Thai-Minh Truong, Cuong Pham-Quoc"
},

{
title:"FPGA-based Secure Federated Learning with CNN Inference and Hardware Cryptography",
authors:"Phuc Tran-Vinh, Cuong Pham-Quoc"
}

]

return(

<div style={{

minHeight:"100vh",
background:"#02060c",
color:"#c0d8f0",
fontFamily:"monospace",
padding:60

}}>

<h1 style={{
color:"#22c55e",
marginBottom:20
}}>
Edge AI Security Research Lab
</h1>

<div style={{
marginBottom:40,
fontSize:15,
color:"#7aa9d6"
}}>
Focus Areas:
<br/>
• Secure Edge AI
<br/>
• FPGA based AI acceleration
<br/>
• Environmental Fingerprint Authentication
<br/>
• Federated Learning Security
<br/>
• Blockchain Trust Architecture
</div>

<h2 style={{
color:"#00d4ff",
marginBottom:20
}}>
Selected Publications
</h2>

{papers.map((p,i)=>(
<div
key={i}
style={{
background:"#07111c",
padding:20,
borderRadius:10,
marginBottom:20,
border:"1px solid #0a2a40"
}}
>

<div style={{
fontWeight:700,
fontSize:16
}}>
{p.title}
</div>

<div style={{
marginTop:8,
color:"#4db8ff"
}}>
Authors: {p.authors}
</div>

<div style={{
marginTop:6,
color:"#22c55e"
}}>
Main Author: Phuc Tran
</div>

</div>
))}

<button
onClick={onHome}
style={{
marginTop:30,
padding:"10px 20px",
background:"#00d4ff",
border:"none",
borderRadius:6,
fontWeight:700,
cursor:"pointer"
}}
>

← Back Home

</button>

</div>

)

}