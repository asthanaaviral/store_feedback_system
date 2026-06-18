const SortableTable = ({ columns, data, sortBy, sortOrder, onSort, onRowClick, emptyMessage = 'No data found.' }) => {
  const getSortIcon = (key) => {
    if (sortBy !== key) return <span className="text-slate-300 ml-1">↕</span>;
    return sortOrder === 'asc'
      ? <span className="text-blue-500 ml-1">↑</span>
      : <span className="text-blue-500 ml-1">↓</span>;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap ${
                  col.sortable ? 'cursor-pointer select-none hover:text-slate-700' : ''
                }`}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                {col.label}
                {col.sortable && getSortIcon(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-slate-400 text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id || idx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`border-b border-slate-50 last:border-0 transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-blue-50' : 'hover:bg-slate-50'
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-slate-700">
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SortableTable;
