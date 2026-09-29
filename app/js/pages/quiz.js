import { db } from '../db.js';
import { loadJSON, esc, sourceLine } from '../util.js';

const SERIE = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Maîtrise d'un thème : part des questions dont la dernière réponse est juste.
function mastery(questions, answers) {
  const last = {};
  for (const a of answers) last[a.questionId] = a.correct;
  const ok = questions.filter((q) => last[q.id]).length;
  return { ok, total: questions.length, pct: questions.length ? Math.round((ok / questions.length) * 100) : 0 };
}

async function home(el, data) {
  const answers = await db.all('quizAnswers').catch(() => []);
  const niveau = await db.getSetting('quizNiveau', 'tous').catch(() => 'tous');
  const global = mastery(data.questions, answers);

  el.innerHTML = `
    <h1>Quiz</h1>
    <div class="card">
      <div class="progress"><div style="width:${global.pct}%"></div></div>
      <div class="progress-label"><span>Maîtrise globale : ${global.ok} / ${global.total}</span><span>${global.pct} % · objectif ${data.objectif} %</span></div>
    </div>
    <label class="field"><span>Niveau</span>
      <select id="niveau">
        <option value="tous">Tous niveaux</option>
        <option value="1" ${niveau === '1' ? 'selected' : ''}>Débutant</option>
        <option value="2" ${niveau === '2' ? 'selected' : ''}>Intermédiaire</option>
        <option value="3" ${niveau === '3' ? 'selected' : ''}>Avancé</option>
      </select>
    </label>
    <div class="btn-row"><a class="btn" href="#/quiz/tout">Série mélangée (${SERIE} questions)</a></div>
    <h2>Par thème</h2>
    ${data.themes.map((t) => {
      const m = mastery(data.questions.filter((q) => q.theme === t.id), answers);
      const cls = m.pct >= data.objectif ? 'ok' : m.pct > 0 ? 'warn' : '';
      return `<a class="card tile" style="min-height:0" href="#/quiz/${t.id}">
        <strong>${esc(t.titre)} <span class="badge ${cls}">${m.pct} %</span></strong>
        <span>${m.total} questions · ${m.ok} maîtrisées</span>
      </a>`;
    }).join('')}
    ${answers.length ? '<div class="btn-row"><button class="btn small secondary" id="reset">Remettre les scores à zéro</button></div>' : ''}
  `;
  el.querySelector('#niveau').addEventListener('change', (e) => db.setSetting('quizNiveau', e.target.value));
  el.querySelector('#reset')?.addEventListener('click', async (e) => {
    if (e.target.dataset.confirm !== '1') {
      e.target.dataset.confirm = '1';
      e.target.textContent = 'Confirmer : effacer tous les scores ?';
      return;
    }
    await db.clear('quizAnswers');
    home(el, data);
  });
}

async function serie(el, data, themeId) {
  const theme = data.themes.find((t) => t.id === themeId);
  if (themeId !== 'tout' && !theme) {
    el.innerHTML = '<h1>Thème introuvable</h1><p><a href="#/quiz">Retour au quiz</a></p>';
    return;
  }
  const niveau = await db.getSetting('quizNiveau', 'tous').catch(() => 'tous');
  let pool = data.questions.filter((q) => themeId === 'tout' || q.theme === themeId);
  const filtered = pool.filter((q) => niveau === 'tous' || String(q.niveau) === niveau);
  if (filtered.length) pool = filtered;
  const questions = shuffle(pool).slice(0, SERIE).map((q) => {
    const order = shuffle(q.choix.map((_, i) => i));
    return { ...q, order };
  });
  let i = 0;
  let score = 0;
  const titre = theme ? theme.titre : 'Série mélangée';

  function show() {
    const q = questions[i];
    el.innerHTML = `
      <p class="small"><a href="#/quiz">‹ Quiz</a></p>
      <h1>${esc(titre)}</h1>
      <div class="progress-label"><span>Question ${i + 1} / ${questions.length}</span><span>Score : ${score}</span></div>
      <div class="progress"><div style="width:${(i / questions.length) * 100}%"></div></div>
      <div class="card">
        <p><strong>${esc(q.question)}</strong></p>
        <div class="choices">
          ${q.order.map((c) => `<button class="choice" data-c="${c}">${esc(q.choix[c])}</button>`).join('')}
        </div>
        <div id="feedback" role="status"></div>
      </div>
    `;
    el.querySelectorAll('.choice').forEach((b) => b.addEventListener('click', () => answer(+b.dataset.c)));
  }

  async function answer(c) {
    const q = questions[i];
    const correct = c === q.bonne;
    if (correct) score++;
    el.querySelectorAll('.choice').forEach((b) => {
      b.disabled = true;
      if (+b.dataset.c === q.bonne) b.classList.add('right');
      else if (+b.dataset.c === c) b.classList.add('wrong');
    });
    await db.add('quizAnswers', { questionId: q.id, theme: q.theme, correct, at: new Date().toISOString() }).catch(() => {});
    const last = i === questions.length - 1;
    el.querySelector('#feedback').innerHTML = `
      <div class="notice ${correct ? 'ok' : 'err'}"><strong>${correct ? 'Bonne réponse' : 'Pas tout à fait'}</strong><br>${esc(q.explication)}</div>
      ${sourceLine(q.source, q.verifie)}
      ${!correct && q.casSimu ? `<p><a href="#/simulateur/${q.casSimu}">Refaire ce cas dans le simulateur ›</a></p>` : ''}
      <div class="btn-row"><button class="btn" id="next">${last ? 'Voir le résultat' : 'Question suivante'}</button></div>
    `;
    el.querySelector('#next').addEventListener('click', () => { i++; last ? end() : show(); });
    el.querySelector('#next').focus();
  }

  function end() {
    const pct = Math.round((score / questions.length) * 100);
    el.innerHTML = `
      <p class="small"><a href="#/quiz">‹ Quiz</a></p>
      <h1>${esc(titre)} — résultat</h1>
      <div class="card">
        <p style="font-size:2rem;margin:0"><strong>${score} / ${questions.length}</strong></p>
        <div class="progress"><div style="width:${pct}%"></div></div>
        <div class="progress-label"><span>${pct} %</span><span>objectif ${data.objectif} %</span></div>
        <div class="notice ${pct >= data.objectif ? 'ok' : ''}">${pct >= data.objectif ? 'Objectif atteint. Bravo !' : 'Relisez la page « Le métier » et le glossaire, puis réessayez.'}</div>
      </div>
      <div class="btn-row">
        <button class="btn" id="again">Nouvelle série</button>
        <a class="btn secondary" href="#/quiz">Tous les thèmes</a>
      </div>
    `;
    el.querySelector('#again').addEventListener('click', () => serie(el, data, themeId));
  }

  show();
}

export default async function quiz(el, parts) {
  const data = await loadJSON('data/quiz.json');
  return parts[0] ? serie(el, data, parts[0]) : home(el, data);
}
