// ============================================================
//  FirebaseShop.js  —  RMS Autoshop Customer Shop Module
//
//  Replaces the in-memory CartDrawer (Home.js) with a
//  Firestore-backed cart that persists across sessions and
//  records every order on checkout.
//
//  Uses ONLY the existing top-level collections visible in
//  your Firestore console:
//    • Bookings
//    • Transactions   ← shop orders are recorded here
//    • User
//
//  Firestore structure written by this module:
//
//  ── CART (persists until checkout) ─────────────────────────
//  User / Customer / Customers / {uid} / Cart / {productId}
//    uid             string
//    customerName    string
//    email           string
//    productId       number
//    name            string
//    category        string
//    sku             string
//    price           number
//    originalPrice   number | null
//    img             string
//    qty             number
//    addedAt         Timestamp
//    lastUpdatedAt   Timestamp
//
//  ── ORDER (written at checkout, cart cleared after) ─────────
//  User / Customer / Customers / {uid} / Orders / {orderId}
//    (same fields as Transactions below — customer's own copy)
//
//  Transactions / {orderId}    ← top-level, same as Bookings pattern
//    orderId         string    e.g. "ORD-20240401-XXXX"
//    type            string    "shop_order"
//    uid             string
//    customerName    string
//    email           string
//    items           array     snapshot of cart at checkout
//    itemCount       number
//    subtotal        number
//    currency        string    "USD"
//    status          string    "completed"
//    createdAt       Timestamp
//    checkoutAt      Timestamp
//
//  Load order in Home.html (bottom of <body>, after Home.js):
//    <script src="Home.js"></script>
//    <script type="module" src="CustomerBackend.js"></script>
//    <script type="module" src="FirebaseHome.js"></script>
//    <script type="module" src="FirebaseBooking.js"></script>
//    <script type="module" src="FirebaseShop.js"></script>
// ============================================================

import { initializeApp, getApps }
  from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// ─────────────────────────────────────────
//  FIREBASE INIT (reuse existing app if already initialised)
// ─────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyD0g9EfP0DPIR7skzKOZ0DyWLlUi5f5LlM",
  authDomain:        "rmsautoshop.firebaseapp.com",
  projectId:         "rmsautoshop",
  storageBucket:     "rmsautoshop.firebasestorage.app",
  messagingSenderId: "699636102924",
  appId:             "1:699636102924:web:1c25aba93b61fd86047b29",
};

const app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ─────────────────────────────────────────
//  MODULE STATE
// ─────────────────────────────────────────
let _uid           = null;
let _customerName  = "";
let _customerEmail = "";
let _cartItems     = [];   // in-memory mirror of Firestore Cart
let _unsubCart     = null; // onSnapshot unsubscribe fn
let _ready         = false;

// ─────────────────────────────────────────
//  FIRESTORE PATH HELPERS
// ─────────────────────────────────────────

// Cart sub-collection under the customer doc
const cartCol     = (uid) =>
  collection(db, "User", "Customer", "Customers", uid, "Cart");

const cartDocRef  = (uid, productId) =>
  doc(db, "User", "Customer", "Customers", uid, "Cart", String(productId));

// Customer's own order copy (sub-collection)
const orderDocRef = (uid, orderId) =>
  doc(db, "User", "Customer", "Customers", uid, "Orders", orderId);

// Top-level Transactions collection (already exists in your Firestore)
// Follows the same pattern FirebaseBooking.js uses for Transactions/TXN-*
const transactionDocRef = (orderId) =>
  doc(db, "Transactions", orderId);

