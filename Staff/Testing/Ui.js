/* ============================================================
   ui.js
   General UI controls: sidebar, profile dropdown, filter tabs,
   post-type selector, character counters, schedule button
   label, and featured toggle.
   Depends on: state.js, posts.js (renderPosts)
   ============================================================ */

/* ── Sidebar ─────────────────────────────────────────────── */
function toggleSidebar() {
  sbOpen = !sbOpen;
  const sidebar = document.getElementById('sidebar');
  const wrap    = document.getElementById('mainWrap');

  if (window.innerWidth < 1024) {
    sidebar.style.transform = sbOpen ? 'translateX(0)' : 'translateX(-100%)';
  } else {
    wrap.style.marginLeft   = sbOpen ? '248px' : '0';
    sidebar.style.transform = sbOpen ? 'translateX(0)' : 'translateX(-100%)';
  }
}

window.addEventListener('resize', () => {
  if (window.innerWidth < 1024) {
    document.getElementById('sidebar').style.transform = 'translateX(-100%)';
    document.getElementById('mainWrap').style.marginLeft = '0';
    sbOpen = false;
  } else {
    document.getElementById('sidebar').style.transform = 'translateX(0)';
    document.getElementById('mainWrap').style.marginLeft = '248px';
    sbOpen = true;
  }
});

// Initial state on mobile
if (window.innerWidth < 1024) {
  document.getElementById('sidebar').style.transform = 'translateX(-100%)';
  document.getElementById('mainWrap').style.marginLeft = '0';
  sbOpen = false;
}

/* ── Profile Dropdown ────────────────────────────────────── */
function toggleDD() {
  _ddOpen = !_ddOpen;
  document.getElementById('profDD').classList.toggle('open', _ddOpen);
}

// Close dropdown when clicking outside
document.addEventListener('click', e => {
  const btn = document.getElementById('profBtn');
  const dd  = document.getElementById('profDD');
  if (btn && !btn.contains(e.target) && dd && !dd.contains(e.target)) {
    _ddOpen = false;
    dd.classList.remove('open');
  }
});

/* ── Filter Tabs ─────────────────────────────────────────── */
function filterPosts(filter) {
  activeFilter = filter;
  document.querySelectorAll('.filter-tab').forEach(btn => {
    const isActive = btn.dataset.filter === filter;
    btn.style.cssText = isActive ? filterTabStyle.active : filterTabStyle.inactive;
  });
  renderPosts();
}

// Set initial active tab style
document.querySelector('[data-filter="all"]').style.cssText = filterTabStyle.active;

/* ── Post Type Selector ──────────────────────────────────── */
function selectType(el, type) {
  selectedType = type;
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  updatePubBtn();
}

/* ── Character Counter ───────────────────────────────────── */
function updateCharCount(inputId, countId, max) {
  const len = document.getElementById(inputId).value.length;
  const el  = document.getElementById(countId);
  el.textContent = `${len}/${max}`;
  el.className = 'char-count ' + (
    len > max * 0.9 ? 'char-over' :
    len > max * 0.7 ? 'char-warn' :
    'char-ok'
  );
}

/* ── Schedule → Publish Button Label ────────────────────── */
function updatePubBtn() {
  const sched = document.getElementById('scheduleDate').value;
  document.getElementById('pubBtnLabel').textContent = sched ? 'Schedule Post' : 'Publish Now';
}

document.getElementById('scheduleDate').addEventListener('input', updatePubBtn);

/* ── Featured Toggle ─────────────────────────────────────── */
document.getElementById('isFeatured').addEventListener('change', function () {
  document.getElementById('toggleTrack').style.background = this.checked
    ? 'linear-gradient(135deg,#A67F38,#D9B573)'
    : 'rgba(255,255,255,.08)';
});