// ============================================================
// TECHNICIAN DASHBOARD — FIREBASE BACKEND
// technician-firebase.js
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
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


// ============================================================
// INIT
// ============================================================
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Global state — populated after auth
window.CURRENT_TECH = null;
let unsubJobs      = null;   // realtime listener cleanup
let unsubMessages  = null;


// ============================================================
// ============================================================
// 1. AUTH — LOGIN  (used by login.html)
// ============================================================
// ============================================================

/**
 * Call from login.html submit handler:
 *   import { loginTechnician } from "./technician-firebase.js";
 */
window.loginTechnician = async function (email, password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    // Verify this uid exists in Technicians collection
    const techRef  = doc(db, "User", "Technician", "Technicians", uid);
    const techSnap = await getDoc(techRef);

    if (!techSnap.exists()) {
      await signOut(auth);
      return { ok: false, error: "Account not found as a Technician." };
    }

    const data = techSnap.data();
    if (data.status !== "active") {
      await signOut(auth);
      return { ok: false, error: "Your account is disabled. Contact admin." };
    }

    // Store globally
    window.CURRENT_TECH = { uid, ...data };
    return { ok: true, tech: window.CURRENT_TECH };

  } catch (err) {
    const map = {
      "auth/user-not-found":  "Email not registered.",
      "auth/wrong-password":  "Incorrect password.",
      "auth/invalid-email":   "Invalid email format.",
      "auth/too-many-requests": "Too many attempts. Try again later."
    };
    return { ok: false, error: map[err.code] || err.message };
  }
};


// ============================================================
// ============================================================
// 2. AUTH GUARD — runs on dashboard load
//    Redirect to login.html if not signed in / not a tech
// ============================================================
// ============================================================

window.initDashboard = async function () {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "login.html";
        return;
      }

      const techRef  = doc(db, "User", "Technician", "Technicians", user.uid);
      const techSnap = await getDoc(techRef);

      if (!techSnap.exists() || techSnap.data().status !== "active") {
        await signOut(auth);
        window.location.href = "login.html";
        return;
      }

      window.CURRENT_TECH = { uid: user.uid, ...techSnap.data() };

      // Patch UI with real tech data
      _patchTechUI(window.CURRENT_TECH);

      // Start realtime listeners
      _listenJobs(user.uid);
      _listenMessages(user.uid);

      resolve(window.CURRENT_TECH);
    });
  });
};


// ============================================================
// ============================================================
// 3. SIGN OUT
// ============================================================
// ============================================================

window.logout = async function () {
  // clean up listeners
  if (unsubJobs)     unsubJobs();
  if (unsubMessages) unsubMessages();

  await signOut(auth);
  window.location.href = "login.html";
};


// ============================================================
// ============================================================
// 4. JOBS — real-time listener
//    Firestore path: /JobOrders/{jobId}
//    Each doc: { technicianUid, customer, vehicle, service,
//                date, time, status, createdAt }
// ============================================================
// ============================================================

function _listenJobs(uid) {
  const q = query(
    collection(db, "JobOrders"),
    where("technicianUid", "==", uid),
    orderBy("createdAt", "desc")
  );

  unsubJobs = onSnapshot(q, (snap) => {
    const jobs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Update global JOBS array used by the existing render functions
    window.JOBS = jobs.map(j => ({
      id:       j.id,
      customer: j.customer || "—",
      vehicle:  j.vehicle  || "—",
      service:  j.service  || "—",
      date:     _formatJobDate(j.date),
      time:     j.time     || "—",
      status:   j.status   || "Pending"
    }));

    // Refresh both tables if the render functions exist
    if (typeof renderJobTable  === "function") renderJobTable();
    if (typeof renderJobsView  === "function") renderJobsView();

    // Update stat cards
    _updateStatCards(window.JOBS);

    // Update upcoming panel
    _renderUpcoming(window.JOBS);

    // Update calendar events
    _syncCalendarEvents(jobs);
  });
}

/** Mark a job as Done */
window.markJobDone = async function (jobId) {
  try {
    await updateDoc(doc(db, "JobOrders", jobId), {
      status: "Done",
      completedAt: serverTimestamp()
    });
    showToast("Job marked as done!", "success");
  } catch (err) {
    console.error(err);
    showToast("Failed to update job.", "warn");
  }
};

