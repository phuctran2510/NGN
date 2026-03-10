import { useState } from "react";

export default function Login({ onLogin }) {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "ngn2025") {
      localStorage.setItem("auth", "true");
      onLogin();
    } else {
      alert("Sai mật khẩu!");
    }
  };

  return (
    <div style={{
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"#0f172a",
      color:"white"
    }}>
      <div style={{
        background:"#1e293b",
        padding:"40px",
        borderRadius:"10px",
        textAlign:"center"
      }}>
        <h2>Mạng Thế Hệ Mới & VoIP</h2>

        <input
          type="password"
          placeholder="Enter password"
          onChange={(e)=>setPassword(e.target.value)}
          style={{
            padding:"10px",
            marginTop:"10px",
            width:"200px"
          }}
        />

        <br/>

        <button
          onClick={handleLogin}
          style={{
            marginTop:"15px",
            padding:"10px 20px",
            cursor:"pointer"
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}