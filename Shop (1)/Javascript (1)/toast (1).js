/* ============================================================
   toast.js — Lightweight notification helper
   Usage:
     Toast.success('Item added to cart')
     Toast.error('Invalid credentials')
     Toast.info('Stock updated')
   ============================================================ */

const Toast = (() => {
  let _timer = null;

  function _show(type, icon, message) {
    const el  = document.getElementById('toast');
    const ico = document.getElementById('t-ico');
    const msg = document.getElementById('t-msg');

    ico.textContent = icon;
    msg.textContent = message;
    el.className    = `toast ${type === 'error' ? 'err' : ''} show`;

    clearTimeout(_timer);
    _timer = setTimeout(() => el.classList.remove('show'), 2800);
  }

  return {
    success: (msg) => _show('success', '✦',  msg),
    error:   (msg) => _show('error',   '✕',  msg),
    info:    (msg) => _show('info',    '→',  msg),
  };
})();
