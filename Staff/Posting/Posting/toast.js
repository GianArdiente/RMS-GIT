/* ============================================================
   toast.js
   Lightweight toast notification system.
   Displays a brief message at the bottom of the screen
   with an icon and auto-dismisses after 3 seconds.
   Depends on: nothing (pure DOM manipulation)
   ============================================================ */

let toastTimer;

function showToast(msg, icon = 'fa-check-circle', isError = false) {
  const t     = document.getElementById('toast');
  const inner = document.getElementById('toastInner');

  document.getElementById('toastMsg').textContent  = msg;
  document.getElementById('toastIcon').className   = `fas ${icon}`;
  document.getElementById('toastIcon').style.color = isError ? '#ef4444' : '#10b981';
  inner.style.borderColor                          = isError ? 'rgba(239,68,68,.3)' : 'rgba(166,127,56,.3)';

  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}