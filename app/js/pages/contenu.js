import { loadText, markdown, esc } from '../util.js';

// Page de contenu rédigée en Markdown (content/*.md), avec sommaire cliquable sous le titre.
export function contentPage(path, titre) {
  return async (el) => {
    const { html, headings } = markdown(await loadText(path));
    const base = location.hash.split('#').slice(0, 2).join('#');
    el.innerHTML = `<article class="md" aria-label="${esc(titre)}">${html}</article>`;
    const toc = document.createElement('nav');
    toc.className = 'toc';
    toc.setAttribute('aria-label', 'Sommaire de la page');
    toc.innerHTML = headings.map((h) => `<a href="${base}#${h.id}">${esc(h.text)}</a>`).join('');
    const h1 = el.querySelector('h1');
    if (h1) h1.after(toc); else el.prepend(toc);
  };
}
