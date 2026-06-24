"use client";

import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import DataTable, { Column } from "@/components/DataTable";
import { getMetrics, getByBarrio, MetricResult, BarrioRow } from "@/lib/queries";

const fmt = (n: number) => n > 0 ? `$${n.toLocaleString("es-AR")}` : "—";

export default function ComercialClient() {
  const [metrics, setMetrics] = useState<MetricResult | null>(null);
  const [barrios, setBarrios] = useState<BarrioRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMetrics("local comercial"),
      getByBarrio("local comercial"),
    ]).then(([m, b]) => {
      setMetrics(m);
      setBarrios(b);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-zinc-400 py-12 text-center">Cargando datos...</p>;

  const barrioColumns: Column[] = [
    { key: "barrio", label: "Zona" },
    { key: "count", label: "Ofertas", align: "right" },
    { key: "avgPricePerM2", label: "$/m² promedio", align: "right" },
    { key: "avgPrice", label: "Precio promedio", align: "right" },
    { key: "avgM2", label: "m² prom.", align: "right" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-900">Locales Comerciales</h2>

      {(metrics?.count ?? 0) < 10 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Pocas ofertas disponibles. Los promedios pueden no ser representativos.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Precio promedio $/m²" value={fmt(metrics?.avgPricePerM2 ?? 0)} sub="Zonaprop" />
        <MetricCard label="Precio mediano $/m²" value={fmt(metrics?.medianPricePerM2 ?? 0)} sub="Zonaprop" />
        <MetricCard label="Precio promedio" value={fmt(metrics?.avgPrice ?? 0)} sub="USD" />
        <MetricCard label="Stock activo" value={String(metrics?.count ?? 0)} sub="Ofertas en Zonaprop" />
      </div>

      <DataTable
        title="Análisis por Zona"
        columns={barrioColumns}
        rows={barrios.map((b) => ({
          barrio: b.barrio,
          count: b.count,
          avgPricePerM2: fmt(b.avgPricePerM2),
          avgPrice: fmt(b.avgPrice),
          avgM2: `${b.avgM2} m²`,
        }))}
      />
    </div>
  );
}
