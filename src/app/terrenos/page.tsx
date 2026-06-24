import dynamic from "next/dynamic";

const TerrenosClient = dynamic(() => import("@/components/TerrenosClient"), {
  ssr: false,
  loading: () => <p className="text-zinc-400 py-12 text-center">Cargando datos...</p>,
});

export default function TerrenosPage() {
  return <TerrenosClient />;
}
