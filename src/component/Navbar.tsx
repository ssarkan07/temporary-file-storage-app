import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'

type Theme = 'light' | 'dark'
const automaticTheme = (): Theme => { const hour = new Date().getHours(); return hour >= 18 || hour < 6 ? 'dark' : 'light' }

export default function Navbar() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('studydrop-theme') as Theme | null) ?? automaticTheme())
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('studydrop-theme', theme) }, [theme])
  const toggleTheme = () => setTheme((current) => current === 'dark' ? 'light' : 'dark')

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        {/* Brand */}
        <Link className="brand" to="/" aria-label="StudyDrop — Home">
          <span className="brand-mark"><Icon name="lock" size={18} /></span>
          <span>StudyDrop</span>
        </Link>

        {/* Right side: theme toggle switch */}
        <div className="nav-right">
          <button
            className={`theme-switch${theme === 'dark' ? ' theme-switch--dark' : ''}`}
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className="theme-switch__track">
              <span className="theme-switch__thumb">
                <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={12} />
              </span>
            </span>
            <span className="theme-switch__label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </nav>
    </header>
  )
}
