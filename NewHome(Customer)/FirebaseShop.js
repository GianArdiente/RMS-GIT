// ============================================================
//  FirebaseShop.js  —  RMS Autoshop | Cart, Orders & Shop
//  SDK: 12.11.0 — unified with FirebaseDatabase.js &
//                             CustomerBackend.js
//
//  CHANGELOG (payment method update):
//  ─────────────────────────────────────────────────────────
//  • _checkout() now accepts (paymentMethod, paymentLabel,
//    paymentMeta) parameters so the PayModal in Home.js can
//    pass the chosen payment method through to Firestore.
//
//  • paymentMethod  — machine key: "cod" | "gcash" | "card"
//  • paymentLabel   — human label: "Cash on Delivery" | …
//  • paymentMeta    — optional object with method-specific
//    details (gcashNumber, gcashName, cardLastFour,
//    cardNetwork, cardHolder). Sensitive fields (full card
//    number, CVV, expiry) are NEVER stored — only the last
//    four digits and network are recorded for receipts.
//
//  • paymentMethod, paymentLabel, and paymentMeta are written
//    to BOTH Firestore destinations atomically:
//      Transactions/{orderId}
//      …/Customers/{uid}/Orders/{orderId}
//    and to the non-critical Phase 2 paths:
//      …/Customers/{uid}  (root — lastOrderPaymentMethod)
//      …/Shop/profile     (lastOrderPaymentMethod)
//
//  • The queue shim's checkout() now forwards (paymentMethod,
//    paymentLabel, paymentMeta) so calls queued before auth
//    resolves carry the full payment context.
//
//  • _installRealAPI() exposes checkout(pm, pl, pmeta) on
//    both window.CartDrawer and window._FSCart.
//
//  FIX LOG (previous versions):
//  ─────────────────────────────────────────────────────────
//  1. CRITICAL — totalOrderCount / totalOrderValue not updating:
//     Phase 2 now uses Firestore's atomic increment() sentinel.
//
//  2. Removed deprecated enableIndexedDbPersistence().
//     Replaced with initializeFirestore({ localCache: persistentLocalCache() }).
//
//  3. FirebaseDatabase.js SDK unified from 10.7.2 → 12.11.0.
//
//  4. CRITICAL — Cart items doubled on every page refresh.
//     Two separate localStorage keys now used:
//       GUEST_CART_KEY  ("rev_guest_cart")  — genuinely signed-out items only.
//       BADGE_MIRROR_KEY ("rev_cart_mirror") — badge snapshot on logout, never merged.
//
//  FIRESTORE STRUCTURE
//  ─────────────────────────────────────────────────────────
//
//  Cart subcollection (per-item documents, live):
//    User/Customer/Customers/{uid}/Cart/{productId}
//
//  Orders subcollection (permanent — never deleted):
//    User/Customer/Customers/{uid}/Orders/{orderId}
//      ↳ now includes: paymentMethod, paymentLabel, paymentMeta
//
//  Admin orders:
//    Transactions/{orderId}
//      ↳ now includes: paymentMethod, paymentLabel, paymentMeta
//
//  Shop subcollection:
//    …/{uid}/Shop/profile | wishlist | addresses | loyalty
//
//  LOAD ORDER in Home.html (before </body>):
//  ─────────────────────────────────────────────────────────
//  <script src="Home.js"></script>
//  <script type="module" src="FirebaseDatabase.js"></script>
//  <script type="module" src="CustomerBackend.js"></script>
//  <script type="module" src="FirebaseHome.js"></script>
//  <script type="module" src="FirebaseBooking.js"></script>
//  <script type="module" src="FirebaseShop.js"></script>   ← LAST
// ============================================================

import { initializeApp, getApps }
  from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// ─── Firebase config ─────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyD0g9EfP0DPIR7skzKOZ0DyWLlUi5f5LlM",
  authDomain:        "rmsautoshop.firebaseapp.com",
  projectId:         "rmsautoshop",
  storageBucket:     "rmsautoshop.firebasestorage.app",
  messagingSenderId: "699636102924",
  appId:             "1:699636102924:web:1c25aba93b61fd86047b29",
};

const app  = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

// ─── Firestore init with offline persistence ──────────────────
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache(),
  });
  console.log("[FirebaseShop] Firestore initialized with persistentLocalCache.");
} catch (e) {
  db = getFirestore(app);
  console.log("[FirebaseShop] Reusing existing Firestore instance.");
}

console.log("[FirebaseShop] SDK: 12.11.0 | app:", app.name, "| total apps:", getApps().length);

// ═══════════════════════════════════════════════════════════
//  LOCALSTORAGE KEYS
// ═══════════════════════════════════════════════════════════
const GUEST_CART_KEY   = "rev_guest_cart";
const BADGE_MIRROR_KEY = "rev_cart_mirror";

// ── Guest cart (written only when signed out) ─────────────────
function _readGuestCart()       { try { return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]"); } catch { return []; } }
function _writeGuestCart(items) { try { localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items)); } catch (e) { console.warn("[FirebaseShop] localStorage write failed:", e.message); } }
function _clearGuestCart()      { try { localStorage.removeItem(GUEST_CART_KEY); } catch { /* ignore */ } }

// ── Badge mirror (written only when signed in, never merged) ──
function _readBadgeMirror()       { try { return JSON.parse(localStorage.getItem(BADGE_MIRROR_KEY) || "[]"); } catch { return []; } }
function _writeBadgeMirror(items) { try { localStorage.setItem(BADGE_MIRROR_KEY, JSON.stringify(items)); } catch (e) { console.warn("[FirebaseShop] Badge mirror write failed:", e.message); } }
function _clearBadgeMirror()      { try { localStorage.removeItem(BADGE_MIRROR_KEY); } catch { /* ignore */ } }

// ─── Module state ─────────────────────────────────────────────
let _uid           = null;
let _customerName  = "";
let _customerEmail = "";
let _cartItems     = [];
let _unsubCart     = null;
let _ready         = false;
let _hasSeenAuth   = false;

