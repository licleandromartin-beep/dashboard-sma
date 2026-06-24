export default function CasasPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-900">Casas</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Precio $/m² construido" value="—" sub="Zonaprop" />
        <MetricCard label="Precio $/m² terreno" value="—" sub="Zonaprop" />
        <MetricCard label="Precio total promedio" value="—" sub="~150 m² construido" />
        <MetricCard label="Gap publicado vs cierre" value="—" sub="n < 5" />
        <MetricCard label="Variación 30d" value="—" sub="Índice temporal" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TablePlaceholder title="Precios por Tamaño Terreno" />
        <TablePlaceholder title="Análisis por Zona" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartPlaceholder title="Mapa interactivo" />
        <ChartPlaceholder title="Scatter: Tamaño terreno vs precio" />
        <ChartPlaceholder title="Scatter: m² construido vs precio" />
        <ChartPlaceholder title="Box plot por zona" />
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-900">{value}</p>
      <p className="mt-1 text-xs text-zinc-400">{sub}</p>
    </div>
  );
}

function TablePlaceholder({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <h3 className="text-sm font-medium text-zinc-700">{title}</h3>
      <p className="mt-4 text-center text-sm text-zinc-400 py-8">Sin datos aún</p>
    </div>
  );
}

function ChartPlaceholder({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <h3 className="text-sm font-medium text-zinc-700">{title}</h3>
      <div className="mt-4 flex h-48 items-center justify-center rounded bg-zinc-50">
        <p className="text-sm text-zinc-400">Gráfico próximamente</p>
      </div>
    </div>
  );
}
