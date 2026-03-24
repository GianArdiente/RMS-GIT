/* ============================================================
   posts.js
   Core post management: rendering the list, publishing,
   saving drafts, editing, deleting, toggling live/draft
   status, resetting the form, and updating stat counters.
   Depends on: state.js, storage.js, ui.js, image.js,
               modals.js, toast.js
   ============================================================ */

/* ── Render Posts List ───────────────────────────────────── */
function renderPosts() {
  const search   = document.getElementById('postSearch').value.toLowerCase().trim();
  const list     = document.getElementById('postsList');
  const empty    = document.getElementById('emptyPosts');

  const filtered = posts.filter(p => {
    const matchFilter = activeFilter === 'all' || p.type === activeFilter;
    const matchSearch = !search
      || p.title.toLowerCase().includes(search)
      || p.excerpt.toLowerCase().includes(search);
    return matchFilter && matchSearch;
  });

  list.innerHTML = '';

  if (filtered.length === 0) {
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  filtered.slice().reverse().forEach((p, i) => {
    const meta        = typeMeta[p.type] || typeMeta['News'];
    const statusCls   = p.status === 'live'      ? 'status-live'
                      : p.status === 'scheduled' ? 'status-scheduled'
                      : 'status-draft';
    const statusLabel = p.status === 'live'      ? 'Live'
                      : p.status === 'scheduled' ? 'Scheduled'
                      : 'Draft';
    const statusIcon  = p.status === 'live' ? 'fa-circle' : 'fa-clock';

    const row = document.createElement('div');
    row.className = 'post-row';
    row.style.animationDelay = `${i * 0.05}s`;

    row.innerHTML = `
      <div class="flex gap-4">
        ${p.image ? `
          <div class="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden">
            <img src="${p.image}" alt="" class="w-full h-full object-cover"/>
          </div>` : ''}
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2 mb-1.5 flex-wrap">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="tag-badge" style="background:${meta.bg};color:${meta.color};">
                <i class="fas ${meta.icon} text-[7px]"></i>${p.type}
              </span>
              <span class="tag-badge ${statusCls}">
                <i class="fas ${statusIcon} text-[7px]"></i>${statusLabel}
              </span>
              ${p.isFeatured ? `
                <span class="tag-badge" style="background:rgba(166,127,56,.12);color:#D9B573;border:1px solid rgba(166,127,56,.25);">
                  <i class="fas fa-star text-[7px]"></i>Featured
                </span>` : ''}
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <button onclick="toggleStatus(${p.id})" title="Toggle Live/Draft"
                class="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                style="background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);">
                <i class="fas ${p.status === 'live' ? 'fa-eye-slash' : 'fa-eye'} text-[10px]" style="color:#10b981;"></i>
              </button>
              <button onclick="editPost(${p.id})" title="Edit"
                class="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                style="background:rgba(166,127,56,.08);border:1px solid rgba(166,127,56,.18);">
                <i class="fas fa-pencil-alt text-[10px]" style="color:#A67F38;"></i>
              </button>
              <button onclick="promptDelete(${p.id})" title="Delete"
                class="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.18);">
                <i class="fas fa-trash text-[10px]" style="color:#ef4444;"></i>
              </button>
            </div>
          </div>
          <h3 class="font-barlow font-black text-white leading-tight mb-1" style="font-size:15px;">${p.title}</h3>
          <p class="text-[11.5px] mb-1.5 line-clamp-2" style="color:#555;">${p.excerpt}</p>
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-raj" style="color:#2e2e2e;letter-spacing:.5px;">${p.publishedAt}</span>
            ${p.isNew ? `<span class="text-[9px] font-raj font-bold tracking-widest uppercase" style="color:#10b981;">● New</span>` : ''}
          </div>
        </div>
      </div>`;

    list.appendChild(row);
  });

  updateStats();
}

/* ── Stats Counter ───────────────────────────────────────── */
function updateStats() {
  document.getElementById('statTotal').textContent     = posts.length;
  document.getElementById('statLive').textContent      = posts.filter(p => p.status === 'live').length;
  document.getElementById('statScheduled').textContent = posts.filter(p => p.status === 'scheduled').length;
}

/* ── Toggle Live / Draft ─────────────────────────────────── */
function toggleStatus(id) {
  const p = posts.find(x => x.id === id);
  if (!p) return;
  p.status = p.status === 'live' ? 'draft' : 'live';
  savePosts();
  renderPosts();
  showToast(
    p.status === 'live' ? 'Post set to Live' : 'Post set to Draft',
    'fa-eye' + (p.status === 'live' ? '' : '-slash')
  );
}

/* ── Edit Post (load into form) ──────────────────────────── */
function editPost(id) {
  const p = posts.find(x => x.id === id);
  if (!p) return;

  document.getElementById('postTitle').value   = p.title;
  document.getElementById('postContent').value = p.content  || '';
  document.getElementById('postExcerpt').value = p.excerpt  || '';
  document.getElementById('imgUrl').value      = p.image    || '';
  document.getElementById('isFeatured').checked = p.isFeatured || false;
  document.getElementById('toggleTrack').style.background = p.isFeatured
    ? 'linear-gradient(135deg,#A67F38,#D9B573)'
    : 'rgba(255,255,255,.08)';

  if (p.image) applyImgPreview(p.image, '');

  selectedType = p.type;
  document.querySelectorAll('.type-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.type === p.type);
  });

  updateCharCount('postTitle',   'titleCount',   80);
  updateCharCount('postContent', 'contentCount', 600);
  updateCharCount('postExcerpt', 'excerptCount', 160);

  document.getElementById('postTitle').dataset.editId = id;
  document.getElementById('pubBtnLabel').textContent  = 'Save Changes';

  document.getElementById('mainWrap').scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  showToast('Editing post — make changes and save', 'fa-pencil-alt');
}

