import { ExternalLink, FileText, Image, Link2 } from 'lucide-react';

const typeIcons = { URL: Link2, SCREENSHOT_METADATA: Image, DOCUMENT_METADATA: FileText, TEXT: FileText };

export function EvidenceCard({ type = 'TEXT', reference, description }) {
  const Icon = typeIcons[type] || FileText;
  const isUrl = type === 'URL' && /^https?:\/\//.test(reference);

  return (
    <article className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
      <span className="shrink-0 rounded-lg bg-slate-50 p-2 text-muted">
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">{type.replaceAll('_', ' ')}</p>
        {isUrl ? (
          <a href={reference} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 text-sm font-bold text-brand break-all">
            {reference} <ExternalLink size={13} />
          </a>
        ) : (
          <p className="mt-1 text-sm font-semibold text-ink break-all">{reference}</p>
        )}
        {description && <p className="mt-1 text-xs leading-5 text-muted">{description}</p>}
      </div>
    </article>
  );
}
