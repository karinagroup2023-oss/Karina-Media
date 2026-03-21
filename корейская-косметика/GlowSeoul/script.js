/* ===== PRODUCT DATA ===== */
const PRODUCTS = [
    {
        id: 1, brand: 'COSRX', name: 'Advanced Snail 96 Mucin Power Essence',
        price: 12500, salePrice: 8125, category: 'bestseller sale',
        rating: 5, reviews: 2847, badges: ['sale', 'best'], discount: 35,
        skinType: ['dry', 'oily', 'combination', 'normal', 'sensitive'],
        concerns: ['dryness', 'aging', 'dull'],
        ingredients: ['snail'],
        brandKey: 'cosrx', type: 'skincare', soldPercent: 72,
        color: '#e8f5e9', colorDark: '#81c784',
        desc: 'Легендарная эссенция с 96% муцина улитки. Глубокое увлажнение, восстановление и сияние кожи.',
        tags: ['Увлажнение', 'Муцин улитки', 'Эссенция', 'Все типы кожи'],
        step: 'Эссенция (шаг 4)',
        svg: '<svg viewBox="0 0 80 80"><rect x="25" y="8" width="30" height="64" rx="15" fill="#e8f5e9"/><rect x="30" y="14" width="20" height="18" rx="10" fill="#a5d6a7"/><rect x="32" y="36" width="16" height="28" rx="8" fill="#c8e6c9"/><circle cx="40" cy="24" r="4" fill="#66bb6a" opacity="0.6"/></svg>'
    },
    {
        id: 2, brand: 'Beauty of Joseon', name: 'Glow Serum: Propolis + Niacinamide',
        price: 7900, salePrice: null, category: 'bestseller new',
        rating: 5, reviews: 1923, badges: ['new', 'best'], discount: 0,
        skinType: ['oily', 'combination', 'normal'],
        concerns: ['dull', 'pigmentation', 'pores'],
        ingredients: ['propolis', 'niacinamide'],
        brandKey: 'boj', type: 'skincare',
        color: '#fff3e0', colorDark: '#ffb74d',
        desc: 'Сыворотка с прополисом и ниацинамидом для сияния кожи. Выравнивает тон и сужает поры.',
        tags: ['Сияние', 'Прополис', 'Ниацинамид', 'Сыворотка'],
        step: 'Сыворотка (шаг 5)',
        svg: '<svg viewBox="0 0 80 80"><rect x="28" y="12" width="24" height="56" rx="12" fill="#fff3e0"/><circle cx="40" cy="8" r="5" fill="#ffcc80"/><rect x="32" y="28" width="16" height="30" rx="8" fill="#ffe0b2"/><circle cx="40" cy="42" r="5" fill="#ffb74d" opacity="0.5"/></svg>'
    },
    {
        id: 3, brand: 'SKIN1004', name: 'Madagascar Centella Ampoule',
        price: 9800, salePrice: 5880, category: 'bestseller sale',
        rating: 4, reviews: 956, badges: ['sale'], discount: 40,
        skinType: ['sensitive', 'combination', 'oily'],
        concerns: ['redness', 'acne', 'sensitive'],
        ingredients: ['centella'],
        brandKey: 'skin1004', type: 'skincare',
        color: '#e8f5e9', colorDark: '#66bb6a',
        desc: 'Ампула с центеллой азиатской из Мадагаскара. Успокаивает, снимает покраснения, восстанавливает барьер.',
        tags: ['Успокаивающее', 'Центелла', 'Ампула', 'Чувствительная кожа'],
        step: 'Сыворотка (шаг 5)',
        svg: '<svg viewBox="0 0 80 80"><rect x="30" y="10" width="20" height="58" rx="10" fill="#e8f5e9"/><rect x="34" y="16" width="12" height="12" rx="6" fill="#a5d6a7"/><path d="M36 35 L44 35 L42 60 L38 60Z" fill="#c8e6c9"/><circle cx="40" cy="22" r="3" fill="#4caf50" opacity="0.4"/></svg>'
    },
    {
        id: 4, brand: 'Torriden', name: 'DIVE-IN Low Molecule Hyaluronic Acid Serum',
        price: 8500, salePrice: null, category: 'new',
        rating: 5, reviews: 3412, badges: ['new'], discount: 0,
        skinType: ['dry', 'normal', 'combination', 'sensitive'],
        concerns: ['dryness', 'dull'],
        ingredients: ['hyaluronic'],
        brandKey: 'torriden', type: 'skincare',
        color: '#e3f2fd', colorDark: '#64b5f6',
        desc: 'Сыворотка с 5 типами гиалуроновой кислоты. Мгновенное и длительное увлажнение на всех уровнях кожи.',
        tags: ['Увлажнение', 'Гиалуроновая кислота', 'Сыворотка', 'Для сухой кожи'],
        step: 'Сыворотка (шаг 5)',
        svg: '<svg viewBox="0 0 80 80"><ellipse cx="40" cy="42" rx="16" ry="24" fill="#e3f2fd"/><circle cx="35" cy="35" r="6" fill="#90caf9" opacity="0.6"/><circle cx="45" cy="30" r="4" fill="#64b5f6" opacity="0.4"/><circle cx="38" cy="48" r="3" fill="#42a5f5" opacity="0.3"/><rect x="35" y="10" width="10" height="16" rx="5" fill="#bbdefb"/></svg>'
    },
    {
        id: 5, brand: 'Beauty of Joseon', name: 'Relief Sun: Rice + Probiotics SPF50+',
        price: 6200, salePrice: 4650, category: 'sale',
        rating: 5, reviews: 5102, badges: ['sale'], discount: 25,
        skinType: ['dry', 'oily', 'combination', 'normal', 'sensitive'],
        concerns: ['pigmentation', 'aging'],
        ingredients: ['rice'],
        brandKey: 'boj', type: 'sun',
        color: '#fff8e1', colorDark: '#ffd54f',
        desc: 'Органический солнцезащитный крем SPF50+ PA++++. На основе рисовых отрубей и пробиотиков. Без белого следа.',
        tags: ['SPF50+', 'Рис', 'Солнцезащита', 'Все типы кожи'],
        step: 'SPF-защита (шаг 9)',
        svg: '<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="22" fill="#fff8e1"/><circle cx="40" cy="40" r="14" fill="#ffd54f" opacity="0.5"/><g stroke="#ffc107" stroke-width="2.5"><line x1="40" y1="10" x2="40" y2="18"/><line x1="40" y1="62" x2="40" y2="70"/><line x1="10" y1="40" x2="18" y2="40"/><line x1="62" y1="40" x2="70" y2="40"/><line x1="19" y1="19" x2="24" y2="24"/><line x1="56" y1="56" x2="61" y2="61"/><line x1="19" y1="61" x2="24" y2="56"/><line x1="56" y1="24" x2="61" y2="19"/></g></svg>'
    },
    {
        id: 6, brand: 'Anua', name: 'Heartleaf 77% Soothing Toner',
        price: 9200, salePrice: null, category: 'bestseller',
        rating: 5, reviews: 4218, badges: ['best'], discount: 0,
        skinType: ['oily', 'combination', 'sensitive'],
        concerns: ['acne', 'pores', 'redness', 'sensitive'],
        ingredients: ['heartleaf'],
        brandKey: 'anua', type: 'skincare',
        color: '#e8f5e9', colorDark: '#a5d6a7',
        desc: 'Тонер с 77% экстрактом хауттюйнии. Успокаивает, сужает поры, регулирует себум. pH 5.5.',
        tags: ['Тонер', 'Хауттюйния', 'Успокаивающее', 'Для жирной кожи'],
        step: 'Тонер (шаг 3)',
        svg: '<svg viewBox="0 0 80 80"><rect x="24" y="12" width="32" height="56" rx="16" fill="#e8f5e9"/><path d="M32 20 Q40 14 48 20 Q48 32 40 36 Q32 32 32 20Z" fill="#a5d6a7"/><rect x="30" y="38" width="20" height="24" rx="10" fill="#c8e6c9"/></svg>'
    },
    {
        id: 7, brand: 'Medicube', name: 'AGE-R Booster-H Shot',
        price: 18900, salePrice: 13230, category: 'new sale',
        rating: 4, reviews: 712, badges: ['sale', 'new'], discount: 30,
        skinType: ['dry', 'normal', 'combination'],
        concerns: ['aging', 'dryness'],
        ingredients: ['hyaluronic'],
        brandKey: 'medicube', type: 'skincare',
        color: '#f3e5f5', colorDark: '#ce93d8',
        desc: 'Бустер с высокомолекулярной гиалуроновой кислотой для интенсивного увлажнения. Работает с девайсами AGE-R.',
        tags: ['Бустер', 'Гиалуроновая кислота', 'Anti-age', 'Премиум'],
        step: 'Сыворотка (шаг 5)',
        svg: '<svg viewBox="0 0 80 80"><rect x="28" y="8" width="24" height="52" rx="12" fill="#f3e5f5"/><rect x="32" y="14" width="16" height="10" rx="8" fill="#ce93d8"/><rect x="34" y="28" width="12" height="24" rx="6" fill="#e1bee7"/><rect x="26" y="60" width="28" height="12" rx="6" fill="#f3e5f5" stroke="#ce93d8" stroke-width="1"/></svg>'
    },
    {
        id: 8, brand: "I'm From", name: 'Rice Toner',
        price: 10400, salePrice: null, category: 'bestseller',
        rating: 5, reviews: 2156, badges: ['best'], discount: 0,
        skinType: ['dry', 'normal', 'combination'],
        concerns: ['dull', 'dryness', 'pigmentation'],
        ingredients: ['rice'],
        brandKey: 'imfrom', type: 'skincare',
        color: '#fff8e1', colorDark: '#ffe082',
        desc: 'Тонер с экстрактом корейского риса из Горёна. Выравнивает текстуру и тон, глубоко увлажняет.',
        tags: ['Тонер', 'Рис', 'Сияние', 'Для сухой кожи'],
        step: 'Тонер (шаг 3)',
        svg: '<svg viewBox="0 0 80 80"><rect x="22" y="10" width="36" height="60" rx="18" fill="#fff8e1"/><rect x="28" y="16" width="24" height="16" rx="12" fill="#ffe0b2"/><rect x="30" y="36" width="20" height="28" rx="10" fill="#fff9c4"/><circle cx="40" cy="26" r="4" fill="#ffb74d" opacity="0.5"/></svg>'
    }
];

