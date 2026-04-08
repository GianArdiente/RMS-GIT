/* ══════════════════════════════════
   DATA
══════════════════════════════════ */
const D = {
  featured: [
    {name:'Premium Oil Change',   price:'9999.99',status:'active',  imgSrc:'',stock:50},
    {name:'Brake Pad Replacement',price:'4500.00',status:'active',  imgSrc:'',stock:30},
    {name:'Engine Tune-Up',       price:'7800.00',status:'active',  imgSrc:'',stock:20},
    {name:'Battery Replacement',  price:'3200.00',status:'inactive',imgSrc:'',stock:15},
  ],
  shop: [
    {name:'Engine Oil 5W-30', price:'350', cat:'Fluid',status:'active',  stock:45,imgSrc:''},
    {name:'Brake Pads Front', price:'1200',cat:'Part', status:'active',  stock:8, imgSrc:''},
    {name:'Air Filter Premium',price:'450',cat:'Part', status:'sold-out',stock:0, imgSrc:''},
    {name:'Spark Plugs x4',   price:'800', cat:'Part', status:'active',  stock:22,imgSrc:''},
  ],
  live: [
    {label:'Toyota Camry',       status:'In Service',color:'#10b981'},
    {label:'Honda Civic',        status:'Diagnosing',color:'#A67F38'},
    {label:'Ford Ranger',        status:'Completed', color:'#F2DB94'},
    {label:'Mitsubishi Montero', status:'Waiting',   color:'#8b5cf6'},
    {label:'Kia Sportage',       status:'Invoiced',  color:'#60a5fa'},
  ],
  notifs: [
    {id:1,icon:'fa-calendar-check',      color:'#A67F38',bg:'rgba(166,127,56,.15)',text:'New booking from Maria Santos — Oil Change',     time:'Just now',  tag:'Booking',  read:false},
    {id:2,icon:'fa-exclamation-triangle',color:'#ef4444',bg:'rgba(239,68,68,.12)', text:'Low stock: Brake Pads — only 8 units left',      time:'15 min ago',tag:'Inventory',read:false},
    {id:3,icon:'fa-check-circle',        color:'#10b981',bg:'rgba(16,185,129,.12)',text:'Job Order JO-001 completed by Ricky Dela Rosa',  time:'1 hour ago',tag:'Job Order',read:false},
    {id:4,icon:'fa-newspaper',           color:'#F2DB94',bg:'rgba(242,219,148,.1)',text:'Oil Change Promo — save 20% this week!',          time:'2 hours ago',tag:'News',    read:false},
    {id:5,icon:'fa-users',               color:'#60a5fa',bg:'rgba(59,130,246,.12)',text:'5 new customers registered this week',           time:'3 hours ago',tag:'Customers',read:true},
  ],
  revenue: {
    2024:[45,60,38,72,55,88,65,79,92,68,84,95],
    2025:[52,48,70,85,63,74,90,55,80,100,76,88],
    2026:[60,72,55,90,48,95,70,85,65,78,88,102]
  }
};

/* ── TECHNICIANS ── */
let technicians = [
  {id:1, name:'Ricky Dela Rosa',  initials:'RD', role:'Engine Specialist',    status:'available', tasks:[], color:'#A67F38', gradient:'linear-gradient(135deg,#A67F38,#D9B573)', specialties:['Engine','Tune-Up','Diagnostics']},
  {id:2, name:'Carlo Bautista',   initials:'CB', role:'Brake & Suspension',   status:'busy',      tasks:[], color:'#10b981', gradient:'linear-gradient(135deg,#059669,#10b981)', specialties:['Brakes','Suspension','Alignment']},
  {id:3, name:'Jun Magtibay',     initials:'JM', role:'Electrical Tech',      status:'available', tasks:[], color:'#60a5fa', gradient:'linear-gradient(135deg,#2563eb,#60a5fa)', specialties:['Electrical','Battery','Wiring']},
  {id:4, name:'Paolo Santos',     initials:'PS', role:'General Mechanic',     status:'available', tasks:[], color:'#a78bfa', gradient:'linear-gradient(135deg,#7c3aed,#a78bfa)', specialties:['Oil Change','Filters','General']},
  {id:5, name:'Miko Reyes',       initials:'MR', role:'Transmission Expert',  status:'on-break',  tasks:[], color:'#f97316', gradient:'linear-gradient(135deg,#c2410c,#f97316)', specialties:['Transmission','Drivetrain','CVT']},
  {id:6, name:'Alvin Navarro',    initials:'AN', role:'Tire & Wheel Spec.',   status:'available', tasks:[], color:'#ec4899', gradient:'linear-gradient(135deg,#be185d,#ec4899)', specialties:['Tires','Wheels','Balancing']},
];

/* ── BOOKINGS QUEUE ── */
let bookingQueue = [
  {id:'BK-001',customer:'Maria Santos',  service:'Oil Change',     vehicle:'Toyota Camry 2020',   date:'Dec 1',time:'10:00 AM',priority:'Normal', status:'unassigned',assignedTo:null},
  {id:'BK-002',customer:'Jose Reyes',    service:'Brake Repair',   vehicle:'Honda Civic 2019',    date:'Dec 1',time:'11:30 AM',priority:'High',   status:'unassigned',assignedTo:null},
  {id:'BK-003',customer:'Ana Cruz',      service:'Engine Tune-Up', vehicle:'Ford Ranger 2021',    date:'Dec 2',time:'9:00 AM', priority:'Normal', status:'unassigned',assignedTo:null},
  {id:'BK-004',customer:'Carlos Lim',    service:'Tire Rotation',  vehicle:'Mitsubishi Montero',  date:'Dec 2',time:'2:00 PM', priority:'Low',    status:'unassigned',assignedTo:null},
  {id:'BK-005',customer:'Eva Mendoza',   service:'Battery Check',  vehicle:'Kia Sportage 2022',   date:'Dec 3',time:'10:30 AM',priority:'Urgent', status:'unassigned',assignedTo:null},
  {id:'BK-006',customer:'Luis Garcia',   service:'AC Repair',      vehicle:'Hyundai Tucson 2021', date:'Dec 3',time:'1:00 PM', priority:'Normal', status:'assigned',  assignedTo:2},
  {id:'BK-007',customer:'Rosa Flores',   service:'Wheel Alignment',vehicle:'Toyota Vios 2020',    date:'Dec 4',time:'3:00 PM', priority:'Low',    status:'assigned',  assignedTo:2},
];

