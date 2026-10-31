import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CrudPage } from "@/components/admin/crud-page";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/vereadores/galeria")({
  component: AdminGaleria,
});

type Item = {
  id: string;
  vereador_id: string;
  url: string;
  legenda: string | null;
  ordem: number | null;
};

function AdminGaleria() {
  const [vereadores, setVereadores] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    supabase.from("vereadores").select("id, nome").order("nome").then(({ data }) => setVereadores((data ?? []).map((v) => ({ label: v.nome, value: v.id }))));
  }, []);

  const nomeDe = (r: Item) => vereadores.find((v) => v.value === r.vereador_id)?.label ?? "Vereador";
  const miniatura = (r: Item, tamanho: string) => (
    <img src={r.url} alt={r.legenda ?? `Imagem de ${nomeDe(r)}`} className={`${tamanho} rounded-xl object-cover border border-border bg-muted`} onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.2"; }} />
  );

  return (
    <CrudPage<Item>
      title="Galeria dos Vereadores"
      table="vereadores_galeria"
      singular="imagem"
      feminino
      nomeDe={(r) => r.legenda ?? `imagem de ${nomeDe(r)}`}
      vazio="Nenhuma imagem na galeria"
      orderBy={{ column: "created_at", ascending: false }}
      defaultValues={{ ordem: 0 }}
      buscaEm={["legenda"]}
      filtros={[{ campo: "vereador_id", rotulo: "Vereador", opcoes: vereadores }]}
      cartao={{
        imagem: (r) => miniatura(r, "w-24 h-24"),
        titulo: nomeDe,
        subtitulo: (r) => r.legenda ?? "Sem legenda",
        rodape: (r) => `Ordem ${r.ordem ?? 0}`,
      }}
      columns={[
        { key: "url", label: "Imagem", render: (r) => miniatura(r, "w-14 h-14") },
        { key: "vereador_id", label: "Vereador", render: nomeDe },
        { key: "legenda", label: "Legenda" },
        { key: "ordem", label: "Ordem" },
      ]}
      secoes={[
        { titulo: "Imagem", campos: ["url"] },
        { titulo: "Detalhes", campos: ["vereador_id", "legenda", "ordem"] },
      ]}
      fields={[
        { name: "url", label: "Arquivo da imagem", type: "file", arquivo: "imagem", required: true },
        { name: "vereador_id", label: "Vereador", type: "select", required: true, options: vereadores, largo: true },
        { name: "legenda", label: "Legenda", ajuda: "Também é lida por quem usa leitor de tela." },
        { name: "ordem", label: "Ordem", type: "number" },
      ]}
    />
  );
}
