import { useNavigate } from 'react-router-dom'
import Icon from '../component/Icon'

const steps = [
  { icon: 'key' as const, title: 'Create a Drop Code', text: 'Pick any passphrase (min. 10 chars) as your drop code — no account needed.' },
  { icon: 'upload' as const, title: 'Drop your stuff', text: 'Add lecture notes, assignments, or any files in one quick upload.' },
  { icon: 'arrow-right' as const, title: 'Access from anywhere', text: 'Enter the same drop code from any device to instantly retrieve your content.' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-content">
          <p className="eyebrow"><span className="status-dot" />Free · Temporary · No login</p>
          <h1 className="hero-title">Drop it.<br /><span>Retrieve it. Done.</span></h1>
          <p className="hero-copy">The fastest way for students to move notes and files between devices — just pick a drop code, upload, and access from anywhere.</p>



          {/* Two rounded square action cards */}
          <div className="vault-cards-row">
            <button className="vault-card" type="button" onClick={() => navigate('/upload')}>
              <span className="vault-card__icon"><Icon name="upload" size={28} /></span>
              <span className="vault-card__label">New Drop</span>
              <span className="vault-card__sub">Upload notes or files</span>
            </button>
            <button className="vault-card vault-card--secondary" type="button" onClick={() => navigate('/access')}>
              <span className="vault-card__icon"><Icon name="key" size={28} /></span>
              <span className="vault-card__label">Get my Drop</span>
              <span className="vault-card__sub">Retrieve with your drop code</span>
            </button>
          </div>

          {/* How it works scroll link */}
          <button
            className="how-toggle"
            type="button"
            onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            How it Works
            <span className="how-toggle__arrow">▾</span>
          </button>
        </div>
      </section>

      {/* Steps section */}
      <section id="how-it-works" className="steps-section">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2>Simple by design.</h2>
          <p>Three steps to move your study material between devices.</p>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <article className="step-card" key={step.title}>
              <span className="step-number">0{index + 1}</span>
              <span className="step-icon"><Icon name={step.icon} size={22} /></span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-note">
        <Icon name="shield" size={20} />
        <p>Use a drop code that is hard to guess. Content is temporary and may be cleared periodically — do not store anything critical long-term.</p>
      </section>
    </div>
  )
}
