// Minimal seed products for admin product tabs
    const SEED_PRODUCTS = [
      {id:1,name:'Performance Brake Kit',cat:'Brakes',icon:'🛞',price:149.99,orig:199.99,stock:23,sku:'BRK-001',badge:'HOT',img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80',desc:'High-performance brake kit for track and street use'},
      {id:2,name:'Cold Air Intake',cat:'Engine',icon:'🔧',price:89.99,orig:null,stock:41,sku:'ENG-002',badge:null,img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80',desc:'Increases airflow and improves engine performance'},
      {id:3,name:'Coilover Suspension Kit',cat:'Suspension',icon:'⚙️',price:349.99,orig:449.99,stock:8,sku:'SUS-003',badge:'SALE',img:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&q=80',desc:'Full coilover kit with adjustable ride height'},
      {id:4,name:'LED Headlight Upgrade',cat:'Electrical',icon:'💡',price:129.99,orig:null,stock:55,sku:'ELE-004',badge:'NEW',img:'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=200&q=80',desc:'Direct-fit LED upgrade with plug-and-play installation'},
      {id:5,name:'Cat-Back Exhaust System',cat:'Exhaust',icon:'🔩',price:449.99,orig:599.99,stock:4,sku:'EXH-005',badge:'SALE',img:'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=200&q=80',desc:'Stainless steel cat-back for improved sound and flow'},
      {id:6,name:'Short Throw Shifter',cat:'Accessories',icon:'🏎️',price:74.99,orig:null,stock:30,sku:'ACC-006',badge:null,img:'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&q=80',desc:'Reduces shift throw for faster gear changes'},
      {id:7,name:'Sport Air Filter',cat:'Engine',icon:'🔧',price:39.99,orig:null,stock:2,sku:'ENG-007',badge:null,img:'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&q=80',desc:'High-flow washable and reusable sport air filter'},
    ];

    /* ============================================================
       Store — Centralised product state
    ============================================================ */
    const Store = (() => {
      let _products = SEED_PRODUCTS.map(p => ({ ...p }));
      let _nextId   = _products.length + 1;
      const _listeners = [];

      function subscribe(fn) { _listeners.push(fn); }
      function _notify() { _listeners.forEach(fn => fn()); }

      function getAll()    { return [..._products]; }
      function getById(id) { return _products.find(p => p.id === id) || null; }
      function getFiltered({ category = 'all', query = '' } = {}) {
        const q = query.toLowerCase().trim();
        return _products.filter(p => {
          const matchCat = category === 'all' || p.cat === category;
          const matchQ   = !q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
          return matchCat && matchQ;
        });
      }
      function getLowStock(t = 5)     { return _products.filter(p => p.stock <= t); }
      function getTotalCount()        { return _products.length; }
      function getCategories()        { return [...new Set(_products.map(p => p.cat))]; }
      function getSimulatedRevenue()  { return _products.reduce((s, p) => s + p.price * Math.max(0, 50 - p.stock), 0); }

      function add(data)        { _products.push({ id: _nextId++, ...data }); _notify(); }
      function update(id, data) { const i = _products.findIndex(p => p.id === id); if (i === -1) return false; _products[i] = { ..._products[i], ...data }; _notify(); return true; }
      function remove(id)       { const before = _products.length; _products = _products.filter(p => p.id !== id); const removed = _products.length < before; if (removed) _notify(); return removed; }
      function adjustStock(id, delta) { const p = getById(id); if (!p) return false; return update(id, { stock: Math.max(0, p.stock + delta) }); }

      return { subscribe, getAll, getById, getFiltered, getLowStock, getTotalCount, getCategories, getSimulatedRevenue, add, update, remove, adjustStock };
    })();

    /* ============================================================
       Toast — Admin notifications
    ============================================================ */
    const Toast = (() => {
      let _timer = null;
      function _show(type, icon, message) {
        const el = document.getElementById('toast'), ico = document.getElementById('t-ico'), msg = document.getElementById('t-msg');
        ico.textContent = icon; msg.textContent = message;
        el.className = `toast ${type === 'error' ? 'err' : ''} show`;
        clearTimeout(_timer);
        _timer = setTimeout(() => el.classList.remove('show'), 2800);
      }
      return {
        success: msg => _show('success', '✦', msg),
        error:   msg => _show('error',   '✕', msg),
        info:    msg => _show('info',    '→', msg),
      };
    })();

    /* ============================================================
       AdminPage — Products, Inventory, Overview, Orders, Services
    ============================================================ */
    const AdminPage = (() => {
      const CREDENTIALS  = { user: 'admin', pass: 'apex2024' };
      const FALLBACK_IMG = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80';

      let _loggedIn  = false;
      let _activeTab = 'overview';
      let _editingId = null;

      function render() {
        document.getElementById('page-admin').innerHTML = _template();
        if (_loggedIn) _refreshDashboard();
      }

      function login() {
        const u = document.getElementById('l-user')?.value;
        const p = document.getElementById('l-pass')?.value;
        if (u === CREDENTIALS.user && p === CREDENTIALS.pass) {
          _loggedIn = true; render(); Toast.success('Welcome back, Admin');
        } else { Toast.error('Invalid credentials'); }
      }

      function logout() { _loggedIn = false; render(); Toast.info('Signed out'); }

      function switchTab(tabId, el) {
        _activeTab = tabId;
        document.querySelectorAll('.a-tab').forEach(t => t.classList.remove('active'));
        document.getElementById('tab-' + tabId)?.classList.add('active');
        document.querySelectorAll('.a-nav-item').forEach(i => i.classList.remove('active'));
        el.classList.add('active');
        _refreshDashboard();
        // Init services if switching to services tab
        if (tabId === 'services') { setTimeout(() => svcRender(), 50); }
      }

      function deleteProduct(id) { if (!confirm('Delete this product?')) return; Store.remove(id); Toast.success('Product deleted'); }
      function adjustStock(id, delta) { Store.adjustStock(id, delta); }

      function openModal(id = null) {
        _editingId = id;
        document.getElementById('modal-title').textContent = id ? 'Edit Product' : 'Add Product';
        ['p-name','p-cat','p-icon','p-price','p-orig','p-stock','p-sku','p-badge','p-img','p-desc'].forEach(fieldId => { const el = document.getElementById(fieldId); if (el) el.value = ''; });
        if (id) {
          const p = Store.getById(id); if (!p) return;
          document.getElementById('p-name').value  = p.name;
          document.getElementById('p-cat').value   = p.cat;
          document.getElementById('p-icon').value  = p.icon;
          document.getElementById('p-price').value = p.price;
          document.getElementById('p-orig').value  = p.orig  || '';
          document.getElementById('p-stock').value = p.stock;
          document.getElementById('p-sku').value   = p.sku;
          document.getElementById('p-badge').value = p.badge || '';
          document.getElementById('p-img').value   = p.img   || '';
          document.getElementById('p-desc').value  = p.desc;
        }
        document.getElementById('product-modal').classList.add('open');
      }

      function closeModal() { document.getElementById('product-modal').classList.remove('open'); _editingId = null; }

      function saveProduct() {
        const name = document.getElementById('p-name').value.trim();
        const price = parseFloat(document.getElementById('p-price').value);
        const stock = parseInt(document.getElementById('p-stock').value);
        if (!name || isNaN(price) || isNaN(stock)) { Toast.error('Please fill in Name, Price and Stock'); return; }
        const data = {
          name, cat: document.getElementById('p-cat').value, icon: document.getElementById('p-icon').value || '🔧',
          price, orig: parseFloat(document.getElementById('p-orig').value) || null, stock,
          sku: document.getElementById('p-sku').value || `AUTO-${Date.now()}`,
          badge: document.getElementById('p-badge').value || null,
          img: document.getElementById('p-img').value || FALLBACK_IMG,
          desc: document.getElementById('p-desc').value,
        };
        if (_editingId) { Store.update(_editingId, data); Toast.success('Product updated'); }
        else { Store.add(data); Toast.success('Product added'); }
        closeModal();
      }

      function _refreshDashboard() {
        if (!_loggedIn) return;
        const products = Store.getAll();
        _set('dc-total', Store.getTotalCount());
        _set('dc-rev',   '$' + Math.round(Store.getSimulatedRevenue() / 1000) + 'K');
        _set('dc-low',   Store.getLowStock().length);
        _set('dc-cats',  Store.getCategories().length);
        _renderTable('ov-tbody', products.slice(-5).reverse(), _overviewRow);
        _renderTable('prod-tbody', products, _productRow);
        _renderTable('inv-tbody', products, _inventoryRow);
      }

      function _renderTable(tbodyId, rows, rowFn) {
        const tbody = document.getElementById(tbodyId);
        if (tbody) tbody.innerHTML = rows.map(rowFn).join('');
      }

      function _overviewRow(p) {
        return `<tr>
          <td><img class="td-img" src="${p.img}" alt="" onerror="this.src='${FALLBACK_IMG}'"></td>
          <td><strong style="font-family:var(--font-display)">${p.name}</strong></td>
          <td style="color:var(--muted);font-size:.78rem;letter-spacing:.5px">${p.cat}</td>
          <td style="font-family:var(--font-display);font-size:1.05rem;color:var(--gold-light)">$${p.price.toFixed(2)}</td>
          <td>${_stockBadge(p.stock)}</td>
        </tr>`;
      }

      function _productRow(p) {
        return `<tr>
          <td><img class="td-img" src="${p.img}" alt="" onerror="this.src='${FALLBACK_IMG}'"></td>
          <td><strong style="font-family:var(--font-display)">${p.name}</strong><br><span style="font-family:var(--font-mono);font-size:.68rem;color:var(--muted)">${p.sku}</span></td>
          <td style="color:var(--muted);font-size:.78rem">${p.cat}</td>
          <td style="font-family:var(--font-display);font-size:1.05rem;color:var(--gold-light)">$${p.price.toFixed(2)}</td>
          <td>${p.stock}</td>
          <td>${_stockBadge(p.stock)}</td>
          <td style="display:flex;gap:.4rem;flex-wrap:wrap">
            <button class="a-edit-btn" onclick="AdminPage.openModal(${p.id})">Edit</button>
            <button class="a-del-btn"  onclick="AdminPage.deleteProduct(${p.id})">Delete</button>
          </td>
        </tr>`;
      }

      function _inventoryRow(p) {
        return `<tr>
          <td><img class="td-img" src="${p.img}" alt="" onerror="this.src='${FALLBACK_IMG}'"></td>
          <td><strong style="font-family:var(--font-display)">${p.name}</strong></td>
          <td style="font-family:var(--font-mono);font-size:.72rem;color:var(--muted)">${p.sku}</td>
          <td><strong>${p.stock}</strong></td>
          <td>${_stockBadge(p.stock)}</td>
          <td>
            <div class="inv-grp">
              <button class="inv-b"          onclick="AdminPage.adjustStock(${p.id}, -1)">−</button>
              <button class="inv-b inv-b-plus" onclick="AdminPage.adjustStock(${p.id},  1)">+</button>
              <button class="inv-b-ten"       onclick="AdminPage.adjustStock(${p.id}, 10)">+10</button>
            </div>
          </td>
        </tr>`;
      }

      function _stockBadge(stock) {
        if (stock === 0) return '<span class="st-badge st-out">Out of Stock</span>';
        if (stock <= 5)  return '<span class="st-badge st-low">Low Stock</span>';
        return '<span class="st-badge st-in">In Stock</span>';
      }

      function _set(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

      function _template() {
        return `
          <div class="admin-login-wrap" id="admin-login" style="display:${_loggedIn ? 'none' : 'flex'}">
            <div class="login-card">
              <div class="login-card-logo">rev</div>
              <div class="login-card-sub">Admin Portal</div>
              <label class="f-label">Username</label>
              <input class="f-input" type="text" id="l-user" placeholder="admin">
              <label class="f-label">Password</label>
              <input class="f-input" type="password" id="l-pass" placeholder="••••••••" onkeydown="if(event.key==='Enter') AdminPage.login()">
              <button class="btn-gold login-btn" onclick="AdminPage.login()">Sign In</button>
              <div class="login-hint">Credentials: <code>admin</code> / <code>apex2024</code></div>
            </div>
          </div>

          <div class="admin-shell ${_loggedIn ? 'visible' : ''}" id="admin-shell">
            <div class="admin-top">
              <div class="admin-top-title">⚙ Admin Dashboard</div>
              <div class="admin-top-right">
                <span class="admin-top-user">Signed in as <strong>admin</strong></span>
                <button class="logout-btn" onclick="AdminPage.logout()">Logout</button>
              </div>
            </div>

            <div class="admin-body">
              <div class="admin-nav">
                <div class="a-nav-item ${_activeTab === 'overview'  ? 'active' : ''}" onclick="AdminPage.switchTab('overview', this)">📊 Overview</div>
                <div class="a-nav-item ${_activeTab === 'products'  ? 'active' : ''}" onclick="AdminPage.switchTab('products', this)">📦 Products</div>
                <div class="a-nav-item ${_activeTab === 'inventory' ? 'active' : ''}" onclick="AdminPage.switchTab('inventory', this)">🗃 Inventory</div>
                <div class="a-nav-item ${_activeTab === 'services'  ? 'active' : ''}" onclick="AdminPage.switchTab('services', this)">🔧 Services</div>
                <div class="a-nav-item ${_activeTab === 'orders'    ? 'active' : ''}" onclick="AdminPage.switchTab('orders', this)">🛒 Orders</div>
              </div>

              <div class="admin-content">

                <!-- Overview tab -->
                <div class="a-tab ${_activeTab === 'overview' ? 'active' : ''}" id="tab-overview">
                  <div class="dash-grid">
                    <div class="dash-card"><div class="dc-label">Total Products</div><div class="dc-val" id="dc-total">0</div><div class="dc-sub">In catalog</div></div>
                    <div class="dash-card"><div class="dc-label">Revenue Est.</div><div class="dc-val" id="dc-rev">$0</div><div class="dc-sub">Simulated</div></div>
                    <div class="dash-card alert"><div class="dc-label">Low Stock</div><div class="dc-val" id="dc-low">0</div><div class="dc-sub">Need restock</div></div>
                    <div class="dash-card"><div class="dc-label">Categories</div><div class="dc-val" id="dc-cats">0</div><div class="dc-sub">Active</div></div>
                  </div>
                  <div class="sec-hd"><div class="sec-title">Recent Products</div></div>
                  <table class="a-table">
                    <thead><tr><th></th><th>Product</th><th>Category</th><th>Price</th><th>Status</th></tr></thead>
                    <tbody id="ov-tbody"></tbody>
                  </table>
                </div>

                <!-- Products tab -->
                <div class="a-tab ${_activeTab === 'products' ? 'active' : ''}" id="tab-products">
                  <div class="sec-hd">
                    <div class="sec-title">All Products</div>
                    <button class="btn-sm-gold" onclick="AdminPage.openModal()">+ Add Product</button>
                  </div>
                  <table class="a-table">
                    <thead><tr><th></th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody id="prod-tbody"></tbody>
                  </table>
                </div>

                <!-- Inventory tab -->
                <div class="a-tab ${_activeTab === 'inventory' ? 'active' : ''}" id="tab-inventory">
                  <div class="sec-hd"><div class="sec-title">Inventory Management</div></div>
                  <table class="a-table">
                    <thead><tr><th></th><th>Product</th><th>SKU</th><th>Stock</th><th>Status</th><th>Adjust</th></tr></thead>
                    <tbody id="inv-tbody"></tbody>
                  </table>
                </div>

                <!-- Services tab -->
                <div class="a-tab ${_activeTab === 'services' ? 'active' : ''}" id="tab-services">
                  <div class="svc-stats-grid">
                    <div class="svc-stat-card"><div><div class="svc-stat-label">Total Services</div><div class="svc-stat-val" id="svcStatTotal">0</div></div><div class="svc-stat-icon gold">🔧</div></div>
                    <div class="svc-stat-card"><div><div class="svc-stat-label">Active Services</div><div class="svc-stat-val" id="svcStatActive">0</div></div><div class="svc-stat-icon green">✅</div></div>
                    <div class="svc-stat-card"><div><div class="svc-stat-label">Avg. Price</div><div class="svc-stat-val" id="svcStatAvg">0</div></div><div class="svc-stat-icon blue">💲</div></div>
                    <div class="svc-stat-card"><div><div class="svc-stat-label">Popular</div><div class="svc-stat-val" id="svcStatPop">0</div></div><div class="svc-stat-icon star">⭐</div></div>
                  </div>

                  <div class="svc-table-section">
                    <div class="svc-toolbar">
                      <div class="svc-toolbar-left">
                        Show
                        <select class="svc-show-select" onchange="svcChangePerPage(this.value)">
                          <option>5</option><option>10</option><option>25</option><option>50</option>
                        </select>
                        entries
                      </div>
                      <div class="svc-search-box">
                        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                        <input type="text" id="svcSearchInput" placeholder="Search services…" oninput="svcFilter()"/>
                      </div>
                      <div class="svc-toolbar-right">
                        <div class="svc-export-wrap">
                          <button class="svc-btn svc-btn-outline" onclick="svcToggleExport(event)">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                            Export
                          </button>
                          <div class="svc-export-menu" id="svcExportMenu">
                            <div class="svc-export-menu-title">Export As</div>
                            <div class="svc-export-item" onclick="svcExportPDF()"><div class="svc-export-item-icon pdf">📄</div><div>PDF<span class="svc-export-item-sub">Formatted report</span></div></div>
                            <div class="svc-export-item" onclick="svcExportExcel()"><div class="svc-export-item-icon excel">📊</div><div>Excel<span class="svc-export-item-sub">.xlsx spreadsheet</span></div></div>
                          </div>
                        </div>
                        <button class="svc-btn svc-btn-action" id="svcQaBtn" onclick="svcQuickAction()">⚡ Quick Action</button>
                        <button class="svc-btn svc-btn-primary" onclick="svcShowAddModal()">
                          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                          Add Service
                        </button>
                      </div>
                    </div>

                    <!-- Selection bar -->
                    <div class="svc-select-bar" id="svcSelectBar">
                      <span class="svc-select-count" id="svcSelectCount">None selected</span>
                      <button class="svc-btn-sel-all" onclick="svcToggleSelectAll()"><span id="svcSelAllLabel">Select All</span></button>
                      <button class="svc-btn-bulk-edit" id="svcBulkEditBtn" onclick="svcOpenBulkEdit()" disabled>✏️ Edit Selected</button>
                      <button class="svc-btn-bulk-del" id="svcBulkDelBtn" onclick="svcOpenBulkDelete()" disabled>🗑 Delete Selected</button>
                      <button class="svc-btn-cancel-sel" onclick="svcExitSelectMode()">✕ Cancel</button>
                    </div>

                    <div style="overflow-x:auto">
                      <table class="svc-table">
                        <thead>
                          <tr>
                            <th class="th-check" id="svcThCheck" style="display:none"><input type="checkbox" class="row-check" id="svcHeaderCheck" onchange="svcHeaderCheckToggle()" title="Select all on page"/></th>
                            <th onclick="svcSortBy('id')">ID <span class="sort-arrow" id="svc-s-id"></span></th>
                            <th>Image</th>
                            <th onclick="svcSortBy('name')">Name <span class="sort-arrow" id="svc-s-name"></span></th>
                            <th onclick="svcSortBy('price')">Price <span class="sort-arrow" id="svc-s-price"></span></th>
                            <th onclick="svcSortBy('status')">Status <span class="sort-arrow" id="svc-s-status"></span></th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody id="svcTbody"></tbody>
                      </table>
                    </div>
                    <div class="svc-table-footer">
                      <span id="svcShowingText"></span>
                      <div class="svc-pagination" id="svcPag"></div>
                    </div>
                  </div>
                </div>

                <!-- Orders tab -->
                <div class="a-tab ${_activeTab === 'orders' ? 'active' : ''}" id="tab-orders">
                  <div class="sec-hd"><div class="sec-title">Order History</div></div>
                  <div class="orders-placeholder">— Orders placed via cart will appear here in a live implementation —</div>
                </div>

              </div>
            </div>
          </div>
        `;
      }

      Store.subscribe(() => { if (_loggedIn) _refreshDashboard(); });

      return { render, login, logout, switchTab, openModal, closeModal, saveProduct, deleteProduct, adjustStock };
    })();

    const Admin = AdminPage;

    /* ============================================================
       Theme toggle
    ============================================================ */
    (function(){
      const KEY = 'apex_theme', html = document.documentElement;
      function applyTheme(theme){
        if(theme==='light') html.setAttribute('data-theme','light'); else html.removeAttribute('data-theme');
        const btn = document.getElementById('theme-toggle');
        if(btn) btn.textContent = theme==='light' ? '☀️' : '🌙';
        try { localStorage.setItem(KEY, theme); } catch(e){}
      }
      function init(){
        const saved = localStorage.getItem(KEY);
        applyTheme(saved || 'dark');
        document.addEventListener('click', e => {
          if(e.target?.id === 'theme-toggle'){
            const cur = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            applyTheme(cur==='light' ? 'dark' : 'light');
          }
        });
      }
      if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
    })();

    /* ============================================================
       Router
    ============================================================ */
    const Router = (() => {
      function init() { AdminPage.render(); }
      return { init };
    })();
    Router.init();
 


    /* ============================================================
       Services data & state
    ============================================================ */
    const SVC_EMOJIS = ['🔧','🛞','🛻','🔩','🪛','🚗','🏎️','🔌','🧰','🪝'];

    let svcData = [
      {id:'#SKU005',name:'Oil Change Standard', price:34.99, status:'active',   emoji:'🔧'},
      {id:'#SKU002',name:'Engine Tune-Up',       price:89.99, status:'active',   emoji:'🛞'},
      {id:'#SKU003',name:'Tire Rotation',         price:24.99, status:'active',   emoji:'🛻'},
      {id:'#SKU007',name:'Brake Inspection',      price:49.99, status:'inactive', emoji:'🔩'},
      {id:'#SKU011',name:'A/C Recharge',          price:79.00, status:'active',   emoji:'🪛'},
      {id:'#SKU014',name:'Transmission Flush',    price:119.99,status:'active',   emoji:'🚗'},
      {id:'#SKU019',name:'Wheel Alignment',       price:59.95, status:'inactive', emoji:'🏎️'},
      {id:'#SKU022',name:'Battery Replacement',   price:44.00, status:'active',   emoji:'🔌'},
      {id:'#SKU025',name:'Coolant Flush',          price:39.50, status:'active',   emoji:'🧰'},
      {id:'#SKU030',name:'Fuel System Clean',      price:67.00, status:'inactive', emoji:'🪝'},
    ];

    let svcFil = [...svcData], svcPg = 1, svcPp = 5;
    let svcSortKey = null, svcSortDir = 'asc';
    let svcPendId = null, svcPendImgA = null, svcPendImgE = null;
    let svcSelectMode = false, svcSelectedIds = new Set();

    /* ── SKU generator ── */
    function svcGenerateSKU(){
      const nums = svcData.map(s => { const m = s.id.match(/(\d+)$/); return m ? parseInt(m[1]) : 0; });
      const next = (nums.length ? Math.max(...nums) : 0) + 1;
      return '#SKU' + String(next).padStart(3,'0');
    }

    /* ── Image helpers ── */
    function svcHandleImg(prefix, e){
      const file = e.target.files[0];
      if(!file) return;
      if(file.size > 5*1024*1024){ svcToast('Image must be under 5 MB','error'); return; }
      const reader = new FileReader();
      reader.onload = ev => {
        const b64 = ev.target.result;
        if(prefix==='a') svcPendImgA = b64; else svcPendImgE = b64;
        svcSetImgPreview(prefix, b64);
      };
      reader.readAsDataURL(file);
    }

    function svcSetImgPreview(prefix, src){
      const zone = document.getElementById('svc'+prefix.toUpperCase()+'ImgZone');
      if(!zone) return;
      zone.classList.add('has-preview');
      zone.innerHTML = `<img class="svc-img-preview" src="${src}" alt="preview"/>
        <button class="svc-img-clear-btn" onclick="svcClearImg('${prefix}')" title="Remove">
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>`;
    }

    function svcClearImg(prefix){
      if(prefix==='a') svcPendImgA=null; else svcPendImgE=null;
      svcResetImgZone(prefix);
    }

    function svcResetImgZone(prefix){
      const zoneId = 'svc' + prefix.toUpperCase() + 'ImgZone';
      const zone = document.getElementById(zoneId);
      if(!zone) return;
      zone.classList.remove('has-preview');
      zone.innerHTML = `<input type="file" id="svc${prefix.toUpperCase()}ImgInput" accept="image/*" onchange="svcHandleImg('${prefix}',event)"/>
        <span class="svc-img-upload-icon">📷</span>
        <span class="svc-img-upload-label">Click to upload</span>
        <span class="svc-img-upload-sub">PNG, JPG, WEBP – max 5 MB</span>`;
    }

    /* ── Modal helpers ── */
    function svcShowModal(id){ document.getElementById(id)?.classList.add('open'); }
    function svcHideModal(id){ document.getElementById(id)?.classList.remove('open'); }
    function svcBgClose(e,id){ if(e.target===document.getElementById(id)) svcHideModal(id); }

    function svcShowAddModal(){
      const preview = document.getElementById('svcASkuPreview');
      if(preview) preview.textContent = svcGenerateSKU();
      svcPendImgA = null;
      svcResetImgZone('a');
      const nameEl = document.getElementById('svcAName');
      const priceEl = document.getElementById('svcAPrice');
      const statusEl = document.getElementById('svcAStatus');
      if(nameEl) nameEl.value = '';
      if(priceEl) priceEl.value = '';
      if(statusEl) statusEl.value = 'active';
      svcShowModal('svcAddOverlay');
    }

    /* ── Render ── */
    function svcRender(){
      const tbody = document.getElementById('svcTbody');
      if(!tbody) return;

      const start = (svcPg-1)*svcPp;
      const slice = svcFil.slice(start, start+svcPp);

      tbody.innerHTML = slice.map(s => {
        const isSel = svcSelectMode && svcSelectedIds.has(s.id);
        const imgHtml = s.image
          ? `<img src="${s.image}" style="width:100%;height:100%;object-fit:cover;border-radius:7px;" alt="${s.name}"/>`
          : s.emoji;
        const chkCell = svcSelectMode
          ? `<td style="width:38px;padding:11px 6px 11px 16px;vertical-align:middle">
              <input type="checkbox" class="row-check"${isSel?' checked':''}
               onchange="svcToggleRowSelect('${s.id}',this)" onclick="event.stopPropagation()"/>
             </td>` : '';
        return `<tr class="${isSel?'selected':''}">
          ${chkCell}
          <td><span class="svc-sku-badge">${s.id}</span></td>
          <td><div class="svc-img-cell">${imgHtml}</div></td>
          <td style="font-weight:500">${s.name}</td>
          <td><span class="svc-price-tag">$${s.price.toFixed(2)}</span></td>
          <td><span class="svc-status-pill ${s.status}"><span class="svc-status-dot"></span>${s.status}</span></td>
          <td><div class="svc-actions">
            <button class="svc-action-btn view" title="View" onclick="svcView('${s.id}')">
              <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            </button>
            <button class="svc-action-btn edit" title="Edit" onclick="svcEdit('${s.id}')">
              <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="svc-action-btn delete" title="Delete" onclick="svcDelete('${s.id}')">
              <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div></td>
        </tr>`;
      }).join('');

      const end = Math.min(start+svcPp, svcFil.length);
      const showEl = document.getElementById('svcShowingText');
      if(showEl) showEl.textContent = `Showing ${start+1}–${end} of ${svcFil.length} items`;

      const thCheck = document.getElementById('svcThCheck');
      if(thCheck) thCheck.style.display = svcSelectMode ? 'table-cell' : 'none';
      if(svcSelectMode) svcSyncHeaderCheck();

      svcRenderPag();
      svcUpdateStats();
    }

    function svcRenderPag(){
      const pagEl = document.getElementById('svcPag');
      if(!pagEl) return;
      const pages = Math.max(1, Math.ceil(svcFil.length/svcPp));
      let h = `<button class="svc-page-btn" onclick="svcGoPage(${svcPg-1})" ${svcPg===1?'disabled':''}>‹</button>`;
      for(let i=1;i<=Math.min(pages,5);i++)
        h += `<button class="svc-page-btn ${i===svcPg?'active':''}" onclick="svcGoPage(${i})">${i}</button>`;
      h += `<button class="svc-page-btn" onclick="svcGoPage(${svcPg+1})" ${svcPg>=pages?'disabled':''}>›</button>`;
      pagEl.innerHTML = h;
    }

    function svcUpdateStats(){
      const act = svcData.filter(s=>s.status==='active').length;
      const avg = svcData.length ? Math.round(svcData.reduce((a,s)=>a+s.price,0)/svcData.length) : 0;
      const t = document.getElementById('svcStatTotal');   if(t) t.textContent = svcData.length;
      const a = document.getElementById('svcStatActive');  if(a) a.textContent = act;
      const av = document.getElementById('svcStatAvg');    if(av) av.textContent = avg;
      const p = document.getElementById('svcStatPop');     if(p) p.textContent = Math.max(1, Math.floor(svcData.length/5));
    }

    /* ── Pagination / filter / sort ── */
    function svcGoPage(p){ const mx=Math.ceil(svcFil.length/svcPp); if(p<1||p>mx) return; svcPg=p; svcRender(); }
    function svcFilter(){ const q=(document.getElementById('svcSearchInput')?.value||'').toLowerCase(); svcFil=svcData.filter(s=>s.name.toLowerCase().includes(q)||s.id.toLowerCase().includes(q)||s.status.includes(q)); svcPg=1; svcRender(); }
    function svcChangePerPage(v){ svcPp=parseInt(v); svcPg=1; svcRender(); }
    function svcSortBy(key){
      if(svcSortKey===key) svcSortDir=svcSortDir==='asc'?'desc':'asc'; else { svcSortKey=key; svcSortDir='asc'; }
      document.querySelectorAll('.sort-arrow').forEach(e=>e.className='sort-arrow');
      const el=document.getElementById('svc-s-'+key); if(el) el.className='sort-arrow '+svcSortDir;
      svcFil.sort((a,b)=>{ let va=a[key],vb=b[key]; if(typeof va==='string'){va=va.toLowerCase();vb=vb.toLowerCase();} return svcSortDir==='asc'?(va>vb?1:-1):(va<vb?1:-1); });
      svcRender();
    }

    /* ── Add ── */
    function svcConfirmAdd(){
      const name=document.getElementById('svcAName')?.value.trim();
      const price=parseFloat(document.getElementById('svcAPrice')?.value);
      const status=document.getElementById('svcAStatus')?.value||'active';
      if(!name||isNaN(price)||price<0){ svcToast('Please fill all fields correctly','error'); return; }
      const id=svcGenerateSKU();
      svcData.unshift({id,name,price,status,emoji:SVC_EMOJIS[Math.floor(Math.random()*SVC_EMOJIS.length)],image:svcPendImgA||null});
      svcFil=[...svcData];
      svcHideModal('svcAddOverlay');
      svcPendImgA=null;
      svcRender();
      svcToast(`"${name}" added as ${id}`,'success');
    }

    /* ── View ── */
    function svcView(id){
      const s=svcData.find(x=>x.id===id); if(!s) return;
      const hero=document.getElementById('svcVHero'), emojiEl=document.getElementById('svcVEmoji');
      if(s.image){
        hero.className='svc-view-hero has-img'; hero.style.background='none';
        emojiEl.innerHTML=`<img src="${s.image}" alt="${s.name}" class="svc-view-hero-img"/>
          <div class="svc-view-hero-zoom"><svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>VIEW FULL</div>`;
        hero.onclick=()=>svcOpenLightbox(s.image,s.name);
      } else {
        hero.className='svc-view-hero'; hero.onclick=null;
        emojiEl.innerHTML=s.emoji;
        hero.style.background=s.status==='active'?'linear-gradient(135deg,#10b981,#059669)':'linear-gradient(135deg,#ef4444,#b91c1c)';
      }
      document.getElementById('svcVId').textContent=s.id;
      document.getElementById('svcVName').textContent=s.name;
      document.getElementById('svcVPrice').textContent='$'+s.price.toFixed(2);
      document.getElementById('svcVStatus').innerHTML=`<span class="svc-status-pill ${s.status}"><span class="svc-status-dot"></span>${s.status}</span>`;
      svcShowModal('svcViewOverlay');
    }

    function svcViewToEdit(){
      const id=document.getElementById('svcVId').textContent;
      svcHideModal('svcViewOverlay');
      setTimeout(()=>svcEdit(id),200);
    }

    /* ── Lightbox ── */
    function svcOpenLightbox(src,caption){ document.getElementById('svcLightboxImg').src=src; document.getElementById('svcLightboxCaption').textContent=caption||''; document.getElementById('svcLightbox').classList.add('open'); }
    function svcCloseLightbox(){ document.getElementById('svcLightbox').classList.remove('open'); }

    /* ── Edit ── */
    function svcEdit(id){
      const s=svcData.find(x=>x.id===id); if(!s) return;
      document.getElementById('svcEId').value=s.id;
      document.getElementById('svcESku').value=s.id;
      document.getElementById('svcEName').value=s.name;
      document.getElementById('svcEPrice').value=s.price;
      document.getElementById('svcEStatus').value=s.status;
      document.getElementById('svcEEmoji').textContent=s.emoji;
      svcPendImgE=s.image||null;
      if(s.image) svcSetImgPreview('e',s.image); else svcResetImgZone('e');
      svcShowModal('svcEditOverlay');
    }

    function svcSaveEdit(){
      const id=document.getElementById('svcEId').value;
      const name=document.getElementById('svcEName').value.trim();
      const price=parseFloat(document.getElementById('svcEPrice').value);
      const status=document.getElementById('svcEStatus').value;
      if(!name||isNaN(price)||price<0){ svcToast('Please fill all fields correctly','error'); return; }
      const i=svcData.findIndex(x=>x.id===id); if(i===-1) return;
      svcData[i]={...svcData[i],name,price,status,image:svcPendImgE!==undefined?svcPendImgE:svcData[i].image};
      svcFil=svcFil.map(x=>x.id===id?svcData[i]:x);
      svcHideModal('svcEditOverlay');
      svcPendImgE=null;
      svcRender();
      svcToast(`"${name}" updated`,'success');
    }

    /* ── Delete ── */
    function svcDelete(id){
      const s=svcData.find(x=>x.id===id); if(!s) return;
      svcPendId=id;
      document.getElementById('svcDName').textContent=`"${s.name}"`;
      document.getElementById('svcDEmoji').textContent=s.emoji;
      document.getElementById('svcDNameCard').textContent=s.name;
      document.getElementById('svcDIdCard').textContent=s.id;
      document.getElementById('svcDPriceCard').textContent='$'+s.price.toFixed(2);
      svcShowModal('svcDelOverlay');
    }

    function svcConfirmDelete(){
      if(!svcPendId) return;
      const s=svcData.find(x=>x.id===svcPendId);
      svcData=svcData.filter(x=>x.id!==svcPendId);
      svcFil=svcFil.filter(x=>x.id!==svcPendId);
      const mx=Math.ceil(svcFil.length/svcPp); if(svcPg>mx&&svcPg>1) svcPg=mx;
      svcPendId=null;
      svcHideModal('svcDelOverlay');
      svcRender();
      svcToast(`"${s?s.name:''}" deleted`,'error');
    }

    /* ── Multi-select ── */
    function svcQuickAction(){ svcSelectMode ? svcExitSelectMode() : svcEnterSelectMode(); }
    function svcEnterSelectMode(){
      svcSelectMode=true; svcSelectedIds.clear();
      document.getElementById('svcSelectBar')?.classList.add('visible');
      document.getElementById('svcQaBtn')?.classList.add('selecting');
      svcRender(); svcUpdateSelectBar();
      svcToast('Select rows to bulk edit or delete','info');
    }
    function svcExitSelectMode(){
      svcSelectMode=false; svcSelectedIds.clear();
      document.getElementById('svcSelectBar')?.classList.remove('visible');
      document.getElementById('svcQaBtn')?.classList.remove('selecting');
      svcRender();
    }
    function svcToggleRowSelect(id,cb){
      if(cb.checked) svcSelectedIds.add(id); else svcSelectedIds.delete(id);
      const row=cb.closest('tr'); if(row) row.classList.toggle('selected',cb.checked);
      svcUpdateSelectBar(); svcSyncHeaderCheck();
    }
    function svcHeaderCheckToggle(){
      const hc=document.getElementById('svcHeaderCheck'); if(!hc) return;
      svcGetCurrentPageIds().forEach(id=>{ if(hc.checked) svcSelectedIds.add(id); else svcSelectedIds.delete(id); });
      svcUpdateSelectBar(); svcRender();
    }
    function svcToggleSelectAll(){
      const allIds=svcFil.map(s=>s.id);
      const allSel=allIds.length>0&&allIds.every(id=>svcSelectedIds.has(id));
      if(allSel) svcSelectedIds.clear(); else allIds.forEach(id=>svcSelectedIds.add(id));
      svcUpdateSelectBar(); svcRender();
    }
    function svcSyncHeaderCheck(){
      const hc=document.getElementById('svcHeaderCheck'); if(!hc) return;
      const pIds=svcGetCurrentPageIds();
      const allC=pIds.length>0&&pIds.every(id=>svcSelectedIds.has(id));
      const someC=pIds.some(id=>svcSelectedIds.has(id));
      hc.checked=allC; hc.indeterminate=!allC&&someC;
    }
    function svcGetCurrentPageIds(){ const s=(svcPg-1)*svcPp; return svcFil.slice(s,s+svcPp).map(s=>s.id); }
    function svcUpdateSelectBar(){
      const count=svcSelectedIds.size, hasAny=count>0;
      const countEl=document.getElementById('svcSelectCount');
      if(countEl) countEl.textContent=count===0?'None selected':`${count} service${count===1?'':'s'} selected`;
      const eBtn=document.getElementById('svcBulkEditBtn'), dBtn=document.getElementById('svcBulkDelBtn');
      if(eBtn) eBtn.disabled=!hasAny; if(dBtn) dBtn.disabled=!hasAny;
      const labelEl=document.getElementById('svcSelAllLabel');
      if(labelEl){ const allSel=svcFil.length>0&&svcFil.every(s=>svcSelectedIds.has(s.id)); labelEl.textContent=allSel?'Deselect All':'Select All'; }
    }

    function svcOpenBulkEdit(){
      if(!svcSelectedIds.size) return;
      const items=svcData.filter(s=>svcSelectedIds.has(s.id));
      document.getElementById('svcBulkEditList').innerHTML=items.map(s=>`
        <div class="svc-bulk-list-item">
          <span style="font-size:16px">${s.emoji}</span>
          <span class="svc-sku-badge">${s.id}</span>
          <span style="flex:1;font-weight:500">${s.name}</span>
          <span class="svc-price-tag" style="font-size:12px">$${s.price.toFixed(2)}</span>
          <span class="svc-status-pill ${s.status}" style="font-size:9px"><span class="svc-status-dot"></span>${s.status}</span>
        </div>`).join('');
      document.getElementById('svcBulkPrice').value='';
      document.getElementById('svcBulkStatus').value='';
      svcShowModal('svcBulkEditOverlay');
    }

    function svcConfirmBulkEdit(){
      const rawP=document.getElementById('svcBulkPrice').value, newSt=document.getElementById('svcBulkStatus').value;
      const newP=rawP!==''?parseFloat(rawP):null;
      if(newP!==null&&(isNaN(newP)||newP<0)){ svcToast('Enter a valid price or leave blank','error'); return; }
      if(newP===null&&newSt===''){ svcToast('Set at least one field to apply','error'); return; }
      let changed=0;
      svcSelectedIds.forEach(id=>{ const i=svcData.findIndex(x=>x.id===id); if(i===-1) return; if(newP!==null) svcData[i].price=newP; if(newSt!=='') svcData[i].status=newSt; svcFil=svcFil.map(x=>x.id===id?svcData[i]:x); changed++; });
      svcHideModal('svcBulkEditOverlay'); svcRender();
      svcToast(`Updated ${changed} service${changed===1?'':'s'}`,'success');
    }

    function svcOpenBulkDelete(){
      if(!svcSelectedIds.size) return;
      const items=svcData.filter(s=>svcSelectedIds.has(s.id));
      document.getElementById('svcBulkDelCount').textContent=items.length;
      document.getElementById('svcBulkDelList').innerHTML=items.map(s=>`
        <div class="svc-bulk-del-item">
          <span style="font-size:16px">${s.emoji}</span>
          <span class="svc-sku-badge">${s.id}</span>
          <span style="flex:1;font-weight:500">${s.name}</span>
          <span class="svc-price-tag" style="font-size:12px">$${s.price.toFixed(2)}</span>
        </div>`).join('');
      svcShowModal('svcBulkDelOverlay');
    }

    function svcConfirmBulkDelete(){
      const count=svcSelectedIds.size;
      svcData=svcData.filter(s=>!svcSelectedIds.has(s.id));
      svcFil=svcFil.filter(s=>!svcSelectedIds.has(s.id));
      const mx=Math.ceil(svcFil.length/svcPp); if(svcPg>mx&&svcPg>1) svcPg=mx;
      svcHideModal('svcBulkDelOverlay');
      svcExitSelectMode();
      svcToast(`Deleted ${count} service${count===1?'':'s'}`,'error');
    }

    /* ── Export ── */
    function svcToggleExport(e){
      e.stopPropagation();
      const menu=document.getElementById('svcExportMenu');
      const isOpen=menu.classList.contains('open');
      document.querySelectorAll('.svc-export-menu').forEach(m=>m.classList.remove('open'));
      if(!isOpen) menu.classList.add('open');
    }
    document.addEventListener('click',()=>{ document.querySelectorAll('.svc-export-menu').forEach(m=>m.classList.remove('open')); });

    function svcFormatDate(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }

    function svcExportExcel(){
      if(typeof XLSX==='undefined'){ svcToast('Excel library loading…','error'); return; }
      const data=svcFil; if(!data.length){ svcToast('No data to export','error'); return; }
      const rows=[['SKU ID','Service Name','Price ($)','Status']];
      data.forEach(s=>rows.push([s.id,s.name,s.price.toFixed(2),s.status]));
      const ws=XLSX.utils.aoa_to_sheet(rows);
      ws['!cols']=[{wch:12},{wch:32},{wch:12},{wch:12}];
      const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Services');
      XLSX.writeFile(wb,'RevMotors_Services_'+svcFormatDate()+'.xlsx');
      svcToast('Excel exported – '+data.length+' services','success');
    }

    function svcExportPDF(){
      if(typeof window.jspdf==='undefined'&&typeof jsPDF==='undefined'){ svcToast('PDF library loading…','error'); return; }
      const data=svcFil; if(!data.length){ svcToast('No data to export','error'); return; }
      const JsPDF=(window.jspdf&&window.jspdf.jsPDF)?window.jspdf.jsPDF:jsPDF;
      const doc=new JsPDF({orientation:'landscape',unit:'mm',format:'a4'});
      const pageW=doc.internal.pageSize.getWidth(), margin=14; let y=0;
      doc.setFillColor(8,8,8); doc.rect(0,0,pageW,24,'F');
      doc.setFillColor(242,219,148); doc.rect(0,22,pageW,2,'F');
      doc.setTextColor(242,219,148); doc.setFontSize(18); doc.setFont('helvetica','bold'); doc.text('REV / MOTORS',margin,15);
      doc.setTextColor(180,180,180); doc.setFontSize(9); doc.setFont('helvetica','normal');
      doc.text('Services Report',margin,20);
      doc.text('Exported: '+svcFormatDate(),pageW-margin,15,{align:'right'});
      doc.text('Total records: '+data.length,pageW-margin,20,{align:'right'});
      y=34;
      const act=data.filter(s=>s.status==='active').length, total=data.reduce((a,s)=>a+s.price,0);
      const boxes=[{label:'Total Services',value:String(data.length)},{label:'Active',value:String(act)},{label:'Inactive',value:String(data.length-act)},{label:'Avg. Price',value:'$'+(data.length?total/data.length:0).toFixed(2)},{label:'Total Value',value:'$'+total.toFixed(2)}];
      const bw=(pageW-margin*2-8*4)/5;
      boxes.forEach((box,idx)=>{
        const bx=margin+idx*(bw+8);
        doc.setFillColor(20,20,20); doc.roundedRect(bx,y,bw,16,2,2,'F');
        doc.setFillColor(166,127,56); doc.rect(bx,y,bw,1,'F');
        doc.setTextColor(242,219,148); doc.setFontSize(13); doc.setFont('helvetica','bold'); doc.text(box.value,bx+bw/2,y+8,{align:'center'});
        doc.setTextColor(150,150,150); doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.text(box.label.toUpperCase(),bx+bw/2,y+13,{align:'center'});
      });
      y+=24;
      const cols=[{header:'SKU ID',key:'id',w:28},{header:'SERVICE NAME',key:'name',w:90},{header:'PRICE',key:'price',w:28},{header:'STATUS',key:'status',w:28}];
      doc.setFillColor(26,26,26); doc.rect(margin,y,pageW-margin*2,9,'F');
      doc.setFillColor(166,127,56); doc.rect(margin,y+8.5,pageW-margin*2,0.5,'F');
      let cx=margin+3;
      cols.forEach(col=>{ doc.setTextColor(166,127,56); doc.setFontSize(7.5); doc.setFont('helvetica','bold'); doc.text(col.header,cx,y+6); cx+=col.w; });
      y+=9;
      data.forEach((s,idx)=>{
        if(y>doc.internal.pageSize.getHeight()-20){ doc.addPage(); y=14; }
        doc.setFillColor(idx%2===0?17:14,idx%2===0?17:14,idx%2===0?17:14); doc.rect(margin,y,pageW-margin*2,8,'F');
        let rx=margin+3;
        doc.setTextColor(242,219,148); doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.text(s.id,rx,y+5.5); rx+=cols[0].w;
        doc.setTextColor(240,240,240); doc.setFont('helvetica','normal'); doc.text(s.name,rx,y+5.5); rx+=cols[1].w;
        doc.setTextColor(242,219,148); doc.setFont('helvetica','bold'); doc.text('$'+s.price.toFixed(2),rx,y+5.5); rx+=cols[2].w;
        if(s.status==='active'){ doc.setFillColor(16,70,50); doc.setTextColor(52,211,153); } else { doc.setFillColor(70,20,20); doc.setTextColor(248,113,113); }
        doc.roundedRect(rx,y+1.5,22,5,1,1,'F'); doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.text(s.status.toUpperCase(),rx+11,y+5.5,{align:'center'});
        doc.setDrawColor(30,30,30); doc.setLineWidth(0.2); doc.line(margin,y+8,pageW-margin,y+8);
        y+=8;
      });
      const pageCount=doc.internal.getNumberOfPages();
      for(let p=1;p<=pageCount;p++){
        doc.setPage(p); const fh=doc.internal.pageSize.getHeight();
        doc.setFillColor(8,8,8); doc.rect(0,fh-10,pageW,10,'F');
        doc.setFillColor(166,127,56); doc.rect(0,fh-10,pageW,0.5,'F');
        doc.setTextColor(100,100,100); doc.setFontSize(7.5); doc.setFont('helvetica','normal');
        doc.text('Rev Motors – Confidential',margin,fh-4);
        doc.text('Page '+p+' of '+pageCount,pageW-margin,fh-4,{align:'right'});
      }
      doc.save('RevMotors_Services_'+svcFormatDate()+'.pdf');
      svcToast('PDF exported – '+data.length+' services','success');
    }

    /* ── Toast ── */
    function svcToast(msg,type){
      type=type||'info';
      const c=document.getElementById('svcToasts');
      if(!c) return;
      const t=document.createElement('div');
      t.className='svc-toast '+(type==='success'?'success':type==='error'?'error':'');
      t.innerHTML=`<span>${type==='success'?'✅':type==='error'?'❌':'ℹ️'}</span> ${msg}`;
      c.appendChild(t);
      setTimeout(()=>t.remove(),3100);
    }

    /* ── Keyboard shortcuts ── */
    document.addEventListener('keydown', e=>{
      if(e.key==='Escape'){
        if(svcSelectMode) svcExitSelectMode();
        else svcCloseLightbox();
      }
    });

    /* ── Auto-init if services tab is active on load ── */
    setTimeout(()=>{ if(document.getElementById('svcTbody')) svcRender(); }, 100);