let assignLog = [];
let assigningBookingId = null;
let selectedTechId = null;
let selectedPriority = 'Low';
let techFilter = 'all';

/* ══════════════════════════════════
   TECHNICIANS RENDER
══════════════════════════════════ */
const STATUS_CFG = {
  available:{ label:'Available', color:'#10b981', bg:'rgba(16,185,129,.1)', pipBg:'#10b981' },
  busy:      { label:'Busy',      color:'#f87171', bg:'rgba(239,68,68,.1)',  pipBg:'#ef4444' },
  'on-break':{ label:'On Break',  color:'#d97706', bg:'rgba(217,119,6,.1)', pipBg:'#d97706' },
};

const PRIORITY_CFG = {
  Low:    { color:'#10b981', bg:'rgba(16,185,129,.1)',  border:'rgba(16,185,129,.25)' },
  Normal: { color:'#F2DB94', bg:'rgba(166,127,56,.1)',  border:'rgba(166,127,56,.28)' },
  High:   { color:'#d97706', bg:'rgba(217,119,6,.1)',   border:'rgba(217,119,6,.25)'  },
  Urgent: { color:'#f87171', bg:'rgba(239,68,68,.1)',   border:'rgba(239,68,68,.25)'  },
};

function renderTechRoster() {
  const el = document.getElementById('techRoster'); if (!el) return;
  const filtered = techFilter === 'all' ? technicians : technicians.filter(t => t.status === techFilter);
  el.innerHTML = '';
  filtered.forEach((t, i) => {
    const sc  = STATUS_CFG[t.status] || STATUS_CFG.available;
    const tasks = bookingQueue.filter(b => b.assignedTo === t.id);
    const workload = Math.min(tasks.length / 4, 1);
    const wColor = workload > .7 ? '#f87171' : workload > .4 ? '#d97706' : '#10b981';
    const card = document.createElement('div');
    card.className = `tech-card ${t.status}`;
    card.style.cssText = `padding:16px;animation:fadeUp .35s ease ${i*.06}s both;`;
    card.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;">
        <div class="tech-avatar" style="background:${t.gradient};">
          ${t.initials}
          <div class="status-pip" style="background:${sc.pipBg};"></div>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;color:#ddd;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.name}</div>
          <div style="font-size:10px;color:#555;margin-top:2px;">${t.role}</div>
          <span style="display:inline-block;margin-top:5px;padding:2px 8px;border-radius:20px;font-family:'Rajdhani',sans-serif;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:${sc.bg};color:${sc.color};border:1px solid ${sc.color}33;">${sc.label}</span>
        </div>
      </div>

      <!-- Specialties -->
      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px;">
        ${t.specialties.map(s => `<span style="padding:2px 7px;border-radius:20px;font-family:'Rajdhani',sans-serif;font-size:8.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:rgba(166,127,56,.07);color:#5a5a5a;border:1px solid rgba(166,127,56,.12);">${s}</span>`).join('')}
      </div>

      <!-- Workload bar -->
      <div style="margin-bottom:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
          <span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;font-family:'Rajdhani',sans-serif;font-weight:700;color:#3a3a3a;">Workload</span>
          <span style="font-size:10px;font-family:'Rajdhani',sans-serif;font-weight:700;color:${wColor};">${tasks.length} task${tasks.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="workload-bar">
          <div class="workload-fill" style="width:${workload*100}%;background:${wColor};"></div>
        </div>
      </div>

      <!-- Assigned tasks -->
      <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:12px;" id="tech-tasks-${t.id}">
        ${tasks.length === 0
          ? `<div class="assignment-slot" style="text-align:center;font-size:10px;"><i class="fas fa-inbox" style="margin-right:5px;"></i>No tasks assigned</div>`
          : tasks.map(b => {
              const pc = PRIORITY_CFG[b.priority] || PRIORITY_CFG.Normal;
              return `<div class="assignment-slot filled" style="display:flex;align-items:center;justify-content:space-between;" onclick="unassignBooking(${b.id})" title="Click to unassign">
                <div style="flex:1;min-width:0;">
                  <div style="font-size:11px;font-weight:600;color:#ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.service}</div>
                  <div style="font-size:9px;color:#444;">${b.customer} · ${b.time}</div>
                </div>
                <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;margin-left:8px;">
                  <span style="padding:1px 6px;border-radius:12px;font-family:'Rajdhani',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:${pc.bg};color:${pc.color};border:1px solid ${pc.border};">${b.priority}</span>
                  <i class="fas fa-times" style="color:#2a2a2a;font-size:9px;cursor:pointer;"></i>
                </div>
              </div>`;
            }).join('')
        }
      </div>

      <!-- Assign button -->
      <button onclick="openAssignModal(null, ${t.id})" class="btn-shine btn-g" style="width:100%;padding:9px;font-size:11px;border-radius:9px;${t.status === 'busy' ? 'opacity:.6;' : ''}">
        <i class="fas fa-plus" style="margin-right:5px;font-size:10px;"></i>Assign Booking
      </button>
    `;
    el.appendChild(card);
  });
  updateTechStats();
}

function filterTechs(f) {
  techFilter = f;
  document.querySelectorAll('[data-tf]').forEach(b => {
    b.classList.toggle('active', b.dataset.tf === f);
  });
  renderTechRoster();
}

function updateTechStats() {
  const avail = technicians.filter(t => t.status === 'available').length;
  const busy  = technicians.filter(t => t.status === 'busy').length;
  const unass = bookingQueue.filter(b => b.status === 'unassigned').length;
  const ea = document.getElementById('statAvail'); if (ea) ea.textContent = avail;
  const eb = document.getElementById('statBusy');  if (eb) eb.textContent = busy;
  const eu = document.getElementById('statUnassigned'); if (eu) eu.textContent = unass;
  const et = document.getElementById('statTechs'); if (et) et.textContent = technicians.length;
}

/* ══════════════════════════════════
   BOOKING QUEUE RENDER
══════════════════════════════════ */
function renderBookingQueue() {
  const el = document.getElementById('bookingQueue'); if (!el) return;
  const qc = document.getElementById('queueCount');
  const unassigned = bookingQueue.filter(b => b.status === 'unassigned');
  if (qc) qc.textContent = `${unassigned.length} pending`;
  el.innerHTML = '';

  bookingQueue.forEach((b, i) => {
    const pc = PRIORITY_CFG[b.priority] || PRIORITY_CFG.Normal;
    const isAssigned = b.status === 'assigned';
    const tech = isAssigned ? technicians.find(t => t.id === b.assignedTo) : null;

    const chip = document.createElement('div');
    chip.className = `booking-chip ${isAssigned ? 'assigned' : ''}`;
    chip.style.animationDelay = (i * .04) + 's';
    chip.innerHTML = `
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;">
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
            <span style="font-family:'Rajdhani',sans-serif;font-weight:900;font-size:10px;letter-spacing:1.5px;color:#A67F38;">${b.id}</span>
            <span style="padding:1px 6px;border-radius:12px;font-family:'Rajdhani',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:${pc.bg};color:${pc.color};border:1px solid ${pc.border};">${b.priority}</span>
          </div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;color:#ddd;line-height:1.1;">${b.service}</div>
        </div>
        ${isAssigned
          ? `<span style="padding:2px 7px;border-radius:12px;font-family:'Rajdhani',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:rgba(16,185,129,.1);color:#10b981;border:1px solid rgba(16,185,129,.2);flex-shrink:0;">Assigned</span>`
          : `<span class="unassigned-badge" style="padding:2px 7px;border-radius:12px;font-family:'Rajdhani',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:rgba(166,127,56,.1);color:#D9B573;border:1px solid rgba(166,127,56,.25);flex-shrink:0;">Pending</span>`
        }
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
        <div style="display:flex;align-items:center;gap:4px;"><i class="fas fa-user" style="color:#3a3a3a;font-size:9px;"></i><span style="font-size:11px;color:#666;">${b.customer}</span></div>
        <div style="display:flex;align-items:center;gap:4px;"><i class="fas fa-car" style="color:#3a3a3a;font-size:9px;"></i><span style="font-size:11px;color:#555;">${b.vehicle}</span></div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:4px;"><i class="fas fa-clock" style="color:#3a3a3a;font-size:9px;"></i><span style="font-size:10px;color:#444;">${b.date} · ${b.time}</span></div>
        ${isAssigned && tech
          ? `<div style="display:flex;align-items:center;gap:5px;">
               <div style="width:18px;height:18px;border-radius:50%;background:${tech.gradient};display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:8px;font-weight:900;color:#080808;">${tech.initials}</div>
               <span style="font-size:10px;color:#A67F38;font-family:'Rajdhani',sans-serif;font-weight:700;">${tech.name.split(' ')[0]}</span>
               <button onclick="unassignBooking(${b.id})" style="padding:2px 7px;border-radius:6px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.18);color:#f87171;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:8.5px;cursor:pointer;letter-spacing:.5px;">Unassign</button>
             </div>`
          : `<button onclick="openAssignModal(${b.id}, null)" class="btn-shine btn-g" style="font-size:10px;padding:5px 11px;border-radius:7px;">
               <i class="fas fa-wrench" style="margin-right:4px;font-size:9px;"></i>Assign
             </button>`
        }
      </div>
    `;
    el.appendChild(chip);
  });
}

/* ══════════════════════════════════
   ASSIGN MODAL
══════════════════════════════════ */
function openAssignModal(bookingId, techId) {
  assigningBookingId = bookingId;
  selectedTechId = techId;
  selectedPriority = 'Normal';

  // Build booking info
  const infoEl = document.getElementById('assignBookingInfo');
  if (bookingId) {
    const b = bookingQueue.find(x => x.id === bookingId);
    if (b) {
      selectedPriority = b.priority;
      infoEl.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#3a3a3a;font-family:'Rajdhani',sans-serif;font-weight:700;margin-bottom:3px;">Booking ID</div><div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:900;color:#F2DB94;">${b.id}</div></div>
          <div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#3a3a3a;font-family:'Rajdhani',sans-serif;font-weight:700;margin-bottom:3px;">Service</div><div style="font-size:13px;font-weight:600;color:#ccc;">${b.service}</div></div>
          <div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#3a3a3a;font-family:'Rajdhani',sans-serif;font-weight:700;margin-bottom:3px;">Customer</div><div style="font-size:12px;color:#aaa;">${b.customer}</div></div>
          <div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#3a3a3a;font-family:'Rajdhani',sans-serif;font-weight:700;margin-bottom:3px;">Schedule</div><div style="font-size:12px;color:#aaa;">${b.date} · ${b.time}</div></div>
          <div style="grid-column:span 2;"><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#3a3a3a;font-family:'Rajdhani',sans-serif;font-weight:700;margin-bottom:3px;">Vehicle</div><div style="font-size:12px;color:#aaa;">${b.vehicle}</div></div>
        </div>`;
    }
  } else {
    infoEl.innerHTML = `<div style="display:flex;align-items:center;gap:8px;"><i class="fas fa-info-circle" style="color:#A67F38;font-size:13px;"></i><span style="font-size:12px;color:#777;">Select a booking from the list below to assign to this technician.</span></div>`;
  }

  // If no bookingId, show booking selector first
  // Render tech list
  const tl = document.getElementById('techSelectList');
  tl.innerHTML = '';
  technicians.forEach(t => {
    const sc = STATUS_CFG[t.status] || STATUS_CFG.available;
    const tasks = bookingQueue.filter(b => b.assignedTo === t.id).length;
    const isSelected = t.id === selectedTechId;
    const row = document.createElement('div');
    row.className = `tech-select-row ${isSelected ? 'selected' : ''}`;
    row.id = `tsr-${t.id}`;
    row.onclick = () => selectTech(t.id);
    row.innerHTML = `
      <div class="tech-avatar" style="width:38px;height:38px;border-radius:10px;background:${t.gradient};font-size:14px;position:relative;flex-shrink:0;">
        ${t.initials}
        <div class="status-pip" style="background:${sc.pipBg};"></div>
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:600;color:#ccc;">${t.name}</div>
        <div style="font-size:10px;color:#555;">${t.role}</div>
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <span style="padding:2px 7px;border-radius:12px;font-family:'Rajdhani',sans-serif;font-size:8.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:${sc.bg};color:${sc.color};border:1px solid ${sc.color}33;display:block;margin-bottom:4px;">${sc.label}</span>
        <div class="workload-bar" style="width:60px;">
          <div class="workload-fill" style="width:${Math.min(tasks/4,1)*100}%;background:${tasks>3?'#f87171':tasks>1?'#d97706':'#10b981'};"></div>
        </div>
        <div style="font-size:9px;color:#444;margin-top:2px;font-family:'Rajdhani',sans-serif;">${tasks} task${tasks!==1?'s':''}</div>
      </div>
    `;
    tl.appendChild(row);
  });

  // If specific booking, try to find unassigned ones to show
  if (!bookingId) {
    // show a booking selector above tech list
    const bSel = document.createElement('div');
    bSel.style.cssText = 'margin-bottom:16px;';
    bSel.innerHTML = `
      <div style="font-size:9px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Rajdhani',sans-serif;font-weight:700;color:#3a3a3a;margin-bottom:8px;">SELECT BOOKING</div>
      <select id="bookingSelect" class="ci" style="font-size:12px;color-scheme:dark;cursor:pointer;">
        <option value="">— Choose an unassigned booking —</option>
        ${bookingQueue.filter(b => b.status === 'unassigned').map(b => `<option value="${b.id}">${b.id} · ${b.service} — ${b.customer}</option>`).join('')}
      </select>`;
    tl.parentElement.insertBefore(bSel, tl.parentElement.querySelector('[style*="margin-bottom:20px"]'));
  }

  // Set priority buttons
  setPriority(selectedPriority);

  document.getElementById('assignNotes').value = '';
  document.getElementById('assignModal').classList.add('open');
}

function closeAssignModal() {
  document.getElementById('assignModal').classList.remove('open');
  // Remove dynamic booking selector if present
  const bSel = document.querySelector('#assignModal select[id="bookingSelect"]')?.parentElement;
  if (bSel) bSel.remove();
  assigningBookingId = null;
  selectedTechId = null;
}

function selectTech(id) {
  selectedTechId = id;
  document.querySelectorAll('.tech-select-row').forEach(r => r.classList.remove('selected'));
  const row = document.getElementById(`tsr-${id}`);
  if (row) row.classList.add('selected');
}

function setPriority(p) {
  selectedPriority = p;
  ['low','normal','high','urgent'].forEach(k => {
    const btn = document.getElementById(`pri-${k}`);
    if (!btn) return;
    btn.classList.toggle('active', k === p.toLowerCase());
  });
}

function confirmAssign() {
  let bId = assigningBookingId;

  // If came from technician card, check booking select
  if (!bId) {
    const sel = document.getElementById('bookingSelect');
    if (sel && sel.value) bId = sel.value;
  }
  if (!bId) { showToast('Please select a booking', 'error'); return; }
  if (!selectedTechId) { showToast('Please select a technician', 'error'); return; }

  const booking = bookingQueue.find(b => b.id === bId);
  const tech    = technicians.find(t => t.id === selectedTechId);
  if (!booking || !tech) return;

  const notes = document.getElementById('assignNotes')?.value.trim() || '';

  // If booking was previously assigned, unassign from old tech
  if (booking.assignedTo) {
    const oldTech = technicians.find(t => t.id === booking.assignedTo);
    if (oldTech) oldTech.status = oldTech.tasks?.length > 0 ? 'busy' : 'available';
  }

  booking.assignedTo = selectedTechId;
  booking.status     = 'assigned';
  booking.priority   = selectedPriority;
  booking.notes      = notes;

  // Update tech status
  tech.status = 'busy';

  // Log it
  assignLog.unshift({
    techName: tech.name,
    techInitials: tech.initials,
    techGradient: tech.gradient,
    bookingId: booking.id,
    service: booking.service,
    customer: booking.customer,
    priority: selectedPriority,
    notes,
    time: new Date().toLocaleTimeString('en-US', {hour12:false})
  });

  closeAssignModal();
  renderTechRoster();
  renderBookingQueue();
  renderAssignLog();
  updateTechStats();
  showToast(`${booking.id} assigned to ${tech.name.split(' ')[0]}`, 'ok');
}

function unassignBooking(bId) {
  const booking = bookingQueue.find(b => b.id === bId); if (!booking) return;
  const tech    = technicians.find(t => t.id === booking.assignedTo);

  booking.assignedTo = null;
  booking.status     = 'unassigned';

  // If tech has no more bookings, mark available
  if (tech) {
    const remaining = bookingQueue.filter(b => b.assignedTo === tech.id);
    if (remaining.length === 0) tech.status = 'available';
  }

  renderTechRoster();
  renderBookingQueue();
  updateTechStats();
  showToast('Booking unassigned', 'ok');
}

/* ══════════════════════════════════
   ASSIGNMENT LOG
══════════════════════════════════ */
function renderAssignLog() {
  const el = document.getElementById('assignLog');
  const em = document.getElementById('emptyLog');
  if (!el || !em) return;
  if (!assignLog.length) { el.style.display = 'none'; em.style.display = 'block'; return; }
  em.style.display = 'none';
  el.style.display = 'flex';
  const pc_map = {
    Low:    { color:'#10b981', bg:'rgba(16,185,129,.1)',  border:'rgba(16,185,129,.25)' },
    Normal: { color:'#F2DB94', bg:'rgba(166,127,56,.1)',  border:'rgba(166,127,56,.28)' },
    High:   { color:'#d97706', bg:'rgba(217,119,6,.1)',   border:'rgba(217,119,6,.25)'  },
    Urgent: { color:'#f87171', bg:'rgba(239,68,68,.1)',   border:'rgba(239,68,68,.25)'  },
  };
  el.innerHTML = assignLog.slice(0,15).map((log, i) => {
    const pc = pc_map[log.priority] || pc_map.Normal;
    return `<div style="background:linear-gradient(135deg,#141414,#0e0e0e);border:1px solid rgba(166,127,56,.1);border-radius:11px;padding:12px 14px;display:flex;align-items:center;gap:12px;animation:fadeUp .3s ease ${i*.04}s both;position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(166,127,56,.12),transparent);"></div>
      <div style="width:36px;height:36px;border-radius:10px;background:${log.techGradient};display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:900;color:#080808;flex-shrink:0;">${log.techInitials}</div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;flex-wrap:wrap;">
          <span style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;color:#ddd;">${log.service}</span>
          <span style="font-family:'Rajdhani',sans-serif;font-weight:900;font-size:9px;letter-spacing:1.5px;color:#A67F38;">${log.bookingId}</span>
          <span style="padding:1px 6px;border-radius:12px;font-family:'Rajdhani',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:${pc.bg};color:${pc.color};border:1px solid ${pc.border};">${log.priority}</span>
        </div>
        <div style="font-size:11px;color:#555;">Assigned to <span style="color:#D9B573;font-weight:600;">${log.techName}</span> · ${log.customer}</div>
        ${log.notes ? `<div style="font-size:10px;color:#3a3a3a;margin-top:3px;font-style:italic;">"${log.notes}"</div>` : ''}
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div style="font-size:10px;color:#2a2a2a;font-family:'Rajdhani',sans-serif;">${log.time}</div>
        <div style="display:flex;align-items:center;gap:3px;margin-top:4px;justify-content:flex-end;"><i class="fas fa-check-circle" style="color:#10b981;font-size:10px;"></i><span style="font-size:9.5px;color:#10b981;font-family:'Rajdhani',sans-serif;font-weight:700;">Assigned</span></div>
      </div>
    </div>`;
  }).join('');
}

function clearLog() {
  assignLog = [];
  renderAssignLog();
  showToast('Log cleared', 'ok');
}

/* ══════════════════════════════════
   POSTS
══════════════════════════════════ */
let posts = [
  {id:1,type:'Promotions',   title:'Summer Oil Change Deal',excerpt:'Save 20% on all oil changes this summer.',content:'Full synthetic oil change at a special summer price. Limited slots only!',image:'',featured:false,status:'live',date:'Dec 1, 2024'},
  {id:2,type:'Announcements',title:'Extended Weekend Hours',excerpt:'We are now open Sundays 8AM–5PM.',content:'REV Auto is now open every Sunday to serve you better. No appointment needed for express services.',image:'',featured:true,status:'live',date:'Nov 28, 2024'},
  {id:3,type:'News',         title:'New Technician Onboard',excerpt:'Meet our newest certified mechanic.',content:'We welcome Carlo Bautista, our new engine specialist with 5 years of experience.',image:'',featured:false,status:'draft',date:'Nov 25, 2024'},
];
let nextId = 4, activeFilter = 'all', pendingDeleteId = null, selectedImgData = null, selectedPostType = 'Promotions';

const PAGE_NAMES = {dashboard:'Dashboard',posts:'Post & Announcements',bookings:'Bookings',customers:'Customers',transactions:'Transactions',reports:'Reports',technicians:'Technicians'};

function nav(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.ni').forEach(n => n.classList.remove('active'));
  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');
  const ni = document.querySelector(`.ni[data-page="${page}"]`);
  if (ni) ni.classList.add('active');
  document.getElementById('bc').textContent = PAGE_NAMES[page] || page;
  closeSb(); closeDD();
  if (page === 'dashboard') setTimeout(() => { renderChart(); renderLive(); renderFeatGrid(); renderShopDash(); renderRecent(); }, 30);
  if (page === 'posts') { renderPostsList(); updateStats(); }
  if (page === 'technicians') { renderTechRoster(); renderBookingQueue(); renderAssignLog(); updateTechStats(); }
}

function badge(s) {
  const m = {active:'bg',inactive:'br',pending:'bd',confirmed:'bb',completed:'bg',cancelled:'br','sold-out':'br'};
  return `<span class="b ${m[s]||'bd'}">${s.charAt(0).toUpperCase()+s.slice(1).replace(/-/g,' ')}</span>`;
}
function fmt(p) { return parseFloat(p).toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2}); }
function fmtNow() { return new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }

