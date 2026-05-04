// ============================================================
//  FirebaseDatabase.js  —  RMS Autoshop Firestore Data Layer
//
//  FIX (v3 — SDK unified to 12.11.0):
//  SDK was 10.7.2; CustomerBackend.js and FirebaseShop.js both
//  use 12.11.0. ES modules are keyed by exact URL — two
//  different SDK URLs = two separate module bundles = two
//  separate Firebase app registries. getApps() on one bundle
//  does NOT see the app initialised by the other.
//  FIX: All three files now import from firebase/12.11.0 so
//  they all share the SAME single app instance via getApps()[0].
//
//  PURPOSE:
//    1. Seeds the Firestore database with Products, Promos,
//       and News articles on first run (idempotent).
//    2. Provides real-time listeners so the customer-facing
//       Home.js shop, promos, and news always reflect live
//       Firestore data instead of the hardcoded JS arrays.
//    3. Manages stock: decrements on checkout, restores on
//       cart removal before checkout.
//    4. Exposes window.ShopDB for admin/staff panels to
//       add, update, delete items, promos, and articles.
//
//  FIRESTORE COLLECTIONS:
//
//  Products / {productId}
//    id              number
//    name            string
//    category        string
//    sku             string
//    price           number
//    originalPrice   number | null
//    stock           number
//    badge           string | null
//    description     string
//    img             string
//    isActive        boolean
//    createdAt       Timestamp
//    updatedAt       Timestamp
//
//  Promos / {promoId}
//    id              string
//    title           string
//    emoji           string
//    badge           string
//    badgeType       string
//    newPrice        number
//    oldPrice        number
//    filterCategory  string
//    isActive        boolean
//    startsAt        Timestamp | null
//    endsAt          Timestamp | null
//    createdAt       Timestamp
//    updatedAt       Timestamp
//
//  News / {articleId}
//    id              string
//    title           string
//    excerpt         string
//    body            string
//    category        string
//    img             string
//    tagColor        string
//    tagBg           string
//    tagBorder       string
//    isNew           boolean
//    isPublished     boolean
//    date            string
//    readTime        string
//    publishedAt     Timestamp | null
//    createdAt       Timestamp
//    updatedAt       Timestamp
//
//  Load order in Home.html (bottom of <body>, after Home.js):
//    <script src="Home.js"></script>
//    <script type="module" src="FirebaseDatabase.js"></script>
//    <script type="module" src="CustomerBackend.js"></script>
//    <script type="module" src="FirebaseHome.js"></script>
//    <script type="module" src="FirebaseBooking.js"></script>
//    <script type="module" src="FirebaseShop.js"></script>
// ============================================================

// ─── SDK 12.11.0 — MUST match CustomerBackend.js and FirebaseShop.js ──
import { initializeApp, getApps }
  from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  increment,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// ─────────────────────────────────────────
//  FIREBASE INIT
// ─────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyD0g9EfP0DPIR7skzKOZ0DyWLlUi5f5LlM",
  authDomain:        "rmsautoshop.firebaseapp.com",
  projectId:         "rmsautoshop",
  storageBucket:     "rmsautoshop.firebasestorage.app",
  messagingSenderId: "699636102924",
  appId:             "1:699636102924:web:1c25aba93b61fd86047b29",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db  = getFirestore(app);

console.log("[FirebaseDB] SDK: 12.11.0 | app:", app.name, "| total apps:", getApps().length);

// ─────────────────────────────────────────
//  SEED DATA  (mirrors Home.js hardcoded arrays)
//  Only written if collection is empty.
// ─────────────────────────────────────────

