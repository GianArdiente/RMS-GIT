// ============================================================
// CustomersBackend.js — REV Admin · Customers Feature
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getFirestore, collection, collectionGroup, getDocs,
  query, where, orderBy
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// ── Firebase ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyD0g9EfP0DPIR7skzKOZ0DyWLlUi5f5LlM",
  authDomain: "rmsautoshop.firebaseapp.com",
  projectId: "rmsautoshop",
  storageBucket: "rmsautoshop.firebasestorage.app",
  messagingSenderId: "699636102924",
  appId: "1:699636102924:web:1c25aba93b61fd86047b29"
};
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── State ─────────────────────────────────────────────────
let _allCustomers = [];
let _fetched      = false;

// ── Inject Styles ─────────────────────────────────────────
(function injectStyles() {
  if (document.getElementById("cus-styles")) return;
  const s = document.createElement("style");
  s.id = "cus-styles";
  s.textContent = `
    /* ── Customer table row ── */
    .cus-row { transition: background .15s; cursor: default; }
    .cus-row:hover { background: rgba(166,127,56,.06) !important; }

    /* ── Status badges ── */
    .cus-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 11px; border-radius: 99px;
      font-family: 'Rajdhani', sans-serif; font-weight: 700;
      font-size: 11px; letter-spacing: .8px; text-transform: uppercase;
    }
    .cus-badge::before {
      content: ''; width: 6px; height: 6px; border-radius: 50%;
      background: currentColor; flex-shrink: 0;
    }
    .cus-badge.active   { color:#34d399; background:rgba(52,211,153,.12);  border:1px solid rgba(52,211,153,.25);  }
    .cus-badge.inactive { color:#f87171; background:rgba(248,113,113,.12); border:1px solid rgba(248,113,113,.25); }
    .cus-badge.new      { color:#60a5fa; background:rgba(96,165,250,.12);  border:1px solid rgba(96,165,250,.25);  }

    /* ── View button ── */
    .cus-view-btn {
      padding: 5px 14px; border-radius: 6px; cursor: pointer;
      background: rgba(166,127,56,.1); border: 1px solid rgba(166,127,56,.3);
      color: #D9B573; font-family: 'Rajdhani', sans-serif;
      font-weight: 700; font-size: 11px; letter-spacing: .5px;
      display: inline-flex; align-items: center; gap: 5px;
      transition: background .15s;
    }
    .cus-view-btn:hover { background: rgba(166,127,56,.22); }

    /* ── Refresh button ── */
    .cus-refresh-btn {
      padding: 6px 14px; border-radius: 7px; cursor: pointer;
      background: rgba(166,127,56,.08); border: 1px solid rgba(166,127,56,.25);
      color: #A67F38; font-family: 'Rajdhani', sans-serif;
      font-weight: 700; font-size: 12px; letter-spacing: .5px;
      display: inline-flex; align-items: center; gap: 6px;
      transition: background .15s, color .15s;
    }
    .cus-refresh-btn:hover { background: rgba(166,127,56,.18); color: #D9B573; }
    .cus-refresh-btn.spinning i { animation: cusSpin .7s linear infinite; }
    @keyframes cusSpin { to { transform: rotate(360deg); } }

    /* ── Table secondary text ── */
    .cus-sub { font-size: 11px; color: #777; margin-top: 2px; }

    /* ── Empty / loading state ── */
    .cus-empty {
      text-align: center; padding: 48px 20px;
      font-family: 'Rajdhani', sans-serif; color: #555;
      font-size: 13px; letter-spacing: .5px;
    }
    .cus-empty i { font-size: 28px; color: #333; display: block; margin-bottom: 10px; }

    /* ── Customer View Modal ── */
    #cusViewModal {
      display: none; position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,.78); backdrop-filter: blur(5px);
      align-items: center; justify-content: center;
    }
    #cusViewModal.open { display: flex; }
    #cusViewModalBox {
      width: min(640px, 95vw);
      background: #111; border: 1px solid rgba(166,127,56,.22);
      border-radius: 14px; overflow: hidden;
      box-shadow: 0 40px 100px rgba(0,0,0,.85);
      animation: cusSlideUp .3s cubic-bezier(.22,1,.36,1) both;
      max-height: 88vh; display: flex; flex-direction: column;
    }
    @keyframes cusSlideUp {
      from { opacity:0; transform:translateY(22px); }
    }
    .cus-modal-header {
      background: linear-gradient(135deg,#A67F38,#8B6510);
      padding: 18px 22px;
      display: flex; align-items: center; justify-content: space-between;
      flex-shrink: 0;
    }
    .cus-modal-header-title {
      font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
      font-size: 22px; color: rgba(0,0,0,.72); letter-spacing: 1px;
    }
    .cus-modal-close {
      background: rgba(0,0,0,.2); border: none; color: rgba(0,0,0,.5);
      width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
      font-size: 15px; display: flex; align-items: center; justify-content: center;
      transition: background .15s;
    }
    .cus-modal-close:hover { background: rgba(0,0,0,.38); }
    .cus-modal-body { padding: 22px; overflow-y: auto; flex: 1; }

    /* ── Customer info strip inside modal ── */
    .cus-info-strip {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px; border-radius: 10px;
      background: rgba(166,127,56,.07); border: 1px solid rgba(166,127,56,.15);
      margin-bottom: 18px;
    }
    .cus-info-avatar {
      width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg,#A67F38,#D9B573);
      display: flex; align-items: center; justify-content: center;
    }
    .cus-info-name {
      font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
      font-size: 19px; color: #e8e8e8; line-height: 1.1;
    }
    .cus-info-sub {
      font-size: 11px; color: #888; margin-top: 3px;
      font-family: 'Rajdhani', sans-serif;
    }

    /* ── Detail grid ── */
    .cus-detail-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 10px; margin-bottom: 20px;
    }
    .cus-detail-item {
      background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06);
      border-radius: 8px; padding: 10px 13px;
    }
    .cus-detail-label {
      font-family: 'Rajdhani', sans-serif; font-size: 10px;
      letter-spacing: .8px; text-transform: uppercase; color: #555;
      margin-bottom: 3px;
    }
    .cus-detail-value {
      font-size: 13px; color: #d0d0d0; font-weight: 500;
      word-break: break-all;
    }

    /* ── Section heading inside modal ── */
    .cus-section-heading {
      font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
      font-size: 15px; color: #A67F38; letter-spacing: .8px;
      text-transform: uppercase; margin-bottom: 11px;
      display: flex; align-items: center; gap: 7px;
    }
    .cus-section-heading::after {
      content: ''; flex: 1; height: 1px;
      background: rgba(166,127,56,.18);
    }

    /* ── Transaction card ── */
    .cus-txn-card {
      background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
      border-radius: 10px; padding: 13px 15px; margin-bottom: 9px;
    }
    .cus-txn-card:last-child { margin-bottom: 0; }
    .cus-txn-top {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 8px;
    }
    .cus-txn-id {
      font-family: 'Rajdhani', sans-serif; font-weight: 700;
      font-size: 12px; color: #A67F38; letter-spacing: .5px;
    }
    .cus-txn-date {
      font-size: 11px; color: #555; font-family: 'Rajdhani', sans-serif;
    }
    .cus-txn-items { margin-bottom: 8px; }
    .cus-txn-item-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,.04);
      font-size: 12px; color: #aaa;
    }
    .cus-txn-item-row:last-child { border-bottom: none; }
    .cus-txn-item-name { flex: 1; }
    .cus-txn-item-price { color: #D9B573; font-family: 'Rajdhani', sans-serif; font-weight: 700; }
    .cus-txn-footer {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 8px; border-top: 1px solid rgba(255,255,255,.06);
    }
    .cus-txn-total-label { font-size: 11px; color: #555; font-family: 'Rajdhani', sans-serif; letter-spacing: .5px; }
    .cus-txn-total-value {
      font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
      font-size: 16px; color: #D9B573;
    }
    .cus-txn-status-badge {
      font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700;
      letter-spacing: .6px; text-transform: uppercase; border-radius: 4px;
      padding: 2px 8px;
    }
    .cus-txn-status-badge.completed  { color:#34d399; background:rgba(52,211,153,.1);  border:1px solid rgba(52,211,153,.2);  }
    .cus-txn-status-badge.pending    { color:#fbbf24; background:rgba(251,191,36,.1);  border:1px solid rgba(251,191,36,.2);  }
    .cus-txn-status-badge.cancelled  { color:#f87171; background:rgba(248,113,113,.1); border:1px solid rgba(248,113,113,.2); }
    .cus-txn-empty {
      text-align: center; padding: 30px 20px;
      border: 1px dashed rgba(166,127,56,.18); border-radius: 10px;
      font-family: 'Rajdhani', sans-serif; color: #444; font-size: 13px;
    }
    .cus-txn-empty i { display: block; font-size: 24px; color: #333; margin-bottom: 8px; }

    /* ── Loading spinner in modal ── */
    .cus-modal-loading {
      text-align: center; padding: 36px 20px;
      font-family: 'Rajdhani', sans-serif; color: #555; font-size: 13px;
    }
    .cus-modal-loading i { display: block; font-size: 24px; color: #A67F38; margin-bottom: 8px; }

    /* ── Source tag (Account vs Customer) ── */
    .cus-src-tag {
      font-size: 9px; font-family: 'Rajdhani', sans-serif; font-weight: 700;
      letter-spacing: .8px; text-transform: uppercase; border-radius: 4px;
      padding: 2px 6px; display: inline-block; margin-left: 4px; vertical-align: middle;
    }
    .cus-src-tag.account  { color:#60a5fa; background:rgba(96,165,250,.1);  border:1px solid rgba(96,165,250,.2); }
    .cus-src-tag.customer { color:#A67F38; background:rgba(166,127,56,.1);  border:1px solid rgba(166,127,56,.2); }
  `;
  document.head.appendChild(s);
})();

