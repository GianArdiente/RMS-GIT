/* ══════════════════════════════════════════════════════════════
   REV MOTORS — Transaction History Module
   Drop-in JS for the Staff Portal (Staff.html)
   Usage: <script src="transaction.js"></script>  at end of body
   ══════════════════════════════════════════════════════════════ */

/* ── 1. DATA ─────────────────────────────────────────────────── */
const TXN_DATA = [
  { id:'TXN-849201', date:'12 Feb 2026', desc:'Vehicle Subscription',   type:'subscription', amount:-299.00, status:'completed', ref:'SUB-2026-02', customer:'Marcus Rivera',   note:'Monthly plan – Ferrari Roma'      },
  { id:'TXN-849202', date:'12 Feb 2026', desc:'Wallet Top-Up',          type:'topup',        amount:+500.00, status:'completed', ref:'PAY-GCash-88', customer:'Marcus Rivera',   note:'GCash deposit'                    },
  { id:'TXN-849203', date:'12 Feb 2026', desc:'Service Reservation',    type:'service',      amount:-120.00, status:'pending',   ref:'SRV-0248',    customer:'Sophia Navarro',  note:'Full detailing – McLaren 720S'    },
  { id:'TXN-849204', date:'10 Feb 2026', desc:'Membership Upgrade',     type:'membership',   amount:-450.00, status:'completed', ref:'MEM-GOLD-09',  customer:'James Lim',       note:'Silver → Gold tier upgrade'       },
  { id:'TXN-849205', date:'09 Feb 2026', desc:'Referral Bonus',         type:'bonus',        amount:+75.00,  status:'completed', ref:'REF-3812',    customer:'Elena Cruz',      note:'New member referral reward'        },
  { id:'TXN-849206', date:'08 Feb 2026', desc:'Vehicle Subscription',   type:'subscription', amount:-299.00, status:'completed', ref:'SUB-2026-01', customer:'James Lim',       note:'Monthly plan – Lamborghini Urus'   },
  { id:'TXN-849207', date:'07 Feb 2026', desc:'Penalty Fee',            type:'penalty',      amount:-50.00,  status:'failed',    ref:'PEN-0041',    customer:'Ryan Santos',     note:'Late return charge'                },
  { id:'TXN-849208', date:'06 Feb 2026', desc:'Wallet Top-Up',          type:'topup',        amount:+1000.00,status:'completed', ref:'PAY-BDO-22',  customer:'Elena Cruz',      note:'BDO online banking'                },
  { id:'TXN-849209', date:'05 Feb 2026', desc:'Add-On Package',         type:'addon',        amount:-89.00,  status:'pending',   ref:'ADD-GPS-07',  customer:'Sophia Navarro',  note:'GPS tracker + dashcam bundle'      },
  { id:'TXN-849210', date:'04 Feb 2026', desc:'Service Reservation',    type:'service',      amount:-200.00, status:'completed', ref:'SRV-0219',    customer:'Carl Mendoza',    note:'Engine tune-up – Porsche 911'      },
  { id:'TXN-849211', date:'03 Feb 2026', desc:'Insurance Premium',      type:'insurance',    amount:-180.00, status:'completed', ref:'INS-FEB-03',  customer:'Marcus Rivera',   note:'Monthly comprehensive coverage'    },
  { id:'TXN-849212', date:'02 Feb 2026', desc:'Wallet Top-Up',          type:'topup',        amount:+300.00, status:'completed', ref:'PAY-Maya-55', customer:'Ryan Santos',     note:'Maya wallet load'                  },
  { id:'TXN-849213', date:'01 Feb 2026', desc:'Cancellation Refund',    type:'refund',       amount:+120.00, status:'completed', ref:'REF-SRV-0211',customer:'Carl Mendoza',    note:'Service cancellation refund'       },
  { id:'TXN-849214', date:'31 Jan 2026', desc:'Membership Upgrade',     type:'membership',   amount:-650.00, status:'pending',   ref:'MEM-PLAT-01', customer:'Elena Cruz',      note:'Gold → Platinum tier upgrade'      },
  { id:'TXN-849215', date:'30 Jan 2026', desc:'Add-On Package',         type:'addon',        amount:-55.00,  status:'completed', ref:'ADD-CDW-12',  customer:'Sophia Navarro',  note:'Collision damage waiver add-on'    },
  { id:'TXN-849216', date:'29 Jan 2026', desc:'Referral Bonus',         type:'bonus',        amount:+75.00,  status:'completed', ref:'REF-4490',    customer:'Marcus Rivera',   note:'Referred: Elena Cruz'              },
  { id:'TXN-849217', date:'28 Jan 2026', desc:'Penalty Fee',            type:'penalty',      amount:-25.00,  status:'failed',    ref:'PEN-0037',    customer:'Carl Mendoza',    note:'Fuel deficit penalty'              },
  { id:'TXN-849218', date:'27 Jan 2026', desc:'Vehicle Subscription',   type:'subscription', amount:-299.00, status:'completed', ref:'SUB-JAN-27',  customer:'Ryan Santos',     note:'Monthly plan – BMW M5'             },
  { id:'TXN-849219', date:'26 Jan 2026', desc:'Insurance Premium',      type:'insurance',    amount:-180.00, status:'completed', ref:'INS-JAN-26',  customer:'James Lim',       note:'Monthly comprehensive coverage'    },
  { id:'TXN-849220', date:'25 Jan 2026', desc:'Cancellation Refund',    type:'refund',       amount:+89.00,  status:'completed', ref:'REF-ADD-05',  customer:'Ryan Santos',     note:'Add-on cancellation refund'        },
];

