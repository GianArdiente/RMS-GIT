// ============================================================
// REV MOTORS — STAFF PORTAL · FIREBASE BACKEND
// staff-firebase.js
// ============================================================
// Drop this file into your project and add to staff.html:
//   <script type="module" src="staff-firebase.js"></script>
// Make sure it loads AFTER transaction.js and other scripts.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
  writeBatch,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";


// ============================================================
// FIREBASE CONFIG
// ============================================================
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

// Active Firestore unsubscribe handles — cleaned up on logout
const _unsubs = [];

// Current logged-in staff object
window.CURRENT_STAFF = null;


// ============================================================
// ============================================================
// 1.  LOGIN  (called from login.html)
// ============================================================
// ============================================================

window.loginStaff = async function (email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid  = cred.user.uid;

    // Must exist in Staff collection
    const snap = await getDoc(doc(db, "User", "Staff", "Staffs", uid));
    if (!snap.exists()) {
      await signOut(auth);
      return { ok: false, error: "Account not found as Staff." };
    }
    const data = snap.data();
    if (data.status !== "active") {
      await signOut(auth);
      return { ok: false, error: "Your account is disabled. Contact admin." };
    }

    window.CURRENT_STAFF = { uid, ...data };
    return { ok: true, staff: window.CURRENT_STAFF };

  } catch (err) {
    const map = {
      "auth/user-not-found":    "Email not registered.",
      "auth/wrong-password":    "Incorrect password.",
      "auth/invalid-email":     "Invalid email format.",
      "auth/too-many-requests": "Too many attempts. Try again later."
    };
    return { ok: false, error: map[err.code] || err.message };
  }
};


// ============================================================
// ============================================================
// 2.  AUTH GUARD — call on DOMContentLoaded in staff.html
// ============================================================
// ============================================================

window.initStaffDashboard = function () {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) { window.location.href = "login.html"; return; }

      const snap = await getDoc(doc(db, "User", "Staff", "Staffs", user.uid));
      if (!snap.exists() || snap.data().status !== "active") {
        await signOut(auth);
        window.location.href = "login.html";
        return;
      }

      window.CURRENT_STAFF = { uid: user.uid, ...snap.data() };
      _patchStaffUI(window.CURRENT_STAFF);

      // Start all real-time listeners
      _listenCustomers();
      _listenBookings();
      _listenTechnicians();
      _listenPosts();
      _listenNotifications(user.uid);
      _listenTransactions();

      resolve(window.CURRENT_STAFF);
    });
  });
};


// ============================================================
// ============================================================
// 3.  SIGN OUT
// ============================================================
// ============================================================

window.staffLogout = async function () {
  _unsubs.forEach(fn => fn());
  await signOut(auth);
  window.location.href = "login.html";
};

// Patch the existing logout() used in the HTML
window.logout = window.staffLogout;


// ============================================================
// ============================================================
// 4.  CUSTOMERS  (/Customers/{uid})
//     Fields: id, fname, lname, email, phone, visits,
//             rating, status, createdAt
// ============================================================
// ============================================================

function _listenCustomers() {
  const q = query(collection(db, "Customers"), orderBy("createdAt", "desc"));
  const unsub = onSnapshot(q, snap => {
    window.customers = snap.docs.map(d => ({
      _fid:    d.id,
      id:      d.data().id      || d.id.slice(0, 6).toUpperCase(),
      name:    `${d.data().fname || ""} ${d.data().lname || ""}`.trim(),
      email:   d.data().email   || "",
      phone:   d.data().phone   || "",
      visits:  d.data().visits  || 0,
      rating:  d.data().rating  || 5.0,
      status:  d.data().status  || "active"
    }));

    if (typeof updateCusStats  === "function") updateCusStats();
    if (typeof applyFilters    === "function") applyFilters();
    if (typeof updateStats     === "function") updateStats();   // dashboard card
    _updateDashboardCustomerCount();
  }, err => console.error("[Customers]", err));
  _unsubs.push(unsub);
}

// ADD
window.addCustomerDB = async function (data) {
  try {
    const ref = await addDoc(collection(db, "Customers"), {
      ...data,
      visits:    data.visits  || 0,
      rating:    data.rating  || 5.0,
      status:    data.status  || "active",
      createdAt: serverTimestamp()
    });
    // Store a short readable ID back into the doc
    await updateDoc(ref, { id: "CU-" + ref.id.slice(0, 5).toUpperCase() });
    showToast("Customer added!", "ok");
    return { ok: true, id: ref.id };
  } catch (e) {
    console.error(e);
    showToast("Failed to add customer.", "error");
    return { ok: false, error: e.message };
  }
};