/** Mark a job as Active */
window.markJobActive = async function (jobId) {
  try {
    await updateDoc(doc(db, "JobOrders", jobId), { status: "Active" });
    showToast("Job marked as active!", "success");
  } catch (err) {
    showToast("Failed to update job.", "warn");
  }
};


// ============================================================
// ============================================================
// 5. MESSAGES / THREADS — real-time listener
//    Path: /Messages/{threadId}
//    Each thread: { participants: [uid1, uid2], type, name,
//                   lastMessage, lastTime, unread:{uid: count} }
//    Sub-collection: /Messages/{threadId}/Chats/{chatId}
//    Each chat: { from, text, time, senderUid }
// ============================================================
// ============================================================

function _listenMessages(uid) {
  const q = query(
    collection(db, "Messages"),
    where("participants", "array-contains", uid),
    orderBy("lastTime", "desc")
  );

  unsubMessages = onSnapshot(q, (snap) => {
    window.THREADS = snap.docs.map(d => {
      const data = d.data();
      return {
        id:       d.id,
        name:     data.name     || "Unknown",
        initials: _initials(data.name || "?"),
        type:     data.type     || "customer",
        status:   data.status   || "offline",
        unread:   (data.unread && data.unread[uid]) || 0,
        time:     _formatMsgTime(data.lastTime),
        preview:  data.lastMessage || "",
        msgs:     []   // loaded on open
      };
    });

    if (typeof renderThreads === "function") renderThreads("", window.activeCat || "all");

    // Badge count in sidebar
    const totalUnread = window.THREADS.reduce((a, t) => a + t.unread, 0);
    _updateChatBadge(totalUnread);
  });
}

/** Load messages for a specific thread — called when thread is opened */
window.loadThreadMessages = async function (threadId) {
  const q = query(
    collection(db, "Messages", threadId, "Chats"),
    orderBy("time", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    from: d.data().senderUid === auth.currentUser?.uid ? "me" : "them",
    text: d.data().text,
    time: _formatMsgTime(d.data().time)
  }));
};

/** Send a message */
window.sendMessageFirebase = async function (threadId, text) {
  if (!text.trim() || !auth.currentUser) return;
  const uid = auth.currentUser.uid;

  const chatRef  = collection(db, "Messages", threadId, "Chats");
  const threadRef = doc(db, "Messages", threadId);

  const msgData = {
    senderUid: uid,
    text: text.trim(),
    time: serverTimestamp()
  };

  try {
    await addDoc(chatRef, msgData);
    // Update thread meta
    await updateDoc(threadRef, {
      lastMessage: text.trim(),
      lastTime: serverTimestamp()
      // NOTE: unread increment for the other participant is handled
      // server-side via a Cloud Function (see notes below)
    });
  } catch (err) {
    console.error("Send message error:", err);
    showToast("Failed to send message.", "warn");
  }
};

/** Clear unread count for this tech in a thread */
window.markThreadRead = async function (threadId) {
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;
  const threadRef = doc(db, "Messages", threadId);
  try {
    await updateDoc(threadRef, { [`unread.${uid}`]: 0 });
  } catch (_) { /* ignore */ }
};


// ============================================================
// ============================================================
// 6. CALENDAR EVENTS
//    Path: /CalendarEvents/{eventId}
//    { technicianUid, title, sub, time, day, month, year, color }
// ============================================================
// ============================================================

window.addCalendarEvent = async function (eventData) {
  if (!auth.currentUser) return;
  try {
    await addDoc(collection(db, "CalendarEvents"), {
      technicianUid: auth.currentUser.uid,
      ...eventData,
      createdAt: serverTimestamp()
    });
    showToast("Event added!", "success");
  } catch (err) {
    console.error(err);
    showToast("Failed to add event.", "warn");
  }
};

window.deleteCalendarEvent = async function (eventId) {
  try {
    await deleteDoc(doc(db, "CalendarEvents", eventId));
    showToast("Event removed.", "info");
  } catch (err) {
    showToast("Failed to delete event.", "warn");
  }
};

