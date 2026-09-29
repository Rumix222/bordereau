// Petite base de données locale (IndexedDB), stockée uniquement sur l'appareil.
// Aucune donnée patient réelle ne doit jamais y être enregistrée.
//
// Pour faire évoluer le schéma : incrémenter DB_VERSION et ajouter une étape
// dans MIGRATIONS (ne jamais modifier une étape existante).

const DB_NAME = 'bordereau';
const DB_VERSION = 1;

const MIGRATIONS = {
  1(db) {
    // Réglages et état divers : { key, value }
    db.createObjectStore('kv', { keyPath: 'key' });
    // Feuille de route : { id: 'P1-01', done: true, at: '2026-09-29T…' }
    db.createObjectStore('roadmap', { keyPath: 'id' });
    // Réponses au quiz : { id auto, questionId, theme, correct, at }
    const quiz = db.createObjectStore('quizAnswers', { keyPath: 'id', autoIncrement: true });
    quiz.createIndex('questionId', 'questionId');
    quiz.createIndex('theme', 'theme');
    // Essais du simulateur : { id auto, casId, score, resultat, saisie, at }
    const sim = db.createObjectStore('simAttempts', { keyPath: 'id', autoIncrement: true });
    sim.createIndex('casId', 'casId');
  },
};

export const STORES = ['kv', 'roadmap', 'quizAnswers', 'simAttempts'];

let dbPromise = null;

function open() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('IndexedDB indisponible'));
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = req.result;
      for (let v = e.oldVersion + 1; v <= DB_VERSION; v++) MIGRATIONS[v](db, req.transaction);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function run(store, mode, fn) {
  return open().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const result = fn(tx.objectStore(store));
    tx.oncomplete = () => resolve(result && 'result' in result ? result.result : result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  }));
}

export const db = {
  get: (store, key) => run(store, 'readonly', (s) => s.get(key)),
  all: (store) => run(store, 'readonly', (s) => s.getAll()),
  put: (store, value) => run(store, 'readwrite', (s) => s.put(value)),
  add: (store, value) => run(store, 'readwrite', (s) => s.add(value)),
  delete: (store, key) => run(store, 'readwrite', (s) => s.delete(key)),
  clear: (store) => run(store, 'readwrite', (s) => s.clear()),

  async getSetting(key, fallback = null) {
    const row = await db.get('kv', key);
    return row ? row.value : fallback;
  },
  setSetting: (key, value) => db.put('kv', { key, value }),

  // Sauvegarde complète en JSON (pour changer de téléphone ou se protéger d'un effacement).
  async exportAll() {
    const out = { app: 'bordereau', schema: DB_VERSION, exportedAt: new Date().toISOString(), stores: {} };
    for (const s of STORES) out.stores[s] = await db.all(s);
    return out;
  },

  async importAll(data) {
    if (!data || data.app !== 'bordereau' || !data.stores) throw new Error('Fichier de sauvegarde non reconnu');
    for (const s of STORES) {
      if (!Array.isArray(data.stores[s])) continue;
      await db.clear(s);
      for (const row of data.stores[s]) await db.put(s, row);
    }
  },
};

// Demande au navigateur de ne pas effacer les données en cas de manque d'espace.
export function requestPersistence() {
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
}
