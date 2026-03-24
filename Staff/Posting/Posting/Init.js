/* ============================================================
   init.js
   App entry point. Runs after the DOM is ready.
   Loads persisted posts and renders the initial list.
   ⚠ Load this LAST — all other files must be loaded first.
   ============================================================ */

window.addEventListener('DOMContentLoaded', () => {
  loadPosts();
  renderPosts();
});