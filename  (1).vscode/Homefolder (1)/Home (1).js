/* ══════════════════════════════════════════
   REV HOME — Home.js
   Separated module | Pure front-end logic
══════════════════════════════════════════ */

/* ═══════════════════════
   USER CONFIG
═══════════════════════ */
const USER = {
  name:     'John Doe',
  email:    'johndoe@gmail.com',
  email2:   'johndoe.alt@gmail.com',
  role:     'Customer',
  phone:    '09312345678',
  birthday: 'April 20, 1999',
  address:  'Makati City, Metro Manila',
  gender:   'Male',
  photo:    '',
};
USER.initials = USER.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

/* ═══════════════════════
   PRODUCT CATALOG DATA
═══════════════════════ */
const PRODUCTS = [
  { id:1,  name:"Cold Air Intake System",     cat:"Engine",      price:189.99, orig:249.99, stock:23,  sku:"ENG-001", badge:"HOT",  desc:"Increases airflow for max power gains. Fits most V6/V8 engines.",                img:"https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80" },
  { id:2,  name:"Performance Brake Pads",     cat:"Brakes",      price:64.99,  orig:null,   stock:45,  sku:"BRK-001", badge:null,   desc:"High-friction ceramic compound. Reduced fade & extended lifespan.",            img:"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80" },
  { id:3,  name:"LED Headlight Bulbs H4",     cat:"Electrical",  price:39.99,  orig:55.00,  stock:3,   sku:"ELC-001", badge:"SALE", desc:"6000K crisp white. 300% brighter than halogens. Plug & play.",                img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { id:4,  name:"Coilover Suspension Kit",    cat:"Suspension",  price:549.99, orig:null,   stock:8,   sku:"SUS-001", badge:"NEW",  desc:"32-way adjustable damping. Track or street tuning ready.",                    img:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80" },
  { id:5,  name:"Carbon Fibre Rear Spoiler",  cat:"Accessories", price:229.99, orig:299.00, stock:12,  sku:"ACC-001", badge:null,   desc:"Universal fit. Genuine dry carbon fibre. All hardware included.",             img:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80" },
  { id:6,  name:"Cat-Back Exhaust System",    cat:"Exhaust",     price:349.99, orig:null,   stock:6,   sku:"EXH-001", badge:null,   desc:"Stainless steel mandrel-bent. Deep, aggressive exhaust note.",               img:"https://images.unsplash.com/photo-1616455579100-2ceaa4eb7d68?w=600&q=80" },
  { id:7,  name:"High-Flow Oil Filter",       cat:"Engine",      price:18.99,  orig:null,   stock:120, sku:"ENG-002", badge:null,   desc:"Synthetic media. Traps 99.9% of particles. 10,000 mile rated.",             img:"https://images.unsplash.com/photo-1635784063388-1ff335239b40?w=600&q=80" },
  { id:8,  name:"ABS Wheel Speed Sensor",     cat:"Electrical",  price:32.50,  orig:null,   stock:0,   sku:"ELC-002", badge:null,   desc:"OEM-grade replacement. Direct fit for 2010–2020 models.",                    img:"https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80" },
  { id:9,  name:"Twin-Tube Shock Absorbers",  cat:"Suspension",  price:124.99, orig:159.99, stock:17,  sku:"SUS-002", badge:"SALE", desc:"Gas charged. Significantly improved ride quality and handling.",            img:"https://images.unsplash.com/photo-1449130534935-d2f914ded10e?w=600&q=80" },
  { id:10, name:"Microfibre Steering Cover",  cat:"Accessories", price:24.99,  orig:null,   stock:55,  sku:"ACC-002", badge:null,   desc:"Premium microfibre. Non-slip grip texture. 37–38cm diameter.",             img:"https://images.unsplash.com/photo-1537896418313-45e5e3b4eaa5?w=600&q=80" },
];

/* ═══════════════════════
   SERVICE HISTORY DATA
═══════════════════════ */
const SERVICE_HISTORY = [
  { id:'SRV-001', title:'Full Engine Tune-Up',    date:'March 8, 2024',    tech:'Marco Lim',   status:'done',      cost:2800, icon:'🔧', bg:'rgba(166,127,56,.12)', notes:'Spark plugs, air filter, throttle body clean' },
  { id:'SRV-002', title:'Brake Pad Replacement',  date:'Feb 14, 2024',     tech:'Ana Reyes',   status:'done',      cost:850,  icon:'🛑', bg:'rgba(239,68,68,.1)',   notes:'Front & rear ceramic pads, rotors resurfaced' },
  { id:'SRV-003', title:'Oil Change + Filter',    date:'Jan 30, 2024',     tech:'Marco Lim',   status:'done',      cost:380,  icon:'🛢️', bg:'rgba(16,185,129,.1)',  notes:'Synthetic 5W-30, OEM filter, 5L' },
  { id:'SRV-004', title:'Wheel Alignment',        date:'Jan 10, 2024',     tech:'Ryan Santos', status:'done',      cost:450,  icon:'⚙️', bg:'rgba(139,92,246,.1)',  notes:'4-wheel alignment, toe & camber adjusted' },
  { id:'SRV-005', title:'AC System Recharge',     date:'March 15, 2024',   tech:'Ana Reyes',   status:'pending',   cost:650,  icon:'❄️', bg:'rgba(59,130,246,.1)',  notes:'Awaiting refrigerant stock' },
  { id:'SRV-006', title:'Transmission Flush',     date:'Dec 20, 2023',     tech:'Marco Lim',   status:'done',      cost:1200, icon:'🔩', bg:'rgba(251,191,36,.1)',  notes:'Full ATF flush, 8L Dexron VI' },
  { id:'SRV-007', title:'Suspension Check',       date:'Feb 1, 2024',      tech:'Ryan Santos', status:'cancelled', cost:0,    icon:'🌀', bg:'rgba(107,114,128,.1)', notes:'Customer cancelled — rescheduled' },
];

/* ═══════════════════════
   TRANSACTION HISTORY DATA
═══════════════════════ */
const TRANSACTION_HISTORY = [
  { id:'TXN-20240308', name:'Engine Tune-Up Payment',   ref:'REV-SRV001-240308', amount:2800, type:'debit',  date:'Mar 8, 2024',  icon:'💳', bg:'rgba(166,127,56,.12)' },
  { id:'TXN-20240302', name:'Loyalty Points Redeemed',  ref:'REV-LYL-043',       amount:250,  type:'credit', date:'Mar 2, 2024',  icon:'⭐', bg:'rgba(251,191,36,.12)' },
  { id:'TXN-20240214', name:'Brake Service Payment',    ref:'REV-SRV002-240214', amount:850,  type:'debit',  date:'Feb 14, 2024', icon:'💳', bg:'rgba(239,68,68,.1)'   },
  { id:'TXN-20240130', name:'Oil Change Payment',       ref:'REV-SRV003-240130', amount:380,  type:'debit',  date:'Jan 30, 2024', icon:'💳', bg:'rgba(16,185,129,.1)'  },
  { id:'TXN-20240120', name:'Promo Credit Applied',     ref:'REV-PROMO-0120',    amount:100,  type:'credit', date:'Jan 20, 2024', icon:'🎁', bg:'rgba(139,92,246,.1)'  },
  { id:'TXN-20240110', name:'Wheel Alignment Payment',  ref:'REV-SRV004-240110', amount:450,  type:'debit',  date:'Jan 10, 2024', icon:'💳', bg:'rgba(59,130,246,.1)'  },
  { id:'TXN-20231220', name:'Transmission Flush',       ref:'REV-SRV006-231220', amount:1200, type:'debit',  date:'Dec 20, 2023', icon:'💳', bg:'rgba(251,191,36,.1)'  },
  { id:'TXN-20231210', name:'Referral Bonus Credited',  ref:'REV-REF-2023-11',   amount:200,  type:'credit', date:'Dec 10, 2023', icon:'🤝', bg:'rgba(16,185,129,.12)' },
];

/* ═══════════════════════
   NOTIFICATIONS DATA
═══════════════════════ */
const nData = [
  { id:1, icon:'fa-newspaper',            ic:'#A67F38', bg:'rgba(166,127,56,.18)', tag:'News',     read:false, text:'New Article: Oil Change Promo extended — save 20% this week!', time:'Just now'    },
  { id:2, icon:'fa-newspaper',            ic:'#D9B573', bg:'rgba(166,127,56,.12)', tag:'News',     read:false, text:'New Article: 5 Signs Your Brakes Need Immediate Attention',     time:'1 hour ago'  },
  { id:3, icon:'fa-wrench',               ic:'#d97706', bg:'rgba(217,119,6,.15)',  tag:'Booking',  read:false, text:'Your vehicle service is scheduled for tomorrow at 10:00 AM',    time:'2 hours ago' },
  { id:4, icon:'fa-check-circle',         ic:'#10b981', bg:'rgba(16,185,129,.15)', tag:'Service',  read:false, text:'Service completed! Invoice ready for download.',                 time:'5 hours ago' },
  { id:5, icon:'fa-calendar-check',       ic:'#8b5cf6', bg:'rgba(139,92,246,.15)', tag:'Reminder', read:true,  text:'Reminder: Oil change due in 500 miles',                          time:'2 days ago'  },
  { id:6, icon:'fa-exclamation-triangle', ic:'#ef4444', bg:'rgba(239,68,68,.15)',  tag:'Alert',    read:true,  text:'Urgent: Check engine light diagnostic available',                time:'3 days ago'  },
  { id:7, icon:'fa-tag',                  ic:'#F2DB94', bg:'rgba(242,219,148,.12)',tag:'Promo',    read:true,  text:'New promo: 15% off battery service — limited time only',         time:'4 days ago'  },
  { id:8, icon:'fa-star',                 ic:'#fbbf24', bg:'rgba(251,191,36,.12)', tag:'Reward',   read:true,  text:"You've earned a loyalty reward! Redeem your 500 points",         time:'1 week ago'  },
];

/* ═══════════════════════
   NEWS DATA
═══════════════════════ */
const NEWS_ITEMS = [
  { img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop', cat:'Maintenance Tips', title:'5 Signs Your Brakes Need Immediate Attention',           excerpt:'Ignoring brake issues can be dangerous. Here are the top warning signs every driver should know.', date:'March 10, 2024' },
  { img:'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop', cat:'Promo',         title:'Oil Change Special — Save 20% This Month',               excerpt:'Our most popular service is now 20% off. Book your appointment today.',                           date:'March 8, 2024'  },
  { img:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop', cat:'Industry News', title:'Electric Vehicle Servicing: What You Need to Know',       excerpt:'As EVs become mainstream, REV is now fully equipped for electric and hybrid vehicles.',           date:'March 5, 2024'  },
  { img:'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop', cat:'Tips & Tricks', title:'How to Extend Your Car Battery Life in Hot Weather',      excerpt:'Heat is the number-one killer of car batteries. Follow these simple steps to protect yours.',    date:'March 2, 2024'  },
  { img:'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop', cat:'Promo',         title:'Free Multi-Point Inspection — Limited Time',              excerpt:'Get a comprehensive 27-point vehicle inspection completely free this month.',                    date:'Feb 28, 2024'   },
  { img:'https://images.unsplash.com/photo-1632823469850-1b0fabc8e00b?w=600&h=400&fit=crop', cat:'REV Update',    title:'REV Shop Now Live — Browse Hundreds of OEM Parts',       excerpt:'Our online parts store is live! OEM and aftermarket parts, delivered fast.',                    date:'Feb 25, 2024'   },
];

/* ═══════════════════════
   CALENDAR EVENTS
═══════════════════════ */
let calDate = new Date();
const CAL_EVENTS = [
  { day: new Date().getDate(),   month: new Date().getMonth(), year: new Date().getFullYear(), label:'Oil Change — 10:00 AM',     color:'#A67F38' },
  { day: new Date().getDate()+2, month: new Date().getMonth(), year: new Date().getFullYear(), label:'Brake Check — 2:00 PM',     color:'#8b5cf6' },
  { day: new Date().getDate()+5, month: new Date().getMonth(), year: new Date().getFullYear(), label:'Battery Service — 9:30 AM', color:'#10b981' },
];

/* ═══════════════════════
   UPCOMING MODAL CONFIG
═══════════════════════ */
const upcomingData = {
  shop:     { icon:'🏪', title:'Shop',     pct:68 },
  booking:  { icon:'📅', title:'Booking',  pct:81 },
  calendar: { icon:'🗓️', title:'Calendar', pct:55 },
};

/* ════════════════════════════
   HELPERS
════════════════════════════ */
function setText(id, val)  { const el = document.getElementById(id); if (el) el.textContent = val; }
function setVal(id, val)   { const el = document.getElementById(id); if (el) el.value = val || ''; }
function setAvatar(el, initials) {
  if (!el) return;
  el.textContent = initials;
  Object.assign(el.style, {
    display:'flex', alignItems:'center', justifyContent:'center',
    fontFamily:'"Barlow Condensed",sans-serif', fontWeight:'800', color:'#000',
    background:'linear-gradient(135deg,#A67F38,#D9B573)',
  });
}
function fmtTime(d) { return d.toLocaleTimeString('en-US',{ hour:'2-digit', minute:'2-digit', hour12:true }); }

function showToast(msg, type = 'success') {
  const isErr = type === 'error';
  const t = document.createElement('div');
  t.className = 'toast-notif';
  Object.assign(t.style, {
    background: isErr ? '#1a0808' : '#0b2018',
    borderLeft: `3px solid ${isErr ? '#ef4444' : '#10b981'}`,
    color:      isErr ? '#f87171' : '#34d399',
  });
  t.innerHTML = `<i class="fas fa-${isErr ? 'exclamation-circle' : 'check-circle'}"></i>${msg}`;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = '1'; });
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2800);
}

/* ════════════════════════════
   GREETING & DATE
════════════════════════════ */
function initGreeting() {
  const hr    = new Date().getHours();
  const greet = hr < 12 ? 'Good Morning' : hr < 18 ? 'Good Afternoon' : 'Good Evening';
  setText('topbarGreet', `${greet}, ${USER.name.split(' ')[0]} 👋`);
  setText('topbarDate', new Date().toLocaleDateString('en-US',{
    weekday:'long', month:'long', day:'numeric', year:'numeric'
  }));
}

/* ════════════════════════════
   POPULATE UI
════════════════════════════ */
function populateUI() {
  setAvatar(document.getElementById('topbarAvatar'), USER.initials);
  setText('topbarName', USER.name);
  setText('topbarRole', USER.role);
  setAvatar(document.getElementById('pddAvatar'), USER.initials);
  setText('pddName',  USER.name);
  setText('pddEmail', USER.email);
}

/* ════════════════════════════
   THEME TOGGLE
════════════════════════════ */
const Theme = (() => {
  const KEY = 'rev_theme';
  let _current = 'dark';
  const ICONS = { dark:'🌙', light:'☀️' };

  function apply(theme) {
    _current = theme;
    const html = document.documentElement;
    if (theme === 'light') html.setAttribute('data-theme','light');
    else html.removeAttribute('data-theme');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = ICONS[theme === 'light' ? 'dark' : 'light'];
    try { localStorage.setItem(KEY, theme); } catch(e) {}
  }

  function toggle() {
    apply(_current === 'dark' ? 'light' : 'dark');
    showToast(`${_current === 'light' ? 'Light' : 'Dark'} mode activated`);
  }

  function init() {
    let saved = 'dark';
    try { saved = localStorage.getItem(KEY) || 'dark'; } catch(e) {}
    apply(saved);
  }

  return { toggle, init, getCurrent: () => _current };
})();

/* ════════════════════════════
   SIDEBAR
════════════════════════════ */
let sbCollapsed  = false;
let sbMobileOpen = false;

function toggleSidebarCollapse() {
  sbCollapsed = !sbCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed', sbCollapsed);
  document.getElementById('mainWrap').classList.toggle('sb-collapsed', sbCollapsed);
}
function toggleMobileSidebar() {
  sbMobileOpen = !sbMobileOpen;
  document.getElementById('sidebar').classList.toggle('mobile-open', sbMobileOpen);
  document.getElementById('sidebarOv').classList.toggle('hidden', !sbMobileOpen);
}
function closeMobileSidebar() {
  sbMobileOpen = false;
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('sidebarOv').classList.add('hidden');
}
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    document.getElementById('sidebarOv').classList.add('hidden');
    sbMobileOpen = false;
  }
});

