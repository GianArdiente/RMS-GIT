# Profile Card Complete Implementation Guide

## 1. CSS STYLES (Add to your <style> section)

```css
/* ══ PROFILE CARD ══ */
@keyframes pcPopin { from{opacity:0;transform:translateY(30px) scale(.94)} to{opacity:1;transform:translateY(0) scale(1)} }

.pc-modal-overlay {
  position:fixed; inset:0; z-index:500; display:flex; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:opacity .3s; background:rgba(0,0,0,.78); backdrop-filter:blur(10px);
}
.pc-modal-overlay.open { opacity:1; pointer-events:all; }

.pc-flip-card {
  width:300px; height:480px; perspective:1200px; position:relative; z-index:10; opacity:0; transform:translateY(30px) scale(.94); transition:opacity .38s cubic-bezier(.25,.46,.45,.94), transform .38s cubic-bezier(.25,.46,.45,.94);
}
.pc-flip-card.visible { opacity:1; transform:translateY(0) scale(1); }

.pc-flip-inner {
  position:relative; width:100%; height:100%; transform-style:preserve-3d; transition:transform .7s cubic-bezier(.4,0,.2,1);
}
.pc-flip-card.flipped .pc-flip-inner { transform:rotateY(180deg); }

.pc-face {
  position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden; border-radius:22px; overflow:hidden; box-shadow:0 0 0 2px #A67F38, 0 40px 100px rgba(0,0,0,.85);
}

.pc-front { background:#1a1a1a; }
.pc-back { transform:rotateY(180deg); background:linear-gradient(160deg,#1d1d1d,#111); }

.pc-flip-card.flipped #pcFront { pointer-events:none; }
.pc-flip-card:not(.flipped) #pcBack { pointer-events:none; }

.pc-gold-bar { position:absolute; top:0; left:0; right:0; height:2px; z-index:10; background:linear-gradient(90deg, transparent, #F2DB94, #A67F38, #F2DB94, transparent); }

.pc-close-btn {
  position:absolute; top:14px; right:14px; z-index:20; width:28px; height:28px; border-radius:50%; background:rgba(0,0,0,.5); color:#888; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; transition:all .2s; cursor:pointer; border:none;
}
.pc-close-btn:hover { background:rgba(239,68,68,.2); color:#ef4444; }

.pc-photo-wrap { position:relative; height:300px; background:linear-gradient(135deg,#1e1e1e,#2a2a2a); }
.pc-photo-inner { width:100%; height:100%; position:relative; }
.pc-photo { width:100%; height:100%; object-fit:cover; object-position:top; }
.pc-photo-grad { position:absolute; inset:0; background:linear-gradient(to bottom, rgba(0,0,0,.04) 35%, rgba(10,10,10,.94) 100%); }

.pc-status-dot {
  position:absolute; top:14px; left:14px; width:12px; height:12px; border-radius:50%; background:#10b981; border:2px solid #1a1a1a; animation:pulseDot 1.5s infinite; box-shadow:0 0 8px rgba(16,185,129,.7);
}

.pc-details-btn {
  position:absolute; bottom:10px; left:14px; display:flex; align-items:center; gap:6px; background:rgba(0,0,0,.45); backdrop-filter:blur(6px); color:#fff; padding:6px 14px; border-radius:20px; font-size:12px; font-weight:600; transition:all .2s; z-index:10; border:none; cursor:pointer;
}
.pc-details-btn:hover { background:rgba(166,127,56,.5); }

.pc-name-block { position:absolute; bottom:14px; left:0; right:0; text-align:center; padding:0 14px; }
.pc-name { font-family:'Barlow Condensed', sans-serif; font-size:24px; font-weight:900; color:#fff; line-height:1; text-shadow:0 2px 12px rgba(0,0,0,.9); }
.pc-role-badge { font-size:13px; font-weight:500; color:#D9B573; text-shadow:0 1px 6px rgba(0,0,0,.8); }

.pc-contact-strip { padding:16px; background:linear-gradient(180deg,#161616,#111); border-top:1px solid rgba(166,127,56,.18); }
.pc-contact-icons { display:flex; align-items:flex-start; justify-content:space-between; gap:6px; margin-bottom:12px; }
.pc-icon-col { display:flex; flex-direction:column; align-items:center; gap:5px; }
.pc-icon-circle { width:40px; height:40px; border-radius:50%; background:rgba(166,127,56,.1); border:1.5px solid rgba(166,127,56,.35); display:flex; align-items:center; justify-content:center; }
.pc-icon-label { font-size:10px; color:#A67F38; letter-spacing:.5px; }
.pc-divider { height:1px; background:linear-gradient(90deg, transparent, rgba(166,127,56,.28), transparent); margin-bottom:10px; }
.pc-meta-row { display:flex; align-items:center; justify-content:space-between; padding:0 4px; }
.pc-meta-col { text-align:center; }
.pc-meta-label { font-size:9px; text-transform:uppercase; letter-spacing:2px; color:#3a3a3a; margin-bottom:2px; }
.pc-meta-val { font-size:12px; font-weight:700; color:#D9B573; font-family:'Rajdhani', sans-serif; }
.pc-meta-status { display:flex; align-items:center; gap:4px; justify-content:center; }
.status-dot-green { width:6px; height:6px; border-radius:50%; background:#10b981; display:inline-block; }

.pc-back-scroll { height:100%; overflow-y:auto; overflow-x:hidden; padding:14px; box-sizing:border-box; }
.pc-back-topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.pc-see-less-btn, .pc-edit-btn {
  display:flex; align-items:center; gap:5px; background:rgba(166,127,56,.12); border:1px solid rgba(166,127,56,.28); border-radius:8px; padding:6px 12px; color:#D9B573; font-family:'Rajdhani', sans-serif; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; transition:all .2s; cursor:pointer;
}
.pc-see-less-btn:hover, .pc-edit-btn:hover { background:rgba(166,127,56,.22); }

.pc-back-avatar-wrap { display:flex; justify-content:center; margin-bottom:10px; }
.pc-back-avatar { width:72px; height:72px; border-radius:50%; object-fit:cover; object-position:top; border:3px solid #A67F38; box-shadow:0 0 20px rgba(166,127,56,.4); }
.pc-back-status-dot { position:absolute; bottom:2px; right:2px; width:12px; height:12px; border-radius:50%; background:#10b981; border:2px solid #1d1d1d; animation:pulseDot 1.5s infinite; }

.pc-back-name-block { text-align:center; margin-bottom:12px; }
.pc-back-name-block > div:first-child { color:#ddd; font-family:'Barlow Condensed',sans-serif; font-size:18px; font-weight:900; }

.pc-back-divider { height:1px; background:linear-gradient(90deg, transparent, rgba(166,127,56,.22), transparent); margin-bottom:14px; }
.pc-fields-list { display:flex; flex-direction:column; gap:10px; }
.pc-field-label { font-size:9px; text-transform:uppercase; letter-spacing:2px; color:#3a3a3a; margin-bottom:5px; }
.pc-field-row { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:10px; background:rgba(255,255,255,.02); border:1px solid rgba(166,127,56,.14); }
.pc-field-icon { color:#A67F38; font-size:11px; width:14px; flex-shrink:0; }
.pc-input { flex:1; background:none; border:none; outline:none; color:#888; font-size:12px; font-family:inherit; min-width:0; }
.pc-input:disabled { color:#888; }
.pc-input:not(:disabled) { color:#ddd; border-bottom:1px solid rgba(166,127,56,.4); }

.pc-action-btns { display:flex; gap:8px; padding-top:12px; }
.pc-action-btns.hidden { display:none; }
.pc-save-btn { flex:1; padding:10px; background:linear-gradient(90deg, #8B6914, #D4A843, #F0C860); border:none; border-radius:20px; color:#000; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; transition:transform .2s, box-shadow .2s; cursor:pointer; }
.pc-save-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(212,168,67,.4); }
.pc-cancel-btn { flex:1; padding:10px; background:#1a1a1a; border:none; border-radius:20px; color:#888; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; transition:background .2s; cursor:pointer; }
.pc-cancel-btn:hover { background:#222; color:#ddd; }
```

