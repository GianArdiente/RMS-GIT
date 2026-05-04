/* ══════════════════════════════════════════════════════════════
   REV MOTORS — Firebase / Firestore Configuration
   Shared by: Staff.html  &  customers-news.html

   SETUP INSTRUCTIONS
   ──────────────────
   1. Go to https://console.firebase.google.com
   2. Create a project (e.g. "rev-motors")
   3. Add a Web App  →  copy the firebaseConfig object below
   4. Enable Firestore Database (start in test mode for dev)
   5. Replace the placeholder values below with your real config
   ══════════════════════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ── YOUR FIREBASE CONFIG (replace with real values) ── */
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

/* ── INIT ── */
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* ── COLLECTION REFERENCE ── */
export const postsCol = collection(db, "posts");

/* ══════════════════════════════════════════════════════════════
   CRUD HELPERS
   All functions return Promises so callers can await them.
   ══════════════════════════════════════════════════════════════ */

/**
 * Add a new post document.
 * @param {Object} post - Post data (title, content, type, status, …)
 * @returns {Promise<DocumentReference>}
 */
export async function addPost(post) {
  return addDoc(postsCol, {
    ...post,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update an existing post.
 * @param {string} id  - Firestore document ID
 * @param {Object} data - Fields to update
 */
export async function updatePost(id, data) {
  return updateDoc(doc(db, "posts", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a post by ID.
 * @param {string} id
 */
export async function deletePost(id) {
  return deleteDoc(doc(db, "posts", id));
}

/**
 * Fetch a single post by ID.
 * @param {string} id
 * @returns {Promise<{id, ...data} | null>}
 */
export async function getPost(id) {
  const snap = await getDoc(doc(db, "posts", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Fetch all posts once, ordered by creation date (newest first).
 * @returns {Promise<Array>}
 */
export async function fetchAllPosts() {
  const q    = query(postsCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Real-time listener for LIVE posts only (for the customer News page).
 * @param {Function} callback - Called with Array of post objects whenever data changes
 * @returns {Function} unsubscribe function
 */
export function subscribeLivePosts(callback) {
  const q = query(
    postsCol,
    where("status", "==", "live"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, snap => {
    const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(posts);
  });
}

/**
 * Real-time listener for ALL posts (for the staff portal).
 * @param {Function} callback
 * @returns {Function} unsubscribe function
 */
export function subscribeAllPosts(callback) {
  const q = query(postsCol, orderBy("createdAt", "desc"));
  return onSnapshot(q, snap => {
    const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(posts);
  });
}

export { db };