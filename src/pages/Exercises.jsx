import { useState } from 'react'
import { EXERCISES } from '../data/content'

const DIFFS = ['Tất cả','easy','medium','hard']
const CATS  = ['Tất cả',...new Set(EXERCISES.map(e=>e.cat))]

export default function Exercises() {
  const [diff,setDiff] = useState('Tất cả')
  const [cat,setCat]   = useState('Tất cả')
  const [open,setOpen] = useState(null)

  const list = EXERCISES.filter(e=>{
    const dOk = diff==='Tất cả'||e.diff===diff
    const cOk = cat==='Tất cả'||e.cat===cat
    return dOk&&cOk
  })

  const diffColor = d => d==='easy'?'var(--grn)':d==='medium'?'var(--acc)':'var(--red)'
  const diffLabel = d => d==='easy'?'Cơ bản':d==='medium'?'Trung bình':'Nâng cao'

  return (
    <div className="fu">
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'clamp(1.3rem,3.5vw,1.8rem)',fontWeight:800}}><span className="gt">Bài tập thực hành</span></h1>
        <p style={{color:'var(--txt3)',fontSize:'.86rem',marginTop:'.3rem'}}>{EXERCISES.length} bài tập — từ cơ bản đến nâng cao</p>
      </div>

      <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',marginBottom:'1rem'}}>
        <select value={diff} onChange={e=>setDiff(e.target.value)} style={{padding:'.4rem .7rem',background:'var(--sur)',border:'1px solid var(--brd)',color:'var(--txt)',borderRadius:6,fontSize:'.82rem',fontFamily:'var(--fd)',cursor:'pointer'}}>
          <option value="Tất cả">Tất cả độ khó</option>
          <option value="easy">Cơ bản</option>
          <option value="medium">Trung bình</option>
          <option value="hard">Nâng cao</option>
        </select>
        <select value={cat} onChange={e=>setCat(e.target.value)} style={{padding:'.4rem .7rem',background:'var(--sur)',border:'1px solid var(--brd)',color:'var(--txt)',borderRadius:6,fontSize:'.82rem',fontFamily:'var(--fd)',cursor:'pointer'}}>
          {CATS.map(c=><option key={c} value={c}>{c==='Tất cả'?'Tất cả chủ đề':c}</option>)}
        </select>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:'.6rem'}}>
        {list.map(ex=>(
          <div key={ex.id} className="card" style={{overflow:'hidden',borderColor:open===ex.id?`${diffColor(ex.diff)}40`:'var(--brd)'}}>
            <div onClick={()=>setOpen(open===ex.id?null:ex.id)}
              style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'.9rem 1.1rem',cursor:'pointer',flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:160}}>
                <div style={{display:'flex',gap:'.5rem',alignItems:'center',marginBottom:'.2rem',flexWrap:'wrap'}}>
                  <span className="badge" style={{background:`${diffColor(ex.diff)}14`,color:diffColor(ex.diff),border:`1px solid ${diffColor(ex.diff)}30`,fontSize:'.62rem'}}>{diffLabel(ex.diff)}</span>
                  <span className="badge b-blue" style={{fontSize:'.62rem'}}>{ex.cat}</span>
                  <span style={{fontSize:'.72rem',color:'var(--txt3)'}}>⏱ {ex.time}</span>
                </div>
                <div style={{fontWeight:600,fontSize:'.88rem',color:'var(--txt)',lineHeight:1.3}}>{ex.title}</div>
              </div>
              <span style={{color:'var(--txt3)',fontSize:'.8rem',flexShrink:0}}>{open===ex.id?'▲':'▼'}</span>
            </div>

            {open===ex.id&&(
              <div style={{borderTop:'1px solid var(--brd)',padding:'1rem 1.1rem',background:'var(--bg)'}}>
                <p style={{fontSize:'.85rem',color:'var(--txt2)',lineHeight:1.65,marginBottom:'1rem'}}>{ex.desc}</p>
                <div style={{fontSize:'.73rem',color:'var(--acc)',fontWeight:700,fontFamily:'var(--fc)',marginBottom:'.5rem',letterSpacing:1}}>HƯỚNG DẪN</div>
                <ol style={{listStyle:'none',counterReset:'s'}}>
                  {ex.steps.map((s,i)=>(
                    <li key={i} style={{counterIncrement:'s',display:'flex',gap:10,marginBottom:7,alignItems:'flex-start'}}>
                      <span style={{width:22,height:22,borderRadius:'50%',background:'rgba(0,212,255,.1)',border:'1px solid rgba(0,212,255,.25)',color:'var(--acc)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.68rem',fontWeight:700,flexShrink:0,fontFamily:'var(--fc)'}}>{i+1}</span>
                      <span style={{fontSize:'.84rem',color:'var(--txt2)',lineHeight:1.55}}>{s}</span>
                    </li>
                  ))}
                </ol>
                <div className="alert alert-s" style={{marginTop:'.75rem',fontSize:'.83rem'}}>
                  <strong>Kết quả mong đợi:</strong> {ex.expected}
                </div>
              </div>
            )}
          </div>
        ))}
        {list.length===0&&<div style={{textAlign:'center',padding:'3rem',color:'var(--txt3)',fontSize:'.88rem'}}>Không có bài tập phù hợp</div>}
      </div>
    </div>
  )
}