/* ════════════════════════════
   TABS
════════════════════════════ */
const TABS = ['shop','booking','news','about'];
function setTab(name) {
  if (!TABS.includes(name)) return;
  TABS.forEach(t => {
    const pane = document.getElementById(`tab-${t}`);
    const nav  = document.getElementById(`nav-${t}`);
    if (pane) pane.classList.toggle('hidden', t !== name);
    if (nav)  nav.classList.toggle('active',  t === name);
  });
  triggerReveal();
  if (window.innerWidth < 1024) closeMobileSidebar();
}

/* ════════════════════════════
   PROFILE DROPDOWN
════════════════════════════ */
let _ddOpen    = false;
let _subOpen   = false;
let _histOpen  = false;

function toggleProfileDD() {
  _ddOpen = !_ddOpen;
  document.getElementById('profileDD').classList.toggle('open', _ddOpen);
  const chev = document.getElementById('profileDDChevron');
  if (chev) chev.style.transform = _ddOpen ? 'rotate(180deg)' : '';
}
function closeProfileDD() {
  _ddOpen = false; _subOpen = false; _histOpen = false;
  document.getElementById('profileDD').classList.remove('open');
  const chev = document.getElementById('profileDDChevron');
  if (chev) chev.style.transform = '';
  ['pddSubMenu','pddServArrow','pddHistoryMenu','pddHistoryArrow'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  });
}
function togglePDDSub() {
  _subOpen = !_subOpen;
  document.getElementById('pddSubMenu').classList.toggle('open', _subOpen);
  document.getElementById('pddServArrow').classList.toggle('open', _subOpen);
}
function togglePDDHistory() {
  _histOpen = !_histOpen;
  document.getElementById('pddHistoryMenu').classList.toggle('open', _histOpen);
  document.getElementById('pddHistoryArrow').classList.toggle('open', _histOpen);
}
document.addEventListener('click', e => {
  if (!_ddOpen) return;
  const wrap = document.getElementById('profileDDWrap');
  if (wrap && !wrap.contains(e.target)) closeProfileDD();
});

