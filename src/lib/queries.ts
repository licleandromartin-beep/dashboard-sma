import { supabase } from "./supabase";

export type PropertyType = "departamento" | "casa" | "lote urbano" | "campo" | "local comercial" | "ph";

export interface MetricResult {
  count: number;
  avgPrice: number;
  medianPrice: number;
  avgPricePerM2: number;
  medianPricePerM2: number;
}

export interface BarrioRow {
  barrio: string;
  count: number;
  avgPrice: number;
  avgPricePerM2: number;
  avgM2: number;
}

export interface AmbientesRow {
  ambientes: number;
  count: number;
  avgPrice: number;
  avgPricePerM2: number;
}

export interface IndiceRow {
  categoria: string;
  precio_m2_avg: number;
  precio_m2_med: number;
  precio_avg: number;
  cantidad: number;
}

export async function getMetrics(tipo: PropertyType): Promise<MetricResult> {
  const { data, error } = await supabase
    .from("inmuebles")
    .select("precio, precio_por_m2, m2_totales")
    .eq("tipo_propiedad", tipo)
    .eq("activo", true)
    .eq("moneda", "USD")
    .not("precio", "is", null)
    .not("precio_por_m2", "is", null);

  console.log("getMetrics result:", { tipo, error, dataLength: data?.length });
  if (error || !data || data.length === 0) {
    return { count: 0, avgPrice: 0, medianPrice: 0, avgPricePerM2: 0, medianPricePerM2: 0 };
  }

  const prices = data.map((d) => Number(d.precio)).sort((a, b) => a - b);
  const pricesM2 = data.map((d) => Number(d.precio_por_m2)).sort((a, b) => a - b);

  const median = (arr: number[]) => {
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[mid] : Math.round((arr[mid - 1] + arr[mid]) / 2);
  };

  const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

  return {
    count: data.length,
    avgPrice: avg(prices),
    medianPrice: median(prices),
    avgPricePerM2: avg(pricesM2),
    medianPricePerM2: median(pricesM2),
  };
}

export async function getByBarrio(tipo: PropertyType): Promise<BarrioRow[]> {
  const { data, error } = await supabase
    .from("inmuebles")
    .select("barrio, precio, precio_por_m2, m2_totales")
    .eq("tipo_propiedad", tipo)
    .eq("activo", true)
    .eq("moneda", "USD")
    .not("precio", "is", null)
    .not("precio_por_m2", "is", null)
    .not("barrio", "is", null);

  if (error || !data) return [];

  const grouped: Record<string, { prices: number[]; pricesM2: number[]; m2s: number[] }> = {};
  for (const row of data) {
    const b = row.barrio as string;
    if (!grouped[b]) grouped[b] = { prices: [], pricesM2: [], m2s: [] };
    grouped[b].prices.push(Number(row.precio));
    grouped[b].pricesM2.push(Number(row.precio_por_m2));
    grouped[b].m2s.push(Number(row.m2_totales));
  }

  return Object.entries(grouped)
    .map(([barrio, g]) => ({
      barrio,
      count: g.prices.length,
      avgPrice: Math.round(g.prices.reduce((a, b) => a + b, 0) / g.prices.length),
      avgPricePerM2: Math.round(g.pricesM2.reduce((a, b) => a + b, 0) / g.pricesM2.length),
      avgM2: Math.round(g.m2s.reduce((a, b) => a + b, 0) / g.m2s.length),
    }))
    .filter((r) => r.count >= 3)
    .sort((a, b) => b.count - a.count);
}

export async function getByAmbientes(): Promise<AmbientesRow[]> {
  const { data, error } = await supabase
    .from("inmuebles")
    .select("ambientes, precio, precio_por_m2")
    .eq("tipo_propiedad", "departamento")
    .eq("activo", true)
    .eq("moneda", "USD")
    .not("precio", "is", null)
    .not("precio_por_m2", "is", null)
    .not("ambientes", "is", null);

  if (error || !data) return [];

  const grouped: Record<number, { prices: number[]; pricesM2: number[] }> = {};
  for (const row of data) {
    const a = row.ambientes as number;
    if (!grouped[a]) grouped[a] = { prices: [], pricesM2: [] };
    grouped[a].prices.push(Number(row.precio));
    grouped[a].pricesM2.push(Number(row.precio_por_m2));
  }

  return Object.entries(grouped)
    .map(([amb, g]) => ({
      ambientes: Number(amb),
      count: g.prices.length,
      avgPrice: Math.round(g.prices.reduce((a, b) => a + b, 0) / g.prices.length),
      avgPricePerM2: Math.round(g.pricesM2.reduce((a, b) => a + b, 0) / g.pricesM2.length),
    }))
    .sort((a, b) => a.ambientes - b.ambientes);
}

export async function getIndices(): Promise<IndiceRow[]> {
  const { data, error } = await supabase
    .from("indices_precio")
    .select("categoria, precio_m2_avg, precio_m2_med, precio_avg, cantidad")
    .order("fecha", { ascending: false })
    .limit(10);

  if (error || !data) return [];

  const seen = new Set<string>();
  const unique: IndiceRow[] = [];
  for (const row of data) {
    if (!seen.has(row.categoria)) {
      seen.add(row.categoria);
      unique.push({
        categoria: row.categoria,
        precio_m2_avg: Number(row.precio_m2_avg),
        precio_m2_med: Number(row.precio_m2_med),
        precio_avg: Number(row.precio_avg),
        cantidad: row.cantidad,
      });
    }
  }
  return unique;
}

export async function getBySize(tipo: PropertyType, ranges: [number, number][]): Promise<{ label: string; count: number; avgPricePerM2: number }[]> {
  const { data, error } = await supabase
    .from("inmuebles")
    .select("m2_totales, precio, precio_por_m2")
    .eq("tipo_propiedad", tipo)
    .eq("activo", true)
    .eq("moneda", "USD")
    .not("precio", "is", null)
    .not("precio_por_m2", "is", null)
    .not("m2_totales", "is", null);

  if (error || !data) return [];

  return ranges.map(([min, max]) => {
    const label = max === Infinity ? `>${min.toLocaleString()} m²` : `${min.toLocaleString()}-${max.toLocaleString()} m²`;
    const filtered = data.filter((d) => Number(d.m2_totales) >= min && Number(d.m2_totales) < max);
    const pricesM2 = filtered.map((d) => Number(d.precio_por_m2));
    return {
      label,
      count: filtered.length,
      avgPricePerM2: pricesM2.length > 0 ? Math.round(pricesM2.reduce((a, b) => a + b, 0) / pricesM2.length) : 0,
    };
  });
}