let activeYr = 2024;
function switchYr(yr,btn) {
  activeYr=yr;
  document.querySelectorAll('.yr-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active'); renderChart();
}
function renderChart() {
  const el=document.getElementById('chartEl'); if(!el) return;
  el.innerHTML='';
  const data=D.revenue[activeYr]||D.revenue[2024];
  const max=Math.max(...data);
  data.forEach((v,i)=>{
    const col=document.createElement('div'); col.className='chcol';
    const lbl=document.createElement('div'); lbl.style.cssText='font-size:8px;font-family:Rajdhani,sans-serif;font-weight:700;color:#3a3a3a;'; lbl.textContent=v+'k';
    const bar=document.createElement('div'); bar.className='chbar'; bar.title=v+'k';
    bar.style.cssText=`width:100%;height:0;transition:height .65s cubic-bezier(.25,.46,.45,.94) ${i*.04}s;`;
    col.appendChild(lbl); col.appendChild(bar); el.appendChild(col);
    setTimeout(()=>{bar.style.height=(v/max*100)+'%';},60);
  });
}

let livePtr=0;
function renderLive() {
  const el=document.getElementById('liveEl'); if(!el) return;
  el.innerHTML='';
  const items=[...D.live.slice(livePtr),...D.live.slice(0,livePtr)].slice(0,5);
  items.forEach((it,i)=>{
    const d=document.createElement('div');
    d.style.cssText=`display:flex;align-items:center;justify-content:space-between;padding:5px 7px;border-radius:7px;background:rgba(255,255,255,.016);border:1px solid rgba(255,255,255,.03);opacity:0;transition:opacity .28s ${i*.06}s;`;
    d.innerHTML=`<div style="display:flex;align-items:center;gap:7px;"><div style="width:6px;height:6px;border-radius:50%;background:${it.color};flex-shrink:0;"></div><span style="font-size:12px;color:#888;">${it.label}</span></div><span style="font-family:Rajdhani,sans-serif;font-weight:700;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:${it.color};">${it.status}</span>`;
    el.appendChild(d);
    requestAnimationFrame(()=>{d.style.opacity='1';});
  });
}
setInterval(()=>{livePtr=(livePtr+1)%D.live.length; if(document.getElementById('page-dashboard').classList.contains('active')) renderLive();},3500);