/* ===== STATE ===== */
let cart = JSON.parse(localStorage.getItem('glowseoul_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('glowseoul_wishlist') || '[]');
let quizAnswers = {};

/* ===== RENDER PRODUCTS ===== */
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    const count = document.getElementById('productsCount');

    grid.innerHTML = products.map(p => {
        const actualPrice = p.salePrice || p.price;
        const inWishlist = wishlist.includes(p.id);
        let badgesHTML = '';
        if (p.badges.includes('sale')) badgesHTML += `<span class="product-card__badge product-card__badge--sale">-${p.discount}%</span>`;
        if (p.badges.includes('new')) badgesHTML += `<span class="product-card__badge product-card__badge--new">New</span>`;
        if (p.badges.includes('best')) badgesHTML += `<span class="product-card__badge product-card__badge--best">Хит</span>`;
        if (p.soldPercent) badgesHTML += `<span class="product-card__badge product-card__badge--sold" style="top:auto;bottom:10px;left:10px">${p.soldPercent}% продано <span class="sold-bar"><span class="sold-bar__fill" style="width:${p.soldPercent}%"></span></span></span>`;

        const starsHTML = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);
        const priceHTML = p.salePrice
            ? `<span class="price-old">${formatPrice(p.price)}</span><span class="price-new">${formatPrice(p.salePrice)}</span>`
            : `<span class="price-current">${formatPrice(p.price)}</span>`;

        return `
        <div class="product-card" data-id="${p.id}" data-category="${p.category}">
            <div class="product-card__img" style="background:${p.color}">
                ${badgesHTML}
                <div class="product-card__visual">${p.svg}</div>
                <button class="product-card__wishlist ${inWishlist ? 'active' : ''}" aria-label="В избранное" data-id="${p.id}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${inWishlist ? 'var(--primary)' : 'none'}" stroke="${inWishlist ? 'var(--primary)' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
                <button class="product-card__quick" data-id="${p.id}">Быстрый просмотр</button>
            </div>
            <div class="product-card__info">
                <span class="product-card__brand">${p.brand}</span>
                <h3 class="product-card__name">${p.name}</h3>
                <div class="product-card__rating">
                    <div class="stars">${starsHTML}</div>
                    <span class="reviews-count">(${p.reviews.toLocaleString()})</span>
                </div>
                <div class="product-card__prices">${priceHTML}</div>
                <button class="btn btn--add-cart" data-id="${p.id}">В корзину</button>
            </div>
        </div>`;
    }).join('');

    count.textContent = `Показано ${products.length} товаров`;
    initProductEvents();
    observeElements();
}

