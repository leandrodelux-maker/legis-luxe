import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CrudPage } from "@/components/admin/crud-page";
import { Selo } from "@/components/admin/painel/PaginaModulo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/vereadores/mandatos")({
  component: AdminMandatos,
});

type Mandato = {
  id: string;
  vereador_id: string;
  mandato: string;
  cargo_mesa: string | null;
  partido: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  observacoes: string | null;
};

const CARGOS = [
  { label: "Presidente", value: "presidente" },
  { label: "Vice-presidente", value: "vice_presidente" },
  { label: "1º Secretário", value: "primeiro_secretario" },
  { label: "2º Secretário", value: "segundo_secretario" },
  { label: "Vereador", value: "vereador" },
];
const dataBr = (d: string | null) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString("pt-BR") : "—");

function AdminMandatos() {
  const [vereadores, setVereadores] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    supabase.from("vereadores").select("id, nome").order("nome").then(({ data }) => setVereadores((data ?? []).map((v) => ({ label: v.nome, value: v.id }))));
  }, []);

  const nomeDe = (r: Mandato) => vereadores.find((v) => v.value === r.vereador_id)?.label ?? "Vereador";
  const cargoDe = (r: Mandato) => CARGOS.find((c) => c.value === r.cargo_mesa)?.label;

  return (
    <CrudPage<Mandato>
      title="Mandatos"
      table="vereadores_mandatos"
      singular="mandato"
      nomeDe={(r) => `${nomeDe(r)} — ${r.mandato}`}
      vazio="Nenhum mandato registrado"
      orderBy={{ column: "data_inicio", ascending: false }}
      buscaEm={["mandato", "partido", "observacoes"]}
      filtros={[
        { campo: "vereador_id", rotulo: "Vereador", opcoes: vereadores },
        { campo: "mandato", rotulo: "Mandato" },
      ]}
      cartao={{
        titulo: nomeDe,
        subtitulo: (r) => `Mandato ${r.mandato}${r.partido ? ` · ${r.partido}` : ""}`,
        selo: (r) => (cargoDe(r) ? <Selo cor="#1F5FBF">{cargoDe(r)}</Selo> : null),
        rodape: (r) => `${dataBr(r.data_inicio)} a ${dataBr(r.data_fim)}`,
      }}
      columns={[
        { key: "vereador_id", label: "Vereador", render: nomeDe },
        { key: "mandato", label: "Mandato" },
        { key: "cargo_mesa", label: "Cargo na Mesa", render: (r) => cargoDe(r) ?? "—" },
        { key: "partido", label: "Partido" },
        { key: "data_inicio", label: "Início", render: (r) => dataBr(r.data_inicio) },
        { key: "data_fim", label: "Fim", render: (r) => dataBr(r.data_fim) },
      ]}
      secoes={[
        { titulo: "Mandato", campos: ["vereador_id", "mandato", "partido", "cargo_mesa"] },
        { titulo: "Período", campos: ["data_inicio", "data_fim", "observacoes"] },
      ]}
      fields={[
        { name: "vereador_id", label: "Vereador", type: "select", required: true, options: vereadores, largo: true },
        { name: "mandato", label: "Mandato", required: true, placeholder: "Ex.: 2021–2024" },
        { name: "partido", label: "Partido" },
        { name: "cargo_mesa", label: "Cargo na Mesa", type: "select", options: CARGOS, placeholder: "Sem cargo na Mesa", largo: true },
        { name: "data_inicio", label: "Início", type: "date" },
        { name: "data_fim", label: "Fim", type: "date" },
        { name: "observacoes", label: "Observações", type: "textarea" },
      ]}
    />
  );
}