function renderFeatGrid() {
  const g=document.getElementById('featGrid'); if(!g) return; g.innerHTML='';
  D.featured.slice(0,4).forEach(s=>{
    const d=document.createElement('div'); d.className='post-card';
    d.innerHTML=`<div style="width:100%;height:75px;background:linear-gradient(135deg,#1e1e1e,#141414);display:flex;align-items:center;justify-content:center;"><i class="fas fa-star" style="font-size:18px;color:#2a2a2a;"></i></div><div style="padding:9px;"><div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;color:#ddd;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${s.name}</div><div class="gt" style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:900;">₱${fmt(s.price)}</div></div>`;
    g.appendChild(d);
  });
}
function renderShopDash() {
  const g=document.getElementById('shopGridDash'); if(!g) return; g.innerHTML='';
  D.shop.slice(0,4).forEach(s=>{
    const d=document.createElement('div'); d.className='post-card';
    d.innerHTML=`<div style="width:100%;height:80px;background:linear-gradient(135deg,#1e1e1e,#141414);display:flex;align-items:center;justify-content:center;"><i class="fas fa-box" style="font-size:18px;color:#2a2a2a;"></i></div><div style="padding:9px;"><div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;color:#ddd;">${s.name}</div><div class="gt" style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:900;">₱${fmt(s.price)}</div><div style="font-size:9px;color:#3a3a3a;">${s.stock} in stock</div></div>`;
    g.appendChild(d);
  });
}
function renderRecent() {
  const el=document.getElementById('recentEl'); if(!el) return; el.innerHTML='';
  const icons={confirmed:'fa-check',pending:'fa-clock',completed:'fa-check-double',cancelled:'fa-times'};
  const rgb={confirmed:'59,130,246',pending:'166,127,56',completed:'16,185,129',cancelled:'239,68,68'};
  bookingQueue.slice(0,5).forEach(b=>{
    const statusKey = b.status === 'assigned' ? 'confirmed' : 'pending';
    const c=rgb[statusKey]||'166,127,56';
    const d=document.createElement('div');
    d.style.cssText='display:flex;align-items:center;gap:8px;padding:6px 7px;border-radius:8px;cursor:pointer;border:1px solid rgba(255,255,255,.03);transition:background .15s;';
    d.onmouseover=()=>d.style.background='rgba(166,127,56,.04)';
    d.onmouseout=()=>d.style.background='transparent';
    d.innerHTML=`<div style="width:26px;height:26px;border-radius:6px;background:rgba(${c},.1);border:1px solid rgba(${c},.18);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas ${icons[statusKey]||'fa-circle'}" style="font-size:9px;color:rgb(${c});"></i></div><div style="flex:1;min-width:0;"><div style="font-size:11px;font-weight:600;color:#ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.customer}</div><div style="font-size:9px;color:#2a2a2a;">${b.service}</div></div>${badge(statusKey)}`;
    el.appendChild(d);
  });
}