// ── Inject View Modal HTML ─────────────────────────────────
(function injectModal() {
  if (document.getElementById("cusViewModal")) return;
  const div = document.createElement("div");
  div.id = "cusViewModal";
  div.innerHTML = `
    <div id="cusViewModalBox">
      <div class="cus-modal-header">
        <span class="cus-modal-header-title">
          <i class="fas fa-user-circle" style="margin-right:8px;font-size:16px;"></i>
          Customer Details
        </span>
        <button class="cus-modal-close" onclick="cusCloseView()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="cus-modal-body" id="cusViewModalBody">
        <!-- Populated dynamically -->
      </div>
    </div>
  `;
  document.body.appendChild(div);

  // Close on backdrop click
  div.addEventListener("click", function(e) {
    if (e.target === this) cusCloseView();
  });
})();

// ── Refresh button is injected in DOMContentLoaded (see Init section) ──

// ── Fetch Customers from Firestore ────────────────────────
async function fetchCustomers() {
  const tbody = document.getElementById("cusTb");
  if (!tbody) return;

  // Loading state
  tbody.innerHTML = `
    <tr>
      <td colspan="7" class="cus-empty">
        <i class="fas fa-spinner fa-spin"></i>
        Loading customers…
      </td>
    </tr>`;

  try {
    const results = [];
    const seenIds = new Set();

    // ── Strategy 1: collectionGroup("Customers")
    try {
      const groupSnap = await getDocs(collectionGroup(db, "Customers"));
      groupSnap.forEach(d => {
        if (!seenIds.has(d.id)) {
          seenIds.add(d.id);
          results.push({ id: d.id, _source: "customers", ...d.data() });
        }
      });
    } catch (e) {
      console.warn("[CustomersBackend] collectionGroup(Customers) failed:", e.message);
    }

    // ── Strategy 2: Root-level collection "Customers" (capital C)
    try {
      const cusSnap = await getDocs(collection(db, "Customers"));
      cusSnap.forEach(d => {
        if (!seenIds.has(d.id)) {
          seenIds.add(d.id);
          results.push({ id: d.id, _source: "customers", ...d.data() });
        }
      });
    } catch (e) {
      console.warn("[CustomersBackend] collection(Customers) failed:", e.message);
    }

    // ── Strategy 3: Root-level "customers" (lowercase) ──
    try {
      const cusLcSnap = await getDocs(collection(db, "customers"));
      cusLcSnap.forEach(d => {
        if (!seenIds.has(d.id)) {
          seenIds.add(d.id);
          results.push({ id: d.id, _source: "customers", ...d.data() });
        }
      });
    } catch (e) {
      console.warn("[CustomersBackend] collection(customers) failed:", e.message);
    }

    // ── Strategy 4: Registered user accounts from "users" ──
    try {
      const usrSnap = await getDocs(collection(db, "users"));
      usrSnap.forEach(d => {
        const data = d.data();
        const role = (data.role || "").toLowerCase();
        if (!["staff","technician","cashier","advisor","manager","admin"].includes(role)) {
          const alreadyIn = results.some(r => r.email && r.email === data.email);
          if (!alreadyIn && !seenIds.has(d.id)) {
            seenIds.add(d.id);
            results.push({ id: d.id, _source: "users", ...data });
          }
        }
      });
    } catch (e) {
      console.warn("[CustomersBackend] collection(users) failed:", e.message);
    }

    _allCustomers = results;
    _fetched = true;

    _updateStats();
    _renderTable();

  } catch (err) {
    console.error("[CustomersBackend] fetchCustomers error:", err);
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="cus-empty">
          <i class="fas fa-exclamation-triangle" style="color:#f87171;"></i>
          Failed to load customers. Check your connection.
        </td>
      </tr>`;
  }
}

// ── Refresh Handler ───────────────────────────────────────
window.cusRefresh = async function() {
  const btn = document.getElementById("cusRefreshBtn");
  if (btn) {
    btn.classList.add("spinning");
    btn.disabled = true;
  }
  _fetched = false;
  _allCustomers = [];
  await fetchCustomers();
  if (btn) {
    btn.classList.remove("spinning");
    btn.disabled = false;
  }
};

// ── Update Stat Cards ─────────────────────────────────────
function _updateStats() {
  const total = _allCustomers.length;

  const active = _allCustomers.filter(c => {
    const st = (c.status || "").toLowerCase();
    return st === "active" || st === "" || c._source === "users";
  }).length;

  const now = new Date();
  const newThisMonth = _allCustomers.filter(c => {
    if (!c.createdAt) return false;
    const d = c.createdAt.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  const rated = _allCustomers.filter(c => typeof c.rating === "number");
  const avgRating = rated.length
    ? (rated.reduce((s, c) => s + c.rating, 0) / rated.length).toFixed(1)
    : "—";

  const el = id => document.getElementById(id);
  if (el("cusTotal"))    el("cusTotal").textContent    = total;
  if (el("cusActive"))   el("cusActive").textContent   = active;
  if (el("cusNewMonth")) el("cusNewMonth").textContent = newThisMonth;
  if (el("cusRating"))   el("cusRating").textContent   = avgRating;
}

// ── Render Table ──────────────────────────────────────────
function _renderTable() {
  const tbody = document.getElementById("cusTb");
  if (!tbody) return;

  if (!_allCustomers.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="cus-empty">
          <i class="fas fa-users"></i>
          No customers found.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = _allCustomers.map((c, i) => {
    const fullName  = `${c.fname || c.firstName || ""} ${c.lname || c.lastName || ""}`.trim()
                    || c.displayName || c.name || "Unnamed";
    const email     = c.email   || "—";
    const phone     = c.phone   || c.phoneNumber || "—";
    const visits    = typeof c.visits === "number" ? c.visits : "—";
    const status    = (c.status || (c._source === "users" ? "active" : "new")).toLowerCase();
    const custId    = c.customerId || c.id?.slice(0, 8).toUpperCase() || `#${String(i + 1).padStart(4, "0")}`;

    const srcTag = c._source === "users"
      ? `<span class="cus-src-tag account">Account</span>`
      : `<span class="cus-src-tag customer">Customer</span>`;

    const badgeClass = status === "active"   ? "active"
                     : status === "inactive" ? "inactive"
                     : "new";
    const badgeLabel = status === "active"   ? "Active"
                     : status === "inactive" ? "Inactive"
                     : "New";

    return `
      <tr class="cus-row" style="border-bottom:1px solid rgba(255,255,255,.04);">
        <td style="padding:12px 14px;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:12px;color:#A67F38;">
          ${custId}
        </td>
        <td style="padding:12px 14px;">
          <div style="font-size:13px;color:#e0e0e0;font-weight:500;">
            ${fullName}${srcTag}
          </div>
        </td>
        <td style="padding:12px 14px;font-size:12px;color:#aaa;">${email}</td>
        <td style="padding:12px 14px;font-size:12px;color:#aaa;">${phone}</td>
        <td style="padding:12px 14px;font-size:12px;color:#aaa;text-align:center;">${visits}</td>
        <td style="padding:12px 14px;">
          <span class="cus-badge ${badgeClass}">${badgeLabel}</span>
        </td>
        <td style="padding:12px 14px;">
          <button class="cus-view-btn" onclick="cusOpenView('${c.id}')">
            <i class="fas fa-eye" style="font-size:10px;"></i> View
          </button>
        </td>
      </tr>`;
  }).join("");
}

