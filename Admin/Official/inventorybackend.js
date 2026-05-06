// ============================================================
// Inventory.js — REV Admin · Inventory Feature (FIXED)
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js";

// ── Firebase ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyD0g9EfP0DPIR7skzKOZ0DyWLlUi5f5LlM",
  authDomain:        "rmsautoshop.firebaseapp.com",
  projectId:         "rmsautoshop",
  storageBucket:     "rmsautoshop.firebasestorage.app",
  messagingSenderId: "699636102924",
  appId:             "1:699636102924:web:1c25aba93b61fd86047b29",
};
const app     = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db      = getFirestore(app);
const storage = getStorage(app);

const PRODUCTS_COL = "Products";

// ── State ─────────────────────────────────────────────────
let _products       = [];
let _fetched        = false;
let _editId         = null;
let _deleteId       = null;
let _pendingImgFile = null;

// Expose state to window so inline handlers and event delegation can access it
window._invProducts = _products;
window._invGetProducts = () => _products;

// ── Inject styles ─────────────────────────────────────────
(function injectStyles() {
  if (document.getElementById("inv-backend-styles")) return;
  const s = document.createElement("style");
  s.id = "inv-backend-styles";
  s.textContent = `
    /* ── Override the static inventory page layout ── */
    #page-inventory .page-header { display: none; }
    #page-inventory .summary-grid { display: none; }
    #page-inventory .a-table { display: none; }
    #page-inventory .toast { display: none; }

    /* ── Inventory dynamic content wrapper ── */
    #inv-dynamic-root { width: 100%; }

    .inv-table { width:100%; border-collapse:collapse; font-family:'DM Sans',sans-serif; }
    .inv-table thead tr { background:rgba(0,0,0,.25); }
    .inv-table thead th {
      padding:10px 14px; font-family:'Rajdhani',sans-serif; font-weight:700;
      font-size:9px; letter-spacing:2px; text-transform:uppercase;
      color:#2a2a2a; text-align:left; white-space:nowrap;
    }
    .inv-table tbody tr { border-bottom:1px solid rgba(255,255,255,.04); transition:background .15s; }
    .inv-table tbody tr:hover { background:rgba(166,127,56,.05); }
    .inv-table tbody td { padding:11px 14px; font-size:13px; color:#ccc; vertical-align:middle; }

    .inv-thumb {
      width:40px; height:40px; border-radius:8px; object-fit:cover;
      border:1px solid rgba(255,255,255,.08); background:#1a1a1a;
    }
    .inv-thumb-placeholder {
      width:40px; height:40px; border-radius:8px;
      background:rgba(166,127,56,.08); border:1px solid rgba(166,127,56,.15);
      display:flex; align-items:center; justify-content:center; font-size:18px;
    }

    .inv-stock { display:inline-flex; align-items:center; gap:5px; font-family:'Rajdhani',sans-serif; font-weight:700; font-size:13px; }
    .inv-stock.ok  { color:#34d399; }
    .inv-stock.low { color:#fbbf24; }
    .inv-stock.out { color:#f87171; }

    .inv-status-pill {
      display:inline-flex; align-items:center; gap:5px; padding:3px 10px;
      border-radius:99px; font-family:'Rajdhani',sans-serif; font-weight:700;
      font-size:11px; letter-spacing:.8px; text-transform:uppercase;
    }
    .inv-status-pill::before { content:''; width:6px; height:6px; border-radius:50%; background:currentColor; flex-shrink:0; }
    .inv-status-pill.active   { color:#34d399; background:rgba(52,211,153,.1);  border:1px solid rgba(52,211,153,.25); }
    .inv-status-pill.inactive { color:#f87171; background:rgba(248,113,113,.08); border:1px solid rgba(248,113,113,.2); }
    .inv-status-pill.sold-out { color:#fbbf24; background:rgba(251,191,36,.08); border:1px solid rgba(251,191,36,.2); }

    .inv-sku {
      font-family:'Rajdhani',sans-serif; font-weight:700; font-size:11px; letter-spacing:1px;
      color:#A67F38; background:rgba(166,127,56,.08); border:1px solid rgba(166,127,56,.18);
      padding:2px 8px; border-radius:4px;
    }

    .inv-act-btn {
      padding:5px 11px; border-radius:6px; cursor:pointer; font-family:'Rajdhani',sans-serif;
      font-weight:700; font-size:11px; letter-spacing:.5px;
      display:inline-flex; align-items:center; gap:5px;
      transition:background .15s, opacity .15s; border:none;
    }
    .inv-act-btn:hover { opacity:.8; }
    .inv-act-btn.edit   { background:rgba(96,165,250,.12); border:1px solid rgba(96,165,250,.25); color:#60a5fa; }
    .inv-act-btn.delete { background:rgba(248,113,113,.1); border:1px solid rgba(248,113,113,.22); color:#f87171; }

    .inv-qty-wrap { display:inline-flex; align-items:center; gap:6px; }
    .inv-qty-btn {
      width:26px; height:26px; border-radius:6px; border:1px solid rgba(166,127,56,.25);
      background:rgba(166,127,56,.08); color:#D9B573; font-size:14px; cursor:pointer;
      display:flex; align-items:center; justify-content:center; font-family:monospace;
      transition:background .15s; flex-shrink:0;
    }
    .inv-qty-btn:hover { background:rgba(166,127,56,.2); }
    .inv-qty-display { font-family:'Rajdhani',sans-serif; font-weight:800; font-size:14px; min-width:30px; text-align:center; color:#e0e0e0; }

    /* ── Modals ── */
    .inv-modal-overlay {
      display:none; position:fixed; inset:0; z-index:1000;
      background:rgba(0,0,0,.78); backdrop-filter:blur(4px);
      align-items:center; justify-content:center;
    }
    .inv-modal-overlay.open { display:flex; }
    .inv-modal-box {
      width:min(520px,95vw); background:#111; border:1px solid rgba(166,127,56,.22);
      border-radius:14px; overflow:hidden; box-shadow:0 40px 100px rgba(0,0,0,.85);
      animation:invSlideUp .28s cubic-bezier(.22,1,.36,1) both;
      max-height:92vh; display:flex; flex-direction:column;
    }
    .inv-modal-box.sm { width:min(380px,95vw); padding:28px 24px; text-align:center; }
    @keyframes invSlideUp { from { opacity:0; transform:translateY(20px); } }

    .inv-modal-header {
      background:linear-gradient(135deg,#A67F38,#8B6510); padding:16px 20px;
      display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
    }
    .inv-modal-title { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:22px; color:rgba(0,0,0,.7); letter-spacing:1px; }
    .inv-modal-close {
      background:rgba(0,0,0,.2); border:none; color:rgba(0,0,0,.5); width:28px; height:28px;
      border-radius:50%; cursor:pointer; font-size:15px; display:flex; align-items:center; justify-content:center; transition:background .15s;
    }
    .inv-modal-close:hover { background:rgba(0,0,0,.35); }
    .inv-modal-body { padding:20px; overflow-y:auto; flex:1; }
    .inv-modal-footer { padding:14px 20px; border-top:1px solid rgba(255,255,255,.06); flex-shrink:0; }

    .inv-form-group { margin-bottom:13px; }
    .inv-form-label { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:#888; margin-bottom:5px; display:block; }
    .inv-form-input {
      width:100%; padding:10px 13px; background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.1); border-radius:8px; color:#e0e0e0;
      font-family:'Rajdhani',sans-serif; font-size:14px; outline:none;
      transition:border-color .2s, background .2s; box-sizing:border-box;
    }
    .inv-form-input:focus { border-color:rgba(166,127,56,.6); background:rgba(166,127,56,.05); }
    .inv-form-input::placeholder { color:#444; }
    .inv-form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

    .inv-img-zone {
      border:2px dashed rgba(166,127,56,.25); border-radius:10px; padding:18px;
      text-align:center; cursor:pointer; transition:border-color .2s, background .2s; position:relative;
    }
    .inv-img-zone:hover { border-color:rgba(166,127,56,.5); background:rgba(166,127,56,.04); }
    .inv-img-zone input[type=file] { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }
    .inv-img-zone img { max-height:110px; border-radius:8px; object-fit:cover; max-width:100%; }
    .inv-img-zone-label { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:12px; color:#555; display:block; margin-top:8px; }

    .inv-btn-row { display:flex; gap:9px; }
    .inv-btn {
      flex:1; padding:11px 16px; border-radius:8px; border:none; cursor:pointer;
      font-family:'Rajdhani',sans-serif; font-weight:700; font-size:13px; letter-spacing:.5px;
      display:flex; align-items:center; justify-content:center; gap:6px;
      transition:opacity .15s, transform .1s;
    }
    .inv-btn:hover  { opacity:.88; }
    .inv-btn:active { transform:scale(.98); }
    .inv-btn.primary   { background:linear-gradient(135deg,#A67F38,#D9B573); color:#080808; }
    .inv-btn.secondary { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); color:#aaa; }
    .inv-btn.danger    { background:rgba(248,113,113,.12); border:1px solid rgba(248,113,113,.28); color:#f87171; }

    .inv-err { padding:9px 13px; border-radius:8px; margin-top:10px; background:rgba(248,113,113,.08); border:1px solid rgba(248,113,113,.2); color:#f87171; font-size:12px; font-family:'Rajdhani',sans-serif; display:none; }

    .inv-empty { text-align:center; padding:50px 20px; color:#444; font-family:'Rajdhani',sans-serif; font-size:14px; }
    .inv-empty i { display:block; font-size:30px; margin-bottom:12px; color:#2a2a2a; }

    #invToast {
      position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
      background:#1a1a1a; border:1px solid rgba(166,127,56,.35); color:#D9B573;
      font-family:'Rajdhani',sans-serif; font-weight:700; font-size:13px;
      padding:10px 20px; border-radius:9px; box-shadow:0 12px 40px rgba(0,0,0,.6);
      z-index:9999; opacity:0; pointer-events:none; transition:opacity .3s;
      display:flex; align-items:center; gap:8px;
    }
    #invToast.show { opacity:1; }

    /* ── Custom Select Dropdown ── */
    .inv-custom-select { position:relative; }
    .inv-custom-select-val {
      width:100%; padding:10px 13px; background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.1); border-radius:8px; color:#e0e0e0;
      font-family:'Rajdhani',sans-serif; font-size:14px; cursor:pointer;
      display:flex; align-items:center; justify-content:space-between;
      transition:border-color .2s, background .2s; box-sizing:border-box; user-select:none;
    }
    .inv-custom-select-val:hover,
    .inv-custom-select.open .inv-custom-select-val {
      border-color:rgba(166,127,56,.6); background:rgba(166,127,56,.05);
    }
    .inv-custom-select-val i { transition:transform .2s; }
    .inv-custom-select.open .inv-custom-select-val i { transform:rotate(180deg); }
    .inv-custom-select-opts {
      display:none; position:absolute; top:calc(100% + 4px); left:0; right:0;
      background:#1c1c1c; border:1px solid rgba(166,127,56,.28); border-radius:8px;
      overflow:hidden; z-index:99999; box-shadow:0 16px 48px rgba(0,0,0,.8);
    }
    .inv-custom-select.open .inv-custom-select-opts { display:block; }
    .inv-custom-opt {
      padding:10px 14px; font-family:'Rajdhani',sans-serif; font-size:14px;
      color:#ccc; cursor:pointer; transition:background .15s;
    }
    .inv-custom-opt:hover { background:rgba(166,127,56,.14); color:#D9B573; }
    .inv-custom-opt.selected { color:#D9B573; background:rgba(166,127,56,.1); font-weight:700; }
  `;
  document.head.appendChild(s);
})();

