'use client';

export function DataTable({ columns = [], rows = [], emptyMessage = 'No data available.', onRowClick }) {
  if (!rows.length) {
    return (
      <div className="panel">
        <p className="p-8 text-center text-sm text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="panel overflow-x-auto hide-mobile-cards">
        <table className="data-table min-w-[640px]">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={row._id || row.id || rowIndex}
                className={onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="show-mobile-cards space-y-3">
        {rows.map((row, rowIndex) => (
          <article
            key={row._id || row.id || rowIndex}
            className={`panel panel-pad ${onRowClick ? 'cursor-pointer' : ''}`}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between py-1.5 text-sm">
                <span className="font-bold text-muted">{col.label}</span>
                <span className="text-right font-semibold text-ink">
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </span>
              </div>
            ))}
          </article>
        ))}
      </div>
    </>
  );
}