function formatPrice(n) {
    return n.toLocaleString('ru-RU') + ' ₸';
}

function initProductEvents() {
    // Add to cart
    document.querySelectorAll('.btn--add-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            addToCart(id);
            btn.textContent = 'Добавлено ✓';
            btn.classList.add('btn--success');
            setTimeout(() => { btn.textContent = 'В корзину'; btn.classList.remove('btn--success'); }, 1500);
        });
    });

    // Wishlist
    document.querySelectorAll('.product-card__wishlist').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(btn.dataset.id);
            toggleWishlist(id);
        });
    });

    // Quick View
    document.querySelectorAll('.product-card__quick').forEach(btn => {
        btn.addEventListener('click', () => openQuickView(parseInt(btn.dataset.id)));
    });
}

/* ===== CART ===== */
function addToCart(productId, qty = 1) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id: productId, qty });
    }
    saveCart();
    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function updateCartQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(productId); return; }
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem('glowseoul_cart', JSON.stringify(cart));
}

function getCartTotal() {
    return cart.reduce((sum, item) => {
        const p = PRODUCTS.find(pr => pr.id === item.id);
        return sum + (p ? (p.salePrice || p.price) * item.qty : 0);
    }, 0);
}

function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function renderCart() {
    const badge = document.getElementById('cartBadge');
    const count = getCartCount();
    badge.textContent = count;
    badge.setAttribute('data-count', count);

    const drawerCount = document.getElementById('cartDrawerCount');
    drawerCount.textContent = `(${count})`;

    const itemsContainer = document.getElementById('cartItems');
    const emptyEl = document.getElementById('cartEmpty');
    const footer = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotal');

    // Remove old items (keep empty state)
    itemsContainer.querySelectorAll('.cart-item').forEach(el => el.remove());

    if (cart.length === 0) {
        emptyEl.style.display = '';
        footer.style.display = 'none';
    } else {
        emptyEl.style.display = 'none';
        footer.style.display = '';

        cart.forEach(item => {
            const p = PRODUCTS.find(pr => pr.id === item.id);
            if (!p) return;
            const price = p.salePrice || p.price;

            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <div class="cart-item__img" style="background:${p.color}">${p.svg.replace('viewBox="0 0 80 80"', 'viewBox="0 0 80 80" width="40" height="40"')}</div>
                <div class="cart-item__info">
                    <span class="cart-item__brand">${p.brand}</span>
                    <p class="cart-item__name">${p.name}</p>
                    <div class="cart-item__bottom">
                        <div class="cart-item__qty">
                            <button data-id="${p.id}" data-delta="-1">−</button>
                            <span>${item.qty}</span>
                            <button data-id="${p.id}" data-delta="1">+</button>
                        </div>
                        <span class="cart-item__price">${formatPrice(price * item.qty)}</span>
                    </div>
                </div>
                <button class="cart-item__remove" data-id="${p.id}" aria-label="Удалить">&times;</button>`;
            itemsContainer.appendChild(el);
        });

        totalEl.textContent = formatPrice(getCartTotal());

        // Qty buttons
        itemsContainer.querySelectorAll('.cart-item__qty button').forEach(btn => {
            btn.addEventListener('click', () => {
                updateCartQty(parseInt(btn.dataset.id), parseInt(btn.dataset.delta));
            });
        });

        // Remove buttons
        itemsContainer.querySelectorAll('.cart-item__remove').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
        });
    }

    // Shipping progress
    updateShippingProgress();
}

function updateShippingProgress() {
    const total = getCartTotal();
    const threshold = 15000;
    const fill = document.getElementById('shippingFill');
    const text = document.getElementById('shippingText');
    const pct = Math.min(100, (total / threshold) * 100);

    fill.style.width = pct + '%';

    if (total >= threshold) {
        text.textContent = 'Поздравляем! Вам доступна бесплатная доставка ✓';
        text.className = 'shipping-bar__text shipping-bar__text--free';
    } else {
        const remaining = threshold - total;
        text.textContent = `Добавьте ещё на ${formatPrice(remaining)} для бесплатной доставки`;
        text.className = 'shipping-bar__text';
    }
}

/* ===== WISHLIST ===== */
function toggleWishlist(productId) {
    const idx = wishlist.indexOf(productId);
    if (idx > -1) {
        wishlist.splice(idx, 1);
    } else {
        wishlist.push(productId);
    }
    localStorage.setItem('glowseoul_wishlist', JSON.stringify(wishlist));
    document.getElementById('wishlistBadge').textContent = wishlist.length;
    document.getElementById('wishlistBadge').setAttribute('data-count', wishlist.length);

    // Update all wishlist buttons for this product
    document.querySelectorAll(`.product-card__wishlist[data-id="${productId}"]`).forEach(btn => {
        const svg = btn.querySelector('svg');
        const active = wishlist.includes(productId);
        btn.classList.toggle('active', active);
        svg.setAttribute('fill', active ? 'var(--primary)' : 'none');
        svg.setAttribute('stroke', active ? 'var(--primary)' : 'currentColor');
    });
}

/* ===== QUICK VIEW MODAL ===== */
function openQuickView(productId) {
    const p = PRODUCTS.find(pr => pr.id === productId);
    if (!p) return;

    const modal = document.getElementById('quickViewModal');
    const body = document.getElementById('modalBody');
    const price = p.salePrice || p.price;
    const starsHTML = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);
    const priceHTML = p.salePrice
        ? `<span class="price-old" style="font-size:16px">${formatPrice(p.price)}</span><span class="price-new" style="font-size:24px">${formatPrice(p.salePrice)}</span>`
        : `<span class="price-current" style="font-size:24px">${formatPrice(p.price)}</span>`;

    body.innerHTML = `
    <div class="modal-product">
        <div class="modal-product__img" style="background:${p.color}">${p.svg}</div>
        <div class="modal-product__info">
            <h2>${p.brand}</h2>
            <h3>${p.name}</h3>
            <div class="modal-product__rating">
                <span class="stars">${starsHTML}</span>
                <span class="reviews-count">(${p.reviews.toLocaleString()} отзывов)</span>
            </div>
            <div class="modal-product__prices">${priceHTML}</div>
            <p class="modal-product__desc">${p.desc}</p>
            <div class="modal-product__tags">${p.tags.map(t => `<span class="modal-product__tag">${t}</span>`).join('')}</div>
            <p class="modal-product__desc" style="font-size:12px;color:var(--gray-light)">Шаг в рутине: ${p.step}</p>
            <button class="btn btn--primary btn--full" id="modalAddCart" data-id="${p.id}" style="margin-top:16px">Добавить в корзину — ${formatPrice(price)}</button>
        </div>
    </div>`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    document.getElementById('modalAddCart').addEventListener('click', () => {
        addToCart(p.id);
        modal.classList.remove('active');
        document.body.style.overflow = '';
        openCart();
    });
}

/* ===== SEARCH ===== */
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchSuggestions = document.getElementById('searchSuggestions');

searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (q.length < 2) {
        searchResults.innerHTML = '';
        searchSuggestions.style.display = '';
        return;
    }

    searchSuggestions.style.display = 'none';

    const results = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.ingredients.some(i => i.toLowerCase().includes(q))
    );

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">Ничего не найдено. Попробуйте другой запрос.</div>';
        return;
    }

    searchResults.innerHTML = results.map(p => {
        const price = p.salePrice || p.price;
        return `
        <div class="search-result-item" data-id="${p.id}">
            <div class="search-result-item__img" style="background:${p.color}">${p.svg.replace('viewBox="0 0 80 80"', 'viewBox="0 0 80 80" width="36" height="36"')}</div>
            <div class="search-result-item__info">
                <span class="search-result-item__brand">${p.brand}</span>
                <div class="search-result-item__name">${p.name}</div>
            </div>
            <span class="search-result-item__price">${formatPrice(price)}</span>
        </div>`;
    }).join('');

    searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            document.getElementById('searchOverlay').classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
            searchSuggestions.style.display = '';
            openQuickView(id);
        });
    });
});

// Search tags
document.querySelectorAll('.tag[data-query]').forEach(tag => {
    tag.addEventListener('click', () => {
        searchInput.value = tag.dataset.query;
        searchInput.dispatchEvent(new Event('input'));
    });
});

/* ===== PRODUCT FILTERS ===== */
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
    });
});

// Concern pills
document.querySelectorAll('.concern-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        pill.classList.toggle('active');
        // Scroll to products
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        // Apply matching concern filter in sidebar
        const concern = pill.dataset.concern;
        const checkbox = document.querySelector(`#concern input[value="${concern}"]`);
        if (checkbox) {
            checkbox.checked = pill.classList.contains('active');
            applyFilters();
        }
    });
});