/** Syncs job orders into the CAL_EVENTS array so the calendar auto-reflects jobs */
function _syncCalendarEvents(jobs) {
  const colorMap = { Active: "#A67F38", Pending: "#3b82f6", Done: "#22c55e" };

  window.CAL_EVENTS = jobs
    .filter(j => j.date && j.date.toDate)
    .map(j => {
      const d = j.date.toDate();
      return {
        day:   d.getDate(),
        month: d.getMonth(),
        year:  d.getFullYear(),
        color: colorMap[j.status] || "#A67F38",
        title: `${j.customer} — ${j.service}`,
        time:  j.time || "",
        sub:   j.vehicle || ""
      };
    });

  if (typeof renderBigCal  === "function") renderBigCal();
  if (typeof renderMiniCal === "function") renderMiniCal();
}


// ============================================================
// ============================================================
// 7. PROFILE — update technician info
// ============================================================
// ============================================================

window.updateProfile = async function (fields) {
  if (!auth.currentUser) return { ok: false, error: "Not logged in." };
  const uid = auth.currentUser.uid;
  try {
    await updateDoc(doc(db, "User", "Technician", "Technicians", uid), {
      ...fields,
      updatedAt: serverTimestamp()
    });
    // Refresh local state
    Object.assign(window.CURRENT_TECH, fields);
    _patchTechUI(window.CURRENT_TECH);
    showToast("Profile updated!", "success");
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, error: err.message };
  }
};


// ============================================================
// ============================================================
// 8. SETTINGS — change password
// ============================================================
// ============================================================

window.changePassword = async function (currentPass, newPass) {
  if (!auth.currentUser) return { ok: false, error: "Not logged in." };
  if (newPass.length < 6) return { ok: false, error: "Min 6 characters." };

  try {
    // Re-authenticate first
    const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPass);
    await reauthenticateWithCredential(auth.currentUser, cred);
    await updatePassword(auth.currentUser, newPass);
    showToast("Password updated!", "success");
    return { ok: true };
  } catch (err) {
    const map = {
      "auth/wrong-password": "Current password is incorrect.",
      "auth/too-many-requests": "Too many attempts. Try again later."
    };
    return { ok: false, error: map[err.code] || err.message };
  }
};


// ============================================================
// ============================================================
// 9. SETTINGS — notification preferences
//    Path: /User/Technician/Technicians/{uid}/Settings/notifications
// ============================================================
// ============================================================

window.saveNotifSettings = async function (prefs) {
  if (!auth.currentUser) return;
  try {
    const ref = doc(db, "User", "Technician", "Technicians", auth.currentUser.uid, "Settings", "notifications");
    await setDoc(ref, { ...prefs, updatedAt: serverTimestamp() }, { merge: true });
    showToast("Notification settings saved!", "success");
  } catch (err) {
    console.error(err);
    showToast("Failed to save settings.", "warn");
  }
};

window.loadNotifSettings = async function () {
  if (!auth.currentUser) return null;
  try {
    const ref  = doc(db, "User", "Technician", "Technicians", auth.currentUser.uid, "Settings", "notifications");
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : { email: true, sms: false };
  } catch (_) {
    return { email: true, sms: false };
  }
};


// ============================================================
// ============================================================
// HELPER UTILITIES
// ============================================================
// ============================================================