/* ── 2. STATE ─────────────────────────────────────────────────── */
const TXN = {
  page: 1,
  perPage: 6,
  filterType: 'all',
  filterStatus: 'all',
  filterDate: '',
  search: '',
  sortCol: 'date',
  sortDir: -1,
  detailId: null,
};

/* ── 3. HELPERS ──────────────────────────────────────────────── */
function txnFmt(n) {
  const abs = Math.abs(n).toFixed(2);
  return (n >= 0 ? '+' : '-') + '$' + parseFloat(abs).toLocaleString('en-US', { minimumFractionDigits: 2 });
}

function txnTypeIcon(type) {
  const map = {
    subscription: { icon:'fa-car',          bg:'rgba(96,165,250,.12)',  c:'#60a5fa'  },
    topup:        { icon:'fa-wallet',        bg:'rgba(16,185,129,.12)', c:'#10b981'  },
    service:      { icon:'fa-wrench',        bg:'rgba(166,127,56,.14)', c:'#D9B573'  },
    membership:   { icon:'fa-crown',         bg:'rgba(217,119,6,.12)',  c:'#f59e0b'  },
    bonus:        { icon:'fa-gift',          bg:'rgba(167,139,250,.12)',c:'#a78bfa'  },
    penalty:      { icon:'fa-exclamation-triangle', bg:'rgba(239,68,68,.12)', c:'#f87171' },
    addon:        { icon:'fa-puzzle-piece',  bg:'rgba(251,191,36,.12)', c:'#fbbf24'  },
    insurance:    { icon:'fa-shield-alt',    bg:'rgba(52,211,153,.12)', c:'#34d399'  },
    refund:       { icon:'fa-undo',          bg:'rgba(129,140,248,.12)',c:'#818cf8'  },
  };
  return map[type] || { icon:'fa-receipt', bg:'rgba(166,127,56,.12)', c:'#D9B573' };
}

function txnStatusBadge(status) {
  const map = {
    completed: { cls:'bg',  label:'Completed', dot:'#10b981' },
    pending:   { cls:'bd',  label:'Pending',   dot:'#F2DB94' },
    failed:    { cls:'br',  label:'Failed',    dot:'#f87171' },
    refunded:  { cls:'bb',  label:'Refunded',  dot:'#60a5fa' },
  };
  return map[status] || { cls:'bd', label: status, dot:'#F2DB94' };
}

function txnFiltered() {
  return TXN_DATA.filter(t => {
    if (TXN.filterType !== 'all' && t.type !== TXN.filterType) return false;
    if (TXN.filterStatus !== 'all' && t.status !== TXN.filterStatus) return false;
    if (TXN.filterDate && !t.date.toLowerCase().includes(TXN.filterDate.toLowerCase())) return false;
    if (TXN.search) {
      const q = TXN.search.toLowerCase();
      if (![t.id, t.desc, t.customer, t.ref].some(v => v.toLowerCase().includes(q))) return false;
    }
    return true;
  }).sort((a, b) => {
    if (TXN.sortCol === 'amount') return TXN.sortDir * (a.amount - b.amount);
    if (TXN.sortCol === 'date')   return TXN.sortDir * (TXN_DATA.indexOf(a) - TXN_DATA.indexOf(b));
    return TXN.sortDir * a[TXN.sortCol]?.localeCompare(b[TXN.sortCol] || '');
  });
}