// ─────────────────────────────────────────
//  ORDER ID GENERATOR
//  e.g. "ORD-20240401-A3F9"
// ─────────────────────────────────────────
function generateOrderId() {
  const date   = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${date}-${random}`;
}

// ─────────────────────────────────────────
//  SAFE TOAST WRAPPER
// ─────────────────────────────────────────
function _toast(msg, type = "success") {
  if (typeof window.showToast === "function") {
    window.showToast(msg, type);
  } else {
    console.info(`[FirebaseShop] ${type}: ${msg}`);
  }
}

// ─────────────────────────────────────────
//  RESOLVE CUSTOMER IDENTITY
//  Reads window.USER (set by FirebaseHome.js).
//  Falls back to the raw Auth user object.
// ─────────────────────────────────────────
function _resolveIdentity(authUser) {
  const U        = window.USER;
  _customerName  = (U && U.name)  ? U.name  : (authUser.displayName || authUser.email.split("@")[0]);
  _customerEmail = (U && U.email) ? U.email : authUser.email;
}

// ─────────────────────────────────────────
//  REAL-TIME CART LISTENER
//  Keeps _cartItems in sync with Firestore
//  and re-renders the drawer on every change.
//  Sorted client-side — no composite index needed.
// ─────────────────────────────────────────
function _startCartListener(uid) {
  if (_unsubCart) { _unsubCart(); _unsubCart = null; }

  _unsubCart = onSnapshot(
    cartCol(uid),
    (snap) => {
      _cartItems = snap.docs
        .map((d) => d.data())
        .sort((a, b) => {
          const ta = a.addedAt?.toMillis?.() ?? 0;
          const tb = b.addedAt?.toMillis?.() ?? 0;
          return ta - tb; // oldest first = insertion order
        });

      _updateCartBadge();
      _renderCartList();
      _ready = true;
      console.log(`[FirebaseShop] Cart synced — ${_cartItems.length} item(s).`);
    },
    (err) => {
      console.error("[FirebaseShop] Cart listener error:", err);
    }
  );
}

// ─────────────────────────────────────────
//  ADD ITEM TO CART
// ─────────────────────────────────────────
async function _addItem(productId) {
  if (!_uid) {
    _toast("Please log in to use the cart.", "error");
    return;
  }

  const PRODUCTS = window.PRODUCTS || [];
  const p = PRODUCTS.find((x) => x.id === productId);
  if (!p) {
    console.warn("[FirebaseShop] Product not found:", productId);
    return;
  }
  if (p.stock === 0) {
    _toast("This item is out of stock.", "error");
    return;
  }

  const existing = _cartItems.find((i) => i.productId === productId);
  const ref      = cartDocRef(_uid, productId);

  try {
    if (existing) {
      // Already in cart — increment qty only
      await updateDoc(ref, {
        qty:           existing.qty + 1,
        lastUpdatedAt: serverTimestamp(),
      });
    } else {
      // New cart entry — record full product snapshot + customer identity
      await setDoc(ref, {
        uid:           _uid,
        customerName:  _customerName,
        email:         _customerEmail,
        productId:     p.id,
        name:          p.name,
        category:      p.cat,
        sku:           p.sku,
        price:         p.price,
        originalPrice: p.orig ?? null,
        img:           p.img,
        qty:           1,
        addedAt:       serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
      });
    }
    _toast(`${p.name} added to cart`);
  } catch (err) {
    console.error("[FirebaseShop] addItem error:", err);
    _toast("Could not add item. Please try again.", "error");
  }
}

// ─────────────────────────────────────────
//  CHANGE ITEM QTY  (+1 / -1)
//  Deletes the doc entirely when qty hits 0.
// ─────────────────────────────────────────
async function _changeQty(productId, delta) {
  if (!_uid) return;
  const item = _cartItems.find((i) => i.productId === productId);
  if (!item) return;

  const newQty = item.qty + delta;

  try {
    if (newQty <= 0) {
      await deleteDoc(cartDocRef(_uid, productId));
    } else {
      await updateDoc(cartDocRef(_uid, productId), {
        qty:           newQty,
        lastUpdatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.error("[FirebaseShop] changeQty error:", err);
    _toast("Could not update quantity.", "error");
  }
}

// ─────────────────────────────────────────
//  REMOVE ITEM FROM CART
// ─────────────────────────────────────────
async function _removeItem(productId) {
  if (!_uid) return;
  try {
    await deleteDoc(cartDocRef(_uid, productId));
  } catch (err) {
    console.error("[FirebaseShop] removeItem error:", err);
    _toast("Could not remove item.", "error");
  }
}

// ─────────────────────────────────────────
//  CHECKOUT
//
//  Uses writeBatch to atomically:
//    1. Write order to Transactions/{orderId}
//       (top-level — same collection FirebaseBooking.js uses)
//    2. Write order copy to customer's Orders sub-collection
//    3. Delete every Cart doc for this customer
//
//  This mirrors the exact batch pattern in FirebaseBooking.js.
// ─────────────────────────────────────────
async function _checkout() {
  if (!_uid) {
    _toast("Please log in to check out.", "error");
    return;
  }
  if (!_cartItems.length) {
    _toast("Your cart is empty.", "error");
    return;
  }

  const orderId  = generateOrderId();
  const subtotal = parseFloat(
    _cartItems.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)
  );

  // Full order payload — written to both Transactions and customer Orders
  const orderPayload = {
    orderId,
    type:         "shop_order",   // distinguishes from booking transactions
    uid:          _uid,
    customerName: _customerName,
    email:        _customerEmail,
    // Freeze a snapshot of the cart at the moment of purchase
    items: _cartItems.map((i) => ({
      productId:     i.productId,
      name:          i.name,
      category:      i.category,
      sku:           i.sku,
      price:         i.price,
      originalPrice: i.originalPrice ?? null,
      img:           i.img,
      qty:           i.qty,
      lineTotal:     parseFloat((i.price * i.qty).toFixed(2)),
    })),
    itemCount:  _cartItems.reduce((s, i) => s + i.qty, 0),
    subtotal,
    currency:   "USD",
    status:     "completed",
    createdAt:  serverTimestamp(),
    checkoutAt: serverTimestamp(),
  };

  try {
    const batch = writeBatch(db);

    // 1. Top-level Transactions collection (admin-visible, existing collection)
    batch.set(transactionDocRef(orderId), orderPayload);

    // 2. Customer's own Orders sub-collection (profile view)
    batch.set(orderDocRef(_uid, orderId), orderPayload);

    // 3. Clear all Cart docs atomically
    _cartItems.forEach((item) => {
      batch.delete(cartDocRef(_uid, item.productId));
    });

    await batch.commit();

    _toast(`Order ${orderId} placed — thank you!`);
    _closeDrawer();

    console.log(`[FirebaseShop] ✅ Order committed → Transactions/${orderId}`);
    console.log(`[FirebaseShop] ✅ Customer copy  → Customers/${_uid}/Orders/${orderId}`);

  } catch (err) {
    console.error("[FirebaseShop] checkout error:", err);
    _toast("Checkout failed. Please try again.", "error");
  }
}

// ─────────────────────────────────────────
//  UPDATE CART BADGE  (topbar icon)
// ─────────────────────────────────────────
function _updateCartBadge() {
  const total = _cartItems.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById("cart-badge");
  if (badge) {
    badge.textContent   = total;
    badge.style.display = total > 0 ? "flex" : "none";
  }
}

// ─────────────────────────────────────────
//  RENDER CART DRAWER LIST
//  Same HTML structure as Home.js so all
//  existing CSS classes apply without change.
// ─────────────────────────────────────────
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80";

function _renderCartList() {
  const list = document.getElementById("cart-list");
  if (!list) return;

  if (!_cartItems.length) {
    list.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-icon">🛒</div>
        <p style="font-size:12px;color:var(--text-dim);letter-spacing:1px;">
          Your cart is empty
        </p>
      </div>`;
    _setTotal(0);
    return;
  }

  list.innerHTML = _cartItems
    .map(
      (item) => `
      <div class="cart-row">
        <img class="cart-row-img"
             src="${item.img}"
             alt="${item.name}"
             onerror="this.src='${FALLBACK_IMG}'">
        <div class="cart-row-info">
          <div class="cart-row-name">${item.name}</div>
          <div class="cart-row-price">
            $${(item.price * item.qty).toFixed(2)}
          </div>
          <div class="cart-row-qty">
            <button class="qty-b"
              onclick="window._FSCart.changeQty(${item.productId}, -1)">−</button>
            <span class="qty-n">${item.qty}</span>
            <button class="qty-b"
              onclick="window._FSCart.changeQty(${item.productId}, 1)">+</button>
          </div>
        </div>
        <button class="cart-rm"
          onclick="window._FSCart.removeItem(${item.productId})">✕</button>
      </div>`
    )
    .join("");

  const total = _cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  _setTotal(total);
}

