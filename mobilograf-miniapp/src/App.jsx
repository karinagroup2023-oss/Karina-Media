import { useState } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Portfolio from './components/Portfolio'
import Services from './components/Services'
import Contacts from './components/Contacts'

export default function App() {
  const [activePage, setActivePage] = useState('portfolio')

  const pages = {
    portfolio: <Portfolio />,
    services: <Services />,
    contacts: <Contacts />,
  }

  return (
    <div className="app">
      <Header />
      <Navigation activePage={activePage} onNavigate={setActivePage} />
      <main className="main-content">
        {pages[activePage]}
      </main>
    </div>
  )
}
