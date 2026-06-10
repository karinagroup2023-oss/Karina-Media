/* ===== PRODUCTS loaded from products.js ===== */

/* ===== STOCK (with size/color variant tracking) ===== */
const Stock = {
    _totalDefaults: { 1:15, 2:8, 3:20, 4:12, 5:10, 6:6, 7:5, 8:25, 9:7, 10:18, 11:4, 12:14, 13:9, 14:22, 15:30, 16:11 },

    _generateDefaults() {
        const stock = {};
        PRODUCTS.forEach(p => {
            const total = this._totalDefaults[p.id] || 0;
            if (p.sizes[0] === 'ONE' && p.colors.length <= 1) {
                stock[`${p.id}_ONE_${p.colorName}`] = total;
            } else {
                const variants = [];
                p.sizes.forEach(s => {
                    p.colors.forEach(c => { variants.push(`${p.id}_${s}_${c.name}`); });
                });
                const perVariant = Math.floor(total / variants.length);
                const remainder = total % variants.length;
                variants.forEach((key, i) => {
                    stock[key] = perVariant + (i < remainder ? 1 : 0);
                });
            }
        });
        return stock;
    },

    _getStore() {
        try {
            const saved = JSON.parse(localStorage.getItem('nura_stock_v2') || 'null');
            return saved || this._generateDefaults();
        } catch { return this._generateDefaults(); }
    },

    _save(stock) {
        try { localStorage.setItem('nura_stock_v2', JSON.stringify(stock)); } catch {}
    },

    // Get stock for a specific variant
    getVariant(productId, size, color) {
        const key = `${productId}_${size}_${color}`;
        return this._getStore()[key] || 0;
    },

    // Get total stock for a product (sum of all variants)
    get(productId) {
        const store = this._getStore();
        const prefix = `${productId}_`;
        let total = 0;
        for (const key in store) {
            if (key.startsWith(prefix)) total += store[key];
        }
        return total;
    },

    // Decrease stock for a specific variant
    decrease(productId, qty, size, color) {
        const stock = this._getStore();
        if (size && color) {
            const key = `${productId}_${size}_${color}`;
            stock[key] = Math.max(0, (stock[key] || 0) - qty);
        } else {
            // Fallback: decrease from first available variant
            const prefix = `${productId}_`;
            let remaining = qty;
            for (const key in stock) {
                if (key.startsWith(prefix) && stock[key] > 0 && remaining > 0) {
                    const take = Math.min(stock[key], remaining);
                    stock[key] -= take;
                    remaining -= take;
                }
            }
        }
        this._save(stock);
    },

    set(productId, qty) {
        // For admin: set total evenly across variants
        const p = PRODUCTS.find(pr => pr.id === productId);
        if (!p) return;
        const stock = this._getStore();
        const prefix = `${productId}_`;
        // Remove old keys
        for (const key in stock) { if (key.startsWith(prefix)) delete stock[key]; }
        // Distribute new total
        const variants = [];
        p.sizes.forEach(s => { p.colors.forEach(c => { variants.push(`${p.id}_${s}_${c.name}`); }); });
        if (variants.length === 0) variants.push(`${p.id}_ONE_${p.colorName}`);
        const perVariant = Math.floor(qty / variants.length);
        const remainder = qty % variants.length;
        variants.forEach((key, i) => { stock[key] = perVariant + (i < remainder ? 1 : 0); });
        this._save(stock);
    },

    init() {
        try {
            if (!localStorage.getItem('nura_stock_v2')) {
                this._save(this._generateDefaults());
            }
        } catch {}
    }
};
Stock.init();

/* ===== CART ===== */
const Cart = {
    items: (() => {
        try {
            const items = JSON.parse(localStorage.getItem('nura_cart') || '[]');
            // Remove items for products that no longer exist
            return items.filter(i => PRODUCTS.some(p => p.id === i.id));
        }
        catch { return []; }
    })(),

    save() {
        try { localStorage.setItem('nura_cart', JSON.stringify(this.items)); }
        catch { /* localStorage full or unavailable */ }
        this.updateUI();
    },

    add(productId, size, color) {
        // Check stock for specific variant
        const inCartVariant = this.items
            .filter(i => i.id === productId && i.size === size && i.color === color)
            .reduce((s, i) => s + i.qty, 0);
        const availableVariant = Stock.getVariant(productId, size, color);
        if (inCartVariant >= availableVariant) {
            showToast('Этот вариант закончился на складе');
            return false;
        }
        const existing = this.items.find(i => i.id === productId && i.size === size && i.color === color);
        if (existing) {
            existing.qty++;
        } else {
            this.items.push({ id: productId, size, color, qty: 1 });
        }
        this.save();
        return true;
    },

    remove(index) {
        this.items.splice(index, 1);
        this.save();
    },

    updateQty(index, delta) {
        if (delta > 0) {
            const item = this.items[index];
            const inCartVariant = this.items
                .filter(i => i.id === item.id && i.size === item.size && i.color === item.color)
                .reduce((s, i) => s + i.qty, 0);
            if (inCartVariant >= Stock.getVariant(item.id, item.size, item.color)) {
                showToast('Больше нет на складе');
                return;
            }
        }
        this.items[index].qty += delta;
        if (this.items[index].qty < 1) this.items.splice(index, 1);
        this.save();
    },

    getTotal() {
        return this.items.reduce((sum, item) => {
            const p = PRODUCTS.find(pr => pr.id === item.id);
            return sum + (p ? p.price * item.qty : 0);
        }, 0);
    },

    getTotalCount() {
        return this.items.reduce((sum, item) => sum + item.qty, 0);
    },

    clear() {
        this.items = [];
        this.save();
    },

    updateUI() {
        const countEl = document.getElementById('cartCount');
        const count = this.getTotalCount();
        if (countEl) {
            countEl.textContent = count;
            countEl.classList.toggle('visible', count > 0);
        }
    }
};

