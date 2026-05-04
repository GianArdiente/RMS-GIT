// ============================================================
// CustomersBackend.js — REV Admin · Customers Feature
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getFirestore, collection, collectionGroup, getDocs, query, orderBy
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

    /* ── View History button ── */
    .cus-hist-btn {
      padding: 5px 12px; border-radius: 6px; cursor: pointer;
      background: rgba(166,127,56,.1); border: 1px solid rgba(166,127,56,.3);
      color: #D9B573; font-family: 'Rajdhani', sans-serif;
      font-weight: 700; font-size: 11px; letter-spacing: .5px;
      display: inline-flex; align-items: center; gap: 5px;
      transition: background .15s;
    }
    .cus-hist-btn:hover { background: rgba(166,127,56,.22); }

    /* ── Table secondary text ── */
    .cus-sub { font-size: 11px; color: #777; margin-top: 2px; }

    /* ── Empty / loading state ── */
    .cus-empty {
      text-align: center; padding: 48px 20px;
      font-family: 'Rajdhani', sans-serif; color: #555;
      font-size: 13px; letter-spacing: .5px;
    }
    .cus-empty i { font-size: 28px; color: #333; display: block; margin-bottom: 10px; }

    /* ── Customer History Modal ── */
    #cusHistModal {
      display: none; position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,.78); backdrop-filter: blur(5px);
      align-items: center; justify-content: center;
    }
    #cusHistModal.open { display: flex; }
    #cusHistModalBox {
      width: min(560px, 95vw);
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
      width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg,#A67F38,#D9B573);
      display: flex; align-items: center; justify-content: center;
    }
    .cus-info-name {
      font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
      font-size: 18px; color: #e8e8e8; line-height: 1.1;
    }
    .cus-info-sub {
      font-size: 11px; color: #888; margin-top: 2px;
      font-family: 'Rajdhani', sans-serif;
    }

    /* ── Placeholder notice inside modal ── */
    .cus-coming-soon {
      text-align: center; padding: 36px 20px;
      border: 1px dashed rgba(166,127,56,.2); border-radius: 10px;
      background: rgba(166,127,56,.03);
    }
    .cus-coming-soon i {
      font-size: 30px; color: #A67F38; display: block; margin-bottom: 10px; opacity:.6;
    }
    .cus-coming-soon-title {
      font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
      font-size: 18px; color: #888; margin-bottom: 5px;
    }
    .cus-coming-soon-sub {
      font-size: 11px; color: #555; font-family: 'Rajdhani', sans-serif;
      letter-spacing: .5px;
    }

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

// ── Inject History Modal HTML ──────────────────────────────
(function injectModal() {
  if (document.getElementById("cusHistModal")) return;
  const div = document.createElement("div");
  div.id = "cusHistModal";
  div.innerHTML = `
    <div id="cusHistModalBox">
      <div class="cus-modal-header">
        <span class="cus-modal-header-title">
          <i class="fas fa-history" style="margin-right:8px;font-size:16px;"></i>
          Customer History
        </span>
        <button class="cus-modal-close" onclick="cusCloseHistory()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="cus-modal-body">
        <div id="cusHistInfo" class="cus-info-strip">
          <div class="cus-info-avatar">
            <i class="fas fa-user" style="color:#080808;font-size:16px;"></i>
          </div>
          <div>
            <div class="cus-info-name" id="cusHistName">—</div>
            <div class="cus-info-sub" id="cusHistSub">—</div>
          </div>
        </div>
        <!-- Placeholder — history functionality coming soon -->
        <div class="cus-coming-soon">
          <i class="fas fa-clock"></i>
          <div class="cus-coming-soon-title">History Coming Soon</div>
          <div class="cus-coming-soon-sub">
            Booking & service history for this customer will appear here.
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(div);
})();

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
    //    Catches the subcollection at Customer/*/Customers/* as seen in Firestore
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

// ── Update Stat Cards ─────────────────────────────────────
function _updateStats() {
  const total = _allCustomers.length;

  // "Active" = customers who have a status of "active", or users (always active)
  const active = _allCustomers.filter(c => {
    const st = (c.status || "").toLowerCase();
    return st === "active" || st === "" || c._source === "users";
  }).length;

  // New this month = createdAt within the current calendar month
  const now = new Date();
  const newThisMonth = _allCustomers.filter(c => {
    if (!c.createdAt) return false;
    const d = c.createdAt.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  // Avg rating — if customers have a rating field
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
                    || c.displayName
                    || c.name
                    || "Unnamed";
    const email     = c.email   || "—";
    const phone     = c.phone   || c.phoneNumber || "—";
    const visits    = typeof c.visits === "number" ? c.visits : "—";
    const status    = (c.status || (c._source === "users" ? "active" : "new")).toLowerCase();
    const custId    = c.customerId || c.id?.slice(0, 8).toUpperCase() || `#${String(i + 1).padStart(4, "0")}`;

    // Source tag
    const srcTag = c._source === "users"
      ? `<span class="cus-src-tag account">Account</span>`
      : `<span class="cus-src-tag customer">Customer</span>`;

    // Status badge
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
          <button class="cus-hist-btn" onclick="cusViewHistory('${c.id}')">
            <i class="fas fa-history" style="font-size:10px;"></i> History
          </button>
        </td>
      </tr>`;
  }).join("");
}

// ── Open History Modal ────────────────────────────────────
window.cusViewHistory = function(customerId) {
  const c = _allCustomers.find(x => x.id === customerId);
  if (!c) return;

  const fullName = `${c.fname || c.firstName || ""} ${c.lname || c.lastName || ""}`.trim()
                 || c.displayName || c.name || "Unnamed";
  const email = c.email || "No email";
  const phone = c.phone || c.phoneNumber || "No phone";

  document.getElementById("cusHistName").textContent = fullName;
  document.getElementById("cusHistSub").textContent  = `${email} · ${phone}`;

  document.getElementById("cusHistModal").classList.add("open");
};

window.cusCloseHistory = function() {
  document.getElementById("cusHistModal").classList.remove("open");
};

// Close modal on backdrop click
document.getElementById("cusHistModal")?.addEventListener("click", function(e) {
  if (e.target === this) cusCloseHistory();
});

// ── Stub: openAddCustomer (button in HTML calls this) ─────
window.openAddCustomer = window.openAddCustomer || function() {
  if (typeof showToast === "function") showToast("Add customer coming soon.", "info");
  else console.log("[CustomersBackend] openAddCustomer — not yet implemented.");
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
  _patch();
  fetchCustomers();
});