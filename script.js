/* ============================================================
   MAISON LUMEN — Cart, Filter & Checkout Logic
   ============================================================ */

// =========================================================
// 1. DATA PRODUK
// =========================================================
const products = [
  {
    id: 1,
    name: 'Kemeja Linen Osaka',
    category: 'pakaian',
    categoryLabel: 'Pakaian',
    price: 349000,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80&auto=format&fit=crop',
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: 'Tote Bag Kanvas Tebal',
    category: 'aksesori',
    categoryLabel: 'Aksesori',
    price: 189000,
    image: 'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?w=800&q=80&auto=format&fit=crop',
    rating: 4.9,
    reviews: 89
  },
  {
    id: 3,
    name: 'Mug Keramik Tangan',
    category: 'gaya-hidup',
    categoryLabel: 'Gaya Hidup',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80&auto=format&fit=crop',
    rating: 4.7,
    reviews: 56
  },
  {
    id: 4,
    name: 'Beanie Wol Merino',
    category: 'aksesori',
    categoryLabel: 'Aksesori',
    price: 145000,
    image: 'https://images.unsplash.com/photo-1576871337632-b9a754b87e10?w=800&q=80&auto=format&fit=crop',
    rating: 4.6,
    reviews: 42
  },
  {
    id: 5,
    name: 'Sweater Katun Rajut',
    category: 'pakaian',
    categoryLabel: 'Pakaian',
    price: 425000,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80&auto=format&fit=crop',
    rating: 4.9,
    reviews: 178
  },
  {
    id: 6,
    name: 'Dompet Kulit Sunduh',
    category: 'aksesori',
    categoryLabel: 'Aksesori',
    price: 320000,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80&auto=format&fit=crop',
    rating: 4.8,
    reviews: 95
  },
  {
    id: 7,
    name: 'Lilin Aromaterapi Cedar',
    category: 'gaya-hidup',
    categoryLabel: 'Gaya Hidup',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1602874801006-e26c4d6c5e51?w=800&q=80&auto=format&fit=crop',
    rating: 4.7,
    reviews: 67
  },
  {
    id: 8,
    name: 'Jaket Denim Vintage',
    category: 'pakaian',
    categoryLabel: 'Pakaian',
    price: 599000,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80&auto=format&fit=crop',
    rating: 4.9,
    reviews: 203
  }
];

// =========================================================
// 2. STATE
// =========================================================
const STORAGE_KEY = 'maison_lumen_cart_v1';
let cart = loadCart();
let activeCategory = 'semua';
let searchQuery = '';

// =========================================================
// 3. UTILITIES
// =========================================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const formatRupiah = (n) => 'Rp ' + n.toLocaleString('id-ID');

function loadCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn('LocalStorage tidak tersedia');
  }
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) {
    html += '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.2l2.1 4.5 4.9.5-3.7 3.3 1.1 4.8L8 11.9 3.6 14.3l1.1-4.8L1 6.2l4.9-.5z"/></svg>';
  }
  if (hasHalf) {
    html += '<svg viewBox="0 0 16 16" fill="currentColor" style="opacity:0.45"><path d="M8 1.2l2.1 4.5 4.9.5-3.7 3.3 1.1 4.8L8 11.9 3.6 14.3l1.1-4.8L1 6.2l4.9-.5z"/></svg>';
  }
  return html;
}

// =========================================================
// 4. RENDER PRODUK
// =========================================================
function getFilteredProducts() {
  const q = searchQuery.toLowerCase().trim();
  return products.filter(p => {
    const matchCategory = activeCategory === 'semua' || p.category === activeCategory;
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.categoryLabel.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });
}

function renderProducts() {
  const grid = $('#productGrid');
  const empty = $('#emptyState');
  const filtered = getFilteredProducts();

  $('#resultCount').textContent = `${filtered.length} produk`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  grid.innerHTML = filtered.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy"
             onerror="this.style.opacity=0;this.parentElement.style.background='var(--accent-soft)';">
        <span class="product-category">${p.categoryLabel}</span>
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">
          <span class="stars" aria-hidden="true">${renderStars(p.rating)}</span>
          <span>${p.rating.toFixed(1)} · ${p.reviews} ulasan</span>
        </div>
        <div class="product-footer">
          <span class="product-price">${formatRupiah(p.price)}</span>
          <button class="add-to-cart" data-id="${p.id}" aria-label="Tambah ${p.name} ke keranjang">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3.5 5h9l-.8 8.5H4.3L3.5 5z"/>
              <path d="M6 5V3.5a2 2 0 014 0V5"/>
              <path d="M8 8v2.5M6.75 9.25h2.5"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  $$('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });
}

// =========================================================
// 5. LOGIKA KERANJANG
// =========================================================
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, categoryLabel: product.categoryLabel, qty: 1 });
  }

  saveCart();
  updateCartBadge(true);
  renderCart();
  showToast(`${product.name} ditambahkan ke keranjang`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartBadge();
  renderCart();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }

  saveCart();
  updateCartBadge();
  renderCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge(animate = false) {
  const badge = $('#cartBadge');
  const count = getCartCount();
  badge.textContent = count;
  badge.dataset.count = count;

  if (animate && count > 0) {
    badge.classList.remove('pulse');
    void badge.offsetWidth; // reflow
    badge.classList.add('pulse');
  }
}

