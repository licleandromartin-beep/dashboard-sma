import dynamic from "next/dynamic";

const DepartamentosClient = dynamic(() => import("@/components/DepartamentosClient"), {
  ssr: false,
  loading: () => <p className="text-zinc-400 py-12 text-center">Cargando datos...</p>,
});

export default function DepartamentosPage() {
  return <DepartamentosClient />;
}
