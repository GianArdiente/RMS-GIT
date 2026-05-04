/* ═══════════════════
   DATA
═══════════════════ */
const TECH = { name:'Marco Lim', id:'TECH-041', initials:'ML' };

const JOBS = [
  { id:'JOB-001', customer:'Carlos Reyes',   vehicle:'Honda Civic 2020',      service:'Full Engine Tune-Up',      date:'Today', time:'10:00 AM', status:'Active'  },
  { id:'JOB-002', customer:'Sofia Cruz',     vehicle:'Toyota Vios 2022',      service:'Brake Pad Replacement',    date:'Today', time:'01:30 PM', status:'Pending' },
  { id:'JOB-003', customer:'Jay Santos',     vehicle:'Mitsubishi Montero',    service:'Oil Change + Filter',      date:'Today', time:'03:00 PM', status:'Pending' },
  { id:'JOB-004', customer:'Ana Dela Cruz',  vehicle:'Ford Ranger 2021',      service:'Suspension Check',         date:'Today', time:'04:30 PM', status:'Active'  },
  { id:'JOB-005', customer:'Ben Torres',     vehicle:'Hyundai Tucson 2019',   service:'AC System Recharge',       date:'Mar 26','time':'09:00 AM', status:'Pending' },
  { id:'JOB-006', customer:'Lia Gonzales',   vehicle:'Kia Sportage 2023',     service:'Wheel Alignment',          date:'Mar 26','time':'11:00 AM', status:'Done'    },
  { id:'JOB-007', customer:'Ryan Ocampo',    vehicle:'Suzuki Swift 2021',     service:'Battery Replacement',      date:'Mar 25','time':'10:30 AM', status:'Done'    },
  { id:'JOB-008', customer:'Mia Castillo',   vehicle:'Nissan Navara 2020',    service:'Transmission Flush',       date:'Mar 25','time':'02:00 PM', status:'Done'    },
];

const THREADS = [
  { id:1,  name:'Carlos Reyes',    initials:'CR', type:'customer', status:'online',  unread:2, time:'Just now', preview:'Is the engine done? Ill be there in 20.',          msgs: [
    { from:'them', text:'Hi Marco! Is the engine tune-up done already?', time:'10:12 AM' },
    { from:'me',   text:'Almost done sir! Around 30 more minutes.', time:'10:14 AM' },
    { from:'them', text:'Is the engine done? I\'ll be there in 20.', time:'10:28 AM' },
  ]},
  { id:2,  name:'Sofia Cruz',      initials:'SC', type:'customer', status:'away',    unread:1, time:'5 min',   preview:'Can I reschedule to 2PM?',                         msgs: [
    { from:'them', text:'Good morning! Can I reschedule my 1:30 PM to 2:00 PM?', time:'9:45 AM' },
    { from:'me',   text:'Good morning Sofia! Let me check with the front desk.', time:'9:47 AM' },
    { from:'them', text:'Can I reschedule to 2PM?', time:'9:50 AM' },
  ]},
  { id:3,  name:'Ana Dela Cruz',   initials:'AD', type:'customer', status:'offline', unread:0, time:'1 hr',    preview:'Thanks Marco! Great service as always.',           msgs: [
    { from:'them', text:'Thanks Marco! Great service as always.', time:'8:30 AM' },
    { from:'me',   text:'Thank you Ma\'am Ana! See you next visit!', time:'8:32 AM' },
  ]},
  { id:4,  name:'Ryan Santos',     initials:'RS', type:'staff',    status:'online',  unread:1, time:'12 min',  preview:'Bro may extra torque wrench ka?',                  msgs: [
    { from:'them', text:'Bro may extra torque wrench ka? Mine is missing.', time:'10:05 AM' },
    { from:'me',   text:'Haha oo may spare. Kukunin mo later?', time:'10:07 AM' },
    { from:'them', text:'Bro may extra torque wrench ka?', time:'10:18 AM' },
  ]},
  { id:5,  name:'Admin — REV HQ',  initials:'AD', type:'admin',    status:'online',  unread:1, time:'30 min',  preview:'Marco please file your weekly report by EOD.',    msgs: [
    { from:'them', text:'Good morning Marco. Please make sure all job orders today are updated in the system.', time:'8:00 AM' },
    { from:'me',   text:'Good morning! Noted po, will update as I go.', time:'8:03 AM' },
    { from:'them', text:'Marco please file your weekly report by EOD.', time:'9:58 AM' },
  ]},
];

