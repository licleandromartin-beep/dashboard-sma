"use client";

import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import DataTable, { Column } from "@/components/DataTable";
import { getMetrics, getByBarrio, getByAmbientes, getIndices, MetricResult, BarrioRow, AmbientesRow, IndiceRow } from "@/lib/queries";

const fmt = (n: number) => n > 0 ? `$${n.toLocaleString("es-AR")}` : "—";

export default function DepartamentosClient() {
  const [metrics, setMetrics] = useState<MetricResult | null>(null);
  const [barrios, setBarrios] = useState<BarrioRow[]>([]);
  const [ambientes, setAmbientes] = useState<AmbientesRow[]>([]);
  const [indices, setIndices] = useState<IndiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getMetrics("departamento"),
      getByBarrio("departamento"),
      getByAmbientes(),
      getIndices("departamento"),
    ]).then(([m, b, a, i]) => {
      setMetrics(m);
      setBarrios(b);
      setAmbientes(a);
      setIndices(i);
      setLoading(false);
    }).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-zinc-400 py-12 text-center">Cargando datos...</p>;
  if (error) return <p className="text-red-500 py-12 text-center">Error: {error}</p>;

  const barrioColumns: Column[] = [
    { key: "barrio", label: "Zona" },
    { key: "count", label: "Ofertas", align: "right" },
    { key: "avgPricePerM2", label: "$/m² promedio", align: "right" },
    { key: "avgPrice", label: "Precio promedio", align: "right" },
    { key: "avgM2", label: "m² prom.", align: "right" },
  ];

  const ambColumns: Column[] = [
    { key: "ambientes", label: "Ambientes" },
    { key: "count", label: "Ofertas", align: "right" },
    { key: "avgPricePerM2", label: "$/m² promedio", align: "right" },
    { key: "avgPrice", label: "Precio promedio", align: "right" },
  ];

  const indiceColumns: Column[] = [
    { key: "categoria", label: "Categoría" },
    { key: "cantidad", label: "Cantidad", align: "right" },
    { key: "precio_m2_avg", label: "$/m² promedio", align: "right" },
    { key: "precio_m2_med", label: "$/m² mediana", align: "right" },
    { key: "precio_avg", label: "Precio promedio", align: "right" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-900">Departamentos</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Precio promedio $/m²" value={fmt(metrics?.avgPricePerM2 ?? 0)} sub="Zonaprop" />
        <MetricCard label="Precio mediano $/m²" value={fmt(metrics?.medianPricePerM2 ?? 0)} sub="Zonaprop" />
        <MetricCard label="Precio promedio total" value={fmt(metrics?.avgPrice ?? 0)} sub="USD" />
        <MetricCard label="Mediana precio total" value={fmt(metrics?.medianPrice ?? 0)} sub="USD" />
        <MetricCard label="Stock activo" value={String(metrics?.count ?? 0)} sub="Ofertas en Zonaprop" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataTable
          title="Precios por Ambientes"
          columns={ambColumns}
          rows={ambientes.map((a) => ({
            ambientes: `${a.ambientes} amb.`,
            count: a.count,
            avgPricePerM2: fmt(a.avgPricePerM2),
            avgPrice: fmt(a.avgPrice),
          }))}
        />
        <DataTable
          title="Índices por Estado/Categoría"
          columns={indiceColumns}
          rows={indices.map((i) => ({
            categoria: i.categoria,
            cantidad: i.cantidad,
            precio_m2_avg: fmt(i.precio_m2_avg),
            precio_m2_med: fmt(i.precio_m2_med),
            precio_avg: fmt(i.precio_avg),
          }))}
        />
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
