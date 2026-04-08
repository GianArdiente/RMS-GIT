const $ = id => document.getElementById(id);

function showToast(msg, type = 'success') {
  const t  = document.createElement('div');
  const ic = type === 'success' ? 'check-circle' : 'exclamation-circle';
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas fa-${ic}"></i>${msg}`;
  $('toastContainer').appendChild(t);
  setTimeout(() => {
    t.style.transition = '.3s';
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

/* ── Slide Panel ── */
const card      = $('card');
const goldPanel = $('goldPanel');
const gpHeadline= $('gpHeadline');
const gpSub     = $('gpSub');
const gpBtn     = $('gpBtn');
let   isSignup  = true;

function showLogin() {
  isSignup = false;
  goldPanel.classList.remove('pos-right');
  goldPanel.classList.add('pos-left');
  card.classList.remove('show-signup');
  card.classList.add('show-login');
  gpHeadline.innerHTML = 'NEW<br>HERE?';
  gpSub.textContent    = "Don't have an account? Sign up and join the Autoshop network today.";
  gpBtn.textContent    = 'Sign Up';
}

function showSignup() {
  isSignup = true;
  goldPanel.classList.remove('pos-left');
  goldPanel.classList.add('pos-right');
  card.classList.remove('show-login');
  card.classList.add('show-signup');
  gpHeadline.innerHTML = 'WELCOME<br>BACK';
  gpSub.textContent    = 'Enter your credentials to access your Autoshop dashboard and manage your shop.';
  gpBtn.textContent    = 'Log In';
}

gpBtn.addEventListener('click',           () => isSignup ? showLogin() : showSignup());
$('goToLogin').addEventListener('click',  e => { e.preventDefault(); showLogin();  });
$('goToSignup').addEventListener('click', e => { e.preventDefault(); showSignup(); });

/* ── Password Toggles ── */
function pwToggle(btnId, inputId) {
  const btn = $(btnId), inp = $(inputId);
  if (!btn || !inp) return;
  btn.addEventListener('click', () => {
    const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    btn.classList.toggle('fa-eye',      !show);
    btn.classList.toggle('fa-eye-slash', show);
  });
}
pwToggle('togglePassword',        'password');
pwToggle('toggleConfirmPassword', 'confirmPassword');
pwToggle('toggleLoginPassword',   'loginPassword');

/* ── Sign Up ── */
$('signupForm').addEventListener('submit', e => {
  e.preventDefault();
  const firstName = $('firstName').value.trim();
  const lastName = $('lastName').value.trim();
  const email= $('email').value.trim();
  const pw   = $('password').value;
  const pw2  = $('confirmPassword').value;

  if (!firstName)    { showToast('Please enter your first name.', 'error');             return; }
  if (!lastName)     { showToast('Please enter your last name.', 'error');              return; }
  if (!email)        { showToast('Please enter your email address.', 'error');         return; }
  if (pw.length < 6) { showToast('Password must be at least 6 characters.', 'error'); return; }
  if (pw !== pw2)    { showToast('Passwords do not match.', 'error');                  return; }

  showToast('Account created successfully!', 'success');
  setTimeout(() => { $('signupForm').reset(); showLogin(); }, 1600);
});

/* ── Login ── */
$('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = $('loginEmail').value.trim();
  const pw    = $('loginPassword').value;

  if (!email) { showToast('Please enter your email address.', 'error'); return; }
  if (!pw)    { showToast('Please enter your password.', 'error');      return; }

  showToast('Login successful! Redirecting…', 'success');
  setTimeout(() => { $('loginForm').reset(); console.log('→ dashboard'); }, 1600);
});

/* ── Forgot Password ── */
$('forgotPassword').addEventListener('click', () => {
  const email = $('loginEmail').value.trim();
  email
    ? showToast('Reset link sent to ' + email, 'success')
    : showToast('Enter your email first, then click forgot.', 'error');
});

/* ── Social Buttons ── */
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', () => showToast(`${btn.dataset.social} login coming soon!`, 'success'));
});