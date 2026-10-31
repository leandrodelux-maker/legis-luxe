import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CrudPage, type FieldDef } from "@/components/admin/crud-page";
import { Selo } from "@/components/admin/painel/PaginaModulo";
import { VereadorAvatar } from "@/components/vereador-avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/comissoes-membros")({
  component: AdminComissoesMembros,
});

type MembroRow = {
  id: string;
  comissao_id: string;
  vereador_id: string | null;
  nome: string;
  funcao: string;
  ordem: number;
};

function AdminComissoesMembros() {
  const [comissoes, setComissoes] = useState<{ id: string; sigla: string; nome: string }[]>([]);
  const [vereadores, setVereadores] = useState<{ id: string; nome: string; foto_url: string | null }[]>([]);

  useEffect(() => {
    (supabase as any).from("comissoes").select("id, sigla, nome").order("ordem").then(({ data }: any) => setComissoes(data ?? []));
    supabase.from("vereadores").select("id, nome, foto_url").eq("ativo", true).order("nome").then(({ data }) => setVereadores((data as any[]) ?? []));
  }, []);

  const comissaoDe = (r: MembroRow) => comissoes.find((c) => c.id === r.comissao_id);

  const fields: FieldDef[] = [
    { name: "comissao_id", label: "Comissão", type: "select", required: true, options: comissoes.map((c) => ({ label: `${c.sigla} — ${c.nome}`, value: c.id })), largo: true },
    {
      name: "vereador_id",
      label: "Vereador",
      type: "custom",
      renderCustom: (_row, form, setForm) => (
        <>
          <Select
            value={form.vereador_id || "__nenhum__"}
            onValueChange={(id) => {
              const v = vereadores.find((x) => x.id === id);
              // Escolher o vereador já preenche o nome exibido.
              setForm({ ...form, vereador_id: id === "__nenhum__" ? null : id, nome: v ? v.nome : form.nome });
            }}
          >
            <SelectTrigger id="vereador_id" className="h-10 w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__nenhum__">Não é vereador</SelectItem>
              {vereadores.map((v) => <SelectItem key={v.id} value={v.id}>{v.nome}</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">Vincula a foto e o perfil do vereador.</p>
        </>
      ),
    },
    { name: "nome", label: "Nome exibido", required: true },
    { name: "funcao", label: "Função", required: true, placeholder: "Presidente, Vice-Presidente, Relator" },
    { name: "ordem", label: "Ordem", type: "number" },
  ];

  return (
    <CrudPage<MembroRow>
      title="Membros das Comissões"
      table="comissoes_membros"
      singular="membro"
      vazio="Nenhum membro cadastrado"
      fields={fields}
      orderBy={{ column: "ordem", ascending: true }}
      defaultValues={{ ordem: 1 } as Partial<MembroRow>}
      buscaEm={["nome", "funcao"]}
      filtros={[
        { campo: "comissao_id", rotulo: "Comissão", opcoes: comissoes.map((c) => ({ label: c.sigla, value: c.id })) },
        { campo: "funcao", rotulo: "Função" },
      ]}
      cartao={{
        imagem: (r) => <VereadorAvatar nome={r.nome} foto={vereadores.find((v) => v.id === r.vereador_id)?.foto_url ?? null} size={56} />,
        titulo: (r) => r.nome,
        subtitulo: (r) => r.funcao,
        selo: (r) => <Selo cor="#1F5FBF">{comissaoDe(r)?.sigla ?? "—"}</Selo>,
        rodape: (r) => comissaoDe(r)?.nome ?? "",
      }}
      columns={[
        { key: "comissao_id", label: "Comissão", render: (r) => comissaoDe(r)?.sigla ?? "—" },
        { key: "nome", label: "Nome" },
        { key: "funcao", label: "Função" },
        { key: "ordem", label: "Ordem" },
      ]}
    />
  );
}
