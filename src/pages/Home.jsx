import { Link } from 'react-router-dom'
import { MODULES } from '../data/modules'
import { THESIS } from '../data/thesis'
import { QUIZ, EXERCISES, instructor } from '../data/content'

export default function Home() {
  const totalLabs = MODULES.reduce((s,m) => s + m.labList.length, 0)
  return (
    <div className="fu">
      <div style={{textAlign:'center',padding:'2rem 0 2.5rem'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:'.4rem',background:'rgba(0,212,255,.07)',border:'1px solid rgba(0,212,255,.18)',padding:'.25rem .85rem',borderRadius:999,marginBottom:'1.2rem'}}>
          <span style={{width:6,height:6,background:'var(--grn)',borderRadius:'50%',animation:'pulse 2s infinite',display:'inline-block'}}/>
          <span style={{fontSize:'.72rem',color:'var(--acc)',fontFamily:'var(--fc)'}}>Đại học Đà Lạt · Khoa CNTT · 2025</span>
        </div>
        <h1 style={{fontSize:'clamp(1.6rem,4.5vw,2.5rem)',fontWeight:800,lineHeight:1.15,marginBottom:'.7rem'}}>
          <span className="gt">NGN / VoIP EDU</span><br/>
          <span style={{color:'var(--txt2)',fontSize:'.45em',fontWeight:400}}>Mạng Thế Hệ Mới & Voice over IP</span>
        </h1>
        <p style={{color:'var(--txt2)',maxWidth:500,margin:'0 auto 1.5rem',fontSize:'.89rem',lineHeight:1.75}}>
          Giáo trình thực hành toàn diện: IPv6 NGN, Multicast, QoS, Cisco CME, FreePBX — từ lý thuyết đến lab EVE-NG.
        </p>
        <div style={{display:'flex',gap:'.6rem',justifyContent:'center',flexWrap:'wrap'}}>
          <Link to="/theory" className="btn btn-p">Bắt đầu học</Link>
          <Link to="/modules" className="btn btn-o">Xem Labs</Link>
          <Link to="/quiz" className="btn btn-g">Trắc nghiệm</Link>
        </div>
      </div>

      <div className="fu d1" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))',gap:'.65rem',marginBottom:'2rem'}}>
        {[[MODULES.length,'Modules','var(--acc)'],[totalLabs,'Labs','var(--grn)'],[QUIZ.length,'Câu quiz','var(--org)'],[EXERCISES.length,'Bài tập','var(--pur)'],[THESIS.length,'Đề tài','var(--yel)']].map(([v,l,c],i)=>(
          <div key={i} className="card" style={{padding:'1rem',textAlign:'center'}}>
            <div style={{fontSize:'1.5rem',fontWeight:800,color:c,fontFamily:'var(--fc)',marginBottom:'.2rem'}}>{v}</div>
            <div style={{fontSize:'.74rem',color:'var(--txt3)'}}>{l}</div>
          </div>
        ))}
      </div>

      <div className="fu d2" style={{marginBottom:'2rem'}}>
        <div style={{fontSize:'.68rem',color:'var(--txt3)',fontFamily:'var(--fc)',marginBottom:'.7rem',textTransform:'uppercase',letterSpacing:'.07em'}}>Chương trình học</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(260px,100%),1fr))',gap:'.65rem'}}>
          {MODULES.map(m=>(
            <Link key={m.id} to="/modules" state={{modId:m.id}} className="card card-acc fu" style={{padding:'1rem',textDecoration:'none',borderColor:`${m.color}20`}}>
              <div style={{display:'flex',gap:'.65rem',alignItems:'flex-start'}}>
                <div style={{width:36,height:36,borderRadius:7,flexShrink:0,background:`${m.color}16`,border:`1px solid ${m.color}35`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.74rem',fontWeight:700,color:m.color,fontFamily:'var(--fc)'}}>M{m.id}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:'.64rem',color:m.color,fontFamily:'var(--fc)',marginBottom:'.12rem',fontWeight:700}}>{m.labs}</div>
                  <div style={{fontWeight:700,fontSize:'.85rem',color:'var(--txt)',marginBottom:'.25rem',lineHeight:1.3}}>{m.title}</div>
                  <div style={{fontSize:'.76rem',color:'var(--txt3)',lineHeight:1.45}}>{m.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="fu d3 card" style={{padding:'1.2rem',borderColor:'rgba(0,212,255,.2)',background:'rgba(0,212,255,.03)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.9rem',flexWrap:'wrap'}}>
          <div style={{width:46,height:46,borderRadius:'50%',flexShrink:0,background:'linear-gradient(135deg,var(--acc),var(--grn))',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'1rem',color:'#000'}}>{instructor.avatar}</div>
          <div style={{flex:1,minWidth:160}}>
            <div style={{fontWeight:700,fontSize:'.95rem',color:'var(--txt)',marginBottom:'.1rem'}}>GV. {instructor.fullName}</div>
            <div style={{fontSize:'.77rem',color:'var(--txt3)',marginBottom:'.1rem'}}>{instructor.dept} · {instructor.university}</div>
            <div style={{fontSize:'.74rem',color:'var(--acc2)',fontFamily:'var(--fc)'}}>{instructor.email} · {instructor.phone}</div>
          </div>
          <Link to="/contact" className="btn btn-o" style={{flexShrink:0}}>Liên hệ GV</Link>
        </div>
      </div>
    </div>
  )
}