## 2. HTML STRUCTURE (Add inside your main layout)

```html
<!-- PROFILE CARD MODAL -->
<div id="profileCardOverlay" class="pc-modal-overlay" onclick="if(event.target===this)closeProfileCard()">
  <div id="pcFlipCard" class="pc-flip-card">
    <div id="pcFlipInner" class="pc-flip-inner">
      <!-- FRONT -->
      <div id="pcFront" class="pc-face pc-front">
        <div class="pc-gold-bar"></div>
        <div class="pc-photo-wrap">
          <div class="pc-photo-inner">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" alt="" id="pcFrontImg" class="pc-photo"/>
            <div class="pc-photo-grad"></div>
            <span class="pc-status-dot"></span>
            <button onclick="pcFlipToBack()" class="pc-details-btn" aria-label="See More"><i class="fas fa-eye" style="font-size:12px;"></i> See More</button>
          </div>
          <div class="pc-name-block"><h2 id="pcFrontName" class="pc-name"></h2><p id="pcFrontRole" class="pc-role-badge"></p></div>
        </div>
        <div class="pc-contact-strip">
          <div class="pc-contact-icons">
            <div class="pc-icon-col"><div class="pc-icon-circle"><i class="fas fa-clock" style="color:#D9B573;font-size:15px;"></i></div><span id="pcTimeIn" class="pc-icon-label">--:--</span></div>
            <div class="pc-icon-col"><div class="pc-icon-circle"><i class="fas fa-phone" style="color:#D9B573;font-size:14px;"></i></div><span id="pcPhone" class="pc-icon-label" style="color:#888;"></span></div>
            <div class="pc-icon-col"><div class="pc-icon-circle"><i class="fas fa-envelope" style="color:#D9B573;font-size:13px;"></i></div><span id="pcEmail" class="pc-icon-label" style="color:#888;max-width:76px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span></div>
          </div>
          <div class="pc-divider"></div>
          <div class="pc-meta-row">
            <div class="pc-meta-col"><div class="pc-meta-label">Time In</div><div id="pcMetaTimeIn" class="pc-meta-val"></div></div>
            <div class="pc-meta-col"><div class="pc-meta-label">Status</div><div class="pc-meta-status"><span class="status-dot-green"></span><span id="pcMetaStatus" class="pc-meta-val" style="color:#10b981;"></span></div></div>
            <div class="pc-meta-col"><div class="pc-meta-label">Sign-in</div><div id="pcMetaShift" class="pc-meta-val"></div></div>
          </div>
        </div>
        <button onclick="closeProfileCard()" class="pc-close-btn">✕</button>
      </div>
      <!-- BACK -->
      <div id="pcBack" class="pc-face pc-back">
        <div class="pc-gold-bar"></div>
        <div id="pcBackScroll" class="pc-back-scroll">
          <div class="pc-back-topbar">
            <button onclick="pcFlipToFront()" class="pc-see-less-btn"><i class="fas fa-chevron-left" style="font-size:10px;"></i> See Less</button>
            <button id="editBtn" onclick="toggleEdit()" class="pc-edit-btn"><i class="fas fa-pen" style="font-size:11px;"></i><span id="editBtnTxt">Edit</span></button>
          </div>
          <div class="pc-back-avatar-wrap"><div style="position:relative;"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" alt="" id="pcBackImg" class="pc-back-avatar"/><span class="pc-back-status-dot"></span></div></div>
          <div class="pc-back-name-block"><div id="pcBackName" style="font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:18px;"></div><div id="pcBackRole" style="color:#A67F38;font-size:10px;letter-spacing:1px;text-transform:uppercase;"></div></div>
          <div class="pc-back-divider"></div>
          <div class="pc-fields-list">
            <div class="pc-field-group"><div class="pc-field-label">Email</div><div class="pc-field-row"><i class="fas fa-envelope-open pc-field-icon"></i><input type="email" id="pcFieldEmail" disabled class="pc-input"/></div></div>
            <div class="pc-field-group"><div class="pc-field-label">Secondary Email</div><div class="pc-field-row"><i class="fas fa-envelope-open pc-field-icon"></i><input type="email" id="pcFieldEmail2" disabled class="pc-input"/></div></div>
            <div class="pc-field-group"><div class="pc-field-label">Contact Number</div><div class="pc-field-row"><i class="fas fa-phone pc-field-icon"></i><input type="text" id="pcFieldPhone" disabled class="pc-input"/></div></div>
            <div class="pc-field-group"><div class="pc-field-label">Birthday</div><div class="pc-field-row"><i class="fas fa-birthday-cake pc-field-icon"></i><input type="text" id="pcFieldBday" disabled class="pc-input"/></div></div>
            <div class="pc-field-group"><div class="pc-field-label">Address</div><div class="pc-field-row"><i class="fas fa-map-marker-alt pc-field-icon"></i><input type="text" id="pcFieldAddr" disabled class="pc-input"/></div></div>
            <div class="pc-field-group"><div class="pc-field-label">Gender</div><div class="pc-field-row"><i class="fas fa-venus-mars pc-field-icon"></i><input type="text" id="pcFieldGender" disabled class="pc-input"/></div></div>
          </div>
          <div id="pcActionBtns" class="pc-action-btns hidden">
            <button onclick="saveProfileChanges()" class="pc-save-btn"><i class="fas fa-check"></i>Save</button>
            <button onclick="cancelEdit()" class="pc-cancel-btn"><i class="fas fa-times"></i>Cancel</button>
          </div>
          <div style="height:16px;"></div>
        </div>
      </div>
    </div>
  </div>
</div>
```

