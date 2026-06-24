"use client";

import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import DataTable, { Column } from "@/components/DataTable";
import { getMetrics, getByBarrio, getBySize, MetricResult, BarrioRow } from "@/lib/queries";

const fmt = (n: number) => n > 0 ? `$${n.toLocaleString("es-AR")}` : "—";

export default function CamposClient() {
  const [metrics, setMetrics] = useState<MetricResult | null>(null);
  const [barrios, setBarrios] = useState<BarrioRow[]>([]);
  const [sizes, setSizes] = useState<{ label: string; count: number; avgPricePerM2: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMetrics("campo"),
      getByBarrio("campo"),
      getBySize("campo", [[0, 50000], [50000, 100000], [100000, Infinity]]),
    ]).then(([m, b, s]) => {
      setMetrics(m);
      setBarrios(b);
      setSizes(s);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-zinc-400 py-12 text-center">Cargando datos...</p>;

  const avgPricePerHa = metrics && metrics.avgPricePerM2 > 0 ? Math.round(metrics.avgPricePerM2 * 10000) : 0;

  const sizeLabels = ["0-5 ha", "5-10 ha", ">10 ha"];
  const sizeColumns: Column[] = [
    { key: "label", label: "Tamaño campo" },
    { key: "count", label: "Ofertas", align: "right" },
    { key: "avgPricePerHa", label: "$/ha promedio", align: "right" },
  ];

  const barrioColumns: Column[] = [
    { key: "barrio", label: "Zona" },
    { key: "count", label: "Ofertas", align: "right" },
    { key: "avgPricePerM2", label: "$/m² promedio", align: "right" },
    { key: "avgPrice", label: "Precio promedio", align: "right" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-900">Campos</h2>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Pocas transacciones. Datos actualizados según disponibilidad.
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Precio promedio $/ha" value={fmt(avgPricePerHa)} sub="Zonaprop" />
        <MetricCard label="Precio promedio $/m²" value={fmt(metrics?.avgPricePerM2 ?? 0)} sub="Comparativa" />
        <MetricCard label="Precio promedio" value={fmt(metrics?.avgPrice ?? 0)} sub="USD" />
        <MetricCard label="Stock activo" value={String(metrics?.count ?? 0)} sub="Ofertas en Zonaprop" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataTable
          title="Precios por Tamaño Campo"
          columns={sizeColumns}
          rows={sizes.map((s, i) => ({
            label: sizeLabels[i] || s.label,
            count: s.count,
            avgPricePerHa: fmt(s.avgPricePerM2 > 0 ? Math.round(s.avgPricePerM2 * 10000) : 0),
          }))}
        />
        {barrios.length > 0 && (
          <DataTable
            title="Análisis por Zona"
            columns={barrioColumns}
            rows={barrios.map((b) => ({
              barrio: b.barrio,
              count: b.count,
              avgPricePerM2: fmt(b.avgPricePerM2),
              avgPrice: fmt(b.avgPrice),
            }))}
          />
        )}
      </div>
    </div>
  );
}
