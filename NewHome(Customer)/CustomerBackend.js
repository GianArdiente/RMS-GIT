/* ══════════════════════════════════════════════════════════════
   REV AUTO REPAIR — CustomerBackend.js
   Syncs the logged-in customer's Firestore profile with the
   Home.js USER object, profile card, topbar, and dropdown.

   Firestore path:
     User / Customer / Customers / {uid}

   What this module does:
   1. Watches Firebase Auth state
   2. On login → loads Firestore doc and hydrates USER + UI
   3. Creates Firestore doc on first-time login (upsert)
   4. saveProfileChanges() → writes back to Firestore
   5. handleLogout() → Firebase signOut
   6. Exposes CustomerDB.reload() and CustomerDB.getUser()
   7. Writes lastLogin timestamp on every session
   8. Listens for real-time Firestore updates (onSnapshot)
══════════════════════════════════════════════════════════════ */

import { initializeApp, getApps }     from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// ─────────────────────────────────────────────
// FIREBASE INIT (reuses existing app if present)
// ─────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyD0g9EfP0DPIR7skzKOZ0DyWLlUi5f5LlM",
  authDomain:        "rmsautoshop.firebaseapp.com",
  projectId:         "rmsautoshop",
  storageBucket:     "rmsautoshop.firebasestorage.app",
  messagingSenderId: "699636102924",
  appId:             "1:699636102924:web:1c25aba93b61fd86047b29"
};

const firebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db   = getFirestore(firebaseApp);

// ─────────────────────────────────────────────
// INTERNAL STATE
// ─────────────────────────────────────────────
let _uid            = null;   // Firebase Auth UID
let _unsubSnapshot  = null;   // Firestore real-time listener unsubscribe fn
let _isInitialized  = false;  // Prevents double-init

// ─────────────────────────────────────────────
// FIRESTORE DOCUMENT REFERENCE HELPER
// ─────────────────────────────────────────────
function customerRef(uid) {
  return doc(db, "User", "Customer", "Customers", uid);
}

// ─────────────────────────────────────────────
// FIELD MAPPING
// Firestore field name  →  Home.js USER key
// ─────────────────────────────────────────────
const FIELD_MAP = {
  firstName:       "firstName",
  lastName:        "lastName",
  email:           "email",
  email2:          "email2",
  phone:           "phone",
  birthday:        "birthday",
  address:         "address",
  gender:          "gender",
  photoURL:        "photo",
  role:            "role",
  loyaltyPoints:   "loyaltyPoints",
  memberSince:     "memberSince",
  vehicleMake:     "vehicleMake",
  vehicleModel:    "vehicleModel",
  vehicleYear:     "vehicleYear",
  preferredTech:   "preferredTech",
};

