import type { SVGProps } from 'react'

export type IconName =
  | 'lock' | 'upload' | 'key' | 'shield' | 'file-text' | 'folder'
  | 'eye' | 'eye-off' | 'x' | 'check' | 'download' | 'external-link'
  | 'plus' | 'arrow-right' | 'arrow-down' | 'image' | 'sun' | 'moon' | 'alert-circle'

interface IconProps extends SVGProps<SVGSVGElement> { name: IconName; size?: number }

export default function Icon({ name, size = 20, ...props }: IconProps) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...props }
  switch (name) {
    case 'lock': return <svg {...common}><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
    case 'upload': return <svg {...common}><path d="M12 16V4M8 8l4-4 4 4M5 20h14"/></svg>
    case 'key': return <svg {...common}><circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M15 8l2 2M17 6l2 2"/></svg>
    case 'shield': return <svg {...common}><path d="M12 3 5 6v5c0 4.5 2.9 8.4 7 10 4.1-1.6 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>
    case 'file-text': return <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>
    case 'folder': return <svg {...common}><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H10l2 2h6.5A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Z"/></svg>
    case 'eye': return <svg {...common}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>
    case 'eye-off': return <svg {...common}><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.1 3.9M6.6 6.6C3.7 8.5 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.3 3.5-.7"/></svg>
    case 'x': return <svg {...common}><path d="M18 6 6 18M6 6l12 12"/></svg>
    case 'check': return <svg {...common}><path d="m5 12 4 4L19 6"/></svg>
    case 'download': return <svg {...common}><path d="M12 3v12M8 11l4 4 4-4M5 21h14"/></svg>
    case 'external-link': return <svg {...common}><path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
    case 'plus': return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>
    case 'arrow-right': return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    case 'arrow-down': return <svg {...common}><path d="M12 4v16M6 14l6 6 6-6"/></svg>
    case 'image': return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></svg>
    case 'sun': return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    case 'moon': return <svg {...common}><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/></svg>
    case 'alert-circle': return <svg {...common}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  }
}
