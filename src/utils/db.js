const DB_NAME    = "rejection-tracker";
const DB_VERSION = 1;
const STORE      = "applications";

// ── Open / upgrade database ──────────────────
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("by_date",   "date",   { unique: false });
        store.createIndex("by_status", "status", { unique: false });
        store.createIndex("by_company","company", { unique: false });
      }
    };

    req.onsuccess  = () => resolve(req.result);
    req.onerror    = () => reject(req.error);
  });
}

// ── Generic transaction helper ────────────────
async function tx(mode, fn) {
  const db    = await openDB();
  const trans = db.transaction(STORE, mode);
  const store = trans.objectStore(STORE);
  return new Promise((resolve, reject) => {
    const req = fn(store);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
    trans.onerror = () => reject(trans.error);
  });
}

// ── CRUD operations ──────────────────────────

/** Fetch all applications, sorted by date descending */
export async function getAll() {
  const db    = await openDB();
  const trans = db.transaction(STORE, "readonly");
  const store = trans.objectStore(STORE);
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () =>
      resolve(
        (req.result ?? []).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )
      );
    req.onerror = () => reject(req.error);
  });
}

/** Add a new application record */
export async function addApp(app) {
  return tx("readwrite", (store) => store.add(app));
}

/** Update an existing application record */
export async function updateApp(app) {
  return tx("readwrite", (store) => store.put(app));
}

/** Delete an application by id */
export async function deleteApp(id) {
  return tx("readwrite", (store) => store.delete(id));
}

/** Wipe all records (use with care) */
export async function clearAll() {
  return tx("readwrite", (store) => store.clear());
}
