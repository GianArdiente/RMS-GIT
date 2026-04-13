// ============================
// FIREBASE IMPORTS
// ============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } 
from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

import { getFirestore, doc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";


// ============================
// FIREBASE INIT
// ============================
const firebaseConfig = {
  apiKey: "AIzaSyD0g9EfP0DPIR7skzKOZ0DyWLlUi5f5LlM",
  authDomain: "rmsautoshop.firebaseapp.com",
  projectId: "rmsautoshop",
  storageBucket: "rmsautoshop.firebasestorage.app",
  messagingSenderId: "699636102924",
  appId: "1:699636102924:web:1c25aba93b61fd86047b29"
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
// REMEMBER ME
// ============================
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('loginEmail');
  if (saved) {
    document.getElementById('email').value = saved;
    document.getElementById('remember').checked = true;
  }
});


// ============================
// MULTI ROLE LOGIN
// ============================
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    toast("Enter email and password", "error");
    return;
  }

  toast("Authenticating...", "success");

  try {

    // STEP 1 — AUTH LOGIN
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    console.log("Logged UID:", uid);

    // =============================
    // CHECK ADMIN
    // =============================
    const adminRef = doc(db, "User", "Admin", "Admins", "Admin-ADM-0001");
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists() && adminSnap.data().uid === uid) {

      remember(email);
      toast("Admin login success", "success");

      setTimeout(()=>{
        window.location.href = "Admin.html";
      },1000);

      return;
    }

    // =============================
    // CHECK STAFF
    // =============================
    const staffRef = doc(db, "User", "Staff", "Staffs", uid);
    const staffSnap = await getDoc(staffRef);

    if (staffSnap.exists()) {

      remember(email);
      toast("Staff login success", "success");

      setTimeout(()=>{
        window.location.href = "../../Staff/Offcial/posting.html";
      },1000);

      return;
    }

    // =============================
    // CHECK TECHNICIAN
    // =============================
    const techRef = doc(db, "User", "Technician", "Technicians", uid);
    const techSnap = await getDoc(techRef);

    if (techSnap.exists()) {

      remember(email);
      toast("Technician login success", "success");

      setTimeout(()=>{
        window.location.href = "Technician.html";
      },1000);

      return;
    }

    // =============================
    // NO ROLE FOUND
    // =============================
    await signOut(auth);
    toast("No role assigned to this account.", "error");

  } catch (error) {

    console.error(error);

    const messages = {
      "auth/user-not-found": "No account found.",
      "auth/wrong-password": "Wrong password.",
      "auth/invalid-email": "Invalid email.",
      "auth/invalid-credential": "Invalid login credentials.",
      "auth/too-many-requests": "Too many attempts."
    };

    toast(messages[error.code] || error.message, "error");
  }
});


// ============================
// REMEMBER FUNCTION
// ============================
function remember(email) {
  if (document.getElementById('remember').checked) {
    localStorage.setItem("loginEmail", email);
  } else {
    localStorage.removeItem("loginEmail");
  }
}


// ============================
// FORGOT PASSWORD
// ============================
document.getElementById('forgotBtn').addEventListener('click', async () => {

  const email = document.getElementById('email').value.trim();

  if (!email) {
    toast("Enter email first", "error");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    toast("Reset email sent", "success");
  } catch (error) {
    toast(error.message, "error");
  }

});