const SEED_PRODUCTS = [
  {
    id: 1, name: "Cold Air Intake System", category: "Engine",
    sku: "ENG-001", price: 189.99, originalPrice: 249.99, stock: 23,
    badge: "HOT", isActive: true,
    description: "Increases airflow for max power gains. Fits most V6/V8 engines.",
    img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80",
  },
  {
    id: 2, name: "Performance Brake Pads", category: "Brakes",
    sku: "BRK-001", price: 64.99, originalPrice: null, stock: 45,
    badge: null, isActive: true,
    description: "High-friction ceramic compound. Reduced fade & extended lifespan.",
    img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80",
  },
  {
    id: 3, name: "LED Headlight Bulbs H4", category: "Electrical",
    sku: "ELC-001", price: 39.99, originalPrice: 55.00, stock: 3,
    badge: "SALE", isActive: true,
    description: "6000K crisp white. 300% brighter than halogens. Plug & play.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    id: 4, name: "Coilover Suspension Kit", category: "Suspension",
    sku: "SUS-001", price: 549.99, originalPrice: null, stock: 8,
    badge: "NEW", isActive: true,
    description: "32-way adjustable damping. Track or street tuning ready.",
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80",
  },
  {
    id: 5, name: "Carbon Fibre Rear Spoiler", category: "Accessories",
    sku: "ACC-001", price: 229.99, originalPrice: 299.00, stock: 12,
    badge: null, isActive: true,
    description: "Universal fit. Genuine dry carbon fibre. All hardware included.",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
  },
  {
    id: 6, name: "Cat-Back Exhaust System", category: "Exhaust",
    sku: "EXH-001", price: 349.99, originalPrice: null, stock: 6,
    badge: null, isActive: true,
    description: "Stainless steel mandrel-bent. Deep, aggressive exhaust note.",
    img: "https://images.unsplash.com/photo-1616455579100-2ceaa4eb7d68?w=600&q=80",
  },
  {
    id: 7, name: "High-Flow Oil Filter", category: "Engine",
    sku: "ENG-002", price: 18.99, originalPrice: null, stock: 120,
    badge: null, isActive: true,
    description: "Synthetic media. Traps 99.9% of particles. 10,000 mile rated.",
    img: "https://images.unsplash.com/photo-1635784063388-1ff335239b40?w=600&q=80",
  },
  {
    id: 8, name: "ABS Wheel Speed Sensor", category: "Electrical",
    sku: "ELC-002", price: 32.50, originalPrice: null, stock: 0,
    badge: null, isActive: true,
    description: "OEM-grade replacement. Direct fit for 2010–2020 models.",
    img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80",
  },
  {
    id: 9, name: "Twin-Tube Shock Absorbers", category: "Suspension",
    sku: "SUS-002", price: 124.99, originalPrice: 159.99, stock: 17,
    badge: "SALE", isActive: true,
    description: "Gas charged. Significantly improved ride quality and handling.",
    img: "https://images.unsplash.com/photo-1449130534935-d2f914ded10e?w=600&q=80",
  },
  {
    id: 10, name: "Microfibre Steering Cover", category: "Accessories",
    sku: "ACC-002", price: 24.99, originalPrice: null, stock: 55,
    badge: null, isActive: true,
    description: "Premium microfibre. Non-slip grip texture. 37–38cm diameter.",
    img: "https://images.unsplash.com/photo-1537896418313-45e5e3b4eaa5?w=600&q=80",
  },
];

const SEED_PROMOS = [
  {
    id: "promo-oil-change",
    title: "Oil Change Special",
    emoji: "🛢️",
    badge: "20% OFF",
    badgeType: "percent",
    newPrice: 39.99,
    oldPrice: 49.99,
    filterCategory: "all",
    isActive: true,
  },
  {
    id: "promo-battery-electrical",
    title: "Battery & Electrical",
    emoji: "🔋",
    badge: "15% OFF",
    badgeType: "percent",
    newPrice: 32.50,
    oldPrice: 38.99,
    filterCategory: "Electrical",
    isActive: true,
  },
  {
    id: "promo-free-inspection",
    title: "Free Inspection",
    emoji: "🔍",
    badge: "FREE",
    badgeType: "free",
    newPrice: 0,
    oldPrice: 29.99,
    filterCategory: "Brakes",
    isActive: true,
  },
];

