import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// ============================
// Admin Registration Page
// ============================
// FIREBASE INIT
// ============================
const firebaseConfig = {
  apiKey: "AIzaSyD0g9EfP0DPIR7skzKOZ0DyWLlUi5f5LlM",
  authDomain: "rmsautoshop.firebaseapp.com",
  projectId: "rmsautoshop",
  storageBucket: "rmsautoshop.firebasestorage.app",
  messagingSenderId: "699636102924",
  appId: "1:699636102924:web:1c25aba93b61fd86047b29",
  measurementId: "G-S67F105MG4"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ============================
// PASSWORD STRENGTH CHECKER
// ============================
function getPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 6)               score++; // minimum length
  if (pw.length >= 10)              score++; // longer = better
  if (/[A-Z]/.test(pw))             score++; // has uppercase
  if (/[0-9]/.test(pw))             score++; // has number
  if (/[^A-Za-z0-9]/.test(pw))     score++; // has special character

  if (score <= 1) return { label: "Very Weak", color: "#ef4444", bars: 1 };
  if (score === 2) return { label: "Weak",      color: "#f97316", bars: 2 };
  if (score === 3) return { label: "Fair",      color: "#eab308", bars: 3 };
  if (score === 4) return { label: "Strong",    color: "#22c55e", bars: 4 };
  return             { label: "Very Strong", color: "#10b981", bars: 5 };
}

function injectStrengthUI() {
  if (document.getElementById("strengthWrapper")) return;

  const passwordField = document.getElementById("password").closest(".field");

  const wrapper = document.createElement("div");
  wrapper.id = "strengthWrapper";
  wrapper.style.cssText = "width:100%; padding:0 2px;";
  wrapper.innerHTML = `
    <div id="strengthBars" style="display:flex; gap:4px; margin-top:6px;">
      ${[1,2,3,4,5].map(i => `
        <div data-bar="${i}" style="
          flex:1; height:3px; border-radius:2px;
          background:rgba(255,255,255,0.08);
          transition:background .3s;
        "></div>
      `).join("")}
    </div>
    <div id="strengthLabel" style="
      font-family:'Share Tech Mono', monospace;
      font-size:10px; letter-spacing:1.5px;
      color:#777; margin-top:5px;
      text-transform:uppercase;
      transition:color .3s;
    ">Enter a password</div>
  `;

  passwordField.insertAdjacentElement("afterend", wrapper);
}

function updateStrengthUI(pw) {
  const bars  = document.querySelectorAll("#strengthBars [data-bar]");
  const label = document.getElementById("strengthLabel");
  if (!bars.length || !label) return;

  if (!pw) {
    bars.forEach(b => b.style.background = "rgba(255,255,255,0.08)");
    label.textContent = "Enter a password";
    label.style.color = "#777";
    return;
  }

  const { label: text, color, bars: filled } = getPasswordStrength(pw);
  bars.forEach((b, i) => {
    b.style.background = i < filled ? color : "rgba(255,255,255,0.08)";
  });
  label.textContent = `// ${text}`;
  label.style.color = color;
}

// ============================
// DOM READY
// ============================
document.addEventListener("DOMContentLoaded", () => {
  injectStrengthUI();

  document.getElementById("password").addEventListener("input", function () {
    updateStrengthUI(this.value);
  });
});

// ============================
// SIGN UP
// ============================
document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const firstName       = document.getElementById("firstName").value.trim();
  const lastName        = document.getElementById("lastName").value.trim();
  const email           = document.getElementById("email").value.trim();
  const phone           = document.getElementById("phone").value.trim();
  const address         = document.getElementById("address").value.trim();
  const password        = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // ── Field Validation ──
  if (!firstName)           { showToast("Please enter your first name.", "error");            return; }
  if (!lastName)            { showToast("Please enter your last name.", "error");             return; }
  if (!email)               { showToast("Please enter your email address.", "error");         return; }
  if (!phone)               { showToast("Please enter your phone number.", "error");          return; }
  if (!address)             { showToast("Please enter your address.", "error");               return; }
  if (password.length < 6)  { showToast("Password must be at least 6 characters.", "error"); return; }
  if (password !== confirmPassword) { showToast("Passwords do not match.", "error");          return; }

  // ── Password Strength Guard ──
  // If Weak or Very Weak — Firebase is NEVER called
  const strength = getPasswordStrength(password);
  if (strength.bars <= 2) {
    showToast("Password is too weak. Use uppercase, numbers & symbols.", "error");
    updateStrengthUI(password);
    return;
  }

  // ── Firebase Auth + Firestore — only runs if all checks pass ──
  try {
    // Step 1: Create Auth user
    console.log("Creating auth user...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Auth user created:", user.uid);

    // Step 2: Generate Customer ID
    const shortId = "CUST-" + Math.floor(1000 + Math.random() * 9000);
    const docId   = "Customer-" + shortId;   // e.g. Customer-CUST-4821

    // Step 3: Save to Firestore → User > Customer > Customers > {docId}
    console.log("Writing to Firestore:", `User/Customer/Customers/${docId}`);
    await setDoc(doc(db, "User", "Customer", "Customers", docId), {
      uid:       user.uid,
      roleId:    shortId,
      docId:     docId,
      role:      "customer",
      firstName: firstName,
      lastName:  lastName,
      email:     email,
      phone:     phone,
      address:   address,
      createdAt: new Date().toISOString()
    });
    console.log("Firestore save successful →", docId);

    showToast("Account created successfully!", "success");
    setTimeout(() => {
      document.getElementById("signupForm").reset();
      updateStrengthUI(""); // reset strength bar
      showLogin();          // from Login.js
    }, 1500);

  } catch (error) {
    console.error("FULL ERROR:", error);
    const messages = {
      "auth/email-already-in-use": "That email is already registered.",
      "auth/invalid-email":        "Please enter a valid email address.",
      "auth/weak-password":        "Password must be at least 6 characters.",
    };
    showToast(messages[error.code] || error.message, "error");
  }
});

// ============================
// LOGIN
// ============================
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email    = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email)    { showToast("Please enter your email address.", "error"); return; }
  if (!password) { showToast("Please enter your password.", "error");      return; }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showToast("Login successful! Redirecting…", "success");
    setTimeout(() => {
      window.location.href = "../../Homepage(Customer)/Home.html";
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
    showToast(messages[error.code] || error.message, "error");
  }
});

// ============================
// FORGOT PASSWORD
// ============================
document.getElementById("forgotPassword").addEventListener("click", async function () {
  const email = document.getElementById("loginEmail").value.trim();

  if (!email) {
    showToast("Enter your email first, then click forgot.", "error");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showToast("Reset link sent to " + email, "success");
  } catch (error) {
    showToast(error.message, "error");
  }
});