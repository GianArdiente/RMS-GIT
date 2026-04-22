/* ============================================================
   REV AUTO REPAIR — Profile Card Integration
   Drop this into your admin project and include it after Admin.js
   ============================================================ */

/* ════════════════════════════
   ADMIN USER DATA
   Replace with your actual user/session data
════════════════════════════ */
const ADMIN_USER = {
  name:     'Admin User',
  email:    'admin@rmsautoshop.com',
  email2:   'admin.backup@rmsautoshop.com',
  role:     'Administrator',
  phone:    '09123456789',
  birthday: 'January 1, 1990',
  address:  '123 Auto Street, Workshop City',
  gender:   'Male',
  photo:    '',   // leave empty to show icon fallback
};

/* ════════════════════════════
   STATE
════════════════════════════ */
let _pcEditMode = false;

/* ════════════════════════════
   HELPERS
════════════════════════════ */
function _pcSet(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val ?? '';
}

function _pcVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val ?? '';
}

function _pcGet(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function _pcFmtTime(d) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/* ════════════════════════════
   POPULATE CARD
════════════════════════════ */
function populateProfileCard() {
  // ── Front face ──
  _pcSet('pcFrontName', ADMIN_USER.name);
  _pcSet('pcFrontRole', ADMIN_USER.role);
  _pcSet('pcPhone',     ADMIN_USER.phone);
  _pcSet('pcEmail',     ADMIN_USER.email);

  const now = new Date();
  const t   = _pcFmtTime(now);
  _pcSet('pcTimeIn',      t);
  _pcSet('pcMetaTimeIn',  t);
  _pcSet('pcMetaStatus',  'Online');
  _pcSet('pcMetaShift',   'Today');

  // ── Front photo ──
  const frontImg = document.getElementById('pcFrontImg');
  if (frontImg) {
    if (ADMIN_USER.photo) {
      frontImg.src   = ADMIN_USER.photo;
      frontImg.style.display = 'block';
    } else {
      frontImg.style.display = 'none';
      _ensureFallbackIcon('pc-photo-inner', 'front');
    }
  }

  // ── Back face ──
  _pcSet('pcBackName', ADMIN_USER.name);
  _pcSet('pcBackRole', ADMIN_USER.role);
  _pcVal('pcFieldEmail',  ADMIN_USER.email);
  _pcVal('pcFieldEmail2', ADMIN_USER.email2);
  _pcVal('pcFieldPhone',  ADMIN_USER.phone);
  _pcVal('pcFieldBday',   ADMIN_USER.birthday);
  _pcVal('pcFieldAddr',   ADMIN_USER.address);
  _pcVal('pcFieldGender', ADMIN_USER.gender);

  // ── Back avatar ──
  const backImg = document.getElementById('pcBackImg');
  if (backImg) {
    if (ADMIN_USER.photo) {
      backImg.src   = ADMIN_USER.photo;
      backImg.style.display = 'block';
    } else {
      backImg.style.display = 'none';
      _ensureFallbackIcon('pc-back-avatar-wrap', 'back');
    }
  }
}

/* Avatar fallback — renders a gold icon if no photo */
function _ensureFallbackIcon(wrapClass, key) {
  const id  = `pcFallbackIcon-${key}`;
  if (document.getElementById(id)) return;
  const wrap = document.querySelector(`.${wrapClass}`);
  if (!wrap) return;

  const icon = document.createElement('div');
  icon.id    = id;
  icon.style.cssText = [
    'width:100%','height:100%',
    'display:flex','align-items:center','justify-content:center',
    'background:linear-gradient(135deg,#A67F38,#D9B573)',
    'position:absolute','inset:0',
  ].join(';');
  icon.innerHTML = '<i class="fas fa-user" style="color:#080808;font-size:40px;"></i>';

  if (key === 'back') {
    const existing = wrap.querySelector('.pc-back-avatar');
    if (existing) {
      existing.style.display = 'none';
      existing.parentNode.style.cssText += ';position:relative;width:72px;height:72px;border-radius:50%;overflow:hidden;border:3px solid #A67F38;';
      existing.parentNode.appendChild(icon);
    }
  } else {
    const inner = wrap.querySelector('.pc-photo-inner') || wrap;
    inner.style.position = 'relative';
    icon.style.fontSize  = '64px';
    inner.appendChild(icon);
  }
}

/* ════════════════════════════
   OPEN / CLOSE
════════════════════════════ */
function openProfileCard() {
  const overlay = document.getElementById('profileCardOverlay');
  const card    = document.getElementById('pcFlipCard');
  if (!overlay || !card) {
    console.warn('Profile card elements not found in DOM');
    return;
  }
  overlay.classList.add('open');
  setTimeout(() => card.classList.add('visible'), 50);
  populateProfileCard();

  // Close any open dropdowns
  closeDD?.();
}

function closeProfileCard() {
  const overlay = document.getElementById('profileCardOverlay');
  const card    = document.getElementById('pcFlipCard');
  if (!card || !overlay) return;

  card.classList.remove('visible');
  setTimeout(() => {
    overlay.classList.remove('open');
    _pcResetFlip();
  }, 320);
}

function _pcResetFlip() {
  const card = document.getElementById('pcFlipCard');
  if (card) card.classList.remove('flipped');
  _pcEditMode = false;
}

function handlePCOverlayClick(event) {
  if (event.target === event.currentTarget) closeProfileCard();
}

/* ════════════════════════════
   FLIP
════════════════════════════ */
function pcFlipToBack() {
  document.getElementById('pcFlipCard')?.classList.add('flipped');
}

function pcFlipToFront() {
  document.getElementById('pcFlipCard')?.classList.remove('flipped');
  cancelEdit();
}

/* ════════════════════════════
   EDIT MODE
════════════════════════════ */
function toggleEdit() {
  _pcEditMode = !_pcEditMode;
  _applyEditMode(_pcEditMode);
}

function _applyEditMode(on) {
  document.querySelectorAll('.pc-input').forEach(f => f.disabled = !on);
  const btnTxt    = document.getElementById('editBtnTxt');
  const actionBtns = document.getElementById('pcActionBtns');
  if (btnTxt)     btnTxt.textContent = on ? 'Cancel' : 'Edit';
  if (actionBtns) actionBtns.classList.toggle('hidden', !on);
}

function saveProfileChanges() {
  // Persist to ADMIN_USER object (wire to your backend here)
  ADMIN_USER.email    = _pcGet('pcFieldEmail');
  ADMIN_USER.email2   = _pcGet('pcFieldEmail2');
  ADMIN_USER.phone    = _pcGet('pcFieldPhone');
  ADMIN_USER.birthday = _pcGet('pcFieldBday');
  ADMIN_USER.address  = _pcGet('pcFieldAddr');
  ADMIN_USER.gender   = _pcGet('pcFieldGender');

  _pcEditMode = false;
  _applyEditMode(false);

  // Reflect changes on front face
  _pcSet('pcPhone', ADMIN_USER.phone);
  _pcSet('pcEmail', ADMIN_USER.email);

  _pcShowToast('Profile updated successfully', 'success');
}

function cancelEdit() {
  if (!_pcEditMode) return;
  _pcEditMode = false;
  _applyEditMode(false);
  populateProfileCard();   // revert to saved values
}

/* ════════════════════════════
   MINI TOAST (reuses svc-toast if available)
════════════════════════════ */
function _pcShowToast(msg, type = 'success') {
  // Try to use existing svcToast helper if present
  if (typeof svcToast === 'function') { svcToast(msg, type); return; }

  const container = document.getElementById('svcToasts') || document.body;
  const t = document.createElement('div');
  t.className = `svc-toast ${type}`;
  t.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" style="color:${type === 'success' ? '#34d399' : '#f87171'}"></i><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

/* ════════════════════════════
   EXPOSE GLOBALS (called inline from HTML)
════════════════════════════ */
window.openProfileCard      = openProfileCard;
window.closeProfileCard     = closeProfileCard;
window.handlePCOverlayClick = handlePCOverlayClick;
window.pcFlipToBack         = pcFlipToBack;
window.pcFlipToFront        = pcFlipToFront;
window.toggleEdit           = toggleEdit;
window.saveProfileChanges   = saveProfileChanges;
window.cancelEdit           = cancelEdit;
window.populateProfileCard  = populateProfileCard;

/* ════════════════════════════
   KEYBOARD SHORTCUT  (Escape closes)
════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('profileCardOverlay');
    if (overlay?.classList.contains('open')) closeProfileCard();
  }
});

/* ════════════════════════════
   LIVE CLOCK on front face
   Updates every minute while card is open
════════════════════════════ */
setInterval(() => {
  const overlay = document.getElementById('profileCardOverlay');
  if (!overlay?.classList.contains('open')) return;
  const t = _pcFmtTime(new Date());
  _pcSet('pcTimeIn',     t);
  _pcSet('pcMetaTimeIn', t);
}, 60_000);