function _setTotal(amount) {
  const el = document.getElementById("cart-total");
  if (el) el.textContent = "$" + amount.toFixed(2);
}

// ─────────────────────────────────────────
//  OPEN / CLOSE DRAWER
// ─────────────────────────────────────────
function _openDrawer() {
  _renderCartList();
  document.getElementById("cart-overlay")?.classList.add("open");
  document.getElementById("cart-drawer")?.classList.add("open");
}

function _closeDrawer() {
  document.getElementById("cart-overlay")?.classList.remove("open");
  document.getElementById("cart-drawer")?.classList.remove("open");
}

// ─────────────────────────────────────────
//  OVERRIDE window.CartDrawer
//  Replaces the in-memory CartDrawer from Home.js.
//  All existing onclick="CartDrawer.xxx()" calls
//  in Home.html continue working without changes.
// ─────────────────────────────────────────
function _installCartOverride() {
  const firebaseCart = {
    addItem:    (id)        => _addItem(id),
    changeQty:  (id, delta) => _changeQty(id, delta),
    removeItem: (id)        => _removeItem(id),
    checkout:   ()          => _checkout(),
    open:       ()          => _openDrawer(),
    close:      ()          => _closeDrawer(),
  };

  window.CartDrawer = firebaseCart;
  window._FSCart    = firebaseCart; // alias for onclick attrs in _renderCartList
  console.log("[FirebaseShop] CartDrawer override installed.");
}