// Sidebar filters
document.querySelectorAll('.filter-checkbox input').forEach(cb => {
    cb.addEventListener('change', () => applyFilters());
});

// Price range
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
priceRange.addEventListener('input', () => {
    priceValue.textContent = formatPrice(parseInt(priceRange.value));
    applyFilters();
});

// Filter toggle groups
document.querySelectorAll('.filter-group__title[data-toggle]').forEach(title => {
    title.addEventListener('click', () => {
        const options = document.getElementById(title.dataset.toggle);
        options.classList.toggle('collapsed');
        title.classList.toggle('collapsed');
    });
});

// Reset filters
document.getElementById('filtersReset').addEventListener('click', () => {
    document.querySelectorAll('.filter-checkbox input').forEach(cb => cb.checked = false);
    document.querySelectorAll('.concern-pill').forEach(p => p.classList.remove('active'));
    priceRange.value = 30000;
    priceValue.textContent = '30 000 ₸';
    filterBtns.forEach(b => b.classList.remove('active'));
    filterBtns[0].classList.add('active');
    applyFilters();
});

function applyFilters() {
    const activeTab = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const maxPrice = parseInt(priceRange.value);

    const checkedSkinTypes = getChecked('#skintype');
    const checkedConcerns = getChecked('#concern');
    const checkedIngredients = getChecked('#ingredients');
    const checkedBrands = getChecked('#brand');

    let filtered = PRODUCTS.filter(p => {
        if (activeTab !== 'all' && !p.category.includes(activeTab)) return false;
        const price = p.salePrice || p.price;
        if (price > maxPrice) return false;
        if (checkedSkinTypes.length && !checkedSkinTypes.some(s => p.skinType.includes(s))) return false;
        if (checkedConcerns.length && !checkedConcerns.some(c => p.concerns.includes(c))) return false;
        if (checkedIngredients.length && !checkedIngredients.some(i => p.ingredients.includes(i))) return false;
        if (checkedBrands.length && !checkedBrands.includes(p.brandKey)) return false;
        return true;
    });

    renderProducts(filtered);
}

