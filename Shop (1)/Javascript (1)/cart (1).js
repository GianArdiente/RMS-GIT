/* ============================================================
   cart.js — Shopping cart state, rendering, and drawer UI
   ============================================================ */

const Cart = (() => {
  let _items = []; // [{ ...product, qty: number }]

  // ── Internal helpers ─────────────────────────────────────

  function _find(id) {
    return _items.find(i => i.id === id);
  }

  function _updateBadge() {
    const total = _items.reduce((sum, i) => sum + i.qty, 0);
    document.getElementById('cart-badge').textContent = total;
  }

  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80';

  // ── Mutations ────────────────────────────────────────────

  function addItem(productId) {
    const product = Store.getById(productId);
    if (!product) return;

    const existing = _find(productId);
    if (existing) {
      existing.qty++;
    } else {
      _items.push({ ...product, qty: 1 });
    }

    _updateBadge();
    Toast.success(`${product.name} added to cart`);
  }

  function changeQty(productId, delta) {
    const item = _find(productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      _items = _items.filter(i => i.id !== productId);
    }

    _updateBadge();
    _renderList();
  }

  function removeItem(productId) {
    _items = _items.filter(i => i.id !== productId);
    _updateBadge();
    _renderList();
  }

  function checkout() {
    if (!_items.length) {
      Toast.error('Your cart is empty');
      return;
    }
    Toast.success('Order placed — thank you!');
    _items = [];
    _updateBadge();
    _renderList();
    close();
  }

  // ── Rendering ────────────────────────────────────────────

  function _renderList() {
    const list = document.getElementById('cart-list');

    if (!_items.length) {
      list.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">✦</div>
          <p style="letter-spacing:2px;font-size:.82rem">Your cart is empty</p>
        </div>`;
      document.getElementById('cart-total').textContent = '$0.00';
      return;
    }

    list.innerHTML = _items.map(item => `
      <div class="cart-row">
        <img class="cart-row-img"
          src="${item.img}"
          alt="${item.name}"
          onerror="this.src='${FALLBACK_IMG}'">
        <div class="cart-row-info">
          <div class="cart-row-name">${item.name}</div>
          <div class="cart-row-price">$${(item.price * item.qty).toFixed(2)}</div>
          <div class="cart-row-qty">
            <button class="qty-b" onclick="Cart.changeQty(${item.id}, -1)">−</button>
            <span class="qty-n">${item.qty}</span>
            <button class="qty-b" onclick="Cart.changeQty(${item.id},  1)">+</button>
          </div>
        </div>
        <button class="cart-rm" onclick="Cart.removeItem(${item.id})">✕</button>
      </div>`).join('');

    const total = _items.reduce((sum, i) => sum + i.price * i.qty, 0);
    document.getElementById('cart-total').textContent = '$' + total.toFixed(2);
  }

  // ── Drawer UI ────────────────────────────────────────────

  function open() {
    _renderList();
    document.getElementById('cart-overlay').classList.add('open');
    document.getElementById('cart-drawer').classList.add('open');
  }

  function close() {
    document.getElementById('cart-overlay').classList.remove('open');
    document.getElementById('cart-drawer').classList.remove('open');
  }

  // ── Public API ───────────────────────────────────────────
  return { addItem, changeQty, removeItem, checkout, open, close };
})();
