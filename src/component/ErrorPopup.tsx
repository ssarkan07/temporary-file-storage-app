import Icon from './Icon'

interface ErrorPopupProps {
  message: string
  onClose: () => void
}

export default function ErrorPopup({ message, onClose }: ErrorPopupProps) {
  return (
    <div className="error-popup-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="error-popup-card" role="dialog" aria-modal="true" aria-labelledby="error-title">
        <div className="error-popup-icon">
          <Icon name="alert-circle" size={24} />
        </div>
        <h3 id="error-title" className="error-popup-title">Warning</h3>
        <p className="error-popup-message">{message}</p>
        <button className="btn-primary error-popup-close-btn" type="button" onClick={onClose}>
          Dismiss
        </button>
      </div>
    </div>
  )
}