/* ===== UTILITIES ===== */
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸';
}

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return str.replace(/[&<>"']/g, c => map[c]);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('visible'), 2500);
}

function pluralize(n, one, few, many) {
    const abs = Math.abs(n) % 100;
    const lastDigit = abs % 10;
    if (abs > 10 && abs < 20) return many;
    if (lastDigit > 1 && lastDigit < 5) return few;
    if (lastDigit === 1) return one;
    return many;
}

function formatPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    let result = '+7';
    if (digits.length > 1) result += ' (' + digits.slice(1, 4);
    if (digits.length > 4) result += ') ' + digits.slice(4, 7);
    if (digits.length > 7) result += '-' + digits.slice(7, 9);
    if (digits.length > 9) result += '-' + digits.slice(9, 11);
    return result;
}

function validatePhone(value) {
    return value.replace(/\D/g, '').length === 11;
}

function validateCardNumber(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    let sum = 0;
    for (let i = digits.length - 1, alt = false; i >= 0; i--, alt = !alt) {
        let n = parseInt(digits[i], 10);
        if (alt) { n *= 2; if (n > 9) n -= 9; }
        sum += n;
    }
    return sum % 10 === 0;
}

function validateExpiry(month, year) {
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (isNaN(m) || isNaN(y) || m < 1 || m > 12) return false;
    const now = new Date();
    const expiry = new Date(2000 + y, m);
    return expiry > now;
}

function validateCvv(value) {
    return /^\d{3,4}$/.test(value);
}

/* ===== WISHLIST ===== */
const Wishlist = {
    items: (() => {
        try { return JSON.parse(localStorage.getItem('nura_wishlist') || '[]'); }
        catch { return []; }
    })(),
    save() {
        try { localStorage.setItem('nura_wishlist', JSON.stringify(this.items)); } catch {}
        this.updateUI();
    },
    toggle(productId) {
        const idx = this.items.indexOf(productId);
        if (idx > -1) { this.items.splice(idx, 1); showToast('Удалено из избранного'); }
        else { this.items.push(productId); showToast('Добавлено в избранное'); }
        this.save();
        renderProducts();
    },
    has(productId) { return this.items.includes(productId); },
    updateUI() {
        const el = document.getElementById('wishlistCount');
        if (el) {
            el.textContent = this.items.length;
            el.classList.toggle('visible', this.items.length > 0);
        }
    }
};

/* ===== SIZE CHART DATA ===== */
const SIZE_CHARTS = {
    women_clothing: {
        title: 'Женская одежда',
        headers: ['Размер', 'Обхват груди', 'Обхват талии', 'Обхват бёдер'],
        rows: [['XS', '80-84', '60-64', '86-90'], ['S', '84-88', '64-68', '90-94'], ['M', '88-92', '68-72', '94-98'], ['L', '92-96', '72-76', '98-102'], ['XL', '96-100', '76-80', '102-106']]
    },
    men_clothing: {
        title: 'Мужская одежда',
        headers: ['Размер', 'Обхват груди', 'Обхват талии', 'Рост'],
        rows: [['S/46', '92-96', '76-80', '170-176'], ['M/48', '96-100', '80-84', '176-182'], ['L/50', '100-104', '84-88', '176-182'], ['XL/52', '104-108', '88-92', '182-188'], ['XXL/54', '108-112', '92-96', '182-188']]
    },
    men_suit: {
        title: 'Мужские костюмы',
        headers: ['Размер', 'Обхват груди', 'Обхват талии', 'Рост'],
        rows: [['46', '92', '76', '170-176'], ['48', '96', '80', '176-182'], ['50', '100', '84', '176-182'], ['52', '104', '88', '182-188'], ['54', '108', '92', '182-188']]
    },
    belt: {
        title: 'Ремни',
        headers: ['Размер', 'Длина ремня', 'Обхват талии'],
        rows: [['85', '95 см', '75-85 см'], ['90', '100 см', '80-90 см'], ['95', '105 см', '85-95 см'], ['100', '110 см', '90-100 см'], ['105', '115 см', '95-105 см']]
    }
};

function getSizeChart(product) {
    if (product.sizes[0] === 'ONE') return null;
    if (product.name.includes('Ремень')) return SIZE_CHARTS.belt;
    if (product.name.includes('Костюм-тройка')) return SIZE_CHARTS.men_suit;
    if (product.category === 'men') return SIZE_CHARTS.men_clothing;
    if (product.category === 'women') return SIZE_CHARTS.women_clothing;
    return null;
}

/* ===== STATE ===== */
let activeFilter = 'all';
let activeSort = 'default';
let filterPrice = [0, 300000];
let filterSizes = [];
let filterColors = [];

/* ===== INTERSECTION OBSERVER ===== */
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

