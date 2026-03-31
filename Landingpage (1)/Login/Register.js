import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";

import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";


// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDwbgBGAxCOdP1EVJrcFdsXUmpzuyVr-d4",
  authDomain: "autoshoprms.firebaseapp.com",
  projectId: "autoshoprms",
  storageBucket: "autoshoprms.firebasestorage.app",
  messagingSenderId: "40981952771",
  appId: "1:40981952771:web:3a9e16250b083216f49136",
  measurementId: "G-HWCRQ787G3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// ============================
// SIGN UP
// ============================
document.getElementById("signupForm").addEventListener("submit", function(e){
  e.preventDefault();

  const name = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if(password !== confirmPassword){
    showToast("Passwords do not match", "error");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      showToast("Account created successfully!", "success");

      setTimeout(() => {
        document.getElementById("signupForm").reset();
        showLogin();
      }, 1500);

    })
    .catch((error) => {
      showToast(error.message, "error");
    });

});


// ============================
// LOGIN
// ============================
document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

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
document.getElementById("forgotPassword").addEventListener("click", function(){

  const email = document.getElementById("loginEmail").value;

  if(!email){
    showToast("Enter your email first", "error");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      showToast("Password reset email sent!", "success");
    })
    .catch((error) => {
      showToast(error.message, "error");
    });

});