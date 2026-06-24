import dynamic from "next/dynamic";

const CamposClient = dynamic(() => import("@/components/CamposClient"), {
  ssr: false,
  loading: () => <p className="text-zinc-400 py-12 text-center">Cargando datos...</p>,
});

export default function CamposPage() {
  return <CamposClient />;
}