// ─────────────────────────────────────────────
// MERGE FIRESTORE DATA INTO HOME.JS USER OBJECT
// ─────────────────────────────────────────────
function mergeToUser(data) {
  if (!window.USER) {
    console.warn("[CustomerDB] window.USER not found — ensure Home.js loaded first.");
    return;
  }

  const u = window.USER;

  // Map every known field
  Object.entries(FIELD_MAP).forEach(([fsKey, userKey]) => {
    if (data[fsKey] !== undefined && data[fsKey] !== null) {
      u[userKey] = data[fsKey];
    }
  });

  // Derive compound fields used by Home.js
  if (data.firstName || data.lastName) {
    const fn = data.firstName || "";
    const ln = data.lastName  || "";
    u.name     = [fn, ln].filter(Boolean).join(" ").trim() || u.name;
    u.initials = u.name
      .split(" ")
      .map(w => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  // Store UID for later writes
  u.uid = _uid;
}

// ─────────────────────────────────────────────
// BUILD FIRESTORE DOCUMENT FROM HOME.JS USER
// Called when creating a new customer doc
// ─────────────────────────────────────────────
function userToFirestore(u, uid, extra = {}) {
  const nameParts  = (u.name || "").trim().split(" ");
  const firstName  = nameParts[0] || "";
  const lastName   = nameParts.slice(1).join(" ") || "";

  return {
    uid,
    firstName,
    lastName,
    email:         u.email        || "",
    email2:        u.email2       || "",
    phone:         u.phone        || "",
    birthday:      u.birthday     || "",
    address:       u.address      || "",
    gender:        u.gender       || "",
    photoURL:      u.photo        || "",
    role:          u.role         || "Customer",
    loyaltyPoints: u.loyaltyPoints ?? 0,
    memberSince:   u.memberSince  || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    vehicleMake:   u.vehicleMake  || "",
    vehicleModel:  u.vehicleModel || "",
    vehicleYear:   u.vehicleYear  || "",
    preferredTech: u.preferredTech|| "",
    createdAt:     extra.createdAt || serverTimestamp(),
    lastLogin:     serverTimestamp(),
    ...extra,
  };
}

// ─────────────────────────────────────────────
// REFRESH ALL UI FROM window.USER
// Calls every Home.js render function that
// depends on USER data
// ─────────────────────────────────────────────
function refreshUI() {
  const u = window.USER;
  if (!u) return;

  // ── Topbar ──
  const topbarName   = document.getElementById("topbarName");
  const topbarRole   = document.getElementById("topbarRole");
  const topbarAvatar = document.getElementById("topbarAvatar");
  const topbarGreet  = document.getElementById("topbarGreet");

  if (topbarName)   topbarName.textContent   = u.name;
  if (topbarRole)   topbarRole.textContent   = u.role;
  if (topbarGreet) {
    const hr    = new Date().getHours();
    const greet = hr < 12 ? "Good Morning" : hr < 18 ? "Good Afternoon" : "Good Evening";
    topbarGreet.textContent = `${greet}, ${u.name.split(" ")[0]} 👋`;
  }

  if (topbarAvatar) _setAvatar(topbarAvatar, u.initials, u.photo);

  // ── Profile Dropdown ──
  const pddAvatar = document.getElementById("pddAvatar");
  const pddName   = document.getElementById("pddName");
  const pddEmail  = document.getElementById("pddEmail");

  if (pddAvatar) _setAvatar(pddAvatar, u.initials, u.photo);
  if (pddName)   pddName.textContent   = u.name;
  if (pddEmail)  pddEmail.textContent  = u.email;

  // ── Profile Card (front face) ──
  const pcFrontImg  = document.getElementById("pcFrontImg");
  const pcBackImg   = document.getElementById("pcBackImg");

  _setProfileCardImg(pcFrontImg, u.photo);
  _setProfileCardImg(pcBackImg,  u.photo);

  _setText("pcFrontName",    u.name);
  _setText("pcFrontRole",    u.role);
  _setText("pcBackName",     u.name);
  _setText("pcBackRole",     u.role);
  _setText("pcPhone",        u.phone);
  _setText("pcEmail",        u.email);

  // ── Profile Card (back face — input fields) ──
  _setVal("pcFieldEmail",  u.email);
  _setVal("pcFieldEmail2", u.email2);
  _setVal("pcFieldPhone",  u.phone);
  _setVal("pcFieldBday",   u.birthday);
  _setVal("pcFieldAddr",   u.address);
  _setVal("pcFieldGender", u.gender);

  // ── Booking form pre-fill ──
  _setVal("bkEmail", u.email);
  const bkNames = (u.name || "").split(" ");
  _setVal("bkFirstName", bkNames[0] || "");
  _setVal("bkLastName",  bkNames.slice(1).join(" ") || "");
  _setVal("bkPhone",     u.phone);
  if (u.vehicleMake) {
    const makeEl = document.getElementById("bkMake");
    if (makeEl) {
      // Try to match option value
      const opt = [...makeEl.options].find(o =>
        o.value.toLowerCase() === u.vehicleMake.toLowerCase()
      );
      if (opt) makeEl.value = opt.value;
    }
    _setVal("bkModel", u.vehicleModel || "");
    const yearEl = document.getElementById("bkYear");
    if (yearEl && u.vehicleYear) {
      const opt = [...yearEl.options].find(o => o.value === String(u.vehicleYear));
      if (opt) yearEl.value = opt.value;
    }
  }

  console.info("[CustomerDB] UI refreshed for:", u.name, "(" + u.email + ")");
}

// ─────────────────────────────────────────────
// INTERNAL UI HELPERS
// ─────────────────────────────────────────────
function _setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val || "";
}

function _setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || "";
}