function getChecked(containerId) {
    const container = document.querySelector(containerId);
    if (!container) return [];
    return Array.from(container.querySelectorAll('input:checked')).map(cb => cb.value);
}

/* ===== MOBILE FILTERS ===== */
const filtersToggle = document.getElementById('filtersToggle');
const filtersSidebar = document.getElementById('filtersSidebar');
const mobileFiltersClose = document.getElementById('mobileFiltersClose');
const overlay = document.getElementById('overlay');

if (filtersToggle) {
    filtersToggle.addEventListener('click', () => {
        filtersSidebar.classList.add('active');
        overlay.classList.add('active');
    });
}

if (mobileFiltersClose) {
    mobileFiltersClose.addEventListener('click', () => {
        filtersSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
}

/* ===== BURGER MENU ===== */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
});

/* ===== SEARCH OVERLAY ===== */
document.getElementById('searchBtn').addEventListener('click', () => {
    document.getElementById('searchOverlay').classList.add('active');
    setTimeout(() => searchInput.focus(), 300);
});

document.getElementById('searchClose').addEventListener('click', () => {
    document.getElementById('searchOverlay').classList.remove('active');
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('searchOverlay').classList.remove('active');
        document.getElementById('quickViewModal').classList.remove('active');
        closeCart();
        document.body.style.overflow = '';
    }
});

