import { instructor } from '../data/content'

export default function Contact() {
  return (
    <div className="fu">
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'clamp(1.3rem,3.5vw,1.8rem)',fontWeight:800}}><span className="gt">Liên hệ giảng viên</span></h1>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(300px,100%),1fr))',gap:'1.2rem',maxWidth:760}}>
        <div className="card" style={{padding:'1.5rem',borderColor:'rgba(0,212,255,.22)',background:'rgba(0,212,255,.03)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.2rem'}}>
            <div style={{width:56,height:56,borderRadius:14,background:'linear-gradient(135deg,var(--acc),var(--grn))',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'1.3rem',color:'#000',flexShrink:0}}>
              {instructor.avatar}
            </div>
            <div>
              <div style={{fontWeight:800,fontSize:'1.05rem',color:'var(--txt)'}}>{instructor.fullName}</div>
              <div style={{fontSize:'.78rem',color:'var(--txt3)',marginTop:'.12rem'}}>{instructor.dept}</div>
              <div style={{fontSize:'.76rem',color:'var(--acc2)',marginTop:'.08rem'}}>{instructor.university}</div>
            </div>
          </div>
          <p style={{fontSize:'.85rem',color:'var(--txt2)',lineHeight:1.65,marginBottom:'1.2rem'}}>{instructor.bio}</p>
          <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
            <a href={`mailto:${instructor.email}`} className="btn btn-o" style={{justifyContent:'flex-start'}}>
              {instructor.email}
            </a>
            <a href={`tel:${instructor.phone}`} className="btn btn-g" style={{justifyContent:'flex-start'}}>
              {instructor.phone}
            </a>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div className="card" style={{padding:'1.2rem'}}>
            <div style={{fontSize:'.72rem',color:'var(--txt3)',fontFamily:'var(--fc)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'.6rem'}}>Chuyên môn</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.35rem'}}>
              {instructor.expertise.map(e=><span key={e} className="badge b-blue">{e}</span>)}
            </div>
          </div>
          <div className="card" style={{padding:'1.2rem'}}>
            <div style={{fontSize:'.72rem',color:'var(--txt3)',fontFamily:'var(--fc)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'.6rem'}}>Giờ tiếp sinh viên</div>
            <ul className="ul">
              <li>Thứ 2, 4, 6: 8:00 – 11:30</li>
              <li>Thứ 3, 5: 14:00 – 17:00</li>
              <li>Phòng A2.05 – Khoa CNTT</li>
              <li>Email trả lời trong 24h làm việc</li>
            </ul>
          </div>
          <div className="alert alert-i" style={{margin:0}}>
            <strong>Lưu ý:</strong> Khi gửi email hỏi bài, ghi rõ tên, MSSV và môn học. Kèm code + error message để được hỗ trợ nhanh nhất.
          </div>
        </div>
      </div>
    </div>
  )
}
