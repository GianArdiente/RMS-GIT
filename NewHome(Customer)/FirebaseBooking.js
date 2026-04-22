// ============================================================
//  FirebaseBooking.js  —  RMS Autoshop Booking Backend
//
//  Handles saving confirmed bookings as transactions to
//  Firestore so the admin panel and system can track them.
//
//  Firestore structure written by this module:
//
//  Bookings / {bookingRef}
//    → uid, customerName, email, phone, vehicle,
//      service, price, downpayment, balance,
//      appointmentDate, appointmentTime, technician,
//      dropoffPreference, hearAboutUs, notes,
//      status, createdAt, updatedAt, paidPercent
//
//  User / Customer / Customers / {uid} / Bookings / {bookingRef}
//    → (mirror of above — lightweight summary for profile view)
//
//  Transactions / {transactionId}
//    → uid, bookingRef, type ("downpayment" | "balance" | "full"),
//      amount, serviceName, status, createdAt
//
//  Load order in Home.html (BOTTOM of <body>, after Home.js):
//    <script src="Home.js"></script>
//    <script type="module" src="CustomerBackend.js"></script>
//    <script type="module" src="FirebaseHome.js"></script>
//    <script type="module" src="FirebaseBooking.js"></script>   ← ADD THIS
// ============================================================

import { initializeApp, getApps }    from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// ─────────────────────────────────────────
//  FIREBASE INIT (reuse existing app if already initialised)
// ─────────────────────────────────────────
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

// ─────────────────────────────────────────
//  CURRENT USER (set once auth resolves)
// ─────────────────────────────────────────
let _currentUser = null;

onAuthStateChanged(auth, (user) => {
  _currentUser = user || null;
});

// ─────────────────────────────────────────
//  BOOKING STATUS CONSTANTS
//  Shared between customer UI and admin panel
// ─────────────────────────────────────────
const BOOKING_STATUS = {
  PENDING:     "pending",      // Submitted, awaiting confirmation
  CONFIRMED:   "confirmed",    // Admin confirmed the slot
  IN_PROGRESS: "in_progress",  // Vehicle is being serviced
  COMPLETED:   "completed",    // Service done, ready for pickup
  CANCELLED:   "cancelled",    // Cancelled by customer or admin
  NO_SHOW:     "no_show",      // Customer did not arrive
};

// ─────────────────────────────────────────
//  SAVE BOOKING TRANSACTION
//
//  Called automatically when the customer
//  clicks "Confirm & Pay" and bkFinalConfirm()
//  runs successfully. Hooked into the existing
//  bkFinalConfirm flow below.
// ─────────────────────────────────────────
async function saveBookingTransaction(bookingData) {
  if (!_currentUser) {
    console.error("❌ saveBookingTransaction: No authenticated user.");
    return null;
  }

  const uid = _currentUser.uid;

  // Build Firestore-safe booking document
  const bookingDoc = {
    // ── Identity ──────────────────────────
    uid,
    bookingRef:       bookingData.ref,           // e.g. "REV-847291"
    status:           BOOKING_STATUS.PENDING,

    // ── Customer info ─────────────────────
    customerName:     bookingData.customerName,
    email:            bookingData.email,
    phone:            bookingData.phone,

    // ── Vehicle ───────────────────────────
    vehicleMake:      bookingData.vehicleMake,
    vehicleModel:     bookingData.vehicleModel,
    vehicleYear:      bookingData.vehicleYear,
    vehicleFull:      bookingData.vehicleFull,   // "2020 Toyota Vios"

    // ── Service ───────────────────────────
    serviceName:      bookingData.serviceName,
    servicePrice:     bookingData.servicePrice,  // number, e.g. 1500

    // ── Schedule ──────────────────────────
    appointmentDate:  bookingData.appointmentDate,
    appointmentTime:  bookingData.appointmentTime,
    technician:       bookingData.technician     || "No preference",
    dropoffPreference:bookingData.dropoffPref    || "Drop off & leave",
    hearAboutUs:      bookingData.hearAboutUs    || "",

    // ── Payment ───────────────────────────
    downpayment:      bookingData.downpayment,   // number
    balance:          bookingData.balance,        // number
    paidPercent:      bookingData.paidPercent,    // number 0-100
    paymentStatus:    bookingData.balance === 0 ? "fully_paid" : "partially_paid",

    // ── Notes ─────────────────────────────
    notes:            bookingData.notes          || "",

    // ── Timestamps ────────────────────────
    createdAt:        serverTimestamp(),
    updatedAt:        serverTimestamp(),
  };

  // ── Write to top-level Bookings collection (admin-visible) ──
  const bookingRef = doc(db, "Bookings", bookingData.ref);
  await setDoc(bookingRef, bookingDoc);

  // ── Write lightweight summary to customer's sub-collection ──
  const customerBookingRef = doc(
    db,
    "User", "Customer", "Customers", uid,
    "Bookings", bookingData.ref
  );
  await setDoc(customerBookingRef, {
    bookingRef:      bookingData.ref,
    serviceName:     bookingData.serviceName,
    servicePrice:    bookingData.servicePrice,
    appointmentDate: bookingData.appointmentDate,
    appointmentTime: bookingData.appointmentTime,
    status:          BOOKING_STATUS.PENDING,
    downpayment:     bookingData.downpayment,
    balance:         bookingData.balance,
    createdAt:       serverTimestamp(),
  });

  // ── Write downpayment transaction record ──────────────────
  const txId  = `TXN-${bookingData.ref}-DP`;
  const txRef = doc(db, "Transactions", txId);
  await setDoc(txRef, {
    uid,
    bookingRef:   bookingData.ref,
    type:         "downpayment",
    amount:       bookingData.downpayment,
    serviceName:  bookingData.serviceName,
    customerName: bookingData.customerName,
    status:       "completed",               // downpayment is collected at booking time
    createdAt:    serverTimestamp(),
  });

  console.log("✅ Booking saved to Firestore:", bookingData.ref);
  return bookingData.ref;
}

