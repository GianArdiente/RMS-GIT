/* ============================================================
   state.js
   Global state variables, constants, and config data.
   ⚠ Load this FIRST — every other file depends on these.
   ============================================================ */

/* ── App State ───────────────────────────────────────────── */
let posts        = [];             // All post objects from localStorage
let selectedType = 'Promotions';   // Active type in the post form
let imgDataUrl   = '';             // Base64 / URL of the chosen image
let activeFilter = 'all';          // Active filter tab on the posts list
let deletingId   = null;           // ID of the post pending deletion

/* ── UI State ────────────────────────────────────────────── */
let sbOpen  = true;   // Sidebar open / closed
let _ddOpen = false;  // Profile dropdown open / closed

/* ── LocalStorage Key ────────────────────────────────────── */
const STORAGE_KEY = 'rev_staff_posts';

/* ── Post Type Metadata ──────────────────────────────────── */
// Maps each post type to its tag colour, background tint, and FA icon
const typeMeta = {
  'Promotions':      { color: '#d97706', bg: 'rgba(217,119,6,.18)',   icon: 'fa-tag'       },
  'Announcements':   { color: '#10b981', bg: 'rgba(16,185,129,.15)',  icon: 'fa-bullhorn'  },
  'News':            { color: '#A67F38', bg: 'rgba(166,127,56,.18)',  icon: 'fa-newspaper' },
  'Tips & Guides':   { color: '#A67F38', bg: 'rgba(166,127,56,.18)',  icon: 'fa-lightbulb' },
  'Service Updates': { color: '#10b981', bg: 'rgba(16,185,129,.15)',  icon: 'fa-wrench'    },
  'Shop News':       { color: '#8b5cf6', bg: 'rgba(139,92,246,.15)',  icon: 'fa-store'     },
};

/* ── Filter Tab Inline Styles ────────────────────────────── */
const filterTabStyle = {
  active:   'color:#D9B573;border-color:rgba(166,127,56,.45);background:rgba(166,127,56,.1);',
  inactive: 'color:#3a3a3a;border-color:rgba(255,255,255,.06);background:transparent;',
};