/* ===== RENDER PRODUCTS ===== */
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let filtered = activeFilter === 'all'
        ? [...PRODUCTS]
        : activeFilter === 'sale'
        ? PRODUCTS.filter(p => p.oldPrice)
        : activeFilter === 'wishlist'
        ? PRODUCTS.filter(p => Wishlist.has(p.id))
        : PRODUCTS.filter(p => p.category === activeFilter);

    // Extended filters
    filtered = filtered.filter(p => p.price >= filterPrice[0] && p.price <= filterPrice[1]);
    if (filterSizes.length > 0) {
        filtered = filtered.filter(p => p.sizes.some(s => filterSizes.includes(s)));
    }
    if (filterColors.length > 0) {
        filtered = filtered.filter(p => p.colors.some(c => filterColors.includes(c.name)));
    }

    // Sort
    if (activeSort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (activeSort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (activeSort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    // Update count
    const countEl = document.getElementById('productsCount');
    if (countEl) countEl.textContent = `${filtered.length} ${pluralize(filtered.length, 'товар', 'товара', 'товаров')}`;

    // Clean up old observers before re-render
    grid.querySelectorAll('.product-card').forEach(card => scrollObserver.unobserve(card));

    grid.innerHTML = filtered.map(p => {
        const stock = Stock.get(p.id);
        const outOfStock = stock <= 0;
        const inWish = Wishlist.has(p.id);
        return `
        <div class="product-card ${outOfStock ? 'product-card--out' : ''}" data-id="${p.id}">
            <div class="product-card__img">
                <div class="product-card__img-inner" style="background: linear-gradient(135deg, ${escapeHtml(p.color)}40 0%, ${escapeHtml(p.color)}80 100%)">
                    ${p.image ? `<img class="product-card__img-main" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" width="600" height="800">` : ''}
                    ${p.imageHover ? `<img class="product-card__img-hover" src="${escapeHtml(p.imageHover)}" alt="${escapeHtml(p.name)}" loading="lazy" width="600" height="800">` : ''}
                </div>
                <button class="product-card__wish ${inWish ? 'active' : ''}" data-wish="${p.id}" title="${inWish ? 'Убрать из избранного' : 'В избранное'}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${inWish ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                </button>
                ${outOfStock ? '<span class="product-card__badge product-card__badge--out">Нет в наличии</span>' :
                  p.badge ? `<span class="product-card__badge">${escapeHtml(p.badge)}</span>` : ''}
                ${p.oldPrice ? `<span class="product-card__discount">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ''}
                ${stock > 0 && stock <= 3 ? `<span class="product-card__stock-low">Осталось ${stock} шт.</span>` : ''}
                <div class="product-card__quick">${outOfStock ? 'Нет в наличии' : 'Быстрый просмотр'}</div>
            </div>
            <div class="product-card__brand">${escapeHtml(p.brand)}</div>
            <div class="product-card__name">${escapeHtml(p.name)}</div>
            <div class="product-card__price">
                ${formatPrice(p.price)}
                ${p.oldPrice ? `<span class="product-card__price--old">${formatPrice(p.oldPrice)}</span>` : ''}
            </div>
        </div>`;
    }).join('');

    // Wishlist click handler (stop propagation so card click doesn't fire)
    grid.querySelectorAll('.product-card__wish').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            Wishlist.toggle(parseInt(btn.dataset.wish, 10));
        });
    });

    // Observe for animation
    grid.querySelectorAll('.product-card').forEach(card => {
        scrollObserver.observe(card);
    });
}