function txnSummary(data) {
  const income  = data.filter(t => t.amount > 0 && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const expense = data.filter(t => t.amount < 0 && t.status === 'completed').reduce((s, t) => s + Math.abs(t.amount), 0);
  const pending = data.filter(t => t.status === 'pending').length;
  const net     = income - expense;
  return { income, expense, pending, net };
}

/* ── 4. RENDER ───────────────────────────────────────────────── */
function renderTxnPage() {
  const filtered = txnFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / TXN.perPage));
  if (TXN.page > totalPages) TXN.page = totalPages;
  const slice = filtered.slice((TXN.page - 1) * TXN.perPage, TXN.page * TXN.perPage);
  const sum = txnSummary(TXN_DATA);

  const el = document.getElementById('txnPage');
  if (!el) return;

  el.innerHTML = `
  <div style="padding:22px 24px;max-width:1200px;margin:0 auto;">

    <!-- PAGE HEADER -->
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:14px;margin-bottom:22px;">
      <div>
        <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#A67F38;font-family:'Rajdhani',sans-serif;font-weight:700;margin-bottom:4px;">Finance</div>
        <h1 style="font-family:'Barlow Condensed',sans-serif;font-size:34px;font-weight:900;line-height:1;" class="gt">Transaction History</h1>
        <p style="color:#333;font-size:12px;margin-top:4px;">All platform financial records • ${TXN_DATA.length} total entries</p>
      </div>
      <div style="display:flex;gap:9px;flex-wrap:wrap;">
        <button onclick="txnExport()" class="btn-shine btn-g" style="display:flex;align-items:center;gap:7px;padding:9px 16px;font-size:12px;">
          <i class="fas fa-download" style="font-size:10px;"></i>Export CSV
        </button>
        <button onclick="txnOpenAdd()" class="btn-gh" style="display:flex;align-items:center;gap:7px;padding:9px 16px;font-size:12px;">
          <i class="fas fa-plus" style="color:#A67F38;font-size:10px;"></i>Add Entry
        </button>
      </div>
    </div>

    <!-- STAT CARDS -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:13px;margin-bottom:22px;">
      ${[
        { label:'Total Income',  val:'+$'+sum.income.toLocaleString('en-US',{minimumFractionDigits:2}),  icon:'fa-arrow-trend-up',  color:'#10b981', bg:'rgba(16,185,129,.08)',   border:'rgba(16,185,129,.2)'  },
        { label:'Total Expense', val:'-$'+sum.expense.toLocaleString('en-US',{minimumFractionDigits:2}), icon:'fa-arrow-trend-down', color:'#f87171', bg:'rgba(239,68,68,.08)',    border:'rgba(239,68,68,.2)'   },
        { label:'Net Balance',   val:(sum.net>=0?'+':'-')+'$'+Math.abs(sum.net).toLocaleString('en-US',{minimumFractionDigits:2}), icon:'fa-scale-balanced', color:'#F2DB94', bg:'rgba(166,127,56,.1)', border:'rgba(166,127,56,.28)' },
        { label:'Pending TXNs',  val:sum.pending+' txns',                          icon:'fa-clock',       color:'#fbbf24', bg:'rgba(251,191,36,.08)',   border:'rgba(251,191,36,.2)'  },
      ].map(s => `
        <div class="sc" style="padding:16px 18px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <span style="font-size:9px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Rajdhani',sans-serif;font-weight:700;color:#2a2a2a;">${s.label}</span>
            <div style="width:34px;height:34px;border-radius:9px;background:${s.bg};border:1px solid ${s.border};display:flex;align-items:center;justify-content:center;">
              <i class="fas ${s.icon}" style="color:${s.color};font-size:13px;"></i>
            </div>
          </div>
          <div class="sc-v" style="color:${s.color};font-size:26px;">${s.val}</div>
        </div>
      `).join('')}
    </div>

    <!-- FILTER BAR -->
    <div class="card" style="padding:14px 16px;margin-bottom:16px;">
      <div style="display:flex;align-items:center;flex-wrap:wrap;gap:10px;">

        <!-- Search -->
        <div style="display:flex;align-items:center;gap:7px;background:#141414;border:1px solid rgba(166,127,56,.13);border-radius:9px;padding:7px 11px;flex:1;min-width:160px;">
          <i class="fas fa-search" style="color:#A67F38;font-size:11px;"></i>
          <input id="txnSearch" value="${TXN.search}" onkeyup="txnDoSearch(this.value)"
            placeholder="Search ID, customer, ref…"
            style="background:transparent;border:none;outline:none;color:#ccc;font-size:12.5px;font-family:'DM Sans',sans-serif;width:100%;"/>
        </div>

        <!-- Type filter -->
        <select id="txnTypeFilter" onchange="txnSetType(this.value)"
          style="background:#141414;border:1px solid rgba(166,127,56,.13);border-radius:9px;padding:7px 11px;color:#bbb;font-size:12px;font-family:'DM Sans',sans-serif;cursor:pointer;outline:none;">
          <option value="all"          ${TXN.filterType==='all'?'selected':''}>All Types</option>
          <option value="subscription" ${TXN.filterType==='subscription'?'selected':''}>Subscription</option>
          <option value="topup"        ${TXN.filterType==='topup'?'selected':''}>Top-Up</option>
          <option value="service"      ${TXN.filterType==='service'?'selected':''}>Service</option>
          <option value="membership"   ${TXN.filterType==='membership'?'selected':''}>Membership</option>
          <option value="bonus"        ${TXN.filterType==='bonus'?'selected':''}>Bonus</option>
          <option value="penalty"      ${TXN.filterType==='penalty'?'selected':''}>Penalty</option>
          <option value="addon"        ${TXN.filterType==='addon'?'selected':''}>Add-On</option>
          <option value="insurance"    ${TXN.filterType==='insurance'?'selected':''}>Insurance</option>
          <option value="refund"       ${TXN.filterType==='refund'?'selected':''}>Refund</option>
        </select>

        <!-- Status filter -->
        <select id="txnStatusFilter" onchange="txnSetStatus(this.value)"
          style="background:#141414;border:1px solid rgba(166,127,56,.13);border-radius:9px;padding:7px 11px;color:#bbb;font-size:12px;font-family:'DM Sans',sans-serif;cursor:pointer;outline:none;">
          <option value="all"       ${TXN.filterStatus==='all'?'selected':''}>All Status</option>
          <option value="completed" ${TXN.filterStatus==='completed'?'selected':''}>Completed</option>
          <option value="pending"   ${TXN.filterStatus==='pending'?'selected':''}>Pending</option>
          <option value="failed"    ${TXN.filterStatus==='failed'?'selected':''}>Failed</option>
        </select>

        <!-- Date search -->
        <div style="display:flex;align-items:center;gap:7px;background:#141414;border:1px solid rgba(166,127,56,.13);border-radius:9px;padding:7px 11px;">
          <i class="fas fa-calendar" style="color:#A67F38;font-size:11px;"></i>
          <input id="txnDateFilter" value="${TXN.filterDate}" onkeyup="txnSetDate(this.value)"
            placeholder="e.g. Feb 2026"
            style="background:transparent;border:none;outline:none;color:#ccc;font-size:12px;font-family:'DM Sans',sans-serif;width:100px;"/>
        </div>

        <!-- Result count -->
        <span style="font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:700;color:#2a2a2a;letter-spacing:1px;white-space:nowrap;">
          ${filtered.length} RESULT${filtered.length!==1?'S':''}
        </span>
      </div>
    </div>

    <!-- TABLE CARD -->
    <div class="card" style="overflow:hidden;margin-bottom:16px;">

      <!-- Top bar -->
      <div style="padding:14px 18px 13px;border-bottom:1px solid rgba(166,127,56,.07);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:7px;height:7px;border-radius:50%;background:#A67F38;animation:pulseDot 2s infinite;"></div>
          <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#A67F38;">Live Ledger</span>
        </div>
        <span style="font-size:10px;color:#252525;">Page ${TXN.page} of ${totalPages}</span>
      </div>

      <!-- Col headers -->
      <div style="display:grid;grid-template-columns:130px 1fr 1fr 130px 120px 100px;gap:0;padding:10px 18px;border-bottom:1px solid rgba(166,127,56,.06);">
        ${[
          ['date','Date'],['desc','Description'],['customer','Customer'],
          ['id','Transaction ID'],['amount','Amount'],['status','Status']
        ].map(([col,label]) => `
          <div onclick="txnSort('${col}')"
            style="font-size:9px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Rajdhani',sans-serif;font-weight:700;color:${TXN.sortCol===col?'#F2DB94':'#202020'};cursor:pointer;display:flex;align-items:center;gap:5px;user-select:none;transition:color .2s;">
            ${label}
            <i class="fas fa-${TXN.sortCol===col?(TXN.sortDir===1?'chevron-up':'chevron-down'):'sort'}"
              style="font-size:8px;opacity:${TXN.sortCol===col?1:0.25};"></i>
          </div>
        `).join('')}
      </div>

      <!-- ROWS -->
      <div>
        ${slice.length === 0 ? `
          <div style="padding:50px;text-align:center;">
            <i class="fas fa-receipt" style="font-size:32px;color:#1a1a1a;margin-bottom:12px;display:block;"></i>
            <p style="color:#252525;font-size:13px;">No transactions match your filters</p>
          </div>
        ` : slice.map((t, i) => {
          const ti = txnTypeIcon(t.type);
          const sb = txnStatusBadge(t.status);
          const amtColor = t.amount >= 0 ? '#10b981' : '#f87171';
          return `
          <div onclick="txnOpenDetail('${t.id}')"
            style="display:grid;grid-template-columns:130px 1fr 1fr 130px 120px 100px;gap:0;padding:13px 18px;
                   border-bottom:1px solid rgba(166,127,56,.04);cursor:pointer;transition:background .18s;
                   animation:fadeUp .3s ease ${i*40}ms both;"
            onmouseover="this.style.background='rgba(166,127,56,.04)'"
            onmouseout="this.style.background='transparent'">

            <!-- Date -->
            <div style="display:flex;flex-direction:column;justify-content:center;">
              <span style="font-size:12.5px;color:#ccc;">${t.date}</span>
            </div>

            <!-- Description -->
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:32px;height:32px;border-radius:9px;background:${ti.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="fas ${ti.icon}" style="color:${ti.c};font-size:12px;"></i>
              </div>
              <div>
                <div style="font-size:13px;color:#ddd;font-weight:500;">${t.desc}</div>
                <div style="font-size:10px;color:#2a2a2a;margin-top:1px;">${t.ref}</div>
              </div>
            </div>

            <!-- Customer -->
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,#A67F38,#D9B573);display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:11px;color:#080808;flex-shrink:0;">
                ${t.customer.split(' ').map(n=>n[0]).join('')}
              </div>
              <span style="font-size:12.5px;color:#888;">${t.customer}</span>
            </div>

            <!-- TXN ID -->
            <div style="display:flex;align-items:center;">
              <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:12px;color:#A67F38;letter-spacing:0.5px;">#${t.id}</span>
            </div>

            <!-- Amount -->
            <div style="display:flex;align-items:center;">
              <span style="font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:900;color:${amtColor};">
                ${txnFmt(t.amount)}
              </span>
            </div>

            <!-- Status -->
            <div style="display:flex;align-items:center;">
              <span class="b ${sb.cls}" style="display:flex;align-items:center;gap:5px;">
                <span style="width:5px;height:5px;border-radius:50%;background:${sb.dot};display:inline-block;"></span>
                ${sb.label}
              </span>
            </div>
          </div>
        `}).join('')}
      </div>

      <!-- PAGINATION -->
      <div style="padding:14px 18px;border-top:1px solid rgba(166,127,56,.07);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
        <span style="font-size:11px;color:#252525;font-family:'Rajdhani',sans-serif;letter-spacing:1px;">
          SHOWING ${Math.min((TXN.page-1)*TXN.perPage+1, filtered.length)}–${Math.min(TXN.page*TXN.perPage, filtered.length)} OF ${filtered.length}
        </span>
        <div style="display:flex;align-items:center;gap:6px;">
          <button onclick="txnSetPage(${TXN.page-1})" ${TXN.page<=1?'disabled':''} class="btn-gh"
            style="padding:6px 11px;font-size:12px;opacity:${TXN.page<=1?'.35':'1'};">
            <i class="fas fa-chevron-left" style="font-size:10px;"></i>
          </button>
          ${Array.from({length:totalPages},(_,i)=>i+1).map(p=>`
            <button onclick="txnSetPage(${p})"
              style="width:32px;height:32px;border-radius:8px;border:1px solid ${p===TXN.page?'transparent':'rgba(166,127,56,.18)'};
                     background:${p===TXN.page?'linear-gradient(135deg,#A67F38,#D9B573)':'transparent'};
                     color:${p===TXN.page?'#080808':'#555'};font-family:'Rajdhani',sans-serif;font-weight:700;
                     font-size:13px;cursor:pointer;transition:all .18s;">
              ${p}
            </button>
          `).join('')}
          <button onclick="txnSetPage(${TXN.page+1})" ${TXN.page>=totalPages?'disabled':''} class="btn-gh"
            style="padding:6px 11px;font-size:12px;opacity:${TXN.page>=totalPages?'.35':'1'};">
            <i class="fas fa-chevron-right" style="font-size:10px;"></i>
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- ── DETAIL MODAL ─────────────────────────────── -->
  <div id="txnDetailModal" class="mw ${TXN.detailId?'open':''}" onclick="if(event.target===this)txnCloseDetail()">
    <div class="mb" style="max-width:480px;padding:0;">
      <div class="mtbar"></div>
      ${txnDetailContent()}
    </div>
  </div>

  <!-- ── ADD ENTRY MODAL ──────────────────────────── -->
  <div id="txnAddModal" class="mw" onclick="if(event.target===this)txnCloseAdd()">
    <div class="mb" style="max-width:440px;padding:0;">
      <div class="mtbar"></div>
      ${txnAddForm()}
    </div>
  </div>
  `;
}

