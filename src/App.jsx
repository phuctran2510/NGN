import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import Home     from './pages/Home'
import Modules  from './pages/Modules'
import Theory   from './pages/Theory'
import Quiz     from './pages/Quiz'
import Exercises from './pages/Exercises'
import Thesis   from './pages/Thesis'
import Resources from './pages/Resources'
import Guide    from './pages/Guide'
import Contact  from './pages/Contact'
import Topology from './pages/Topology'

const NAV = [
  { to:'/',           label:'Tổng quan'   },
  { to:'/theory',     label:'Lý thuyết'   },
  { to:'/modules',    label:'Modules & Lab'},
  { to:'/topology',   label:'Topology'    },
  { to:'/quiz',       label:'Trắc nghiệm' },
  { to:'/exercises',  label:'Bài tập'     },
  { to:'/thesis',     label:'Đề tài'      },
  { to:'/resources',  label:'Tài liệu'    },
  { to:'/guide',      label:'Hướng dẫn'   },
  { to:'/contact',    label:'Liên hệ GV'  },
]

function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const h = () => setM(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return m
}

function Sidebar({ open, onClose }) {
  const loc = useLocation()
  const mob = useIsMobile()
  useEffect(() => { if (mob) onClose() }, [loc.pathname])

  return (
    <>
      {open && mob && (
        <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:98,backdropFilter:'blur(2px)' }}/>
      )}
      <aside style={{
        position:'fixed',top:0,left:0,height:'100vh',
        width:'var(--sw)',background:'var(--bg2)',
        borderRight:'1px solid var(--brd)',zIndex:99,
        display:'flex',flexDirection:'column',overflowY:'auto',
        transform: mob && !open ? 'translateX(-100%)' : 'translateX(0)',
        transition:'transform .24s cubic-bezier(.4,0,.2,1)',
        boxShadow: mob && open ? '4px 0 28px rgba(0,0,0,.5)' : 'none',
      }}>
        {/* Logo */}
        <div style={{ padding:'1rem',borderBottom:'1px solid var(--brd)',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'.55rem' }}>
            <div style={{
              width:34,height:34,borderRadius:7,flexShrink:0,
              background:'linear-gradient(135deg,var(--acc),var(--grn))',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontWeight:800,fontSize:'1rem',color:'#000',fontFamily:'sans-serif'
            }}>N</div>
            <div>
              <div style={{ fontWeight:800,fontSize:'.88rem',color:'var(--acc)',letterSpacing:1 }}>NGN / VoIP EDU</div>
              <div style={{ fontSize:'.62rem',color:'var(--txt3)',fontFamily:'var(--fc)' }}>DLU · Khoa CNTT</div>
            </div>
          </div>
          {mob && (
            <button onClick={onClose} style={{ background:'none',border:'none',color:'var(--txt3)',cursor:'pointer',fontSize:'1.1rem' }}>✕</button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ padding:'.5rem .4rem',flex:1 }}>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to==='/'}
              style={({ isActive }) => ({
                display:'flex',alignItems:'center',gap:'.45rem',
                padding:'.46rem .65rem',borderRadius:7,marginBottom:2,
                fontSize:'.82rem',fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--acc)' : 'var(--txt2)',
                background: isActive ? 'rgba(0,212,255,.09)' : 'transparent',
                border: isActive ? '1px solid rgba(0,212,255,.2)' : '1px solid transparent',
                textDecoration:'none',transition:'all .12s',
              })}
            >{n.label}</NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding:'.75rem 1rem',borderTop:'1px solid var(--brd)',fontSize:'.67rem',color:'var(--txt3)' }}>
          <div style={{ marginBottom:'.15rem' }}>GV: Trần Vĩnh Phúc</div>
          <a href="mailto:phuctv@dlu.edu.vn" style={{ color:'var(--acc2)' }}>phuctv@dlu.edu.vn</a>
        </div>
      </aside>
    </>
  )
}

function Topbar({ onMenu }) {
  const mob = useIsMobile()
  const loc = useLocation()
  const cur = NAV.find(n => n.to === loc.pathname) || NAV[0]
  if (!mob) return null
  return (
    <div style={{
      display:'flex',alignItems:'center',gap:'.6rem',
      padding:'.6rem 1rem',background:'var(--bg2)',
      borderBottom:'1px solid var(--brd)',
      position:'sticky',top:0,zIndex:50,
    }}>
      <button onClick={onMenu} style={{
        background:'var(--sur)',border:'1px solid var(--brd)',
        color:'var(--txt)',cursor:'pointer',fontSize:'1rem',
        borderRadius:6,width:32,height:32,
        display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0
      }}>☰</button>
      <span style={{ fontWeight:700,fontSize:'.88rem',color:'var(--acc)' }}>{cur.label}</span>
      <span style={{ marginLeft:'auto',fontSize:'.62rem',color:'var(--txt3)',fontFamily:'var(--fc)' }}>NGN/VoIP EDU</span>
    </div>
  )
}

export default function App() {
  const [open, setOpen] = useState(false)
  const mob = useIsMobile()
  const close = useCallback(() => setOpen(false), [])

  return (
    <div style={{ display:'flex',minHeight:'100vh' }}>
      <Sidebar open={open} onClose={close}/>
      <div style={{ marginLeft: mob ? 0 : 'var(--sw)',flex:1,display:'flex',flexDirection:'column',minWidth:0 }}>
        <Topbar onMenu={() => setOpen(true)}/>
        <main style={{
          flex:1,
          padding: mob ? '1rem' : '1.5rem 2rem',
          maxWidth:1100,width:'100%',margin:'0 auto',
          boxSizing:'border-box',
        }}>
          <Routes>
            <Route path="/"          element={<Home/>}/>
            <Route path="/theory"    element={<Theory/>}/>
            <Route path="/modules"   element={<Modules/>}/>
            <Route path="/topology"  element={<Topology/>}/>
            <Route path="/quiz"      element={<Quiz/>}/>
            <Route path="/exercises" element={<Exercises/>}/>
            <Route path="/thesis"    element={<Thesis/>}/>
            <Route path="/resources" element={<Resources/>}/>
            <Route path="/guide"     element={<Guide/>}/>
            <Route path="/contact"   element={<Contact/>}/>
          </Routes>
        </main>
      </div>
    </div>
  )
}
