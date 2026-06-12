# Painel Administrativo Master — Portal da Câmara

Reestruturação completa do `/admin` com layout moderno, sidebar recolhível e 7 módulos novos/expandidos.

## Arquitetura

```text
src/routes/admin/
  route.tsx                 -> layout com AdminSidebar + header + Outlet
  dashboard.tsx             -> KPIs + gráficos + últimas publicações
  configuracoes/
    geral.tsx               -> dados institucionais
    identidade.tsx          -> cores, fontes, favicon, logos
    home.tsx                -> banner, textos, atalhos, ordem dos blocos
    menu.tsx                -> menus do site com drag-and-drop
    seo.tsx                 -> meta tags, OG, Analytics, GTM
    lgpd.tsx                -> cookies, privacidade, termos
  (mantém) vereadores, sessoes, projetos, comunicacao, transparencia, acesso-rapido
src/components/admin/
  AdminSidebar.tsx          -> sidebar recolhível com grupos e submenus
  AdminTopbar.tsx           -> breadcrumb + user menu + toggle
  StatCard.tsx, ChartCard.tsx
  ColorPicker.tsx, LogoUploader.tsx, MenuBuilder.tsx
```

## Módulos

**Dashboard** — Cards com totais (vereadores, notícias, sessões, documentos, projetos), gráfico de linha de publicações por mês (Recharts), lista de últimas 5 publicações de cada tipo. Acessos serão um placeholder (não há tabela de analytics ainda — usa contagens reais do banco).

**Configurações Gerais** — Estende `site_settings` com: nome_camara, whatsapp, endereco, redes_sociais (jsonb), footer_text. Formulário em seções.

**Identidade Visual** — Novas colunas em `site_settings`: cor_primaria, cor_secundaria, cor_destaque, cor_menu, cor_botoes, cor_cards, fonte_titulo, fonte_corpo, favicon_url, logo_claro_url, logo_escuro_url. Color pickers + previews. Aplica via CSS vars no root.

**Home Page** — Já existe hero; adiciona: botao_texto, botao_url, ordem_blocos (jsonb array de IDs). Reaproveita `acesso_rapido` para atalhos.

**Menu do Site** — Nova tabela `site_menus` (id, label, url, parent_id, ordem, ativo). Builder com drag-and-drop usando `@dnd-kit` (já no projeto via shadcn? — instalar se faltar). Suporta submenu ilimitado via parent_id.

**SEO** — Novas colunas: seo_title, seo_description, og_image_url, google_analytics_id, gtm_id. Injetados em `__root.tsx` via head().

**LGPD** — Novas colunas: cookies_enabled, cookies_text, privacy_policy (text rich), terms_of_use (text rich). Banner de cookies no site público.

## Migrações de banco

1. ALTER `site_settings` adicionando ~25 colunas novas (defaults seguros)
2. CREATE `site_menus` com RLS (read público, write admin via has_role)
3. Grants padrão

## UI/UX

- Sidebar `collapsible="icon"` com grupos: Visão Geral, Conteúdo, Configurações, Sistema
- Cores semânticas via tokens em `styles.css`
- Cards com sombra suave, bordas arredondadas, animações fade-up
- Responsivo (mobile drawer)
- Loading states com Skeleton, empty states ilustrados

## Fora de escopo

- Sistema real de analytics de acessos (apenas placeholder)
- Editor visual drag-and-drop da home (apenas reordenação de blocos por lista)
- Versionamento/histórico de alterações
- Tradução/multi-idioma

Confirma para eu implementar? É um trabalho grande — vou em uma sequência de migrações + componentes + rotas.