/* ── 5. DETAIL MODAL ─────────────────────────────────────────── */
function txnDetailContent() {
  if (!TXN.detailId) return '';
  const t = TXN_DATA.find(x => x.id === TXN.detailId);
  if (!t) return '';
  const ti = txnTypeIcon(t.type);
  const sb = txnStatusBadge(t.status);
  const amtColor = t.amount >= 0 ? '#10b981' : '#f87171';

  return `
    <div style="padding:28px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;">
        <div>
          <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#A67F38;font-family:'Rajdhani',sans-serif;font-weight:700;margin-bottom:3px;">Transaction Detail</div>
          <h2 style="font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;color:#fff;">#${t.id}</h2>
        </div>
        <button onclick="txnCloseDetail()" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:9px;color:#555;cursor:pointer;width:34px;height:34px;display:flex;align-items:center;justify-content:center;">
          <i class="fas fa-times" style="font-size:13px;"></i>
        </button>
      </div>

      <!-- Amount hero -->
      <div style="background:linear-gradient(135deg,rgba(166,127,56,.08),rgba(166,127,56,.02));border:1px solid rgba(166,127,56,.18);border-radius:14px;padding:20px;text-align:center;margin-bottom:18px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(166,127,56,.4),transparent);"></div>
        <div style="width:46px;height:46px;border-radius:12px;background:${ti.bg};border:1px solid ${ti.bg};display:flex;align-items:center;justify-content:center;margin:0 auto 10px;">
          <i class="fas ${ti.icon}" style="color:${ti.c};font-size:18px;"></i>
        </div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:42px;font-weight:900;color:${amtColor};line-height:1;">${txnFmt(t.amount)}</div>
        <div style="font-size:13px;color:#555;margin-top:5px;">${t.desc}</div>
        <div style="margin-top:10px;display:inline-flex;align-items:center;gap:5px;" class="b ${sb.cls}">
          <span style="width:5px;height:5px;border-radius:50%;background:${sb.dot};display:inline-block;"></span>
          ${sb.label}
        </div>
      </div>

      <!-- Info grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:18px;">
        ${[
          ['Date',         t.date,     'fa-calendar'],
          ['Customer',     t.customer, 'fa-user'],
          ['Reference',    t.ref,      'fa-hashtag'],
          ['Type',         t.type.charAt(0).toUpperCase()+t.type.slice(1), 'fa-tag'],
        ].map(([k,v,ic]) => `
          <div style="background:rgba(255,255,255,.02);border:1px solid rgba(166,127,56,.08);border-radius:10px;padding:11px 13px;">
            <div style="display:flex;align-items:center;gap:5px;margin-bottom:4px;">
              <i class="fas ${ic}" style="color:#A67F38;font-size:9px;"></i>
              <span style="font-size:8.5px;letter-spacing:2px;text-transform:uppercase;font-family:'Rajdhani',sans-serif;font-weight:700;color:#282828;">${k}</span>
            </div>
            <span style="font-size:13px;color:#ccc;">${v}</span>
          </div>
        `).join('')}
      </div>

      <!-- Note -->
      <div style="background:rgba(255,255,255,.02);border:1px solid rgba(166,127,56,.08);border-radius:10px;padding:12px 14px;margin-bottom:18px;">
        <div style="font-size:8.5px;letter-spacing:2px;text-transform:uppercase;font-family:'Rajdhani',sans-serif;font-weight:700;color:#282828;margin-bottom:5px;">NOTE</div>
        <p style="font-size:12.5px;color:#888;line-height:1.6;">${t.note}</p>
      </div>

      <div style="display:flex;gap:9px;">
        <button onclick="txnCloseDetail()" class="btn-gh" style="flex:1;padding:11px;font-size:13px;">Close</button>
        <button onclick="txnToggleStatus('${t.id}')" class="btn-shine btn-g" style="flex:1;padding:11px;font-size:13px;">
          <i class="fas fa-rotate" style="margin-right:6px;font-size:10px;"></i>Toggle Status
        </button>
      </div>
    </div>
  `;
}

