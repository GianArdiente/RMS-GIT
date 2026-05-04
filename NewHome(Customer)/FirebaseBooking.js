// ============================================================
//  FirebaseBooking.js  —  RMS Autoshop Booking Backend (v2)
//
//  ARCHITECTURE CHANGE (v2):
//  The old hook-based approach (wrapping window.bkFinalConfirm)
//  raced against CustomerBackend.js's own wrapper and fired
//  before bkFinalize() had written the ref to the DOM, so
//  the ref read was always empty and the write was skipped.
//
//  New approach: bkFinalize() in Home.js calls
//  window.BookingDB.save(ref, paymentInfo) directly.
//  Single call, single write, no race conditions.
//
//  Firestore structure:
//
//  Bookings / {bookingRef}
//    uid, customerName, email, phone,
//    vehicleMake, vehicleModel, vehicleYear, vehicleFull,
//    serviceName, servicePrice,
//    appointmentDate, appointmentTime, technician,
//    dropoffPreference, hearAboutUs, notes,
//    downpayment, balance, paidPercent, paymentStatus,
//    paymentMethod, paymentMethodLabel, paymentDetails,
//    status, createdAt, updatedAt
//
//  User/Customer/Customers/{uid}/Bookings/{bookingRef}
//    (lightweight mirror — same fields minus heavy ones)
//
//  Transactions / TXN-{bookingRef}-DP
//    uid, bookingRef, type, amount, serviceName,
//    customerName, paymentMethod, paymentMethodLabel,
//    paymentDetails, status, createdAt
// ============================================================

import { initializeApp, getApps }     from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// ── Firebase init (reuse shared app) ─────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyD0g9EfP0DPIR7skzKOZ0DyWLlUi5f5LlM",
  authDomain:        "rmsautoshop.firebaseapp.com",
  projectId:         "rmsautoshop",
  storageBucket:     "rmsautoshop.firebasestorage.app",
  messagingSenderId: "699636102924",
  appId:             "1:699636102924:web:1c25aba93b61fd86047b29",
};

const app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

console.log("[FirebaseBooking] SDK: 12.11.0 | app:", app.name);

// ── Auth state ────────────────────────────────────────────────
let _currentUser = null;
onAuthStateChanged(auth, (user) => { _currentUser = user || null; });

// ── Status constants ──────────────────────────────────────────
const BOOKING_STATUS = {
  PENDING:     "pending",
  CONFIRMED:   "confirmed",
  IN_PROGRESS: "in_progress",
  COMPLETED:   "completed",
  CANCELLED:   "cancelled",
  NO_SHOW:     "no_show",
};

// ── Firestore ref helpers ─────────────────────────────────────
const bookingDocRef    = (ref)       => doc(db, "Bookings", ref);
const customerBkRef    = (uid, ref)  => doc(db, "User", "Customer", "Customers", uid, "Bookings", ref);
const transactionDocRef= (ref)       => doc(db, "Transactions", `TXN-${ref}-DP`);