function _setAvatar(el, initials, photoURL) {
  if (!el) return;
  if (photoURL) {
    // Show actual photo
    el.innerHTML = `<img src="${photoURL}" alt="avatar"
      style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"
      onerror="this.style.display='none'"/>`;
    el.style.background = "transparent";
    el.textContent = "";
  } else {
    // Gold initials fallback
    el.textContent = initials || "?";
    Object.assign(el.style, {
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      fontFamily:     '"Barlow Condensed", sans-serif',
      fontWeight:     "800",
      color:          "#000",
      background:     "linear-gradient(135deg, #A67F38, #D9B573)",
    });
  }
}

function _setProfileCardImg(el, photoURL) {
  if (!el) return;
  if (photoURL) {
    el.src = photoURL;
    el.style.display = "block";
  } else {
    el.src = "";
    el.style.display = "none";
  }
}

// ─────────────────────────────────────────────
// LOAD CUSTOMER FROM FIRESTORE
// ─────────────────────────────────────────────
async function loadCustomer(uid) {
  try {
    const ref  = customerRef(uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      // Document found — merge into USER
      const data = snap.data();
      mergeToUser(data);

      // Update lastLogin silently
      await updateDoc(ref, { lastLogin: serverTimestamp() }).catch(() => {});

      console.info("[CustomerDB] Loaded customer:", data.email || uid);
    } else {
      // First-time login — create document from current USER object
      console.info("[CustomerDB] No document found — creating for uid:", uid);
      const newDoc = userToFirestore(window.USER || {}, uid, {
        createdAt: serverTimestamp(),
      });
      await setDoc(ref, newDoc);
      mergeToUser(newDoc);
    }

    refreshUI();
    _startRealtimeSync(uid);

  } catch (err) {
    console.error("[CustomerDB] loadCustomer error:", err);
  }
}

// ─────────────────────────────────────────────
// REAL-TIME SNAPSHOT LISTENER
// Keeps UI in sync if data changes elsewhere
// (e.g. admin edits customer from Admin panel)
// ─────────────────────────────────────────────
function _startRealtimeSync(uid) {
  // Cancel any previous listener
  if (_unsubSnapshot) { _unsubSnapshot(); _unsubSnapshot = null; }

  _unsubSnapshot = onSnapshot(
    customerRef(uid),
    (snap) => {
      if (!snap.exists()) return;
      mergeToUser(snap.data());
      refreshUI();
      console.info("[CustomerDB] Real-time update received.");
    },
    (err) => {
      console.warn("[CustomerDB] Snapshot listener error:", err.message);
    }
  );
}

// ─────────────────────────────────────────────
// SAVE PROFILE CHANGES BACK TO FIRESTORE
// Overrides Home.js saveProfileChanges()
// ─────────────────────────────────────────────
async function saveProfileToFirestore() {
  if (!_uid) {
    console.warn("[CustomerDB] Cannot save — user not authenticated.");
    if (window.showToast) window.showToast("Not signed in. Changes not saved.", "error");
    return;
  }

  // Read values from the profile card inputs (same as Home.js does)
  const email   = document.getElementById("pcFieldEmail")?.value.trim()  || "";
  const email2  = document.getElementById("pcFieldEmail2")?.value.trim() || "";
  const phone   = document.getElementById("pcFieldPhone")?.value.trim()  || "";
  const bday    = document.getElementById("pcFieldBday")?.value.trim()   || "";
  const addr    = document.getElementById("pcFieldAddr")?.value.trim()   || "";
  const gender  = document.getElementById("pcFieldGender")?.value.trim() || "";

  // Basic validation
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (window.showToast) window.showToast("Invalid email address.", "error");
    return;
  }

  // Build partial update — only fields that have a value
  const updates = {};
  if (email)  updates.email   = email;
  if (email2) updates.email2  = email2;
  if (phone)  updates.phone   = phone;
  if (bday)   updates.birthday = bday;
  if (addr)   updates.address = addr;
  if (gender) updates.gender  = gender;
  updates.updatedAt = serverTimestamp();

  try {
    await updateDoc(customerRef(_uid), updates);

    // Also update window.USER immediately
    if (window.USER) {
      if (email)  window.USER.email    = email;
      if (email2) window.USER.email2   = email2;
      if (phone)  window.USER.phone    = phone;
      if (bday)   window.USER.birthday = bday;
      if (addr)   window.USER.address  = addr;
      if (gender) window.USER.gender   = gender;
    }

    // Restore disabled state on inputs (same as Home.js)
    document.querySelectorAll(".pc-input").forEach(inp => {
      inp.disabled = true;
      inp.style.color        = "";
      inp.style.borderBottom = "";
    });
    const actionBtns = document.getElementById("pcActionBtns");
    if (actionBtns) actionBtns.classList.add("hidden");
    const editBtnTxt = document.getElementById("editBtnTxt");
    if (editBtnTxt) editBtnTxt.textContent = "Edit";

    refreshUI();

    if (window.showToast) window.showToast("Profile saved to cloud ☁️");
    console.info("[CustomerDB] Profile saved for uid:", _uid);

  } catch (err) {
    console.error("[CustomerDB] Save error:", err);
    if (window.showToast) window.showToast("Save failed. Please try again.", "error");
  }
}

