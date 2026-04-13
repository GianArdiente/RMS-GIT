// ============================
// FIREBASE IMPORTS
// ============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";


// ============================
// FIREBASE CONFIG
// ============================
const firebaseConfig = {
  apiKey: "AIzaSyD0g9EfP0DPIR7skzKOZ0DyWLlUi5f5LlM",
  authDomain: "rmsautoshop.firebaseapp.com",
  projectId: "rmsautoshop",
  storageBucket: "rmsautoshop.firebasestorage.app",
  messagingSenderId: "699636102924",
  appId: "1:699636102924:web:1c25aba93b61fd86047b29"
};

// ============================
// INIT FIREBASE
// ============================
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);


// ============================
// ERROR DISPLAY
// ============================
function showAccErr(msg) {
  const el = document.getElementById('accErrMsg');
  el.textContent = msg;
  el.style.display = 'block';
}


// ============================
// TOGGLE PASSWORD
// ============================
function togglePw(id, btn) {
  const inp = document.getElementById(id);
  const show = inp.type === "password";
  inp.type = show ? "text" : "password";
  btn.innerHTML = `<i class="fas fa-${show ? 'eye-slash' : 'eye'}"></i>`;
}


// ============================
// CREATE ACCOUNT (ADMIN)
// ============================
window.saveAccount = async function () {

  const fn    = document.getElementById('accFname').value.trim();
  const ln    = document.getElementById('accLname').value.trim();
  const email = document.getElementById('accEmail').value.trim();
  const pass  = document.getElementById('accPass').value;
  const pass2 = document.getElementById('accPass2').value;
  const role  = document.getElementById('accRole').value;

  const dept   = document.getElementById('accDept').value.trim() || "General";
  const access = document.getElementById('accAccess').value;

  document.getElementById('accErrMsg').style.display = 'none';

  // ============================
  // VALIDATION
  // ============================
  if (!fn || !ln) return showAccErr("First and last name required.");
  if (!email) return showAccErr("Email is required.");
  if (!pass) return showAccErr("Password is required.");
  if (pass.length < 6) return showAccErr("Password must be at least 6 characters.");
  if (pass !== pass2) return showAccErr("Passwords do not match.");

  try {

    // ============================
    // CREATE FIREBASE AUTH USER
    // ============================
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // ============================
    // USER DATA OBJECT
    // ============================
    const userData = {
      uid: user.uid,
      email: email,
      fname: fn,
      lname: ln,
      role: role,
      dept: dept,
      access: access,
      status: "active",
      created: new Date()
    };

    // ============================
    // SAVE BASED ON ROLE
    // ============================
    if (role === "staff") {

      await setDoc(
        doc(db, "User", "Staff", "Staffs", user.uid),
        userData
      );

    } else if (role === "technician") {

      await setDoc(
        doc(db, "User", "Technician", "Technicians", user.uid),
        userData
      );

    } else {
      return showAccErr("Only Staff and Technician allowed.");
    }

    // ============================
    // SUCCESS
    // ============================
    closeModal('accModal');
    showToast("Account created successfully!");

  } catch (error) {

    console.error(error);

    const messages = {
      "auth/email-already-in-use": "Email already registered.",
      "auth/invalid-email": "Invalid email format.",
      "auth/weak-password": "Password is too weak."
    };

    showAccErr(messages[error.code] || error.message);
  }
};