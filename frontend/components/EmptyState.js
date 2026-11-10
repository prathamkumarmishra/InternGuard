import Link from 'next/link';
import { Inbox } from 'lucide-react';

export function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description = '', action, actionHref, actionLabel = 'Get started' }) {
  return (
    <div className="panel panel-pad flex flex-col items-center py-14 text-center">
      <span className="rounded-2xl bg-slate-100 p-4 text-muted">
        <Icon size={32} />
      </span>
      <h2 className="mt-5 text-lg font-extrabold text-ink">{title}</h2>
      {description && <p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>}
      {actionHref && (
        <Link href={actionHref} className="button-primary mt-6 inline-flex items-center gap-2 no-underline">
          {actionLabel}
        </Link>
      )}
      {action && !actionHref && (
        <button className="button-primary mt-6" onClick={action}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