// ─────────────────────────────────────────────
// SAVE VEHICLE DETAILS BACK TO FIRESTORE
// Called after booking form step 2 is completed
// ─────────────────────────────────────────────
async function saveVehicleToFirestore(make, model, year) {
  if (!_uid) return;
  try {
    await updateDoc(customerRef(_uid), {
      vehicleMake:  make  || "",
      vehicleModel: model || "",
      vehicleYear:  year  || "",
      updatedAt:    serverTimestamp(),
    });
    if (window.USER) {
      window.USER.vehicleMake  = make;
      window.USER.vehicleModel = model;
      window.USER.vehicleYear  = year;
    }
    console.info("[CustomerDB] Vehicle info saved:", make, model, year);
  } catch (err) {
    console.warn("[CustomerDB] Vehicle save error:", err.message);
  }
}

// ─────────────────────────────────────────────
// LOGOUT — signs out of Firebase and clears state
// Overrides Home.js handleLogout()
// ─────────────────────────────────────────────
async function logoutFromFirebase() {
  if (!confirm("Log out of REV?")) return;
  try {
    // Stop real-time listener
    if (_unsubSnapshot) { _unsubSnapshot(); _unsubSnapshot = null; }
    _uid           = null;
    _isInitialized = false;

    await signOut(auth);
    sessionStorage.clear();

    if (window.showToast) window.showToast("Logged out successfully.");

    // Redirect to login after short delay
    setTimeout(() => {
      window.location.href = "index.html"; // ← update to your login page if needed
    }, 1200);

  } catch (err) {
    console.error("[CustomerDB] Logout error:", err);
    if (window.showToast) window.showToast("Logout failed.", "error");
  }
}

// ─────────────────────────────────────────────
// BOOKING COMPLETION HOOK
// Call CustomerDB.onBookingComplete(bookingData)
// to save the booking reference to the customer doc
// ─────────────────────────────────────────────
async function onBookingComplete(bookingData) {
  if (!_uid) return;
  try {
    const {
      refNo, service, price, downpayment,
      balance, appointmentDate, time,
      vehicleMake, vehicleModel, vehicleYear
    } = bookingData;

    // Save vehicle info while we're here
    if (vehicleMake) {
      await saveVehicleToFirestore(vehicleMake, vehicleModel, vehicleYear);
    }

    // Store latest booking reference on the customer doc
    await updateDoc(customerRef(_uid), {
      lastBookingRef:     refNo        || "",
      lastBookingService: service      || "",
      lastBookingDate:    appointmentDate || "",
      lastBookingAt:      serverTimestamp(),
    });

    console.info("[CustomerDB] Booking saved:", refNo);
  } catch (err) {
    console.warn("[CustomerDB] onBookingComplete error:", err.message);
  }
}

