import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CrudPage } from "@/components/admin/crud-page";
import { Selo } from "@/components/admin/painel/PaginaModulo";
import { VereadorAvatar } from "@/components/vereador-avatar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/mesa-diretora")({
  component: AdminMesaDiretora,
});

type MesaMember = {
  id: string;
  vereador_id: string;
  cargo: string;
  ativo: boolean;
  ordem: number;
};

type Vereador = { id: string; nome: string; foto_url: string | null };

function AdminMesaDiretora() {
  const [vereadores, setVereadores] = useState<Vereador[]>([]);

  useEffect(() => {
    supabase.from("vereadores").select("id, nome, foto_url").eq("ativo", true).order("nome").then(({ data }) => setVereadores((data as Vereador[]) ?? []));
  }, []);

  const vereadorDe = (r: MesaMember) => vereadores.find((v) => v.id === r.vereador_id);
  const nomeDe = (r: MesaMember) => vereadorDe(r)?.nome ?? "Vereador";
  const situacao = (r: MesaMember) => <Selo cor={r.ativo ? "#0B7A4B" : "#6B7280"}>{r.ativo ? "Ativo" : "Inativo"}</Selo>;

  return (
    <CrudPage<MesaMember>
      title="Mesa Diretora"
      table="mesa_diretora"
      singular="membro"
      nomeDe={(r) => `${nomeDe(r)} (${r.cargo})`}
      vazio="Nenhum membro na Mesa Diretora"
      orderBy={{ column: "ordem", ascending: true }}
      defaultValues={{ ativo: true, ordem: 0 }}
      buscaEm={["cargo"]}
      cartao={{
        imagem: (r) => <VereadorAvatar nome={nomeDe(r)} foto={vereadorDe(r)?.foto_url ?? null} size={64} />,
        titulo: nomeDe,
        subtitulo: (r) => r.cargo,
        selo: situacao,
        rodape: (r) => `Ordem ${r.ordem}`,
      }}
      columns={[
        { key: "vereador_id", label: "Vereador", render: nomeDe },
        { key: "cargo", label: "Cargo" },
        { key: "ordem", label: "Ordem" },
        { key: "ativo", label: "Situação", render: situacao },
      ]}
      secoes={[
        { titulo: "Membro", campos: ["vereador_id", "cargo"] },
        { titulo: "Exibição no site", campos: ["ativo", "ordem"] },
      ]}
      fields={[
        { name: "vereador_id", label: "Vereador", type: "select", required: true, options: vereadores.map((v) => ({ label: v.nome, value: v.id })) },
        { name: "cargo", label: "Cargo na Mesa", required: true, placeholder: "Ex.: Presidente, 1º Secretário" },
        { name: "ativo", label: "Situação", type: "checkbox", placeholder: "Mostrar na Mesa Diretora do site" },
        { name: "ordem", label: "Ordem de exibição", type: "number", ajuda: "Os menores aparecem primeiro." },
      ]}
    />
  );
}
