/* ============================================================
   modals.js
   Open and close handlers for the two overlay modals:
   — Success modal  (shown after publish or schedule)
   — Delete modal   (confirmation before removing a post)
   Depends on: nothing (pure DOM manipulation)
   ============================================================ */

/* ── Success Modal ───────────────────────────────────────── */
function openSuccessModal() {
  const m = document.getElementById('successModal');
  m.classList.remove('opacity-0', 'pointer-events-none');
  m.classList.add('open');
}

function closeSuccessModal() {
  const m = document.getElementById('successModal');
  m.classList.remove('open');
  setTimeout(() => m.classList.add('opacity-0', 'pointer-events-none'), 350);
}

/* ── Delete Confirmation Modal ───────────────────────────── */
function openDeleteModal() {
  const m = document.getElementById('deleteModal');
  m.classList.remove('opacity-0', 'pointer-events-none');
  m.classList.add('open');
}

function closeDeleteModal() {
  const m = document.getElementById('deleteModal');
  m.classList.remove('open');
  setTimeout(() => m.classList.add('opacity-0', 'pointer-events-none'), 320);
}