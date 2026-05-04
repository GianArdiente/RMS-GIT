// ============================================================
// BookingBackend.js — REV Admin · Booking Feature
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getFirestore, collection, getDocs, doc, updateDoc, query, orderBy, addDoc, serverTimestamp
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
let _all     = [];
let _filter  = "All";
let _current = null;
let _fetched = false;

// ── Inject shared styles ──────────────────────────────────
(function injectStyles() {
  if (document.getElementById("bk-styles")) return;
  const s = document.createElement("style");
  s.id = "bk-styles";
  s.textContent = `
    /* ── Booking table row hover ── */
    .bk-row { transition: background .15s; cursor: default; }
    .bk-row:hover { background: rgba(166,127,56,.06) !important; }

    /* ── Status badges ── */
    .bk-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 11px; border-radius: 99px;
      font-family: 'Rajdhani', sans-serif; font-weight: 700;
      font-size: 11px; letter-spacing: .8px; text-transform: uppercase;
    }
    .bk-badge::before {
      content: ''; width: 6px; height: 6px; border-radius: 50%;
      background: currentColor; flex-shrink: 0;
    }
    .bk-badge.pending   { color:#F2DB94; background:rgba(242,219,148,.12); border:1px solid rgba(242,219,148,.25); }
    .bk-badge.confirmed { color:#60a5fa; background:rgba(96,165,250,.12);  border:1px solid rgba(96,165,250,.25);  }
    .bk-badge.completed { color:#34d399; background:rgba(52,211,153,.12);  border:1px solid rgba(52,211,153,.25);  }
    .bk-badge.cancelled { color:#f87171; background:rgba(248,113,113,.12); border:1px solid rgba(248,113,113,.25); }

    /* ── Payment pill ── */
    .bk-pay { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:11px; }
    .bk-pay.partially_paid { color:#fbbf24; }
    .bk-pay.paid           { color:#34d399; }
    .bk-pay.unpaid         { color:#f87171; }
    .bk-pay.free           { color:#a78bfa; }

    /* ── Detail modal field row ── */
    .bk-field-row {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,.06);
    }
    .bk-field-row:last-child { border-bottom: none; }
    .bk-field-label {
      font-family: 'Rajdhani', sans-serif; font-weight: 700;
      font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
      color: #888; flex-shrink: 0; width: 120px; padding-top: 1px;
    }
    .bk-field-val {
      font-size: 13px; color: #e0e0e0; text-align: right;
      flex: 1; line-height: 1.4; word-break: break-word;
    }

    /* ── Payment summary box ── */
    .bk-payment-box {
      margin-top: 14px; padding: 14px 16px; border-radius: 10px;
      background: rgba(166,127,56,.07); border: 1px solid rgba(166,127,56,.2);
    }
    .bk-payment-title {
      font-family: 'Rajdhani', sans-serif; font-weight: 800;
      font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
      color: #A67F38; margin-bottom: 10px;
    }
    .bk-payment-line {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 6px;
    }
    .bk-payment-line-label { font-size: 12px; color: #999; }
    .bk-payment-line-val   { font-size: 13px; font-weight: 600; color: #e0e0e0; }
    .bk-payment-line-val.green { color: #34d399; }
    .bk-payment-line-val.red   { color: #f87171; }

    /* ── Progress bar ── */
    .bk-progress-track {
      height: 6px; background: rgba(255,255,255,.07);
      border-radius: 99px; overflow: hidden; margin: 10px 0 6px;
    }
    .bk-progress-fill {
      height: 100%; border-radius: 99px;
      background: linear-gradient(90deg, #A67F38, #F2DB94);
      transition: width .5s cubic-bezier(.4,0,.2,1);
    }
    .bk-progress-meta {
      display: flex; justify-content: space-between;
      font-family: 'Rajdhani', sans-serif; font-size: 11px;
    }

    /* ── Modal action buttons ── */
    .bk-action-row { display:flex; gap:8px; margin-top:16px; flex-wrap:wrap; }
    .bk-btn {
      flex: 1; min-width: 90px; padding: 11px 16px;
      border-radius: 8px; border: none; cursor: pointer;
      font-family: 'Rajdhani', sans-serif; font-weight: 700;
      font-size: 13px; letter-spacing: .5px;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      transition: opacity .15s, transform .1s;
    }
    .bk-btn:hover  { opacity: .88; }
    .bk-btn:active { transform: scale(.98); }
    .bk-btn.confirm  { background: linear-gradient(135deg,#A67F38,#D9B573); color: #080808; }
    .bk-btn.complete { background: rgba(52,211,153,.15); border: 1px solid rgba(52,211,153,.3); color: #34d399; }
    .bk-btn.cancel   { background: rgba(248,113,113,.1); border: 1px solid rgba(248,113,113,.25); color: #f87171; }
    .bk-btn.close    { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); color: #aaa; }

    /* ── Table secondary text ── */
    .bk-sub { font-size: 11px; color: #777; margin-top: 2px; }

    /* ── View button ── */
    .bk-view-btn {
      padding: 5px 12px; border-radius: 6px; cursor: pointer;
      background: rgba(166,127,56,.1); border: 1px solid rgba(166,127,56,.3);
      color: #D9B573; font-family: 'Rajdhani', sans-serif;
      font-weight: 700; font-size: 11px; letter-spacing: .5px;
      display: inline-flex; align-items: center; gap: 5px;
      transition: background .15s;
    }
    .bk-view-btn:hover { background: rgba(166,127,56,.2); }

    /* ── New Booking modal overlay ── */
    #bkNewModal {
      display: none; position: fixed; inset: 0; z-index: 999;
      background: rgba(0,0,0,.75); backdrop-filter: blur(4px);
      align-items: center; justify-content: center;
    }
    #bkNewModal.open { display: flex; }
    #bkNewModalBox {
      width: min(540px, 95vw);
      background: #111; border: 1px solid rgba(166,127,56,.2);
      border-radius: 14px; overflow: hidden;
      box-shadow: 0 40px 100px rgba(0,0,0,.8);
      animation: bkSlideUp .3s cubic-bezier(.22,1,.36,1) both;
      max-height: 92vh; display: flex; flex-direction: column;
    }
    @keyframes bkSlideUp {
      from { opacity:0; transform:translateY(24px); }
    }
    .bk-modal-header {
      background: linear-gradient(135deg,#A67F38,#8B6510);
      padding: 18px 22px;
      display: flex; align-items: center; justify-content: space-between;
      flex-shrink: 0;
    }
    .bk-modal-header-title {
      font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
      font-size: 22px; color: rgba(0,0,0,.7); letter-spacing: 1px;
    }
    .bk-modal-close {
      background: rgba(0,0,0,.2); border: none; color: rgba(0,0,0,.5);
      width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
      font-size: 15px; display: flex; align-items: center; justify-content: center;
      transition: background .15s;
    }
    .bk-modal-close:hover { background: rgba(0,0,0,.35); }
    .bk-modal-body { padding: 22px; overflow-y: auto; flex: 1; }
    .bk-modal-footer { padding: 16px 22px; border-top: 1px solid rgba(255,255,255,.06); flex-shrink: 0; }

    /* ── Form inputs ── */
    .bk-form-group { margin-bottom: 14px; }
    .bk-form-label {
      font-family: 'Rajdhani', sans-serif; font-weight: 700;
      font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
      color: #888; margin-bottom: 5px; display: block;
    }
    .bk-form-input {
      width: 100%; padding: 10px 13px;
      background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1);
      border-radius: 8px; color: #e0e0e0;
      font-family: 'Rajdhani', sans-serif; font-size: 14px;
      outline: none; transition: border-color .2s, background .2s;
      box-sizing: border-box;
    }
    .bk-form-input:focus {
      border-color: rgba(166,127,56,.6);
      background: rgba(166,127,56,.05);
    }
    .bk-form-input::placeholder { color: #444; }
    .bk-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    /* ── Customer search ── */
    .bk-search-wrap { position: relative; }
    .bk-search-results {
      position: absolute; top: calc(100% + 4px); left: 0; right: 0;
      background: #1a1a1a; border: 1px solid rgba(166,127,56,.2);
      border-radius: 8px; z-index: 10; max-height: 180px; overflow-y: auto;
      box-shadow: 0 12px 40px rgba(0,0,0,.6);
    }
    .bk-search-item {
      padding: 10px 14px; cursor: pointer;
      transition: background .12s;
      border-bottom: 1px solid rgba(255,255,255,.04);
    }
    .bk-search-item:last-child { border-bottom: none; }
    .bk-search-item:hover { background: rgba(166,127,56,.1); }
    .bk-search-item-name { font-size: 13px; color: #e0e0e0; font-weight: 600; }
    .bk-search-item-sub  { font-size: 11px; color: #666; margin-top: 1px; }
    .bk-customer-selected {
      padding: 10px 14px; border-radius: 8px;
      background: rgba(52,211,153,.07); border: 1px solid rgba(52,211,153,.2);
      display: flex; align-items: center; justify-content: space-between;
      margin-top: 8px;
    }
    .bk-customer-selected-name { font-size: 13px; color: #e0e0e0; font-weight: 600; }
    .bk-customer-selected-sub  { font-size: 11px; color: #34d399; margin-top: 2px; }
    .bk-customer-clear {
      background: none; border: none; color: #555; cursor: pointer;
      font-size: 16px; padding: 2px 6px; transition: color .15s;
    }
    .bk-customer-clear:hover { color: #f87171; }

    /* ── Locked auto-filled field ── */
    .bk-form-input.bk-locked {
      opacity: 1 !important;
      background: rgba(52,211,153,.04) !important;
      border-color: rgba(52,211,153,.25) !important;
      color: #c8f0e0 !important;
      cursor: not-allowed;
    }
    .bk-locked-wrap { position: relative; }
    .bk-lock-icon {
      position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
      color: rgba(52,211,153,.45); font-size: 11px; pointer-events: none;
    }
    .bk-account-badge {
      display: inline-flex; align-items: center; gap: 5px;
      font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700;
      letter-spacing: 1px; text-transform: uppercase;
      color: #34d399; margin-left: 8px; opacity: .7;
    }

    /* ── Section divider ── */
    .bk-section-title {
      font-family: 'Rajdhani', sans-serif; font-weight: 800;
      font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
      color: #A67F38; margin: 18px 0 12px; display: flex; align-items: center; gap: 8px;
    }
    .bk-section-title::after {
      content: ''; flex: 1; height: 1px; background: rgba(166,127,56,.2);
    }

    /* ── Error msg ── */
    .bk-err {
      padding: 9px 13px; border-radius: 8px; margin-top: 12px;
      background: rgba(248,113,113,.08); border: 1px solid rgba(248,113,113,.2);
      color: #f87171; font-size: 12px; font-family: 'Rajdhani', sans-serif;
      display: none;
    }
  `;
  document.head.appendChild(s);
})();