// UPDATE
window.updateCustomerDB = async function (fid, data) {
  try {
    await updateDoc(doc(db, "Customers", fid), {
      ...data,
      updatedAt: serverTimestamp()
    });
    showToast("Customer updated!", "ok");
    return { ok: true };
  } catch (e) {
    showToast("Failed to update customer.", "error");
    return { ok: false, error: e.message };
  }
};

// DELETE
window.deleteCustomerDB = async function (fid) {
  try {
    await deleteDoc(doc(db, "Customers", fid));
    showToast("Customer removed.", "ok");
    return { ok: true };
  } catch (e) {
    showToast("Failed to delete customer.", "error");
    return { ok: false, error: e.message };
  }
};

// Increment visit count after a completed booking
window.incrementCustomerVisit = async function (fid) {
  try {
    await updateDoc(doc(db, "Customers", fid), { visits: increment(1) });
  } catch (_) {}
};


// ============================================================
// ============================================================
// 5.  BOOKINGS  (/Bookings/{id})
//     Fields: id, customer, vehicle, service, date, time,
//             priority, status, technicianUid, createdAt
// ============================================================
// ============================================================

function _listenBookings() {
  const q = query(collection(db, "Bookings"), orderBy("createdAt", "desc"));
  const unsub = onSnapshot(q, snap => {
    window.bookingQueue = snap.docs.map(d => ({
      _fid:        d.id,
      id:          d.data().id         || d.id.slice(0, 6).toUpperCase(),
      customer:    d.data().customer   || "",
      vehicle:     d.data().vehicle    || "",
      service:     d.data().service    || "",
      date:        _fmtDate(d.data().date),
      time:        d.data().time       || "",
      priority:    d.data().priority   || "Normal",
      status:      d.data().status     || "unassigned",
      assignedTo:  d.data().technicianId || null,
      notes:       d.data().notes      || ""
    }));

    if (typeof renderBookingQueue === "function") renderBookingQueue();
    if (typeof renderTechRoster   === "function") renderTechRoster();
    if (typeof renderRecent       === "function") renderRecent();
    if (typeof renderBkList       === "function") renderBkList();
    _updateBkStats();
    _updateTechStats();
  }, err => console.error("[Bookings]", err));
  _unsubs.push(unsub);
}

// CREATE booking (admin/staff)
window.createBookingDB = async function (data) {
  try {
    const ref = await addDoc(collection(db, "Bookings"), {
      ...data,
      status:    "unassigned",
      createdAt: serverTimestamp()
    });
    await updateDoc(ref, { id: "BK-" + ref.id.slice(0, 5).toUpperCase() });
    showToast("Booking created!", "ok");
    return { ok: true };
  } catch (e) {
    showToast("Failed to create booking.", "error");
    return { ok: false, error: e.message };
  }
};

// ASSIGN booking to a technician
window.assignBookingDB = async function (bookingFid, techFid, techId, priority, notes) {
  try {
    const batch = writeBatch(db);
    batch.update(doc(db, "Bookings", bookingFid), {
      status:      "assigned",
      technicianId: techId,
      priority,
      notes:       notes || "",
      assignedAt:  serverTimestamp()
    });
    // Mark technician as busy
    batch.update(doc(db, "Technicians", techFid), { status: "busy" });
    await batch.commit();
    showToast("Booking assigned!", "ok");
    return { ok: true };
  } catch (e) {
    showToast("Failed to assign booking.", "error");
    return { ok: false, error: e.message };
  }
};

// UNASSIGN
window.unassignBookingDB = async function (bookingFid, techFid) {
  try {
    await updateDoc(doc(db, "Bookings", bookingFid), {
      status:      "unassigned",
      technicianId: null,
      assignedAt:  null
    });
    // Check if tech has remaining bookings
    const q = query(
      collection(db, "Bookings"),
      where("technicianId", "==", techFid),
      where("status", "==", "assigned")
    );
    const remaining = await getDocs(q);
    if (remaining.empty) {
      await updateDoc(doc(db, "Technicians", techFid), { status: "available" });
    }
    showToast("Booking unassigned.", "ok");
    return { ok: true };
  } catch (e) {
    showToast("Failed to unassign.", "error");
    return { ok: false, error: e.message };
  }
};

// UPDATE booking status (confirm / cancel / complete)
window.updateBookingStatusDB = async function (bookingFid, newStatus) {
  try {
    await updateDoc(doc(db, "Bookings", bookingFid), {
      status:    newStatus,
      updatedAt: serverTimestamp()
    });
    showToast(`Booking ${newStatus}.`, "ok");
    return { ok: true };
  } catch (e) {
    showToast("Failed to update status.", "error");
    return { ok: false, error: e.message };
  }
};


// ============================================================
// ============================================================
// 6.  TECHNICIANS  (/Technicians/{uid})
//     Fields: name, initials, role, status, specialties,
//             color, gradient, createdAt
// ============================================================
// ============================================================

