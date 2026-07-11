import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { VaultData } from '../api/vault'
import { getVault } from '../api/vault'
import Icon from '../component/Icon'
import ErrorPopup from '../component/ErrorPopup'
import { hashVaultId } from '../lib/crypto'

export default function AccessPage() {
  const navigate = useNavigate()
  const [dropCode, setDropCode] = useState('')
  const [showDropCode, setShowDropCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const access = async () => {
    if (!dropCode.trim()) { setError('Enter your drop code to continue.'); return }
    setError(null); setLoading(true)
    try {
      const data: VaultData | null = await getVault(await hashVaultId(dropCode))
      if (!data) { setError('We could not find a drop for that code. Double-check and try again.'); return }
      navigate('/vault', { state: { vaultData: data } })
    }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to open your drop. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="access-layout">
      <div className="access-wrap">
        <header className="access-intro">
          <div className="access-mark"><Icon name="key" size={27} /></div>
          <h1>Get my Drop</h1>
          <p>Enter the drop code you created to instantly access your saved notes and files.</p>
        </header>
        <section className="access-card">
          <label className="form-label" htmlFor="access-drop-code">Drop Code</label>
          <div className="input-with-action">
            <input
              id="access-drop-code"
              className="input-field"
              type={showDropCode ? 'text' : 'password'}
              value={dropCode}
              onChange={(event) => setDropCode(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') void access() }}
              autoComplete="off"
              placeholder="Enter your drop code"
            />
            <button className="icon-button" type="button" aria-label={showDropCode ? 'Hide drop code' : 'Show drop code'} onClick={() => setShowDropCode((shown) => !shown)}>
              <Icon name={showDropCode ? 'eye-off' : 'eye'} size={17} />
            </button>
          </div>
          {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
          <button className="btn-primary" type="button" disabled={loading} onClick={access}>
            {loading ? <><span className="spinner" />Retrieving…</> : <><Icon name="arrow-right" size={17} />Get my Drop</>}
          </button>
          <p className="access-secondary">No drop yet? <Link className="text-link" to="/upload">Create one</Link></p>
        </section>
        <p className="access-footnote">
          <Icon name="shield" size={16} />
          <span>Content is temporary. Avoid storing critical or sensitive data long-term.</span>
        </p>
      </div>
    </div>
  )
}
