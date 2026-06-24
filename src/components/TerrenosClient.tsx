"use client";

import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import DataTable, { Column } from "@/components/DataTable";
import { getMetrics, getByBarrio, getBySize, MetricResult, BarrioRow } from "@/lib/queries";

const fmt = (n: number) => n > 0 ? `$${n.toLocaleString("es-AR")}` : "—";

export default function TerrenosClient() {
  const [metrics, setMetrics] = useState<MetricResult | null>(null);
  const [barrios, setBarrios] = useState<BarrioRow[]>([]);
  const [sizes, setSizes] = useState<{ label: string; count: number; avgPricePerM2: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMetrics("lote urbano"),
      getByBarrio("lote urbano"),
      getBySize("lote urbano", [[0, 500], [500, 1000], [1000, 2000], [2000, 5000], [5000, Infinity]]),
    ]).then(([m, b, s]) => {
      setMetrics(m);
      setBarrios(b);
      setSizes(s);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-zinc-400 py-12 text-center">Cargando datos...</p>;

  const sizeColumns: Column[] = [
    { key: "label", label: "Tamaño lote" },
    { key: "count", label: "Ofertas", align: "right" },
    { key: "avgPricePerM2", label: "$/m² promedio", align: "right" },
  ];

  const barrioColumns: Column[] = [
    { key: "barrio", label: "Zona" },
    { key: "count", label: "Ofertas", align: "right" },
    { key: "avgPricePerM2", label: "$/m² promedio", align: "right" },
    { key: "avgPrice", label: "Precio promedio", align: "right" },
    { key: "avgM2", label: "m² prom.", align: "right" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-900">Terrenos / Lotes Urbanos</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Precio promedio $/m²" value={fmt(metrics?.avgPricePerM2 ?? 0)} sub="Zonaprop" />
        <MetricCard label="Precio mediano $/m²" value={fmt(metrics?.medianPricePerM2 ?? 0)} sub="Zonaprop" />
        <MetricCard label="Precio promedio" value={fmt(metrics?.avgPrice ?? 0)} sub="USD" />
        <MetricCard label="Stock activo" value={String(metrics?.count ?? 0)} sub="Ofertas en Zonaprop" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataTable
          title="Precios por Tamaño Lote"
          columns={sizeColumns}
          rows={sizes.map((s) => ({
            label: s.label,
            count: s.count,
            avgPricePerM2: fmt(s.avgPricePerM2),
          }))}
        />
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
    </div>
  );
}