/* ===== CART DRAWER ===== */
function openCart() {
    document.getElementById('cartDrawer').classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartDrawer').classList.remove('active');
    filtersSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartEmptyBtn').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

/* ===== MODAL ===== */
document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('quickViewModal').classList.remove('active');
    document.body.style.overflow = '';
});

document.getElementById('quickViewModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        e.currentTarget.classList.remove('active');
        document.body.style.overflow = '';
    }
});

/* ===== COUNTDOWN TIMER ===== */
function updateCountdown() {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const diff = endOfDay - now;
    document.getElementById('hours').textContent = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
    document.getElementById('minutes').textContent = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    document.getElementById('seconds').textContent = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ===== 10-STEP ROUTINE ===== */
document.querySelectorAll('.routine-step').forEach(step => {
    step.addEventListener('click', () => {
        const wasActive = step.classList.contains('active');
        document.querySelectorAll('.routine-step').forEach(s => s.classList.remove('active'));
        if (!wasActive) step.classList.add('active');
    });
});

/* ===== QUIZ ===== */
function showQuizStep(stepNum) {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`.quiz-step[data-step="${stepNum}"]`);
    if (target) target.classList.add('active');
}

document.getElementById('startQuiz').addEventListener('click', () => {
    quizAnswers = {};
    showQuizStep(1);
});

