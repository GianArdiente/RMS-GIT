/* ============================================================
   storage.js
   All localStorage operations: loading, saving, and seeding
   the default posts on first run.
   Depends on: state.js
   ============================================================ */

/* ── Load ────────────────────────────────────────────────── */
function loadPosts() {
  try {
    posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    posts = [];
  }

  // Seed default posts on first load (mirrors the news.html articles)
  if (posts.length === 0) {
    posts = [
      {
        id: 1,
        type: 'Promotions',
        title: 'Oil Change Promo Extended — Save 20% This Week',
        excerpt: 'Limited-time deal on full synthetic oil changes — complete with a free 21-point inspection.',
        content: 'We\'re thrilled to announce that our most popular promotion has been extended by popular demand.',
        image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=200&fit=crop',
        isFeatured: true,
        status: 'live',
        publishedAt: 'Dec 18, 2024',
        isNew: true,
        tagColor: '#d97706',
        tagBg: 'rgba(217,119,6,.18)',
      },
      {
        id: 2,
        type: 'News',
        title: '5 Signs Your Brakes Need Immediate Attention',
        excerpt: 'Ignoring brake warning signs can be dangerous. Here are five things your car is trying to tell you.',
        content: 'Your brakes are your vehicle\'s most critical safety system.',
        image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=200&fit=crop',
        isFeatured: false,
        status: 'live',
        publishedAt: 'Dec 17, 2024',
        isNew: true,
        tagColor: '#A67F38',
        tagBg: 'rgba(166,127,56,.18)',
      },
      {
        id: 3,
        type: 'Promotions',
        title: 'Battery Service Special — 15% Off This Month',
        excerpt: 'Cold weather kills batteries fast. Get yours tested and replaced at a 15% discount.',
        content: 'As temperatures drop, your vehicle\'s battery works harder.',
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=200&fit=crop',
        isFeatured: false,
        status: 'live',
        publishedAt: 'Dec 16, 2024',
        isNew: false,
        tagColor: '#d97706',
        tagBg: 'rgba(217,119,6,.18)',
      },
    ];
    savePosts();
  }
}

/* ── Save ────────────────────────────────────────────────── */
function savePosts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}