import './section-art.css'

/** Original decorative line drawings, not observations or plotted data. */
export function SectionArt({ kind = 'trend' }: { kind?: 'trend' | 'map' | 'outlook' | 'book' | 'satellite' }) {
  return <svg className="section-art" viewBox="0 0 120 88" fill="none" aria-hidden="true" focusable="false">
    <path className="section-art-grid" d="M12 16h96M12 44h96M12 72h96M28 8v72M60 8v72M92 8v72" />
    <circle className="section-art-orbit" cx="60" cy="44" r="34" />
    {kind === 'trend' && <><path d="M27 64V25m0 39h68M38 52l16-12 15 5 17-18" /><circle cx="54" cy="40" r="3" /><circle cx="69" cy="45" r="3" /><path d="M78 27h8v8" /></>}
    {kind === 'map' && <><path d="m41 21 16 6 17-7 14 6v39l-14-6-17 7-16-6Z" /><path d="M57 27v39m17-46v39" /><circle cx="65" cy="43" r="5" /></>}
    {kind === 'outlook' && <><circle cx="60" cy="40" r="20" /><path d="M60 26v15l10 6M33 67c9-6 17 6 26 0s17 6 28 0" /><path d="m82 20 8 1-1 8" /></>}
    {kind === 'book' && <><path d="M60 30c-8-7-18-8-29-5v37c11-3 21-2 29 5 8-7 18-8 29-5V25c-11-3-21-2-29 5Zm0 0v37M39 35l12 3M39 45l12 3m18-10 12-3m-12 13 12-3" /></>}
    {kind === 'satellite' && <><g transform="rotate(-28 60 40)"><rect x="52" y="30" width="16" height="20" rx="2" /><path d="M29 32h18v16H29Zm44 0h18v16H73ZM60 20v10m0 20v9M38 32v16m44-16v16" /></g><path d="M31 74c10-7 19 7 29 0s19 7 29 0" /></>}
  </svg>
}