// =========================================================
// 6. RENDER KERANJANG
// =========================================================
function renderCart() {
  const container = $('#cartItems');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 7h12l-1 12H7L6 7z"/>
          <path d="M9 7V5a3 3 0 016 0v2"/>
        </svg>
        <h4>Keranjang Masih Kosong</h4>
        <p>Belum ada produk dipilih. Mari jelajahi koleksi kami.</p>
        <button class="btn btn-primary" id="emptyCartBrowse">Mulai Belanja</button>
      </div>
    `;
    const browseBtn = document.getElementById('emptyCartBrowse');
    if (browseBtn) browseBtn.addEventListener('click', closeCart);
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-cat">${item.categoryLabel}</span>
          <span class="cart-item-price">${formatRupiah(item.price)}</span>
          <div class="qty-controls">
            <button class="qty-minus" data-id="${item.id}" aria-label="Kurangi jumlah">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 6h8"/></svg>
            </button>
            <span>${item.qty}</span>
            <button class="qty-plus" data-id="${item.id}" aria-label="Tambah jumlah">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 2v8M2 6h8"/></svg>
            </button>
          </div>
        </div>
        <div class="cart-item-right">
          <span class="cart-item-total">${formatRupiah(item.price * item.qty)}</span>
          <button class="remove-btn" data-id="${item.id}">Hapus</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => updateQty(parseInt(btn.dataset.id), -1));
    });
    container.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => updateQty(parseInt(btn.dataset.id), 1));
    });
    container.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
    });
  }

  $('#cartSubtotal').textContent = formatRupiah(getCartTotal());
}

// =========================================================
// 7. UI: DRAWER & MODAL
// =========================================================
function openCart() {
  $('#cartDrawer').classList.add('open');
  $('#drawerBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  $('#cartDrawer').classList.remove('open');
  $('#drawerBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

function openCheckout() {
  if (cart.length === 0) {
    showToast('Keranjang masih kosong');
    return;
  }
  const total = getCartTotal();
  $('#summarySubtotal').textContent = formatRupiah(total);
  $('#summaryTotal').textContent = formatRupiah(total);
  $('#modalBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  $('#modalBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

// =========================================================
// 8. TOAST
// =========================================================
let toastTimer;
function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  // Re-add ::before by re-triggering
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// =========================================================
// 9. FILTER & SEARCH
// =========================================================
function setCategory(cat) {
  activeCategory = cat;
  $$('.filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.category === cat);
  });
  renderProducts();
}

function setSearch(query) {
  searchQuery = query;
  // Sync both inputs
  const headerInput = $('#headerSearch');
  const catalogInput = $('#catalogSearch');
  if (headerInput.value !== query) headerInput.value = query;
  if (catalogInput.value !== query) catalogInput.value = query;
  renderProducts();
}

// =========================================================
// 10. INIT
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCart();
  updateCartBadge();

  // Cart drawer
  $('#cartBtn').addEventListener('click', openCart);
  $('#closeCart').addEventListener('click', closeCart);
  $('#drawerBackdrop').addEventListener('click', closeCart);
  $('#continueShopping').addEventListener('click', closeCart);
  $('#checkoutBtn').addEventListener('click', () => {
    closeCart();
    setTimeout(openCheckout, 320);
  });

  // Checkout modal
  $('#closeCheckout').addEventListener('click', closeCheckout);
  $('#modalBackdrop').addEventListener('click', (e) => {
    if (e.target === $('#modalBackdrop')) closeCheckout();
  });
  $('#checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#buyerName').value.trim();
    const firstName = name.split(' ')[0];
    showToast(`Pesanan terkonfirmasi. Terima kasih, ${firstName}!`);
    cart = [];
    saveCart();
    updateCartBadge();
    renderCart();
    closeCheckout();
    e.target.reset();
  });

  // Filter pills
  $$('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => setCategory(pill.dataset.category));
  });

  // Search (synced)
  $('#headerSearch').addEventListener('input', (e) => setSearch(e.target.value));
  $('#catalogSearch').addEventListener('input', (e) => setSearch(e.target.value));

  // Newsletter
  $('#newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Terima kasih telah berlangganan newsletter');
    e.target.reset();
  });

  // Menu toggle (mobile)
  $('#menuToggle').addEventListener('click', () => {
    const nav = $('#primaryNav');
    if (nav.style.display === 'flex') {
      nav.style.display = '';
    } else {
      nav.style.display = 'flex';
      nav.style.position = 'absolute';
      nav.style.top = '64px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.flexDirection = 'column';
      nav.style.background = 'var(--surface)';
      nav.style.padding = '20px 24px';
      nav.style.borderBottom = '1px solid var(--border)';
      nav.style.gap = '14px';
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeCheckout();
    }
  });

  // Smooth scroll for nav links
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - headerOffset,
          behavior: 'smooth'
        });
      }
    });
  });
});