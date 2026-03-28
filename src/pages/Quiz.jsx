import { useState } from 'react'
import { QUIZ } from '../data/content'

export default function Quiz() {
  const [catF, setCatF] = useState('all')
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState({})
  const [mode, setMode] = useState('browse')
  const [score, setScore] = useState(null)

  const cats = ['all',...new Set(QUIZ.map(q=>q.cat))]
  const pool = catF==='all'?QUIZ:QUIZ.filter(q=>q.cat===catF)
  const q = pool[idx]
  const done = Object.keys(chosen).length

  const pick = (qi,j) => { if (chosen[qi]!==undefined) return; setChosen(p=>({...p,[qi]:j})) }

  if (mode==='test' && score===null) {
    return (
      <div className="fu">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem',flexWrap:'wrap',gap:'.5rem'}}>
          <h2 style={{fontWeight:800,fontSize:'1.1rem'}}><span className="gt">Kiểm tra</span> — {pool.length} câu</h2>
          <button className="btn btn-g" onClick={()=>{setMode('browse');setChosen({});setIdx(0)}}>Thoát</button>
        </div>
        <div style={{marginBottom:'.7rem',fontSize:'.78rem',color:'var(--txt3)',fontFamily:'var(--fc)'}}>{done}/{pool.length} đã trả lời</div>
        <div className="prog" style={{marginBottom:'1.2rem'}}><div className="prog-f" style={{width:`${done/pool.length*100}%`}}/></div>

        {pool.map((qq,i)=>(
          <div key={qq.id} className="card" style={{padding:'1.1rem',marginBottom:'.75rem'}}>
            <div style={{fontSize:'.75rem',color:'var(--txt3)',fontFamily:'var(--fc)',marginBottom:'.35rem'}}>Câu {i+1} · {qq.cat}</div>
            <p style={{fontWeight:600,color:'var(--txt)',fontSize:'.88rem',marginBottom:'.75rem',lineHeight:1.55}}>{qq.q}</p>
            {qq.opts.map((opt,j)=>{
              const isDone=chosen[i]!==undefined; const isSel=chosen[i]===j; const isRight=qq.ans===j
              return (
                <div key={j} onClick={()=>pick(i,j)} style={{
                  display:'flex',alignItems:'center',gap:'.6rem',padding:'.65rem .9rem',
                  background:isDone&&isRight?'rgba(0,230,118,.07)':isDone&&isSel?'rgba(255,83,112,.07)':'var(--sur)',
                  border:`1px solid ${isDone&&isRight?'var(--grn)':isDone&&isSel&&!isRight?'var(--red)':'var(--brd)'}`,
                  borderRadius:7,cursor:isDone?'default':'pointer',transition:'all .13s',margin:'.3rem 0',
                  opacity:isDone&&!isRight&&!isSel?.55:1
                }}>
                  <div style={{width:22,height:22,borderRadius:'50%',border:'1.5px solid currentColor',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.7rem',fontFamily:'var(--fc)',fontWeight:700,flexShrink:0,color:isDone&&isRight?'var(--grn)':isDone&&isSel?'var(--red)':'var(--txt3)'}}>
                    {isDone&&isRight?'✓':isDone&&isSel?'✗':['A','B','C','D'][j]}
                  </div>
                  <span style={{fontSize:'.86rem',color:isDone&&isRight?'var(--grn)':isDone&&isSel?'var(--red)':'var(--txt2)'}}>{opt}</span>
                </div>
              )
            })}
            {chosen[i]!==undefined&&<div className="alert alert-s" style={{marginTop:'.65rem',fontSize:'.82rem'}}><strong>Giải thích:</strong> {qq.exp}</div>}
          </div>
        ))}
        <div style={{display:'flex',justifyContent:'center',marginTop:'1rem'}}>
          <button className="btn btn-p" disabled={done<pool.length} onClick={()=>setScore(pool.filter((_,i)=>chosen[i]===pool[i].ans).length)}>
            Nộp bài ({done}/{pool.length})
          </button>
        </div>
      </div>
    )
  }

  if (mode==='test' && score!==null) {
    const pct = Math.round(score/pool.length*100)
    return (
      <div className="fu" style={{textAlign:'center',padding:'3rem 1rem'}}>
        <div style={{fontSize:'1.8rem',fontWeight:800,color:pct>=80?'var(--grn)':pct>=60?'var(--yel)':'var(--red)',fontFamily:'var(--fc)',marginBottom:'.5rem'}}>{score}/{pool.length}</div>
        <div style={{color:'var(--txt2)',marginBottom:'1.5rem'}}>{pct}% — {pct>=80?'Xuất sắc!':pct>=60?'Khá tốt!':'Cần ôn thêm!'}</div>
        <div style={{display:'flex',gap:'.7rem',justifyContent:'center',flexWrap:'wrap'}}>
          <button className="btn btn-p" onClick={()=>{setChosen({});setScore(null);setMode('test')}}>Làm lại</button>
          <button className="btn btn-g" onClick={()=>{setChosen({});setScore(null);setMode('browse');setIdx(0)}}>Về</button>
        </div>
      </div>
    )
  }

  if (!q) return null
  return (
    <div className="fu">
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'clamp(1.3rem,3.5vw,1.8rem)',fontWeight:800}}><span className="gt">Trắc nghiệm</span></h1>
        <p style={{color:'var(--txt3)',fontSize:'.86rem',marginTop:'.3rem'}}>{QUIZ.length} câu hỏi về NGN/IPv6, VoIP, QoS, Multicast</p>
      </div>

      <div style={{display:'flex',gap:'.6rem',flexWrap:'wrap',marginBottom:'1rem',alignItems:'center'}}>
        <select value={catF} onChange={e=>{setCatF(e.target.value);setIdx(0);setChosen({})}} style={{padding:'.4rem .7rem',background:'var(--sur)',border:'1px solid var(--brd)',color:'var(--txt)',borderRadius:6,fontSize:'.82rem',fontFamily:'var(--fd)',cursor:'pointer'}}>
          {cats.map(c=><option key={c} value={c}>{c==='all'?`Tất cả (${QUIZ.length})`:c}</option>)}
        </select>
        <button className="btn btn-p" onClick={()=>{setChosen({});setScore(null);setMode('test')}}>Bắt đầu kiểm tra</button>
      </div>

      <div style={{fontSize:'.75rem',color:'var(--txt3)',fontFamily:'var(--fc)',marginBottom:'.7rem'}}>Câu {idx+1}/{pool.length} · {q.cat}</div>
      <div className="prog" style={{marginBottom:'1rem'}}><div className="prog-f" style={{width:`${(idx+1)/pool.length*100}%`}}/></div>

      <div className="card" style={{padding:'1.3rem',marginBottom:'1rem'}}>
        <p style={{fontWeight:600,color:'var(--txt)',fontSize:'.9rem',lineHeight:1.6,marginBottom:'1rem'}}>{q.q}</p>
        {q.opts.map((opt,j)=>{
          const isDone=chosen[idx]!==undefined; const isSel=chosen[idx]===j; const isRight=q.ans===j
          return (
            <div key={j} onClick={()=>pick(idx,j)} style={{
              display:'flex',alignItems:'center',gap:'.6rem',padding:'.65rem .9rem',
              background:isDone&&isRight?'rgba(0,230,118,.07)':isDone&&isSel?'rgba(255,83,112,.07)':'var(--sur)',
              border:`1px solid ${isDone&&isRight?'var(--grn)':isDone&&isSel&&!isRight?'var(--red)':isSel?'var(--acc)':'var(--brd)'}`,
              borderRadius:7,cursor:isDone?'default':'pointer',transition:'all .13s',margin:'.3rem 0',
              opacity:isDone&&!isRight&&!isSel?.55:1
            }}>
              <div style={{width:22,height:22,borderRadius:'50%',border:'1.5px solid currentColor',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.7rem',fontFamily:'var(--fc)',fontWeight:700,flexShrink:0,color:isDone&&isRight?'var(--grn)':isDone&&isSel?'var(--red)':isSel?'var(--acc)':'var(--txt3)'}}>
                {isDone&&isRight?'✓':isDone&&isSel?'✗':['A','B','C','D'][j]}
              </div>
              <span style={{fontSize:'.87rem',color:isDone&&isRight?'var(--grn)':isDone&&isSel?'var(--red)':'var(--txt2)'}}>{opt}</span>
            </div>
          )
        })}
        {chosen[idx]!==undefined&&<div className="alert alert-s" style={{marginTop:'.7rem',fontSize:'.83rem'}}><strong>Giải thích:</strong> {q.exp}</div>}
      </div>

      <div style={{display:'flex',justifyContent:'space-between',gap:'.5rem'}}>
        <button className="btn btn-g" disabled={idx===0} onClick={()=>setIdx(i=>i-1)}>← Trước</button>
        <button className="btn btn-o" disabled={idx===pool.length-1} onClick={()=>setIdx(i=>i+1)}>Tiếp →</button>
      </div>
    </div>
  )
}