/** Patch visible UI elements with real tech data */
function _patchTechUI(tech) {
  const full     = `${tech.fname || ""} ${tech.lname || ""}`.trim();
  const initials = _initials(full);
  const id       = `TECH · #${tech.uid ? tech.uid.slice(0,6).toUpperCase() : "—"}`;

  // Sidebar card
  const nameEl = document.querySelector(".sb-tech-name");
  const idEl   = document.querySelector(".sb-tech-id");
  const avEl   = document.querySelector(".sb-tech-avatar");
  if (nameEl) nameEl.textContent = full    || "Technician";
  if (idEl)   idEl.textContent   = id;
  if (avEl)   avEl.childNodes[0].textContent = initials;

  // Topbar avatar
  const tbAv = document.querySelector(".tb-avatar");
  if (tbAv) tbAv.textContent = initials;

  // Profile view
  const pname = document.querySelector(".profile-name");
  const pav   = document.querySelector(".profile-avatar");
  const prole = document.querySelector(".profile-role");
  if (pname) pname.textContent = full;
  if (pav)   { pav.childNodes[0].textContent = initials; }
  if (prole && tech.role) prole.textContent = _titleCase(tech.role);

  // Profile meta items (id, dept, shift, rating)
  const metaVals = document.querySelectorAll(".profile-meta-val");
  if (metaVals[0]) metaVals[0].textContent = id;
  if (metaVals[1]) metaVals[1].textContent = tech.dept || "General";
  if (metaVals[2]) metaVals[2].textContent = tech.status === "active" ? "On Duty" : "Off Duty";

  // Profile list rows (name, email, phone, branch)
  const rows = document.querySelectorAll(".profile-row .val");
  if (rows[0]) rows[0].textContent = full;
  if (rows[1]) rows[1].textContent = tech.email   || "—";
  if (rows[2]) rows[2].textContent = tech.phone   || "—";
  if (rows[3]) rows[3].textContent = tech.branch  || "REV Auto Main Branch";

  // Settings account tab fields (if visible)
  const sfname = document.querySelector('#settingsPanelBody input[placeholder]');
  if (sfname) sfname.value = full;
}

/** Refresh stat cards from live jobs */
function _updateStatCards(jobs) {
  const total   = jobs.length;
  const active  = jobs.filter(j => j.status === "Active").length;
  const done    = jobs.filter(j => j.status === "Done").length;

  const nums = document.querySelectorAll(".stat-num");
  if (nums[0]) nums[0].textContent = total;
  if (nums[1]) nums[1].textContent = active;
  if (nums[2]) nums[2].textContent = done;

  const deltas = document.querySelectorAll(".stat-delta");
  if (deltas[0]) deltas[0].innerHTML = `<i class="fas fa-clipboard-list" style="font-size:8px;"></i> ${total} total`;
  if (deltas[1]) deltas[1].textContent = active ? `${active} in progress` : "None active";
  if (deltas[2]) deltas[2].innerHTML = `<i class="fas fa-check" style="font-size:8px;"></i> ${done} completed`;
}

/** Render the "Upcoming Today" panel from live jobs */
function _renderUpcoming(jobs) {
  const today  = new Date().toDateString();
  const todayJ = jobs.filter(j => {
    // date might be a Firestore Timestamp or the string "Today"
    if (j.date === "Today") return true;
    if (typeof j.date === "string") return j.date === today;
    return false;
  }).sort((a,b) => a.time > b.time ? 1 : -1);

  const container = document.querySelector(".right-col .panel:last-child .panel-body");
  if (!container) return;

  if (!todayJ.length) {
    container.innerHTML = `<div style="font-size:11px;color:var(--text-4);text-align:center;padding:20px 0;">No more jobs today.</div>`;
    return;
  }

  const statusClass = { Active:"status-active", Pending:"status-pending", Done:"status-done" };

  container.innerHTML = todayJ.map(j => {
    const [timePart, ampm] = (j.time || "").split(" ");
    const cls = statusClass[j.status] || "status-pending";
    return `<div class="upcoming-item">
      <div class="up-time-col">
        <div class="up-time">${timePart || "—"}</div>
        <div style="font-size:8px;color:var(--text-4);">${ampm || ""}</div>
      </div>
      <div style="width:1px;background:rgba(166,127,56,.15);flex-shrink:0;"></div>
      <div class="up-info">
        <div class="up-name">${j.customer}</div>
        <div class="up-svc">${j.service} · ${j.vehicle}</div>
      </div>
      <span class="job-status ${cls}"><span class="status-dot"></span>${j.status}</span>
    </div>`;
  }).join("");

  // Update "remaining" badge count
  const badge = document.querySelector(".right-col .panel:last-child .gold-tag");
  const remaining = todayJ.filter(j => j.status !== "Done").length;
  if (badge) badge.textContent = `${remaining} remaining`;
}

/** Update sidebar chat badge */
function _updateChatBadge(count) {
  const badge = document.querySelector('.sb-item[onclick*="chat"] .sb-badge');
  if (badge) badge.textContent = count > 0 ? count : "";
}

/** Format Firestore Timestamp or Date to "Today" / "Mar 26" etc. */
function _formatJobDate(val) {
  if (!val) return "—";
  const d = val.toDate ? val.toDate() : new Date(val);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  return d.toLocaleDateString("en-US", { month:"short", day:"numeric" });
}