## 3. JAVASCRIPT CODE (Add to your script section)

```javascript
/* ══════════════════════════════════
   PROFILE CARD DATA
══════════════════════════════════ */
const PROFILE_USER = {  
  name:     'John Jasper',
  email:    'john.doe@revmotors.com',
  email2:   'john.doe.personal@gmail.com',
  role:     'Staff',
  phone:    '09312345678',
  birthday: 'April 20, 1999',
  address:  'Makati City, Metro Manila',
  gender:   'Male',
  photo:    '../../Assets (1)/image.png',
};

let pcEditMode = false;

/* ══════════════════════════════════
   HELPER FUNCTIONS
══════════════════════════════════ */
function setText(id, val) { 
  const el = document.getElementById(id); 
  if (el) el.textContent = val; 
}

function setVal(id, val) { 
  const el = document.getElementById(id); 
  if (el) el.value = val || ''; 
}

function getVal(id) { 
  const el = document.getElementById(id); 
  return el ? el.value : ''; 
}

function fmtTime(d) { 
  return d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:true }); 
}

/* ══════════════════════════════════
   PROFILE CARD FUNCTIONS
══════════════════════════════════ */
function openProfileCard() {
  const overlay = document.getElementById('profileCardOverlay');
  const card = document.getElementById('pcFlipCard');
  if (overlay) overlay.classList.add('open');
  if (card) { 
    setTimeout(() => card.classList.add('visible'), 50); 
  }
  populateProfileCard();
}

function closeProfileCard() {
  const overlay = document.getElementById('profileCardOverlay');
  const card = document.getElementById('pcFlipCard');
  if (card) card.classList.remove('visible');
  setTimeout(() => {
    if (overlay) overlay.classList.remove('open');
    resetFlip();
  }, 300);
}

function resetFlip() {
  const card = document.getElementById('pcFlipCard');
  if (card) card.classList.remove('flipped');
  pcEditMode = false;
}

function pcFlipToBack() {
  const card = document.getElementById('pcFlipCard');
  if (card) card.classList.add('flipped');
}

function pcFlipToFront() {
  const card = document.getElementById('pcFlipCard');
  if (card) card.classList.remove('flipped');
  cancelEdit();
}

function populateProfileCard() {
  setText('pcFrontName', PROFILE_USER.name);
  setText('pcFrontRole', PROFILE_USER.role);
  setText('pcPhone', PROFILE_USER.phone);
  setText('pcEmail', PROFILE_USER.email);
  setText('pcTimeIn', fmtTime(new Date()));
  setText('pcMetaTimeIn', new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:true }));
  setText('pcMetaStatus', 'Online');
  setText('pcMetaShift', 'Today');
  setText('pcBackName', PROFILE_USER.name);
  setText('pcBackRole', PROFILE_USER.role);
  setVal('pcFieldEmail', PROFILE_USER.email);
  setVal('pcFieldEmail2', PROFILE_USER.email2);
  setVal('pcFieldPhone', PROFILE_USER.phone);
  setVal('pcFieldBday', PROFILE_USER.birthday);
  setVal('pcFieldAddr', PROFILE_USER.address);
  setVal('pcFieldGender', PROFILE_USER.gender);
  document.getElementById('pcFrontImg').src = PROFILE_USER.photo;
  document.getElementById('pcBackImg').src = PROFILE_USER.photo;
}

function toggleEdit() {
  pcEditMode = !pcEditMode;
  const fields = document.querySelectorAll('.pc-input');
  const btnTxt = document.getElementById('editBtnTxt');
  const actionBtns = document.getElementById('pcActionBtns');
  fields.forEach(f => f.disabled = !pcEditMode);
  if (btnTxt) btnTxt.textContent = pcEditMode ? 'Cancel' : 'Edit';
  if (actionBtns) actionBtns.classList.toggle('hidden', !pcEditMode);
}

function saveProfileChanges() {
  PROFILE_USER.email = getVal('pcFieldEmail');
  PROFILE_USER.email2 = getVal('pcFieldEmail2');
  PROFILE_USER.phone = getVal('pcFieldPhone');
  PROFILE_USER.birthday = getVal('pcFieldBday');
  PROFILE_USER.address = getVal('pcFieldAddr');
  PROFILE_USER.gender = getVal('pcFieldGender');
  pcEditMode = false;
  const fields = document.querySelectorAll('.pc-input');
  fields.forEach(f => f.disabled = true);
  const actionBtns = document.getElementById('pcActionBtns');
  if (actionBtns) actionBtns.classList.add('hidden');
  const btnTxt = document.getElementById('editBtnTxt');
  if (btnTxt) btnTxt.textContent = 'Edit';
  showToast('Profile updated successfully','ok');
}

function cancelEdit() {
  if (!pcEditMode) return;
  pcEditMode = false;
  const fields = document.querySelectorAll('.pc-input');
  fields.forEach(f => f.disabled = true);
  const actionBtns = document.getElementById('pcActionBtns');
  if (actionBtns) actionBtns.classList.add('hidden');
  const btnTxt = document.getElementById('editBtnTxt');
  if (btnTxt) btnTxt.textContent = 'Edit';
  populateProfileCard();
}
```

