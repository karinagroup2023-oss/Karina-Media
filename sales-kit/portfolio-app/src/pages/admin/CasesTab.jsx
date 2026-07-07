import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const EMPTY = {
  slug: '', title: '', niche: '', type: 'site', short_desc: '', tags: [],
  cover_url: '', screens: [], task_md: '', solution_md: '', result_md: '',
  live_url: '', is_concept: false, published: true, sort_order: 100,
}

function CaseForm({ initial, onDone }) {
  const [f, setF] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }))

  async function upload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true); setErr('')
    const path = `cases/${f.slug || 'new'}/${Date.now()}-${file.name.replace(/[^\w.\-]/g, '_')}`
    const { error } = await supabase.storage.from('pf-screens').upload(path, file)
    if (error) { setErr('Загрузка не удалась: ' + error.message); setBusy(false); return }
    const { data } = supabase.storage.from('pf-screens').getPublicUrl(path)
    const url = data.publicUrl
    setF(prev => ({
      ...prev,
      screens: [...prev.screens, url],
      cover_url: prev.cover_url || url,
    }))
    setBusy(false)
  }

  async function save(e) {
    e.preventDefault()
    if (!f.slug.trim() || !f.title.trim()) { setErr('Нужны slug и название'); return }
    setBusy(true); setErr('')
    const row = { ...f, slug: f.slug.trim() }
    delete row.id; delete row.created_at
    const q = initial.id
      ? supabase.from('pf_cases').update(row).eq('id', initial.id)
      : supabase.from('pf_cases').insert(row)
    const { error } = await q
    setBusy(false)
    if (error) { setErr(error.message); return }
    onDone()
  }

  return (
    <form className="panel" onSubmit={save}>
      <h3>{initial.id ? 'Правка кейса' : 'Новый кейс'}</h3>
      {err && <div className="err">{err}</div>}
      <div className="form-grid">
        <div className="field"><label>Slug (латиницей, для ссылки)</label>
          <input value={f.slug} onChange={e => set('slug', e.target.value)} disabled={!!initial.id} /></div>
        <div className="field"><label>Название</label>
          <input value={f.title} onChange={e => set('title', e.target.value)} /></div>
        <div className="field"><label>Ниша (подпись над названием)</label>
          <input value={f.niche} onChange={e => set('niche', e.target.value)} /></div>
        <div className="field"><label>Тип</label>
          <select value={f.type} onChange={e => set('type', e.target.value)}>
            <option value="miniapp">Мини-апп</option>
            <option value="site">Сайт</option>
            <option value="quiz">Квиз</option>
            <option value="bot">Бот</option>
          </select></div>
        <div className="field full"><label>Короткое описание (на карточке)</label>
          <input value={f.short_desc} onChange={e => set('short_desc', e.target.value)} /></div>
        <div className="field"><label>Теги (через запятую)</label>
          <input value={f.tags.join(', ')} onChange={e => set('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} /></div>
        <div className="field"><label>Ссылка на живой проект</label>
          <input value={f.live_url} onChange={e => set('live_url', e.target.value)} placeholder="https://…" /></div>
        <div className="field full"><label>Задача</label>
          <textarea value={f.task_md} onChange={e => set('task_md', e.target.value)} /></div>
        <div className="field full"><label>Решение</label>
          <textarea value={f.solution_md} onChange={e => set('solution_md', e.target.value)} /></div>
        <div className="field full"><label>Результат</label>
          <textarea value={f.result_md} onChange={e => set('result_md', e.target.value)} /></div>
        <div className="field full"><label>Скрины — по одной ссылке на строку (первая = обложка, если обложка пустая)</label>
          <textarea value={f.screens.join('\n')} onChange={e => set('screens', e.target.value.split('\n').map(s => s.trim()).filter(Boolean))} /></div>
        <div className="field"><label>Обложка (URL)</label>
          <input value={f.cover_url} onChange={e => set('cover_url', e.target.value)} /></div>
        <div className="field"><label>Загрузить скрин с компьютера</label>
          <input type="file" accept="image/*" onChange={upload} /></div>
        <div className="field"><label>Порядок (меньше = выше)</label>
          <input type="number" value={f.sort_order} onChange={e => set('sort_order', Number(e.target.value) || 100)} /></div>
        <div className="field"><label>Флаги</label>
          <div className="ract" style={{ paddingTop: 8 }}>
            <label className="note"><input type="checkbox" checked={f.published} onChange={e => set('published', e.target.checked)} /> опубликован</label>
            <label className="note"><input type="checkbox" checked={f.is_concept} onChange={e => set('is_concept', e.target.checked)} /> концепт (не клиент)</label>
          </div></div>
      </div>
      <div className="mrow">
        <button className="btn" disabled={busy}>{busy ? '…' : 'Сохранить'}</button>
        <button className="ghost" type="button" onClick={onDone}>Отмена</button>
      </div>
    </form>
  )
}

export default function CasesTab() {
  const [cases, setCases] = useState(null)
  const [editing, setEditing] = useState(null) // объект кейса | 'new' | null

  const load = () => supabase.from('pf_cases').select('*').order('sort_order').then(({ data }) => setCases(data || []))
  useEffect(() => { load() }, [])

  async function togglePub(c) {
    await supabase.from('pf_cases').update({ published: !c.published }).eq('id', c.id)
    load()
  }
  async function remove(c) {
    if (!window.confirm(`Удалить кейс «${c.title}»? Это действие не отменить.`)) return
    await supabase.from('pf_cases').delete().eq('id', c.id)
    load()
  }

  if (editing) return <CaseForm initial={editing === 'new' ? EMPTY : editing} onDone={() => { setEditing(null); load() }} />
  if (!cases) return <div className="loading">Загружаю…</div>

  return (
    <div className="panel">
      <div className="row">
        <div className="rmain"><h3>Кейсы ({cases.length})</h3></div>
        <div className="ract"><button className="sm gold" onClick={() => setEditing('new')}>+ Добавить кейс</button></div>
      </div>
      {cases.map(c => (
        <div className="row" key={c.id}>
          <div className="rmain">
            <div className="rname">{c.title} {c.is_concept && <span className="badge">концепт</span>}</div>
            <div className="rmeta">{c.niche} · /{c.slug} · порядок {c.sort_order}</div>
          </div>
          <div className="ract">
            <span className={'badge ' + (c.published ? 'pub' : 'hid')}>{c.published ? 'на сайте' : 'скрыт'}</span>
            <button className="sm" onClick={() => togglePub(c)}>{c.published ? 'Скрыть' : 'Показать'}</button>
            <button className="sm" onClick={() => setEditing(c)}>Править</button>
            <button className="sm warn" onClick={() => remove(c)}>Удалить</button>
          </div>
        </div>
      ))}
    </div>
  )
}
