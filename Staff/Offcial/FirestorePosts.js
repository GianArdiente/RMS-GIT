/* ══════════════════════════════════════════════════════════════
   REV MOTORS — Staff Portal · Firestore Posts Integration
   
   HOW TO USE:
   1. Replace the firebaseConfig below with your real values.
   2. Add this line at the bottom of Staff.html, AFTER transaction.js:
         <script type="module" src="firestore-posts.js"></script>
   3. The script overrides the in-memory posts array with live
      Firestore data and patches publishPost / saveDraft / 
      editPost / confirmDelete to write to Firestore.
   ══════════════════════════════════════════════════════════════ */

import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ══════════════════════════════════
   ⚠️  YOUR FIREBASE CONFIG
══════════════════════════════════ */
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const postsRef = collection(db, "posts");

/* ══════════════════════════════════
   REAL-TIME LISTENER
   Keeps the global `posts` array in sync with Firestore,
   then re-renders the list automatically.
══════════════════════════════════ */
const q = query(postsRef, orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  // Rebuild the global posts array used by the rest of Staff.html
  window.posts = snapshot.docs.map(d => {
    const data = d.data();
    return {
      _firestoreId: d.id,          // keep Firestore ID separate
      id:     data.localId || d.id,// keep numeric id for legacy compat
      type:   data.type    || 'News',
      title:  data.title   || '',
      content:data.content || '',
      excerpt:data.excerpt || '',
      image:  data.image   || '',
      featured: data.featured || false,
      status: data.status  || 'draft',
      date:   data.createdAt
        ? data.createdAt.toDate().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})
        : data.date || '—',
    };
  });

  // Re-render if the posts page is visible
  if (document.getElementById('page-posts')?.classList.contains('active')) {
    renderPostsList();
    updatePostStats();
  }
}, err => {
  console.error("[Firestore] posts listener error:", err);
  showToast('Database connection error', 'error');
});

/* ══════════════════════════════════
   OVERRIDE: publishPost
══════════════════════════════════ */
window.publishPost = async function() {
  const title   = document.getElementById('postTitle')?.value.trim();
  const content = document.getElementById('postContent')?.value.trim();
  if (!title)   { showToast('Please enter a title',   'error'); return; }
  if (!content) { showToast('Please enter content', 'error'); return; }

  const schedDt = document.getElementById('scheduleDate')?.value;
  const status  = schedDt ? 'scheduled' : 'live';

  const postData = {
    type:     window.selectedPostType || 'News',
    title,
    content,
    excerpt:  document.getElementById('postExcerpt')?.value.trim() || content.substring(0, 120),
    image:    '',
    featured: document.getElementById('isFeatured')?.checked || false,
    status,
    scheduledFor: schedDt || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    // Store a numeric localId for backward compat with the rest of the portal
    localId: Date.now(),
  };

  try {
    await addDoc(postsRef, postData);
    clearPostForm();

    // Show success modal
    document.getElementById('successTitle').textContent = status === 'scheduled' ? 'Post Scheduled!' : 'Post Published!';
    document.getElementById('successSub').textContent   = status === 'scheduled' ? 'Your post is scheduled.' : 'Your post is now live.';
    document.getElementById('successDesc').textContent  = status === 'live'
      ? 'Customers can now read it in the News feed.'
      : `It will go live on ${new Date(schedDt).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}.`;
    document.getElementById('successModal').classList.add('open');
  } catch (e) {
    console.error("[Firestore] addDoc error:", e);
    showToast('Failed to publish post', 'error');
  }
};

/* ══════════════════════════════════
   OVERRIDE: saveDraft
══════════════════════════════════ */
window.saveDraft = async function() {
  const title = document.getElementById('postTitle')?.value.trim();
  if (!title) { showToast('Please enter a title to save draft', 'error'); return; }

  const postData = {
    type:     window.selectedPostType || 'News',
    title,
    content:  document.getElementById('postContent')?.value.trim() || '',
    excerpt:  document.getElementById('postExcerpt')?.value.trim() || '',
    image:    '',
    featured: false,
    status:   'draft',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    localId: Date.now(),
  };

  try {
    await addDoc(postsRef, postData);
    clearPostForm();
    showToast('Draft saved!', 'ok');
  } catch (e) {
    console.error("[Firestore] draft save error:", e);
    showToast('Failed to save draft', 'error');
  }
};