// ── Helpers ───────────────────────────────────────────────
function badge(status) {
  const s = (status || "pending").toLowerCase();
  return `<span class="bk-badge ${s}">${s.charAt(0).toUpperCase() + s.slice(1)}</span>`;
}

function payBadge(ps) {
  const labels = { partially_paid:"Partial", paid:"Paid", unpaid:"Unpaid", free:"Free" };
  const s = (ps || "unpaid").toLowerCase();
  return `<span class="bk-pay ${s}">${labels[s] || ps}</span>`;
}

function genRef() {
  return "REV-" + Math.floor(100000 + Math.random() * 900000);
}

// ── Fetch bookings ────────────────────────────────────────
async function fetchBookings() {
  _showLoading();
  try {
    const snap = await getDocs(query(collection(db, "Bookings"), orderBy("createdAt", "desc")));
    _all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    _fetched = true;
    _updateBadge(_all.length);
    _renderTable(_filtered());
    _renderRecent();
  } catch (err) {
    console.error("BookingBackend:", err);
    _showError(err.message);
  }
}

function _filtered() {
  if (!_filter || _filter === "All") return _all;
  return _all.filter(b => (b.status || "").toLowerCase() === _filter.toLowerCase());
}

// ── Table ─────────────────────────────────────────────────
function _renderTable(list) {
  const tb = document.getElementById("bkTb");
  if (!tb) return;

  if (!list.length) {
    tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px 0;color:#444;font-family:'Rajdhani',sans-serif;font-size:14px;">
      <i class="fas fa-calendar-times" style="display:block;font-size:28px;margin-bottom:10px;color:#2a2a2a;"></i>
      No bookings found
    </td></tr>`;
    return;
  }

  tb.innerHTML = list.map(b => `
    <tr class="bk-row" style="border-bottom:1px solid rgba(255,255,255,.04);">
      <td style="padding:12px 14px;">
        <span style="font-family:'Rajdhani',sans-serif;font-weight:800;font-size:13px;color:#D9B573;">${b.bookingRef || b.id}</span>
      </td>
      <td style="padding:12px 14px;">
        <div style="font-size:14px;font-weight:600;color:#e8e8e8;">${b.customerName || "—"}</div>
        <div class="bk-sub">${b.email || ""}</div>
      </td>
      <td style="padding:12px 14px;">
        <div style="font-size:13px;color:#ccc;">${b.serviceName || "—"}</div>
        <div class="bk-sub">₱${(b.servicePrice || 0).toLocaleString()}</div>
      </td>
      <td style="padding:12px 14px;font-size:13px;color:#bbb;">${b.appointmentDate || "—"}</td>
      <td style="padding:12px 14px;font-size:13px;color:#bbb;">${b.appointmentTime || "—"}</td>
      <td style="padding:12px 14px;">${badge(b.status)}</td>
      <td style="padding:12px 14px;">
        <button class="bk-view-btn" onclick="bkOpenDetail('${b.id}')">
          <i class="fas fa-eye"></i> View
        </button>
      </td>
    </tr>`).join("");
}

function _showLoading() {
  const tb = document.getElementById("bkTb");
  if (tb) tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:#444;font-family:'Rajdhani',sans-serif;">
    <i class="fas fa-circle-notch fa-spin" style="display:block;font-size:24px;margin-bottom:10px;color:#A67F38;"></i>Loading…</td></tr>`;
}
function _showError(msg) {
  const tb = document.getElementById("bkTb");
  if (tb) tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:#f87171;font-family:'Rajdhani',sans-serif;">
    <i class="fas fa-exclamation-triangle" style="display:block;font-size:24px;margin-bottom:10px;"></i>${msg}</td></tr>`;
}

function _updateBadge(n) {
  const lbl = document.querySelector("#page-booking .card span[style*='A67F38']");
  if (lbl) lbl.textContent = `${n} Booking${n !== 1 ? "s" : ""}`;
  const nb = document.querySelector(".ni[data-page='booking'] .nb");
  if (nb) nb.textContent = n;
  const cards = document.querySelectorAll("#page-dashboard .sc");
  if (cards[0]) { const v = cards[0].querySelector(".sc-v"); if (v) v.textContent = n; }
}

// ── Filter buttons ────────────────────────────────────────
function _initFilters() {
  const pg = document.getElementById("page-booking");
  if (!pg) return;
  const row = pg.querySelector("div:nth-child(2)");
  if (!row) return;
  const filters = ["All","Pending","Confirmed","Completed","Cancelled"];
  row.innerHTML = filters.map(f =>
    `<button id="bkF_${f}" onclick="bkSetFilter('${f}')"
      class="${f === "All" ? "btn-g" : "btn-gh"}"
      style="font-size:11px;padding:5px 14px;">${f}</button>`
  ).join("");
}

window.bkSetFilter = function(f) {
  _filter = f;
  ["All","Pending","Confirmed","Completed","Cancelled"].forEach(x => {
    const b = document.getElementById(`bkF_${x}`);
    if (b) { b.className = x === f ? "btn-g" : "btn-gh"; b.style.cssText = "font-size:11px;padding:5px 14px;"; }
  });
  _renderTable(_filtered());
};

// ── Detail modal ──────────────────────────────────────────
window.bkOpenDetail = function(id) {
  const b = _all.find(x => x.id === id);
  if (!b) return;
  _current = b;

  const titleEl = document.getElementById("bkTitle");
  if (titleEl) {
    titleEl.style.cssText = "font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;color:#F2DB94;letter-spacing:1px;";
    titleEl.textContent = b.bookingRef || b.id;
  }

  const bodyEl = document.getElementById("bkBody");
  if (bodyEl) bodyEl.innerHTML = _detailHTML(b);

  _detailButtons(b);
  openModal("bkModal");
};

function _detailHTML(b) {
  const fields = [
    ["Customer",    b.customerName      || "—"],
    ["Email",       b.email             || "—"],
    ["Phone",       b.phone             || "—"],
    ["Service",     b.serviceName       || "—"],
    ["Vehicle",     b.vehicleFull       || `${b.vehicleYear||""} ${b.vehicleMake||""} ${b.vehicleModel||""}`.trim() || "—"],
    ["Appointment", `${b.appointmentDate||"—"} ${b.appointmentTime||""}`],
    ["Drop-off",    b.dropoffPreference || "—"],
    ["Technician",  b.technician        || "No preference"],
    ["Source",      b.hearAboutUs       || "—"],
    ["Notes",       b.notes             || "none"],
  ];

  const total   = b.servicePrice || 0;
  const down    = b.downpayment  || 0;
  const balance = b.balance      ?? (total - down);
  const pct     = b.paidPercent  || 0;
  const created = b.createdAt?.toDate
    ? b.createdAt.toDate().toLocaleDateString("en-PH",{year:"numeric",month:"short",day:"numeric"})
    : "—";

  return `
    <div style="max-height:60vh;overflow-y:auto;padding-right:6px;">

      <!-- Status + date row -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,.06);">
        ${badge(b.status)}
        <span style="font-family:'Rajdhani',sans-serif;font-size:12px;color:#666;">
          <i class="fas fa-calendar-alt" style="margin-right:4px;color:#555;"></i>${created}
        </span>
      </div>

      <!-- Fields -->
      ${fields.map(([l,v]) => `
        <div class="bk-field-row">
          <span class="bk-field-label">${l}</span>
          <span class="bk-field-val">${v}</span>
        </div>`).join("")}

      <!-- Payment summary -->
      <div class="bk-payment-box">
        <div class="bk-payment-title"><i class="fas fa-receipt" style="margin-right:6px;"></i>Payment Summary</div>
        <div class="bk-payment-line">
          <span class="bk-payment-line-label">Service Price</span>
          <span class="bk-payment-line-val">₱${total.toLocaleString()}</span>
        </div>
        <div class="bk-payment-line">
          <span class="bk-payment-line-label">Downpayment</span>
          <span class="bk-payment-line-val green">₱${down.toLocaleString()}</span>
        </div>
        <div class="bk-payment-line" style="padding-top:8px;border-top:1px solid rgba(255,255,255,.06);margin-top:4px;">
          <span class="bk-payment-line-label">Remaining Balance</span>
          <span class="bk-payment-line-val red">₱${balance.toLocaleString()}</span>
        </div>
        <div class="bk-progress-track">
          <div class="bk-progress-fill" style="width:${pct}%;"></div>
        </div>
        <div class="bk-progress-meta">
          ${payBadge(b.paymentStatus)}
          <span style="color:#666;font-size:11px;">${pct}% paid</span>
        </div>
      </div>
    </div>`;
}

function _detailButtons(b) {
  const footer = document.querySelector("#bkModal .mb > div:last-child");
  if (!footer) return;
  const s = (b.status || "pending").toLowerCase();
  footer.innerHTML = `<div class="bk-action-row">
    ${s === "pending"   ? `<button class="bk-btn confirm"  onclick="bkUpdateStatus('${b.id}','confirmed')"><i class="fas fa-check"></i>Confirm</button>` : ""}
    ${s === "confirmed" ? `<button class="bk-btn complete" onclick="bkUpdateStatus('${b.id}','completed')"><i class="fas fa-flag-checkered"></i>Complete</button>` : ""}
    ${(s === "pending" || s === "confirmed") ? `<button class="bk-btn cancel" onclick="bkUpdateStatus('${b.id}','cancelled')"><i class="fas fa-times"></i>Cancel</button>` : ""}
    <button class="bk-btn close" onclick="closeModal('bkModal')"><i class="fas fa-times"></i>Close</button>
  </div>`;
}

// ── Update status ─────────────────────────────────────────
window.bkUpdateStatus = async function(id, status) {
  try {
    await updateDoc(doc(db, "Bookings", id), { status, updatedAt: new Date() });
    const i = _all.findIndex(b => b.id === id);
    if (i !== -1) { _all[i].status = status; _current = _all[i]; }
    _renderTable(_filtered());
    if (_current) _detailButtons(_current);
    // refresh status badge inside modal
    const statusEl = document.querySelector("#bkModal .mb .bk-badge");
    if (statusEl) { statusEl.className = `bk-badge ${status}`; statusEl.textContent = status.charAt(0).toUpperCase() + status.slice(1); }
    _renderRecent();
    showToast(`Booking ${status}`);
  } catch (err) {
    showToast("Error: " + err.message);
  }
};

// ── Dashboard recent widget ───────────────────────────────
function _renderRecent() {
  const el = document.getElementById("recentEl");
  if (!el) return;
  const list = _all.slice(0, 5);
  if (!list.length) { el.innerHTML = `<div style="font-size:12px;color:#444;text-align:center;padding:14px;">No bookings yet</div>`; return; }

  const icons = { confirmed:"fa-check", pending:"fa-clock", completed:"fa-check-double", cancelled:"fa-times" };
  const cols  = { confirmed:"59,130,246", pending:"166,127,56", completed:"52,211,153", cancelled:"248,113,113" };

  el.innerHTML = list.map(b => {
    const s = (b.status||"pending").toLowerCase();
    const c = cols[s] || "166,127,56";
    return `
      <div onclick="nav('booking');bkOpenDetail('${b.id}')"
           style="display:flex;align-items:center;gap:9px;padding:7px 8px;border-radius:8px;cursor:pointer;transition:background .15s;"
           onmouseover="this.style.background='rgba(166,127,56,.06)'"
           onmouseout="this.style.background='transparent'">
        <div style="width:28px;height:28px;border-radius:7px;background:rgba(${c},.12);border:1px solid rgba(${c},.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas ${icons[s]||"fa-circle"}" style="font-size:10px;color:rgb(${c});"></i>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:600;color:#ddd;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${b.customerName||"—"}</div>
          <div style="font-size:10px;color:#555;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${b.serviceName||"—"}</div>
        </div>
        ${badge(b.status)}
      </div>`;
  }).join("");
}

// ── NEW BOOKING MODAL ─────────────────────────────────────
(function buildNewBookingModal() {
  const html = `
  <div id="bkNewModal" onclick="if(event.target===this)bkCloseNew()">
    <div id="bkNewModalBox">
      <div class="bk-modal-header">
        <div class="bk-modal-header-title"><i class="fas fa-calendar-plus" style="margin-right:8px;"></i>New Booking</div>
        <button class="bk-modal-close" onclick="bkCloseNew()">✕</button>
      </div>
      <div class="bk-modal-body">

        <!-- Customer search -->
        <div class="bk-section-title">Customer Account</div>
        <div class="bk-form-group">
          <label class="bk-form-label">Search Existing Account</label>
          <div class="bk-search-wrap">
            <input class="bk-form-input" id="bkCustSearch" placeholder="Type name, email, or phone…" oninput="bkSearchCustomer(this.value)" autocomplete="off" style="padding-right:36px;">
            <i class="fas fa-search" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#444;font-size:12px;pointer-events:none;"></i>
            <div class="bk-search-results" id="bkCustResults" style="display:none;"></div>
          </div>
          <div id="bkCustSelected" style="display:none;"></div>
        </div>

        <!-- Auto-filled account fields — locked once account is selected -->
        <div id="bkCustFields" style="display:none;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">
            <i class="fas fa-lock" style="font-size:10px;color:#34d399;"></i>
            <span style="font-family:'Rajdhani',sans-serif;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#34d399;">Auto-filled from account · Read only</span>
          </div>
          <div class="bk-form-row">
            <div class="bk-form-group">
              <label class="bk-form-label">Full Name</label>
              <div class="bk-locked-wrap">
                <input class="bk-form-input bk-locked" id="bkNName" placeholder="Customer name" readonly tabindex="-1">
                <i class="fas fa-lock bk-lock-icon"></i>
              </div>
            </div>
            <div class="bk-form-group">
              <label class="bk-form-label">Phone</label>
              <div class="bk-locked-wrap">
                <input class="bk-form-input bk-locked" id="bkNPhone" placeholder="Phone number" readonly tabindex="-1">
                <i class="fas fa-lock bk-lock-icon"></i>
              </div>
            </div>
          </div>
          <div class="bk-form-group">
            <label class="bk-form-label">Email</label>
            <div class="bk-locked-wrap">
              <input class="bk-form-input bk-locked" id="bkNEmail" placeholder="Email address" readonly tabindex="-1">
              <i class="fas fa-lock bk-lock-icon"></i>
            </div>
          </div>
        </div>

        <!-- Service -->
        <div class="bk-section-title">Service</div>
        <div class="bk-form-row">
          <div class="bk-form-group">
            <label class="bk-form-label">Service Name</label>
            <input class="bk-form-input" id="bkNService" placeholder="e.g. Oil Change">
          </div>
          <div class="bk-form-group">
            <label class="bk-form-label">Price (₱)</label>
            <input class="bk-form-input" id="bkNPrice" type="number" placeholder="0" min="0">
          </div>
        </div>

        <!-- Vehicle -->
        <div class="bk-section-title">Vehicle</div>
        <div class="bk-form-row">
          <div class="bk-form-group">
            <label class="bk-form-label">Year</label>
            <input class="bk-form-input" id="bkNYear" placeholder="2024" maxlength="4">
          </div>
          <div class="bk-form-group">
            <label class="bk-form-label">Make</label>
            <input class="bk-form-input" id="bkNMake" placeholder="Toyota">
          </div>
        </div>
        <div class="bk-form-group">
          <label class="bk-form-label">Model</label>
          <input class="bk-form-input" id="bkNModel" placeholder="Corolla">
        </div>

        <!-- Schedule -->
        <div class="bk-section-title">Schedule</div>
        <div class="bk-form-row">
          <div class="bk-form-group">
            <label class="bk-form-label">Date</label>
            <input class="bk-form-input" id="bkNDate" type="date">
          </div>
          <div class="bk-form-group">
            <label class="bk-form-label">Time</label>
            <select class="bk-form-input" id="bkNTime">
              ${["7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM",
                 "1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"]
                .map(t => `<option>${t}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="bk-form-row">
          <div class="bk-form-group">
            <label class="bk-form-label">Drop-off Preference</label>
            <select class="bk-form-input" id="bkNDropoff">
              <option>Wait on-site</option>
              <option>Drop off & pick up later</option>
              <option>Shuttle service needed</option>
            </select>
          </div>
          <div class="bk-form-group">
            <label class="bk-form-label">Technician</label>
            <input class="bk-form-input" id="bkNTech" placeholder="No preference">
          </div>
        </div>

        <!-- Payment -->
        <div class="bk-section-title">Payment</div>
        <div class="bk-form-row">
          <div class="bk-form-group">
            <label class="bk-form-label">Downpayment (₱)</label>
            <input class="bk-form-input" id="bkNDown" type="number" placeholder="0" min="0" oninput="bkCalcBalance()">
          </div>
          <div class="bk-form-group">
            <label class="bk-form-label">Payment Status</label>
            <select class="bk-form-input" id="bkNPayStatus">
              <option value="unpaid">Unpaid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        <!-- Notes -->
        <div class="bk-form-group">
          <label class="bk-form-label">Notes</label>
          <textarea class="bk-form-input" id="bkNNotes" rows="2" placeholder="Any special instructions…" style="resize:vertical;"></textarea>
        </div>

        <div id="bkNewErr" class="bk-err"></div>
      </div>

      <div class="bk-modal-footer">
        <div class="bk-action-row" style="margin-top:0;">
          <button class="bk-btn confirm" onclick="bkSaveNew()" style="flex:2;">
            <i class="fas fa-calendar-check"></i>Create Booking
          </button>
          <button class="bk-btn close" onclick="bkCloseNew()">
            <i class="fas fa-times"></i>Cancel
          </button>
        </div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", html);

  // Wire the "New Booking" button
  const newBtn = document.querySelector("#page-booking button.btn-g");
  if (newBtn && newBtn.textContent.includes("New Booking")) {
    newBtn.onclick = () => bkOpenNew();
  }
})();

// ── Customer search ───────────────────────────────────────
let _customers   = null;
let _selCustomer = null;

async function _loadCustomers() {
  if (_customers) return;
  try {
    const results = [];

    // Source 1 — User/Customer/Customers sub-collection
    try {
      const snap1 = await getDocs(collection(db, "User", "Customer", "Customers"));
      snap1.docs.forEach(d => {
        const data = d.data();
        results.push({
          id: d.id,
          _source: "customers",
          fname: data.fname || data.firstName || data.first_name || "",
          lname: data.lname || data.lastName  || data.last_name  || "",
          email: data.email || "",
          phone: data.phone || data.phoneNumber || data.contact || "",
          ...data
        });
      });
    } catch (_) { /* collection may not exist */ }

    // Source 2 — top-level Users collection (accounts)
    try {
      const snap2 = await getDocs(collection(db, "Users"));
      snap2.docs.forEach(d => {
        const data = d.data();
        // Skip if already pulled from sub-collection (match by email)
        const email = data.email || "";
        if (email && results.some(r => r.email === email)) return;
        results.push({
          id: d.id,
          _source: "users",
          fname: data.fname || data.firstName || data.first_name || data.displayName?.split(" ")[0] || "",
          lname: data.lname || data.lastName  || data.last_name  || data.displayName?.split(" ").slice(1).join(" ") || "",
          email,
          phone: data.phone || data.phoneNumber || data.contact || "",
          ...data
        });
      });
    } catch (_) { /* collection may not exist */ }

    _customers = results;
  } catch (e) {
    _customers = [];
    console.warn("Could not load customers:", e.message);
  }
}

window.bkSearchCustomer = function(val) {
  const res = document.getElementById("bkCustResults");
  if (!res) return;
  if (!val.trim()) { res.style.display = "none"; return; }

  const q    = val.toLowerCase();
  const hits = (_customers || []).filter(c => {
    const fullName = `${c.fname || ""} ${c.lname || ""}`.toLowerCase();
    return fullName.includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.phone || "").includes(q);
  }).slice(0, 8);

  if (!hits.length) {
    res.style.display = "block";
    res.innerHTML = `<div style="padding:12px 14px;color:#555;font-size:12px;font-family:'Rajdhani',sans-serif;">No accounts found</div>`;
    return;
  }

  res.style.display = "block";
  res.innerHTML = hits.map(c => {
    const fullName = `${c.fname || ""} ${c.lname || ""}`.trim() || c.email || "Unnamed";
    const sourceLabel = c._source === "users"
      ? `<span style="font-size:9px;font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#60a5fa;background:rgba(96,165,250,.1);border:1px solid rgba(96,165,250,.2);border-radius:4px;padding:1px 5px;margin-left:4px;">Account</span>`
      : `<span style="font-size:9px;font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#A67F38;background:rgba(166,127,56,.1);border:1px solid rgba(166,127,56,.2);border-radius:4px;padding:1px 5px;margin-left:4px;">Customer</span>`;
    return `
    <div class="bk-search-item" onclick="bkSelectCustomer('${c.id}')">
      <div class="bk-search-item-name" style="display:flex;align-items:center;gap:2px;">${fullName}${sourceLabel}</div>
      <div class="bk-search-item-sub">${c.email || "No email"} · ${c.phone || "No phone"}</div>
    </div>`;
  }).join("");
};

window.bkSelectCustomer = function(id) {
  const c = (_customers || []).find(x => x.id === id);
  if (!c) return;
  _selCustomer = c;

  const fullName = `${c.fname || ""} ${c.lname || ""}`.trim() || c.email || "Unnamed";
  const sourceLabel = c._source === "users" ? "Registered Account" : "Customer Record";
  const sourceColor = c._source === "users" ? "#60a5fa" : "#A67F38";

  // Hide search, show selected card
  document.getElementById("bkCustSearch").value   = "";
  document.getElementById("bkCustResults").style.display = "none";
  document.getElementById("bkCustSelected").style.display = "block";
  document.getElementById("bkCustSelected").innerHTML = `
    <div class="bk-customer-selected">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:34px;height:34px;border-radius:50%;background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas fa-user" style="font-size:13px;color:#34d399;"></i>
        </div>
        <div>
          <div class="bk-customer-selected-name">${fullName}</div>
          <div class="bk-customer-selected-sub">
            <span style="color:${sourceColor};font-size:10px;font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:.8px;text-transform:uppercase;">${sourceLabel}</span>
            &nbsp;·&nbsp;${c.email || "No email"}&nbsp;·&nbsp;${c.phone || "No phone"}
          </div>
        </div>
      </div>
      <button class="bk-customer-clear" onclick="bkClearCustomer()" title="Change account">✕</button>
    </div>`;

  // Reveal and auto-fill locked fields
  document.getElementById("bkCustFields").style.display = "block";
  document.getElementById("bkNName").value  = fullName;
  document.getElementById("bkNPhone").value = c.phone || "";
  document.getElementById("bkNEmail").value = c.email || "";
};

window.bkClearCustomer = function() {
  _selCustomer = null;
  document.getElementById("bkCustSelected").style.display = "none";
  document.getElementById("bkCustFields").style.display   = "none";
  document.getElementById("bkCustSearch").value = "";
  document.getElementById("bkNName").value  = "";
  document.getElementById("bkNPhone").value = "";
  document.getElementById("bkNEmail").value = "";
};

window.bkCalcBalance = function() {};   // placeholder for future live calc

// ── Open / close new booking ──────────────────────────────
window.bkOpenNew = function() {
  _selCustomer = null;
  bkClearCustomer();
  ["bkNService","bkNPrice","bkNYear","bkNMake","bkNModel","bkNNotes","bkNDown"].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = "";
  });
  document.getElementById("bkNDate").value      = new Date().toISOString().split("T")[0];
  document.getElementById("bkNTime").value      = "9:00 AM";
  document.getElementById("bkNDropoff").value   = "Wait on-site";
  document.getElementById("bkNTech").value      = "";
  document.getElementById("bkNPayStatus").value = "unpaid";
  document.getElementById("bkNewErr").style.display = "none";
  document.getElementById("bkNewModal").classList.add("open");
  _loadCustomers();
};

window.bkCloseNew = function() {
  document.getElementById("bkNewModal").classList.remove("open");
};

// ── Save new booking ──────────────────────────────────────
window.bkSaveNew = async function() {
  const errEl = document.getElementById("bkNewErr");
  errEl.style.display = "none";

  const show = msg => { errEl.textContent = msg; errEl.style.display = "block"; };

  const name    = document.getElementById("bkNName").value.trim();
  const email   = document.getElementById("bkNEmail").value.trim();
  const phone   = document.getElementById("bkNPhone").value.trim();
  const service = document.getElementById("bkNService").value.trim();
  const price   = parseFloat(document.getElementById("bkNPrice").value) || 0;
  const year    = document.getElementById("bkNYear").value.trim();
  const make    = document.getElementById("bkNMake").value.trim();
  const model   = document.getElementById("bkNModel").value.trim();
  const date    = document.getElementById("bkNDate").value;
  const time    = document.getElementById("bkNTime").value;
  const dropoff = document.getElementById("bkNDropoff").value;
  const tech    = document.getElementById("bkNTech").value.trim() || "No preference";
  const notes   = document.getElementById("bkNNotes").value.trim() || "none";
  const down    = parseFloat(document.getElementById("bkNDown").value) || 0;
  const payStatus = document.getElementById("bkNPayStatus").value;

  if (!name)    return show("Please search and select a customer.");
  if (!service) return show("Please enter a service name.");
  if (!date)    return show("Please select an appointment date.");

  const ref     = genRef();
  const balance = price - down;
  const pct     = price > 0 ? Math.round((down / price) * 100) : 0;

  const data = {
    bookingRef: ref,
    customerName: name,
    email, phone,
    serviceName: service,
    servicePrice: price,
    vehicleYear: year,
    vehicleMake: make,
    vehicleModel: model,
    vehicleFull: `${year} ${make} ${model}`.trim(),
    appointmentDate: date,
    appointmentTime: time,
    dropoffPreference: dropoff,
    technician: tech,
    notes,
    downpayment: down,
    balance,
    paidPercent: pct,
    paymentStatus: payStatus,
    hearAboutUs: "Admin",
    status: "pending",
    uid: _selCustomer?.id || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, "Bookings"), data);
    bkCloseNew();
    await fetchBookings();
    showToast(`Booking ${ref} created!`);
  } catch (err) {
    show("Failed to save: " + err.message);
  }
};

// ── Patch Admin.js renderPage & renderRecent ──────────────
function _patch() {
  const orig = window.renderPage;
  if (typeof orig !== "function") { setTimeout(_patch, 50); return; }

  window.renderPage = function(page, ...args) {
    if (page === "booking") {
      if (!_fetched) fetchBookings(); else _renderTable(_filtered());
      return;
    }
    orig(page, ...args);
  };

  window.renderRecent = function() {
    if (_fetched) _renderRecent();
  };
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  _initFilters();
  _patch();
  fetchBookings();
});