// ─────────────────────────────────────────
//  PUBLIC API  →  window.FirebaseShop
// ─────────────────────────────────────────
const FirebaseShop = {
  /** Force a re-render of the cart drawer. */
  renderCart: _renderCartList,

  /** Returns a shallow copy of the current in-memory cart. */
  getCart: () => [..._cartItems],

  /**
   * Fetch all past shop orders for the current customer.
   * Reads from the customer's Orders sub-collection.
   * Returns newest-first. No composite index required.
   */
  async getOrders() {
    if (!_uid) return [];
    try {
      const snap = await getDocs(
        collection(db, "User", "Customer", "Customers", _uid, "Orders")
      );
      return snap.docs
        .map((d) => d.data())
        .sort((a, b) => {
          const ta = a.checkoutAt?.toMillis?.() ?? 0;
          const tb = b.checkoutAt?.toMillis?.() ?? 0;
          return tb - ta; // newest first
        });
    } catch (err) {
      console.error("[FirebaseShop] getOrders error:", err);
      return [];
    }
  },

  /** Returns true once the first cart snapshot has been received. */
  isReady: () => _ready,

  /** Returns the current Firebase Auth UID. */
  getUid: () => _uid,
};

window.FirebaseShop = FirebaseShop;

// ─────────────────────────────────────────
//  AUTH STATE OBSERVER  —  entry point
//  400 ms delay matches FirebaseBooking.js so
//  window.USER is populated by FirebaseHome.js first.
// ─────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  if (user) {
    _uid = user.uid;

    setTimeout(() => {
      _resolveIdentity(user);
      _installCartOverride();
      _startCartListener(_uid);
      console.log(`[FirebaseShop] Initialized for ${_customerEmail} (${_uid})`);
    }, 400);

  } else {
    if (_unsubCart) { _unsubCart(); _unsubCart = null; }
    _uid           = null;
    _customerName  = "";
    _customerEmail = "";
    _cartItems     = [];
    _ready         = false;
    _updateCartBadge();
    _renderCartList();
    console.log("[FirebaseShop] User signed out — cart cleared.");
  }
});

console.log("📦 FirebaseShop.js loaded — window.FirebaseShop available");
export default FirebaseShop;