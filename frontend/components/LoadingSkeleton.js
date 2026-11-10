'use client';

export function LoadingSkeleton({ variant = 'card', count = 1 }) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'table') {
    return (
      <div className="panel overflow-hidden animate-pulse">
        <div className="border-b border-slate-100 px-5 py-4 flex gap-6">
          {[120, 80, 90, 70].map((w, i) => (
            <div key={i} className="h-3 rounded bg-slate-200" style={{ width: w }} />
          ))}
        </div>
        {items.map((i) => (
          <div key={i} className="flex gap-6 border-b border-slate-50 px-5 py-4">
            <div className="h-4 w-32 rounded bg-slate-100" />
            <div className="h-4 w-20 rounded bg-slate-100" />
            <div className="h-4 w-24 rounded bg-slate-100" />
            <div className="h-4 w-16 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-8 w-64 rounded bg-slate-200" />
            <div className="h-4 w-48 rounded bg-slate-100" />
          </div>
          <div className="h-28 w-28 rounded-full bg-slate-100" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
          <div className="space-y-6">
            <div className="panel panel-pad space-y-4">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-3/4 rounded bg-slate-100" />
              <div className="h-3 w-5/6 rounded bg-slate-100" />
            </div>
            <div className="panel panel-pad space-y-4">
              <div className="h-5 w-48 rounded bg-slate-200" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-slate-100 p-4 space-y-2">
                  <div className="h-4 w-56 rounded bg-slate-100" />
                  <div className="h-3 w-full rounded bg-slate-50" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="panel panel-pad space-y-3">
              <div className="h-5 w-32 rounded bg-slate-200" />
              <div className="h-6 w-24 rounded-full bg-slate-100" />
              <div className="h-3 w-full rounded bg-slate-50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'stats') {
    return (
      <div className="grid-auto animate-pulse">
        {items.map((i) => (
          <div key={i} className="panel panel-pad space-y-4">
            <div className="flex justify-between">
              <div className="h-3 w-28 rounded bg-slate-200" />
              <div className="h-9 w-9 rounded-lg bg-slate-100" />
            </div>
            <div className="h-8 w-16 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  // Default: card grid
  return (
    <div className="grid-auto animate-pulse">
      {items.map((i) => (
        <div key={i} className="panel panel-pad space-y-4">
          <div className="flex justify-between">
            <div className="h-9 w-9 rounded-lg bg-slate-100" />
            <div className="h-5 w-16 rounded-full bg-slate-100" />
          </div>
          <div className="h-5 w-3/4 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-100" />
          <div className="flex justify-between items-center">
            <div className="h-5 w-20 rounded-full bg-slate-100" />
            <div className="h-4 w-12 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
