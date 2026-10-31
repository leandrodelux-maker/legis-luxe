// Copia o texto oficial das leis federais do catálogo (catalogo.mjs) do Portal da Legislação do Planalto
// para public/leis-federais/, já limpo: só a estrutura do texto (parágrafos, negrito, tabelas, links),
// com os trechos revogados marcados e um id por artigo ("art-37"). O site mostra esse texto num popup.
//
// Uso: node scripts/leis-federais/gerar.mjs [slug]
import { mkdirSync, writeFileSync } from "node:fs";
import { CATEGORIAS, LEIS } from "./catalogo.mjs";

const SAIDA = new URL("../../public/leis-federais/", import.meta.url);
mkdirSync(SAIDA, { recursive: true });
const ALVO = process.argv[2];

const ENTIDADES = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", ordm: "º", ordf: "ª", sect: "§", deg: "°" };
const texto = (html) => html
  .replace(/<[^>]+>/g, " ")
  .replace(/&(#\d+|#x[0-9a-f]+|\w+);/gi, (m, e) => e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENTIDADES[e.toLowerCase()] ?? m)
  .replace(/\s+/g, " ").trim();

async function baixar(url) {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122 Safari/537.36" } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return new Uint8Array(await r.arrayBuffer());
}

function decodificar(bytes) {
  const cabeca = new TextDecoder("latin1").decode(bytes.slice(0, 3000));
  const utf8 = /charset\s*=\s*["']?utf-8/i.test(cabeca);
  return new TextDecoder(utf8 ? "utf-8" : "windows-1252").decode(bytes);
}

// Mantém só as tags de estrutura; atributos são descartados (salvo href absoluto e o alinhamento central).
const MAPA = { p: "p", br: "br", b: "strong", strong: "strong", i: "em", em: "em", u: "u", strike: "s", s: "s", del: "s", sup: "sup", sub: "sub",
  table: "table", tbody: "tbody", thead: "thead", tr: "tr", td: "td", th: "th", ul: "ul", ol: "ol", li: "li", blockquote: "blockquote",
  h1: "p", h2: "p", h3: "p", h4: "p", h5: "p", h6: "p", center: "p", a: "a" };

function limpar(html, base) {
  const pilhaA = [];
  let saida = html.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (_, fecha, nome, attrs) => {
    const tag = MAPA[nome.toLowerCase()];
    if (!tag) return " ";
    if (tag === "a") {
      if (fecha) return pilhaA.pop() ? "</a>" : "";
      const href = attrs.match(/href\s*=\s*["']([^"']+)["']/i)?.[1];
      let abs = null;
      if (href && !href.startsWith("#") && !/^javascript:/i.test(href)) { try { abs = new URL(href, base).href; } catch { abs = null; } }
      if (abs && /^https?:/.test(abs)) { pilhaA.push(true); return `<a href="${abs.replace(/"/g, "%22")}" target="_blank" rel="noopener noreferrer">`; }
      pilhaA.push(false); return "";
    }
    if (fecha) return `</${tag}>`;
    if (tag === "br") return "<br>";
    const centro = nome.toLowerCase() === "center" || /align\s*=\s*["']?center/i.test(attrs) || /text-align\s*:\s*center/i.test(attrs);
    const titulo = /^h[1-6]$/i.test(nome);
    const classe = [centro && "c", titulo && "t"].filter(Boolean).join(" ");
    return `<${tag}${classe ? ` class="${classe}"` : ""}>`;
  });
  saida = saida.replace(/\s+/g, " ").replace(/<p( class="[^"]*")?>\s*<\/p>/g, "").replace(/<(strong|em|u|s|sup|sub)>\s*<\/\1>/g, "");
  // Parágrafo só com texto riscado = dispositivo revogado (o site pode ocultá-lo).
  saida = saida.replace(/<p( class="([^"]*)")?>([\s\S]*?)<\/p>/g, (m, _c, classe = "", corpo) => {
    const sobra = texto(corpo.replace(/<s>[\s\S]*?<\/s>/g, ""));
    const rev = corpo.includes("<s>") && !sobra.replace(/[()\[\].,;:\-–\s]|Revogad[oa]s?|Vide.*$/gi, "");
    return rev ? `<p class="${(classe + " rev").trim()}">${corpo}</p>` : m;
  });
  // Âncora por artigo para o "ir para o art." do popup (primeira ocorrência vigente).
  const vistos = new Set();
  saida = saida.replace(/<p( class="([^"]*)")?>((?:\s|&nbsp;|<[^>]+>)*)Art\.(?:\s|&nbsp;)*(\d+)/g, (m, _c, classe = "", abre, n) => {
    if (classe.includes("rev") || vistos.has(n)) return m;
    vistos.add(n);
    return `<p id="art-${n}"${classe ? ` class="${classe}"` : ""}>${abre}Art. ${n}`;
  });
  return saida.trim();
}

const CABECALHO = /Presid[êe]ncia da Rep[úu]blica|Casa Civil|Subchefia para Assuntos|Secretaria-Geral/i;
const ROTULO = /^(Vig[êe]ncia|Regulamento|Mensagem|Texto compilado|Convers[ãa]o|Vide|Produ[çc][ãa]o de efeito)/i;
const VERBO_DE_EMENTA = /^(Disp[õo]e|Altera|Regula|Regulamenta|Institui|Estabelece|Acrescenta|Estatui|Determina|Define|Autoriza|Cria|Aprova|Torna|Fixa|Organiza|Promulga|Introduz)/i;

