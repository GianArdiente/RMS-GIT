import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// ============================
// FIREBASE INIT
// ============================
const firebaseConfig = {
  apiKey:            "AIzaSyD0g9EfP0DPIR7skzKOZ0DyWLlUi5f5LlM",
  authDomain:        "rmsautoshop.firebaseapp.com",
  projectId:         "rmsautoshop",
  storageBucket:     "rmsautoshop.firebasestorage.app",
  messagingSenderId: "699636102924",
  appId:             "1:699636102924:web:1c25aba93b61fd86047b29"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ============================
// TOAST
// ============================
function toast(msg, type = 'error') {
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => t.remove(), 3100);
}

// ============================
// PASSWORD TOGGLE
// ============================
document.getElementById('togglePwd').addEventListener('click', function () {
  const inp = document.getElementById('password');
  inp.type = inp.type === 'password' ? 'text' : 'password';
  this.classList.toggle('fa-eye');
  this.classList.toggle('fa-eye-slash');
});

// ============================
// REMEMBER ME — pre-fill on load
// ============================
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('adminEmail');
  if (saved) {
    document.getElementById('email').value = saved;
    document.getElementById('remember').checked = true;
  }
});

// ============================
// ADMIN LOGIN
// ============================
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  document.getElementById('email').classList.remove('error');
  document.getElementById('password').classList.remove('error');

  if (!email || !email.includes('@')) {
    document.getElementById('email').classList.add('error');
    toast('Please enter a valid email address.', 'error');
    return;
  }
  if (!password) {
    document.getElementById('password').classList.add('error');
    toast('Please enter your password.', 'error');
    return;
  }

  toast('Authenticating…', 'success');

  try {
    // Step 1: Firebase Auth sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Auth success:", user.uid);

    // Step 2: Verify admin role in Firestore
    const adminRef  = doc(db, "User", "Admin", "Admins", "Admin-ADM-0001");
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists() || adminSnap.data().uid !== user.uid) {
      await auth.signOut();
      toast('Access denied. Admin accounts only.', 'error');
      return;
    }

    // Step 3: Remember me
    if (document.getElementById('remember').checked) {
      localStorage.setItem('adminEmail', email);
    } else {
      localStorage.removeItem('adminEmail');
    }

    toast('Access granted! Redirecting…', 'success');
    setTimeout(() => {
      window.location.href = "admin.html"; // ← update path
    }, 1500);

  } catch (error) {
    console.error("Login error:", error.code, error.message);
    const messages = {
      "auth/user-not-found":     "No account found with that email.",
      "auth/wrong-password":     "Incorrect password. Try again.",
      "auth/invalid-email":      "Please enter a valid email address.",
      "auth/invalid-credential": "Invalid email or password.",
      "auth/too-many-requests":  "Too many attempts. Please try again later."
    };
    document.getElementById('email').classList.add('error');
    document.getElementById('password').classList.add('error');
    toast(messages[error.code] || error.message, 'error');
  }
});

// ============================
// FORGOT PASSWORD
// ============================
document.getElementById('forgotBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();

  if (!email) {
    toast('Enter your email first, then click forgot.', 'error');
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    toast('Password reset email sent to ' + email, 'success');
  } catch (error) {
    toast(error.message, 'error');
  }
});