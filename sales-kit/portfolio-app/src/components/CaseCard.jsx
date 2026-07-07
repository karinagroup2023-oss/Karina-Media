import { Link } from 'react-router-dom'

export default function CaseCard({ c }) {
  return (
    <Link className="card" to={'/case/' + c.slug}>
      <img className="shot" src={c.cover_url} alt={c.title} loading="lazy" />
      <div className="cbody">
        <div className="ptype">{c.niche}</div>
        <div className="pname">{c.title}</div>
        <div className="pdesc">{c.short_desc}</div>
        <div className="tags">
          {c.tags.map(t => <span className="t" key={t}>{t}</span>)}
          {c.is_concept && <span className="t concept">Концепт под нишу</span>}
        </div>
        <div className="more">Смотреть кейс →</div>
      </div>
    </Link>
  )
}