/* ── 6. ADD FORM ─────────────────────────────────────────────── */
function txnAddForm() {
  return `
    <div style="padding:26px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <div>
          <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#A67F38;font-family:'Rajdhani',sans-serif;font-weight:700;margin-bottom:3px;">New Entry</div>
          <h2 style="font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;color:#fff;">Add Transaction</h2>
        </div>
        <button onclick="txnCloseAdd()" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:9px;color:#555;cursor:pointer;width:34px;height:34px;display:flex;align-items:center;justify-content:center;">
          <i class="fas fa-times" style="font-size:13px;"></i>
        </button>
      </div>

      <div style="display:flex;flex-direction:column;gap:13px;">
        <div>
          <label style="font-size:9px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Rajdhani',sans-serif;font-weight:700;color:#3a3a3a;display:block;margin-bottom:6px;">Description</label>
          <input id="txnNewDesc" class="ci" placeholder="e.g. Vehicle Subscription" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;">
          <div>
            <label style="font-size:9px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Rajdhani',sans-serif;font-weight:700;color:#3a3a3a;display:block;margin-bottom:6px;">Amount ($)</label>
            <input id="txnNewAmount" class="ci" type="number" placeholder="e.g. -299.00" />
          </div>
          <div>
            <label style="font-size:9px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Rajdhani',sans-serif;font-weight:700;color:#3a3a3a;display:block;margin-bottom:6px;">Type</label>
            <select id="txnNewType" class="ci" style="cursor:pointer;">
              <option value="subscription">Subscription</option>
              <option value="topup">Top-Up</option>
              <option value="service">Service</option>
              <option value="membership">Membership</option>
              <option value="bonus">Bonus</option>
              <option value="penalty">Penalty</option>
              <option value="addon">Add-On</option>
              <option value="insurance">Insurance</option>
              <option value="refund">Refund</option>
            </select>
          </div>
        </div>
        <div>
          <label style="font-size:9px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Rajdhani',sans-serif;font-weight:700;color:#3a3a3a;display:block;margin-bottom:6px;">Customer</label>
          <input id="txnNewCustomer" class="ci" placeholder="Full name" />
        </div>
        <div>
          <label style="font-size:9px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Rajdhani',sans-serif;font-weight:700;color:#3a3a3a;display:block;margin-bottom:6px;">Note</label>
          <input id="txnNewNote" class="ci" placeholder="Optional note" />
        </div>
      </div>

      <div style="display:flex;gap:9px;margin-top:20px;">
        <button onclick="txnCloseAdd()" class="btn-gh" style="flex:1;padding:12px;font-size:13px;">Cancel</button>
        <button onclick="txnSubmitAdd()" class="btn-shine btn-g" style="flex:1;padding:12px;font-size:13px;">
          <i class="fas fa-plus" style="margin-right:6px;font-size:10px;"></i>Add Entry
        </button>
      </div>
    </div>
  `;
}

