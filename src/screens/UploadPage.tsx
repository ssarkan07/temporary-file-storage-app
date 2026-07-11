import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveVault } from '../api/vault'
import Icon from '../component/Icon'
import ErrorPopup from '../component/ErrorPopup'
import { hashVaultId } from '../lib/crypto'

interface UploadedFile { file: File; id: string }
const formatBytes = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1024 ** 2 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 ** 2).toFixed(1)} MB`

export default function UploadPage() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const vaultInputRef = useRef<HTMLInputElement>(null)
  const [note, setNote] = useState('')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dropCode, setDropCode] = useState('')
  const [showDropCode, setShowDropCode] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalError, setModalError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return
    const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB
    const incomingFiles = Array.from(incoming)

    // Check individual file size limit
    const oversized = incomingFiles.find((file) => file.size > MAX_FILE_SIZE)
    if (oversized) {
      setError(`Each file must be less than 2 MB. "${oversized.name}" is too large.`)
      return
    }

    setFiles((current) => {
      const allFiles = [...current, ...incomingFiles.map((file) => ({ file, id: `${file.name}-${file.size}-${crypto.randomUUID()}` }))]
      const totalSize = allFiles.reduce((sum, item) => sum + item.file.size, 0)
      if (totalSize > MAX_FILE_SIZE) {
        setError('Total uploaded files size cannot exceed 2 MB.')
        return current
      }
      setError(null)
      return allFiles
    })
  }, [])

  const openConfirmation = () => {
    if (!note.trim() && !files.length) { setError('Please enter some note or upload file.'); return }
    setError(null); setModalError(null); setShowConfirmModal(true)
    window.setTimeout(() => vaultInputRef.current?.focus(), 0)
  }

  const confirmSave = async () => {
    if (!dropCode.trim()) { setModalError('Enter a drop code to continue.'); return }
    if (dropCode.trim().length < 10) { setModalError('Use at least 10 characters for your drop code.'); return }
    setModalError(null); setLoading(true)
    try {
      await saveVault(await hashVaultId(dropCode), note || null, files.map(({ file }) => file))
      setShowConfirmModal(false); setSuccess(true)
    }
    catch (reason) { setModalError(reason instanceof Error ? reason.message : 'Unable to save your drop. Please try again.') }
    finally { setLoading(false) }
  }

  const reset = () => { setSuccess(false); setNote(''); setFiles([]); setDropCode(''); setShowDropCode(false) }

  if (success) return (
    <div className="access-layout">
      <div className="access-wrap">
        <div className="access-intro">
          <div className="access-mark"><Icon name="check" size={28} /></div>
          <h1>Drop saved! 🎉</h1>
          <p>Your content is ready. Use your drop code from any device to retrieve it.</p>
          <p className="temp-note-inline"><Icon name="shield" size={13} />Content is temporary — retrieve it within 7 days.</p>
        </div>
        <div className="access-card">
          <button className="btn-primary" type="button" onClick={() => navigate('/access')}>
            <Icon name="key" size={17} />Get my Drop
          </button>
          <button className="btn-secondary" style={{ width: '100%', marginTop: 10 }} type="button" onClick={reset}>
            <Icon name="plus" size={17} />New Drop
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="workspace-page">
      <div className="workspace">
        <header className="page-heading">
          <p className="eyebrow">New Drop</p>
          <h1>Drop your stuff</h1>
          <p>Add a note, files, or both. You will set your drop code when you are ready to save.</p>
        </header>
        <div className="form-stack">
          <section className="upload-panel">
            <label className="form-label" htmlFor="note-input">Text note <span className="form-hint">Optional</span></label>
            <textarea id="note-input" className="input-field" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Paste lecture notes, code snippets, or a quick message…" />
          </section>
          <section>
            <span className="form-label">Files <span className="form-hint">Optional</span></span>
            <label
              className={`dropzone${dragging ? ' is-dragging' : ''}`}
              onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files) }}
            >
              <Icon name="upload" size={28} />
              <strong>Choose files or drop them here</strong>
              <span>Any file type accepted — PDFs, images, docs</span>
              <input ref={inputRef} type="file" multiple onChange={(event) => addFiles(event.target.files)} />
            </label>
            {files.length > 0 && (
              <div className="selected-files">
                {files.map(({ file, id }) => (
                  <div className="selected-file" key={id}>
                    <Icon name="file-text" size={18} />
                    <div className="selected-file__info">
                      <p className="selected-file__name">{file.name}</p>
                      <p className="selected-file__meta">{formatBytes(file.size)}</p>
                    </div>
                    <button className="icon-button danger" type="button" aria-label={`Remove ${file.name}`} onClick={() => setFiles((current) => current.filter((item) => item.id !== id))}>
                      <Icon name="x" size={17} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
          {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
          <div className="form-actions">
            <button className="btn-primary" type="button" onClick={openConfirmation}>
              <Icon name="lock" size={17} />Save Drop
            </button>
          </div>
        </div>
      </div>

      {/* Drop Code Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) setShowConfirmModal(false) }}>
          <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <button className="modal-close icon-button" type="button" aria-label="Close" disabled={loading} onClick={() => setShowConfirmModal(false)}>
              <Icon name="x" size={18} />
            </button>
            <div className="modal-icon"><Icon name="lock" size={22} /></div>
            <h2 id="confirm-title">Set your Drop Code</h2>
            <p>Choose a unique drop code (min. 10 characters). You will need the exact same code to retrieve your content from any device.</p>
            <label className="form-label" htmlFor="confirm-drop-code">Drop Code</label>
            <div className="input-with-action">
              <input
                ref={vaultInputRef}
                id="confirm-drop-code"
                className="input-field"
                type={showDropCode ? 'text' : 'password'}
                value={dropCode}
                onChange={(event) => setDropCode(event.target.value)}
                onKeyDown={(event) => { if (event.key === 'Enter') void confirmSave() }}
                autoComplete="new-password"
                placeholder="Choose a memorable drop code"
              />
              <button className="icon-button" type="button" aria-label={showDropCode ? 'Hide drop code' : 'Show drop code'} onClick={() => setShowDropCode((shown) => !shown)}>
                <Icon name={showDropCode ? 'eye-off' : 'eye'} size={17} />
              </button>
            </div>
            <p className="modal-temp-note"><Icon name="shield" size={13} />This is temporary storage — do not use for permanent files.</p>
            {modalError && <ErrorPopup message={modalError} onClose={() => setModalError(null)} />}
            <div className="modal-actions">
              <button className="btn-secondary" type="button" disabled={loading} onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="btn-primary" type="button" disabled={loading} onClick={() => void confirmSave()}>
                {loading ? <><span className="spinner" />Saving…</> : <><Icon name="check" size={17} />Confirm</>}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
