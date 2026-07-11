import type { FileRecord } from '../api/vault'
import { getFileUrl } from '../api/vault'
import Icon from './Icon'

interface FileCardProps { file: FileRecord }
const formatBytes = (size: number | null) => !size ? 'Unknown size' : size < 1024 ? `${size} B` : size < 1024 ** 2 ? `${(size / 1024).toFixed(1)} KB` : `${(size / 1024 ** 2).toFixed(1)} MB`
const isImage = (type: string | null, name: string) => type?.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(name)
const isPdf = (type: string | null, name: string) => type === 'application/pdf' || /\.pdf$/i.test(name)

export default function FileCard({ file }: FileCardProps) {
  const url = getFileUrl(file.storage_path)
  const image = isImage(file.file_type, file.file_name)
  return <article className="file-card">{image && <div className="file-card__preview"><img src={url} alt={file.file_name} /></div>}<div className="file-card__details"><span className="file-card__icon"><Icon name={image ? 'image' : 'file-text'} size={18} /></span><div style={{ minWidth: 0 }}><p className="file-card__name">{file.file_name}</p><p className="file-card__meta">{formatBytes(file.file_size)}</p></div></div><div className="file-card__actions">{isPdf(file.file_type, file.file_name) && <a className="btn-secondary" href={url} target="_blank" rel="noreferrer"><Icon name="external-link" size={15} />Preview</a>}<a className="btn-primary" href={url} download={file.file_name}><Icon name="download" size={15} />Download</a></div></article>
}
