| GekiGaming — SEO improvements

Resumo das alterações feitas para otimização de SEO e indexação:

- Atualizei `index.html` com meta tags essenciais e melhorias:
  - `description`, `keywords`, `canonical`, `robots` mantidos e reforçados.
  - Adicionados: `format-detection`, `mobile-web-app-capable`, `googlebot`, `alternate` hreflang, `manifest` e `sitemap` links.
  - Open Graph e Twitter cards aprimorados (`og:image:alt`, dimensões, `twitter:site`/`creator`).
  - JSON-LD expandido: `Organization`, `WebSite`, `WebPage`, `BreadcrumbList` e `SearchAction`.
  - `<noscript>` fallback com conteúdo básico para crawlers (útil para SPA).

- Adicionados arquivos de suporte:
  - `sitemap.xml` — mapa básico de URLs principais.
  - `site.webmanifest` — manifest PWA / ícone.
  - `robots.txt` — aponta para `sitemap.xml` e permite crawling.

Motivação e próximos passos recomendados

- Problema SPA: motores de busca podem indexar apenas HTML inicial. Recomendado:
  - Implementar SSR/SSG (prerender) para gerar HTML estático por rota.
  - Gerar meta tags dinâmicas por rota (título, descrição, og:image) via SSG/SSR.
  - Gerar imagens OG otimizadas por página (1200×630) para melhor preview social.
  - Registrar o site no Google Search Console e enviar `sitemap.xml`.

Deploy / verificação

- Deploys estáticos (Vercel, Netlify, GitHub Pages) funcionam, mas para SEO ideal use prerender ou SSR.
- Verifique o acesso a estes arquivos após deploy:
  - `/sitemap.xml`
  - `/robots.txt`
  - `/site.webmanifest`
  - `/index.html` (visível no fetch do Googlebot / View-source)

Commits

- Commit feito: adição do README e dos arquivos de SEO.

Se desejar, posso:
- Implementar um pipeline de prerender (ex.: `vite-plugin-prerender-spa`) e adicionar script de build.
- Gerar `og` images por rota automaticamente.
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/107EPHLSkuVa-US0C6kagzE8pxUHM_Bwy

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