function separar(html, comEmenta = true) {
  // Do <body> até o fim do arquivo: a página da Constituição fecha o </body> no meio do texto.
  const inicio = html.search(/<body[^>]*>/i);
  let corpo = (inicio >= 0 ? html.slice(inicio).replace(/^<body[^>]*>/i, "") : html).replace(/<\/(body|html)>/gi, "");
  corpo = corpo.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style|header|noscript)[\s\S]*?<\/\1>/gi, "");
  // Título oficial: o primeiro parágrafo com "LEI", "DECRETO", "CONSTITUIÇÃO"...
  const pTitulo = corpo.match(/<p[^>]*>(?:(?!<\/p>)[\s\S])*?(LEI|DECRETO|CONSTITUI|EMENDA)(?:(?!<\/p>)[\s\S])*?<\/p>/i);
  const titulo = pTitulo ? texto(pTitulo[0]) : null;
  // Tabelas do topo (só as pequenas: na Constituição, o texto inteiro fica dentro de uma tabela): a do cabeçalho
  // do Planalto ("Presidência da República...") sai, e a da ementa (ao lado de "Mensagem de veto", "Vigência"...)
  // vira a ementa. A ementa é a célula que começa como ementa ("Dispõe sobre...", "Altera..."); sem isso, a mais longa.
  let ementa = null;
  const remover = [];
  for (const t of corpo.matchAll(/<table[\s\S]*?<\/table>/gi)) {
    if (t.index > 8000 || t[0].length > 15000) continue;
    const celulas = [...t[0].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((c) => texto(c[1])).filter(Boolean);
    if (celulas.some((c) => CABECALHO.test(c))) { remover.push(t[0]); continue; }
    if (ementa || !comEmenta) continue;
    const rotulos = celulas.filter((c) => ROTULO.test(c));
    ementa = celulas.find((c) => VERBO_DE_EMENTA.test(c))
      ?? (rotulos.length ? celulas.filter((c) => !ROTULO.test(c)).sort((a, b) => b.length - a.length)[0] ?? null : null);
    if (ementa) remover.push(t[0]);
  }
  for (const t of remover) corpo = corpo.replace(t, "");
  if (pTitulo && pTitulo.index < 6000) corpo = corpo.replace(pTitulo[0], "");
  // Sem tabela de ementa: o primeiro parágrafo do topo que começa como ementa.
  if (!ementa && comEmenta) {
    const p = [...corpo.slice(0, 6000).matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].find((m) => VERBO_DE_EMENTA.test(texto(m[1])));
    if (p) { ementa = texto(p[1]); corpo = corpo.replace(p[0], ""); }
  }
  return { titulo, ementa, corpo };
}

const indice = [];
let falhas = 0;
for (const lei of LEIS) {
  const item = { ...lei, categoriaNome: CATEGORIAS.find((c) => c.id === lei.categoria)?.nome };
  if (ALVO && lei.slug !== ALVO) { indice.push(item); continue; }
  try {
    const bytes = await baixar(lei.url);
    if (lei.pdf) {
      writeFileSync(new URL(`${lei.slug}.pdf`, SAIDA), bytes);
      indice.push({ ...item, arquivo: `${lei.slug}.pdf` });
      console.log(`ok  ${lei.slug}: PDF ${(bytes.length / 1024).toFixed(0)} KB`);
      continue;
    }
    // A Constituição não tem ementa: a tabela do topo dela é o índice (emendas, ADCT) e fica no texto.
    const { titulo, ementa, corpo } = separar(decodificar(bytes), lei.tipo !== "Constituição");
    const html = limpar(corpo, lei.url);
    const dados = { slug: lei.slug, titulo: lei.titulo, tituloOficial: titulo, ementa, fonte: lei.url, copiadoEm: new Date().toISOString().slice(0, 10), html };
    writeFileSync(new URL(`${lei.slug}.json`, SAIDA), JSON.stringify(dados));
    const artigos = (html.match(/id="art-/g) || []).length;
    // Sem nenhum artigo vigente e com artigos riscados: a norma inteira foi revogada.
    const revogada = artigos === 0 && /class="[^"]*rev[^"]*"[^>]*>(?:\s|&nbsp;|<[^>]+>)*Art\./.test(html);
    indice.push({ ...item, ementa, revogada, arquivo: `${lei.slug}.json` });
    console.log(`ok  ${lei.slug}: ${(html.length / 1024).toFixed(0)} KB, ${artigos} artigos, ementa ${ementa ? "sim" : "NÃO"}${revogada ? ", REVOGADA" : ""}`);
  } catch (e) {
    falhas++;
    indice.push(item);
    console.error(`ERRO ${lei.slug}: ${e.message}`);
  }
}
if (!ALVO) writeFileSync(new URL("indice.json", SAIDA), JSON.stringify({ categorias: CATEGORIAS, leis: indice, geradoEm: new Date().toISOString().slice(0, 10) }, null, 1));
process.exit(falhas ? 1 : 0);
