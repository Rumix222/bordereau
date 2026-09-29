import { loadJSON, esc, sourceLine } from '../util.js';

function norm(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export default async function glossaire(el) {
  const { termes } = await loadJSON('data/glossaire.json');
  const sorted = [...termes].sort((a, b) => a.terme.localeCompare(b.terme, 'fr'));

  el.innerHTML = `
    <h1>Glossaire</h1>
    <label class="field"><span>Rechercher un terme</span>
      <input type="search" id="q" placeholder="Ex. IFD, rejet, BSI…" autocomplete="off">
    </label>
    <dl id="list"></dl>
    <p id="empty" class="muted" hidden>Aucun terme trouvé.</p>
  `;
  const list = el.querySelector('#list');
  const q = el.querySelector('#q');

  function show() {
    const needle = norm(q.value.trim());
    const hits = sorted.filter((t) => !needle || norm(`${t.terme} ${t.nom} ${t.def}`).includes(needle));
    list.innerHTML = hits.map((t) => `
      <div class="term">
        <dt>${esc(t.terme)}${t.nom !== t.terme ? ` <span class="muted">— ${esc(t.nom)}</span>` : ''}</dt>
        <dd>${esc(t.def)}${sourceLine(t.source, t.verifie)}</dd>
      </div>`).join('');
    el.querySelector('#empty').hidden = hits.length > 0;
  }
  q.addEventListener('input', show);
  show();
}