const CAL_EVENTS = [
  { day: new Date().getDate(),   month: new Date().getMonth(), color:'#A67F38', title:'Carlos Reyes — Engine Tune-Up',   time:'10:00 AM', sub:'Honda Civic 2020'     },
  { day: new Date().getDate(),   month: new Date().getMonth(), color:'#ef4444', title:'Sofia Cruz — Brake Replacement',  time:'1:30 PM',  sub:'Toyota Vios 2022'     },
  { day: new Date().getDate(),   month: new Date().getMonth(), color:'#3b82f6', title:'Jay Santos — Oil Change',         time:'3:00 PM',  sub:'Mitsubishi Montero'   },
  { day: new Date().getDate()+2, month: new Date().getMonth(), color:'#22c55e', title:'Ben Torres — AC Recharge',        time:'9:00 AM',  sub:'Hyundai Tucson 2019'  },
  { day: new Date().getDate()+2, month: new Date().getMonth(), color:'#8b5cf6', title:'Lia Gonzales — Wheel Alignment',  time:'11:00 AM', sub:'Kia Sportage 2023'    },
  { day: new Date().getDate()+5, month: new Date().getMonth(), color:'#f59e0b', title:'Team Meeting — REV HQ',           time:'8:00 AM',  sub:'All technicians'      },
];

/* ═══════════════════
   STATE
═══════════════════ */
let miniCalDate  = new Date();
let bigCalDate   = new Date();
let activeThread = null;
let activeCat    = 'all';
let activeJobFilter = 'all';

/* ═══════════════════
   CLOCK
═══════════════════ */
function tick() {
  const now = new Date();
  document.getElementById('liveClock').textContent = now.toLocaleTimeString('en-US', { hour12:false });
}
tick(); setInterval(tick, 1000);

/* ═══════════════════
   TOAST
═══════════════════ */
function showToast(msg, type='success') {
  const stack = document.getElementById('toastStack');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = { success:'fa-check-circle', info:'fa-info-circle', warn:'fa-exclamation-triangle' };
  t.innerHTML = `<i class="fas ${icons[type]||icons.success}"></i>${msg}`;
  stack.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(20px)'; t.style.transition='.3s'; setTimeout(()=>t.remove(),300); }, 2800);
}

/* ═══════════════════
   VIEW SWITCHING
═══════════════════ */
const VIEW_META = {
  home:     { title:'Dashboard',  sub:'Overview'       },
  calendar: { title:'Calendar',   sub:'Schedule'       },
  chat:     { title:'Messages',   sub:'Conversations'  },
  jobs:     { title:'Job Orders', sub:'My Assignments' },
  profile: { title:'My Profile', sub:'Account Overview' },
  settings: { title:'Settings', sub:'Preferences' },
};

function switchView(id, triggerEl) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view'+cap(id)).classList.add('active');
  document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
  if (triggerEl) triggerEl.classList.add('active');
  const m = VIEW_META[id] || {};
  document.getElementById('tbTitle').textContent = m.title || id;
  document.getElementById('tbSub').textContent   = m.sub   || '';
  if (id === 'jobs') renderJobsView();
  if (id === 'settings') {
    setTimeout(() => {
      const defaultTab = document.querySelector('.settings-tab.active') || document.querySelector('.settings-tab');
      if (defaultTab) {
        switchSettingsTab('account', defaultTab);
      }
    }, 0);
  }
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ═══════════════════
   MINI CALENDAR
═══════════════════ */
function miniCalNav(d) { miniCalDate.setMonth(miniCalDate.getMonth()+d); renderMiniCal(); }
function renderMiniCal() {
  const y = miniCalDate.getFullYear(), m = miniCalDate.getMonth();
  const today = new Date();
  document.getElementById('miniCalMonth').textContent = miniCalDate.toLocaleString('en-US',{month:'short',year:'numeric'});
  const days  = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  const first = new Date(y,m,1).getDay();
  const total = new Date(y,m+1,0).getDate();
  const prevTotal = new Date(y,m,0).getDate();
  let html = days.map(d=>`<div class="cal-dh">${d}</div>`).join('');
  for(let i=first-1;i>=0;i--) html+=`<div class="cal-d other">${prevTotal-i}</div>`;
  for(let d=1;d<=total;d++){
    const isToday = d===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();
    const hasEv   = CAL_EVENTS.some(e=>e.day===d&&e.month===m);
    html+=`<div class="cal-d ${isToday?'today':''} ${hasEv?'has-ev':''}">${d}</div>`;
  }
  const rem = (7-(first+total)%7)%7;
  for(let d=1;d<=rem;d++) html+=`<div class="cal-d other">${d}</div>`;
  document.getElementById('miniCalGrid').innerHTML = html;
}