/* ══════════════════════════════════
   OVERRIDE: editPost  (load into form; delete from Firestore on "Update")
══════════════════════════════════ */
window.editPost = function(localOrFirestoreId) {
  // Find by Firestore ID or numeric localId
  const p = window.posts.find(x => x._firestoreId === localOrFirestoreId || x.id === localOrFirestoreId);
  if (!p) return;

  // Store the Firestore ID so publishPost can update instead of add
  window._editingFirestoreId = p._firestoreId;

  document.getElementById('postTitle').value   = p.title;
  document.getElementById('postContent').value = p.content;
  document.getElementById('postExcerpt').value = p.excerpt || '';
  updateCharCount('postTitle',   'titleCount',   80);
  updateCharCount('postContent', 'contentCount', 600);
  updateCharCount('postExcerpt', 'excerptCount', 160);
  const cb = document.getElementById('isFeatured');
  if (cb) { cb.checked = p.featured; syncToggle(cb); }
  const typeBtn = document.querySelector(`.type-btn[data-type="${p.type}"]`) || document.querySelector('.type-btn');
  if (typeBtn) selectType(typeBtn, p.type);
  document.getElementById('pubBtnLabel').textContent = 'Update Post';

  // Patch publishPost to do an update this one time
  const _origPublish = window.publishPost;
  window.publishPost = async function() {
    const title   = document.getElementById('postTitle')?.value.trim();
    const content = document.getElementById('postContent')?.value.trim();
    if (!title)   { showToast('Please enter a title',   'error'); return; }
    if (!content) { showToast('Please enter content', 'error'); return; }

    const schedDt = document.getElementById('scheduleDate')?.value;
    const status  = schedDt ? 'scheduled' : 'live';

    try {
      await updateDoc(doc(db, "posts", window._editingFirestoreId), {
        type:     window.selectedPostType || p.type,
        title,
        content,
        excerpt:  document.getElementById('postExcerpt')?.value.trim() || content.substring(0, 120),
        featured: document.getElementById('isFeatured')?.checked || false,
        status,
        scheduledFor: schedDt || null,
        updatedAt: serverTimestamp(),
      });
      clearPostForm();
      document.getElementById('pubBtnLabel').textContent = 'Publish Now';
      window._editingFirestoreId = null;
      // Restore original publishPost
      window.publishPost = _origPublish;
      showToast(`"${title}" updated!`, 'ok');
    } catch (e) {
      console.error("[Firestore] update error:", e);
      showToast('Failed to update post', 'error');
    }
  };

  showToast(`Editing: "${p.title}"`, 'ok');
};

/* ══════════════════════════════════
   OVERRIDE: confirmDelete
══════════════════════════════════ */
window.confirmDelete = async function() {
  const pendingId = window.pendingDeleteId;
  if (pendingId == null) return;

  // Find Firestore doc ID from numeric post id OR directly if it's a string
  const p = window.posts.find(x => x.id === pendingId || x._firestoreId === pendingId);
  if (!p) { window.closeDeleteModal?.(); return; }

  try {
    await deleteDoc(doc(db, "posts", p._firestoreId));
    window.pendingDeleteId = null;
    document.getElementById('deleteModal')?.classList.remove('open');
    showToast('Post deleted', 'error');
  } catch (e) {
    console.error("[Firestore] delete error:", e);
    showToast('Failed to delete post', 'error');
  }
};

