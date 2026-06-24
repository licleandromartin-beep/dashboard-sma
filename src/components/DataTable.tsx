export interface Column {
  key: string;
  label: string;
  align?: "left" | "right";
}

interface Props {
  title: string;
  columns: Column[];
  rows: Record<string, string | number>[];
  emptyMessage?: string;
}

export default function DataTable({ title, columns, rows, emptyMessage = "Sin datos" }: Props) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 overflow-x-auto">
      <h3 className="text-sm font-medium text-zinc-700 mb-3">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-center text-sm text-zinc-400 py-8">{emptyMessage}</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`pb-2 font-medium text-zinc-500 ${col.align === "right" ? "text-right" : "text-left"} px-2`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-2 px-2 ${col.align === "right" ? "text-right tabular-nums" : "text-left"}`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
