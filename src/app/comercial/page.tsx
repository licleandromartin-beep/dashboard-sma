"use client";

import dynamic from "next/dynamic";

const ComercialClient = dynamic(() => import("@/components/ComercialClient"), {
  ssr: false,
  loading: () => <p className="text-zinc-400 py-12 text-center">Cargando datos...</p>,
});

export default function ComercialPage() {
  return <ComercialClient />;
}
