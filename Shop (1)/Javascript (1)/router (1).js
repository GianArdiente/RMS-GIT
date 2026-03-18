/* ============================================================
   router.js — Page routing & bootstrap
   Controls which page is visible and keeps the nav in sync.
   ============================================================ */

const Router = (() => {
  const PAGE_IDS  = ['home', 'shop', 'admin'];

  function go(page) {
    // Hide all pages
    PAGE_IDS.forEach(id => {
      document.getElementById('page-' + id)?.classList.remove('active');
    });

    // Show requested page
    document.getElementById('page-' + page)?.classList.add('active');

    // Sync nav button states
    PAGE_IDS.forEach(id => {
      document.getElementById('nav-' + id)?.classList.remove('active');
    });
    document.getElementById('nav-' + page)?.classList.add('active');

    // Trigger page render / refresh
    switch (page) {
      case 'home':  HomePage.render();   break;
      case 'shop':  ShopPage.render();   break;
      case 'admin': AdminPage.render();  break;
    }
  }

  // ── Bootstrap ────────────────────────────────────────────
  function init() {
    HomePage.render(); // render home content on first load
  }

  return { go, init };
})();

// Start the app
Router.init();
