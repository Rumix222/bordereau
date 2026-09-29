import { db } from '../db.js';
import { loadJSON, esc } from '../util.js';

const PAGES = [
  { href: '#/societe', titre: 'Ma société', desc: 'Statut, formalités, assurances, contrats, données' },
  { href: '#/metier', titre: 'Le métier', desc: 'NGAP, BSI, télétransmission, rejets' },
  { href: '#/clientes', titre: 'Trouver des clientes', desc: 'Réseau, offre, tarification' },
  { href: '#/simulateur', titre: 'Simulateur', desc: 'S\'entraîner sur des cas fictifs' },
  { href: '#/quiz', titre: 'Quiz', desc: 'Vérifier ses connaissances' },
  { href: '#/metier/glossaire', titre: 'Glossaire', desc: 'Tous les termes et sigles' },
];

function computeState(roadmap, done) {
  const verrous = roadmap.phases.flatMap((p) => p.etapes.filter((e) => e.verrou));
  const porteOuverte = verrous.every((e) => done.has(e.id));
  const all = roadmap.phases.flatMap((p) => p.etapes.map((e) => ({ ...e, phase: p })));
  const next = all.find((e) => !done.has(e.id) && (!e.phase.exigeVerrous || porteOuverte))
    || all.find((e) => !done.has(e.id));
  return { verrous, porteOuverte, all, next };
}

export default async function accueil(el) {
  const roadmap = await loadJSON('data/feuille-de-route.json');
  const rows = await db.all('roadmap').catch(() => []);
  const done = new Set(rows.filter((r) => r.done).map((r) => r.id));
  const openPhase = await db.getSetting('openPhase', null).catch(() => null);

  function render() {
    const { verrous, porteOuverte, all, next } = computeState(roadmap, done);
    const total = all.length;
    const nbDone = all.filter((e) => done.has(e.id)).length;
    const pct = Math.round((nbDone / total) * 100);

    el.innerHTML = `
      <h1>Bonjour 👋</h1>
      <div class="tiles">
        ${PAGES.map((p) => `<a class="tile" href="${p.href}"><strong>${p.titre}</strong><span>${p.desc}</span></a>`).join('')}
      </div>

      <h2>Feuille de route de démarrage</h2>
      <div class="card">
        <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div style="width:${pct}%"></div></div>
        <div class="progress-label"><span>${nbDone} / ${total} étapes</span><span>${pct} %</span></div>
        ${next ? `<p><strong>Prochaine étape</strong> <span class="badge">${esc(next.id)}</span><br>${esc(next.texte)}</p>
          ${next.lien ? `<a class="btn small secondary" href="${next.lien}">Ouvrir la page liée</a>` : ''}`
          : '<p class="notice ok">Toutes les étapes sont cochées. Bravo !</p>'}
      </div>
      <div class="notice ${porteOuverte ? 'ok' : ''}">
        🔒 <strong>Porte de sécurité :</strong> ${porteOuverte
          ? 'franchie. Les phases 6 et 7 sont ouvertes.'
          : `${verrous.filter((e) => done.has(e.id)).length} / ${verrous.length} étapes. Aucune facturation réelle pour une cliente avant de l'avoir franchie (assurance RC Pro, contrats, RGPD, accès CPS).`}
      </div>

      ${roadmap.phases.map((p, idx) => {
        const n = p.etapes.filter((e) => done.has(e.id)).length;
        const locked = p.exigeVerrous && !porteOuverte;
        const isOpen = openPhase ? openPhase === p.id : next && next.phase.id === p.id;
        return `
        <details class="phase ${locked ? 'locked' : ''}" data-phase="${p.id}" ${isOpen ? 'open' : ''}>
          <summary>
            <div class="row"><strong>${idx + 1}. ${esc(p.titre)}</strong><span class="badge ${n === p.etapes.length ? 'ok' : ''}">${n}/${p.etapes.length}</span></div>
            ${locked ? '<span class="small muted">🔒 Bloquée tant que la porte de sécurité n\'est pas franchie</span>' : ''}
          </summary>
          <div class="body">
            ${p.etapes.map((e) => `
              <div class="step ${done.has(e.id) ? 'done' : ''}">
                <input type="checkbox" id="cb-${e.id}" data-step="${e.id}" ${done.has(e.id) ? 'checked' : ''} ${locked ? 'disabled' : ''}>
                <label for="cb-${e.id}"><span class="id">${e.id}${e.verrou ? ' 🔒' : ''}</span><br><span class="txt">${esc(e.texte)}</span></label>
                ${e.lien ? `<a class="go" href="${e.lien}">Voir ›</a>` : ''}
              </div>`).join('')}
            ${p.fin ? `<p class="phase-end">Fin de phase : ${esc(p.fin)}</p>` : ''}
          </div>
        </details>`;
      }).join('')}
      <p class="small muted">${esc(roadmap.regle)}<br>${esc(roadmap.statut)}</p>

      <h2>Mes données</h2>
      <div class="card">
        <p class="small">La progression, les scores et les essais du simulateur sont enregistrés <strong>uniquement sur ce téléphone</strong>. Faites une sauvegarde de temps en temps.</p>
        <div class="btn-row">
          <button class="btn small secondary" id="export">Sauvegarder (fichier)</button>
          <label class="btn small secondary">Restaurer<input type="file" id="import" accept="application/json" hidden></label>
        </div>
        <p id="data-msg" class="small" role="status"></p>
      </div>
    `;

    el.querySelectorAll('input[data-step]').forEach((cb) => cb.addEventListener('change', async () => {
      const id = cb.dataset.step;
      if (cb.checked) done.add(id); else done.delete(id);
      await db.put('roadmap', { id, done: cb.checked, at: new Date().toISOString() });
      await db.setSetting('openPhase', cb.closest('details').dataset.phase);
      render();
      el.querySelector(`#cb-${CSS.escape(id)}`)?.focus();
    }));
    el.querySelectorAll('details.phase').forEach((d) => d.addEventListener('toggle', () => {
      if (d.open) db.setSetting('openPhase', d.dataset.phase).catch(() => {});
    }));
    el.querySelector('#export').addEventListener('click', exportData);
    el.querySelector('#import').addEventListener('change', importData);
  }

  async function exportData() {
    const data = await db.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bordereau-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  async function importData(e) {
    const msg = el.querySelector('#data-msg');
    const file = e.target.files[0];
    if (!file) return;
    try {
      await db.importAll(JSON.parse(await file.text()));
      const rows2 = await db.all('roadmap');
      done.clear();
      rows2.filter((r) => r.done).forEach((r) => done.add(r.id));
      render();
      el.querySelector('#data-msg').textContent = 'Sauvegarde restaurée.';
    } catch (err) {
      msg.textContent = `Restauration impossible : ${err.message}`;
    }
  }

  render();
}