function _listenTechnicians() {
  const q = query(collection(db, "Technicians"), orderBy("name", "asc"));
  const unsub = onSnapshot(q, snap => {
    window.technicians = snap.docs.map(d => ({
      _fid:        d.id,
      id:          d.data().id         || d.id,
      name:        d.data().name       || "Unknown",
      initials:    d.data().initials   || "?",
      role:        d.data().role       || "Technician",
      status:      d.data().status     || "available",
      specialties: d.data().specialties|| [],
      color:       d.data().color      || "#A67F38",
      gradient:    d.data().gradient   || "linear-gradient(135deg,#A67F38,#D9B573)",
      tasks:       []
    }));

    if (typeof renderTechRoster   === "function") renderTechRoster();
    if (typeof renderBookingQueue === "function") renderBookingQueue();
    _updateTechStats();
  }, err => console.error("[Technicians]", err));
  _unsubs.push(unsub);
}

// UPDATE technician status (available / busy / on-break)
window.updateTechStatusDB = async function (techFid, status) {
  try {
    await updateDoc(doc(db, "Technicians", techFid), { status, updatedAt: serverTimestamp() });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
};


// ============================================================
// ============================================================
// 7.  POSTS  (/Posts/{id})
//     Fields: type, title, content, excerpt, image,
//             featured, status, scheduledFor, createdAt
// ============================================================
// ============================================================

function _listenPosts() {
  const q = query(collection(db, "Posts"), orderBy("createdAt", "desc"));
  const unsub = onSnapshot(q, snap => {
    window.posts = snap.docs.map(d => ({
      _fid:     d.id,
      id:       d.data().localId   || d.id,
      type:     d.data().type      || "News",
      title:    d.data().title     || "",
      content:  d.data().content   || "",
      excerpt:  d.data().excerpt   || "",
      image:    d.data().image     || "",
      featured: d.data().featured  || false,
      status:   d.data().status    || "draft",
      date:     _fmtTimestamp(d.data().createdAt) || d.data().date || "—"
    }));

    _updatePostStats();
    if (typeof renderPostsList === "function") renderPostsList();
    if (typeof updateStats     === "function") updateStats();
    if (typeof updatePostStats === "function") updatePostStats();
  }, err => console.error("[Posts]", err));
  _unsubs.push(unsub);
}

// PUBLISH
window.publishPostDB = async function (data) {
  try {
    const ref = await addDoc(collection(db, "Posts"), {
      ...data,
      localId:   Date.now(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { ok: true, id: ref.id };
  } catch (e) {
    showToast("Failed to publish.", "error");
    return { ok: false, error: e.message };
  }
};

// UPDATE existing post
window.updatePostDB = async function (fid, data) {
  try {
    await updateDoc(doc(db, "Posts", fid), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { ok: true };
  } catch (e) {
    showToast("Failed to update post.", "error");
    return { ok: false, error: e.message };
  }
};

// DELETE
window.deletePostDB = async function (fid) {
  try {
    await deleteDoc(doc(db, "Posts", fid));
    showToast("Post deleted.", "error");
    return { ok: true };
  } catch (e) {
    showToast("Failed to delete post.", "error");
    return { ok: false, error: e.message };
  }
};

// TOGGLE status cycle
window.togglePostStatusDB = async function (fid, currentStatus) {
  const cycle = { live: "draft", draft: "live", scheduled: "live" };
  const next  = cycle[currentStatus] || "live";
  try {
    await updateDoc(doc(db, "Posts", fid), { status: next, updatedAt: serverTimestamp() });
    showToast(`Status → ${next}`, "ok");
    return { ok: true, status: next };
  } catch (e) {
    return { ok: false, error: e.message };
  }
};


// ============================================================
// ============================================================
// 8.  NOTIFICATIONS  (/Notifications/{uid}/Items/{id})
// ============================================================
// ============================================================

function _listenNotifications(uid) {
  const q = query(
    collection(db, "Notifications", uid, "Items"),
    orderBy("createdAt", "desc")
  );
  const unsub = onSnapshot(q, snap => {
    window.D = window.D || {};
    window.D.notifs = snap.docs.map(d => ({
      _fid:  d.id,
      id:    d.id,
      icon:  d.data().icon  || "fa-bell",
      color: d.data().color || "#A67F38",
      bg:    d.data().bg    || "rgba(166,127,56,.15)",
      text:  d.data().text  || "",
      time:  _relativeTime(d.data().createdAt),
      tag:   d.data().tag   || "System",
      read:  d.data().read  || false
    }));

    if (typeof renderNotifs === "function") renderNotifs();
  }, err => console.error("[Notifs]", err));
  _unsubs.push(unsub);
}

// Mark single notification as read
window.markNotifRead = async function (uid, notifFid) {
  try {
    await updateDoc(doc(db, "Notifications", uid, "Items", notifFid), { read: true });
  } catch (_) {}
};

// Mark ALL read
window.markAllNotifRead = async function () {
  if (!auth.currentUser) return;
  const uid  = auth.currentUser.uid;
  const snap = await getDocs(collection(db, "Notifications", uid, "Items"));
  const batch = writeBatch(db);
  snap.docs.filter(d => !d.data().read).forEach(d => {
    batch.update(d.ref, { read: true });
  });
  await batch.commit();
};

// Clear ALL notifications
window.clearAllNotifs = async function () {
  if (!auth.currentUser) return;
  const uid  = auth.currentUser.uid;
  const snap = await getDocs(collection(db, "Notifications", uid, "Items"));
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
};

// Add a notification (used internally or from admin)
window.addNotification = async function (uid, { icon, color, bg, text, tag }) {
  try {
    await addDoc(collection(db, "Notifications", uid, "Items"), {
      icon, color, bg, text, tag,
      read:      false,
      createdAt: serverTimestamp()
    });
  } catch (_) {}
};


// ============================================================
// ============================================================
// 9.  TRANSACTIONS  (/Transactions/{id})
//     Fields: id, date, desc, type, amount, status,
//             ref, customer, note, createdAt
// ============================================================
// ============================================================

function _listenTransactions() {
  const q = query(collection(db, "Transactions"), orderBy("createdAt", "desc"));
  const unsub = onSnapshot(q, snap => {
    // Only override if there's data in Firestore
    if (snap.empty) return;

    window.TXN_DATA.length = 0; // clear
    snap.docs.forEach(d => {
      window.TXN_DATA.push({
        _fid:     d.id,
        id:       d.data().id       || d.id.slice(0, 9).toUpperCase(),
        date:     _fmtTimestamp(d.data().createdAt) || d.data().date || "—",
        desc:     d.data().desc     || "",
        type:     d.data().type     || "service",
        amount:   d.data().amount   || 0,
        status:   d.data().status   || "pending",
        ref:      d.data().ref      || "",
        customer: d.data().customer || "",
        note:     d.data().note     || ""
      });
    });

    if (typeof renderTxnPage === "function") renderTxnPage();
  }, err => console.error("[Transactions]", err));
  _unsubs.push(unsub);
}

// ADD transaction entry
window.addTransactionDB = async function (data) {
  try {
    const ref = await addDoc(collection(db, "Transactions"), {
      ...data,
      status:    data.status || "pending",
      createdAt: serverTimestamp()
    });
    await updateDoc(ref, { id: "TXN-" + ref.id.slice(0, 6).toUpperCase() });
    showToast("Transaction entry added!", "ok");
    return { ok: true };
  } catch (e) {
    showToast("Failed to add transaction.", "error");
    return { ok: false, error: e.message };
  }
};

// TOGGLE transaction status
window.toggleTxnStatusDB = async function (fid, currentStatus) {
  const cycle = { completed: "pending", pending: "failed", failed: "completed" };
  const next  = cycle[currentStatus] || "pending";
  try {
    await updateDoc(doc(db, "Transactions", fid), {
      status:    next,
      updatedAt: serverTimestamp()
    });
    showToast(`Status → ${next}`, "ok");
    return { ok: true, status: next };
  } catch (e) {
    return { ok: false, error: e.message };
  }
};


// ============================================================
// ============================================================
// 10. PROFILE  (staff's own Firestore doc)
// ============================================================
// ============================================================

window.updateStaffProfile = async function (fields) {
  if (!auth.currentUser) return { ok: false, error: "Not logged in." };
  try {
    await updateDoc(
      doc(db, "User", "Staff", "Staffs", auth.currentUser.uid),
      { ...fields, updatedAt: serverTimestamp() }
    );
    Object.assign(window.CURRENT_STAFF, fields);
    _patchStaffUI(window.CURRENT_STAFF);
    showToast("Profile updated!", "ok");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
};

window.changeStaffPassword = async function (currentPass, newPass) {
  if (!auth.currentUser) return { ok: false, error: "Not logged in." };
  if (newPass.length < 6) return { ok: false, error: "Min 6 characters." };
  try {
    const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPass);
    await reauthenticateWithCredential(auth.currentUser, cred);
    await updatePassword(auth.currentUser, newPass);
    showToast("Password updated!", "ok");
    return { ok: true };
  } catch (e) {
    const map = {
      "auth/wrong-password":    "Current password is incorrect.",
      "auth/too-many-requests": "Too many attempts. Try again later."
    };
    return { ok: false, error: map[e.code] || e.message };
  }
};

window.resetPasswordByEmail = async function (email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
};


// ============================================================
// ============================================================
// OVERRIDE HOOKS — patch the in-memory functions used by the
// existing HTML JS so they write to Firestore too
// ============================================================
// ============================================================

// ── Posts ──────────────────────────────────────────────────
window._origPublishPost = window.publishPost;
window.publishPost = async function () {
  const title   = document.getElementById("postTitle")?.value.trim();
  const content = document.getElementById("postContent")?.value.trim();
  if (!title)   { showToast("Please enter a title",   "error"); return; }
  if (!content) { showToast("Please enter content",   "error"); return; }
  const schedDt = document.getElementById("scheduleDate")?.value;
  const status  = schedDt ? "scheduled" : "live";
  const payload = {
    type:         window.selectedPostType || "News",
    title,
    content,
    excerpt:      document.getElementById("postExcerpt")?.value.trim() || content.substring(0, 120),
    image:        "",
    featured:     document.getElementById("isFeatured")?.checked || false,
    status,
    scheduledFor: schedDt || null
  };
  const result = await publishPostDB(payload);
  if (result.ok) {
    if (typeof clearForm === "function") clearForm();
    document.getElementById("successTitle").textContent = status === "scheduled" ? "Post Scheduled!" : "Post Published!";
    document.getElementById("successSub").textContent   = status === "scheduled" ? "Scheduled for later." : "Post is now live.";
    document.getElementById("successModal")?.classList.add("open");
  }
};

window._origSaveDraft = window.saveDraft;
window.saveDraft = async function () {
  const title = document.getElementById("postTitle")?.value.trim();
  if (!title) { showToast("Please enter a title to save draft", "error"); return; }
  const result = await publishPostDB({
    type:    window.selectedPostType || "News",
    title,
    content: document.getElementById("postContent")?.value.trim() || "",
    excerpt: document.getElementById("postExcerpt")?.value.trim() || "",
    image:   "",
    featured:false,
    status:  "draft"
  });
  if (result.ok) {
    if (typeof clearForm === "function") clearForm();
    showToast("Draft saved!", "ok");
  }
};

window._origConfirmDelete = window.confirmDelete;
window.confirmDelete = async function () {
  const pid = window.pendingDeleteId;
  if (pid == null) return;
  const p = (window.posts || []).find(x => x._fid === pid || x.id === pid || String(x.id) === String(pid));
  if (p && p._fid) {
    await deletePostDB(p._fid);
  }
  window.pendingDeleteId = null;
  document.getElementById("deleteModal")?.classList.remove("open");
};

window._origTogglePostStatus = window.togglePostStatus;
window.togglePostStatus = async function (idOrFid) {
  const p = (window.posts || []).find(x => x._fid === idOrFid || x.id === idOrFid || String(x.id) === String(idOrFid));
  if (!p) return;
  await togglePostStatusDB(p._fid, p.status);
};

window._origEditPost = window.editPost;
window.editPost = function (idOrFid) {
  const p = (window.posts || []).find(x => x._fid === idOrFid || x.id === idOrFid || String(x.id) === String(idOrFid));
  if (!p) return;
  // Store Firestore ID so publishPost can update on next call
  window._editingPostFid = p._fid;
  // Populate form fields
  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ""; };
  setVal("postTitle",   p.title);
  setVal("postContent", p.content);
  setVal("postExcerpt", p.excerpt || "");
  if (typeof updateCharCount === "function") {
    updateCharCount("postTitle",   "titleCount",   80);
    updateCharCount("postContent", "contentCount", 600);
    updateCharCount("postExcerpt", "excerptCount", 160);
  }
  const cb = document.getElementById("isFeatured");
  if (cb) { cb.checked = p.featured; if (typeof syncToggle === "function") syncToggle(cb); }
  const typeBtn = document.querySelector(`.type-btn[data-type="${p.type}"]`) || document.querySelector(".type-btn");
  if (typeBtn && typeof selectType === "function") selectType(typeBtn, p.type);
  const lbl = document.getElementById("pubBtnLabel");
  if (lbl) lbl.textContent = "Update Post";
  // Patch publishPost for this one update call
  const _restore = window.publishPost;
  window.publishPost = async function () {
    const title   = document.getElementById("postTitle")?.value.trim();
    const content = document.getElementById("postContent")?.value.trim();
    if (!title || !content) { showToast("Title and content required.", "error"); return; }
    const schedDt = document.getElementById("scheduleDate")?.value;
    await updatePostDB(window._editingPostFid, {
      type:         window.selectedPostType || p.type,
      title, content,
      excerpt:      document.getElementById("postExcerpt")?.value.trim() || content.substring(0, 120),
      featured:     document.getElementById("isFeatured")?.checked || false,
      status:       schedDt ? "scheduled" : "live",
      scheduledFor: schedDt || null
    });
    if (typeof clearForm === "function") clearForm();
    const lbl = document.getElementById("pubBtnLabel"); if (lbl) lbl.textContent = "Publish Now";
    window._editingPostFid = null;
    window.publishPost = _restore;
    showToast(`"${title}" updated!`, "ok");
  };
  showToast(`Editing: "${p.title}"`, "ok");
};

// ── Customers ──────────────────────────────────────────────
window._origSaveCustomer = window.saveCustomer;
window.saveCustomer = async function () {
  const fn     = document.getElementById("editFname")?.value.trim();
  const ln     = document.getElementById("editLname")?.value.trim();
  const email  = document.getElementById("editEmail")?.value.trim();
  const phone  = document.getElementById("editPhone")?.value.trim();
  const visits = parseInt(document.getElementById("editVisits")?.value) || 0;
  const rating = parseFloat(document.getElementById("editRating")?.value) || 5.0;
  const status = document.getElementById("editStatus")?.value || "active";
  const idxEl  = document.getElementById("editIdx") || document.getElementById("editCusModal")?.querySelector("[id='editIdx']");
  const idx    = parseInt(idxEl?.value ?? "-1");
  const errEl  = document.getElementById("editErrMsg") || document.getElementById("editErrMsg");
  const showErr = msg => { if (errEl) { errEl.textContent = msg; errEl.style.display = "block"; } };
  if (!fn)    return showErr("First name is required.");
  if (!email) return showErr("Email is required.");
  if (!phone) return showErr("Phone is required.");
  if (rating < 0 || rating > 5) return showErr("Rating must be 0–5.");
  const payload = { fname: fn, lname: ln || "", email, phone, visits, rating: Math.round(rating * 10) / 10, status };
  if (idx >= 0 && window.customers[idx]?._fid) {
    await updateCustomerDB(window.customers[idx]._fid, payload);
  } else {
    await addCustomerDB(payload);
  }
  if (typeof closeModal === "function") closeModal("editModal");
  if (typeof closeModal === "function") closeModal("editCusModal");
};

window._origDoDelete = window.doDelete;
window.doDelete = async function () {
  const idx = window.pendingDelIdx ?? -1;
  if (idx < 0 || !window.customers[idx]) return;
  const fid = window.customers[idx]._fid;
  if (fid) await deleteCustomerDB(fid);
  window.pendingDelIdx = -1;
  if (typeof closeModal === "function") { closeModal("delModal"); closeModal("delCusModal"); }
};

window._origDoDeleteCustomer = window.doDeleteCustomer;
window.doDeleteCustomer = window.doDelete;

// ── Notifications ──────────────────────────────────────────
window._origMarkAllRead = window.markAllRead;
window.markAllRead = async function () {
  await markAllNotifRead();
};

window._origClearNotifs = window.clearNotifs;
window.clearNotifs = async function () {
  await clearAllNotifs();
};

// ── Transactions ───────────────────────────────────────────
window._origTxnSubmitAdd = window.txnSubmitAdd;
window.txnSubmitAdd = async function () {
  const desc     = document.getElementById("txnNewDesc")?.value.trim();
  const amount   = parseFloat(document.getElementById("txnNewAmount")?.value);
  const type     = document.getElementById("txnNewType")?.value;
  const customer = document.getElementById("txnNewCustomer")?.value.trim();
  const note     = document.getElementById("txnNewNote")?.value.trim();
  if (!desc || isNaN(amount) || !customer) {
    showToast("Please fill required fields.", "error"); return;
  }
  await addTransactionDB({ desc, amount, type, customer, note: note || "—",
    ref: "MAN-" + Math.floor(Math.random() * 99999) });
  if (typeof txnCloseAdd === "function") txnCloseAdd();
};

window._origTxnToggleStatus = window.txnToggleStatus;
window.txnToggleStatus = async function (idOrFid) {
  const t = (window.TXN_DATA || []).find(x => x._fid === idOrFid || x.id === idOrFid);
  if (!t) return;
  await toggleTxnStatusDB(t._fid, t.status);
  if (typeof txnCloseDetail === "function") txnCloseDetail();
  if (typeof renderTxnPage  === "function") renderTxnPage();
};

// ── Technician unassign ────────────────────────────────────
window._origUnassignBooking = window.unassignBooking;
window.unassignBooking = async function (bId) {
  const b = (window.bookingQueue || []).find(x => x.id === bId);
  if (!b) return;
  const tech = (window.technicians || []).find(t => t.id === b.assignedTo);
  if (b._fid) {
    await unassignBookingDB(b._fid, tech?._fid || b.assignedTo);
  } else {
    // fallback to in-memory
    if (window._origUnassignBooking) window._origUnassignBooking(bId);
  }
};

// ── Booking assign ─────────────────────────────────────────
window._origConfirmAssign = window.confirmAssign;
window.confirmAssign = async function () {
  let bId = window.assigningBookingId;
  if (!bId) {
    const sel = document.getElementById("bookingSelect");
    if (sel && sel.value) bId = sel.value;
  }
  if (!bId)                { showToast("Please select a booking.",    "error"); return; }
  if (!window.selectedTechId) { showToast("Please select a technician.", "error"); return; }

  const booking = (window.bookingQueue || []).find(x => x.id === bId);
  const tech    = (window.technicians  || []).find(x => x.id === window.selectedTechId);
  if (!booking || !tech) return;

  const notes    = document.getElementById("assignNotes")?.value.trim() || "";
  const priority = window.selectedPriority || "Normal";

  if (booking._fid && tech._fid) {
    const result = await assignBookingDB(booking._fid, tech._fid, tech.id, priority, notes);
    if (!result.ok) return;
  }

  // Also log it in-memory for the audit trail (unchanged from original)
  window.assignLog = window.assignLog || [];
  window.assignLog.unshift({
    techName: tech.name, techInitials: tech.initials, techGradient: tech.gradient,
    bookingId: booking.id, service: booking.service, customer: booking.customer,
    priority, notes, time: new Date().toLocaleTimeString("en-US", { hour12: false })
  });

  if (typeof closeAssignModal === "function") closeAssignModal();
  if (typeof renderAssignLog  === "function") renderAssignLog();
  showToast(`${booking.id} assigned to ${tech.name.split(" ")[0]}`, "ok");
};


// ============================================================
// ============================================================
// HELPER UTILITIES
// ============================================================
// ============================================================

function _patchStaffUI(staff) {
  const full     = `${staff.fname || ""} ${staff.lname || ""}`.trim() || "Staff";
  const initials = full.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  // Header avatar
  const prBtn = document.querySelector(".pr-btn div");
  if (prBtn) prBtn.textContent = initials;

  // Header name / role
  const ddName = document.querySelector(".dd > div:first-child .font-weight-600, .dd > div div:first-child");
  if (ddName && ddName.style) ddName.textContent = full;

  // Sidebar footer
  const sbName = document.querySelector(".sb-nav ~ div [style*='font-size:12px']");
  if (sbName) sbName.textContent = full;

  // Profile card
  const pcName = document.querySelector(".pc-face .pc-name");
  if (pcName) pcName.textContent = full;

  // Populate profile card fields
  const f = id => document.getElementById(id);
  if (f("pcFieldEmail"))  f("pcFieldEmail").value  = staff.email || "";
  if (f("pcFieldPhone"))  f("pcFieldPhone").value  = staff.phone || "";
  if (f("pcFieldGender")) f("pcFieldGender").value = staff.gender || "";
  if (f("pcFieldAddr"))   f("pcFieldAddr").value   = staff.address || "";
  if (f("pcFieldBday"))   f("pcFieldBday").value   = staff.birthday || "";
  if (f("pcFrontName"))   f("pcFrontName").textContent = full;
  if (f("pcFrontRole"))   f("pcFrontRole").textContent = staff.role || "Staff";
  if (f("pcBackName"))    f("pcBackName").textContent  = full;
  if (f("pcBackRole"))    f("pcBackRole").textContent  = staff.role || "Staff";
}

function _updateDashboardCustomerCount() {
  const el = document.getElementById("dashCusTotal");
  if (el && window.customers) el.textContent = window.customers.length;
}

function _updateBkStats() {
  const bq = window.bookingQueue || [];
  const el = id => document.getElementById(id);
  if (el("bkStatTotal"))     el("bkStatTotal").textContent     = bq.length;
  if (el("bkStatConfirmed")) el("bkStatConfirmed").textContent = bq.filter(b => b.status === "assigned").length;
  if (el("bkStatPending"))   el("bkStatPending").textContent   = bq.filter(b => b.status === "unassigned").length;
}

function _updateTechStats() {
  const techs = window.technicians || [];
  const bq    = window.bookingQueue || [];
  const el = id => document.getElementById(id);
  if (el("statAvail"))      el("statAvail").textContent      = techs.filter(t => t.status === "available").length;
  if (el("statBusy"))       el("statBusy").textContent       = techs.filter(t => t.status === "busy").length;
  if (el("statUnassigned")) el("statUnassigned").textContent = bq.filter(b => b.status === "unassigned").length;
  if (el("statTechs"))      el("statTechs").textContent      = techs.length;
}

function _updatePostStats() {
  const p = window.posts || [];
  const el = id => document.getElementById(id);
  if (el("statTotal"))     el("statTotal").textContent     = p.length;
  if (el("statLive"))      el("statLive").textContent      = p.filter(x => x.status === "live").length;
  if (el("statScheduled")) el("statScheduled").textContent = p.filter(x => x.status === "scheduled").length;
}

function _fmtDate(val) {
  if (!val) return "—";
  const d = val.toDate ? val.toDate() : new Date(val);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function _fmtTimestamp(val) {
  if (!val) return null;
  const d = val.toDate ? val.toDate() : new Date(val);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function _relativeTime(val) {
  if (!val) return "";
  const d    = val.toDate ? val.toDate() : new Date(val);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60)   return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Expose showToast safely (defined in the HTML scripts)
function showToast(msg, type) {
  if (typeof window.showToast === "function" && window.showToast !== showToast) {
    window.showToast(msg, type);
  } else {
    console.log(`[Toast] ${type}: ${msg}`);
  }
}


// ============================================================
// ============================================================
// AUTO-INIT — runs when the page loads
// ============================================================
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Only auto-init if we are on the staff dashboard (not login page)
  if (document.getElementById("sidebar")) {
    initStaffDashboard().then(staff => {
      console.log("[REV Staff] Signed in as:", staff.fname, staff.lname);
    });
  }
});

console.log("[staff-firebase.js] ✓ Loaded.");


// ============================================================
// ============================================================
// FIRESTORE SECURITY RULES  (paste in Firebase Console → Rules)
// ============================================================
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//
//     function isStaff() {
//       return request.auth != null &&
//         exists(/databases/$(database)/documents/User/Staff/Staffs/$(request.auth.uid));
//     }
//     function isTech() {
//       return request.auth != null &&
//         exists(/databases/$(database)/documents/User/Technician/Technicians/$(request.auth.uid));
//     }
//
//     // Staff profile
//     match /User/Staff/Staffs/{uid} {
//       allow read, write: if request.auth.uid == uid;
//       allow read: if isStaff();
//     }
//
//     // Customers — staff full access
//     match /Customers/{id} {
//       allow read, write: if isStaff();
//     }
//
//     // Bookings — staff + technician read; staff create/update
//     match /Bookings/{id} {
//       allow read:   if isStaff() || isTech();
//       allow create: if isStaff();
//       allow update: if isStaff() || (isTech() && onlyStatusFields());
//       allow delete: if isStaff();
//     }
//
//     // Technicians — staff full; tech can update own status
//     match /Technicians/{uid} {
//       allow read:   if isStaff() || isTech();
//       allow write:  if isStaff();
//       allow update: if request.auth.uid == uid;
//     }
//
//     // Posts — staff full; customers read live only
//     match /Posts/{id} {
//       allow read:   if isStaff() || resource.data.status == 'live';
//       allow write:  if isStaff();
//     }
//
//     // Notifications — owner only
//     match /Notifications/{uid}/Items/{id} {
//       allow read, write: if request.auth.uid == uid;
//     }
//
//     // Transactions — staff only
//     match /Transactions/{id} {
//       allow read, write: if isStaff();
//     }
//   }
// }
//
// ============================================================
// REQUIRED FIRESTORE INDEXES (Firebase Console → Indexes)
// ============================================================
//
//  Collection   | Fields                              | Order
//  -------------|-------------------------------------|-------
//  Bookings     | technicianId ASC, status ASC        | ASC
//  Bookings     | createdAt DESC                      | DESC
//  Posts        | createdAt DESC                      | DESC
//  Customers    | createdAt DESC                      | DESC
//  Technicians  | name ASC                            | ASC
//  Transactions | createdAt DESC                      | DESC
//  Notifications/{uid}/Items | createdAt DESC         | DESC
//
// ============================================================
// HOW TO INTEGRATE
// ============================================================
//
// 1. In login.html, replace the plain <script> with:
//      <script type="module" src="staff-firebase.js"></script>
//    Then call: loginStaff(email, password) in the submit handler.
//
// 2. In staff.html, add at the bottom of <body>:
//      <script src="transaction.js"></script>
//      <script type="module" src="staff-firebase.js"></script>
//    (staff-firebase.js MUST load after transaction.js)
//
// 3. Remove or comment out the old static
//    <script src="FirebaseConfig.js"></script>
//    <script src="FirestorePosts.js"></script>
//    lines — staff-firebase.js replaces both.
//
// 4. The script auto-inits via DOMContentLoaded and patches all
//    existing functions (publishPost, saveDraft, confirmDelete,
//    saveCustomer, doDelete, confirmAssign, unassignBooking,
//    txnSubmitAdd, txnToggleStatus, markAllRead, clearNotifs,
//    logout) to write through to Firestore automatically.
//    No other changes needed in your HTML.
//
// ============================================================