/* ===== QUICK VIEW ===== */
function openQuickView(productId) {
    const p = PRODUCTS.find(pr => pr.id === productId);
    if (!p) return;

    const modal = document.getElementById('quickViewModal');
    const body = document.getElementById('qvBody');

    body.innerHTML = `
    <div class="qv">
        <div class="qv__img" style="background: linear-gradient(135deg, ${escapeHtml(p.color)}40 0%, ${escapeHtml(p.color)}80 100%)">
            ${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" width="600" height="800" style="width:100%;height:100%;object-fit:cover">` : ''}
        </div>
        <div class="qv__info">
            <div class="qv__brand">${escapeHtml(p.brand)}</div>
            <h2 class="qv__name">${escapeHtml(p.name)}</h2>
            <div class="qv__price">
                ${formatPrice(p.price)}
                ${p.oldPrice ? `<span class="product-card__price--old">${formatPrice(p.oldPrice)}</span>` : ''}
            </div>
            <p class="qv__desc">${escapeHtml(p.desc)}</p>
            ${p.colors.length > 1 ? `
            <div class="qv__options">
                <div class="qv__label">Цвет: <span id="qvColorName">${escapeHtml(p.colors[0].name)}</span></div>
                <div class="qv__colors">
                    ${p.colors.map((c, i) => `
                        <button class="qv__color ${i === 0 ? 'active' : ''}" data-color="${escapeHtml(c.name)}"
                                style="background: ${escapeHtml(c.hex)}" title="${escapeHtml(c.name)}"></button>
                    `).join('')}
                </div>
            </div>` : ''}
            <div class="qv__options">
                <div class="qv__label">${p.sizes[0] === 'ONE' ? 'Размер: Универсальный' : 'Размер'} ${getSizeChart(p) ? '<button class="qv__size-guide-btn" id="qvSizeGuideBtn">Таблица размеров</button>' : ''}</div>
                ${p.sizes[0] !== 'ONE' ? `
                <div class="qv__sizes">
                    ${p.sizes.map(s => `<button class="qv__size" data-size="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join('')}
                </div>` : ''}
                <div class="qv__size-chart" id="qvSizeChart" style="display:none">
                    ${(() => { const sc = getSizeChart(p); if (!sc) return ''; return `
                        <table class="size-chart-table">
                            <thead><tr>${sc.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                            <tbody>${sc.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
                        </table>`;
                    })()}
                </div>
            </div>
            <div class="qv__stock" style="font-size:13px;margin-bottom:12px;${Stock.get(p.id) <= 3 ? 'color:#c0392b' : 'color:var(--gray)'}">
                ${Stock.get(p.id) > 0 ? `В наличии: ${Stock.get(p.id)} шт.` : '<strong style="color:#c0392b">Нет в наличии</strong>'}
            </div>
            <div class="qv__error" id="qvError">Выберите размер</div>
            <button class="btn btn--primary btn--full" id="qvAddToCart" data-id="${p.id}" ${Stock.get(p.id) <= 0 ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
                ${Stock.get(p.id) > 0 ? `Добавить в корзину — ${formatPrice(p.price)}` : 'Нет в наличии'}
            </button>
        </div>
    </div>`;

    // Color selection — change image on color pick
    body.querySelectorAll('.qv__color').forEach(btn => {
        btn.addEventListener('click', () => {
            body.querySelectorAll('.qv__color').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const nameEl = document.getElementById('qvColorName');
            if (nameEl) nameEl.textContent = btn.dataset.color;
            // Swap product image
            const colorData = p.colors.find(c => c.name === btn.dataset.color);
            if (colorData && colorData.image) {
                const imgEl = body.querySelector('.qv__img img');
                if (imgEl) imgEl.src = colorData.image;
            }
        });
    });

    // Size selection
    body.querySelectorAll('.qv__size').forEach(btn => {
        btn.addEventListener('click', () => {
            body.querySelectorAll('.qv__size').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('qvError').style.display = 'none';
        });
    });

    // Size chart toggle
    document.getElementById('qvSizeGuideBtn')?.addEventListener('click', () => {
        const chart = document.getElementById('qvSizeChart');
        if (chart) chart.style.display = chart.style.display === 'none' ? 'block' : 'none';
    });

    // Add to cart (with double-click protection)
    const addBtn = document.getElementById('qvAddToCart');
    addBtn.addEventListener('click', () => {
        if (addBtn.disabled) return;
        const sizeBtn = body.querySelector('.qv__size.active');
        const isOneSize = p.sizes[0] === 'ONE';
        if (!isOneSize && !sizeBtn) {
            document.getElementById('qvError').style.display = 'block';
            return;
        }
        addBtn.disabled = true;
        const size = isOneSize ? 'ONE' : sizeBtn.dataset.size;
        const colorBtn = body.querySelector('.qv__color.active');
        const color = colorBtn ? colorBtn.dataset.color : p.colorName;
        if (Cart.add(p.id, size, color)) {
            closeModal('quickViewModal');
            showToast(`${p.name} добавлен в корзину`);
        } else {
            addBtn.disabled = false;
        }
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/* ===== CART SIDEBAR ===== */
function openCart() {
    document.getElementById('cartSidebar').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCart();
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');
    const cartCount = document.getElementById('cartItemsCount');

    if (Cart.items.length === 0) {
        cartEmpty.style.display = '';
        cartItems.innerHTML = '';
        cartFooter.style.display = 'none';
        cartCount.textContent = '(0)';
        return;
    }

    cartEmpty.style.display = 'none';
    cartFooter.style.display = '';
    cartCount.textContent = `(${Cart.getTotalCount()})`;

    cartItems.innerHTML = Cart.items.map((item, i) => {
        const p = PRODUCTS.find(pr => pr.id === item.id);
        if (!p) return '';
        return `
        <div class="cart-item">
            <div class="cart-item__img" style="background: linear-gradient(135deg, ${escapeHtml(p.color)}40, ${escapeHtml(p.color)}80)">
                ${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" width="80" height="100" style="width:100%;height:100%;object-fit:cover">` : ''}
            </div>
            <div class="cart-item__info">
                <div class="cart-item__brand">${escapeHtml(p.brand)}</div>
                <div class="cart-item__name">${escapeHtml(p.name)}</div>
                <div class="cart-item__meta">${item.size !== 'ONE' ? `Размер: ${escapeHtml(item.size)}` : 'Универсальный'}${item.color ? ` · ${escapeHtml(item.color)}` : ''}</div>
                <div class="cart-item__bottom">
                    <div class="cart-item__qty">
                        <button data-cart-action="decrease" data-index="${i}">−</button>
                        <span>${item.qty}</span>
                        <button data-cart-action="increase" data-index="${i}">+</button>
                    </div>
                    <div class="cart-item__price">${formatPrice(p.price * item.qty)}</div>
                </div>
                <span class="cart-item__remove" data-cart-action="remove" data-index="${i}">Удалить</span>
            </div>
        </div>`;
    }).join('');

    const total = Cart.getTotal();
    const deliveryFree = total >= 50000;
    const deliveryFee = deliveryFree ? 0 : 2500;
    const remaining = Math.max(0, 50000 - total);
    const progressPct = Math.min(100, (total / 50000) * 100);

    // Delivery progress bar
    let progressEl = document.querySelector('.cart-delivery-progress');
    if (!progressEl) {
        progressEl = document.createElement('div');
        progressEl.className = 'cart-delivery-progress';
        cartItems.parentElement.insertBefore(progressEl, cartItems);
    }
    progressEl.className = `cart-delivery-progress ${deliveryFree ? 'cart-delivery-progress--done' : ''}`;
    progressEl.innerHTML = deliveryFree
        ? `<div class="cart-delivery-progress__text">✓ Бесплатная доставка!</div>
           <div class="cart-delivery-progress__bar"><div class="cart-delivery-progress__fill" style="width:100%"></div></div>`
        : `<div class="cart-delivery-progress__text">До бесплатной доставки: <strong>${formatPrice(remaining)}</strong></div>
           <div class="cart-delivery-progress__bar"><div class="cart-delivery-progress__fill" style="width:${progressPct}%"></div></div>`;

    document.getElementById('cartSubtotal').textContent = formatPrice(total);
    document.getElementById('cartDelivery').textContent = deliveryFree ? 'Бесплатно' : formatPrice(deliveryFee);
    document.getElementById('cartTotal').textContent = formatPrice(total + deliveryFee);
}

/* ===== CHECKOUT ===== */
let checkoutStep = 1;
let selectedPayment = '';
const checkoutFormData = { name: '', surname: '', phone: '', email: '', city: '', address: '' };

function openCheckout() {
    if (Cart.items.length === 0) {
        showToast('Корзина пуста');
        return;
    }
    closeCart();
    // Only reset to step 1 if not already in checkout (preserve step 2 data)
    if (checkoutStep === 3) { checkoutStep = 1; selectedPayment = ''; }
    renderCheckout();
    document.getElementById('checkoutModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function renderCheckout() {
    const el = document.getElementById('checkout');
    const total = Cart.getTotal();
    const deliveryFee = total >= 50000 ? 0 : 2500;
    const finalTotal = total + deliveryFee;

    const stepsHTML = `
        <div class="checkout__steps" role="progressbar" aria-valuenow="${checkoutStep}" aria-valuemin="1" aria-valuemax="3">
            <div class="checkout__step-dot ${checkoutStep >= 1 ? 'active' : ''} ${checkoutStep > 1 ? 'done' : ''}"></div>
            <div class="checkout__step-dot ${checkoutStep >= 2 ? 'active' : ''} ${checkoutStep > 2 ? 'done' : ''}"></div>
            <div class="checkout__step-dot ${checkoutStep >= 3 ? 'active' : ''}"></div>
        </div>`;

    if (checkoutStep === 1) {
        el.innerHTML = `
            ${stepsHTML}
            <h3 class="checkout__title">Доставка</h3>
            <p style="font-size:13px;color:var(--gray);margin-bottom:24px">Заполните данные для доставки заказа</p>
            <form id="deliveryForm" novalidate>
                <div class="form-row">
                    <div class="form-group">
                        <label for="fName">Имя *</label>
                        <input type="text" id="fName" placeholder="Введите имя" required autocomplete="given-name">
                        <span class="form-hint" id="fNameHint"></span>
                    </div>
                    <div class="form-group">
                        <label for="fSurname">Фамилия *</label>
                        <input type="text" id="fSurname" placeholder="Введите фамилию" required autocomplete="family-name">
                        <span class="form-hint" id="fSurnameHint"></span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="fPhone">Телефон *</label>
                    <input type="tel" id="fPhone" placeholder="+7 (___) ___-__-__" required autocomplete="tel">
                    <span class="form-hint" id="fPhoneHint"></span>
                </div>
                <div class="form-group">
                    <label for="fEmail">Email</label>
                    <input type="email" id="fEmail" placeholder="email@example.com" autocomplete="email">
                    <span class="form-hint" id="fEmailHint"></span>
                </div>
                <div class="form-group">
                    <label for="fCity">Город *</label>
                    <select id="fCity" required>
                        <option value="">Выберите город</option>
                        <option value="almaty">Алматы</option>
                        <option value="astana">Астана</option>
                        <option value="shymkent">Шымкент</option>
                        <option value="karaganda">Караганда</option>
                        <option value="aktobe">Актобе</option>
                        <option value="other">Другой город</option>
                    </select>
                    <span class="form-hint" id="fCityHint"></span>
                </div>
                <div class="form-group">
                    <label for="fAddress">Адрес доставки *</label>
                    <input type="text" id="fAddress" placeholder="Улица, дом, квартира" required autocomplete="street-address">
                    <span class="form-hint" id="fAddressHint"></span>
                </div>
                <button type="submit" class="btn btn--primary btn--full" style="margin-top:8px">Далее — оплата</button>
            </form>`;

        // Restore saved form data
        document.getElementById('fName').value = checkoutFormData.name;
        document.getElementById('fSurname').value = checkoutFormData.surname;
        document.getElementById('fPhone').value = checkoutFormData.phone;
        document.getElementById('fEmail').value = checkoutFormData.email;
        document.getElementById('fCity').value = checkoutFormData.city;
        document.getElementById('fAddress').value = checkoutFormData.address;

        // Phone formatting
        document.getElementById('fPhone').addEventListener('input', (e) => {
            const oldLen = e.target.value.length;
            const pos = e.target.selectionStart;
            e.target.value = formatPhone(e.target.value);
            const newLen = e.target.value.length;
            const newPos = Math.min(pos + (newLen - oldLen), newLen);
            e.target.setSelectionRange(newPos, newPos);
        });

        // Inline validation on blur
        const validateField = (id, hintId, validator, message) => {
            const input = document.getElementById(id);
            const hint = document.getElementById(hintId);
            input.addEventListener('blur', () => {
                if (!validator(input.value)) {
                    input.classList.add('error');
                    if (hint) hint.textContent = message;
                } else {
                    input.classList.remove('error');
                    if (hint) hint.textContent = '';
                }
            });
            input.addEventListener('input', () => {
                if (input.classList.contains('error') && validator(input.value)) {
                    input.classList.remove('error');
                    if (hint) hint.textContent = '';
                }
            });
        };

        validateField('fName', 'fNameHint', v => v.trim().length >= 2, 'Введите имя (мин. 2 символа)');
        validateField('fSurname', 'fSurnameHint', v => v.trim().length >= 2, 'Введите фамилию (мин. 2 символа)');
        validateField('fPhone', 'fPhoneHint', validatePhone, 'Введите корректный номер телефона');
        validateField('fEmail', 'fEmailHint', v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Введите корректный email');
        validateField('fCity', 'fCityHint', v => v.trim() !== '', 'Выберите город');
        validateField('fAddress', 'fAddressHint', v => v.trim().length >= 5, 'Введите адрес (мин. 5 символов)');

        document.getElementById('deliveryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;
            const checks = [
                { id: 'fName', hint: 'fNameHint', test: v => v.trim().length >= 2, msg: 'Введите имя' },
                { id: 'fSurname', hint: 'fSurnameHint', test: v => v.trim().length >= 2, msg: 'Введите фамилию' },
                { id: 'fPhone', hint: 'fPhoneHint', test: validatePhone, msg: 'Введите корректный номер' },
                { id: 'fCity', hint: 'fCityHint', test: v => v.trim() !== '', msg: 'Выберите город' },
                { id: 'fAddress', hint: 'fAddressHint', test: v => v.trim().length >= 5, msg: 'Введите адрес' },
                { id: 'fEmail', hint: 'fEmailHint', test: v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Введите корректный email' },
            ];
            checks.forEach(({ id, hint, test, msg }) => {
                const input = document.getElementById(id);
                const hintEl = document.getElementById(hint);
                if (!test(input.value)) {
                    input.classList.add('error');
                    if (hintEl) hintEl.textContent = msg;
                    valid = false;
                } else {
                    input.classList.remove('error');
                    if (hintEl) hintEl.textContent = '';
                }
            });
            if (valid) {
                // Save form data
                checkoutFormData.name = document.getElementById('fName').value;
                checkoutFormData.surname = document.getElementById('fSurname').value;
                checkoutFormData.phone = document.getElementById('fPhone').value;
                checkoutFormData.email = document.getElementById('fEmail').value;
                checkoutFormData.city = document.getElementById('fCity').value;
                checkoutFormData.address = document.getElementById('fAddress').value;
                checkoutStep = 2;
                renderCheckout();
            }
        });

    } else if (checkoutStep === 2) {
        el.innerHTML = `
            ${stepsHTML}
            <h3 class="checkout__title">Оплата</h3>
            <p style="font-size:13px;color:var(--gray);margin-bottom:24px">Итого к оплате: <strong>${formatPrice(finalTotal)}</strong></p>
            <div class="payment-methods" id="paymentMethods" role="radiogroup" aria-label="Способ оплаты">
                <div class="payment-method" data-method="kaspi" role="radio" aria-checked="false" tabindex="0">
                    <div class="payment-method__radio"></div>
                    <div class="payment-method__icon" style="color:#f14635;border-color:#f14635;font-size:9px;font-weight:800">KASPI</div>
                    <div class="payment-method__info">
                        <div class="payment-method__name">Kaspi Pay</div>
                        <div class="payment-method__desc">Оплата через приложение Kaspi.kz</div>
                    </div>
                </div>
                <div class="payment-method" data-method="halyk" role="radio" aria-checked="false" tabindex="0">
                    <div class="payment-method__radio"></div>
                    <div class="payment-method__icon" style="color:#00a650;border-color:#00a650;font-size:9px;font-weight:800">HALYK</div>
                    <div class="payment-method__info">
                        <div class="payment-method__name">Halyk Bank</div>
                        <div class="payment-method__desc">Оплата через Homebank или epay.kkb.kz</div>
                    </div>
                </div>
                <div class="payment-method" data-method="card" role="radio" aria-checked="false" tabindex="0">
                    <div class="payment-method__radio"></div>
                    <div class="payment-method__icon" style="font-size:8px">VISA<br>MC</div>
                    <div class="payment-method__info">
                        <div class="payment-method__name">Банковская карта</div>
                        <div class="payment-method__desc">Visa, Mastercard любого банка</div>
                    </div>
                </div>
            </div>
            <div id="cardFormContainer"></div>
            <div id="cardError" class="form-hint" style="margin-top:8px"></div>
            <div style="display:flex;gap:12px;margin-top:24px">
                <button class="btn btn--outline" id="backBtn" style="flex:1">Назад</button>
                <button class="btn btn--primary" id="payBtn" style="flex:2" disabled>Оплатить ${formatPrice(finalTotal)}</button>
            </div>`;

        document.getElementById('backBtn').addEventListener('click', () => {
            checkoutStep = 1; renderCheckout();
        });

        const payBtn = document.getElementById('payBtn');

        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', () => {
                document.querySelectorAll('.payment-method').forEach(m => {
                    m.classList.remove('active');
                    m.setAttribute('aria-checked', 'false');
                });
                method.classList.add('active');
                method.setAttribute('aria-checked', 'true');
                selectedPayment = method.dataset.method;
                payBtn.disabled = false;
                document.getElementById('cardError').textContent = '';

                const cardContainer = document.getElementById('cardFormContainer');
                if (selectedPayment === 'card') {
                    cardContainer.innerHTML = `
                        <div class="card-form">
                            <p class="card-form__demo-notice">Демо-режим: в рабочей версии оплата обрабатывается через защищённый платёжный шлюз (PCI DSS)</p>
                            <div class="form-group">
                                <label for="cardNumber">Номер карты</label>
                                <input type="text" placeholder="0000 0000 0000 0000" maxlength="19" id="cardNumber" inputmode="numeric" autocomplete="cc-number">
                                <span class="form-hint" id="cardNumberHint"></span>
                            </div>
                            <div class="form-row-3" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
                                <div class="form-group">
                                    <label for="cardMonth">Месяц</label>
                                    <input type="text" placeholder="MM" maxlength="2" id="cardMonth" inputmode="numeric" autocomplete="cc-exp-month">
                                </div>
                                <div class="form-group">
                                    <label for="cardYear">Год</label>
                                    <input type="text" placeholder="ГГ" maxlength="2" id="cardYear" inputmode="numeric" autocomplete="cc-exp-year">
                                </div>
                                <div class="form-group">
                                    <label for="cardCvv">CVV</label>
                                    <input type="password" placeholder="•••" maxlength="4" id="cardCvv" inputmode="numeric" autocomplete="cc-csc">
                                </div>
                            </div>
                        </div>`;

                    document.getElementById('cardNumber').addEventListener('input', (e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
                        e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
                    });
                    ['cardMonth', 'cardYear', 'cardCvv'].forEach(id => {
                        document.getElementById(id).addEventListener('input', (e) => {
                            e.target.value = e.target.value.replace(/\D/g, '');
                        });
                    });
                } else if (selectedPayment === 'kaspi') {
                    cardContainer.innerHTML = `
                        <div class="card-form">
                            <p class="card-form__demo-notice">Демо-режим: в рабочей версии — переход в приложение Kaspi.kz</p>
                            <div class="form-group">
                                <label for="kaspiPhone">Номер Kaspi</label>
                                <input type="tel" placeholder="+7 (___) ___-__-__" maxlength="18" id="kaspiPhone" autocomplete="tel">
                            </div>
                        </div>`;
                    document.getElementById('kaspiPhone').addEventListener('input', (e) => {
                        e.target.value = formatPhone(e.target.value);
                    });
                } else if (selectedPayment === 'halyk') {
                    cardContainer.innerHTML = `
                        <div class="card-form">
                            <p class="card-form__demo-notice">Демо-режим: в рабочей версии — переход в Homebank / epay.kkb.kz</p>
                            <div class="form-group">
                                <label for="halykCard">Номер карты Halyk Bank</label>
                                <input type="text" placeholder="0000 0000 0000 0000" maxlength="19" id="halykCard" inputmode="numeric">
                            </div>
                        </div>`;
                    document.getElementById('halykCard').addEventListener('input', (e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
                        e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
                    });
                } else {
                    cardContainer.innerHTML = '';
                }
            });
        });

        payBtn.addEventListener('click', () => {
            const errorEl = document.getElementById('cardError');
            if (selectedPayment === 'card') {
                const cardNum = document.getElementById('cardNumber')?.value || '';
                const cardMonth = document.getElementById('cardMonth')?.value || '';
                const cardYear = document.getElementById('cardYear')?.value || '';
                const cardCvv = document.getElementById('cardCvv')?.value || '';
                let errors = [];

                if (!validateCardNumber(cardNum)) errors.push('Неверный номер карты');
                if (!validateExpiry(cardMonth, cardYear)) errors.push('Неверный срок действия');
                if (!validateCvv(cardCvv)) errors.push('Неверный CVV');

                if (errors.length > 0) {
                    errorEl.textContent = errors.join('. ');
                    if (!validateCardNumber(cardNum)) document.getElementById('cardNumber').classList.add('error');
                    if (!validateExpiry(cardMonth, cardYear)) {
                        document.getElementById('cardMonth').classList.add('error');
                        document.getElementById('cardYear').classList.add('error');
                    }
                    if (!validateCvv(cardCvv)) document.getElementById('cardCvv').classList.add('error');
                    return;
                }
            } else if (selectedPayment === 'kaspi') {
                const phone = document.getElementById('kaspiPhone')?.value || '';
                const digits = phone.replace(/\D/g, '');
                if (digits.length !== 11 || (digits[0] !== '7' && digits[0] !== '8')) {
                    errorEl.textContent = 'Введите корректный казахстанский номер';
                    document.getElementById('kaspiPhone')?.classList.add('error');
                    return;
                }
            } else if (selectedPayment === 'halyk') {
                const card = document.getElementById('halykCard')?.value || '';
                if (!validateCardNumber(card)) {
                    errorEl.textContent = 'Введите корректный номер карты Halyk';
                    document.getElementById('halykCard')?.classList.add('error');
                    return;
                }
            }
            checkoutStep = 3; renderCheckout();
        });

    } else if (checkoutStep === 3) {
        const orderNum = 'NR-' + Date.now().toString().slice(-6) + Math.random().toString(36).slice(2, 4).toUpperCase();

        // Save order to localStorage for admin/account
        const order = {
            id: orderNum,
            date: new Date().toISOString(),
            customer: { ...checkoutFormData },
            items: Cart.items.map(item => {
                const p = PRODUCTS.find(pr => pr.id === item.id);
                return { ...item, name: p?.name || '', price: p?.price || 0, brand: p?.brand || '' };
            }),
            total: Cart.getTotal(),
            deliveryFee: Cart.getTotal() >= 50000 ? 0 : 2500,
            payment: selectedPayment,
            status: 'new'
        };
        try {
            const orders = JSON.parse(localStorage.getItem('nura_orders') || '[]');
            orders.unshift(order);
            localStorage.setItem('nura_orders', JSON.stringify(orders));
        } catch {}

        // Decrease stock per variant
        Cart.items.forEach(item => Stock.decrease(item.id, item.qty, item.size, item.color));

        // Save customer to localStorage
        try {
            const customers = JSON.parse(localStorage.getItem('nura_customers') || '[]');
            const existing = customers.find(c => c.phone === checkoutFormData.phone);
            if (existing) {
                Object.assign(existing, checkoutFormData, { lastOrder: new Date().toISOString() });
            } else {
                customers.push({ ...checkoutFormData, registered: new Date().toISOString(), lastOrder: new Date().toISOString() });
            }
            localStorage.setItem('nura_customers', JSON.stringify(customers));
        } catch {}

        Cart.clear();

        el.innerHTML = `
            ${stepsHTML}
            <div class="order-success">
                <div class="order-success__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3>Заказ оформлен!</h3>
                <p>Спасибо за покупку. Мы свяжемся с вами для подтверждения.</p>
                <div class="order-success__number">Заказ ${escapeHtml(orderNum)}</div>
                <p style="font-size:13px">Способ оплаты: <strong>${
                    selectedPayment === 'kaspi' ? 'Kaspi Pay' :
                    selectedPayment === 'halyk' ? 'Halyk Bank' : 'Банковская карта'
                }</strong></p>
                <p style="font-size:13px">Получатель: <strong>${escapeHtml(checkoutFormData.name)} ${escapeHtml(checkoutFormData.surname)}</strong></p>
                <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;justify-content:center">
                    <button class="btn btn--primary" onclick="closeModal('checkoutModal')">Продолжить покупки</button>
                    <a href="account.html" class="btn btn--outline">Мои заказы</a>
                </div>
            </div>`;
    }
}

/* ===== CLOSE MODAL ===== */
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {

    // Render products
    renderProducts();
    Cart.updateUI();
    Wishlist.updateUI();

    // Extended filter panel
    const filterToggle = document.getElementById('filterToggle');
    const filterPanel = document.getElementById('filterPanel');
    filterToggle?.addEventListener('click', () => {
        filterPanel?.classList.toggle('active');
        filterToggle.classList.toggle('active');
    });

    // Price range
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const priceApply = document.getElementById('priceApply');
    priceApply?.addEventListener('click', () => {
        let min = Math.max(0, parseInt(priceMin?.value || '0', 10) || 0);
        let max = Math.max(0, parseInt(priceMax?.value || '300000', 10) || 300000);
        if (min > max) { const tmp = min; min = max; max = tmp; if (priceMin) priceMin.value = min; if (priceMax) priceMax.value = max; }
        filterPrice[0] = min;
        filterPrice[1] = max;
        renderProducts();
    });

    // Size filter chips
    document.getElementById('sizeFilters')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-chip');
        if (!btn) return;
        btn.classList.toggle('active');
        filterSizes = Array.from(document.querySelectorAll('#sizeFilters .filter-chip.active')).map(b => b.dataset.value);
        renderProducts();
    });

    // Color filter chips
    document.getElementById('colorFilters')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-color-chip');
        if (!btn) return;
        btn.classList.toggle('active');
        filterColors = Array.from(document.querySelectorAll('#colorFilters .filter-color-chip.active')).map(b => b.dataset.value);
        renderProducts();
    });

    // Reset filters
    document.getElementById('filterReset')?.addEventListener('click', () => {
        filterPrice = [0, 300000];
        filterSizes = [];
        filterColors = [];
        if (priceMin) priceMin.value = '';
        if (priceMax) priceMax.value = '';
        document.querySelectorAll('.filter-chip.active, .filter-color-chip.active').forEach(b => b.classList.remove('active'));
        renderProducts();
    });

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            activeFilter = tab.dataset.filter;
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // Hide wishlist tab when switching to other filters
            const wishTab = document.querySelector('.filter-tab--wish');
            if (wishTab && tab.dataset.filter !== 'wishlist') wishTab.style.display = 'none';
            renderProducts();
        });
    });

    // Category cards
    document.querySelectorAll('[data-filter]').forEach(el => {
        if (el.classList.contains('filter-tab')) return;
        el.addEventListener('click', (e) => {
            e.preventDefault();
            activeFilter = el.dataset.filter;
            document.querySelectorAll('.filter-tab').forEach(t => {
                t.classList.toggle('active', t.dataset.filter === activeFilter);
            });
            renderProducts();
            document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Sort
    document.getElementById('sortSelect')?.addEventListener('change', (e) => {
        activeSort = e.target.value;
        renderProducts();
    });

    // Product card click → quick view (skip out-of-stock)
    document.getElementById('productsGrid')?.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (card && !card.classList.contains('product-card--out')) {
            openQuickView(parseInt(card.dataset.id, 10));
        }
    });

    // Cart
    document.getElementById('cartBtn')?.addEventListener('click', openCart);
    document.getElementById('cartClose')?.addEventListener('click', closeCart);
    document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

    // Cart item event delegation (replaces inline onclick)
    document.getElementById('cartItems')?.addEventListener('click', (e) => {
        const el = e.target.closest('[data-cart-action]');
        if (!el) return;
        const idx = parseInt(el.dataset.index, 10);
        const action = el.dataset.cartAction;
        if (action === 'decrease') { Cart.updateQty(idx, -1); renderCart(); }
        else if (action === 'increase') { Cart.updateQty(idx, 1); renderCart(); }
        else if (action === 'remove') { Cart.remove(idx); renderCart(); }
    });
    document.getElementById('checkoutBtn')?.addEventListener('click', openCheckout);

    // Modals close
    document.getElementById('qvClose')?.addEventListener('click', () => closeModal('quickViewModal'));
    document.getElementById('checkoutClose')?.addEventListener('click', () => closeModal('checkoutModal'));

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });

    // Search
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchClose = document.getElementById('searchClose');

    searchBtn?.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput?.focus(), 300);
    });

    searchClose?.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (searchInput) searchInput.value = '';
        if (searchResults) searchResults.innerHTML = '';
    });

    searchInput?.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        if (q.length < 2) { searchResults.innerHTML = ''; return; }

        const results = PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.desc.toLowerCase().includes(q) ||
            p.category.includes(q)
        );

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">Ничего не найдено</div>';
            return;
        }

        searchResults.innerHTML = results.map(p => `
            <div class="search-result" data-id="${p.id}">
                <div class="search-result__img" style="background: linear-gradient(135deg, ${escapeHtml(p.color)}40, ${escapeHtml(p.color)}80); overflow:hidden">
                    ${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" width="56" height="56" style="width:100%;height:100%;object-fit:cover">` : ''}
                </div>
                <div class="search-result__info">
                    <div class="search-result__brand">${escapeHtml(p.brand)}</div>
                    <div class="search-result__name">${escapeHtml(p.name)}</div>
                </div>
                <div class="search-result__price">${formatPrice(p.price)}</div>
            </div>`).join('');

        searchResults.querySelectorAll('.search-result').forEach(item => {
            item.addEventListener('click', () => {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
                searchInput.value = '';
                searchResults.innerHTML = '';
                openQuickView(parseInt(item.dataset.id, 10));
            });
        });
    });

    // Burger menu
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    burger?.addEventListener('click', () => {
        nav?.classList.toggle('active');
        burger.classList.toggle('active');
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                nav?.classList.remove('active');
                burger?.classList.remove('active');
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Header shadow on scroll
    const scrollTopBtn = document.getElementById('scrollTop');
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const y = window.scrollY;
                const header = document.getElementById('header');
                if (header) header.style.boxShadow = y > 80 ? '0 2px 20px rgba(0,0,0,0.06)' : 'none';
                if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', y > 500);
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // Scroll to top
    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Wishlist button — scroll to catalog showing only favorites
    document.getElementById('wishlistBtn')?.addEventListener('click', () => {
        if (Wishlist.items.length === 0) { showToast('Избранное пусто'); return; }
        activeFilter = 'wishlist';
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        const wishTab = document.querySelector('.filter-tab--wish');
        if (wishTab) { wishTab.style.display = ''; wishTab.classList.add('active'); }
        renderProducts();
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    });

    // Delivery/Return modal close on click outside
    ['deliveryModal', 'returnModal'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', (e) => {
            if (e.target.id === id) closeModal(id);
        });
    });

    // Mobile nav overlay
    const navOverlay = document.getElementById('navOverlay');
    burger?.addEventListener('click', () => {
        navOverlay?.classList.toggle('active', nav.classList.contains('active'));
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    navOverlay?.addEventListener('click', () => {
        nav?.classList.remove('active');
        burger?.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Escape key — only close the topmost active element
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        // Priority: search > checkout > quickview > delivery/return > cart > nav
        if (searchOverlay?.classList.contains('active')) {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        } else if (document.getElementById('checkoutModal')?.classList.contains('active')) {
            closeModal('checkoutModal');
        } else if (document.getElementById('quickViewModal')?.classList.contains('active')) {
            closeModal('quickViewModal');
        } else if (document.getElementById('deliveryModal')?.classList.contains('active')) {
            closeModal('deliveryModal');
        } else if (document.getElementById('returnModal')?.classList.contains('active')) {
            closeModal('returnModal');
        } else if (document.getElementById('cartSidebar')?.classList.contains('active')) {
            closeCart();
        } else if (nav?.classList.contains('active')) {
            nav.classList.remove('active');
            burger?.classList.remove('active');
            navOverlay?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
