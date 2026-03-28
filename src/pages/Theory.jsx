import { useState } from 'react'
import { THEORY } from '../data/content'

function Render({ md }) {
  if (!md) return null
  const lines = md.trim().split('\n')
  const out = []; let i = 0
  while (i < lines.length) {
    const l = lines[i]
    if (l.startsWith('```')) {
      const lang = l.slice(3).trim()||'bash'; const code=[]; i++
      while(i<lines.length&&!lines[i].startsWith('```')){code.push(lines[i]);i++}
      out.push(<pre key={i} data-lang={lang}><code style={{color:'#9ab'}}>{code.join('\n')}</code></pre>)
      i++;continue
    }
    if (l.startsWith('|')) {
      const rows=[]; while(i<lines.length&&lines[i].startsWith('|')){if(!lines[i].includes('---'))rows.push(lines[i].split('|').filter(Boolean).map(c=>c.trim()));i++}
      const [hd,...bd]=rows
      out.push(<div key={i} className="tw" style={{margin:'.8rem 0'}}><table><thead><tr>{hd.map((h,j)=><th key={j}>{h}</th>)}</tr></thead><tbody>{bd.map((r,ri)=><tr key={ri}>{r.map((c,ci)=><td key={ci}>{c}</td>)}</tr>)}</tbody></table></div>)
      continue
    }
    if (l.startsWith('## ')) { out.push(<h2 key={i} style={{fontFamily:'var(--fc)',fontSize:'1.05rem',color:'var(--acc)',margin:'1.2rem 0 .5rem',borderBottom:'1px solid var(--brd)',paddingBottom:'.3rem'}}>{l.slice(3)}</h2>); i++;continue }
    if (l.startsWith('### ')) { out.push(<h3 key={i} style={{fontSize:'.95rem',color:'var(--txt)',margin:'1rem 0 .4rem',fontWeight:600}}>{l.slice(4)}</h3>); i++;continue }
    if (l.startsWith('> ')) { out.push(<div key={i} className="alert alert-i" style={{fontStyle:'italic'}}>{l.slice(2)}</div>); i++;continue }
    if (l.trim()==='---') { out.push(<div key={i} className="divider"/>); i++;continue }
    if (l.match(/^[-*] /)) {
      const items=[]; while(i<lines.length&&lines[i].match(/^[-*] /)){items.push(lines[i].slice(2));i++}
      out.push(<ul key={i} className="ul">{items.map((it,j)=><li key={j} dangerouslySetInnerHTML={{__html:it.replace(/\*\*([^*]+)\*\*/g,'<strong style="color:var(--txt);font-weight:600">$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>')}}/>)}</ul>)
      continue
    }
    if (l.trim()==='') {i++;continue}
    out.push(<p key={i} style={{color:'var(--txt2)',margin:'.25rem 0 .65rem',fontSize:'.87rem',lineHeight:1.75}} dangerouslySetInnerHTML={{__html:l.replace(/\*\*([^*]+)\*\*/g,'<strong style="color:var(--txt);font-weight:600">$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>')}}/>)
    i++
  }
  return <div>{out}</div>
}

export default function Theory() {
  const [cat, setCat] = useState(THEORY[0])
  const [sec, setSec] = useState(THEORY[0].sections[0])

  const pick = c => { setCat(c); setSec(c.sections[0]); window.scrollTo(0,0) }

  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'clamp(1.3rem,3.5vw,1.8rem)',fontWeight:800}}><span className="gt">Lý thuyết</span></h1>
        <p style={{color:'var(--txt3)',fontSize:'.86rem',marginTop:'.3rem'}}>Nền tảng lý thuyết NGN, IPv6, VoIP và QoS</p>
      </div>

      {/* Mobile: horizontal scroll */}
      <div style={{display:'flex',gap:'.35rem',overflowX:'auto',paddingBottom:'.5rem',marginBottom:'.75rem',scrollbarWidth:'none',WebkitOverflowScrolling:'touch'}}
        className="mob-only">
        {THEORY.map(t=>(
          <button key={t.id} onClick={()=>pick(t)} style={{padding:'.38rem .75rem',borderRadius:7,flexShrink:0,background:cat.id===t.id?'rgba(0,212,255,.12)':'var(--sur)',border:`1px solid ${cat.id===t.id?'rgba(0,212,255,.4)':'var(--brd)'}`,color:cat.id===t.id?'var(--acc)':'var(--txt3)',cursor:'pointer',fontSize:'.78rem',fontWeight:cat.id===t.id?600:400,whiteSpace:'nowrap'}}>
            {t.title}
          </button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:'1.2rem',alignItems:'start'}}>
        {/* Desktop sidebar */}
        <div style={{position:'sticky',top:'1rem'}} className="desk-only">
          {THEORY.map(t=>(
            <button key={t.id} onClick={()=>pick(t)} style={{display:'flex',flexDirection:'column',width:'100%',padding:'.45rem .65rem',borderRadius:7,marginBottom:3,background:cat.id===t.id?'rgba(0,212,255,.09)':'transparent',border:cat.id===t.id?'1px solid rgba(0,212,255,.2)':'1px solid transparent',cursor:'pointer',textAlign:'left',transition:'all .13s'}}>
              <span style={{fontSize:'.62rem',color:'var(--acc2)',fontFamily:'var(--fc)',marginBottom:'.1rem'}}>{t.cat}</span>
              <span style={{fontSize:'.8rem',color:cat.id===t.id?'var(--acc)':'var(--txt2)',fontWeight:cat.id===t.id?600:400,lineHeight:1.3}}>{t.title}</span>
            </button>
          ))}
        </div>

        <div className="fu">
          {/* Chapter tabs */}
          <div className="tabs">
            {cat.sections.map(s=>(
              <button key={s.id} className={`tab ${sec.id===s.id?'active':''}`} onClick={()=>setSec(s)}>{s.title}</button>
            ))}
          </div>

          <div className="card" style={{padding:'1.3rem'}}>
            <Render md={sec.content}/>
          </div>

          <div style={{display:'flex',justifyContent:'space-between',marginTop:'.75rem',gap:'.5rem'}}>
            <button className="btn btn-g" disabled={cat.sections.indexOf(sec)===0} onClick={()=>{setSec(cat.sections[cat.sections.indexOf(sec)-1]);window.scrollTo(0,0)}}>← Trước</button>
            <button className="btn btn-o" disabled={cat.sections.indexOf(sec)===cat.sections.length-1} onClick={()=>{setSec(cat.sections[cat.sections.indexOf(sec)+1]);window.scrollTo(0,0)}}>Tiếp →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
