import { useLocation, useNavigate } from 'react-router-dom'
import type { VaultData } from '../api/vault'
import FileCard from '../component/FileCard'
import Icon from '../component/Icon'
import NoteCard from '../component/NoteCard'

export default function VaultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = (location.state as { vaultData?: VaultData } | null)?.vaultData
  if (!data) return <div className="access-layout"><div className="access-wrap"><div className="empty-state"><Icon name="lock" size={34} /><h2>Open your vault again</h2><p>For privacy, vault details are not stored in the page address. Enter your vault ID to continue.</p><button className="btn-primary" type="button" onClick={() => navigate('/access')}><Icon name="key" size={17} />Go to access</button></div></div></div>
  const total = data.notes.length + data.files.length
  return <div className="workspace-page"><div className="workspace"><header className="vault-header"><div><div className="vault-header__title"><span className="vault-header__icon"><Icon name="lock" size={20} /></span><h1>Your vault</h1></div><p>{total ? `${total} saved item${total === 1 ? '' : 's'}` : 'This vault is empty.'}</p></div><div className="vault-actions"><button className="btn-secondary" type="button" onClick={() => navigate('/upload')}><Icon name="plus" size={15} />Add content</button><button className="btn-secondary" type="button" onClick={() => navigate('/access')}><Icon name="key" size={15} />Open another</button></div></header>
    {!total && <section className="empty-state"><Icon name="folder" size={36} /><h2>Nothing saved yet</h2><p>Add a note or file to keep this vault useful.</p><button className="btn-primary" type="button" onClick={() => navigate('/upload')}><Icon name="upload" size={17} />Add content</button></section>}
    {data.notes.length > 0 && <section className="content-section"><h2 className="content-section__title"><Icon name="file-text" size={18} />Notes <span className="count-badge">{data.notes.length}</span></h2><div className="notes-list">{data.notes.map((note, index) => <NoteCard key={note.id} note={note} index={index} />)}</div></section>}
    {data.files.length > 0 && <section className="content-section"><h2 className="content-section__title"><Icon name="folder" size={18} />Files <span className="count-badge">{data.files.length}</span></h2><div className="files-grid">{data.files.map((file) => <FileCard key={file.id} file={file} />)}</div></section>}
  </div></div>
}
