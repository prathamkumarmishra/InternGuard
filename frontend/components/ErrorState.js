import { AlertTriangle } from 'lucide-react';

export function ErrorState({ title = 'Something went wrong', message = 'An error occurred while loading this content.', onRetry }) {
  return (
    <div className="panel flex flex-col items-center py-14 text-center px-6">
      <span className="rounded-2xl bg-red-50 p-4 text-danger">
        <AlertTriangle size={32} />
      </span>
      <h2 className="mt-5 text-lg font-extrabold text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">{message}</p>
      {onRetry && (
        <button className="button-secondary mt-6" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
