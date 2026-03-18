/* ============================================================
   image.js
   Image handling: file upload, drag-and-drop, external URL
   input, FileReader processing, and preview rendering.
   Depends on: state.js
   ============================================================ */

/* ── File Input ──────────────────────────────────────────── */
function handleImgInput(e) {
  const file = e.target.files[0];
  if (!file) return;
  processImg(file);
}

/* ── Drag & Drop ─────────────────────────────────────────── */
function handleDrop(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) processImg(file);
}

/* ── Read file as Base64 ─────────────────────────────────── */
function processImg(file) {
  const reader = new FileReader();
  reader.onload = (ev) => { applyImgPreview(ev.target.result, file.name); };
  reader.readAsDataURL(file);
}

/* ── External URL Input ──────────────────────────────────── */
function handleImgUrl(url) {
  if (!url) return;
  applyImgPreview(url, '');
  document.getElementById('imgName').textContent = 'External URL';
  document.getElementById('imgName').classList.remove('hidden');
}

/* ── Apply Preview to DOM ────────────────────────────────── */
function applyImgPreview(src, name) {
  imgDataUrl = src;

  const img = document.getElementById('imgPreviewEl');
  img.src = src;
  img.style.display = 'block';

  document.getElementById('imgPlaceholder').style.opacity = '0';
  document.getElementById('imgDrop').classList.add('has-image');

  if (name) {
    document.getElementById('imgName').textContent = name;
    document.getElementById('imgName').classList.remove('hidden');
  }
}