// ═══════════════════════════════════════════════════════════
//  PRE-AUTH QUEUE SHIM
//  checkout() now queues (paymentMethod, paymentLabel, paymentMeta)
//  so calls made before auth resolves carry full payment context.
// ═══════════════════════════════════════════════════════════
;(function _installQueueShim() {
  const _queue = [];

  window.CartDrawer = {
    addItem:        (id)                       => { _queue.push(() => _addItem(id));                              _toast("Adding…"); },
    changeQty:      (id, d)                    => { _queue.push(() => _changeQty(id, d)); },
    removeItem:     (id)                       => { _queue.push(() => _removeItem(id)); },
    checkout:       (pm, pl, pmeta)            => { _queue.push(() => _checkout(pm, pl, pmeta)); },
    toggleWishlist: (id)                       => { _queue.push(() => _toggleWishlist(id));                       _toast("Saving…"); },
    open:           ()                         => _openDrawer(),
    close:          ()                         => _closeDrawer(),
    _queue,
    _isShim: true,
  };
  window._FSCart = window.CartDrawer;
  console.log("[FirebaseShop] Queue shim installed.");
})();

// ─── Firestore path helpers ───────────────────────────────────
const PATH = {
  customerDoc:        (uid)      => doc(db, "User", "Customer", "Customers", uid),
  cartCol:            (uid)      => collection(db, "User", "Customer", "Customers", uid, "Cart"),
  cartItem:           (uid, pid) => doc(db, "User", "Customer", "Customers", uid, "Cart", String(pid)),
  ordersCol:          (uid)      => collection(db, "User", "Customer", "Customers", uid, "Orders"),
  orderDoc:           (uid, oid) => doc(db, "User", "Customer", "Customers", uid, "Orders", oid),
  shopDoc:            (uid, d)   => doc(db, "User", "Customer", "Customers", uid, "Shop", d),
  transaction:        (oid)      => doc(db, "Transactions", oid),
  product:            (pid)      => doc(db, "Products", String(pid)),
  cartActivity:       (uid)      => collection(db, "User", "Customer", "Customers", uid, "CartActivity"),
  cartActivityDoc:    (uid)      => doc(collection(db, "User", "Customer", "Customers", uid, "CartActivity")),
  purchaseHistory:    (uid)      => collection(db, "User", "Customer", "Customers", uid, "PurchaseHistory"),
  purchaseHistoryDoc: (uid)      => doc(collection(db, "User", "Customer", "Customers", uid, "PurchaseHistory")),
};

// ─── Utility helpers ──────────────────────────────────────────
function _genOrderId() {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const r = Math.random().toString(36).substring(2, 6).toUpperCase();
  return "ORD-" + d + "-" + r;
}

function _toast(msg, type = "success") {
  if (typeof window.showToast === "function") window.showToast(msg, type);
  else console.info("[FirebaseShop toast]", msg);
}

function _calcTier(pts) {
  if (pts >= 5000) return "Platinum";
  if (pts >= 2000) return "Gold";
  if (pts >= 500)  return "Silver";
  return "Bronze";
}

function _calcEarnedPoints(subtotal) {
  return Math.floor(subtotal / 10);
}

// ═══════════════════════════════════════════════════════════
//  PAYMENT METHOD SANITIZER
//
//  Builds a safe paymentMeta object to store in Firestore.
//  Full card numbers, CVV, and expiry are NEVER stored —
//  only the last four digits, detected card network, and
//  cardholder name are kept for receipt display purposes.
//  For GCash: the registered number and account name are stored.
//  For COD: an empty object is stored (no extra fields needed).
// ═══════════════════════════════════════════════════════════
function _sanitizePaymentMeta(paymentMethod, rawMeta = {}) {
  if (paymentMethod === "gcash") {
    return {
      gcashNumber: (rawMeta.gcashNumber || "").replace(/\s/g, "").slice(-4)
        ? "•••• " + (rawMeta.gcashNumber || "").replace(/\s/g, "").slice(-4)
        : "—",
      gcashName:   (rawMeta.gcashName || "").trim() || "—",
    };
  }

  if (paymentMethod === "card") {
    const rawNum    = (rawMeta.cardNumber || "").replace(/\s/g, "");
    const lastFour  = rawNum.slice(-4) || "——";
    const network   = _detectCardNetwork(rawNum);
    return {
      cardLastFour: lastFour,
      cardNetwork:  network,
      cardHolder:   (rawMeta.cardHolder || "").trim() || "—",
      // expiry stored as MM/YY only (no CVV, no full number)
      cardExpiry:   (rawMeta.cardExpiry || "").trim() || "—",
    };
  }

  // COD — no extra meta needed
  return {};
}

// Detect card network from first digits (BIN ranges)
function _detectCardNetwork(number) {
  if (!number) return "Unknown";
  if (/^4/.test(number))                         return "Visa";
  if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) return "Mastercard";
  if (/^35/.test(number))                        return "JCB";
  if (/^3[47]/.test(number))                     return "American Express";
  if (/^6/.test(number))                         return "Discover / UnionPay";
  return "Unknown";
}

// ─── Identity resolution ──────────────────────────────────────
async function _resolveIdentity(authUser) {
  try {
    const snap = await getDoc(PATH.customerDoc(authUser.uid));
    if (snap.exists()) {
      const d     = snap.data();
      const first = (d.firstName || "").trim();
      const last  = (d.lastName  || "").trim();
      _customerName  =
        [first, last].filter(Boolean).join(" ") ||
        d.name || d.customerName ||
        authUser.displayName ||
        authUser.email.split("@")[0];
      _customerEmail = d.email || authUser.email;
    } else {
      _customerName  = authUser.displayName || authUser.email.split("@")[0];
      _customerEmail = authUser.email;
    }
    console.log("[FirebaseShop] ✅ Identity:", _customerName, "<" + _customerEmail + ">");
  } catch (err) {
    _customerName  = authUser.displayName || authUser.email.split("@")[0];
    _customerEmail = authUser.email;
    console.warn("[FirebaseShop] Identity fetch error:", err.message);
  }
}