/* ════════════════════════════
   NOTIFICATIONS
════════════════════════════ */
function renderNotifs() {
  const list  = document.getElementById('nList');
  const unr   = nData.filter(n => !n.read).length;
  const badge = document.getElementById('nBadge');
  const cnt   = document.getElementById('notifCount');
  if (badge) { badge.textContent = unr; badge.style.display = unr === 0 ? 'none' : 'flex'; }
  if (cnt)   cnt.textContent = unr > 0 ? `${unr} unread` : 'All read';
  if (!list) return;
  list.innerHTML = '';
  nData.forEach(n => {
    const d = document.createElement('div');
    d.className = `ni ${n.read ? 'rd' : 'unr'}`;
    d.innerHTML = `
      <div class="ni-icon" style="background:${n.bg};">
        <i class="fas ${n.icon}" style="color:${n.ic};font-size:13px;"></i>
      </div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;">
          <span class="ni-tag" style="color:${n.read ? '#3a3a3a' : '#A67F38'};">${n.tag}</span>
          ${!n.read ? '<span style="width:5px;height:5px;border-radius:50%;background:#F2DB94;flex-shrink:0;display:inline-block;"></span>' : ''}
        </div>
        <p class="ni-text" style="color:${n.read ? 'var(--text-muted)' : 'var(--text-primary)'};">${n.text}</p>
        <span class="ni-time">${n.time}</span>
      </div>`;
    d.addEventListener('click', () => { n.read = true; renderNotifs(); });
    list.appendChild(d);
  });
}
function openNotif()      { document.getElementById('notifPanel').classList.add('open');    document.getElementById('notifOv').classList.add('open'); }
function closeNotif()     { document.getElementById('notifPanel').classList.remove('open'); document.getElementById('notifOv').classList.remove('open'); }
function markAllRead()    { nData.forEach(n => n.read = true); renderNotifs(); }
function clearAllNotifs() { if (confirm('Clear all notifications?')) { nData.length = 0; renderNotifs(); } }

/* ════════════════════════════
   TECHNICIAN + CHAT
════════════════════════════ */
let ASSIGNED_TECH = null;
const CHAT_HISTORY = [];

function renderTechBar() {
  const bar = document.getElementById('techBar'); if (!bar) return;
  if (!ASSIGNED_TECH) {
    bar.innerHTML = `
      <div class="tech-single-bar" onclick="setTab('booking');closeNotif();">
        <div class="tech-bar-avatar empty"><i class="fas fa-user-slash" style="color:#383838;font-size:15px;"></i></div>
        <div class="tech-bar-info">
          <div class="tech-bar-name" style="color:#505050;">No technician assigned</div>
          <div class="tech-bar-role">Awaiting staff assignment</div>
        </div>
        <div class="tech-bar-action">
          <button class="tech-book-btn" onclick="event.stopPropagation();setTab('booking');closeNotif();">
            <i class="fas fa-calendar-plus"></i>Book Now
          </button>
        </div>
      </div>`;
  } else {
    const t = ASSIGNED_TECH;
    bar.innerHTML = `
      <div class="tech-single-bar assigned" onclick="openChat()">
        <div class="tech-bar-avatar">${t.initials}<span class="tech-bar-online-dot"></span></div>
        <div class="tech-bar-info">
          <div class="tech-bar-name">${t.name}</div>
          <div class="tech-bar-role">${t.specialty}</div>
        </div>
        <div class="tech-bar-action">
          <button class="tech-chat-btn" onclick="event.stopPropagation();openChat();" title="Chat">
            <i class="fas fa-comment-dots"></i>
          </button>
        </div>
      </div>`;
  }
}

/* Console helpers */
function assignTech(tech) {
  ASSIGNED_TECH = tech || { name:'Marco Lim', specialty:'Engine Specialist', initials:'ML' };
  renderTechBar();
  if (CHAT_HISTORY.length === 0) {
    CHAT_HISTORY.push({ sender:'tech', text:`Hi ${USER.name.split(' ')[0]}! I'm ${ASSIGNED_TECH.name.split(' ')[0]}, your assigned technician. Feel free to message me anytime!`, time:fmtTime(new Date()) });
  }
  showToast(`Technician ${ASSIGNED_TECH.name} assigned!`);
}
function unassignTech() {
  ASSIGNED_TECH = null; CHAT_HISTORY.length = 0;
  closeChat(); renderTechBar();
  showToast('Technician unassigned.', 'error');
}

