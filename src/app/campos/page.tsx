"use client";

import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import DataTable, { Column } from "@/components/DataTable";
import { getMetrics, getByBarrio, MetricResult, BarrioRow } from "@/lib/queries";
import { supabase } from "@/lib/supabase";

const fmt = (n: number) => n > 0 ? `$${n.toLocaleString("es-AR")}` : "—";

export default function CamposPage() {
  const [metrics, setMetrics] = useState<MetricResult | null>(null);
  const [barrios, setBarrios] = useState<BarrioRow[]>([]);
  const [sizes, setSizes] = useState<{ label: string; count: number; avgPricePerHa: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMetrics("campo"),
      getByBarrio("campo"),
      supabase
        .from("inmuebles")
        .select("m2_totales, precio")
        .eq("tipo_propiedad", "campo")
        .eq("activo", true)
        .eq("moneda", "USD")
        .not("precio", "is", null)
        .not("m2_totales", "is", null)
        .then(({ data }) => {
          if (!data) return [];
          const ranges: [number, number, string][] = [
            [0, 100000, "<10 ha"],
            [100000, 500000, "10-50 ha"],
            [500000, 1000000, "50-100 ha"],
            [1000000, Infinity, ">100 ha"],
          ];
          return ranges.map(([min, max, label]) => {
            const filtered = data.filter((d) => Number(d.m2_totales) >= min && Number(d.m2_totales) < max);
            const haValues = filtered.map((d) => (Number(d.precio) / Number(d.m2_totales)) * 10000);
            return {
              label,
              count: filtered.length,
              avgPricePerHa: haValues.length > 0 ? Math.round(haValues.reduce((a, b) => a + b, 0) / haValues.length) : 0,
            };
          });
        }),
    ]).then(([m, b, s]) => {
      setMetrics(m);
      setBarrios(b);
      setSizes(s);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-zinc-400 py-12 text-center">Cargando datos...</p>;

  const avgPricePerHa = metrics && metrics.avgPricePerM2 > 0 ? Math.round(metrics.avgPricePerM2 * 10000) : 0;

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
          rows={sizes.map((s) => ({
            label: s.label,
            count: s.count,
            avgPricePerHa: fmt(s.avgPricePerHa),
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