/* ═══════════════════
   BIG CALENDAR
═══════════════════ */
function bigCalNav(d) { bigCalDate.setMonth(bigCalDate.getMonth()+d); renderBigCal(); }
function renderBigCal() {
  const y = bigCalDate.getFullYear(), m = bigCalDate.getMonth();
  const today = new Date();
  document.getElementById('bigCalMonth').textContent = bigCalDate.toLocaleString('en-US',{month:'long',year:'numeric'});
  const days  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const first = new Date(y,m,1).getDay();
  const total = new Date(y,m+1,0).getDate();
  const prevT = new Date(y,m,0).getDate();
  let html = days.map(d=>`<div class="cal-big-dh">${d}</div>`).join('');
  for(let i=first-1;i>=0;i--){
    html+=`<div class="cal-big-d other"><div class="cal-big-num">${prevT-i}</div></div>`;
  }
  for(let d=1;d<=total;d++){
    const isToday = d===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();
    const evs = CAL_EVENTS.filter(e=>e.day===d&&e.month===m);
    let pipHtml = evs.slice(0,2).map(e=>`<div class="cal-event-pip" style="background:${e.color}22;color:${e.color};font-size:7.5px;">${e.title.split('—')[0].trim()}</div>`).join('');
    if(evs.length>2) pipHtml+=`<div style="font-size:7px;color:var(--text-4);padding:1px 4px;">+${evs.length-2} more</div>`;
    html+=`<div class="cal-big-d ${isToday?'today':''}" onclick="selectCalDay(${d},${m},${y})">
      <div class="cal-big-num">${d}</div>${pipHtml}
    </div>`;
  }
  const rem2=(7-(first+total)%7)%7;
  for(let d=1;d<=rem2;d++) html+=`<div class="cal-big-d other"><div class="cal-big-num">${d}</div></div>`;
  document.getElementById('bigCalGrid').innerHTML = html;
  selectCalDay(today.getDate(), today.getMonth(), today.getFullYear());
}

function selectCalDay(d, m, y) {
  document.querySelectorAll('.cal-big-d').forEach(el => el.classList.remove('selected'));
  const evs = CAL_EVENTS.filter(e=>e.day===d&&e.month===m);
  const list = document.getElementById('calEventList');
  const ds = new Date(y,m,d).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  list.innerHTML = `<div class="cal-selected-day">${ds}</div>`;
  if(!evs.length){
    list.innerHTML += `<div style="font-size:11px;color:var(--text-4);text-align:center;padding:20px 0;">No events scheduled</div>`;
    return;
  }
  evs.forEach(e=>{
    list.innerHTML += `<div class="cal-ev-item">
      <div class="cal-ev-color" style="background:${e.color};"></div>
      <div class="cal-ev-info">
        <div class="cal-ev-time">${e.time}</div>
        <div class="cal-ev-title">${e.title}</div>
        <div class="cal-ev-sub">${e.sub}</div>
      </div>
    </div>`;
  });
}

/* ═══════════════════
   JOBS TABLE
═══════════════════ */
function renderJobTable() {
  const tbody = document.getElementById('jobTableBody');
  tbody.innerHTML = JOBS.slice(0,6).map(j=>{
    const cls = j.status==='Active'?'status-active':j.status==='Pending'?'status-pending':'status-done';
    return `<tr class="job-row">
      <td><div class="job-id">${j.id}</div></td>
      <td><div class="job-customer">${j.customer}</div><div class="job-vehicle">${j.vehicle}</div></td>
      <td><div class="job-service">${j.service}</div></td>
      <td><div class="job-time">${j.time}</div><div style="font-size:9px;color:var(--text-4);">${j.date}</div></td>
      <td><span class="job-status ${cls}"><span class="status-dot"></span>${j.status}</span></td>
    </tr>`;
  }).join('');
}

