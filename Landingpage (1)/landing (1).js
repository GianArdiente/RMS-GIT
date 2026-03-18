/* ═══════════════════════════════════════════════
   REV AUTO REPAIR — Landing Page Scripts
   landingpage.js
═══════════════════════════════════════════════ */

/* ══════════════════
   COMING SOON MODAL
══════════════════ */
function openComingSoon() {
  document.getElementById('comingSoonModal').classList.add('open');
  setTimeout(() => { document.getElementById('csBar').style.width = '72%'; }, 100);
}
function closeComingSoon() {
  document.getElementById('comingSoonModal').classList.remove('open');
  document.getElementById('csBar').style.width = '0%';
}

/* ══════════════════
   AUTH MODAL
══════════════════ */
function openModal(feature) {
  document.getElementById('mfeat').textContent = feature || 'this feature';
  document.getElementById('authModal').classList.add('open');
}
function closeModal() {
  document.getElementById('authModal').classList.remove('open');
}
function requireAuth(feature) { openModal(feature); }

/* ══════════════════
   NOTIFICATION PANEL
══════════════════ */
function openNotif() {
  document.getElementById('notifPanel').classList.add('open');
  document.getElementById('notifOv').classList.add('open');
}
function closeNotif() {
  document.getElementById('notifPanel').classList.remove('open');
  document.getElementById('notifOv').classList.remove('open');
}

/* ══════════════════
   ESC KEY
══════════════════ */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeNotif();
  closeModal();
  closeComingSoon();
});

/* ══════════════════
   TICKER
══════════════════ */
(function buildTicker() {
  const items = [
    'New Promo: 20% Off Oil Change',
    'Free Inspection — No Appointment Needed',
    '247 Vehicles Serviced Today',
    'Book Your Slot — Limited Availability',
    'Trusted by 500+ Auto Shops',
    '15% Off Battery Service',
    'Shop Opens Soon — Get Notified',
  ];
  const track = document.getElementById('tickerTrack');
  [...items, ...items].forEach(text => {
    const span = document.createElement('span');
    span.className = 't-item';
    span.style.fontFamily = "'Rajdhani', sans-serif";
    span.style.fontWeight = '600';
    span.innerHTML = `<span style="width:4px;height:4px;border-radius:50%;background:#A67F38;display:inline-block;flex-shrink:0;"></span>${text}`;
    track.appendChild(span);
  });
})();

/* ══════════════════
   CATEGORY PILLS
══════════════════ */
(function buildPills() {
  const cats = ['Engine','Brakes','Suspension','Transmission','Electrical','Exhaust','Body Parts','Filters','Oils'];
  const container = document.getElementById('pills');
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.onclick = openComingSoon;
    Object.assign(btn.style, {
      padding: '8px 20px',
      borderRadius: '999px',
      fontSize: '13px',
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all .2s',
      border: '1px solid rgba(166,127,56,.16)',
      background: 'rgba(166,127,56,.025)',
      color: '#585858',
    });
    btn.onmouseover = () => { btn.style.borderColor='#A67F38'; btn.style.color='#F2E1AE'; btn.style.background='rgba(166,127,56,.07)'; };
    btn.onmouseout  = () => { btn.style.borderColor='rgba(166,127,56,.16)'; btn.style.color='#585858'; btn.style.background='rgba(166,127,56,.025)'; };
    container.appendChild(btn);
  });
})();

/* ══════════════════
   SCROLL REVEAL
══════════════════ */
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: 0.07 });
  document.querySelectorAll('.rev').forEach(el => obs.observe(el));
})();

/* ══════════════════
   NAV ACTIVE STATE
══════════════════ */
(function initNav() {
  const links    = document.querySelectorAll('.nav-link');
  const ids      = ['home', 'catalogue', 'about-contact'];
  const sections = ids.map(id => document.getElementById(id));
  window.addEventListener('scroll', () => {
    const sy = window.scrollY + 90;
    sections.forEach((sec, i) => {
      if (sec && sec.offsetTop <= sy && sec.offsetTop + sec.offsetHeight > sy) {
        links.forEach(l => l.classList.remove('active'));
        if (links[i]) links[i].classList.add('active');
      }
    });
  }, { passive: true });
})();

/* ══════════════════
   SMOOTH SCROLL
══════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ══════════════════
   LIVE CLOCK
══════════════════ */
function updateClock() {
  const el = document.getElementById('liveTime');
  if (el) el.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

/* ══════════════════
   LIVE FEED
══════════════════ */
const feedItems = [
  { label:'Toyota Camry',  status:'In Service', color:'#10b981' },
  { label:'Honda Civic',   status:'Diagnosing', color:'#A67F38' },
  { label:'Ford F-150',    status:'Completed',  color:'#F2DB94' },
  { label:'BMW 3 Series',  status:'Waiting',    color:'#8b5cf6' },
  { label:'Kia Sorento',   status:'Invoiced',   color:'#F2DB94' },
  { label:'Chevy Malibu',  status:'In Queue',   color:'#3b82f6' },
];
function renderFeed() {
  const c = document.getElementById('liveFeed');
  if (!c) return;
  c.innerHTML = '';
  feedItems.slice(0, 5).forEach((item, i) => {
    const row = document.createElement('div');
    row.style.cssText = `display:flex;align-items:center;justify-content:space-between;
      padding:4px 6px;border-radius:6px;background:rgba(255,255,255,.02);
      animation:countUp .4s ease ${i * .08}s both;`;
    row.innerHTML = `
      <span style="font-size:11px;color:#aaa;font-family:'DM Sans',sans-serif;">${item.label}</span>
      <span style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;
        color:${item.color};font-family:'Rajdhani',sans-serif;">${item.status}</span>`;
    c.appendChild(row);
  });
}
renderFeed();
setInterval(() => { feedItems.push(feedItems.shift()); renderFeed(); }, 4000);

/* ══════════════════
   CANVAS PARTICLES
══════════════════ */
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  class P {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W; this.y = H + 10;
      this.r = Math.random() * 1.4 + .4;
      this.vy = -(Math.random() * .5 + .2);
      this.vx = (Math.random() - .5) * .25;
      this.life = 0; this.maxLife = Math.random() * 320 + 150;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life++;
      const t = this.life / this.maxLife;
      this.alpha = t < .1 ? t * 6 : t > .72 ? (1 - t) * 3.4 : .55;
      if (this.life >= this.maxLife) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(166,127,56,${this.alpha})`;
      ctx.fill();
    }
  }
  const ps = Array.from({ length: 55 }, () => new P());
  (function loop() { ctx.clearRect(0, 0, W, H); ps.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(loop); })();
})();