/* Posts */
function updateStats() {
  const live=posts.filter(p=>p.status==='live').length, sched=posts.filter(p=>p.status==='scheduled').length;
  const tEl=document.getElementById('statTotal'),lEl=document.getElementById('statLive'),sEl=document.getElementById('statScheduled');
  if(tEl) tEl.textContent=posts.length; if(lEl) lEl.textContent=live; if(sEl) sEl.textContent=sched;
}
const TYPE_CFG={Promotions:{color:'#d97706',bg:'rgba(217,119,6,.12)',icon:'fa-tag',label:'Promo'},Announcements:{color:'#10b981',bg:'rgba(16,185,129,.12)',icon:'fa-bullhorn',label:'Announcement'},News:{color:'#A67F38',bg:'rgba(166,127,56,.12)',icon:'fa-newspaper',label:'News'}};
function renderPostsList() {
  const list=document.getElementById('postsList'), empty=document.getElementById('emptyPosts');
  const q=(document.getElementById('postSearch')?.value||'').toLowerCase();
  let filtered=posts.filter(p=>{const mF=activeFilter==='all'||p.type===activeFilter; const mS=!q||p.title.toLowerCase().includes(q)||p.content.toLowerCase().includes(q); return mF&&mS;});
  if(!filtered.length){list.innerHTML='';empty.style.display='block';return;}
  empty.style.display='none';
  list.innerHTML=filtered.map((p,i)=>{
    const cfg=TYPE_CFG[p.type]||TYPE_CFG.News;
    const statusCls=p.status==='live'?'status-live':p.status==='scheduled'?'status-scheduled':'status-draft';
    return `<div class="post-row" style="animation-delay:${i*.04}s;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
        <div style="display:flex;align-items:flex-start;gap:12px;flex:1;min-width:0;">
          <div style="width:38px;height:38px;border-radius:9px;background:${cfg.bg};border:1px solid ${cfg.color}33;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas ${cfg.icon}" style="color:${cfg.color};font-size:13px;"></i></div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap;"><span style="font-family:'Rajdhani',sans-serif;font-weight:800;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:${cfg.color};">${cfg.label}</span>${p.featured?`<span style="font-family:'Rajdhani',sans-serif;font-weight:800;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#F2DB94;">★ FEATURED</span>`:''}<span class="b ${statusCls}" style="font-size:8px;">${p.status}</span></div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;color:#ddd;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.title}</div>
            <p style="font-size:11px;color:#4a4a4a;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${p.excerpt||p.content}</p>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;">
          <span style="font-size:9px;color:#2a2a2a;white-space:nowrap;">${p.date}</span>
          <div style="display:flex;gap:5px;">
            <button onclick="editPost(${p.id})" style="width:28px;height:28px;border-radius:7px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);color:#60a5fa;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-pen"></i></button>
            <button onclick="togglePostStatus(${p.id})" style="width:28px;height:28px;border-radius:7px;background:rgba(166,127,56,.08);border:1px solid rgba(166,127,56,.2);color:#D9B573;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-toggle-on"></i></button>
            <button onclick="openDeleteModal(${p.id})" style="width:28px;height:28px;border-radius:7px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);color:#f87171;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}
function filterPosts(f) {
  activeFilter=f;
  document.querySelectorAll('.filter-tab').forEach(b=>{b.classList.toggle('active',b.dataset.filter===f); if(b.dataset.filter!==f) b.style.background='transparent';});
  renderPostsList();
}
function selectType(el,type) {
  selectedPostType=type;
  document.querySelectorAll('.type-btn').forEach(b=>b.classList.remove('selected')); el.classList.add('selected');
  const hasSchedule=!!document.getElementById('scheduleDate')?.value;
  document.getElementById('pubBtnLabel').textContent=hasSchedule?'Schedule Post':'Publish Now';
}
function updateCharCount(inputId,countId,max) {
  const el=document.getElementById(inputId); if(!el) return;
  const len=el.value.length; const span=document.getElementById(countId); if(!span) return;
  span.textContent=`${len}/${max}`; span.className='char-count '+(len>max*.85?len>max*.95?'char-over':'char-warn':'char-ok');
}
function syncToggle(cb) {
  const track=document.getElementById('toggleTrack'), knob=document.getElementById('toggleKnob');
  if(cb.checked){track.style.background='linear-gradient(135deg,#A67F38,#D9B573)';knob.style.left='22px';}
  else{track.style.background='rgba(255,255,255,.08)';knob.style.left='2px';}
}
function publishPost() {
  const title=document.getElementById('postTitle')?.value.trim(), content=document.getElementById('postContent')?.value.trim();
  if(!title){showToast('Please enter a title','error');return;} if(!content){showToast('Please enter content','error');return;}
  const schedDt=document.getElementById('scheduleDate')?.value, status=schedDt?'scheduled':'live';
  posts.unshift({id:nextId++,type:selectedPostType,title,content,excerpt:document.getElementById('postExcerpt')?.value.trim()||content.substring(0,120),image:selectedImgData||'',featured:document.getElementById('isFeatured')?.checked||false,status,date:fmtNow()});
  clearForm(); renderPostsList(); updateStats();
  document.getElementById('successTitle').textContent=status==='scheduled'?'Post Scheduled!':'Post Published!';
  document.getElementById('successSub').textContent=status==='scheduled'?'Your post is scheduled.':'Your post is now live.';
  document.getElementById('successModal').classList.add('open');
}
function saveDraft() {
  const title=document.getElementById('postTitle')?.value.trim();
  if(!title){showToast('Please enter a title to save draft','error');return;}
  posts.unshift({id:nextId++,type:selectedPostType,title,content:document.getElementById('postContent')?.value.trim()||'',excerpt:document.getElementById('postExcerpt')?.value.trim()||'',image:selectedImgData||'',featured:false,status:'draft',date:fmtNow()});
  clearForm(); renderPostsList(); updateStats(); showToast('Draft saved!','ok');
}
function clearForm() {
  ['postTitle','postContent','postExcerpt','scheduleDate','imgUrl'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  ['titleCount','contentCount','excerptCount'].forEach(id=>{const el=document.getElementById(id);if(el){el.textContent='0/'+(id==='titleCount'?80:id==='contentCount'?600:160);el.className='char-count char-ok';}});
  const img=document.getElementById('imgPreviewEl');if(img){img.src='';img.style.display='none';}
  const ph=document.getElementById('imgPlaceholder');if(ph)ph.style.display='flex';
  const zone=document.getElementById('imgDrop');if(zone)zone.classList.remove('has-image');
  const nm=document.getElementById('imgName');if(nm)nm.style.display='none';
  const cb=document.getElementById('isFeatured');if(cb){cb.checked=false;syncToggle(cb);}
  selectedImgData=null; document.getElementById('pubBtnLabel').textContent='Publish Now';
}
function editPost(id) {
  const p=posts.find(x=>x.id===id);if(!p)return;
  document.getElementById('postTitle').value=p.title; document.getElementById('postContent').value=p.content; document.getElementById('postExcerpt').value=p.excerpt||'';
  updateCharCount('postTitle','titleCount',80); updateCharCount('postContent','contentCount',600); updateCharCount('postExcerpt','excerptCount',160);
  const cb=document.getElementById('isFeatured');if(cb){cb.checked=p.featured;syncToggle(cb);}
  selectType(document.querySelector(`.type-btn[data-type="${p.type}"]`)||document.querySelector('.type-btn'),p.type);
  document.getElementById('pubBtnLabel').textContent='Update Post';
  posts=posts.filter(x=>x.id!==id); renderPostsList(); updateStats(); showToast(`Editing: "${p.title}"`,'ok');
}
function togglePostStatus(id) {
  const p=posts.find(x=>x.id===id);if(!p)return;
  const cycle={live:'draft',draft:'live',scheduled:'live'};p.status=cycle[p.status]||'live';
  renderPostsList();updateStats();showToast(`Status → ${p.status}`,'ok');
}
function openDeleteModal(id){pendingDeleteId=id;document.getElementById('deleteModal').classList.add('open');}
function closeDeleteModal(){pendingDeleteId=null;document.getElementById('deleteModal').classList.remove('open');}
function confirmDelete(){if(pendingDeleteId==null)return;posts=posts.filter(p=>p.id!==pendingDeleteId);pendingDeleteId=null;closeDeleteModal();renderPostsList();updateStats();showToast('Post deleted','error');}
function closeSuccessModal(){document.getElementById('successModal').classList.remove('open');}

/* Notifications */
function renderNotifs() {
  const list=document.getElementById('nfList'),b=document.getElementById('nBadge');if(!list)return;
  const unr=D.notifs.filter(n=>!n.read).length;b.textContent=unr;b.style.display=unr?'flex':'none';
  list.innerHTML='';
  D.notifs.forEach(n=>{
    const d=document.createElement('div');d.className='nfi '+(n.read?'rd':'unr');
    d.innerHTML=`<div style="width:37px;height:37px;border-radius:50%;background:${n.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas ${n.icon}" style="color:${n.color};font-size:14px;"></i></div><div style="flex:1;"><div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;"><span style="font-family:Rajdhani,sans-serif;font-weight:800;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:${n.read?'#333':'#A67F38'};">${n.tag}</span>${!n.read?'<span style="width:5px;height:5px;border-radius:50%;background:#F2DB94;display:inline-block;"></span>':''}</div><p style="font-size:12px;color:${n.read?'#333':'#ccc'};line-height:1.5;margin-bottom:3px;">${n.text}</p><span style="font-size:9.5px;color:#222;">${n.time}</span></div>`;
    d.onclick=()=>{n.read=true;renderNotifs();};
    list.appendChild(d);
  });
}
function openNotif(){document.getElementById('nfPan').classList.add('open');document.getElementById('nfOv').classList.add('show');document.getElementById('bellBtn').classList.add('hidden');}
function closeNotif(){document.getElementById('nfPan').classList.remove('open');document.getElementById('nfOv').classList.remove('show');document.getElementById('bellBtn').classList.remove('hidden');}
function markAllRead(){D.notifs.forEach(n=>n.read=true);renderNotifs();}
function clearNotifs(){D.notifs.length=0;renderNotifs();}

