import { RESOURCES } from '../data/content'

export default function Resources() {
  return (
    <div className="fu">
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'clamp(1.3rem,3.5vw,1.8rem)',fontWeight:800}}><span className="gt">Tài liệu tham khảo</span></h1>
        <p style={{color:'var(--txt3)',fontSize:'.86rem',marginTop:'.3rem'}}>RFC, Sách, Khóa học và Công cụ cho NGN/VoIP</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
        {RESOURCES.map(cat=>(
          <div key={cat.cat}>
            <div style={{fontWeight:700,fontSize:'.95rem',color:'var(--txt)',marginBottom:'.75rem',borderBottom:'1px solid var(--brd)',paddingBottom:'.4rem'}}>{cat.cat}</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(270px,100%),1fr))',gap:'.65rem'}}>
              {cat.items.map(item=>(
                <a key={item.name} href={item.url} target="_blank" rel="noopener" className="card card-acc" style={{padding:'1rem',textDecoration:'none',display:'block'}}>
                  <div style={{fontWeight:600,color:'var(--acc)',fontSize:'.86rem',marginBottom:'.3rem'}}>{item.name}</div>
                  <div style={{fontSize:'.79rem',color:'var(--txt2)',lineHeight:1.5}}>{item.desc}</div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