// ── Open View Modal ───────────────────────────────────────
window.cusOpenView = async function(customerId) {
  const c = _allCustomers.find(x => x.id === customerId);
  if (!c) return;

  const fullName = `${c.fname || c.firstName || ""} ${c.lname || c.lastName || ""}`.trim()
                 || c.displayName || c.name || "Unnamed";
  const email    = c.email || "—";
  const phone    = c.phone || c.phoneNumber || "—";
  const status   = c.status || (c._source === "users" ? "Active" : "New");
  const visits   = typeof c.visits === "number" ? c.visits : "—";
  const joined   = c.createdAt
    ? (c.createdAt.toDate ? c.createdAt.toDate() : new Date(c.createdAt)).toLocaleDateString("en-PH", { year:"numeric", month:"short", day:"numeric" })
    : "—";
  const custId   = c.customerId || c.id?.slice(0, 8).toUpperCase() || "—";

  // Show modal with loading state for transactions
  const body = document.getElementById("cusViewModalBody");
  body.innerHTML = `
    <!-- Info strip -->
    <div class="cus-info-strip">
      <div class="cus-info-avatar">
        <i class="fas fa-user" style="color:#080808;font-size:18px;"></i>
      </div>
      <div>
        <div class="cus-info-name">${fullName}</div>
        <div class="cus-info-sub">${email} &middot; ${phone}</div>
      </div>
    </div>

    <!-- Detail grid -->
    <div class="cus-detail-grid">
      <div class="cus-detail-item">
        <div class="cus-detail-label">Customer ID</div>
        <div class="cus-detail-value">${custId}</div>
      </div>
      <div class="cus-detail-item">
        <div class="cus-detail-label">Status</div>
        <div class="cus-detail-value">${status}</div>
      </div>
      <div class="cus-detail-item">
        <div class="cus-detail-label">Phone</div>
        <div class="cus-detail-value">${phone}</div>
      </div>
      <div class="cus-detail-item">
        <div class="cus-detail-label">Total Visits</div>
        <div class="cus-detail-value">${visits}</div>
      </div>
      <div class="cus-detail-item">
        <div class="cus-detail-label">Email</div>
        <div class="cus-detail-value">${email}</div>
      </div>
      <div class="cus-detail-item">
        <div class="cus-detail-label">Member Since</div>
        <div class="cus-detail-value">${joined}</div>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="cus-section-heading">
      <i class="fas fa-receipt" style="font-size:13px;"></i>
      Transaction History
    </div>
    <div id="cusViewTxnList">
      <div class="cus-modal-loading">
        <i class="fas fa-spinner fa-spin"></i>
        Loading transactions…
      </div>
    </div>
  `;

  document.getElementById("cusViewModal").classList.add("open");

  // ── Fetch transactions from Firestore ──────────────────
  try {
    const txnSnap = await getDocs(
      query(collection(db, "Transactions"), orderBy("__name__"))
    );

    // Filter transactions that belong to this customer by email or name
    const customerEmail = (c.email || "").toLowerCase();
    const customerName  = fullName.toLowerCase();

    const txns = [];
    txnSnap.forEach(d => {
      const t = { id: d.id, ...d.data() };
      const tEmail = (t.email || "").toLowerCase();
      const tName  = (t.customerName || "").toLowerCase();
      if (
        (customerEmail && tEmail === customerEmail) ||
        (customerName  && tName  === customerName)
      ) {
        txns.push(t);
      }
    });

    const txnList = document.getElementById("cusViewTxnList");
    if (!txnList) return;

    if (!txns.length) {
      txnList.innerHTML = `
        <div class="cus-txn-empty">
          <i class="fas fa-receipt"></i>
          No transactions found for this customer.
        </div>`;
      return;
    }

    txnList.innerHTML = txns.map(t => {
      // Date
      let dateStr = "—";
      if (t.createdAt) {
        const d = t.createdAt.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
        dateStr = d.toLocaleDateString("en-PH", { year:"numeric", month:"short", day:"numeric" });
      }

      // Items list
      const items = Array.isArray(t.items) ? t.items : [];
      const itemsHtml = items.length
        ? items.map(item => {
            const name  = item.name || item.productName || item.description || "Item";
            const qty   = item.quantity ?? item.qty ?? 1;
            const price = typeof item.lineTotal === "number"  ? item.lineTotal
                        : typeof item.price     === "number"  ? item.price * qty
                        : null;
            const priceStr = price !== null
              ? `₱${price.toLocaleString("en-PH", { minimumFractionDigits:2 })}`
              : "—";
            return `
              <div class="cus-txn-item-row">
                <span class="cus-txn-item-name">${name} ×${qty}</span>
                <span class="cus-txn-item-price">${priceStr}</span>
              </div>`;
          }).join("")
        : `<div class="cus-txn-item-row" style="color:#444;">No item details.</div>`;

      // Total
      const total = typeof t.totalAmount === "number" ? t.totalAmount
                  : typeof t.total       === "number" ? t.total
                  : null;
      const totalStr = total !== null
        ? `₱${total.toLocaleString("en-PH", { minimumFractionDigits:2 })}`
        : "—";

      // Status
      const txnStatus = (t.status || "completed").toLowerCase();
      const statusClass = txnStatus.includes("complet") ? "completed"
                        : txnStatus.includes("cancel")  ? "cancelled"
                        : "pending";

      return `
        <div class="cus-txn-card">
          <div class="cus-txn-top">
            <span class="cus-txn-id">${t.id}</span>
            <span class="cus-txn-date">${dateStr}</span>
          </div>
          <div class="cus-txn-items">${itemsHtml}</div>
          <div class="cus-txn-footer">
            <div>
              <div class="cus-txn-total-label">TOTAL</div>
              <div class="cus-txn-total-value">${totalStr}</div>
            </div>
            <span class="cus-txn-status-badge ${statusClass}">${txnStatus}</span>
          </div>
        </div>`;
    }).join("");

  } catch (err) {
    console.error("[CustomersBackend] fetchTransactions error:", err);
    const txnList = document.getElementById("cusViewTxnList");
    if (txnList) {
      txnList.innerHTML = `
        <div class="cus-txn-empty">
          <i class="fas fa-exclamation-triangle" style="color:#f87171;"></i>
          Failed to load transactions.
        </div>`;
    }
  }
};

// ── Close View Modal ──────────────────────────────────────
window.cusCloseView = function() {
  document.getElementById("cusViewModal").classList.remove("open");
};

// ── Patch renderPage to hook into nav ─────────────────────
function _patch() {
  const orig = window.renderPage;
  if (typeof orig !== "function") { setTimeout(_patch, 50); return; }

  window.renderPage = function(page, ...args) {
    if (page === "customers") {
      if (!_fetched) fetchCustomers();
      else _renderTable();
      return;
    }
    orig(page, ...args);
  };
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Inject refresh button into #cusToolbar (safe — DOM is ready)
  const toolbar = document.getElementById("cusToolbar");
  if (toolbar && !document.getElementById("cusRefreshBtn")) {
    const btn = document.createElement("button");
    btn.id        = "cusRefreshBtn";
    btn.className = "cus-refresh-btn";
    btn.innerHTML = `<i class="fas fa-sync-alt"></i> Refresh`;
    btn.onclick   = cusRefresh;
    toolbar.appendChild(btn);
  }

  _patch();
  fetchCustomers();
});