function openChat() {
  if (!ASSIGNED_TECH) return;
  closeNotif();
  setText('chatHeaderName', ASSIGNED_TECH.name);
  setText('chatHeaderSpec', ASSIGNED_TECH.specialty);
  setText('chatHeaderInitials', ASSIGNED_TECH.initials);
  renderChatMessages();
  document.getElementById('chatPanel').classList.add('open');
  document.getElementById('chatOv').classList.add('open');
  setTimeout(() => scrollChatToBottom(), 80);
}
function closeChat() {
  document.getElementById('chatPanel').classList.remove('open');
  document.getElementById('chatOv').classList.remove('open');
}
function scrollChatToBottom() {
  const msgs = document.getElementById('chatMessages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}
function renderChatMessages() {
  const container = document.getElementById('chatMessages'); if (!container) return;
  if (CHAT_HISTORY.length === 0) {
    container.innerHTML = `<div class="chat-empty"><div class="chat-empty-icon">💬</div><div style="font-size:13px;color:var(--text-muted);font-weight:600;">No messages yet</div><div style="font-size:11px;color:var(--text-dim);">Start the conversation below.</div></div>`;
    return;
  }
  container.innerHTML = '';
  const divider = document.createElement('div'); divider.className = 'chat-date-divider';
  divider.textContent = new Date().toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'});
  container.appendChild(divider);
  CHAT_HISTORY.forEach(msg => {
    const isTech = msg.sender === 'tech';
    const wrap = document.createElement('div'); wrap.className = `chat-msg ${isTech ? 'tech' : 'me'}`;
    if (isTech) { const label = document.createElement('div'); label.className = 'chat-sender-label'; label.textContent = ASSIGNED_TECH.name.split(' ')[0]; wrap.appendChild(label); }
    const bubble = document.createElement('div'); bubble.className = 'chat-bubble'; bubble.textContent = msg.text;
    const meta = document.createElement('div'); meta.className = 'chat-meta'; meta.textContent = msg.time;
    wrap.appendChild(bubble); wrap.appendChild(meta); container.appendChild(wrap);
  });
}
function sendChatMsg() {
  const input = document.getElementById('chatInput');
  const text  = input ? input.value.trim() : '';
  if (!text || !ASSIGNED_TECH) return;
  CHAT_HISTORY.push({ sender:'me', text, time:fmtTime(new Date()) });
  input.value = '';
  renderChatMessages(); scrollChatToBottom();
  const container = document.getElementById('chatMessages');
  if (container) {
    const tw = document.createElement('div'); tw.className = 'chat-msg tech'; tw.id = 'chatTypingIndicator';
    tw.innerHTML = `<div class="chat-sender-label">${ASSIGNED_TECH.name.split(' ')[0]}</div><div class="chat-typing"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
    container.appendChild(tw); scrollChatToBottom();
  }
  const replies = ["Got it! I'll check that right away.","Sure, no problem. Give me a moment.","I'll update you shortly!","Understood. Let me look into it.","Thanks for letting me know!","I'm on it — will get back to you soon.","Noted! I'll handle that for you."];
  setTimeout(() => {
    const ind = document.getElementById('chatTypingIndicator'); if (ind) ind.remove();
    CHAT_HISTORY.push({ sender:'tech', text:replies[Math.floor(Math.random() * replies.length)], time:fmtTime(new Date()) });
    renderChatMessages(); scrollChatToBottom();
  }, 1400);
}

/* ════════════════════════════
   CALENDAR
════════════════════════════ */
function openCalendar()  { renderCalendar(); document.getElementById('calPanel').classList.add('open'); document.getElementById('calOv').classList.add('open'); }
function closeCalendar() { document.getElementById('calPanel').classList.remove('open'); document.getElementById('calOv').classList.remove('open'); }
function calNav(dir) { calDate.setMonth(calDate.getMonth() + dir); renderCalendar(); }

function renderCalendar() {
  const body = document.getElementById('calBody'); if (!body) return;
  const year = calDate.getFullYear(), month = calDate.getMonth(), today = new Date();
  const monthName = calDate.toLocaleString('en-US',{month:'long',year:'numeric'});
  const firstDay  = new Date(year,month,1).getDay();
  const daysInMo  = new Date(year,month+1,0).getDate();
  const daysInPrev= new Date(year,month,0).getDate();
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  let html = `<div class="cal-month-header"><button class="cal-nav-btn" onclick="calNav(-1)"><i class="fas fa-chevron-left"></i></button><span class="cal-month-title">${monthName}</span><button class="cal-nav-btn" onclick="calNav(1)"><i class="fas fa-chevron-right"></i></button></div><div class="cal-grid">${DAYS.map(d=>`<div class="cal-day-label">${d}</div>`).join('')}`;
  for (let i = firstDay-1; i >= 0; i--) html += `<div class="cal-day other-month">${daysInPrev-i}</div>`;
  for (let d = 1; d <= daysInMo; d++) {
    const isToday = d===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
    const hasEv   = CAL_EVENTS.some(e=>e.day===d&&e.month===month&&e.year===year);
    html += `<div class="cal-day ${isToday?'today':hasEv?'has-event':''}">${d}</div>`;
  }
  const rem = (7-(firstDay+daysInMo)%7)%7;
  for (let d = 1; d <= rem; d++) html += `<div class="cal-day other-month">${d}</div>`;
  html += `</div>`;
  const upEv = CAL_EVENTS.filter(e=>e.month===month&&e.year===year).sort((a,b)=>a.day-b.day);
  if (upEv.length) {
    html += `<div class="cal-events-section"><div class="cal-events-label">Scheduled</div>`;
    upEv.forEach(e => {
      const ds = new Date(e.year,e.month,e.day).toLocaleDateString('en-US',{month:'short',day:'numeric'});
      html += `<div class="cal-event-row"><div class="cal-event-dot" style="background:${e.color};"></div><span class="cal-event-text">${e.label}</span><span class="cal-event-time">${ds}</span></div>`;
    });
    html += `</div>`;
  }
  body.innerHTML = html;
  setText('calSubtitle', monthName);
}

/* ════════════════════════════
   NEWS
════════════════════════════ */
function renderNews() {
  const grid = document.getElementById('newsGrid'); if (!grid) return;
  grid.innerHTML = '';
  NEWS_ITEMS.forEach(n => {
    const card = document.createElement('div'); card.className = 'news-card rev';
    card.innerHTML = `<img src="${n.img}" alt="${n.title}" loading="lazy"/><div class="news-card-body"><div class="news-cat">${n.cat}</div><div class="news-title">${n.title}</div><div class="news-excerpt">${n.excerpt}</div><div class="news-meta"><span class="news-date">${n.date}</span><button class="news-read-btn" onclick="showToast('Full article coming soon!')">Read More →</button></div></div>`;
    grid.appendChild(card);
  });
}

/* ════════════════════════════
   UPCOMING MODAL
════════════════════════════ */
function openUpcoming(key) {
  const d = upcomingData[key]; if (!d) return;
  setText('upcomingTitle', d.title);
  document.getElementById('upcomingIcon').textContent = d.icon;
  document.getElementById('upcomingPct').textContent  = `${d.pct}%`;
  document.getElementById('upcomingBar').style.width  = '0%';
  document.getElementById('upcomingModal').classList.add('open');
  setTimeout(() => { document.getElementById('upcomingBar').style.width = `${d.pct}%`; }, 120);
}
function closeUpcoming() { document.getElementById('upcomingModal').classList.remove('open'); }
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('upcomingModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('upcomingModal')) closeUpcoming();
  });
});

/* ════════════════════════════
   HISTORY MODAL
════════════════════════════ */
let _historyTab = 'service';

function openHistory(tab) {
  _historyTab = tab || 'service';
  closeProfileDD();
  renderHistoryModal();
  document.getElementById('historyModal').classList.add('open');
}
function closeHistory() {
  document.getElementById('historyModal').classList.remove('open');
}
function switchHistoryTab(tab) {
  _historyTab = tab;
  document.querySelectorAll('.history-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.history-tab-content').forEach(c => c.classList.toggle('active', c.id === `hist-${tab}`));
}

function renderHistoryModal() {
  const body = document.getElementById('historyBody'); if (!body) return;

  /* ─── Summary strip ─── */
  const totalSpent = TRANSACTION_HISTORY.filter(t=>t.type==='debit').reduce((s,t)=>s+t.amount,0);
  const totalSaved = TRANSACTION_HISTORY.filter(t=>t.type==='credit').reduce((s,t)=>s+t.amount,0);
  const completedServices = SERVICE_HISTORY.filter(s=>s.status==='done').length;

  /* ─── Service History HTML ─── */
  const serviceHTML = SERVICE_HISTORY.map(s => {
    const statusClass = { done:'done', pending:'pending', cancelled:'cancelled' }[s.status] || 'done';
    const statusLabel = { done:'Completed', pending:'Pending', cancelled:'Cancelled' }[s.status];
    return `
      <div class="sh-item">
        <div class="sh-icon" style="background:${s.bg};">${s.icon}</div>
        <div class="sh-info">
          <div class="sh-title">${s.title}</div>
          <div class="sh-meta">Tech: ${s.tech} &nbsp;·&nbsp; ${s.notes}</div>
          <div class="sh-tags">
            <span class="sh-tag ${statusClass}">${statusLabel}</span>
            <span class="sh-tag" style="background:rgba(166,127,56,.1);color:#A67F38;border:1px solid rgba(166,127,56,.2);">${s.id}</span>
          </div>
        </div>
        <div class="sh-right">
          ${s.cost > 0 ? `<div class="sh-cost">₱${s.cost.toLocaleString()}</div>` : `<div class="sh-cost" style="-webkit-text-fill-color:#555;">—</div>`}
          <div class="sh-date">${s.date}</div>
        </div>
      </div>`;
  }).join('');

  /* ─── Transaction History HTML ─── */
  const txHTML = TRANSACTION_HISTORY.map(t => `
    <div class="tx-item">
      <div class="tx-icon-wrap" style="background:${t.bg};">${t.icon}</div>
      <div class="tx-info">
        <div class="tx-name">${t.name}</div>
        <div class="tx-ref">${t.ref}</div>
      </div>
      <div class="tx-right">
        <div class="tx-amount ${t.type}">${t.type==='debit'?'-':'+'} ₱${t.amount.toLocaleString()}</div>
        <div class="tx-date">${t.date}</div>
      </div>
    </div>`).join('');

  body.innerHTML = `
    <div class="history-summary rev">
      <div class="hs-card">
        <div class="hs-value gt">${completedServices}</div>
        <div class="hs-label">Services Done</div>
      </div>
      <div class="hs-card">
        <div class="hs-value gt">₱${totalSpent.toLocaleString()}</div>
        <div class="hs-label">Total Spent</div>
      </div>
      <div class="hs-card">
        <div class="hs-value" style="color:#10b981;font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;">₱${totalSaved.toLocaleString()}</div>
        <div class="hs-label">Credits Earned</div>
      </div>
    </div>

    <div class="history-tabs">
      <button class="history-tab-btn ${_historyTab==='service'?'active':''}" data-tab="service" onclick="switchHistoryTab('service')">
        <i class="fas fa-wrench mr-2"></i>Service History
      </button>
      <button class="history-tab-btn ${_historyTab==='transaction'?'active':''}" data-tab="transaction" onclick="switchHistoryTab('transaction')">
        <i class="fas fa-receipt mr-2"></i>Transactions
      </button>
    </div>

    <div id="hist-service" class="history-tab-content ${_historyTab==='service'?'active':''}">
      ${serviceHTML}
    </div>
    <div id="hist-transaction" class="history-tab-content ${_historyTab==='transaction'?'active':''}">
      ${txHTML}
    </div>`;

  triggerReveal();
}

/* ════════════════════════════
   CATALOG FILTER
════════════════════════════ */
const CatalogFilter = (() => {
  let _cat = 'all';
  const FALLBACK = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80';

  function set(cat, btn) {
    _cat = cat;
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderGrid();
    document.getElementById('catalogSection')?.scrollIntoView({ behavior:'smooth', block:'start' });
  }

  function renderGrid() {
    const grid = document.getElementById('products-grid'); if (!grid) return;
    const query = (document.getElementById('catalog-search')?.value || '').toLowerCase().trim();
    const sort  = document.getElementById('catalog-sort')?.value || 'default';

    let items = PRODUCTS.filter(p => {
      const matchCat = _cat === 'all' || p.cat === _cat;
      const matchQ   = !query || p.name.toLowerCase().includes(query) || p.cat.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query);
      return matchCat && matchQ;
    });
    if (sort === 'price-asc')  items.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') items.sort((a,b) => b.price - a.price);
    if (sort === 'name')       items.sort((a,b) => a.name.localeCompare(b.name));

    if (!items.length) {
      grid.innerHTML = `<div class="no-results"><div class="big">∅</div><p style="font-size:13px;color:var(--text-dim);">No products found</p></div>`;
      return;
    }
    grid.innerHTML = items.map(p => {
      const badge   = p.badge ? `<div class="p-badge-img">${p.badge}</div>` : '';
      const origPrc = p.orig  ? `<span class="p-orig">$${p.orig.toFixed(2)}</span>` : '';
      const stockNote = p.stock === 0
        ? `<div class="p-stock-warn">✕ Out of stock</div>`
        : p.stock <= 5 ? `<div class="p-stock-warn">⚠ Only ${p.stock} remaining</div>` : '';
      const cta = p.stock > 0
        ? `<button class="add-btn" onclick="event.stopPropagation();CartDrawer.addItem(${p.id})" title="Add to cart">+</button>`
        : `<span class="out-label">Unavailable</span>`;
      return `
        <div class="p-card rev">
          <div class="p-img-wrap">
            ${badge}
            <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='${FALLBACK}'">
            <div class="p-img-overlay"></div>
            <div class="p-cat-tag">${p.cat}</div>
          </div>
          <div class="p-body">
            <div class="p-sku">${p.sku}</div>
            <div class="p-name">${p.name}</div>
            <div class="p-desc">${p.desc}</div>
            ${stockNote}
            <div class="p-footer">
              <div><span class="p-price">$${p.price.toFixed(2)}</span>${origPrc}</div>
              ${cta}
            </div>
          </div>
        </div>`;
    }).join('');
    triggerReveal();
  }

  return { set, renderGrid };
})();

function filterCatalog(cat) {
  const btn = [...document.querySelectorAll('.f-btn')].find(b => b.textContent.trim() === (cat === 'all' ? 'All' : cat));
  CatalogFilter.set(cat, btn);
}
function scrollToCatalog() {
  document.getElementById('catalogSection')?.scrollIntoView({ behavior:'smooth', block:'start' });
}

/* ════════════════════════════
   CART DRAWER
════════════════════════════ */
const CartDrawer = (() => {
  let _items = [];
  const FALLBACK = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80';

  function _find(id) { return _items.find(i => i.id === id); }
  function _updateBadge() {
    const total = _items.reduce((s,i) => s + i.qty, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) { badge.textContent = total; badge.style.display = total > 0 ? 'flex' : 'none'; }
  }
  function addItem(id) {
    const p = PRODUCTS.find(x => x.id === id); if (!p) return;
    const ex = _find(id);
    if (ex) ex.qty++; else _items.push({ ...p, qty:1 });
    _updateBadge();
    showToast(`${p.name} added to cart`);
  }
  function changeQty(id, delta) {
    const item = _find(id); if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) _items = _items.filter(i => i.id !== id);
    _updateBadge(); _renderList();
  }
  function removeItem(id) { _items = _items.filter(i => i.id !== id); _updateBadge(); _renderList(); }
  function checkout() {
    if (!_items.length) { showToast('Your cart is empty', 'error'); return; }
    showToast('Order placed — thank you!');
    _items = []; _updateBadge(); _renderList(); close();
  }
  function _renderList() {
    const list = document.getElementById('cart-list'); if (!list) return;
    if (!_items.length) {
      list.innerHTML = `<div class="cart-empty-state"><div class="cart-empty-icon">🛒</div><p style="font-size:12px;color:var(--text-dim);letter-spacing:1px;">Your cart is empty</p></div>`;
      document.getElementById('cart-total').textContent = '$0.00'; return;
    }
    list.innerHTML = _items.map(item => `
      <div class="cart-row">
        <img class="cart-row-img" src="${item.img}" alt="${item.name}" onerror="this.src='${FALLBACK}'">
        <div class="cart-row-info">
          <div class="cart-row-name">${item.name}</div>
          <div class="cart-row-price">$${(item.price * item.qty).toFixed(2)}</div>
          <div class="cart-row-qty">
            <button class="qty-b" onclick="CartDrawer.changeQty(${item.id},-1)">−</button>
            <span class="qty-n">${item.qty}</span>
            <button class="qty-b" onclick="CartDrawer.changeQty(${item.id},1)">+</button>
          </div>
        </div>
        <button class="cart-rm" onclick="CartDrawer.removeItem(${item.id})">✕</button>
      </div>`).join('');
    const total = _items.reduce((s,i) => s + i.price * i.qty, 0);
    document.getElementById('cart-total').textContent = '$' + total.toFixed(2);
  }
  function open()  { _renderList(); document.getElementById('cart-overlay').classList.add('open');    document.getElementById('cart-drawer').classList.add('open'); }
  function close() { document.getElementById('cart-overlay').classList.remove('open'); document.getElementById('cart-drawer').classList.remove('open'); }
  return { addItem, changeQty, removeItem, checkout, open, close };
})();

/* ════════════════════════════
   PROFILE CARD
════════════════════════════ */
let _pcOpen = false, _pcFlipped = false, _isEditing = false, _origVals = {};

function openProfileCard() {
  if (_pcOpen) return; _pcOpen = true; closeNotif();
  const overlay = document.getElementById('profileCardOverlay');
  const card    = document.getElementById('pcFlipCard');
  ['pcFrontImg','pcBackImg'].forEach(id => {
    const el = document.getElementById(id); if (!el) return;
    if (USER.photo) { el.src = USER.photo; el.style.display='block'; } else { el.style.display='none'; }
  });
  setText('pcFrontName',  USER.name);   setText('pcFrontRole',  USER.role);
  setText('pcBackName',   USER.name);   setText('pcBackRole',   USER.role);
  setText('pcPhone',      USER.phone);  setText('pcEmail',      USER.email);
  setText('pcMetaTimeIn', '08:00 AM');  setText('pcMetaStatus', 'Online');
  setText('pcMetaShift',  'Morning');
  setText('pcTimeIn', fmtTime(new Date()));
  setVal('pcFieldEmail',  USER.email);   setVal('pcFieldEmail2', USER.email2);
  setVal('pcFieldPhone',  USER.phone);   setVal('pcFieldBday',   USER.birthday);
  setVal('pcFieldAddr',   USER.address); setVal('pcFieldGender', USER.gender);
  _pcFlipped = false; _isEditing = false;
  card.classList.remove('flipped');
  document.getElementById('pcActionBtns').classList.add('hidden');
  setText('editBtnTxt','Edit');
  document.querySelectorAll('.pc-input').forEach(inp => { inp.disabled=true; inp.style.borderBottom=''; inp.style.color=''; });
  const scroll = document.getElementById('pcBackScroll'); if (scroll) scroll.scrollTop = 0;
  overlay.classList.add('open');
  requestAnimationFrame(() => card.classList.add('visible'));
}
function closeProfileCard() {
  if (!_pcOpen) return;
  const overlay = document.getElementById('profileCardOverlay');
  const card    = document.getElementById('pcFlipCard');
  card.classList.remove('visible');
  setTimeout(() => { overlay.classList.remove('open'); card.classList.remove('flipped'); _pcFlipped=false; _pcOpen=false; }, 380);
}
function handlePCOverlayClick(e) { if (e.target === document.getElementById('profileCardOverlay')) closeProfileCard(); }
function pcFlipToBack()  { if (!_pcFlipped) { _pcFlipped=true;  document.getElementById('pcFlipCard').classList.add('flipped');    } }
function pcFlipToFront() { if (_pcFlipped)  { _pcFlipped=false; document.getElementById('pcFlipCard').classList.remove('flipped'); } }
function toggleEdit() {
  if (!_isEditing) {
    document.querySelectorAll('.pc-input').forEach(inp => { _origVals[inp.id]=inp.value; inp.disabled=false; inp.style.color='var(--input-color)'; inp.style.borderBottom='1px solid rgba(166,127,56,.4)'; });
    document.getElementById('pcActionBtns').classList.remove('hidden');
    setText('editBtnTxt','Editing…'); _isEditing=true;
  } else { cancelEdit(); }
}
function cancelEdit() {
  document.querySelectorAll('.pc-input').forEach(inp => { if (_origVals[inp.id]!==undefined) inp.value=_origVals[inp.id]; inp.disabled=true; inp.style.color=''; inp.style.borderBottom=''; });
  document.getElementById('pcActionBtns').classList.add('hidden');
  setText('editBtnTxt','Edit'); _isEditing=false; _origVals={};
}
function saveProfileChanges() {
  USER.email    = document.getElementById('pcFieldEmail').value.trim()  || USER.email;
  USER.email2   = document.getElementById('pcFieldEmail2').value.trim();
  USER.phone    = document.getElementById('pcFieldPhone').value.trim()   || USER.phone;
  USER.birthday = document.getElementById('pcFieldBday').value.trim()    || USER.birthday;
  USER.address  = document.getElementById('pcFieldAddr').value.trim()    || USER.address;
  USER.gender   = document.getElementById('pcFieldGender').value.trim()  || USER.gender;
  document.querySelectorAll('.pc-input').forEach(inp => { inp.disabled=true; inp.style.color=''; inp.style.borderBottom=''; });
  document.getElementById('pcActionBtns').classList.add('hidden');
  setText('editBtnTxt','Edit'); _isEditing=false; _origVals={};
  showToast('Profile updated!');
  setText('pddEmail', USER.email);
}

/* ════════════════════════════
   LOGOUT
════════════════════════════ */
function handleLogout() {
  closeProfileDD();
  if (!confirm('Log out of REV?')) return;
  showToast('Logged out successfully.');
}

/* ════════════════════════════
   SCROLL REVEAL
════════════════════════════ */
function triggerReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
  }, { threshold:0.04 });
  document.querySelectorAll('.rev:not(.vis)').forEach(el => obs.observe(el));
}

/* ════════════════════════════
   INIT
════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  initGreeting();
  populateUI();
  renderNotifs();
  renderTechBar();
  renderNews();
  CatalogFilter.renderGrid();
  triggerReveal();
  setTab('shop');
});

/* ════════════════════════════
   BOOKING MODULE
   Prefixed bk* to avoid global conflicts
════════════════════════════ */
let bkCurStep = 1;
let bkSelSvc = '', bkSelSvcDesc = '', bkSelPrice = 0, bkSelTime = '';
const bkFills = { 1:'0%', 2:'33%', 3:'66%', 4:'100%', 5:'100%' };

/* ─ Stepper ─ */
function bkUpdateStepper(n) {
  [1,2,3,4].forEach(i => {
    const c = document.getElementById('bkSc'+i);
    const l = document.getElementById('bkSl'+i);
    if (!c) return;
    c.className = 'bk-s-circle' + (i===n?' active':i<n?' done':'');
    c.textContent = i<n ? '✓' : '0'+i;
    l.className = 'bk-s-label' + (i<=n?' active':'');
  });
  const fill = document.getElementById('bkStepFill');
  if (fill) fill.style.width = bkFills[n] || '100%';
}

/* ─ Navigate ─ */
function bkGoToStep(n) {
  if (n === 2 && bkCurStep === 1 && !bkSelSvc) {
    showToast('Please select a service first.','error'); return;
  }
  if (n === 3 && bkCurStep === 2) {
    const fn = document.getElementById('bkFirstName').value.trim();
    const ln = document.getElementById('bkLastName').value.trim();
    const em = document.getElementById('bkEmail').value.trim();
    const ph = document.getElementById('bkPhone').value.trim();
    const mk = document.getElementById('bkMake').value;
    const mo = document.getElementById('bkModel').value.trim();
    if (!fn||!ln||!em||!ph||!mk||!mo) { showToast('Please fill in all required fields.','error'); return; }
    if (!/^(09\d{9}|\+639\d{9})$/.test(ph)) {
      document.getElementById('bkPhone').style.borderColor='rgba(248,113,113,.6)';
      document.getElementById('bkPhoneErr').style.display='block';
      showToast('Enter a valid phone number (e.g. 09171234567).','error'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { showToast('Enter a valid email address.','error'); return; }
  }
  if (n === 4 && bkCurStep === 3) {
    const d = document.getElementById('bkDate').value;
    if (!d)       { showToast('Please select a date.','error'); return; }
    if (!bkSelTime){ showToast('Please select a time slot.','error'); return; }
    bkPopulateSummary();
  }

  const step1El = document.getElementById('bkStep1');
  if (n === 1) {
    step1El.style.display = 'block';
    ['bkStep2','bkStep3','bkStep4','bkStep5'].forEach(id => {
      const el = document.getElementById(id); if (el) el.classList.remove('active');
    });
  } else {
    step1El.style.display = 'none';
    ['bkStep2','bkStep3','bkStep4','bkStep5'].forEach(id => {
      const el = document.getElementById(id); if (el) el.classList.toggle('active', id==='bkStep'+n);
    });
  }
  bkCurStep = n;
  bkUpdateStepper(Math.min(n, 4));
  document.getElementById('tab-booking').scrollIntoView({ behavior:'smooth', block:'start' });
}

/* ─ Phone validation ─ */
function bkValidatePhone(el) {
  const val = el.value.trim();
  const err = document.getElementById('bkPhoneErr');
  const valid = /^(09\d{9}|\+639\d{9})$/.test(val);
  if (val.length > 0 && !valid) {
    el.style.borderColor='rgba(248,113,113,.6)';
    if (err) err.style.display='block';
  } else {
    el.style.borderColor='';
    if (err) err.style.display='none';
  }
}

/* ─ Select service ─ */
function bkSelectService(el, name, desc, price) {
  document.querySelectorAll('.bk-svc-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  bkSelSvc = name; bkSelSvcDesc = desc; bkSelPrice = price;
}

/* ─ Time slot ─ */
function bkPickTime(el, t) {
  document.querySelectorAll('.bk-time-slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected'); bkSelTime = t;
}

/* ─ Populate summary ─ */
function bkPopulateSummary() {
  const d  = document.getElementById('bkDate').value;
  const mk = document.getElementById('bkMake').value;
  const mo = document.getElementById('bkModel').value;
  const yr = document.getElementById('bkYear').value;
  const fn = document.getElementById('bkFirstName').value.trim();
  const ln = document.getElementById('bkLastName').value.trim();
  const fullName = [fn,ln].filter(Boolean).join(' ');

  document.getElementById('bkSumSvc').textContent     = bkSelSvc || '—';
  document.getElementById('bkSumName').textContent    = fullName || '—';
  document.getElementById('bkSumEmail').textContent   = document.getElementById('bkEmail').value || '—';
  document.getElementById('bkSumPhone').textContent   = document.getElementById('bkPhone').value || '—';
  document.getElementById('bkSumVehicle').textContent = [yr,mk,mo].filter(Boolean).join(' ') || '—';
  document.getElementById('bkSumAppt').textContent    = (d ? d+' · ':'')+( bkSelTime||'—');
  document.getElementById('bkSumTotal').textContent   = '₱'+Number(bkSelPrice).toLocaleString('en-PH',{minimumFractionDigits:2});

  const minDown = bkSelPrice * 0.5;
  document.getElementById('bkPayAmt').value = minDown;
  document.getElementById('bkMinPayDisplay').textContent = '₱'+minDown.toLocaleString('en-PH',{minimumFractionDigits:2});
  document.getElementById('bkTotalDisplay').textContent  = '₱'+Number(bkSelPrice).toLocaleString('en-PH',{minimumFractionDigits:2});
  bkUpdatePayBreakdown();
}

/* ─ Payment breakdown ─ */
function bkUpdatePayBreakdown() {
  const pay     = parseFloat(document.getElementById('bkPayAmt').value) || 0;
  const minDown = bkSelPrice * 0.5;
  const balance = Math.max(0, bkSelPrice - pay);
  const err     = document.getElementById('bkPayErr');
  if (pay > 0 && pay < minDown) err.style.display='flex';
  else err.style.display='none';
  document.getElementById('bkBreakdownPaid').textContent    = '₱'+pay.toLocaleString('en-PH',{minimumFractionDigits:2});
  document.getElementById('bkBreakdownBalance').textContent = '₱'+balance.toLocaleString('en-PH',{minimumFractionDigits:2});
  const pct = bkSelPrice > 0 ? Math.min(100,(pay/bkSelPrice)*100) : 0;
  document.getElementById('bkPayProgressBar').style.width = pct+'%';
  document.getElementById('bkPayProgressPct').textContent = Math.round(pct)+'%';
}

/* ─ Final confirm ─ */
function bkFinalConfirm() {
  const pay     = parseFloat(document.getElementById('bkPayAmt').value) || 0;
  const minDown = bkSelPrice * 0.5;
  const err     = document.getElementById('bkPayErr');
  if (pay < minDown) { err.style.display='flex'; document.getElementById('bkPayAmt').focus(); return; }
  err.style.display = 'none';

  const balance = bkSelPrice - pay;
  const ref     = 'REV-'+Math.floor(100000+Math.random()*900000);
  const fn      = document.getElementById('bkFirstName').value.trim();
  const ln      = document.getElementById('bkLastName').value.trim();
  const name    = [fn,ln].filter(Boolean).join(' ');
  const appt    = document.getElementById('bkSumAppt').textContent;

  document.getElementById('bkConfirmRef').textContent      = ref;
  document.getElementById('bkRcptRef').textContent         = ref;
  document.getElementById('bkRcptName').textContent        = name || '—';
  document.getElementById('bkRcptService').textContent     = bkSelSvc || '—';
  document.getElementById('bkRcptAppt').textContent        = appt;
  document.getElementById('bkRcptTotal').textContent       = '₱'+Number(bkSelPrice).toLocaleString('en-PH',{minimumFractionDigits:2});
  document.getElementById('bkRcptDownpayment').textContent = '₱'+pay.toLocaleString('en-PH',{minimumFractionDigits:2});
  document.getElementById('bkRcptBalance').textContent     = '₱'+balance.toLocaleString('en-PH',{minimumFractionDigits:2});
  document.getElementById('bkRcptPaidPct').textContent     = Math.round((pay/bkSelPrice)*100)+'% paid';
  document.getElementById('bkRcptBalancePct').textContent  = Math.round((balance/bkSelPrice)*100)+'% remaining';
  document.getElementById('bkRcptPaidFill').style.width    = Math.round((pay/bkSelPrice)*100)+'%';
  document.getElementById('bkRcptBalanceFill').style.width = Math.round((balance/bkSelPrice)*100)+'%';

  ['bkStep1','bkStep2','bkStep3','bkStep4'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id==='bkStep1') el.style.display='none'; else el.classList.remove('active');
  });
  const s5 = document.getElementById('bkStep5'); if (s5) s5.classList.add('active');
  bkUpdateStepper(4);
  const fill = document.getElementById('bkStepFill'); if (fill) fill.style.width='100%';
  bkCurStep = 5;
  document.getElementById('tab-booking').scrollIntoView({ behavior:'smooth', block:'start' });
}

/* ─ Reset ─ */
function bkResetAll() {
  bkSelSvc=''; bkSelSvcDesc=''; bkSelPrice=0; bkSelTime='';
  document.querySelectorAll('.bk-svc-card').forEach(c=>c.classList.remove('selected'));
  document.querySelectorAll('.bk-time-slot').forEach(s=>s.classList.remove('selected'));
  ['bkFirstName','bkLastName','bkEmail','bkPhone','bkModel','bkNotes','bkDate','bkPayAmt'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  const ph=document.getElementById('bkPhone');  if(ph) ph.style.borderColor='';
  const pe=document.getElementById('bkPhoneErr'); if(pe) pe.style.display='none';
  const mk=document.getElementById('bkMake'); if(mk) mk.value='';
  const yr=document.getElementById('bkYear'); if(yr) yr.value='';

  if (window._bkResetSplit) window._bkResetSplit();
  ['bkStep2','bkStep3','bkStep4','bkStep5'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.classList.remove('active');
  });
  const s1=document.getElementById('bkStep1'); if(s1) s1.style.display='block';
  bkCurStep=1; bkUpdateStepper(1);
  document.getElementById('tab-booking').scrollIntoView({ behavior:'smooth', block:'start' });
}

/* ─ Split animation engine ─ */
(function() {
  function initBkSplit() {
    const scene   = document.getElementById('bkSplitScene');
    const card    = document.getElementById('bkMainCard');
    const ctaBtn  = document.getElementById('bkCtaBtn');
    const shards  = document.getElementById('bkShardContainer');
    if (!scene || !card || !ctaBtn || !shards) return;

    function faceHTML() {
      return `<div class="bk-shard-inner">
        <span class="bk-mc-tag">Step 1 of 4</span>
        <h2 class="bk-mc-title">Choose<br>Your<br>Service</h2>
        <p class="bk-mc-sub">Select the care your vehicle needs from our certified services.</p>
        <div style="display:inline-flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:800;color:#000;background:linear-gradient(135deg,#A67F38,#D9B573);padding:12px 22px;border-radius:2px;">Hover to Book ↗</div>
      </div>`;
    }

    const SHARDS = [
      { clip:'polygon(0% 0%, 52% 0%, 48% 33%, 0% 36%)',    fly:'translate(-80px,-70px) rotate(-6deg)' },
      { clip:'polygon(52% 0%, 100% 0%, 100% 34%, 54% 31%)',fly:'translate(80px,-60px) rotate(5deg)'   },
      { clip:'polygon(0% 36%, 48% 33%, 54% 67%, 0% 64%)',  fly:'translate(-90px,0px) rotate(-4deg)'   },
      { clip:'polygon(54% 31%, 100% 34%, 100% 66%, 48% 69%)',fly:'translate(90px,10px) rotate(4deg)'  },
      { clip:'polygon(0% 64%, 54% 67%, 50% 100%, 0% 100%)',fly:'translate(-70px,80px) rotate(-5deg)'  },
      { clip:'polygon(50% 100%, 54% 67%, 100% 66%, 100% 100%)',fly:'translate(70px,80px) rotate(6deg)' },
    ];

    function buildShards() {
      shards.innerHTML='';
      shards.style.height = card.offsetHeight+'px';
      SHARDS.forEach((def,i)=>{
        const s = document.createElement('div');
        s.className = 'bk-shard';
        s.style.clipPath = def.clip;
        s.style.transition = `transform 0.55s cubic-bezier(.4,0,1,1) ${i*28}ms, opacity 0.55s ease ${i*28}ms`;
        s.innerHTML = faceHTML();
        shards.appendChild(s);
      });
    }

    function triggerSplit() {
      if (scene.classList.contains('split') || scene.classList.contains('splitting')) return;
      scene.classList.add('splitting');
      buildShards();
      shards.classList.add('active');
      requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
          shards.querySelectorAll('.bk-shard').forEach((s,i)=>{
            s.style.transform = SHARDS[i].fly;
            s.style.opacity   = '0';
          });
        });
      });
      setTimeout(()=>{
        shards.classList.remove('active');
        shards.innerHTML='';
        scene.classList.remove('splitting');
        scene.classList.add('split');
      }, 700);
    }

    ctaBtn.addEventListener('mouseenter', triggerSplit);

    window._bkResetSplit = function() {
      shards.classList.remove('active');
      shards.innerHTML='';
      scene.classList.remove('split','splitting');
      card.style.display='flex'; card.style.visibility='visible';
    };
  }

  // Init after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBkSplit);
  } else {
    initBkSplit();
  }
})();

/* ─ Download Receipt PDF ─ */
function bkDownloadReceipt() {
  // Load jsPDF dynamically if not present
  function doDownload() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit:'mm', format:'a5', orientation:'portrait' });
    const W = doc.internal.pageSize.getWidth();
    const gold=[217,181,115], dark=[8,8,8], muted=[90,84,68], white=[240,234,214];

    const ref    = document.getElementById('bkRcptRef').textContent;
    const name   = document.getElementById('bkRcptName').textContent;
    const svc    = document.getElementById('bkRcptService').textContent;
    const appt   = document.getElementById('bkRcptAppt').textContent;
    const total  = document.getElementById('bkRcptTotal').textContent;
    const paid   = document.getElementById('bkRcptDownpayment').textContent;
    const bal    = document.getElementById('bkRcptBalance').textContent;
    const pp     = document.getElementById('bkRcptPaidPct').textContent;
    const bp     = document.getElementById('bkRcptBalancePct').textContent;
    const now    = new Date().toLocaleString('en-PH',{dateStyle:'medium',timeStyle:'short'});

    doc.setFillColor(15,15,13); doc.rect(0,0,W,210,'F');
    doc.setFillColor(...gold);  doc.rect(0,0,W,2,'F');
    doc.setFillColor(30,30,22); doc.rect(0,2,W,28,'F');

    doc.setTextColor(...gold); doc.setFont('helvetica','bold'); doc.setFontSize(16);
    doc.text('REV AUTO REPAIR',14,14);
    doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(...muted);
    doc.text('OFFICIAL SERVICE RECEIPT',14,20); doc.text('Auto Repair Management System',14,25);
    doc.setTextColor(...gold); doc.setFont('helvetica','bold'); doc.setFontSize(8);
    doc.text(ref,W-14,14,{align:'right'});
    doc.setFont('helvetica','normal'); doc.setFontSize(6); doc.setTextColor(...muted);
    doc.text('Reference No.',W-14,20,{align:'right'});
    doc.text('Issued: '+now,W-14,25,{align:'right'});

    doc.setDrawColor(...gold); doc.setLineWidth(0.3); doc.line(14,33,W-14,33);

    let y=42;
    [['Customer',name],['Service',svc],['Appointment',appt]].forEach(([k,v])=>{
      doc.setFontSize(7); doc.setTextColor(...muted); doc.setFont('helvetica','normal');
      doc.text(k.toUpperCase(),14,y);
      doc.setTextColor(...white); doc.setFont('helvetica','bold');
      doc.text(v,W-14,y,{align:'right'}); y+=8;
    });

    doc.setLineDashPattern([1,1.5],0); doc.setDrawColor(90,84,68); doc.setLineWidth(0.2);
    doc.line(14,y+2,W-14,y+2); doc.setLineDashPattern([],0); y+=10;

    doc.setTextColor(...gold); doc.setFont('helvetica','bold'); doc.setFontSize(7);
    doc.text('PAYMENT SUMMARY',14,y); y+=8;

    const barW=W-28;
    const paidW=(parseFloat(pp)/100)*barW;
    doc.setFillColor(30,30,22); doc.roundedRect(14,y,barW,3,1.5,1.5,'F');
    doc.setFillColor(...gold); doc.roundedRect(14,y,Math.max(paidW,2),3,1.5,1.5,'F');
    doc.setFontSize(6); doc.setTextColor(...gold); doc.text(pp,14,y+7);
    doc.setTextColor(...muted); doc.text(bp,W-14,y+7,{align:'right'}); y+=14;

    const bxW=(barW-6)/3;
    [['TOTAL',total,[30,30,22],gold],['PAID',paid,[40,35,18],gold],['BALANCE',bal,[25,25,18],muted]].forEach((b,i)=>{
      const bx=14+i*(bxW+3);
      doc.setFillColor(...b[2]); doc.rect(bx,y,bxW,16,'F');
      doc.setDrawColor(...b[3]); doc.setLineWidth(0.3); doc.rect(bx,y,bxW,16);
      doc.setFontSize(5.5); doc.setFont('helvetica','normal'); doc.setTextColor(...muted);
      doc.text(b[0],bx+bxW/2,y+5,{align:'center'});
      doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(...gold);
      doc.text(b[1],bx+bxW/2,y+12,{align:'center'});
    });
    y+=24;

    doc.setFillColor(20,20,14); doc.setDrawColor(90,84,68); doc.setLineWidth(0.2);
    doc.rect(14,y,barW,14);
    doc.setFontSize(6); doc.setFont('helvetica','normal'); doc.setTextColor(...muted);
    const note='The remaining balance is due upon vehicle drop-off. Present this reference number at the service centre.';
    doc.text(doc.splitTextToSize(note,barW-8),18,y+5.5); y+=22;

    doc.setDrawColor(...gold); doc.setLineWidth(0.3); doc.line(14,y,W-14,y);
    doc.setFontSize(6); doc.setTextColor(...muted);
    doc.text('REV Auto Repair  ·  Thank you for your booking.',W/2,y+5,{align:'center'});
    doc.setFillColor(...gold); doc.rect(0,208,W,2,'F');

    doc.save('REV-Receipt-'+ref+'.pdf');
  }

  if (window.jspdf) {
    doDownload();
  } else {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s.onload = doDownload;
    document.head.appendChild(s);
    showToast('Loading PDF engine…');
  }
}

/* ─ Init booking date default ─ */
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  const bkDateEl = document.getElementById('bkDate');
  if (bkDateEl) { bkDateEl.value = today; bkDateEl.min = today; }
  bkUpdateStepper(1);
});