/* ── 7. ACTIONS ──────────────────────────────────────────────── */
let _txnSearchTimer;
function txnDoSearch(v)   { clearTimeout(_txnSearchTimer); _txnSearchTimer = setTimeout(() => { TXN.search = v; TXN.page = 1; renderTxnPage(); }, 220); }
function txnSetType(v)    { TXN.filterType = v;   TXN.page = 1; renderTxnPage(); }
function txnSetStatus(v)  { TXN.filterStatus = v; TXN.page = 1; renderTxnPage(); }
function txnSetDate(v)    { TXN.filterDate = v;   TXN.page = 1; renderTxnPage(); }
function txnSetPage(p)    { const max = Math.ceil(txnFiltered().length / TXN.perPage); if (p < 1 || p > max) return; TXN.page = p; renderTxnPage(); }
function txnSort(col)     { if (TXN.sortCol === col) TXN.sortDir *= -1; else { TXN.sortCol = col; TXN.sortDir = -1; } TXN.page = 1; renderTxnPage(); }

function txnOpenDetail(id)  { TXN.detailId = id; renderTxnPage(); document.getElementById('txnDetailModal')?.classList.add('open'); }
function txnCloseDetail()   { TXN.detailId = null; document.getElementById('txnDetailModal')?.classList.remove('open'); }