function showBk(b){document.getElementById('bkTitle').textContent=b.id;document.getElementById('bkBody').innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">${[['Customer',b.customer],['Service',b.service],['Date',b.date],['Time',b.time],['Status',b.status]].map(([k,v])=>`<div style="padding:10px;border-radius:9px;background:rgba(166,127,56,.04);border:1px solid rgba(166,127,56,.08);"><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#282828;margin-bottom:4px;">${k}</div><div style="font-size:13px;color:#ccc;">${k==='Status'?badge(v):v}</div></div>`).join('')}</div>`;openModal('bkModal');}
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}

let ddOpen=false;
function toggleDD(){ddOpen=!ddOpen;document.getElementById('profDD').classList.toggle('open',ddOpen);document.getElementById('pChev').style.transform=ddOpen?'rotate(180deg)':'';}
function closeDD(){ddOpen=false;document.getElementById('profDD').classList.remove('open');document.getElementById('pChev').style.transform='';}
document.addEventListener('click',e=>{if(!document.querySelector('#hdr [style*="position:relative"]')?.contains(e.target))closeDD();});

function toggleSb(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('sbOv').classList.toggle('show');}
function closeSb(){document.getElementById('sidebar').classList.remove('open');document.getElementById('sbOv').classList.remove('show');}