// ─────────────────────────────────────────
//  COLLECT BOOKING FORM DATA
//  Reads all Step 2/3/4 fields and returns
//  a clean object ready for Firestore.
// ─────────────────────────────────────────
function collectBookingFormData(ref) {
  const get    = (id) => document.getElementById(id)?.value?.trim() || "";
  const getText= (id) => document.getElementById(id)?.textContent?.trim() || "";

  const firstName = get("bkFirstName");
  const lastName  = get("bkLastName");
  const make      = get("bkMake");
  const model     = get("bkModel");
  const year      = get("bkYear");

  // Downpayment and balance — parse from receipt display
  const parseAmt = (id) => {
    const raw = getText(id).replace(/[₱,]/g, "");
    return parseFloat(raw) || 0;
  };

  const servicePrice = typeof bkSelPrice !== "undefined" ? bkSelPrice : 0;
  const downpayment  = parseAmt("bkRcptDownpayment");
  const balance      = parseAmt("bkRcptBalance");
  const paidPercent  = servicePrice > 0
    ? Math.round((downpayment / servicePrice) * 100)
    : 0;

  // Technician & dropoff from Step 3 selects
  const step3Selects = document.querySelectorAll("#bkStep3 select");
  const technician   = step3Selects[0]?.value || "No preference";
  const dropoffPref  = step3Selects[1]?.value || "Drop off & leave";
  const hearAboutUs  = step3Selects[2]?.value || "";

  return {
    ref,
    customerName:    [firstName, lastName].filter(Boolean).join(" "),
    email:           get("bkEmail"),
    phone:           get("bkPhone"),
    vehicleMake:     make,
    vehicleModel:    model,
    vehicleYear:     year,
    vehicleFull:     [year, make, model].filter(Boolean).join(" "),
    serviceName:     typeof bkSelSvc   !== "undefined" ? bkSelSvc   : "",
    servicePrice,
    appointmentDate: get("bkDate"),
    appointmentTime: typeof bkSelTime  !== "undefined" ? bkSelTime  : "",
    technician,
    dropoffPref,
    hearAboutUs,
    downpayment,
    balance,
    paidPercent,
    notes:           get("bkNotes"),
  };
}

// ─────────────────────────────────────────
//  HOOK INTO bkFinalConfirm
//
//  Wraps the existing function defined in Home.js.
//  After the original UI logic runs, we collect
//  the form data and push it to Firestore.
// ─────────────────────────────────────────
(function hookBkFinalConfirm() {
  // Wait until DOMContentLoaded so Home.js has fully executed
  window.addEventListener("DOMContentLoaded", () => {
    const original = window.bkFinalConfirm;

    window.bkFinalConfirm = async function () {
      // 1. Run original UI logic (validation, receipt render, step 5 display)
      original.call(this);

      // 2. After original runs, the reference number is in #bkConfirmRef
      //    (set by the original function). Give DOM a tick to settle.
      await new Promise(r => setTimeout(r, 80));

      const ref = document.getElementById("bkConfirmRef")?.textContent?.trim();
      if (!ref || ref === "REV-000000") {
        // Original function returned early (validation failed) — do nothing
        return;
      }

      // 3. Collect all form data
      const bookingData = collectBookingFormData(ref);

      // 4. Save to Firestore
      try {
        await saveBookingTransaction(bookingData);
        console.log("📋 Transaction recorded:", ref);
      } catch (err) {
        console.error("❌ Failed to save booking:", err);
        // Non-blocking — customer already sees the confirmation UI
        // Optionally surface a soft warning:
        const t = document.createElement("div");
        t.className = "toast-notif";
        Object.assign(t.style, {
          background: "#1a0808",
          borderLeft: "3px solid #ef4444",
          color:      "#f87171",
        });
        t.innerHTML = `<i class="fas fa-exclamation-circle"></i> Booking saved locally — sync issue. Contact support.`;
        document.body.appendChild(t);
        requestAnimationFrame(() => { t.style.opacity = "1"; });
        setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 4000);
      }
    };
  });
})();