/* ── Publish Post ────────────────────────────────────────── */
function publishPost() {
  const title   = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();
  const excerpt = document.getElementById('postExcerpt').value.trim();
  const sched   = document.getElementById('scheduleDate').value;
  const isFeat  = document.getElementById('isFeatured').checked;
  const imgUrl  = document.getElementById('imgUrl').value.trim();

  if (!title)   { showToast('Post title is required',   'fa-exclamation-triangle', true); return; }
  if (!content) { showToast('Post content is required', 'fa-exclamation-triangle', true); return; }

  const editId  = parseInt(document.getElementById('postTitle').dataset.editId || '0');
  const meta    = typeMeta[selectedType] || typeMeta['News'];
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (editId) {
    // Update existing post
    const idx = posts.findIndex(p => p.id === editId);
    if (idx !== -1) {
      posts[idx] = {
        ...posts[idx],
        type: selectedType, title, content,
        excerpt: excerpt || title,
        image: imgDataUrl || imgUrl || posts[idx].image,
        isFeatured: isFeat,
        status: sched ? 'scheduled' : 'live',
        tagColor: meta.color,
        tagBg: meta.bg,
      };
    }
    delete document.getElementById('postTitle').dataset.editId;
    document.getElementById('pubBtnLabel').textContent = 'Publish Now';
  } else {
    // Create new post
    posts.push({
      id: Date.now(),
      type: selectedType, title, content,
      excerpt: excerpt || title,
      image: imgDataUrl || imgUrl || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=200&fit=crop',
      isFeatured: isFeat,
      status: sched ? 'scheduled' : 'live',
      publishedAt: dateStr,
      isNew: true,
      tagColor: meta.color,
      tagBg: meta.bg,
    });
  }

  savePosts();
  resetForm();
  renderPosts();

  // Populate and open success modal
  document.getElementById('successTitle').textContent = sched ? 'Post Scheduled!' : 'Post Published!';
  document.getElementById('successSub').textContent   = sched
    ? `Your post is scheduled for ${new Date(sched).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.`
    : 'Your post is now live on the REV News page.';
  document.getElementById('successDesc').textContent  = sched
    ? 'It will go live automatically at the scheduled time.'
    : 'Customers can now read it in the News feed.';
  openSuccessModal();
}

/* ── Save Draft ──────────────────────────────────────────── */
function saveDraft() {
  const title = document.getElementById('postTitle').value.trim();
  if (!title) { showToast('Enter a title to save draft', 'fa-exclamation-triangle', true); return; }

  const content = document.getElementById('postContent').value.trim();
  const excerpt = document.getElementById('postExcerpt').value.trim();
  const imgUrl  = document.getElementById('imgUrl').value.trim();
  const isFeat  = document.getElementById('isFeatured').checked;
  const meta    = typeMeta[selectedType] || typeMeta['News'];
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  posts.push({
    id: Date.now(),
    type: selectedType, title, content,
    excerpt: excerpt || title,
    image: imgDataUrl || imgUrl || '',
    isFeatured: isFeat,
    status: 'draft',
    publishedAt: dateStr,
    isNew: false,
    tagColor: meta.color,
    tagBg: meta.bg,
  });

  savePosts();
  resetForm();
  renderPosts();
  showToast('Draft saved', 'fa-save');
}

/* ── Reset Form ──────────────────────────────────────────── */
function resetForm() {
  document.getElementById('postTitle').value    = '';
  document.getElementById('postContent').value  = '';
  document.getElementById('postExcerpt').value  = '';
  document.getElementById('imgUrl').value       = '';
  document.getElementById('scheduleDate').value = '';
  document.getElementById('isFeatured').checked = false;
  document.getElementById('toggleTrack').style.background = 'rgba(255,255,255,.08)';

  imgDataUrl = '';
  document.getElementById('imgPreviewEl').style.display = 'none';
  document.getElementById('imgPlaceholder').style.opacity = '1';
  document.getElementById('imgDrop').classList.remove('has-image');
  document.getElementById('imgName').classList.add('hidden');

  document.getElementById('titleCount').textContent   = '0/80';
  document.getElementById('contentCount').textContent = '0/600';
  document.getElementById('excerptCount').textContent = '0/160';

  selectedType = 'Promotions';
  document.querySelectorAll('.type-btn').forEach((b, i) => b.classList.toggle('selected', i === 0));
  document.getElementById('pubBtnLabel').textContent = 'Publish Now';
  delete document.getElementById('postTitle').dataset.editId;
}

/* ── Delete ──────────────────────────────────────────────── */
function promptDelete(id) {
  deletingId = id;
  openDeleteModal();
}

function confirmDelete() {
  posts = posts.filter(p => p.id !== deletingId);
  savePosts();
  renderPosts();
  closeDeleteModal();
  showToast('Post deleted', 'fa-trash');
}