// Handle quiz option clicks
document.getElementById('quizContent').addEventListener('click', (e) => {
    const option = e.target.closest('.quiz-option');
    if (!option) return;

    const step = option.closest('.quiz-step');
    const stepNum = parseInt(step.dataset.step);
    const isMulti = option.closest('.quiz-options--multi');

    if (isMulti) {
        option.classList.toggle('selected');
    } else {
        step.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');

        // Auto-advance for single-select steps
        if ([1, 3, 4, 5].includes(stepNum)) {
            quizAnswers[stepNum] = option.dataset.value;
            setTimeout(() => {
                if (stepNum === 5) {
                    showQuizResult();
                } else {
                    showQuizStep(stepNum + 1);
                }
            }, 300);
        }
    }
});

// Next button for multi-select steps
document.querySelectorAll('.quiz-next').forEach(btn => {
    btn.addEventListener('click', () => {
        const step = btn.closest('.quiz-step');
        const stepNum = parseInt(step.dataset.step);
        const selected = Array.from(step.querySelectorAll('.quiz-option.selected')).map(o => o.dataset.value);
        quizAnswers[stepNum] = selected;
        showQuizStep(parseInt(btn.dataset.next));
    });
});

function showQuizResult() {
    showQuizStep('result');

    const skinType = quizAnswers[1] || 'normal';
    const concerns = quizAnswers[2] || [];
    const budget = quizAnswers[4] || 'mid';

    // Simple recommendation logic
    const routine = [
        { step: 'Очищение', match: PRODUCTS.find(p => p.type === 'cleansing') },
        { step: 'Тонер', match: PRODUCTS.find(p => p.step?.includes('Тонер') && p.skinType.includes(skinType)) },
        { step: 'Сыворотка', match: PRODUCTS.find(p => p.step?.includes('Сыворотка') && (concerns.length === 0 || p.concerns.some(c => concerns.includes(c)))) },
        { step: 'Эссенция', match: PRODUCTS.find(p => p.step?.includes('Эссенция')) },
        { step: 'SPF-защита', match: PRODUCTS.find(p => p.type === 'sun') }
    ].filter(r => r.match);

    // If no specific matches, fill with popular products
    if (routine.length < 3) {
        const popular = PRODUCTS.filter(p => p.badges.includes('best')).slice(0, 3);
        popular.forEach(p => {
            if (!routine.find(r => r.match?.id === p.id)) {
                routine.push({ step: p.step || 'Рекомендация', match: p });
            }
        });
    }

    const container = document.getElementById('quizResultProducts');
    container.innerHTML = routine.slice(0, 5).map(r => {
        const p = r.match;
        const price = p.salePrice || p.price;
        return `
        <div class="quiz-product" data-id="${p.id}">
            <div class="quiz-product__img" style="background:rgba(255,255,255,0.1)">${p.svg.replace('viewBox="0 0 80 80"', 'viewBox="0 0 80 80" width="40" height="40"')}</div>
            <div class="quiz-product__info">
                <span class="quiz-product__step">${r.step}</span>
                <div class="quiz-product__name">${p.brand} ${p.name}</div>
                <span class="quiz-product__price">${formatPrice(price)}</span>
            </div>
        </div>`;
    }).join('');

    const total = routine.slice(0, 5).reduce((s, r) => s + (r.match.salePrice || r.match.price), 0);
    document.getElementById('quizResultTitle').textContent = `Ваша персональная рутина — ${formatPrice(total)}`;

    // Add all to cart
    document.getElementById('quizAddAll').onclick = () => {
        routine.slice(0, 5).forEach(r => addToCart(r.match.id));
        openCart();
    };
}

document.getElementById('quizRestart').addEventListener('click', () => {
    quizAnswers = {};
    showQuizStep(0);
});

/* ===== SCROLL ANIMATIONS ===== */
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.product-card, .category-card, .routine-step, .blog-card, .advantage').forEach(el => {
        if (el.style.opacity === '1') return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

/* ===== HEADER SCROLL ===== */
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.style.boxShadow = window.pageYOffset > 80 ? '0 2px 20px rgba(0,0,0,0.08)' : 'none';
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            nav.classList.remove('active');
            burger.classList.remove('active');
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ===== LANGUAGE SWITCHER ===== */
document.querySelectorAll('.lang-switcher__btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-switcher__btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

/* ===== INIT ===== */
renderProducts(PRODUCTS);
renderCart();
document.getElementById('wishlistBadge').textContent = wishlist.length;
document.getElementById('wishlistBadge').setAttribute('data-count', wishlist.length);
observeElements();
