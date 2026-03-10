import { useState } from "react"
import HomePage from "./HomePage"

import NGNApp from "./NGNApp"
import PythonApp from "./PythonApp"
import SDNApp from "./SDNApp"
import EdgeAIResearch from "./EdgeAIResearch"
export default function App(){

  const [page,setPage] = useState("home")

  console.log("PAGE:", page)

  switch(page){

    case "home":
      return <HomePage onNavigate={setPage}/>

    case "ngn":
      return <NGNApp onHome={() => setPage("home")} />

    case "sdn":
      return <SDNApp onHome={() => setPage("home")} />

    case "python":
      return <PythonApp onHome={() => setPage("home")} />

    case "research":
      return <EdgeAIResearch onHome={() => setPage("home")} />

    default:
      return (
        <div style={{color:"white",fontSize:30}}>
          PAGE ERROR: {page}
        </div>
      )
  }

}