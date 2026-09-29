import { db } from '../db.js';
import { loadJSON, esc, formatDate, sourceLine } from '../util.js';

const STEPS = [
  { id: 'patient', label: '1. Patient' },
  { id: 'ordonnance', label: '2. Ordonnance' },
  { id: 'cotation', label: '3. Cotation' },
  { id: 'envoi', label: '4. Télétransmission' },
  { id: 'retour', label: '5. Retour' },
];

function age(naissance, date) {
  const b = new Date(naissance), d = new Date(date);
  let a = d.getFullYear() - b.getFullYear();
  if (d.getMonth() < b.getMonth() || (d.getMonth() === b.getMonth() && d.getDate() < b.getDate())) a--;
  return a;
}

function weekday(date) {
  return new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function fmtCoef(n) {
  return String(n).replace('.', ',');
}

function emptyDraft() {
  return { step: 'patient', droitsOk: null, ordonnanceOk: null, actes: [], majorations: [], ik: false, decision: null };
}

// Compare la saisie à la solution attendue et produit le retour de la caisse simulée.
export function evaluate(cas, saisie) {
  const att = cas.attendu;
  const checks = [];
  const add = (label, ok, detail) => checks.push({ label, ok, detail });

  add('Contrôle des droits', saisie.droitsOk === att.droitsOk,
    att.droitsOk ? 'Les droits étaient ouverts à la date du soin.' : `Les droits se terminaient le ${formatDate(cas.patient.droitsJusquau)}, avant le soin.`);
  add('Contrôle de l\'ordonnance', saisie.ordonnanceOk === att.ordonnanceOk,
    att.ordonnanceOk ? 'L\'ordonnance couvrait bien le soin.' : `L'ordonnance ne couvrait plus le soin (fin le ${formatDate(cas.ordonnance.fin)}).`);

  const key = (a) => `${a.id}@${a.taux}`;
  const want = att.actes.map(key).sort().join(',');
  const got = saisie.actes.map(key).sort().join(',');
  add('Actes et taux', want === got, `Attendu : ${att.actes.map((a) => `${a.id} à ${a.taux} %`).join(' + ')}.`);

  const wantM = [...att.majorations].sort().join(',');
  const gotM = [...saisie.majorations].sort().join(',');
  add('Majorations', wantM === gotM, `Attendu : ${att.majorations.join(', ') || 'aucune'}.`);
  add('Indemnités kilométriques', saisie.ik === att.ik, att.ik ? 'Des IK étaient dues.' : 'Pas d\'IK.');

  const bloquer = !att.droitsOk || !att.ordonnanceOk;
  const decisionOk = bloquer ? saisie.decision === 'attente' : saisie.decision === 'envoi';
  add('Décision', decisionOk, bloquer ? 'Il fallait mettre la facture en attente.' : 'La facture pouvait être envoyée.');

  // Retour simulé de la caisse
  let retour;
  if (saisie.decision === 'attente') {
    retour = bloquer
      ? { type: 'ok', titre: 'Facture mise en attente à juste titre', texte: 'Aucun envoi : la pièce manquante est demandée à l\'infirmière avant de facturer.' }
      : { type: 'warn', titre: 'Facture retenue sans raison', texte: 'Rien ne bloquait l\'envoi : la cliente sera payée en retard.' };
  } else if (!att.droitsOk) {
    retour = { type: 'err', titre: 'REJET — famille « droits »', texte: 'Motif simulé : assuré sans droits ouverts à la date des soins.' };
  } else if (!att.ordonnanceOk) {
    retour = { type: 'err', titre: 'REJET — famille « administratif »', texte: 'Motif simulé : date de soins hors période de prescription.' };
  } else {
    const cotOk = want === got && wantM === gotM && saisie.ik === att.ik;
    const trop = saisie.actes.some((a) => !att.actes.some((b) => key(a) === key(b)))
      || saisie.majorations.some((m) => !att.majorations.includes(m))
      || (saisie.ik && !att.ik);
    if (cotOk) retour = { type: 'ok', titre: 'PAYÉ', texte: 'Retour simulé NOEMIE : facture réglée intégralement. Il reste à la pointer.' };
    else if (trop) retour = { type: 'err', titre: 'REJET — famille « cotation »', texte: 'Motif simulé : cotation ou majoration non conforme. Dans la réalité, une surcotation non détectée peut aussi donner lieu à un indu lors d\'un contrôle.' };
    else retour = { type: 'warn', titre: 'PAYÉ — mais sous-coté', texte: 'La facture est réglée, mais des éléments dus n\'ont pas été facturés : manque à gagner pour la cliente.' };
  }

  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
  return { checks, retour, score };
}

async function listView(el, data) {
  const attempts = await db.all('simAttempts').catch(() => []);
  const best = {};
  for (const a of attempts) best[a.casId] = Math.max(best[a.casId] ?? 0, a.score);
  const niveaux = { 1: 'Débutant', 2: 'Intermédiaire', 3: 'Avancé' };

  el.innerHTML = `
    <h1>Simulateur</h1>
    <p>Déroulez un cycle complet de facturation sur des cas fictifs : patient, ordonnance, cotation, télétransmission, retour de la caisse.</p>
    <div class="notice small">${esc(data.avertissement)}</div>
    ${[1, 2, 3].map((n) => `
      <h2>${niveaux[n]}</h2>
      ${data.cas.filter((c) => c.niveau === n).map((c) => `
        <a class="card tile" style="min-height:0" href="#/simulateur/${c.id}">
          <strong>${esc(c.titre)} ${best[c.id] !== undefined ? `<span class="badge ${best[c.id] === 100 ? 'ok' : 'warn'}">${best[c.id]} %</span>` : ''}</strong>
          <span>Cas ${c.id} · ${c.themes.join(', ')}</span>
        </a>`).join('')}
    `).join('')}
    ${attempts.length ? `
      <h2>Mes derniers essais</h2>
      <ul class="history small">
        ${attempts.slice(-8).reverse().map((a) => `<li>${formatDate(a.at)} — cas ${esc(a.casId)} : <strong>${a.score} %</strong> (${esc(a.resultat)})</li>`).join('')}
      </ul>` : ''}
    ${sourceLine(data.source, data.verifie)}
  `;
}

async function caseView(el, data, cas) {
  const draftKey = `simDraft:${cas.id}`;
  let d = (await db.getSetting(draftKey).catch(() => null)) || emptyDraft();
  let result = null;
  const acteById = Object.fromEntries(data.actes.map((a) => [a.id, a]));
  const save = () => db.setSetting(draftKey, d).catch(() => {});
  // Toute modification après correction invalide le résultat affiché.
  const touch = () => { result = null; save(); };

  function stepDone(id) {
    return {
      patient: d.droitsOk !== null,
      ordonnance: d.ordonnanceOk !== null,
      cotation: d.actes.length > 0,
      envoi: d.decision !== null,
      retour: !!result,
    }[id];
  }

  function yesNo(name, value) {
    return `<div class="btn-row">
      <button class="btn small ${value === true ? '' : 'secondary'}" data-yn="${name}" data-v="1">Oui</button>
      <button class="btn small ${value === false ? '' : 'secondary'}" data-yn="${name}" data-v="0">Non</button>
    </div>`;
  }

  function coefTotal() {
    return d.actes.reduce((s, a) => s + acteById[a.id].coef * a.taux / 100, 0);
  }

  const views = {
    patient: () => `
      <h3>Carte Vitale (lue)</h3>
      <dl class="kv">
        <dt>Nom</dt><dd>${esc(cas.patient.nom)} <span class="badge">fictif</span></dd>
        <dt>Naissance</dt><dd>${formatDate(cas.patient.naissance)} (${age(cas.patient.naissance, cas.seance.date)} ans le jour du soin)</dd>
        <dt>Caisse</dt><dd>${esc(cas.patient.caisse)}</dd>
        <dt>Droits AMO</dt><dd>jusqu'au ${formatDate(cas.patient.droitsJusquau)}</dd>
        <dt>ALD</dt><dd>${cas.patient.ald ? 'Oui' : 'Non'}</dd>
        <dt>Complémentaire</dt><dd>${esc(cas.patient.complementaire)}</dd>
      </dl>
      <p class="small muted">Date du soin à facturer : <strong>${weekday(cas.seance.date)}</strong></p>
      <p><strong>Les droits sont-ils ouverts à la date du soin ?</strong></p>
      ${yesNo('droitsOk', d.droitsOk)}`,

    ordonnance: () => `
      <h3>Ordonnance</h3>
      <dl class="kv">
        <dt>Date</dt><dd>${formatDate(cas.ordonnance.date)}</dd>
        <dt>Prescripteur</dt><dd>${esc(cas.ordonnance.prescripteur)} <span class="badge">fictif</span></dd>
        <dt>Prescription</dt><dd>${esc(cas.ordonnance.contenu)}</dd>
        <dt>Période</dt><dd>du ${formatDate(cas.ordonnance.debut)} au ${formatDate(cas.ordonnance.fin)}</dd>
      </dl>
      <h3>Soin réalisé</h3>
      <dl class="kv">
        <dt>Date</dt><dd>${weekday(cas.seance.date)}, ${cas.seance.heure.replace(':', ' h ')}</dd>
        <dt>Lieu</dt><dd>${esc(cas.seance.lieu)}</dd>
        <dt>Soins</dt><dd>${esc(cas.seance.soins)}</dd>
      </dl>
      <p><strong>L'ordonnance couvre-t-elle ce soin à cette date ?</strong></p>
      ${yesNo('ordonnanceOk', d.ordonnanceOk)}`,

    cotation: () => `
      <div class="notice info small">
        <strong>Séance :</strong> ${weekday(cas.seance.date)}, ${cas.seance.heure.replace(':', ' h ')} · ${esc(cas.seance.lieu)}<br>
        <strong>Déplacement :</strong> ${esc(cas.seance.deplacement)}<br>
        <strong>Soins :</strong> ${esc(cas.seance.soins)}<br>
        <strong>Patient :</strong> ${age(cas.patient.naissance, cas.seance.date)} ans
      </div>
      <h3>Actes</h3>
      <label class="field"><span>Ajouter un acte</span>
        <select id="add-acte">
          <option value="">Choisir…</option>
          ${data.actes.map((a) => `<option value="${a.id}">${esc(a.libelle)} — ${a.lettre} ${fmtCoef(a.coef)}</option>`).join('')}
        </select>
      </label>
      ${d.actes.length ? d.actes.map((a, i) => {
        const def = acteById[a.id];
        return `<div class="acte-line">
          <span>${esc(def.libelle)}<br><span class="small muted">${def.lettre} ${fmtCoef(def.coef)}</span></span>
          <select data-taux="${i}" aria-label="Taux">
            <option value="100" ${a.taux === 100 ? 'selected' : ''}>100 %</option>
            <option value="50" ${a.taux === 50 ? 'selected' : ''}>50 %</option>
          </select>
          <button class="btn small secondary" data-del="${i}" aria-label="Retirer">✕</button>
        </div>`;
      }).join('') + `<p class="total">Total : AMI ${fmtCoef(coefTotal())}</p>` : '<p class="muted small">Aucun acte saisi.</p>'}
      <h3>Majorations et déplacements</h3>
      ${data.majorations.map((m) => `
        <label class="check"><input type="checkbox" data-maj="${m.id}" ${d.majorations.includes(m.id) ? 'checked' : ''}> ${esc(m.libelle)}</label>`).join('')}
      <label class="check"><input type="checkbox" id="ik" ${d.ik ? 'checked' : ''}> IK — indemnités kilométriques</label>
      <div class="btn-row"><button class="btn" data-goto="envoi" ${d.actes.length ? '' : 'disabled'}>Continuer</button></div>`,

    envoi: () => `
      <h3>Feuille de soins électronique (brouillon)</h3>
      <div class="ticket">Patient    : ${esc(cas.patient.nom)}
Date soin  : ${formatDate(cas.seance.date)} ${cas.seance.heure}
Actes      : ${d.actes.map((a) => `${acteById[a.id].lettre} ${fmtCoef(acteById[a.id].coef)} (${a.taux} %)`).join(' + ') || '—'}
Majorations: ${d.majorations.join(' + ') || '—'}
IK         : ${d.ik ? 'oui' : 'non'}
Contrôles  : droits ${d.droitsOk === null ? '?' : d.droitsOk ? 'OK' : 'KO'} · ordonnance ${d.ordonnanceOk === null ? '?' : d.ordonnanceOk ? 'OK' : 'KO'}</div>
      ${(d.droitsOk === null || d.ordonnanceOk === null) ? '<p class="notice small">Vous n\'avez pas répondu à tous les contrôles (étapes 1 et 2).</p>' : ''}
      <p><strong>Que faites-vous de cette facture ?</strong></p>
      <div class="btn-row">
        <button class="btn" data-decision="envoi">Signer et envoyer (CPS simulée)</button>
        <button class="btn secondary" data-decision="attente">Mettre en attente (pièce à obtenir)</button>
      </div>
      <p class="small muted">Rappel : dans la réalité, la CPS de l'infirmière est strictement personnelle.</p>`,

    retour: () => {
      if (!result) return '<p class="muted">Envoyez d\'abord la facture (étape 4).</p>';
      const { checks, retour, score } = result;
      return `
        ${d.decision === 'envoi' ? '<div class="ticket">ARL simulé : lot reçu par la caisse.</div>' : ''}
        <div class="notice ${retour.type}"><strong>${esc(retour.titre)}</strong><br>${esc(retour.texte)}</div>
        <h3>Correction — ${score} %</h3>
        <ul>${checks.map((c) => `<li>${c.ok ? '✅' : '❌'} <strong>${esc(c.label)}</strong> — ${esc(c.detail)}</li>`).join('')}</ul>
        <div class="card md"><p>${esc(cas.correction).replace(/\[(à vérifier[^\]]*)\]/g, '<span class="verif">$1</span>')}</p></div>
        <div class="btn-row">
          <button class="btn secondary" id="restart">Recommencer ce cas</button>
          ${nextCase ? `<a class="btn" href="#/simulateur/${nextCase.id}">Cas suivant</a>` : ''}
          <a class="btn secondary" href="#/simulateur">Tous les cas</a>
        </div>`;
    },
  };

  const idx = data.cas.indexOf(cas);
  const nextCase = data.cas[idx + 1];

  function render() {
    el.innerHTML = `
      <p class="small"><a href="#/simulateur">‹ Tous les cas</a></p>
      <h1>${esc(cas.titre)}</h1>
      <div class="sim-shell">
        <div class="sim-head"><span>${esc(data.nom)} · maquette</span><span>Cas ${cas.id}</span></div>
        <div class="sim-tabs" role="tablist">
          ${STEPS.map((s) => `<button role="tab" data-goto="${s.id}" class="${d.step === s.id ? 'active' : ''} ${stepDone(s.id) ? 'done' : ''}" aria-selected="${d.step === s.id}">${s.label}</button>`).join('')}
        </div>
        <div class="sim-body">${views[d.step]()}</div>
      </div>
    `;
    bind();
  }

  function go(step) { d.step = step; save(); render(); el.querySelector('.sim-shell').scrollIntoView({ block: 'start' }); }

  function bind() {
    el.querySelectorAll('[data-goto]').forEach((b) => b.addEventListener('click', () => go(b.dataset.goto)));
    el.querySelectorAll('[data-yn]').forEach((b) => b.addEventListener('click', () => {
      d[b.dataset.yn] = b.dataset.v === '1';
      result = null;
      go(b.dataset.yn === 'droitsOk' ? 'ordonnance' : 'cotation');
    }));
    el.querySelector('#add-acte')?.addEventListener('change', (e) => {
      if (!e.target.value) return;
      d.actes.push({ id: e.target.value, taux: d.actes.length ? 50 : 100 });
      touch(); render();
    });
    el.querySelectorAll('[data-taux]').forEach((s) => s.addEventListener('change', () => {
      d.actes[+s.dataset.taux].taux = +s.value; touch(); render();
    }));
    el.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
      d.actes.splice(+b.dataset.del, 1); touch(); render();
    }));
    el.querySelectorAll('[data-maj]').forEach((c) => c.addEventListener('change', () => {
      d.majorations = c.checked ? [...d.majorations, c.dataset.maj] : d.majorations.filter((m) => m !== c.dataset.maj);
      touch();
    }));
    el.querySelector('#ik')?.addEventListener('change', (e) => { d.ik = e.target.checked; touch(); });
    el.querySelectorAll('[data-decision]').forEach((b) => b.addEventListener('click', async () => {
      d.decision = b.dataset.decision;
      result = evaluate(cas, d);
      await db.add('simAttempts', {
        casId: cas.id, score: result.score, resultat: result.retour.titre,
        saisie: { ...d }, at: new Date().toISOString(),
      }).catch(() => {});
      await db.delete('kv', draftKey).catch(() => {});
      go('retour');
    }));
    el.querySelector('#restart')?.addEventListener('click', () => {
      d = emptyDraft(); result = null; save(); render();
    });
  }

  // Un brouillon arrêté sur l'étape « retour » n'a plus de résultat : on revient à l'envoi.
  if (d.step === 'retour') d.step = 'envoi';
  render();
}

export default async function simulateur(el, parts) {
  const data = await loadJSON('data/simulateur.json');
  const cas = parts[0] && data.cas.find((c) => c.id === parts[0]);
  if (parts[0] && !cas) {
    el.innerHTML = '<h1>Cas introuvable</h1><p><a href="#/simulateur">Retour au simulateur</a></p>';
    return;
  }
  return cas ? caseView(el, data, cas) : listView(el, data);
}