/** Format Firestore Timestamp to "Just now" / "5 min" / "10:32 AM" */
function _formatMsgTime(val) {
  if (!val) return "";
  const d = val.toDate ? val.toDate() : new Date(val);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60)  return "Just now";
  if (diff < 3600) return `${Math.floor(diff/60)} min`;
  const today = new Date();
  if (d.toDateString() === today.toDateString())
    return d.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
  return d.toLocaleDateString("en-US", { month:"short", day:"numeric" });
}

/** Get initials from a full name */
function _initials(name) {
  return (name || "?").split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();
}

function _titleCase(s) {
  return (s || "").replace(/\b\w/g, c => c.toUpperCase());
}


// ============================================================
// ============================================================
// HOW TO INTEGRATE INTO technician.html
// ============================================================
//
// Step 1 — Add this to technician.html <head>:
//   <script type="module" src="technician-firebase.js"></script>
//
// Step 2 — Call initDashboard() early in your page script:
//   document.addEventListener("DOMContentLoaded", () => {
//     initDashboard().then(tech => {
//       console.log("Logged in as:", tech.fname);
//     });
//   });
//
// Step 3 — Hook job "Mark Done" buttons:
//   In renderJobsView(), replace the static showToast call with:
//   onclick="markJobDone('${j.id}')"
//
// Step 4 — Hook sendMsg():
//   Replace the static sendMsg() body at the end with:
//     const inp = document.getElementById('chatInput');
//     const txt = inp.value.trim();
//     if (!txt || !activeThread) return;
//     inp.value = '';
//     await sendMessageFirebase(activeThread, txt);
//
// Step 5 — Hook openThread() to load real messages:
//     const msgs = await loadThreadMessages(threadId);
//     renderMessages(msgs);
//     markThreadRead(threadId);
//
// Step 6 — Hook Settings tab save buttons:
//   Account:  onclick="updateProfile({ fname: ..., lname: ... })"
//   Security: onclick="changePassword(currentPassVal, newPassVal)"
//   Notifs:   onclick="saveNotifSettings({ email: true, sms: false })"
//
// ============================================================
// ============================================================
// FIRESTORE SECURITY RULES (paste into Firebase console)
// ============================================================
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//
//     // Technician can read/write own profile
//     match /User/Technician/Technicians/{uid} {
//       allow read, write: if request.auth != null && request.auth.uid == uid;
//     }
//     match /User/Technician/Technicians/{uid}/Settings/{doc} {
//       allow read, write: if request.auth != null && request.auth.uid == uid;
//     }
//
//     // Job orders — technician can read/update own jobs only
//     match /JobOrders/{jobId} {
//       allow read:   if request.auth != null
//                     && resource.data.technicianUid == request.auth.uid;
//       allow update: if request.auth != null
//                     && resource.data.technicianUid == request.auth.uid
//                     && request.resource.data.diff(resource.data).affectedKeys()
//                          .hasOnly(['status','completedAt']);
//       allow create: if false; // only admin creates job orders
//     }
//
//     // Messages — participant can read/write threads they belong to
//     match /Messages/{threadId} {
//       allow read, write: if request.auth != null
//                          && request.auth.uid in resource.data.participants;
//       match /Chats/{chatId} {
//         allow read:   if request.auth != null;
//         allow create: if request.auth != null
//                       && request.resource.data.senderUid == request.auth.uid;
//       }
//     }
//
//     // Calendar events — own only
//     match /CalendarEvents/{eventId} {
//       allow read, write: if request.auth != null
//                          && resource.data.technicianUid == request.auth.uid;
//       allow create: if request.auth != null
//                     && request.resource.data.technicianUid == request.auth.uid;
//     }
//   }
// }
//
// ============================================================
// ============================================================
// RECOMMENDED FIRESTORE INDEXES (Firebase console → Indexes)
// ============================================================
//
// Collection: JobOrders
//   Fields: technicianUid ASC, createdAt DESC
//
// Collection: Messages
//   Fields: participants ARRAY, lastTime DESC
//
// Collection: CalendarEvents
//   Fields: technicianUid ASC, createdAt DESC
//
// ============================================================