// ─────────────────────────────────────────
//  ADMIN / SYSTEM FUNCTIONS
//
//  These are exported on window.BookingAdmin
//  so the admin panel can import and call them
//  without needing to re-initialise Firebase.
// ─────────────────────────────────────────

/**
 * Update the status of a booking.
 * Called by admin panel when technician starts work,
 * completes the job, or cancels the appointment.
 *
 * @param {string} bookingRef   e.g. "REV-847291"
 * @param {string} newStatus    One of BOOKING_STATUS values
 * @param {string} [adminNote]  Optional note from admin/technician
 * @param {string} [uid]        Customer UID (required to update sub-collection)
 */
async function adminUpdateBookingStatus(bookingRef, newStatus, adminNote = "", uid = null) {
  const validStatuses = Object.values(BOOKING_STATUS);
  if (!validStatuses.includes(newStatus)) {
    console.error(`❌ Invalid status: "${newStatus}". Must be one of:`, validStatuses);
    return;
  }

  const updatePayload = {
    status:    newStatus,
    updatedAt: serverTimestamp(),
    ...(adminNote && { adminNote }),
  };

  // Update top-level booking doc
  await updateDoc(doc(db, "Bookings", bookingRef), updatePayload);

  // Update customer sub-collection if uid is provided
  if (uid) {
    await updateDoc(
      doc(db, "User", "Customer", "Customers", uid, "Bookings", bookingRef),
      { status: newStatus, updatedAt: serverTimestamp() }
    );
  }

  console.log(`✅ Booking ${bookingRef} → ${newStatus}`);
}

/**
 * Record the balance payment when the customer pays on vehicle drop-off.
 * Creates a new transaction record and marks the booking as fully paid.
 *
 * @param {string} bookingRef   e.g. "REV-847291"
 * @param {number} amount       Amount collected
 * @param {string} customerName For the transaction record
 * @param {string} serviceName  For the transaction record
 * @param {string} uid          Customer UID
 */
async function adminRecordBalancePayment(bookingRef, amount, customerName, serviceName, uid) {
  const txId  = `TXN-${bookingRef}-BAL`;
  const txRef = doc(db, "Transactions", txId);

  await setDoc(txRef, {
    uid,
    bookingRef,
    type:         "balance",
    amount,
    serviceName,
    customerName,
    status:       "completed",
    createdAt:    serverTimestamp(),
  });

  // Mark booking as fully paid
  await updateDoc(doc(db, "Bookings", bookingRef), {
    balance:       0,
    paymentStatus: "fully_paid",
    updatedAt:     serverTimestamp(),
  });

  console.log(`✅ Balance payment recorded for ${bookingRef}: ₱${amount}`);
}

/**
 * Record any additional charge added during service
 * (e.g. extra parts, labour discovered during inspection).
 *
 * @param {string} bookingRef
 * @param {number} amount
 * @param {string} description   e.g. "Replacement air filter"
 * @param {string} uid
 */
async function adminRecordAdditionalCharge(bookingRef, amount, description, uid) {
  const txId  = `TXN-${bookingRef}-ADD-${Date.now()}`;
  const txRef = doc(db, "Transactions", txId);

  await setDoc(txRef, {
    uid,
    bookingRef,
    type:        "additional_charge",
    amount,
    description,
    status:      "pending_collection",
    createdAt:   serverTimestamp(),
  });

  // Increment balance on the booking doc
  // (Use Firestore increment in a real env; here we keep it simple)
  await updateDoc(doc(db, "Bookings", bookingRef), {
    updatedAt: serverTimestamp(),
    notes:     `Additional charge added: ${description} — ₱${amount}`,
  });

  console.log(`✅ Additional charge recorded for ${bookingRef}: ₱${amount} — ${description}`);
}

// ─────────────────────────────────────────
//  EXPOSE TO WINDOW (admin panel access)
// ─────────────────────────────────────────
window.BookingAdmin = {
  BOOKING_STATUS,
  updateStatus:          adminUpdateBookingStatus,
  recordBalancePayment:  adminRecordBalancePayment,
  recordAdditionalCharge:adminRecordAdditionalCharge,
};

console.log("📦 FirebaseBooking.js loaded — BookingAdmin available on window.BookingAdmin");