import { requestPersistence } from './db.js';
import { esc } from './util.js';
import accueil from './pages/accueil.js';
import { contentPage } from './pages/contenu.js';
import glossaire from './pages/glossaire.js';
import simulateur from './pages/simulateur.js';
import quiz from './pages/quiz.js';

// Routes : #/page ou #/page/sous-page/parametre
const routes = {
  '': { nav: 'accueil', render: accueil },
  societe: { nav: 'societe', render: contentPage('content/societe.md', 'Ma société') },
  metier: { nav: 'metier', render: (el, parts) => parts[0] === 'glossaire' ? glossaire(el, parts.slice(1)) : contentPage('content/metier.md', 'Le métier')(el) },
  clientes: { nav: 'clientes', render: contentPage('content/clientes.md', 'Trouver des clientes') },
  simulateur: { nav: 'simulateur', render: simulateur },
  quiz: { nav: 'quiz', render: quiz },
};

const app = document.getElementById('app');

async function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [path, anchor] = hash.split('#');
  const [name, ...parts] = path.split('/').filter(Boolean).map(decodeURIComponent);
  const r = routes[name || ''];
  document.querySelectorAll('.bottomnav a').forEach((a) => a.classList.toggle('active', r && a.dataset.nav === r.nav));
  if (!r) {
    app.innerHTML = '<h1>Page introuvable</h1><p><a href="#/">Retour à l\'accueil</a></p>';
    return;
  }
  try {
    await r.render(app, parts);
  } catch (e) {
    console.error(e);
    app.innerHTML = `<h1>Oups</h1><div class="notice err">Le contenu n'a pas pu être chargé (${esc(e.message)}). Vérifiez la connexion puis rechargez la page.</div>`;
  }
  if (anchor) document.getElementById(anchor)?.scrollIntoView();
  else window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
requestPersistence();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch((e) => console.warn('Service worker :', e));
}
