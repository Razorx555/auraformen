# AURA FOR MEN — site oficial

**THE ART OF PRESENCE.** Experiência digital da coleção Signature Series (HALO, EMBER, ECLIPSE).

**Site no ar:** https://auraformen.vercel.app

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lucide.

## Rodar

```bash
npm install
cp .env.example .env.local   # ajuste os valores
npm run dev                  # http://localhost:3000
npm run build && npm start   # produção
```

Deploy: Vercel (projeto `auraformen`), conectado a este repositório. Cada push em `main` publica automaticamente.

## Rotas

| Rota | Conteúdo |
|---|---|
| `/` | Home cinematográfica em 6 cenas (hero, Signature Series, quiz, coleção interativa, detalhes, comparação, loja/kits, universo) |
| `/colecao` | Catálogo + Signature Trio + comparação |
| `/fragrancias/halo` · `/ember` · `/eclipse` | Páginas imersivas de produto |
| `/descubra-sua-aura` | Quiz (aceita `?resultado=halo` para links compartilhados) |
| `/kits` | Signature Trio + montador de Duo |
| `/carrinho` | Carrinho completo, cupom, CEP, checkout |
| `/sobre` `/contato` `/faq` | Institucional |
| `/politica-de-privacidade` `/termos-de-uso` `/trocas-e-devolucoes` `/entrega` | Legais (estrutura, aguardando texto validado) |

## Onde editar

| O quê | Arquivo |
|---|---|
| Modo pré-lançamento / loja ativa, empresa, redes, cupons | `data/store-config.ts` + variáveis de ambiente |
| Textos, paletas, notas olfativas, modo de uso das fragrâncias | `data/fragrances.ts` |
| Produtos, preços, SKUs, estoque, kits | `data/products.ts` |
| Perguntas do quiz | `data/quiz.ts` · pontuação em `lib/quiz.ts` |
| Menus, FAQ, índice de busca | `data/site.ts` |
| Mapeamento de variantes para a Shopify | `lib/commerce/shopify.ts` (`shopifyVariantMap`) |
| História oficial da marca | `app/sobre/page.tsx` (`officialHistory`) |
| Textos legais aprovados | `approvedContent` em cada página legal |

## Imagens oficiais

Em `public/images/` — tratadas apenas em formato, tamanho e recorte (sem alterar frascos, rótulos ou logotipo):

| Arquivo | Origem |
|---|---|
| `fragrancias/halo.jpg` · `ember.jpg` · `eclipse.jpg` | Campanhas oficiais (1122×1402), convertidas de PNG para JPEG q90 |
| `brand/logo.png` | Logotipo cromado com fundo preto convertido em transparência e recortado |
| `brand/simbolo.png` | Símbolo cromado, mesmo tratamento |
| `brand/*-fundo-preto.jpg` | Versões originais com fundo preto (Open Graph) |

Para trocar uma imagem, substitua o arquivo mantendo o nome. Novas fotos (frontal, lateral, detalhe, ambiente) e vídeo entram em `images` / `videoUrl` de cada produto em `data/products.ts` — a galeria passa a exibir miniaturas e gestos automaticamente.

## Quiz — regra de pontuação

Cada resposta soma 1 ponto à fragrância correspondente; vence a mais pontuada. Com 3 perguntas o único empate possível é 1-1-1: nesse caso vale a resposta da **etapa 3** ("Como você prefere expressar sua presença?"). Sem IA, sem coleta de dados pessoais.

## Integrações pendentes (o que falta para vender de verdade)

| Item | Estado atual | Como ativar |
|---|---|---|
| **Preços, SKUs e estoque** | Demonstrativos (R$ 89,90 por unidade), sinalizados na interface | Preencher `data/products.ts` ou migrar para a Shopify; depois `NEXT_PUBLIC_DEMO_COMMERCE=false` |
| **Checkout** | Responde "modo demonstração" — nenhum pedido ou cobrança é simulado | Domínio + token Storefront da Shopify e `shopifyVariantMap` |
| **Frete** | Só valida o CEP | Calculado pela Shopify no checkout (ou integrar transportadora) |
| **Cupons** | Nenhum ativo | Criar na Shopify (validados no checkout) ou listar em `storeConfig.coupons` |
| **Newsletter / lançamento** | Avisa que o cadastro não foi salvo | `NEWSLETTER_WEBHOOK_URL` + `NEXT_PUBLIC_NEWSLETTER_ENABLED=true` |
| **Contato** | Avisa que não foi enviado | `CONTACT_WEBHOOK_URL` + `NEXT_PUBLIC_CONTACT_ENABLED=true` |
| **Dados da empresa e redes** | Ocultos | Variáveis `NEXT_PUBLIC_COMPANY_*` e `NEXT_PUBLIC_SOCIAL_*` |
| **Notas olfativas / modo de uso** | Ocultos (não inventados) | `notes` e `usage` em `data/fragrances.ts` |
| **História da marca e textos legais** | Aviso de conteúdo pendente | Ver tabela "Onde editar" |
| **Analytics** | Eventos no `dataLayer` após consentimento: `view_item`, `quiz_start`, `quiz_complete`, `add_to_cart`, `begin_checkout`; `purchase` via `trackPurchase()` só na confirmação real | Instalar GTM/GA4/Meta lendo o `dataLayer` |

O aviso "Demonstração" (canto inferior esquerdo no desktop) some quando `NEXT_PUBLIC_DEMO_COMMERCE=false` e a Shopify estiver configurada.

## Acessibilidade e performance

- Navegação completa por teclado, foco visível, diálogos com foco preso e Esc, `prefers-reduced-motion` respeitado em CSS e Motion.
- Abertura animada de ~1,5 s, só na primeira visita da sessão, sem bloquear cliques.
- Imagens via `next/image` (AVIF/WebP, `sizes` responsivos, preload só no hero); fontes self-hosted.
- Todas as páginas são pré-renderizadas como estáticas.
