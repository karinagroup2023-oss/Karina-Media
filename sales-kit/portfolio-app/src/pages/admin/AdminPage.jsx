import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardTab from './DashboardTab'
import CasesTab from './CasesTab'
import LeadsTab from './LeadsTab'
import RefsTab from './RefsTab'

const TABS = [
  { key: 'dash', label: 'Панель' },
  { key: 'cases', label: 'Кейсы' },
  { key: 'leads', label: 'Заявки' },
  { key: 'refs', label: 'Ссылки' },
]

function Login() {
  const [mode, setMode] = useState('in') // in | up
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function go(e) {
    e.preventDefault()
    setBusy(true); setMsg('')
    if (mode === 'in') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMsg('Не получилось войти: ' + error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      setMsg(error ? 'Ошибка: ' + error.message : 'Готово — проверьте почту и подтвердите e-mail, затем войдите.')
      if (!error) setMode('in')
    }
    setBusy(false)
  }

  return (
    <div className="login-box">
      <div className="brand" style={{ textAlign: 'center' }}>KARINA Media · Админка</div>
      <div className="panel">
        <h3>{mode === 'in' ? 'Вход' : 'Первый вход (регистрация)'}</h3>
        {msg && <div className="err">{msg}</div>}
        <form onSubmit={go}>
          <div className="field">
            <label>E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Пароль</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="btn" disabled={busy} style={{ width: '100%' }}>
            {busy ? '…' : mode === 'in' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="note" style={{ cursor: 'pointer' }} onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>
          {mode === 'in' ? 'Первый вход? Зарегистрируйтесь с e-mail из списка админов' : '← Уже есть аккаунт? Войти'}
        </p>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [session, setSession] = useState(undefined)
  const [isAdmin, setIsAdmin] = useState(undefined)
  const [tab, setTab] = useState('dash')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setIsAdmin(undefined); return }
    // RLS пускает в pf_admins только админов: пустой ответ = нет доступа
    supabase.from('pf_admins').select('email').limit(1)
      .then(({ data }) => setIsAdmin(!!(data && data.length)))
  }, [session])

  if (session === undefined) return <div className="wrap"><div className="loading">Загрузка…</div></div>
  if (!session) return <div className="wrap"><Login /></div>

  if (isAdmin === undefined) return <div className="wrap"><div className="loading">Проверяю доступ…</div></div>
  if (!isAdmin) return (
    <div className="wrap">
      <div className="login-box panel">
        <h3>Нет доступа</h3>
        <p className="note">Аккаунт {session.user.email} не входит в список администраторов.</p>
        <button className="sm" style={{ marginTop: 12 }} onClick={() => supabase.auth.signOut()}>Выйти</button>
      </div>
    </div>
  )

  return (
    <div className="wrap">
      <div className="abar">
        <div className="brand">KARINA Media · Админка</div>
        <div className="tabs">
          {TABS.map(t => (
            <button key={t.key} className={'tab' + (tab === t.key ? ' on' : '')} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>
        <button className="sm" onClick={() => supabase.auth.signOut()}>Выйти</button>
      </div>
      {tab === 'dash' && <DashboardTab />}
      {tab === 'cases' && <CasesTab />}
      {tab === 'leads' && <LeadsTab />}
      {tab === 'refs' && <RefsTab />}
    </div>
  )
}