## 4. HOW TO INTEGRATE

### In your HTML file:
1. Copy all CSS styles and add them to your `<style>` section
2. Copy the HTML structure and add it after your main layout (or where you want the modal)
3. **Important**: Make sure the HTML is placed OUTSIDE the main page containers but inside the body

### In your JavaScript file:
1. Define the `PROFILE_USER` constant with the staff member's data
2. Add all helper functions and profile card functions
3. Make sure `showToast()` function exists (for success messages)
4. Call `openProfileCard()` from any button using: `onclick="openProfileCard()"`

### To trigger the profile card:
```html
<!-- From a dropdown menu -->
<div class="ddi" onclick="openProfileCard();closeDD()"><i class="fas fa-user-circle"></i>Profile</div>

<!-- From a button -->
<button onclick="openProfileCard()" class="btn-g">My Profile</button>
```

## 5. KEY FEATURES
- ✅ 3D flip animation (Front to Back)
- ✅ Photo display with gradient overlay
- ✅ Contact info on front
- ✅ Editable fields on back
- ✅ Save/Cancel edit functionality
- ✅ Status indicator (Online)
- ✅ Time tracking
- ✅ Responsive design
- ✅ Smooth transitions and animations

## 6. CUSTOMIZE
Update the `PROFILE_USER` object with actual data:
```javascript
const PROFILE_USER = {  
  name:     'Your Name',
  email:    'your.email@company.com',
  email2:   'alternative@email.com',
  role:     'Your Role',
  phone:    '09XX-XXX-XXXX',
  birthday: 'MM DD, YYYY',
  address:  'Your Address',
  gender:   'Male/Female',
  photo:    'path/to/photo.jpg',
};
```