const SEED_NEWS = [
  {
    id: "news-brake-signs",
    title: "5 Signs Your Brakes Need Immediate Attention",
    excerpt: "Squealing, grinding, or a soft pedal are your car begging for help. Here are the top warning signs every driver should know before it's too late.",
    category: "Tips & Guides",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    tagColor: "#A67F38", tagBg: "rgba(166,127,56,.18)", tagBorder: "rgba(166,127,56,.35)",
    isNew: true, isPublished: true,
    date: "March 10, 2024", readTime: "3 min read",
    body: `<p>Your brakes are the single most important safety system on your vehicle. Ignoring early warning signs can turn a minor repair into a costly — or dangerous — situation.</p>
<p style="color:#A67F38;font-weight:600;margin-top:18px;">Watch out for these signs:</p>
<ul style="margin:10px 0 16px 18px;line-height:2;">
  <li>Squealing or grinding noises when braking</li>
  <li>Soft or spongy brake pedal feel</li>
  <li>Vehicle pulling to one side</li>
  <li>Vibration through the steering wheel</li>
  <li>Brake warning light on dashboard</li>
</ul>
<p>If you notice any of these symptoms, visit REV Auto Repair immediately. Our certified technicians will perform a full brake inspection — <strong style="color:#D9B573;">free of charge</strong> this month.</p>`,
  },
  {
    id: "news-oil-change-promo",
    title: "Oil Change Special — Save 20% This Month",
    excerpt: "Limited-time deal on full synthetic oil changes — complete with a free 21-point inspection at no extra cost.",
    category: "Promotions",
    img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
    tagColor: "#d97706", tagBg: "rgba(217,119,6,.18)", tagBorder: "rgba(217,119,6,.35)",
    isNew: true, isPublished: true,
    date: "Dec 18, 2024", readTime: "2 min read",
    body: `<p>We're thrilled to announce that our most popular promotion has been extended by popular demand. This week only, get 20% off a full synthetic oil change for any vehicle.</p>
<p>The deal includes our comprehensive 21-point vehicle inspection absolutely free — normally valued at ₱999.</p>
<ul style="margin:10px 0 16px 18px;line-height:2;">
  <li>Full synthetic oil change (up to 5 quarts)</li>
  <li>New oil filter</li>
  <li>21-point vehicle inspection</li>
  <li>Tire pressure check and adjustment</li>
</ul>`,
  },
  {
    id: "news-ev-servicing",
    title: "Electric Vehicle Servicing: What You Need to Know",
    excerpt: "As EVs become mainstream, REV is now fully equipped for electric and hybrid vehicles.",
    category: "Shop News",
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
    tagColor: "#8b5cf6", tagBg: "rgba(139,92,246,.15)", tagBorder: "rgba(139,92,246,.35)",
    isNew: false, isPublished: true,
    date: "March 5, 2024", readTime: "4 min read",
    body: `<p>The automotive landscape is shifting fast. REV Auto Repair has invested in the tools, training, and certifications needed to service electric and hybrid vehicles properly.</p>
<ul style="margin:10px 0 16px 18px;line-height:2;">
  <li>High-voltage battery diagnostics</li>
  <li>Regenerative braking system checks</li>
  <li>Charging port inspection and repair</li>
  <li>Software updates and ECU calibration</li>
  <li>Hybrid drivetrain servicing</li>
</ul>`,
  },
  {
    id: "news-battery-heat",
    title: "How to Extend Your Car Battery Life in Hot Weather",
    excerpt: "Heat is the number-one killer of car batteries. Follow these simple steps to protect yours.",
    category: "Tips & Guides",
    img: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
    tagColor: "#A67F38", tagBg: "rgba(166,127,56,.18)", tagBorder: "rgba(166,127,56,.35)",
    isNew: false, isPublished: true,
    date: "March 2, 2024", readTime: "3 min read",
    body: `<p>Most drivers blame cold weather for dead batteries — but heat is actually the bigger threat. High temperatures accelerate the chemical reactions inside a battery, causing it to degrade faster over time.</p>
<ul style="margin:10px 0 16px 18px;line-height:2;">
  <li>Park in the shade or a covered garage whenever possible</li>
  <li>Have your battery tested every 6 months</li>
  <li>Keep terminals clean and corrosion-free</li>
  <li>Avoid short trips that don't allow a full recharge</li>
</ul>`,
  },
  {
    id: "news-free-inspection",
    title: "Free Multi-Point Inspection — Limited Time",
    excerpt: "Get a comprehensive 27-point vehicle inspection completely free this month.",
    category: "Promotions",
    img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop",
    tagColor: "#d97706", tagBg: "rgba(217,119,6,.18)", tagBorder: "rgba(217,119,6,.35)",
    isNew: false, isPublished: true,
    date: "Feb 28, 2024", readTime: "2 min read",
    body: `<p>For a limited time, REV Auto Repair is offering a complimentary 27-point multi-point inspection on every vehicle — no purchase necessary.</p>
<ul style="margin:10px 0 16px 18px;line-height:2;">
  <li>Brakes, rotors, and brake fluid</li>
  <li>Tire tread depth and pressure</li>
  <li>Engine oil and all fluid levels</li>
  <li>Battery health and charging system</li>
  <li>Lights, wipers, and horn</li>
</ul>`,
  },
  {
    id: "news-shop-live",
    title: "REV Shop Now Live — Browse Hundreds of OEM Parts",
    excerpt: "Our online parts store is live! OEM and aftermarket parts, delivered fast.",
    category: "Service Updates",
    img: "https://images.unsplash.com/photo-1632823469850-1b0fabc8e00b?w=600&h=400&fit=crop",
    tagColor: "#10b981", tagBg: "rgba(16,185,129,.15)", tagBorder: "rgba(16,185,129,.3)",
    isNew: false, isPublished: true,
    date: "Feb 25, 2024", readTime: "2 min read",
    body: `<p>After months of development, the REV online parts store is officially live. Browse hundreds of OEM-spec and quality aftermarket parts from the comfort of your home.</p>
<ul style="margin:10px 0 16px 18px;line-height:2;">
  <li>Engine components and filters</li>
  <li>Brake pads, rotors, and calipers</li>
  <li>Suspension and steering parts</li>
  <li>Electrical components and sensors</li>
</ul>`,
  },
];