// ─────────────────────────────────────────────
// AUTH STATE OBSERVER — entry point
// Runs once when the module loads
// ─────────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  if (user) {
    _uid           = user.uid;
    _isInitialized = false;

    // Inject the Firebase email into USER if USER exists
    if (window.USER && !window.USER.email && user.email) {
      window.USER.email = user.email;
    }

    await loadCustomer(user.uid);
    _isInitialized = true;

  } else {
    // User signed out
    _uid           = null;
    _isInitialized = false;
    if (_unsubSnapshot) { _unsubSnapshot(); _unsubSnapshot = null; }

    // If we're on the home page and no user, optionally redirect
    // Uncomment the lines below to force redirect on signout:
    // console.warn("[CustomerDB] No authenticated user.");
    // window.location.href = "index.html";
  }
});

// ─────────────────────────────────────────────
// HOME.JS FUNCTION OVERRIDES
// These replace the default stubs in Home.js so
// profile saves and logouts go through Firebase
// ─────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  // Override saveProfileChanges used by pc-save-btn
  window.saveProfileChanges = saveProfileToFirestore;

  // Override handleLogout used by pdd-logout button
  window.handleLogout = logoutFromFirebase;

  // Patch bkFinalConfirm to also save vehicle + booking to Firestore
  const _origBkFinalConfirm = window.bkFinalConfirm;
  if (typeof _origBkFinalConfirm === "function") {
    window.bkFinalConfirm = function () {
      // Run the original Home.js confirm first
      _origBkFinalConfirm();

      // Then save booking + vehicle info to Firestore
      const refEl  = document.getElementById("bkRcptRef");
      const ref    = refEl ? refEl.textContent : "";
      if (!ref || ref === "REV-000000") return; // wasn't submitted yet

      const make  = document.getElementById("bkMake")?.value  || "";
      const model = document.getElementById("bkModel")?.value || "";
      const year  = document.getElementById("bkYear")?.value  || "";
      const svc   = window.bkSelSvc   || "";
      const price = window.bkSelPrice || 0;
      const date  = document.getElementById("bkDate")?.value  || "";
      const time  = window.bkSelTime  || "";
      const pay   = parseFloat(document.getElementById("bkPayAmt")?.value) || 0;

      CustomerDB.onBookingComplete({
        refNo:            ref,
        service:          svc,
        price,
        downpayment:      pay,
        balance:          price - pay,
        appointmentDate:  date,
        time,
        vehicleMake:      make,
        vehicleModel:     model,
        vehicleYear:      year,
      });
    };
  }

  console.info("[CustomerDB] Home.js overrides installed.");
});

// ─────────────────────────────────────────────
// PUBLIC API
// Access via window.CustomerDB
// ─────────────────────────────────────────────
const CustomerDB = {
  /**
   * Manually reload from Firestore (e.g. after external edit).
   */
  reload() {
    if (!_uid) {
      console.warn("[CustomerDB] reload() called but no user is signed in.");
      return Promise.resolve();
    }
    return loadCustomer(_uid);
  },

  /**
   * Returns the current window.USER object.
   */
  getUser() {
    return window.USER || null;
  },

  /**
   * Returns the current Firebase Auth UID.
   */
  getUid() {
    return _uid;
  },

  /**
   * Manually save specific fields to Firestore.
   * Usage: CustomerDB.updateField({ phone: '09171234567' })
   */
  async updateField(fields = {}) {
    if (!_uid) return;
    try {
      await updateDoc(customerRef(_uid), {
        ...fields,
        updatedAt: serverTimestamp(),
      });
      mergeToUser(fields);
      refreshUI();
      console.info("[CustomerDB] Fields updated:", Object.keys(fields).join(", "));
    } catch (err) {
      console.error("[CustomerDB] updateField error:", err);
    }
  },

  /**
   * Called by the booking completion flow.
   */
  onBookingComplete,

  /**
   * Save vehicle info explicitly.
   */
  saveVehicle: saveVehicleToFirestore,

  /**
   * Exposes refreshUI in case you need to force a re-render.
   */
  refreshUI,

  /**
   * Returns whether the module has finished initializing.
   */
  isReady() {
    return _isInitialized;
  },
};

window.CustomerDB = CustomerDB;
export default CustomerDB;