/* ============================================================
   store.js — Centralised product state
   Single source of truth. Exposes read methods and mutations.
   Notifies subscribers (pages) whenever data changes.
   ============================================================ */

const Store = (() => {
  // Deep-copy seed data so the original is never mutated
  let _products = SEED_PRODUCTS.map(p => ({ ...p }));
  let _nextId   = _products.length + 1;

  // ── Subscriber registry ──────────────────────────────────
  const _listeners = [];

  function subscribe(fn) {
    _listeners.push(fn);
  }

  function _notify() {
    _listeners.forEach(fn => fn());
  }

  // ── Getters ──────────────────────────────────────────────

  /** Return a shallow copy of all products */
  function getAll() {
    return [..._products];
  }

  /** Find a single product by id */
  function getById(id) {
    return _products.find(p => p.id === id) || null;
  }

  /**
   * Return products filtered by category and/or search query.
   * @param {Object} opts  { category: string, query: string }
   */
  function getFiltered({ category = 'all', query = '' } = {}) {
    const q = query.toLowerCase().trim();
    return _products.filter(p => {
      const matchCat = category === 'all' || p.cat === category;
      const matchQ   = !q
        || p.name.toLowerCase().includes(q)
        || p.cat.toLowerCase().includes(q)
        || p.sku.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }

  /** Products with stock at or below the given threshold */
  function getLowStock(threshold = 5) {
    return _products.filter(p => p.stock <= threshold);
  }

  function getTotalCount()    { return _products.length; }
  function getCategories()    { return [...new Set(_products.map(p => p.cat))]; }

  /** Rough revenue estimate based on simulated sales */
  function getSimulatedRevenue() {
    return _products.reduce((sum, p) => sum + p.price * Math.max(0, 50 - p.stock), 0);
  }

  // ── Mutations ────────────────────────────────────────────

  function add(data) {
    _products.push({ id: _nextId++, ...data });
    _notify();
  }

  function update(id, data) {
    const idx = _products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    _products[idx] = { ..._products[idx], ...data };
    _notify();
    return true;
  }

  function remove(id) {
    const before = _products.length;
    _products = _products.filter(p => p.id !== id);
    const removed = _products.length < before;
    if (removed) _notify();
    return removed;
  }

  function adjustStock(id, delta) {
    const p = getById(id);
    if (!p) return false;
    return update(id, { stock: Math.max(0, p.stock + delta) });
  }

  // ── Public API ───────────────────────────────────────────
  return {
    subscribe,
    getAll,
    getById,
    getFiltered,
    getLowStock,
    getTotalCount,
    getCategories,
    getSimulatedRevenue,
    add,
    update,
    remove,
    adjustStock,
  };
})();