// ─────────────────────────────────────────────────────────────
//  CORE SAVE — called directly by bkFinalize() in Home.js
//
//  @param {string} bookingRef    e.g. "REV-847291"
//  @param {object} paymentInfo   { method, methodLabel, details }
// ─────────────────────────────────────────────────────────────
async function saveBooking(bookingRef, paymentInfo = {}) {
  if (!_currentUser) {
    console.error("[FirebaseBooking] ❌ No authenticated user — booking not saved.");
    return null;
  }

  const uid = _currentUser.uid;

  // ── Collect form values ──────────────────────────────────
  const get     = (id) => document.getElementById(id)?.value?.trim()       || "";
  const getText = (id) => document.getElementById(id)?.textContent?.trim() || "";

  const parseAmt = (id) => {
    const raw = getText(id).replace(/[₱,\s]/g, "");
    return parseFloat(raw) || 0;
  };

  const firstName   = get("bkFirstName");
  const lastName    = get("bkLastName");
  const customerName= [firstName, lastName].filter(Boolean).join(" ");
  const make        = get("bkMake");
  const model       = get("bkModel");
  const year        = get("bkYear");

  const servicePrice = typeof window.bkSelPrice !== "undefined" ? Number(window.bkSelPrice) : 0;
  const downpayment  = parseAmt("bkRcptDownpayment");
  const balance      = parseAmt("bkRcptBalance");
  const paidPercent  = servicePrice > 0 ? Math.round((downpayment / servicePrice) * 100) : 0;

  const step3Selects = document.querySelectorAll("#bkStep3 select");
  const technician   = step3Selects[0]?.value || "No preference";
  const dropoffPref  = step3Selects[1]?.value || "Drop off & leave";
  const hearAboutUs  = step3Selects[2]?.value || "";

  const safePayment = {
    method:      paymentInfo.method      || "unknown",
    methodLabel: paymentInfo.methodLabel || "Unknown",
    details:     paymentInfo.details     || {},
  };

  // ── Build the main booking document ──────────────────────
  const bookingDoc = {
    uid,
    bookingRef,
    status:            BOOKING_STATUS.PENDING,

    customerName,
    email:             get("bkEmail"),
    phone:             get("bkPhone"),

    vehicleMake:       make,
    vehicleModel:      model,
    vehicleYear:       year,
    vehicleFull:       [year, make, model].filter(Boolean).join(" "),

    serviceName:       typeof window.bkSelSvc !== "undefined" ? window.bkSelSvc : "",
    servicePrice,

    appointmentDate:   get("bkDate"),
    appointmentTime:   typeof window.bkSelTime !== "undefined" ? window.bkSelTime : "",
    technician,
    dropoffPreference: dropoffPref,
    hearAboutUs,

    downpayment,
    balance,
    paidPercent,
    paymentStatus:     balance === 0 ? "fully_paid" : "partially_paid",

    paymentMethod:      safePayment.method,
    paymentMethodLabel: safePayment.methodLabel,
    paymentDetails:     safePayment.details,

    notes:             get("bkNotes"),

    createdAt:         serverTimestamp(),
    updatedAt:         serverTimestamp(),
  };

  // ── Write all three docs ──────────────────────────────────
  try {
    // 1. Top-level Bookings collection (admin-visible)
    await setDoc(bookingDocRef(bookingRef), bookingDoc);
    console.log("[FirebaseBooking] ✅ Bookings/" + bookingRef + " written.");

    // 2. Customer sub-collection summary
    await setDoc(customerBkRef(uid, bookingRef), {
      bookingRef,
      serviceName:        bookingDoc.serviceName,
      servicePrice:       bookingDoc.servicePrice,
      appointmentDate:    bookingDoc.appointmentDate,
      appointmentTime:    bookingDoc.appointmentTime,
      status:             BOOKING_STATUS.PENDING,
      downpayment:        bookingDoc.downpayment,
      balance:            bookingDoc.balance,
      paidPercent:        bookingDoc.paidPercent,
      paymentStatus:      bookingDoc.paymentStatus,
      paymentMethod:      safePayment.method,
      paymentMethodLabel: safePayment.methodLabel,
      vehicleFull:        bookingDoc.vehicleFull,
      customerName:       bookingDoc.customerName,
      createdAt:          serverTimestamp(),
      updatedAt:          serverTimestamp(),
    });
    console.log("[FirebaseBooking] ✅ Customers/" + uid + "/Bookings/" + bookingRef + " written.");

    // 3. Downpayment transaction record
    await setDoc(transactionDocRef(bookingRef), {
      uid,
      bookingRef,
      type:               "downpayment",
      amount:             bookingDoc.downpayment,
      serviceName:        bookingDoc.serviceName,
      customerName:       bookingDoc.customerName,
      paymentMethod:      safePayment.method,
      paymentMethodLabel: safePayment.methodLabel,
      paymentDetails:     safePayment.details,
      status:             "completed",
      createdAt:          serverTimestamp(),
    });
    console.log("[FirebaseBooking] ✅ Transactions/TXN-" + bookingRef + "-DP written.");

    return bookingRef;

  } catch (err) {
    console.error("[FirebaseBooking] ❌ Write failed:", err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
//  ADMIN FUNCTIONS
// ─────────────────────────────────────────────────────────────

async function adminUpdateBookingStatus(bookingRef, newStatus, adminNote = "", uid = null) {
  if (!Object.values(BOOKING_STATUS).includes(newStatus)) {
    console.error(`[FirebaseBooking] ❌ Invalid status: "${newStatus}"`);
    return;
  }
  const payload = {
    status:    newStatus,
    updatedAt: serverTimestamp(),
    ...(adminNote && { adminNote }),
  };
  await updateDoc(bookingDocRef(bookingRef), payload);
  if (uid) {
    await updateDoc(customerBkRef(uid, bookingRef), {
      status:    newStatus,
      updatedAt: serverTimestamp(),
    });
  }
  console.log(`[FirebaseBooking] ✅ ${bookingRef} → ${newStatus}`);
}

async function adminRecordBalancePayment(bookingRef, amount, customerName, serviceName, uid) {
  await setDoc(doc(db, "Transactions", `TXN-${bookingRef}-BAL`), {
    uid, bookingRef,
    type:        "balance",
    amount,
    serviceName,
    customerName,
    status:      "completed",
    createdAt:   serverTimestamp(),
  });
  await updateDoc(bookingDocRef(bookingRef), {
    balance:       0,
    paymentStatus: "fully_paid",
    updatedAt:     serverTimestamp(),
  });
  console.log(`[FirebaseBooking] ✅ Balance payment recorded for ${bookingRef}: ₱${amount}`);
}

async function adminRecordAdditionalCharge(bookingRef, amount, description, uid) {
  await setDoc(doc(db, "Transactions", `TXN-${bookingRef}-ADD-${Date.now()}`), {
    uid, bookingRef,
    type:        "additional_charge",
    amount,
    description,
    status:      "pending_collection",
    createdAt:   serverTimestamp(),
  });
  await updateDoc(bookingDocRef(bookingRef), {
    updatedAt: serverTimestamp(),
    notes:     `Additional charge: ${description} — ₱${amount}`,
  });
  console.log(`[FirebaseBooking] ✅ Additional charge for ${bookingRef}: ₱${amount}`);
}

// ── Public API ────────────────────────────────────────────────
window.BookingDB = {
  save: saveBooking,
};

window.BookingAdmin = {
  BOOKING_STATUS,
  updateStatus:           adminUpdateBookingStatus,
  recordBalancePayment:   adminRecordBalancePayment,
  recordAdditionalCharge: adminRecordAdditionalCharge,
};

console.log("[FirebaseBooking] ✅ Loaded — window.BookingDB.save() ready.");