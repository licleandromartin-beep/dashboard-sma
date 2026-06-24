"use client";

import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import DataTable, { Column } from "@/components/DataTable";
import { getMetrics, getByBarrio, getBySize, MetricResult, BarrioRow } from "@/lib/queries";
import { supabase } from "@/lib/supabase";

const fmt = (n: number) => n > 0 ? `$${n.toLocaleString("es-AR")}` : "—";

export default function CasasPage() {
  const [metrics, setMetrics] = useState<MetricResult | null>(null);
  const [barrios, setBarrios] = useState<BarrioRow[]>([]);
  const [sizes, setSizes] = useState<{ label: string; count: number; avgPricePerM2: number }[]>([]);
  const [avgM2Construido, setAvgM2Construido] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMetrics("casa"),
      getByBarrio("casa"),
      getBySize("casa", [[0, 500], [500, 1000], [1000, 2000], [2000, Infinity]]),
      supabase
        .from("inmuebles")
        .select("m2_cubiertos")
        .eq("tipo_propiedad", "casa")
        .eq("activo", true)
        .not("m2_cubiertos", "is", null)
        .then(({ data }) => {
          if (data && data.length > 0) {
            const vals = data.map((d) => Number(d.m2_cubiertos));
            return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
          }
          return 0;
        }),
    ]).then(([m, b, s, avgCub]) => {
      setMetrics(m);
      setBarrios(b);
      setSizes(s);
      setAvgM2Construido(avgCub);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-zinc-400 py-12 text-center">Cargando datos...</p>;

  const sizeColumns: Column[] = [
    { key: "label", label: "Tamaño terreno" },
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
      <h2 className="text-2xl font-bold text-zinc-900">Casas</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Precio $/m² terreno" value={fmt(metrics?.avgPricePerM2 ?? 0)} sub="Zonaprop" />
        <MetricCard label="Precio promedio" value={fmt(metrics?.avgPrice ?? 0)} sub="USD" />
        <MetricCard label="Mediana precio" value={fmt(metrics?.medianPrice ?? 0)} sub="USD" />
        <MetricCard label="Stock activo" value={String(metrics?.count ?? 0)} sub="Ofertas en Zonaprop" />
        <MetricCard label="m² construido prom." value={avgM2Construido > 0 ? `${avgM2Construido} m²` : "—"} sub="Promedio casas" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataTable
          title="Precios por Tamaño Terreno"
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