// ─────────────────────────────────────────
//  SEEDER  —  idempotent, runs once
// ─────────────────────────────────────────
async function _seedIfEmpty(collectionName, seedData, idField = "id") {
  const ref  = collection(db, collectionName);
  const snap = await getDocs(ref);
  if (!snap.empty) {
    console.log(`[FirebaseDB] '${collectionName}' already seeded (${snap.size} docs). Skipping.`);
    return false;
  }

  const batch = writeBatch(db);
  seedData.forEach((item) => {
    const docRef = doc(db, collectionName, String(item[idField]));
    batch.set(docRef, {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
  console.log(`[FirebaseDB] ✅ '${collectionName}' seeded with ${seedData.length} documents.`);
  return true;
}

async function seedDatabase() {
  try {
    await _seedIfEmpty("Products", SEED_PRODUCTS, "id");
    await _seedIfEmpty("Promos",   SEED_PROMOS,   "id");
    await _seedIfEmpty("News",     SEED_NEWS,      "id");
    console.log("[FirebaseDB] ✅ Database seed complete.");
  } catch (err) {
    console.error("[FirebaseDB] Seed error:", err);
  }
}

// ─────────────────────────────────────────
//  LIVE LISTENERS
// ─────────────────────────────────────────

let _unsubProducts = null;
let _unsubPromos   = null;
let _unsubNews     = null;

function _startProductsListener() {
  if (_unsubProducts) return;

  _unsubProducts = onSnapshot(
    collection(db, "Products"),
    (snap) => {
      const products = snap.docs
        .map((d) => {
          const data = d.data();
          return {
            id:       data.id,
            name:     data.name,
            cat:      data.category,
            price:    data.price,
            orig:     data.originalPrice ?? null,
            stock:    data.stock,
            sku:      data.sku,
            badge:    data.badge ?? null,
            desc:     data.description,
            img:      data.img,
            _docId:   d.id,
            isActive: data.isActive !== false,
          };
        })
        .filter((p) => p.isActive)
        .sort((a, b) => a.id - b.id);

      if (typeof window.PRODUCTS !== "undefined") {
        window.PRODUCTS.length = 0;
        products.forEach((p) => window.PRODUCTS.push(p));
      } else {
        window.PRODUCTS = products;
      }

      if (typeof window.CatalogFilter !== "undefined") {
        window.CatalogFilter.renderGrid();
      }

      console.log(`[FirebaseDB] Products synced — ${products.length} active items.`);
    },
    (err) => console.error("[FirebaseDB] Products listener error:", err)
  );
}

function _startPromosListener() {
  if (_unsubPromos) return;

  _unsubPromos = onSnapshot(
    collection(db, "Promos"),
    (snap) => {
      const promos = snap.docs
        .map((d) => ({ ...d.data(), _docId: d.id }))
        .filter((p) => p.isActive);

      window._DB_PROMOS = promos;

      if (typeof window._renderPromoStrip === "function") {
        window._renderPromoStrip(promos);
      }

      console.log(`[FirebaseDB] Promos synced — ${promos.length} active promos.`);
    },
    (err) => console.error("[FirebaseDB] Promos listener error:", err)
  );
}

function _startNewsListener() {
  if (_unsubNews) return;

  _unsubNews = onSnapshot(
    collection(db, "News"),
    (snap) => {
      const articles = snap.docs
        .map((d) => ({ ...d.data(), _docId: d.id }))
        .filter((a) => a.isPublished)
        .sort((a, b) => {
          const ta = a.publishedAt?.toMillis?.() ?? a.createdAt?.toMillis?.() ?? 0;
          const tb = b.publishedAt?.toMillis?.() ?? b.createdAt?.toMillis?.() ?? 0;
          return tb - ta;
        });

      if (typeof window.NEWS_ARTICLES !== "undefined") {
        window.NEWS_ARTICLES.length = 0;
        articles.forEach((a) => window.NEWS_ARTICLES.push(a));
      } else {
        window.NEWS_ARTICLES = articles;
      }

      if (typeof window.NewsFilter !== "undefined") {
        window.NewsFilter.init();
      }

      console.log(`[FirebaseDB] News synced — ${articles.length} published articles.`);
    },
    (err) => console.error("[FirebaseDB] News listener error:", err)
  );
}

// ─────────────────────────────────────────
//  STOCK MANAGEMENT
// ─────────────────────────────────────────

async function decrementStock(items) {
  if (!items || !items.length) return;
  try {
    const batch = writeBatch(db);
    items.forEach(({ productId, qty }) => {
      const ref = doc(db, "Products", String(productId));
      batch.update(ref, {
        stock:     increment(-qty),
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
    console.log(`[FirebaseDB] ✅ Stock decremented for ${items.length} product(s).`);
  } catch (err) {
    console.error("[FirebaseDB] decrementStock error:", err);
  }
}

async function restoreStock(productId, qty = 1) {
  try {
    await updateDoc(doc(db, "Products", String(productId)), {
      stock:     increment(qty),
      updatedAt: serverTimestamp(),
    });
    console.log(`[FirebaseDB] ✅ Stock restored: product ${productId} +${qty}`);
  } catch (err) {
    console.error("[FirebaseDB] restoreStock error:", err);
  }
}

// ─────────────────────────────────────────
//  ADMIN / STAFF API  —  window.ShopDB
// ─────────────────────────────────────────

const ShopDB = {

  async getAllProducts() {
    const snap = await getDocs(collection(db, "Products"));
    return snap.docs.map((d) => ({ _docId: d.id, ...d.data() }));
  },

  async addProduct(data) {
    const snap   = await getDocs(collection(db, "Products"));
    const maxId  = snap.docs.reduce((m, d) => Math.max(m, d.data().id || 0), 0);
    const newId  = maxId + 1;
    const docRef = doc(db, "Products", String(newId));
    await setDoc(docRef, {
      id:            newId,
      name:          data.name          || "Unnamed Product",
      category:      data.category      || "Accessories",
      sku:           data.sku           || `SKU-${newId}`,
      price:         Number(data.price) || 0,
      originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
      stock:         Number(data.stock) || 0,
      badge:         data.badge         || null,
      description:   data.description   || "",
      img:           data.img           || "",
      isActive:      data.isActive !== false,
      createdAt:     serverTimestamp(),
      updatedAt:     serverTimestamp(),
    });
    return String(newId);
  },

  async updateProduct(productId, fields) {
    await updateDoc(doc(db, "Products", String(productId)), {
      ...fields,
      updatedAt: serverTimestamp(),
    });
  },

  async deactivateProduct(productId) {
    await updateDoc(doc(db, "Products", String(productId)), {
      isActive:  false,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteProduct(productId) {
    await deleteDoc(doc(db, "Products", String(productId)));
  },

  async setStock(productId, newStock) {
    await updateDoc(doc(db, "Products", String(productId)), {
      stock:     Number(newStock),
      updatedAt: serverTimestamp(),
    });
  },

  async adjustStock(productId, delta) {
    await updateDoc(doc(db, "Products", String(productId)), {
      stock:     increment(delta),
      updatedAt: serverTimestamp(),
    });
  },

  async getAllPromos() {
    const snap = await getDocs(collection(db, "Promos"));
    return snap.docs.map((d) => ({ _docId: d.id, ...d.data() }));
  },

  async addPromo(data) {
    const id     = data.id || `promo-${Date.now()}`;
    const docRef = doc(db, "Promos", id);
    await setDoc(docRef, {
      id,
      title:          data.title          || "New Promo",
      emoji:          data.emoji          || "🏷️",
      badge:          data.badge          || "SALE",
      badgeType:      data.badgeType      || "percent",
      newPrice:       Number(data.newPrice) || 0,
      oldPrice:       Number(data.oldPrice) || 0,
      filterCategory: data.filterCategory || "all",
      isActive:       data.isActive !== false,
      startsAt:       data.startsAt       || null,
      endsAt:         data.endsAt         || null,
      createdAt:      serverTimestamp(),
      updatedAt:      serverTimestamp(),
    });
    return id;
  },

  async updatePromo(promoId, fields) {
    await updateDoc(doc(db, "Promos", promoId), {
      ...fields,
      updatedAt: serverTimestamp(),
    });
  },

  async setPromoActive(promoId, isActive) {
    await updateDoc(doc(db, "Promos", promoId), {
      isActive,
      updatedAt: serverTimestamp(),
    });
  },

  async deletePromo(promoId) {
    await deleteDoc(doc(db, "Promos", promoId));
  },

  async getAllNews() {
    const snap = await getDocs(collection(db, "News"));
    return snap.docs.map((d) => ({ _docId: d.id, ...d.data() }));
  },

  async addArticle(data) {
    const id     = data.id || `news-${Date.now()}`;
    const docRef = doc(db, "News", id);
    await setDoc(docRef, {
      id,
      title:       data.title       || "Untitled Article",
      excerpt:     data.excerpt     || "",
      body:        data.body        || "",
      category:    data.category    || "Shop News",
      img:         data.img         || "",
      tagColor:    data.tagColor    || "#A67F38",
      tagBg:       data.tagBg       || "rgba(166,127,56,.18)",
      tagBorder:   data.tagBorder   || "rgba(166,127,56,.35)",
      isNew:       data.isNew       !== false,
      isPublished: data.isPublished !== false,
      date:        data.date        || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime:    data.readTime    || "2 min read",
      publishedAt: data.isPublished ? serverTimestamp() : null,
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp(),
    });
    return id;
  },

  async updateArticle(articleId, fields) {
    const update = { ...fields, updatedAt: serverTimestamp() };
    if (fields.isPublished === true) update.publishedAt = serverTimestamp();
    await updateDoc(doc(db, "News", articleId), update);
  },

  async setPublished(articleId, isPublished) {
    const update = { isPublished, updatedAt: serverTimestamp() };
    if (isPublished) update.publishedAt = serverTimestamp();
    await updateDoc(doc(db, "News", articleId), update);
  },

  async deleteArticle(articleId) {
    await deleteDoc(doc(db, "News", articleId));
  },

  decrementStock,
  restoreStock,

  async forceSeed() {
    await seedDatabase();
  },

  async getStockLevels() {
    const snap = await getDocs(collection(db, "Products"));
    return snap.docs.map((d) => {
      const { id, name, sku, stock, isActive } = d.data();
      return { id, name, sku, stock, isActive };
    }).sort((a, b) => a.id - b.id);
  },
};

window.ShopDB = ShopDB;

// ─────────────────────────────────────────
//  PROMO STRIP RENDERER
// ─────────────────────────────────────────
window._renderPromoStrip = function (promos) {
  const strip = document.querySelector(".promo-strip");
  if (!strip) return;

  strip.innerHTML = promos.map((p) => {
    const isFreeBadge = p.badgeType === "free";
    const priceHTML = p.newPrice === 0
      ? `<span class="promo-new">FREE</span><span class="promo-old">$${Number(p.oldPrice).toFixed(2)}</span>`
      : `<span class="promo-new">$${Number(p.newPrice).toFixed(2)}</span><span class="promo-old">$${Number(p.oldPrice).toFixed(2)}</span>`;

    return `
      <div class="promo-card-sm" onclick="filterCatalog('${p.filterCategory}')">
        <div class="promo-badge ${isFreeBadge ? 'free' : ''}">${p.badge}</div>
        <div class="promo-emoji">${p.emoji}</div>
        <div class="font-barlow text-xl font-bold gt">${p.title}</div>
        <div class="promo-price">${priceHTML}</div>
        <button class="btn-gold-sm mt-2">Shop Now</button>
      </div>`;
  }).join("");

  console.log(`[FirebaseDB] Promo strip rendered with ${promos.length} item(s).`);
};

// ─────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────
async function init() {
  console.log("[FirebaseDB] Initializing… SDK: 12.11.0");
  await seedDatabase();
  _startProductsListener();
  _startPromosListener();
  _startNewsListener();
  console.log("[FirebaseDB] ✅ All listeners active. window.ShopDB ready.");
}

init().catch((err) => console.error("[FirebaseDB] Init error:", err));

export { ShopDB, decrementStock, restoreStock };
export default ShopDB;