function txnOpenAdd()   { document.getElementById('txnAddModal')?.classList.add('open'); }
function txnCloseAdd()  { document.getElementById('txnAddModal')?.classList.remove('open'); }

function txnToggleStatus(id) {
  const t = TXN_DATA.find(x => x.id === id); if (!t) return;
  const cycle = { completed:'pending', pending:'failed', failed:'completed' };
  t.status = cycle[t.status] || 'completed';
  txnCloseDetail();
  renderTxnPage();
  if (typeof showToast === 'function') showToast(`Status → ${t.status}`, 'ok');
}

function txnSubmitAdd() {
  const desc     = document.getElementById('txnNewDesc')?.value.trim();
  const amount   = parseFloat(document.getElementById('txnNewAmount')?.value);
  const type     = document.getElementById('txnNewType')?.value;
  const customer = document.getElementById('txnNewCustomer')?.value.trim();
  const note     = document.getElementById('txnNewNote')?.value.trim();

  if (!desc || isNaN(amount) || !customer) {
    if (typeof showToast === 'function') showToast('Please fill in all required fields', 'error');
    return;
  }
  const nextId = 'TXN-' + (849220 + TXN_DATA.length + 1);
  const now    = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  TXN_DATA.unshift({ id: nextId, date: now, desc, type, amount, status:'pending', ref:'MAN-'+Math.floor(Math.random()*9999), customer, note: note||'—' });
  txnCloseAdd();
  TXN.page = 1;
  renderTxnPage();
  if (typeof showToast === 'function') showToast('Transaction entry added!', 'ok');
}

