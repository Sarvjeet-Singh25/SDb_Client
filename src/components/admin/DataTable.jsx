export default function DataTable({
  columns,
  data,
  keyField = "_id",
  loading,
  emptyMessage = "No records found.",
  renderActions,
}) {
  const colSpan = columns.length + (renderActions ? 1 : 0);
  return (
    <div className="bg-white dark:bg-[#111827] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {renderActions && (
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={colSpan} className="px-6 py-10 text-center text-gray-400 text-sm">
                  Loading…
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="px-6 py-10 text-center text-gray-400 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row[keyField]} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-gray-700 dark:text-gray-300 align-top">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {renderActions && <td className="px-6 py-4 text-right align-top whitespace-nowrap">{renderActions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