// ── Helpers ───────────────────────────────────────────────
function statusPill(status) {
  const s = (status || "active").toLowerCase().replace(" ", "-");
  const labels = { active:"Active", inactive:"Inactive", "sold-out":"Sold Out" };
  return `<span class="inv-status-pill ${s}">${labels[s] || s}</span>`;
}

function stockClass(qty) {
  if (qty <= 0) return "out";
  if (qty <= 5) return "low";
  return "ok";
}

function genSku() {
  return "PRD-" + Math.floor(10000 + Math.random() * 90000);
}

function _toast(msg, icon = "fa-check-circle") {
  if (typeof showToast === "function") { showToast(msg); return; }
  let t = document.getElementById("invToast");
  if (!t) { t = document.createElement("div"); t.id = "invToast"; document.body.appendChild(t); }
  t.innerHTML = `<i class="fas ${icon}"></i>${msg}`;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 3000);
}

// ── Build the inventory page layout (replaces static HTML content) ────
function _buildInventoryPage() {
  const pg = document.getElementById("page-inventory");
  if (!pg) return;

  // Check if we already built the dynamic root
  if (document.getElementById("inv-dynamic-root")) return;

  // Insert our dynamic layout at the top of the page div
  const root = document.createElement("div");
  root.id = "inv-dynamic-root";
  root.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <div>
        <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#F2DB94;font-family:'Rajdhani',sans-serif;font-weight:700;margin-bottom:3px;">Manage</div>
        <h2 style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;color:#F2DB94;line-height:1;">Inventory</h2>
      </div>
      <button onclick="invOpenAdd()" class="btn-g" style="font-size:13px;padding:9px 16px;">
        <i class="fas fa-plus" style="margin-right:5px;"></i>Add Product
      </button>
    </div>

    <!-- Summary cards -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
      <div style="background:#111;border:1px solid rgba(166,127,56,.15);border-radius:12px;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-family:'Rajdhani',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#555;margin-bottom:4px;">Total Products</div>
          <div id="inv-sum-total" style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;color:#F2DB94;line-height:1;">0</div>
          <div style="font-size:11px;color:#444;margin-top:4px;">In catalog</div>
        </div>
        <div style="font-size:28px;opacity:.35;">📦</div>
      </div>
      <div style="background:#111;border:1px solid rgba(166,127,56,.15);border-radius:12px;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-family:'Rajdhani',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#555;margin-bottom:4px;">Low / Out of Stock</div>
          <div id="inv-sum-low" style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;color:#f87171;line-height:1;">0</div>
          <div style="font-size:11px;color:#444;margin-top:4px;">≤ 5 units remaining</div>
        </div>
        <div style="font-size:28px;opacity:.35;">⚠️</div>
      </div>
      <div style="background:#111;border:1px solid rgba(166,127,56,.15);border-radius:12px;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-family:'Rajdhani',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#555;margin-bottom:4px;">Total Units</div>
          <div id="inv-sum-units" style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;color:#F2DB94;line-height:1;">0</div>
          <div style="font-size:11px;color:#444;margin-top:4px;">Across all products</div>
        </div>
        <div style="font-size:28px;opacity:.35;">🗄️</div>
      </div>
    </div>

    <!-- Table card -->
    <div style="background:#111;border:1px solid rgba(166,127,56,.1);border-radius:12px;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.05);">
        <div style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:7px 12px;flex:1;max-width:280px;">
          <i class="fas fa-search" style="color:#444;font-size:11px;flex-shrink:0;"></i>
          <input type="text" placeholder="Search products…" oninput="invSearch(this.value)"
            style="background:transparent;border:none;outline:none;color:#ccc;font-family:'DM Sans',sans-serif;font-size:13px;width:100%;">
        </div>
        <button onclick="fetchProducts()" style="padding:7px 12px;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#888;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:11px;cursor:pointer;">
          <i class="fas fa-sync-alt" style="margin-right:4px;"></i>Refresh
        </button>
      </div>
      <div style="overflow-x:auto;">
        <table class="inv-table">
          <thead>
            <tr>
              <th>Image</th><th>Product</th><th>SKU</th><th>Stock</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody id="inv-tbody-new"></tbody>
        </table>
      </div>
    </div>
  `;

  // Prepend before all existing children
  pg.insertBefore(root, pg.firstChild);
}

// ── Fetch products from Firestore ─────────────────────────
async function fetchProducts() {
  _showLoading();
  try {
    let snap;
    try {
      snap = await getDocs(query(collection(db, PRODUCTS_COL), orderBy("createdAt", "desc")));
    } catch {
      snap = await getDocs(collection(db, PRODUCTS_COL));
    }
    _products = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    _fetched  = true;
    _renderSummary();
    _renderTable(_filtered());
  } catch (err) {
    console.error("InventoryBackend:", err);
    _showError(err.message);
  }
}
window.fetchProducts = fetchProducts;

// ── Summary ───────────────────────────────────────────────
function _renderSummary() {
  const total = _products.length;
  const low   = _products.filter(p => (p.stock ?? 0) <= 5 && (p.stock ?? 0) > 0).length;
  const outOf = _products.filter(p => (p.stock ?? 0) <= 0).length;
  const units = _products.reduce((a, p) => a + (p.stock ?? 0), 0);

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl("inv-sum-total", total);
  setEl("inv-sum-low",   low + outOf);
  setEl("inv-sum-units", units);
}

// ── Table ─────────────────────────────────────────────────
let _searchQuery = "";

function _filtered() {
  const q = _searchQuery.toLowerCase();
  if (!q) return _products;
  return _products.filter(p =>
    (p.name     || "").toLowerCase().includes(q) ||
    (p.sku      || "").toLowerCase().includes(q) ||
    (p.category || "").toLowerCase().includes(q)
  );
}

function _getTbody() {
  return document.getElementById("inv-tbody-new");
}

function _renderTable(list) {
  const tb = _getTbody();
  if (!tb) return;

  if (!list.length) {
    tb.innerHTML = `<tr><td colspan="6">
      <div class="inv-empty">
        <i class="fas fa-box-open"></i>
        ${_searchQuery ? "No products match your search." : 'No products yet. Click <strong style="color:#D9B573;">Add Product</strong> to get started.'}
      </div>
    </td></tr>`;
    return;
  }

  tb.innerHTML = list.map(p => {
    const qty   = p.stock ?? 0;
    const sc    = stockClass(qty);
    const thumb = p.imageUrl
      ? `<img class="inv-thumb" src="${p.imageUrl}" alt="${p.name || ""}">`
      : `<div class="inv-thumb-placeholder">📦</div>`;

    return `
    <tr>
      <td>${thumb}</td>
      <td>
        <div style="font-size:14px;font-weight:600;color:#e8e8e8;">${p.name || "—"}</div>
        <div style="font-size:11px;color:#555;margin-top:2px;">${p.category || ""}</div>
      </td>
      <td><span class="inv-sku">${p.sku || "—"}</span></td>
      <td>
        <div class="inv-qty-wrap">
          <button class="inv-qty-btn" onclick="invAdjust('${p.id}', -1)" title="Decrease stock">−</button>
          <span class="inv-qty-display inv-stock ${sc}">${qty}</span>
          <button class="inv-qty-btn" onclick="invAdjust('${p.id}', +1)" title="Increase stock">+</button>
        </div>
      </td>
      <td>${statusPill(p.status)}</td>
      <td>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button class="inv-act-btn edit"   onclick="invOpenEdit('${p.id}')"><i class="fas fa-pen"></i>Edit</button>
          <button class="inv-act-btn delete" onclick="invConfirmDelete('${p.id}')"><i class="fas fa-trash"></i>Delete</button>
        </div>
      </td>
    </tr>`;
  }).join("");
}

function _showLoading() {
  const tb = _getTbody();
  if (tb) tb.innerHTML = `<tr><td colspan="6">
    <div class="inv-empty"><i class="fas fa-circle-notch fa-spin" style="color:#A67F38;"></i>Loading products…</div>
  </td></tr>`;
}

function _showError(msg) {
  const tb = _getTbody();
  if (tb) tb.innerHTML = `<tr><td colspan="6">
    <div class="inv-empty" style="color:#f87171;"><i class="fas fa-exclamation-triangle" style="color:#f87171;"></i>${msg}</div>
  </td></tr>`;
}

// ── Quick adjust ──────────────────────────────────────────
window.invAdjust = async function(id, delta) {
  const idx = _products.findIndex(p => p.id === id);
  if (idx === -1) return;
  const oldQty = _products[idx].stock ?? 0;
  const newQty = Math.max(0, oldQty + delta);
  if (newQty === oldQty) return;

  _products[idx].stock = newQty;
  _renderTable(_filtered());
  _renderSummary();

  try {
    await updateDoc(doc(db, PRODUCTS_COL, id), { stock: newQty, updatedAt: new Date() });
    _toast(`Stock updated → ${newQty}`);
  } catch (err) {
    _products[idx].stock = oldQty;
    _renderTable(_filtered());
    _renderSummary();
    _toast("Error: " + err.message, "fa-exclamation-circle");
  }
};

window.invSearch = function(val) {
  _searchQuery = val || "";
  _renderTable(_filtered());
};

// ── Image preview (shared) ────────────────────────────────
window.invPreviewImg = function(mode, input) {
  _pendingImgFile = input.files[0] || null;
  const cap  = mode === "edit" ? "Edit" : "Add";
  const prev = document.getElementById(`inv${cap}ImgPreview`);
  const lbl  = document.getElementById(`inv${cap}ImgLabel`);
  if (!_pendingImgFile || !prev) return;
  const reader = new FileReader();
  reader.onload = e => {
    prev.innerHTML = `<img src="${e.target.result}" style="max-height:110px;border-radius:8px;object-fit:cover;max-width:100%;">`;
    if (lbl) lbl.textContent = "Click to change image";
  };
  reader.readAsDataURL(_pendingImgFile);
};

// ── ADD MODAL ─────────────────────────────────────────────
function _ensureAddModal() {
  if (document.getElementById("invAddModal")) return;
  document.body.insertAdjacentHTML("beforeend", `
  <div id="invAddModal" class="inv-modal-overlay" onclick="if(event.target===this)invCloseAdd()">
    <div class="inv-modal-box">
      <div class="inv-modal-header">
        <div class="inv-modal-title"><i class="fas fa-plus" style="margin-right:8px;"></i>Add Product</div>
        <button class="inv-modal-close" onclick="invCloseAdd()">✕</button>
      </div>
      <div class="inv-modal-body">
        <div class="inv-form-group">
          <label class="inv-form-label">Product Image <span style="color:#444;font-weight:400;">(optional)</span></label>
          <div class="inv-img-zone" onclick="document.getElementById('invAddImgInput').click()">
            <input type="file" id="invAddImgInput" accept="image/*" onchange="invPreviewImg('add', this)">
            <div id="invAddImgPreview"><i class="fas fa-cloud-upload-alt" style="font-size:28px;color:#A67F38;display:block;margin-bottom:6px;"></i></div>
            <span class="inv-img-zone-label" id="invAddImgLabel">Click to upload image</span>
          </div>
        </div>
        <div class="inv-form-row">
          <div class="inv-form-group">
            <label class="inv-form-label">Product Name *</label>
            <input class="inv-form-input" id="invAddName" placeholder="e.g. Castrol 5W-30">
          </div>
          <div class="inv-form-group">
            <label class="inv-form-label">Category</label>
            <div class="inv-custom-select" id="invAddCategoryWrap">
              <div class="inv-custom-select-val" id="invAddCategory" data-value="Fluid" onclick="invToggleDropdown('invAddCategoryWrap')">
                <span>Fluid</span><i class="fas fa-chevron-down" style="font-size:10px;"></i>
              </div>
              <div class="inv-custom-select-opts">
                <div class="inv-custom-opt selected" onclick="invSelectOpt('invAddCategoryWrap','Fluid','Fluid')">Fluid</div>
                <div class="inv-custom-opt" onclick="invSelectOpt('invAddCategoryWrap','Part','Part')">Part</div>
                <div class="inv-custom-opt" onclick="invSelectOpt('invAddCategoryWrap','Accessory','Accessory')">Accessory</div>
                <div class="inv-custom-opt" onclick="invSelectOpt('invAddCategoryWrap','Engine','Engine')">Engine</div>
                <div class="inv-custom-opt" onclick="invSelectOpt('invAddCategoryWrap','Tool','Tool')">Tool</div>
                <div class="inv-custom-opt" onclick="invSelectOpt('invAddCategoryWrap','Other','Other')">Other</div>
              </div>
            </div>
          </div>
        </div>
        <div class="inv-form-row">
          <div class="inv-form-group">
            <label class="inv-form-label">SKU (auto-generated)</label>
            <input class="inv-form-input" id="invAddSku" readonly style="opacity:.5;cursor:not-allowed;">
          </div>
          <div class="inv-form-group">
            <label class="inv-form-label">Price (₱)</label>
            <input class="inv-form-input" id="invAddPrice" type="number" min="0" step="0.01" placeholder="0.00">
          </div>
        </div>
        <div class="inv-form-row">
          <div class="inv-form-group">
            <label class="inv-form-label">Initial Stock</label>
            <input class="inv-form-input" id="invAddStock" type="number" min="0" placeholder="0">
          </div>
          <div class="inv-form-group">
            <label class="inv-form-label">Status</label>
            <div class="inv-custom-select" id="invAddStatusWrap">
              <div class="inv-custom-select-val" id="invAddStatus" data-value="active" onclick="invToggleDropdown('invAddStatusWrap')">
                <span>Active</span><i class="fas fa-chevron-down" style="font-size:10px;"></i>
              </div>
              <div class="inv-custom-select-opts">
                <div class="inv-custom-opt selected" onclick="invSelectOpt('invAddStatusWrap','active','Active')">Active</div>
                <div class="inv-custom-opt" onclick="invSelectOpt('invAddStatusWrap','inactive','Inactive')">Inactive</div>
                <div class="inv-custom-opt" onclick="invSelectOpt('invAddStatusWrap','sold-out','Sold Out')">Sold Out</div>
              </div>
            </div>
          </div>
        </div>
        <div class="inv-form-group">
          <label class="inv-form-label">Description (optional)</label>
          <textarea class="inv-form-input" id="invAddDesc" rows="3" placeholder="Brief product description…" style="resize:vertical;"></textarea>
        </div>
        <div id="invAddErr" class="inv-err"></div>
      </div>
      <div class="inv-modal-footer">
        <div class="inv-btn-row">
          <button class="inv-btn primary" id="invAddSaveBtn" onclick="invSaveAdd()"><i class="fas fa-plus"></i>Add Product</button>
          <button class="inv-btn secondary" onclick="invCloseAdd()"><i class="fas fa-times"></i>Cancel</button>
        </div>
      </div>
    </div>
  </div>`);
}

window.invOpenAdd = function() {
  _pendingImgFile = null;
  _ensureAddModal();

  ["invAddName","invAddPrice","invAddStock","invAddDesc"].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = "";
  });
  const skuEl = document.getElementById("invAddSku");
  if (skuEl) skuEl.value = genSku();
  invSelectOpt("invAddCategoryWrap", "Fluid", "Fluid");
  invSelectOpt("invAddStatusWrap", "active", "Active");
  const prev  = document.getElementById("invAddImgPreview");
  const label = document.getElementById("invAddImgLabel");
  if (prev)  prev.innerHTML = `<i class="fas fa-cloud-upload-alt" style="font-size:28px;color:#A67F38;display:block;margin-bottom:6px;"></i>`;
  if (label) label.textContent = "Click to upload image";
  const errEl = document.getElementById("invAddErr");
  if (errEl) errEl.style.display = "none";

  document.getElementById("invAddModal").classList.add("open");
};

window.invCloseAdd = function() {
  document.getElementById("invAddModal")?.classList.remove("open");
  _pendingImgFile = null;
};

window.invSaveAdd = async function() {
  const errEl = document.getElementById("invAddErr");
  errEl.style.display = "none";

  const name     = document.getElementById("invAddName").value.trim();
  const sku      = document.getElementById("invAddSku").value.trim() || genSku();
  const price    = parseFloat(document.getElementById("invAddPrice").value) || 0;
  const stock    = parseInt(document.getElementById("invAddStock").value, 10) || 0;
  const status   = document.getElementById("invAddStatus").dataset.value;
  const category = document.getElementById("invAddCategory").dataset.value;
  const desc     = document.getElementById("invAddDesc").value.trim();

  if (!name) {
    errEl.textContent = "Product name is required.";
    errEl.style.display = "block";
    return;
  }

  const saveBtn = document.getElementById("invAddSaveBtn");
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "Saving…"; }

  try {
    let imageUrl = "";
    if (_pendingImgFile) {
      const tmpRef = storageRef(storage, `inventory/tmp_${Date.now()}`);
      const snap   = await uploadBytes(tmpRef, _pendingImgFile);
      imageUrl     = await getDownloadURL(snap.ref);
    }

    const data = {
      name, sku, price, stock, status, category,
      description: desc, imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, PRODUCTS_COL), data);
    _products.unshift({ id: docRef.id, ...data, createdAt: new Date(), updatedAt: new Date() });
    _renderSummary();
    _renderTable(_filtered());
    invCloseAdd();
    _toast(`"${name}" added to inventory!`);
  } catch (err) {
    errEl.textContent = "Failed to add: " + err.message;
    errEl.style.display = "block";
  } finally {
    if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = `<i class="fas fa-plus"></i>Add Product`; }
  }
};

// ── EDIT MODAL ────────────────────────────────────────────
function _ensureEditModal() {
  if (document.getElementById("invEditModal")) return;
  document.body.insertAdjacentHTML("beforeend", `
  <div id="invEditModal" class="inv-modal-overlay" onclick="if(event.target===this)invCloseEdit()">
    <div class="inv-modal-box">
      <div class="inv-modal-header">
        <div class="inv-modal-title"><i class="fas fa-pen" style="margin-right:8px;"></i>Edit Product</div>
        <button class="inv-modal-close" onclick="invCloseEdit()">✕</button>
      </div>
      <div class="inv-modal-body">
        <div class="inv-form-group">
          <label class="inv-form-label">Product Image</label>
          <div class="inv-img-zone" onclick="document.getElementById('invEditImgInput').click()">
            <input type="file" id="invEditImgInput" accept="image/*" onchange="invPreviewImg('edit', this)">
            <div id="invEditImgPreview"></div>
            <span class="inv-img-zone-label" id="invEditImgLabel">Click to upload image</span>
          </div>
        </div>
        <div class="inv-form-row">
          <div class="inv-form-group">
            <label class="inv-form-label">Product Name *</label>
            <input class="inv-form-input" id="invEditName" placeholder="e.g. Castrol 5W-30">
          </div>
          <div class="inv-form-group">
            <label class="inv-form-label">Category</label>
            <div class="inv-custom-select" id="invEditCategoryWrap">
              <div class="inv-custom-select-val" id="invEditCategory" data-value="Fluid" onclick="invToggleDropdown('invEditCategoryWrap')">
                <span>Fluid</span><i class="fas fa-chevron-down" style="font-size:10px;"></i>
              </div>
              <div class="inv-custom-select-opts">
                <div class="inv-custom-opt" onclick="invSelectOpt('invEditCategoryWrap','Fluid','Fluid')">Fluid</div>
                <div class="inv-custom-opt" onclick="invSelectOpt('invEditCategoryWrap','Part','Part')">Part</div>
                <div class="inv-custom-opt" onclick="invSelectOpt('invEditCategoryWrap','Accessory','Accessory')">Accessory</div>
                <div class="inv-custom-opt" onclick="invSelectOpt('invEditCategoryWrap','Engine','Engine')">Engine</div>
                <div class="inv-custom-opt" onclick="invSelectOpt('invEditCategoryWrap','Tool','Tool')">Tool</div>
                <div class="inv-custom-opt" onclick="invSelectOpt('invEditCategoryWrap','Other','Other')">Other</div>
              </div>
            </div>
          </div>
        </div>
        <div class="inv-form-row">
          <div class="inv-form-group">
            <label class="inv-form-label">SKU</label>
            <input class="inv-form-input" id="invEditSku" readonly style="opacity:.5;cursor:not-allowed;">
          </div>
          <div class="inv-form-group">
            <label class="inv-form-label">Price (₱)</label>
            <input class="inv-form-input" id="invEditPrice" type="number" min="0" step="0.01" placeholder="0.00">
          </div>
        </div>
        <div class="inv-form-row">
          <div class="inv-form-group">
            <label class="inv-form-label">Stock Quantity</label>
            <input class="inv-form-input" id="invEditStock" type="number" min="0" placeholder="0">
          </div>
          <div class="inv-form-group">
            <label class="inv-form-label">Status</label>
            <div class="inv-custom-select" id="invEditStatusWrap">
              <div class="inv-custom-select-val" id="invEditStatus" data-value="active" onclick="invToggleDropdown('invEditStatusWrap')">
                <span>Active</span><i class="fas fa-chevron-down" style="font-size:10px;"></i>
              </div>
              <div class="inv-custom-select-opts">
                <div class="inv-custom-opt selected" onclick="invSelectOpt('invEditStatusWrap','active','Active')">Active</div>
                <div class="inv-custom-opt" onclick="invSelectOpt('invEditStatusWrap','inactive','Inactive')">Inactive</div>
                <div class="inv-custom-opt" onclick="invSelectOpt('invEditStatusWrap','sold-out','Sold Out')">Sold Out</div>
              </div>
            </div>
          </div>
        </div>
        <div class="inv-form-group">
          <label class="inv-form-label">Description (optional)</label>
          <textarea class="inv-form-input" id="invEditDesc" rows="3" placeholder="Brief product description…" style="resize:vertical;"></textarea>
        </div>
        <input type="hidden" id="invEditId">
        <input type="hidden" id="invEditCurrentImg">
        <div id="invEditErr" class="inv-err"></div>
      </div>
      <div class="inv-modal-footer">
        <div class="inv-btn-row">
          <button class="inv-btn primary" id="invEditSaveBtn" onclick="invSaveEdit()"><i class="fas fa-save"></i>Save Changes</button>
          <button class="inv-btn secondary" onclick="invCloseEdit()"><i class="fas fa-times"></i>Cancel</button>
        </div>
      </div>
    </div>
  </div>`);
}

window.invOpenEdit = function(id) {
  const p = _products.find(x => x.id === id);
  if (!p) return;
  _editId         = id;
  _pendingImgFile = null;

  _ensureEditModal();

  document.getElementById("invEditId").value          = id;
  document.getElementById("invEditName").value         = p.name        || "";
  document.getElementById("invEditSku").value          = p.sku         || "";
  document.getElementById("invEditPrice").value        = p.price       ?? "";
  document.getElementById("invEditStock").value        = p.stock       ?? 0;
  // custom dropdowns set after modal is in DOM
  const _editStatus = p.status || "active";
  const _editCat = p.category || "Fluid";
  const _statusLabels = { active:"Active", inactive:"Inactive", "sold-out":"Sold Out" };
  document.getElementById("invEditDesc").value         = p.description || "";
  document.getElementById("invEditCurrentImg").value   = p.imageUrl    || "";
  document.getElementById("invEditErr").style.display  = "none";

  const prev  = document.getElementById("invEditImgPreview");
  const label = document.getElementById("invEditImgLabel");
  if (p.imageUrl) {
    prev.innerHTML    = `<img src="${p.imageUrl}" style="max-height:110px;border-radius:8px;object-fit:cover;max-width:100%;">`;
    label.textContent = "Click to change image";
  } else {
    prev.innerHTML    = `<i class="fas fa-cloud-upload-alt" style="font-size:28px;color:#A67F38;display:block;margin-bottom:6px;"></i>`;
    label.textContent = "Click to upload image";
  }

  document.getElementById("invEditModal").classList.add("open");
  invSelectOpt("invEditStatusWrap", _editStatus, _statusLabels[_editStatus] || "Active");
  invSelectOpt("invEditCategoryWrap", _editCat, _editCat);
};

window.invCloseEdit = function() {
  document.getElementById("invEditModal")?.classList.remove("open");
  _editId         = null;
  _pendingImgFile = null;
};

window.invSaveEdit = async function() {
  const errEl = document.getElementById("invEditErr");
  errEl.style.display = "none";

  const id       = document.getElementById("invEditId").value;
  const name     = document.getElementById("invEditName").value.trim();
  const price    = parseFloat(document.getElementById("invEditPrice").value) || 0;
  const stock    = parseInt(document.getElementById("invEditStock").value, 10) || 0;
  const status   = document.getElementById("invEditStatus").dataset.value;
  const category = document.getElementById("invEditCategory").dataset.value;
  const desc     = document.getElementById("invEditDesc").value.trim();
  let   imageUrl = document.getElementById("invEditCurrentImg").value;

  if (!name) {
    errEl.textContent = "Product name is required.";
    errEl.style.display = "block";
    return;
  }

  const saveBtn = document.getElementById("invEditSaveBtn");
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "Saving…"; }

  try {
    if (_pendingImgFile) {
      const imgRef = storageRef(storage, `inventory/${id}_${Date.now()}`);
      const snap   = await uploadBytes(imgRef, _pendingImgFile);
      imageUrl     = await getDownloadURL(snap.ref);
    }

    const updates = { name, price, stock, status, category, imageUrl, description: desc, updatedAt: new Date() };
    await updateDoc(doc(db, PRODUCTS_COL, id), updates);

    const idx = _products.findIndex(p => p.id === id);
    if (idx !== -1) _products[idx] = { ..._products[idx], ...updates };

    _renderSummary();
    _renderTable(_filtered());
    invCloseEdit();
    _toast("Product updated successfully!");
  } catch (err) {
    errEl.textContent = "Save failed: " + err.message;
    errEl.style.display = "block";
  } finally {
    if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = `<i class="fas fa-save"></i>Save Changes`; }
  }
};


// ── Custom dropdown helpers ───────────────────────────────
window.invToggleDropdown = function(wrapId) {
  const wrap = document.getElementById(wrapId);
  const isOpen = wrap.classList.contains("open");
  document.querySelectorAll(".inv-custom-select.open").forEach(el => el.classList.remove("open"));
  if (!isOpen) wrap.classList.add("open");
};

window.invSelectOpt = function(wrapId, value, label) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  const val = wrap.querySelector(".inv-custom-select-val");
  if (!val) return;
  val.dataset.value = value;
  val.querySelector("span").textContent = label;
  wrap.classList.remove("open");
  wrap.querySelectorAll(".inv-custom-opt").forEach(o =>
    o.classList.toggle("selected", o.textContent.trim() === label)
  );
};

// Close dropdowns on outside click
document.addEventListener("click", e => {
  if (!e.target.closest(".inv-custom-select"))
    document.querySelectorAll(".inv-custom-select.open").forEach(el => el.classList.remove("open"));
});

// ── DELETE MODAL ──────────────────────────────────────────
function _ensureDelModal() {
  if (document.getElementById("invDelModal")) return;
  document.body.insertAdjacentHTML("beforeend", `
  <div id="invDelModal" class="inv-modal-overlay" onclick="if(event.target===this)invCloseDelete()">
    <div class="inv-modal-box sm">
      <div style="width:52px;height:52px;border-radius:50%;background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.25);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
        <i class="fas fa-trash" style="color:#f87171;font-size:18px;"></i>
      </div>
      <h3 style="font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:900;color:#f87171;margin-bottom:6px;">Delete Product?</h3>
      <p id="invDelMsg" style="font-size:13px;color:#555;margin-bottom:20px;line-height:1.5;"></p>
      <div class="inv-btn-row">
        <button class="inv-btn danger"    onclick="invDoDelete()"><i class="fas fa-trash"></i>Yes, Delete</button>
        <button class="inv-btn secondary" onclick="invCloseDelete()"><i class="fas fa-times"></i>Cancel</button>
      </div>
    </div>
  </div>`);
}

window.invConfirmDelete = function(id) {
  const p = _products.find(x => x.id === id);
  if (!p) return;
  _deleteId = id;
  _ensureDelModal();
  document.getElementById("invDelMsg").textContent =
    `You are about to permanently delete "${p.name || "this product"}". This cannot be undone.`;
  document.getElementById("invDelModal").classList.add("open");
};

window.invCloseDelete = function() {
  document.getElementById("invDelModal")?.classList.remove("open");
  _deleteId = null;
};

window.invDoDelete = async function() {
  if (!_deleteId) return;
  const id = _deleteId;
  const p  = _products.find(x => x.id === id);
  try {
    await deleteDoc(doc(db, PRODUCTS_COL, id));
    _products = _products.filter(x => x.id !== id);
    _renderSummary();
    _renderTable(_filtered());
    invCloseDelete();
    _toast(`"${p?.name || "Product"}" deleted.`, "fa-trash");
  } catch (err) {
    _toast("Delete failed: " + err.message, "fa-exclamation-circle");
  }
};

// ── Hook into navigation ──────────────────────────────────
function _hookNav() {
  const origNav = window.nav;
  if (typeof origNav === "function" && !origNav._invPatched) {
    window.nav = function(page, ...args) {
      if (page === "inventory") { _activateInventory(); return; }
      return origNav(page, ...args);
    };
    window.nav._invPatched = true;
  }

  const origRender = window.renderPage;
  if (typeof origRender === "function" && !origRender._invPatched) {
    window.renderPage = function(page, ...args) {
      if (page === "inventory") { _activateInventory(); return; }
      return origRender(page, ...args);
    };
    window.renderPage._invPatched = true;
  }
}

function _activateInventory() {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const pg = document.getElementById("page-inventory");
  if (pg) pg.classList.add("active");

  document.querySelectorAll(".ni").forEach(el => el.classList.remove("active"));
  const ni = document.querySelector('.ni[data-page="inventory"]');
  if (ni) ni.classList.add("active");

  const bc = document.getElementById("bc");
  if (bc) bc.textContent = "Inventory";

  _buildInventoryPage();

  if (!_fetched) fetchProducts();
  else { _renderSummary(); _renderTable(_filtered()); }
}

function _waitAndPatch(attempts = 0) {
  if (typeof window.nav === "function" || typeof window.renderPage === "function") {
    _hookNav();
  } else if (attempts < 40) {
    setTimeout(() => _waitAndPatch(attempts + 1), 100);
  }
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  _waitAndPatch();
  if (document.getElementById("page-inventory")?.classList.contains("active")) {
    _buildInventoryPage();
    fetchProducts();
  }
});