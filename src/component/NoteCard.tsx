import type { NoteRecord } from '../api/vault'
import Icon from './Icon'

interface NoteCardProps { note: NoteRecord; index: number }
const date = (value: string) => new Date(value).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function NoteCard({ note }: NoteCardProps) {
  return <article className="note-card"><div className="note-card__header"><span><Icon name="file-text" size={14} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />Note</span><time>{date(note.created_at)}</time></div><pre>{note.content}</pre></article>
}
