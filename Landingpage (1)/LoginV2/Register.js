// ============================
// IMPORT FIREBASE
// ============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import { 
  getFirestore, 
  doc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";


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
// INIT
// ============================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ============================
// SIGN UP
// ============================
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName  = document.getElementById("lastName").value.trim();
  const email     = document.getElementById("email").value.trim();
  const phone     = document.getElementById("phone").value.trim();
  const address   = document.getElementById("address").value.trim();
  const password  = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    showToast("Passwords do not match", "error");
    return;
  }

  try {

    // CREATE AUTH USER
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // SAFE ID (NO DUPLICATES EVER)
    const docRef = doc(db, "User/Customer/Customers", user.uid);

    // SAVE FIRESTORE PROFILE
    await setDoc(docRef, {
      uid: user.uid,

      role: "customer",
      roleId: "CUST-" + user.uid.slice(0, 6).toUpperCase(),

      firstName,
      lastName,
      email,
      phone,
      address,

      createdAt: new Date().toISOString()
    });

    showToast("Account created successfully!", "success");

    setTimeout(() => {
      document.getElementById("signupForm").reset();
      showLogin();
    }, 1500);

  } catch (error) {
    showToast(error.message, "error");
  }
});


// ============================
// LOGIN
// ============================
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      showToast("Login successful!", "success");
      setTimeout(() => {
        window.location.href = "../../NewHome(Customer)/Home.html";
      }, 1500);
    })
    .catch((error) => {
      showToast(error.message, "error");
    });
});


// ============================
// FORGOT PASSWORD
// ============================
document.getElementById("forgotPassword").addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value;

  if (!email) {
    showToast("Enter your email first", "error");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => showToast("Password reset email sent!", "success"))
    .catch((error) => showToast(error.message, "error"));
});