let _toastTimer;
function showToast(msg,type){
  const t=document.getElementById('toast'),icon=document.getElementById('toastIcon'),msgEl=document.getElementById('toastMsg');
  if(icon) icon.className='fas '+(type==='error'?'fa-times-circle':type==='ok'?'fa-check-circle':'fa-info-circle');
  if(icon) icon.style.color=type==='error'?'#f87171':type==='ok'?'#10b981':'#F2DB94';
  if(msgEl) msgEl.textContent=msg; t.classList.add('show'); clearTimeout(_toastTimer); _toastTimer=setTimeout(()=>t.classList.remove('show'),2800);
}

function tick(){
  const now=new Date(),ct=document.getElementById('clkTime'),cd=document.getElementById('clkDate');
  if(ct)ct.textContent=now.toLocaleTimeString('en-US',{hour12:false});
  if(cd)cd.textContent=now.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}
setInterval(tick,1000);tick();

const mBtn=document.getElementById('menuBtn');
function onResize(){
  const mob=window.innerWidth<1024;
  mBtn.style.display=mob?'flex':'none';
  document.getElementById('sbClose').style.display=mob?'block':'none';
  if(!mob)closeSb();
  document.getElementById('clkWrap').style.display=window.innerWidth>=768?'block':'none';
}
window.addEventListener('resize',onResize);onResize();

/* INIT */
renderFeatGrid(); renderShopDash(); renderRecent(); renderChart(); renderLive(); renderNotifs(); updateStats(); renderPostsList();
renderTechRoster(); renderBookingQueue(); renderAssignLog(); updateTechStats();