/* ══════════════════════════════════
   OVERRIDE: togglePostStatus
══════════════════════════════════ */
window.togglePostStatus = async function(localOrFirestoreId) {
  const p = window.posts.find(x => x._firestoreId === localOrFirestoreId || x.id === localOrFirestoreId);
  if (!p) return;
  const cycle = { live:'draft', draft:'live', scheduled:'live' };
  const newStatus = cycle[p.status] || 'live';
  try {
    await updateDoc(doc(db, "posts", p._firestoreId), {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
    showToast(`Status → ${newStatus}`, 'ok');
  } catch (e) {
    console.error("[Firestore] toggle status error:", e);
    showToast('Failed to update status', 'error');
  }
};

/* ══════════════════════════════════
   PATCH renderPostsList to use Firestore IDs for button clicks
   (so edit/delete/toggle receive _firestoreId instead of numeric id)
══════════════════════════════════ */
const _origRenderPostsList = window.renderPostsList;
window.renderPostsList = function() {
  const list  = document.getElementById('postsList');
  const empty = document.getElementById('emptyPosts');
  if (!list || !empty) return;

  const TYPE_CFG = {
    Promotions:    { color:'#d97706', bg:'rgba(217,119,6,.12)',   icon:'fa-tag',      label:'Promo'        },
    Announcements: { color:'#10b981', bg:'rgba(16,185,129,.12)',  icon:'fa-bullhorn', label:'Announcement' },
    News:          { color:'#A67F38', bg:'rgba(166,127,56,.12)',  icon:'fa-newspaper',label:'News'         },
  };

  const q = (document.getElementById('postSearch')?.value || '').toLowerCase();
  const activeFilter = window.activePostFilter || 'all';
  let filtered = window.posts.filter(p => {
    const mF = activeFilter === 'all' || p.type === activeFilter;
    const mS = !q || p.title.toLowerCase().includes(q) || (p.content||'').toLowerCase().includes(q);
    return mF && mS;
  });

  if (!filtered.length) { list.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  list.innerHTML = filtered.map((p, i) => {
    const cfg = TYPE_CFG[p.type] || TYPE_CFG.News;
    const fid = p._firestoreId || p.id;   // use Firestore ID for actions
    const statusCls = p.status === 'live' ? 'status-live' : p.status === 'scheduled' ? 'status-scheduled' : 'status-draft';
    return `<div class="post-row" style="animation-delay:${i*.04}s;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
        <div style="display:flex;align-items:flex-start;gap:12px;flex:1;min-width:0;">
          <div style="width:38px;height:38px;border-radius:9px;background:${cfg.bg};border:1px solid ${cfg.color}33;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas ${cfg.icon}" style="color:${cfg.color};font-size:13px;"></i>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap;">
              <span style="font-family:'Rajdhani',sans-serif;font-weight:800;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:${cfg.color};">${cfg.label}</span>
              ${p.featured ? `<span style="font-family:'Rajdhani',sans-serif;font-weight:800;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#F2DB94;">★ FEATURED</span>` : ''}
              <span class="b ${statusCls}" style="font-size:8px;">${p.status}</span>
            </div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;color:#ddd;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.title}</div>
            <p style="font-size:11px;color:#4a4a4a;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${p.excerpt || p.content.substring(0,120)}</p>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;">
          <span style="font-size:9px;color:#2a2a2a;white-space:nowrap;">${p.date}</span>
          <div style="display:flex;gap:5px;">
            <button onclick="editPost('${fid}')" style="width:28px;height:28px;border-radius:7px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);color:#60a5fa;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-pen"></i></button>
            <button onclick="togglePostStatus('${fid}')" style="width:28px;height:28px;border-radius:7px;background:rgba(166,127,56,.08);border:1px solid rgba(166,127,56,.2);color:#D9B573;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-toggle-on"></i></button>
            <button onclick="openDeleteModal('${fid}')" style="width:28px;height:28px;border-radius:7px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);color:#f87171;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
};

/* Keep openDeleteModal working with Firestore IDs */
window.openDeleteModal = function(fid) {
  window.pendingDeleteId = fid;
  document.getElementById('deleteModal')?.classList.add('open');
};

console.log("[firestore-posts.js] ✓ Firestore integration loaded.");