/* ═══════════════════
   JOBS FULL VIEW
═══════════════════ */
function filterJobs(f, btn) {
  activeJobFilter = f;
  document.querySelectorAll('.jobs-filter').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderJobsView();
}
function renderJobsView() {
  const q = (document.getElementById('jobSearch')?.value||'').toLowerCase();
  let items = JOBS.filter(j=>{
    const match = activeJobFilter==='all'||j.status===activeJobFilter;
    const search = !q || j.customer.toLowerCase().includes(q) || j.service.toLowerCase().includes(q) || j.id.toLowerCase().includes(q);
    return match && search;
  });
  const tbody = document.getElementById('jobsViewBody');
  if(!tbody) return;
  tbody.innerHTML = items.map(j=>{
    const cls = j.status==='Active'?'status-active':j.status==='Pending'?'status-pending':'status-done';
    return `<tr class="job-row">
      <td style="padding:12px 14px;"><div class="job-id">${j.id}</div></td>
      <td><div class="job-customer">${j.customer}</div></td>
      <td><div class="job-vehicle">${j.vehicle}</div></td>
      <td><div class="job-service">${j.service}</div></td>
      <td><div class="job-time">${j.date} · ${j.time}</div></td>
      <td><span class="job-status ${cls}"><span class="status-dot"></span>${j.status}</span></td>
      <td>
        <button class="icon-btn" onclick="showToast('Job ${j.id} — Updated to done!','success')" title="Mark done"><i class="fas fa-check"></i></button>
      </td>
    </tr>`;
  }).join('');
}

/* ═══════════════════
   THREADS
═══════════════════ */
function threadBg(type){ return type==='customer'?'badge-customer':type==='staff'?'badge-staff':'badge-admin'; }

function renderThreads(filter='', cat='all') {
  const scroll = document.getElementById('threadScroll');
  const items  = THREADS.filter(t=>{
    const matchCat  = cat==='all'||t.type===cat;
    const matchQ    = !filter||t.name.toLowerCase().includes(filter.toLowerCase());
    return matchCat && matchQ;
  });
  scroll.innerHTML = items.map(t=>`
    <div class="thread-item ${activeThread===t.id?'active':''}" onclick="openThread(${t.id})" id="thread-${t.id}">
      <div class="thread-avatar" style="${t.type==='admin'?'background:linear-gradient(135deg,#7f1d1d,#dc2626);':t.type==='staff'?'background:linear-gradient(135deg,#A67F38,#D9B573);':''}">${t.initials}
        <div class="thread-online ${t.status}"></div>
      </div>
      <div class="thread-info">
        <div class="thread-name">${t.name}
          <span class="thread-type-badge ${threadBg(t.type)}">${t.type}</span>
          <span class="thread-time">${t.time}</span>
        </div>
        <div class="thread-preview">${t.preview}</div>
      </div>
      ${t.unread>0?`<div class="thread-unread">${t.unread}</div>`:''}
    </div>`).join('');
}

function filterThreads(q) { renderThreads(q, activeCat); }
function filterCat(cat, el) {
  activeCat = cat;
  document.querySelectorAll('.chat-cat').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  renderThreads('', cat);
}

function openThread(id) {
  activeThread = id;
  const t = THREADS.find(x=>x.id===id);
  if(!t) return;
  t.unread = 0;
  renderThreads('', activeCat);

  document.getElementById('noThread').style.display   = 'none';
  const chatActive = document.getElementById('chatActive');
  chatActive.style.display = 'flex';

  document.getElementById('chatWinName').textContent    = t.name;
  document.getElementById('chatWinAvatar').textContent  = t.initials;
  document.getElementById('chatWinAvatar').style.background = t.type==='admin'
    ? 'linear-gradient(135deg,#7f1d1d,#dc2626)'
    : t.type==='staff'
      ? 'linear-gradient(135deg,#A67F38,#D9B573)'
      : 'linear-gradient(135deg,#1e3a5f,#3b82f6)';
  document.getElementById('chatWinStatus').innerHTML = t.status==='online'
    ? `<div class="chat-win-dot"></div>Online`
    : t.status==='away'
      ? `<div class="chat-win-dot" style="background:var(--amber);animation:none;"></div>Away`
      : `<div class="chat-win-dot" style="background:var(--text-4);animation:none;"></div>Offline`;

  renderMessages(t.msgs);
}