// ─── Product resolver ─────────────────────────────────────────
async function _resolveProduct(productId, requireFreshStock = false) {
  const numId = Number(productId);

  if (!requireFreshStock) {
    for (let i = 0; i < 15; i++) {
      const local = (window.PRODUCTS || []).find(x => Number(x.id) === numId);
      if (local) return local;
      await new Promise(r => setTimeout(r, 200));
    }
  }

  try {
    const snap = await getDoc(PATH.product(productId));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      id:    Number(d.id),
      name:  d.name,
      cat:   d.category,
      price: Number(d.price),
      orig:  d.originalPrice ?? null,
      stock: Number(d.stock),
      sku:   d.sku   || "",
      badge: d.badge || "",
      img:   d.img   || "",
    };
  } catch (err) {
    console.error("[FirebaseShop] Firestore product fetch error:", err);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
//  GUEST CART → FIRESTORE MERGE
// ═══════════════════════════════════════════════════════════
async function _mergeGuestCartIntoFirestore(uid) {
  const guestItems = _readGuestCart();
  if (!guestItems.length) {
    console.log("[FirebaseShop] No guest cart items to merge.");
    return;
  }

  console.log("[FirebaseShop] Merging", guestItems.length, "guest item(s) into Firestore…");

  try {
    const batch = writeBatch(db);
    let mergeCount = 0;

    for (const gi of guestItems) {
      const pid      = String(gi.productId);
      const cartRef  = PATH.cartItem(uid, pid);
      const existing = await getDoc(cartRef);

      if (existing.exists()) {
        batch.update(cartRef, {
          qty:           existing.data().qty + (gi.qty || 1),
          lastUpdatedAt: serverTimestamp(),
        });
      } else {
        batch.set(cartRef, {
          uid,
          customerName:  _customerName,
          email:         _customerEmail,
          productId:     Number(gi.productId),
          name:          gi.name          || "",
          category:      gi.category      || "",
          sku:           gi.sku           || "",
          price:         Number(gi.price) || 0,
          originalPrice: gi.originalPrice ?? null,
          img:           gi.img           || "",
          qty:           gi.qty           || 1,
          addedAt:       serverTimestamp(),
          lastUpdatedAt: serverTimestamp(),
        });
      }
      mergeCount++;
    }

    await batch.commit();
    _clearGuestCart();
    console.log("[FirebaseShop] ✅ Guest cart merged:", mergeCount, "item(s).");
  } catch (err) {
    console.error("[FirebaseShop] Guest cart merge error:", err);
  }
}

// ─── Serialize cart item for localStorage ────────────────────
function _serializeForStorage(i) {
  return {
    productId:     i.productId,
    name:          i.name,
    category:      i.category      || "",
    sku:           i.sku           || "",
    price:         i.price,
    originalPrice: i.originalPrice ?? null,
    img:           i.img           || "",
    qty:           i.qty,
    addedAt:       i.addedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════
//  REAL-TIME CART LISTENER
// ═══════════════════════════════════════════════════════════
function _startCartListener(uid) {
  if (_unsubCart) { _unsubCart(); _unsubCart = null; }

  console.log("[FirebaseShop] Starting real-time cart listener for uid:", uid);

  _unsubCart = onSnapshot(
    PATH.cartCol(uid),
    snap => {
      _cartItems = snap.docs
        .map(d => d.data())
        .sort((a, b) => (a.addedAt?.toMillis?.() ?? 0) - (b.addedAt?.toMillis?.() ?? 0));

      _writeBadgeMirror(_cartItems.map(_serializeForStorage));
      _updateBadge();
      _renderCart();
      console.log("[FirebaseShop] 🛒 Cart synced from Firestore:", _cartItems.length, "item(s).");
    },
    err => console.error("[FirebaseShop] Cart listener error:", err)
  );
}

async function _loadCartOnce(uid) {
  if (!uid) return;
  try {
    const snap  = await getDocs(PATH.cartCol(uid));
    const items = snap.docs
      .map(d => d.data())
      .sort((a, b) => (a.addedAt?.toMillis?.() ?? 0) - (b.addedAt?.toMillis?.() ?? 0));
    if (items.length) {
      _cartItems = items;
      _writeBadgeMirror(_cartItems.map(_serializeForStorage));
      _updateBadge();
      _renderCart();
      console.log("[FirebaseShop] 🛒 Cart loaded from Firestore once:", _cartItems.length, "item(s).");
    }
  } catch (err) {
    console.error("[FirebaseShop] loadCartOnce error:", err);
  }
}

// ═══════════════════════════════════════════════════════════
//  CART OPERATIONS
// ═══════════════════════════════════════════════════════════

async function _addItem(productId) {
  if (!_uid) {
    const p = await _resolveProduct(productId);
    if (!p)           { _toast("Product not found — please refresh.", "error"); return; }
    if (p.stock <= 0) { _toast(p.name + " is out of stock.", "error");          return; }

    const guestCart = _readGuestCart();
    const existing  = guestCart.find(x => Number(x.productId) === Number(productId));

    if (existing) {
      if (existing.qty >= p.stock) { _toast("Only " + p.stock + " unit(s) in stock.", "error"); return; }
      existing.qty += 1;
    } else {
      guestCart.push({
        productId:     Number(p.id),
        name:          p.name,
        category:      p.cat   || "",
        sku:           p.sku   || "",
        price:         Number(p.price),
        originalPrice: p.orig  ?? null,
        img:           p.img   || "",
        qty:           1,
        addedAt:       new Date().toISOString(),
      });
    }

    _writeGuestCart(guestCart);
    _cartItems = [...guestCart];
    _updateBadge();
    _renderCart();
    _toast(p.name + " added to cart ✓");
    console.log("[FirebaseShop] Guest cart (localStorage):", p.name);
    return;
  }

  const p = await _resolveProduct(productId);
  if (!p)           { _toast("Product not found — please refresh.", "error"); return; }
  if (p.stock <= 0) { _toast(p.name + " is out of stock.", "error");          return; }

  const existing = _cartItems.find(x => Number(x.productId) === Number(productId));

  try {
    const action = existing ? "qty_increase" : "added";
    if (existing) {
      if (existing.qty >= p.stock) { _toast("Only " + p.stock + " unit(s) in stock.", "error"); return; }
      await updateDoc(PATH.cartItem(_uid, productId), {
        qty:           existing.qty + 1,
        lastUpdatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(PATH.cartItem(_uid, productId), {
        uid:           _uid,
        customerName:  _customerName,
        email:         _customerEmail,
        productId:     Number(p.id),
        name:          p.name,
        category:      p.cat   || "",
        sku:           p.sku   || "",
        price:         Number(p.price) || 0,
        originalPrice: p.orig  ?? null,
        img:           p.img   || "",
        qty:           1,
        addedAt:       serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
      });
    }

    try {
      await setDoc(PATH.cartActivityDoc(_uid), {
        uid:           _uid,
        productId:     Number(p.id),
        name:          p.name,
        category:      p.cat   || "",
        sku:           p.sku   || "",
        price:         Number(p.price) || 0,
        img:           p.img   || "",
        action,
        loggedAt:      serverTimestamp(),
        loggedAtISO:   new Date().toISOString(),
      });
    } catch (logErr) {
      console.warn("[FirebaseShop] CartActivity log failed (non-critical):", logErr.message);
    }

    _toast(p.name + " added to cart ✓");
  } catch (err) {
    console.error("[FirebaseShop] ❌ addItem failed:", err.code, err.message);
    _toast("Could not add item — " + (err.message || "please try again."), "error");
  }
}

async function _changeQty(productId, delta) {
  if (!_uid) {
    const guestCart = _readGuestCart();
    const item      = guestCart.find(x => Number(x.productId) === Number(productId));
    if (!item) return;
    item.qty += delta;
    const updated = item.qty <= 0
      ? guestCart.filter(x => Number(x.productId) !== Number(productId))
      : guestCart;
    _writeGuestCart(updated);
    _cartItems = [...updated];
    _updateBadge();
    _renderCart();
    return;
  }

  const item = _cartItems.find(x => Number(x.productId) === Number(productId));
  if (!item) return;

  if (delta > 0) {
    const p = await _resolveProduct(productId, true);
    if (p && item.qty >= p.stock) { _toast("Only " + p.stock + " unit(s) available.", "error"); return; }
  }

  try {
    const newQty = item.qty + delta;
    if (newQty <= 0) {
      await deleteDoc(PATH.cartItem(_uid, productId));
    } else {
      await updateDoc(PATH.cartItem(_uid, productId), {
        qty:           newQty,
        lastUpdatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.error("[FirebaseShop] changeQty error:", err);
    _toast("Could not update quantity.", "error");
  }
}

async function _removeItem(productId) {
  if (!_uid) {
    const updated = _readGuestCart().filter(x => Number(x.productId) !== Number(productId));
    _writeGuestCart(updated);
    _cartItems = [...updated];
    _updateBadge();
    _renderCart();
    return;
  }

  try {
    await deleteDoc(PATH.cartItem(_uid, productId));
  } catch (err) {
    console.error("[FirebaseShop] removeItem error:", err);
    _toast("Could not remove item.", "error");
  }
}

// ═══════════════════════════════════════════════════════════
//  CHECKOUT  —  TWO-PHASE COMMIT
//
//  Parameters
//  ──────────
//  paymentMethod  {string}  "cod" | "gcash" | "card"
//                           Defaults to "cod" if omitted.
//
//  paymentLabel   {string}  Human-readable label sent from
//                           PayModal — e.g. "GCash".
//                           Defaults to "Cash on Delivery".
//
//  paymentMeta    {object}  Raw form values from PayModal.
//                           Sanitized by _sanitizePaymentMeta()
//                           before being stored — full card
//                           numbers and CVV are NEVER saved.
//                           Only last-four, network, holder
//                           name, and expiry (MM/YY) for cards;
//                           masked number and account name for
//                           GCash; empty object for COD.
//
//  What gets stored in Firestore (both Transactions & Orders):
//  ───────────────────────────────────────────────────────────
//  paymentMethod        "cod" | "gcash" | "card"
//  paymentLabel         "Cash on Delivery" | "GCash" | "Credit / Debit Card"
//  paymentMeta          sanitized object (see _sanitizePaymentMeta)
//  paymentRecordedAt    Firestore server timestamp
// ═══════════════════════════════════════════════════════════
async function _checkout(
  paymentMethod = "cod",
  paymentLabel  = "Cash on Delivery",
  paymentMeta   = {}
) {
  if (!_uid) {
    _toast("Please log in to complete your order.", "error");
    return;
  }
  if (!_cartItems.length) {
    _toast("Your cart is empty.", "error");
    return;
  }

  // Validate payment method value
  const VALID_METHODS = ["cod", "gcash", "card"];
  if (!VALID_METHODS.includes(paymentMethod)) {
    console.warn("[FirebaseShop] Unknown paymentMethod:", paymentMethod, "— defaulting to cod.");
    paymentMethod = "cod";
    paymentLabel  = "Cash on Delivery";
  }

  // Sanitize meta — strips sensitive card data before any storage
  const safePaymentMeta = _sanitizePaymentMeta(paymentMethod, paymentMeta);

  _toast("Validating your order…");

  // ── Live stock validation ─────────────────────────────────
  const stockErrors  = [];
  const liveStockMap = {};

  for (const ci of _cartItems) {
    try {
      const snap = await getDoc(PATH.product(ci.productId));
      if (!snap.exists()) {
        stockErrors.push(`${ci.name} — product no longer available`);
        continue;
      }
      const data = snap.data();
      liveStockMap[Number(ci.productId)] = {
        stock: Number(data.stock || 0),
        name:  data.name || ci.name,
      };
      if (Number(data.stock || 0) < ci.qty) {
        stockErrors.push(
          `${data.name || ci.name} — only ${data.stock || 0} left (you have ${ci.qty})`
        );
      }
    } catch (err) {
      console.error("[FirebaseShop] Stock validation error for product", ci.productId, err);
      stockErrors.push(`${ci.name} — could not verify stock, please retry`);
    }
  }

  if (stockErrors.length) {
    _toast("Cannot checkout: " + stockErrors.join("; "), "error");
    return;
  }

  // ── Build order payload ───────────────────────────────────
  const orderId = _genOrderId();
  const now     = new Date();
  const dateISO = now.toISOString().slice(0, 10);

  const itemsSnapshot = _cartItems.map(i => ({
    productId:     Number(i.productId),
    name:          i.name,
    category:      i.category      || "",
    sku:           i.sku           || "",
    price:         Number(i.price),
    originalPrice: i.originalPrice ?? null,
    img:           i.img           || "",
    qty:           i.qty,
    lineTotal:     parseFloat((Number(i.price) * i.qty).toFixed(2)),
  }));

  const subtotal    = parseFloat(itemsSnapshot.reduce((s, i) => s + i.lineTotal, 0).toFixed(2));
  const itemCount   = _cartItems.reduce((s, i) => s + i.qty, 0);
  const itemSummary = itemsSnapshot.map(i => `${i.name} x${i.qty}`).join(", ");
  const earnedPts   = _calcEarnedPoints(subtotal);

  // ── Payment block (written to both Firestore destinations) ──
  const paymentBlock = {
    paymentMethod,
    paymentLabel,
    paymentMeta:        safePaymentMeta,
    paymentRecordedAt:  serverTimestamp(),
    paymentRecordedISO: now.toISOString(),
  };

  const orderPayload = {
    orderId,
    type:          "shop_order",
    uid:           _uid,
    customerName:  _customerName,
    email:         _customerEmail,
    items:         itemsSnapshot,
    itemCount,
    subtotal,
    currency:      "PHP",
    status:        "completed",
    loyaltyEarned: earnedPts,
    // ── payment fields ──────────────────────────────────────
    ...paymentBlock,
    // ── timestamps ─────────────────────────────────────────
    createdAt:     serverTimestamp(),
    checkoutAt:    serverTimestamp(),
    checkoutAtISO: now.toISOString(),
    checkoutDate:  dateISO,
  };

  try {
    // ── PHASE 1: Atomic batch ─────────────────────────────────
    const batch = writeBatch(db);

    // ① Admin transaction record (includes payment block)
    batch.set(PATH.transaction(orderId), orderPayload);

    // ② Customer order history (includes payment block)
    batch.set(PATH.orderDoc(_uid, orderId), orderPayload);

    // ③ Decrement product stock
    for (const ci of _cartItems) {
      batch.update(PATH.product(ci.productId), {
        stock:     increment(-ci.qty),
        updatedAt: serverTimestamp(),
      });
    }

    // ④ Delete cart items from Firestore
    for (const ci of _cartItems) {
      batch.delete(PATH.cartItem(_uid, ci.productId));
    }

    // ⑤ Write PurchaseHistory entries (include paymentMethod for filtering)
    for (const ci of itemsSnapshot) {
      const phRef = PATH.purchaseHistoryDoc(_uid);
      batch.set(phRef, {
        uid:            _uid,
        orderId,
        productId:      ci.productId,
        name:           ci.name,
        category:       ci.category      || "",
        sku:            ci.sku           || "",
        price:          ci.price,
        originalPrice:  ci.originalPrice ?? null,
        img:            ci.img           || "",
        qty:            ci.qty,
        lineTotal:      ci.lineTotal,
        currency:       "PHP",
        // payment method recorded on every line item for easy admin queries
        paymentMethod,
        paymentLabel,
        purchasedAt:    serverTimestamp(),
        purchasedAtISO: now.toISOString(),
        purchaseDate:   dateISO,
      });
    }

    await batch.commit();

    _clearGuestCart();
    _clearBadgeMirror();

    console.log("══════════════════════════════════════════════════════");
    console.log("[FirebaseShop] ✅ ORDER COMMITTED");
    console.log("  orderId:         ", orderId);
    console.log("  customer:        ", _customerName, "<" + _customerEmail + ">");
    console.log("  uid:             ", _uid);
    console.log("  items:           ", itemSummary);
    console.log("  total:           ₱", subtotal);
    console.log("  loyalty earned:  ", earnedPts, "pts");
    console.log("  paymentMethod:   ", paymentMethod);
    console.log("  paymentLabel:    ", paymentLabel);
    console.log("  paymentMeta:     ", JSON.stringify(safePaymentMeta));
    console.log("  ✓ Transactions/" + orderId);
    console.log("  ✓ …/Customers/" + _uid + "/Orders/" + orderId);
    console.log("  ✓ Stock decremented for", _cartItems.length, "product(s)");
    console.log("  ✓ Cart cleared from Firestore + localStorage");
    console.log("══════════════════════════════════════════════════════");

    // ── PHASE 2: Non-critical profile updates ──────────────────

    // ⑥ Root customer doc — last order metadata (includes payment method)
    setDoc(PATH.customerDoc(_uid), {
      lastOrderRef:           orderId,
      lastOrderAt:            serverTimestamp(),
      lastOrderDateISO:       dateISO,
      lastOrderTotal:         subtotal,
      lastOrderCurrency:      "PHP",
      lastOrderItems:         itemSummary,
      lastOrderStatus:        "completed",
      lastOrderPaymentMethod: paymentMethod,
      lastOrderPaymentLabel:  paymentLabel,
    }, { merge: true }).catch(e =>
      console.warn("[FirebaseShop] Customer root doc update (non-critical):", e.message)
    );

    // ⑦ Shop/profile — atomic increment + payment method tracking
    setDoc(PATH.shopDoc(_uid, "profile"), {
      totalOrderCount:        increment(1),
      totalOrderValue:        increment(subtotal),
      lastOrderRef:           orderId,
      lastOrderAt:            serverTimestamp(),
      lastOrderPaymentMethod: paymentMethod,
      lastOrderPaymentLabel:  paymentLabel,
      lastShopActivity:       serverTimestamp(),
      updatedAt:              serverTimestamp(),
    }, { merge: true }).then(() => {
      console.log("[FirebaseShop] ✅ Shop/profile order stats updated:",
        "count +1, value +₱" + subtotal, "| payment:", paymentLabel);
    }).catch(e =>
      console.warn("[FirebaseShop] Shop/profile update (non-critical):", e.message)
    );

    // ⑧ Shop/loyalty — award points using increment()
    if (earnedPts > 0) {
      const historyEntry = {
        type:          "credit",
        points:        earnedPts,
        ref:           orderId,
        date:          now.toISOString(),
        paymentMethod,
        note:          `Order ${orderId} — ₱${subtotal} via ${paymentLabel}`,
      };
      setDoc(PATH.shopDoc(_uid, "loyalty"), {
        points:    increment(earnedPts),
        history:   arrayUnion(historyEntry),
        updatedAt: serverTimestamp(),
      }, { merge: true }).then(async () => {
        try {
          const loyaltySnap = await getDoc(PATH.shopDoc(_uid, "loyalty"));
          if (loyaltySnap.exists()) {
            const newPts = loyaltySnap.data().points || 0;
            await setDoc(PATH.shopDoc(_uid, "loyalty"), {
              tier:      _calcTier(newPts),
              updatedAt: serverTimestamp(),
            }, { merge: true });
          }
        } catch (tierErr) {
          console.warn("[FirebaseShop] Tier recalc (non-critical):", tierErr.message);
        }
        console.log("[FirebaseShop] 🏆 Loyalty awarded:", earnedPts, "pts");
      }).catch(e =>
        console.warn("[FirebaseShop] Shop/loyalty update (non-critical):", e.message)
      );
    }

    _toast(`✅ Order ${orderId} confirmed! You earned ${earnedPts} loyalty points!`);
    _closeDrawer();

  } catch (err) {
    console.error("[FirebaseShop] ❌ Checkout FAILED:", err.code, err.message);
    _toast("Checkout failed — " + (err.message || "please try again."), "error");
  }
}

// ═══════════════════════════════════════════════════════════
//  WISHLIST OPERATIONS
// ═══════════════════════════════════════════════════════════
async function _toggleWishlist(productId) {
  if (!_uid) { _toast("Please log in to save to your wishlist.", "error"); return; }
  const p = await _resolveProduct(productId);
  if (!p) { _toast("Product not found.", "error"); return; }

  try {
    const wishRef  = PATH.shopDoc(_uid, "wishlist");
    const wishSnap = await getDoc(wishRef);
    const items    = wishSnap.exists() ? (wishSnap.data().items || []) : [];
    const numId    = Number(productId);
    const existing = items.find(x => Number(x.productId) === numId);

    if (existing) {
      await updateDoc(wishRef, { items: arrayRemove(existing), updatedAt: serverTimestamp() });
      _toast(p.name + " removed from wishlist.");
    } else {
      const wishItem = {
        productId: numId,
        name:      p.name,
        category:  p.cat || "",
        sku:       p.sku || "",
        price:     Number(p.price),
        img:       p.img || "",
        addedAt:   new Date().toISOString(),
      };
      await setDoc(wishRef, { items: arrayUnion(wishItem), updatedAt: serverTimestamp() }, { merge: true });
      _toast(p.name + " saved to wishlist ♡");
    }
  } catch (err) {
    console.error("[FirebaseShop] toggleWishlist error:", err);
    _toast("Wishlist update failed.", "error");
  }
}

// ═══════════════════════════════════════════════════════════
//  ADDRESS BOOK OPERATIONS
// ═══════════════════════════════════════════════════════════
async function _addAddress(addressData) {
  if (!_uid) { _toast("Please log in.", "error"); return; }
  try {
    const ref  = PATH.shopDoc(_uid, "addresses");
    const snap = await getDoc(ref);
    const list = snap.exists() ? (snap.data().list || []) : [];
    const newAddr = {
      label:     addressData.label    || "Home",
      line1:     addressData.line1    || "",
      line2:     addressData.line2    || "",
      city:      addressData.city     || "",
      province:  addressData.province || "",
      zip:       addressData.zip      || "",
      country:   addressData.country  || "Philippines",
      isDefault: !!addressData.isDefault,
      createdAt: new Date().toISOString(),
    };
    const updatedList = (addressData.isDefault
      ? list.map(a => ({ ...a, isDefault: false }))
      : list
    ).concat(newAddr);
    await setDoc(ref, { list: updatedList, updatedAt: serverTimestamp() }, { merge: true });
    _toast("Address saved ✓");
  } catch (err) {
    console.error("[FirebaseShop] addAddress error:", err);
    _toast("Could not save address.", "error");
  }
}

async function _removeAddress(idx) {
  if (!_uid) return;
  try {
    const ref  = PATH.shopDoc(_uid, "addresses");
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const list = [...(snap.data().list || [])];
    list.splice(idx, 1);
    await setDoc(ref, { list, updatedAt: serverTimestamp() }, { merge: true });
    _toast("Address removed.");
  } catch (err) { console.error("[FirebaseShop] removeAddress error:", err); }
}

async function _setDefaultAddress(idx) {
  if (!_uid) return;
  try {
    const ref  = PATH.shopDoc(_uid, "addresses");
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const list = (snap.data().list || []).map((a, i) => ({ ...a, isDefault: i === idx }));
    await setDoc(ref, { list, defaultAddressIdx: idx, updatedAt: serverTimestamp() }, { merge: true });
    _toast("Default address updated ✓");
  } catch (err) { console.error("[FirebaseShop] setDefaultAddress error:", err); }
}

// ═══════════════════════════════════════════════════════════
//  LOYALTY POINT REDEMPTION
// ═══════════════════════════════════════════════════════════
async function _redeemPoints(pointsToRedeem, orderRef = "") {
  if (!_uid)               { _toast("Please log in.", "error"); return null; }
  if (pointsToRedeem <= 0) return null;

  try {
    const ref  = PATH.shopDoc(_uid, "loyalty");
    const snap = await getDoc(ref);
    if (!snap.exists()) { _toast("No loyalty account found.", "error"); return null; }

    const current = snap.data().points || 0;
    if (pointsToRedeem > current) {
      _toast("Not enough points. You have " + current + " pts.", "error");
      return null;
    }

    const discount = parseFloat((pointsToRedeem / 10).toFixed(2));
    const newPts   = current - pointsToRedeem;
    const entry    = {
      type:   "debit",
      points: -pointsToRedeem,
      ref:    orderRef || "redemption",
      date:   new Date().toISOString(),
      note:   `Redeemed for ₱${discount} discount`,
    };

    await setDoc(ref, {
      points:    newPts,
      tier:      _calcTier(newPts),
      history:   arrayUnion(entry),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    _toast(`✅ ${pointsToRedeem} pts redeemed for ₱${discount} off!`);
    return { discount };
  } catch (err) {
    console.error("[FirebaseShop] redeemPoints error:", err);
    _toast("Redemption failed. Please try again.", "error");
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
//  UI: CART DRAWER
// ═══════════════════════════════════════════════════════════
function _updateBadge() {
  const total = _cartItems.reduce((s, i) => s + i.qty, 0);
  const el    = document.getElementById("cart-badge");
  if (!el) return;
  el.textContent   = total;
  el.style.display = total > 0 ? "flex" : "none";
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80";

function _renderCart() {
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

  list.innerHTML = _cartItems.map(item => `
    <div class="cart-row">
      <img class="cart-row-img"
           src="${item.img || FALLBACK_IMG}"
           alt="${item.name}"
           onerror="this.src='${FALLBACK_IMG}'">
      <div class="cart-row-info">
        <div class="cart-row-name">${item.name}</div>
        <div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">
          SKU: ${item.sku || "—"} · ${item.category || "—"}
        </div>
        <div class="cart-row-price">₱${(Number(item.price) * item.qty).toFixed(2)}</div>
        <div class="cart-row-qty">
          <button class="qty-b" onclick="window._FSCart.changeQty(${item.productId}, -1)">−</button>
          <span class="qty-n">${item.qty}</span>
          <button class="qty-b" onclick="window._FSCart.changeQty(${item.productId}, 1)">+</button>
        </div>
      </div>
      <button class="cart-rm" onclick="window._FSCart.removeItem(${item.productId})">✕</button>
    </div>`).join("");

  _setTotal(_cartItems.reduce((s, i) => s + Number(i.price) * i.qty, 0));
}

function _setTotal(amount) {
  const el = document.getElementById("cart-total");
  if (el) el.textContent = "₱" + Number(amount).toFixed(2);
}

function _openDrawer() {
  _renderCart();
  document.getElementById("cart-overlay")?.classList.add("open");
  document.getElementById("cart-drawer")?.classList.add("open");
}

function _closeDrawer() {
  document.getElementById("cart-overlay")?.classList.remove("open");
  document.getElementById("cart-drawer")?.classList.remove("open");
}

// ─── Pre-auth badge hydration ─────────────────────────────────
;(function _hydrateFromLocalStorage() {
  const cached = _readBadgeMirror();
  if (!cached.length) return;
  _cartItems = [...cached];

  const renderHydratedCart = () => { _updateBadge(); _renderCart(); };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderHydratedCart);
  } else {
    renderHydratedCart();
  }

  console.log("[FirebaseShop] 📦 Pre-auth badge hydrated from mirror:", cached.length, "item(s).");
})();

// ─── Replace queue shim with real API ────────────────────────
function _installRealAPI() {
  const queued = (window.CartDrawer?._queue) || [];

  const api = {
    addItem:        (id)            => _addItem(id),
    changeQty:      (id, d)         => _changeQty(id, d),
    removeItem:     (id)            => _removeItem(id),
    // checkout now forwards all three payment params
    checkout:       (pm, pl, pmeta) => _checkout(pm, pl, pmeta),
    toggleWishlist: (id)            => _toggleWishlist(id),
    open:           ()              => _openDrawer(),
    close:          ()              => _closeDrawer(),
    _isShim:        false,
  };

  window.CartDrawer = api;
  window._FSCart    = api;

  if (queued.length) {
    console.log("[FirebaseShop] Replaying", queued.length, "queued call(s)…");
    queued.forEach(fn => { try { fn(); } catch (e) { console.warn("[FirebaseShop] Queued call error:", e); } });
  }

  console.log("[FirebaseShop] ✅ Real CartDrawer API installed.");
}

// ═══════════════════════════════════════════════════════════
//  PUBLIC WINDOW API  —  window.FirebaseShop
// ═══════════════════════════════════════════════════════════
window.FirebaseShop = {
  getCart:   () => [..._cartItems],
  getUid:    () => _uid,
  getName:   () => _customerName,
  getEmail:  () => _customerEmail,
  isReady:   () => _ready,

  async getOrders() {
    if (!_uid) return [];
    try {
      const snap = await getDocs(PATH.ordersCol(_uid));
      return snap.docs
        .map(d => d.data())
        .sort((a, b) => (b.checkoutAt?.toMillis?.() ?? 0) - (a.checkoutAt?.toMillis?.() ?? 0));
    } catch (err) { console.error("[FirebaseShop] getOrders error:", err); return []; }
  },

  // Convenience: filter orders by payment method
  async getOrdersByPaymentMethod(method) {
    const all = await this.getOrders();
    return all.filter(o => o.paymentMethod === method);
  },

  async getCartActivity() {
    if (!_uid) return [];
    try {
      const snap = await getDocs(PATH.cartActivity(_uid));
      return snap.docs
        .map(d => d.data())
        .sort((a, b) => (b.loggedAt?.toMillis?.() ?? 0) - (a.loggedAt?.toMillis?.() ?? 0));
    } catch (err) { console.error("[FirebaseShop] getCartActivity error:", err); return []; }
  },

  async getPurchaseHistory() {
    if (!_uid) return [];
    try {
      const snap = await getDocs(PATH.purchaseHistory(_uid));
      return snap.docs
        .map(d => d.data())
        .sort((a, b) => (b.purchasedAt?.toMillis?.() ?? 0) - (a.purchasedAt?.toMillis?.() ?? 0));
    } catch (err) { console.error("[FirebaseShop] getPurchaseHistory error:", err); return []; }
  },

  async getShopProfile() {
    if (!_uid) return null;
    try { const s = await getDoc(PATH.shopDoc(_uid, "profile")); return s.exists() ? s.data() : null; }
    catch (e) { console.error(e); return null; }
  },

  async getWishlist() {
    if (!_uid) return [];
    try { const s = await getDoc(PATH.shopDoc(_uid, "wishlist")); return s.exists() ? (s.data().items || []) : []; }
    catch (e) { console.error(e); return []; }
  },

  async getAddresses() {
    if (!_uid) return [];
    try { const s = await getDoc(PATH.shopDoc(_uid, "addresses")); return s.exists() ? (s.data().list || []) : []; }
    catch (e) { console.error(e); return []; }
  },

  async getLoyalty() {
    if (!_uid) return null;
    try { const s = await getDoc(PATH.shopDoc(_uid, "loyalty")); return s.exists() ? s.data() : null; }
    catch (e) { console.error(e); return null; }
  },

  toggleWishlist: (id) => _toggleWishlist(id),

  async isWishlisted(productId) {
    if (!_uid) return false;
    try {
      const snap = await getDoc(PATH.shopDoc(_uid, "wishlist"));
      return snap.exists() && (snap.data().items || []).some(x => Number(x.productId) === Number(productId));
    } catch { return false; }
  },

  addAddress:        (data)      => _addAddress(data),
  removeAddress:     (idx)       => _removeAddress(idx),
  setDefaultAddress: (idx)       => _setDefaultAddress(idx),
  redeemPoints:      (pts, ref)  => _redeemPoints(pts, ref),

  async awardBonusPoints(points, note = "Bonus points") {
    if (!_uid || points <= 0) return;
    try {
      const historyEntry = { type: "credit", points, ref: "bonus", date: new Date().toISOString(), note };
      await setDoc(PATH.shopDoc(_uid, "loyalty"), {
        points:    increment(points),
        history:   arrayUnion(historyEntry),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      const snap   = await getDoc(PATH.shopDoc(_uid, "loyalty"));
      const newPts = snap.exists() ? (snap.data().points || 0) : 0;
      await setDoc(PATH.shopDoc(_uid, "loyalty"), { tier: _calcTier(newPts) }, { merge: true });
      _toast(`🎉 ${points} bonus points awarded!`);
    } catch (err) { console.error("[FirebaseShop] awardBonusPoints error:", err); }
  },

  async getCartFromFirestore() {
    if (!_uid) return [];
    try { const s = await getDocs(PATH.cartCol(_uid)); return s.docs.map(d => d.data()); }
    catch (e) { console.error(e); return []; }
  },

  async getAllShopDocs() {
    if (!_uid) return {};
    const keys = ["profile", "wishlist", "addresses", "loyalty"];
    const out  = {};
    for (const k of keys) {
      try { const s = await getDoc(PATH.shopDoc(_uid, k)); out[k] = s.exists() ? s.data() : null; }
      catch { out[k] = null; }
    }
    return out;
  },
};

// ═══════════════════════════════════════════════════════════
//  AUTH STATE OBSERVER
// ═══════════════════════════════════════════════════════════
onAuthStateChanged(auth, async user => {
  const isInitialAuthEvent = !_hasSeenAuth;
  _hasSeenAuth = true;

  if (user) {
    _uid   = user.uid;
    _ready = false;
    console.log("[FirebaseShop] 🔑 Auth confirmed — uid:", _uid);

    try {
      await _resolveIdentity(user);
      await _mergeGuestCartIntoFirestore(_uid);
      _ready = true;
      _installRealAPI();
    } catch (err) {
      console.error("[FirebaseShop] Init error:", err);
    } finally {
      _startCartListener(_uid);
      await _loadCartOnce(_uid);
    }

    console.log("[FirebaseShop] ✅ Ready —", _customerName, "<" + _customerEmail + "> | uid:", _uid);

  } else {
    if (isInitialAuthEvent && !_uid) {
      console.log("[FirebaseShop] Initial auth state is signed out; preserving local cache until auth resolves.");
      return;
    }

    if (_unsubCart) { _unsubCart(); _unsubCart = null; }

    if (_cartItems.length) {
      _writeBadgeMirror(_cartItems.map(_serializeForStorage));
      console.log("[FirebaseShop] Cart mirrored to localStorage on logout:", _cartItems.length, "item(s).");
    }

    _uid           = null;
    _customerName  = "";
    _customerEmail = "";
    _cartItems     = [];
    _ready         = false;

    _updateBadge();
    _renderCart();
    console.log("[FirebaseShop] Signed out. Firestore cart preserved.");
  }
});

console.log("[FirebaseShop] Module loaded. SDK: 12.11.0 | Queue shim active.");
export default window.FirebaseShop;