function txnExport() {
  const data = txnFiltered();
  const header = ['Date','Description','Type','Transaction ID','Reference','Customer','Amount','Status','Note'];
  const rows   = data.map(t => [t.date, t.desc, t.type, '#'+t.id, t.ref, t.customer, txnFmt(t.amount), t.status, t.note]);
  const csv    = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob   = new Blob([csv], { type: 'text/csv' });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement('a'); a.href = url; a.download = 'rev_transactions.csv'; a.click();
  URL.revokeObjectURL(url);
  if (typeof showToast === 'function') showToast('CSV exported!', 'ok');
}

/* ── 8. NAV HOOK & INIT ──────────────────────────────────────── */
(function txnInit() {
  /* Inject the page container if it doesn't exist yet */
  if (!document.getElementById('txnPage')) {
    const div = document.createElement('div');
    div.id        = 'txnPage';
    div.className = 'page';
    const ca = document.getElementById('ca');
    if (ca) ca.appendChild(div);
  }

  /* Add sidebar nav item if sidebar exists and item not already there */
  const sbNav = document.querySelector('.sb-nav');
  if (sbNav && !document.querySelector('[data-page="transactions"]')) {
    const ni = document.createElement('div');
    ni.className = 'ni';
    ni.setAttribute('data-page', 'transactions');
    ni.setAttribute('onclick', "nav('transactions')");
    ni.innerHTML = `
      <i class="ni-off fas fa-receipt"></i>
      <i class="ni-on fas fa-receipt"></i>
      <span>Transactions</span>
    `;
    /* Insert after the first .sb-sec separator or at the top */
    const firstSec = sbNav.querySelector('.sb-sec');
    firstSec ? firstSec.after(ni) : sbNav.prepend(ni);
  }

  /* Patch the existing nav() function to handle 'transactions' */
  const _origNav = typeof nav === 'function' ? nav : null;
  window.nav = function(page) {
    if (page === 'transactions') {
      /* Hide all pages, deactivate all nav items */
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.ni').forEach(n => n.classList.remove('active'));
      /* Show txnPage */
      const tp = document.getElementById('txnPage');
      if (tp) { tp.classList.add('active'); renderTxnPage(); }
      /* Mark nav item active */
      const ni = document.querySelector('[data-page="transactions"]');
      if (ni) ni.classList.add('active');
      /* Update header title if present */
      const hdrTitle = document.getElementById('pageTitle');
      if (hdrTitle) hdrTitle.textContent = 'Transaction History';
    } else {
      if (_origNav) _origNav(page);
    }
  };
})();