function renderMessages(msgs) {
  const box = document.getElementById('chatMessages');
  const today = new Date().toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'});
  box.innerHTML = `<div class="chat-date-sep">${today}</div>`;
  msgs.forEach(m=>{
    const div = document.createElement('div');
    div.className = `msg ${m.from==='me'?'me':'them'}`;
    if(m.from!=='me') { const sl = document.createElement('div'); sl.className='msg-sender'; sl.textContent=THREADS.find(t=>t.id===activeThread)?.name||''; div.appendChild(sl); }
    const bubble = document.createElement('div'); bubble.className='msg-bubble'; bubble.textContent=m.text; div.appendChild(bubble);
    const meta   = document.createElement('div'); meta.className='msg-meta';   meta.textContent=m.time;  div.appendChild(meta);
    box.appendChild(div);
  });
  setTimeout(()=>{ box.scrollTop = box.scrollHeight; }, 50);
}

function sendMsg() {
  const inp = document.getElementById('chatInput');
  const txt = inp.value.trim();
  if(!txt||!activeThread) return;
  const t = THREADS.find(x=>x.id===activeThread);
  t.msgs.push({ from:'me', text:txt, time: new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) });
  inp.value='';
  renderMessages(t.msgs);
  t.preview = txt;
  renderThreads('', activeCat);

  // Simulated reply
  setTimeout(()=>{
    const replies = ['Got it, thanks!','Noted!','OK, will do.','Sure thing!','Received.','Understood, marco.'];
    t.msgs.push({ from:'them', text:replies[Math.floor(Math.random()*replies.length)], time: new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) });
    t.preview = t.msgs[t.msgs.length-1].text;
    renderMessages(t.msgs);
    renderThreads('', activeCat);
  }, 1200);
}
function switchSettingsTab(tab, el) {
  document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');

  const title = document.getElementById('settingsPanelTitle');
  const body = document.getElementById('settingsPanelBody');

  if (tab === 'account') {
    title.textContent = 'Account Settings';
    body.innerHTML = `
      <div class="settings-row">
        <div class="settings-label">Full Name</div>
        <input class="settings-input" value="Marco Lim">
      </div>
      <div class="settings-row">
        <div class="settings-label">Email</div>
        <input class="settings-input" value="marco.lim@revauto.com">
      </div>
      <div class="settings-actions">
        <button class="settings-btn">Cancel</button>
        <button class="settings-btn primary" onclick="showToast('Profile updated','success')">Save</button>
      </div>
    `;
  }

  if (tab === 'security') {
    title.textContent = 'Security Settings';
    body.innerHTML = `
      <div class="settings-row">
        <div class="settings-label">New Password</div>
        <input type="password" class="settings-input">
      </div>
      <div class="settings-row">
        <div class="settings-label">Confirm Password</div>
        <input type="password" class="settings-input">
      </div>
      <div class="settings-actions">
        <button class="settings-btn primary" onclick="showToast('Password updated','success')">Update</button>
      </div>
    `;
  }

  if (tab === 'notifications') {
    title.textContent = 'Notification Settings';
    body.innerHTML = `
      <div class="settings-toggle">
        <span>Email Notifications</span>
        <div class="toggle-switch active" onclick="this.classList.toggle('active')"></div>
      </div>
      <div class="settings-toggle">
        <span>SMS Alerts</span>
        <div class="toggle-switch" onclick="this.classList.toggle('active')"></div>
      </div>
    `;
  }

  if (tab === 'system') {
    title.textContent = 'System Preferences';
    body.innerHTML = `
      <div class="settings-toggle">
        <span>Dark Mode</span>
        <div class="toggle-switch active" onclick="this.classList.toggle('active')"></div>
      </div>
      <div class="settings-toggle">
        <span>Auto Sync Jobs</span>
        <div class="toggle-switch active" onclick="this.classList.toggle('active')"></div>
      </div>
    `;
  }
}

function logout() {
  showToast('Logging out...','warn');

  setTimeout(() => {
    window.location.href = "login.html";
  }, 800); // small delay for UX
}
/* ═══════════════════
   INIT
═══════════════════ */
renderJobTable();
renderMiniCal();
renderBigCal();
renderThreads();

// Ensure chat view tabs work
document.querySelectorAll('.cal-vt').forEach(btn=>{
  btn.addEventListener('click',function(){
    document.querySelectorAll('.cal-vt').forEach(b=>b.classList.remove('active'));
    this.classList.add('active');
    showToast(`Switched to ${this.textContent} view`,'info');
  });
});