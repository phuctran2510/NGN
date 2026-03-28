import { useState } from 'react'
import { THESIS } from '../data/thesis'

const LEVELS = ['Tất cả','medium','hard','advanced']
const LBL = { medium:'Trung bình', hard:'Khó', advanced:'Nâng cao - NCKH' }
const CLR = { medium:'var(--acc)', hard:'var(--org)', advanced:'var(--pur)' }

export default function Thesis() {
  const [lv, setLv] = useState('Tất cả')
  const [sel, setSel] = useState(null)
  const [tab, setTab] = useState('overview')

  const list = lv==='Tất cả' ? THESIS : THESIS.filter(t=>t.level===lv)

  if (sel) {
    const t = THESIS.find(x=>x.id===sel)
    return (
      <div className="fu">
        <button className="btn btn-g" style={{marginBottom:'1.2rem'}} onClick={()=>{setSel(null);setTab('overview')}}>← Danh sách đề tài</button>
        <div className="card" style={{padding:'1.3rem',borderColor:`${t.color}30`,background:`${t.color}05`,marginBottom:'1.2rem'}}>
          <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',marginBottom:'.6rem',alignItems:'center'}}>
            <span className="badge" style={{background:`${CLR[t.level]}14`,color:CLR[t.level],border:`1px solid ${CLR[t.level]}30`}}>{LBL[t.level]}</span>
            <span style={{fontSize:'.76rem',color:'var(--txt3)'}}>⏱ {t.dur}</span>
            <span style={{fontSize:'.76rem',color:'var(--txt3)'}}>Nhóm {t.team}</span>
          </div>
          <h2 style={{fontWeight:800,fontSize:'1.1rem',color:'var(--txt)',marginBottom:'.25rem'}}>{t.title}</h2>
          <p style={{fontSize:'.8rem',color:'var(--txt3)',marginBottom:'.6rem',fontFamily:'var(--fc)'}}>{t.sub}</p>
          <p style={{fontSize:'.86rem',color:'var(--txt2)',lineHeight:1.65}}>{t.overview}</p>
        </div>

        <div className="tabs">
          {[['overview','Tổng quan'],['scope','Phạm vi'],['topo','Topology'],['deploy','Kế hoạch'],['result','Kết quả'],['tech','Công nghệ']].map(([k,l])=>(
            <button key={k} className={`tab ${tab===k?'active':''}`} onClick={()=>setTab(k)}>{l}</button>
          ))}
        </div>

        <div className="card" style={{padding:'1.2rem'}}>
          {tab==='overview'&&<p style={{color:'var(--txt2)',fontSize:'.87rem',lineHeight:1.7}}>{t.overview}</p>}
          {tab==='scope'&&<ul className="ul">{t.scope.map((s,i)=><li key={i}>{s}</li>)}</ul>}
          {tab==='topo'&&<pre style={{background:'rgba(0,212,255,.04)',borderColor:'rgba(0,212,255,.2)'}}><code style={{color:'var(--acc)'}}>{t.topo}</code></pre>}
          {tab==='deploy'&&<ul className="ul">{t.deploy.map((d,i)=><li key={i}>{d}</li>)}</ul>}
          {tab==='result'&&<ul className="ul">{t.result.map((r,i)=><li key={i}>{r}</li>)}</ul>}
          {tab==='tech'&&<div style={{display:'flex',flexWrap:'wrap',gap:'.35rem'}}>{t.tech.map(tg=><span key={tg} className="badge b-blue">{tg}</span>)}</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="fu">
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'clamp(1.3rem,3.5vw,1.8rem)',fontWeight:800}}><span className="gt">Đề tài / Dự án</span></h1>
        <p style={{color:'var(--txt3)',fontSize:'.86rem',marginTop:'.3rem'}}>{THESIS.length} đề tài — bao gồm đề tài cũ và mới từ khó đến nâng cao NCKH</p>
      </div>

      <div className="tabs" style={{marginBottom:'1rem'}}>
        {LEVELS.map(l=>(
          <button key={l} className={`tab ${lv===l?'active':''}`} onClick={()=>setLv(l)}>
            {l==='Tất cả'?`Tất cả (${THESIS.length})`:LBL[l]}
          </button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(290px,100%),1fr))',gap:'.75rem'}}>
        {list.map(t=>(
          <div key={t.id} className="card card-acc" style={{padding:'1.1rem',cursor:'pointer',borderColor:`${t.color}20`}} onClick={()=>{setSel(t.id);setTab('overview')}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.5rem',gap:'.5rem',flexWrap:'wrap',alignItems:'flex-start'}}>
              <div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}>
                <span className="badge" style={{background:`${CLR[t.level]}12`,color:CLR[t.level],border:`1px solid ${CLR[t.level]}25`,fontSize:'.62rem'}}>{LBL[t.level]}</span>
                <span style={{fontSize:'.72rem',color:'var(--txt3)'}}>⏱ {t.dur}</span>
              </div>
              <span style={{fontSize:'.68rem',color:'var(--txt3)',fontFamily:'var(--fc)'}}>#{t.id}</span>
            </div>
            <h3 style={{fontWeight:700,fontSize:'.88rem',color:'var(--txt)',marginBottom:'.3rem',lineHeight:1.35}}>{t.title}</h3>
            <p style={{fontSize:'.74rem',color:t.color,fontFamily:'var(--fc)',marginBottom:'.45rem'}}>{t.sub}</p>
            <p style={{fontSize:'.79rem',color:'var(--txt3)',lineHeight:1.5,marginBottom:'.75rem'}}>{t.overview.slice(0,120)}...</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.25rem'}}>
              {t.tech.slice(0,4).map(tg=><span key={tg} className="badge b-blue" style={{fontSize:'.6rem'}}>{tg}</span>)}
              {t.tech.length>4&&<span className="badge b-blue" style={{fontSize:'.6rem'}}>+{t.tech.length-4}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
