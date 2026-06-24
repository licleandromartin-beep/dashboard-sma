"use client";

import dynamic from "next/dynamic";

const CasasClient = dynamic(() => import("@/components/CasasClient"), {
  ssr: false,
  loading: () => <p className="text-zinc-400 py-12 text-center">Cargando datos...</p>,
});

export default function CasasPage() {
  return <CasasClient />;
}
