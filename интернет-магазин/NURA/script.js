/* ===== PRODUCT DATA ===== */
const PRODUCTS = [
    // Women
    {
        id: 1, brand: 'NŪRA', name: 'Шёлковое платье-миди', category: 'women',
        price: 89900, oldPrice: null,
        color: '#e8d5c4', colorName: 'Бежевый',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
        colors: [{ name: 'Бежевый', hex: '#e8d5c4' }, { name: 'Чёрный', hex: '#1a1a1a' }],
        sizes: ['XS', 'S', 'M', 'L'],
        desc: 'Элегантное платье-миди из натурального шёлка. Струящийся силуэт, потайная молния сбоку. Идеально для вечернего выхода или особого случая.',
        badge: 'Новинка'
    },
    {
        id: 2, brand: 'NŪRA', name: 'Кашемировое пальто оверсайз', category: 'women',
        price: 245000, oldPrice: 289000,
        color: '#c0c5cb', colorName: 'Серый',
        image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=800&fit=crop',
        colors: [{ name: 'Серый', hex: '#c0c5cb' }, { name: 'Бежевый', hex: '#d4c4b0' }, { name: 'Чёрный', hex: '#1a1a1a' }],
        sizes: ['S', 'M', 'L', 'XL'],
        desc: 'Роскошное пальто из итальянского кашемира. Свободный крой оверсайз, пояс в комплекте. Классическая длина до колена.',
        badge: 'Sale'
    },
    {
        id: 3, brand: 'NŪRA', name: 'Блуза из органзы', category: 'women',
        price: 54900, oldPrice: null,
        color: '#f5e6d3', colorName: 'Молочный',
        image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop',
        colors: [{ name: 'Молочный', hex: '#f5e6d3' }, { name: 'Пудра', hex: '#e8c4c4' }],
        sizes: ['XS', 'S', 'M', 'L'],
        desc: 'Воздушная блуза из органзы с объёмными рукавами. Нежная текстура и романтичный силуэт. Подойдёт для офиса и особых мероприятий.',
        badge: null
    },
    {
        id: 4, brand: 'NŪRA', name: 'Брюки палаццо шерсть', category: 'women',
        price: 67000, oldPrice: null,
        color: '#2c2c2c', colorName: 'Графит',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
        colors: [{ name: 'Графит', hex: '#2c2c2c' }, { name: 'Бежевый', hex: '#d4c4b0' }],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        desc: 'Широкие брюки палаццо из костюмной шерсти. Высокая посадка, стрелки, подкладка. Универсальная модель для делового и повседневного гардероба.',
        badge: null
    },
    {
        id: 5, brand: 'NŪRA', name: 'Кожаная юбка-миди', category: 'women',
        price: 78500, oldPrice: null,
        color: '#3d2b1f', colorName: 'Шоколад',
        image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop',
        colors: [{ name: 'Шоколад', hex: '#3d2b1f' }, { name: 'Чёрный', hex: '#1a1a1a' }],
        sizes: ['XS', 'S', 'M', 'L'],
        desc: 'Юбка-миди из мягкой натуральной кожи. А-силуэт, потайная молния, подкладка из вискозы. Актуальная длина ниже колена.',
        badge: 'Новинка'
    },
    {
        id: 6, brand: 'NŪRA', name: 'Трикотажный костюм', category: 'women',
        price: 112000, oldPrice: 134000,
        color: '#d4c4b0', colorName: 'Песочный',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
        colors: [{ name: 'Песочный', hex: '#d4c4b0' }, { name: 'Серый', hex: '#a0a0a0' }],
        sizes: ['S', 'M', 'L'],
        desc: 'Костюм из мериносовой шерсти: свитер свободного кроя + брюки с эластичным поясом. Мягкая текстура, идеальная посадка.',
        badge: 'Sale'
    },
    // Men
    {
        id: 7, brand: 'NŪRA', name: 'Костюм-тройка шерсть', category: 'men',
        price: 289000, oldPrice: null,
        color: '#2c3e50', colorName: 'Тёмно-синий',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop',
        colors: [{ name: 'Тёмно-синий', hex: '#2c3e50' }, { name: 'Графит', hex: '#2c2c2c' }],
        sizes: ['46', '48', '50', '52', '54'],
        desc: 'Классический костюм-тройка из итальянской шерсти Super 120\'s. Пиджак, жилет и брюки. Полуприлегающий силуэт, ручная обработка краёв.',
        badge: 'Премиум'
    },
    {
        id: 8, brand: 'NŪRA', name: 'Рубашка Oxford хлопок', category: 'men',
        price: 42900, oldPrice: null,
        color: '#f5f5f5', colorName: 'Белый',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
        colors: [{ name: 'Белый', hex: '#f5f5f5' }, { name: 'Голубой', hex: '#b8d4e3' }, { name: 'Розовый', hex: '#e8c4c4' }],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        desc: 'Классическая рубашка Oxford из египетского хлопка. Воротник button-down, стандартный крой. Идеальна с костюмом и с джинсами.',
        badge: null
    },
    {
        id: 9, brand: 'NŪRA', name: 'Пальто oversize шерсть', category: 'men',
        price: 198000, oldPrice: 235000,
        color: '#5c4a3a', colorName: 'Коричневый',
        image: 'https://images.unsplash.com/photo-1544923246-77307dd270b5?w=600&h=800&fit=crop',
        colors: [{ name: 'Коричневый', hex: '#5c4a3a' }, { name: 'Чёрный', hex: '#1a1a1a' }],
        sizes: ['M', 'L', 'XL', 'XXL'],
        desc: 'Мужское пальто оверсайз из итальянской шерсти. Двубортная застёжка, два кармана. Длина до середины бедра.',
        badge: 'Sale'
    },
    {
        id: 10, brand: 'NŪRA', name: 'Брюки чинос хлопок', category: 'men',
        price: 45900, oldPrice: null,
        color: '#c9b99a', colorName: 'Хаки',
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
        colors: [{ name: 'Хаки', hex: '#c9b99a' }, { name: 'Тёмно-синий', hex: '#2c3e50' }, { name: 'Чёрный', hex: '#1a1a1a' }],
        sizes: ['46', '48', '50', '52', '54'],
        desc: 'Классические чинос из хлопка с эластаном. Зауженный крой, средняя посадка. Комфорт на каждый день.',
        badge: null
    },
    {
        id: 11, brand: 'NŪRA', name: 'Кожаная куртка байкер', category: 'men',
        price: 175000, oldPrice: null,
        color: '#1a1a1a', colorName: 'Чёрный',
        image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600&h=800&fit=crop',
        colors: [{ name: 'Чёрный', hex: '#1a1a1a' }],
        sizes: ['M', 'L', 'XL'],
        desc: 'Мужская байкерская куртка из натуральной кожи ягнёнка. Асимметричная молния, подкладка из вискозы. Мягкая и лёгкая.',
        badge: 'Новинка'
    },
    {
        id: 12, brand: 'NŪRA', name: 'Кашемировый свитер', category: 'men',
        price: 89000, oldPrice: null,
        color: '#c0c5cb', colorName: 'Светло-серый',
        image: 'https://images.unsplash.com/photo-1614975059251-992f11792571?w=600&h=800&fit=crop',
        colors: [{ name: 'Светло-серый', hex: '#c0c5cb' }, { name: 'Тёмно-синий', hex: '#2c3e50' }, { name: 'Бежевый', hex: '#d4c4b0' }],
        sizes: ['S', 'M', 'L', 'XL'],
        desc: 'Свитер из 100% кашемира с круглым вырезом. Тонкая вязка, мягкая текстура. Базовая вещь для сезонного гардероба.',
        badge: null
    },
    // Accessories
    {
        id: 13, brand: 'NŪRA', name: 'Кожаная сумка тоут', category: 'accessories',
        price: 125000, oldPrice: null,
        color: '#5c4a3a', colorName: 'Коньяк',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop',
        colors: [{ name: 'Коньяк', hex: '#5c4a3a' }, { name: 'Чёрный', hex: '#1a1a1a' }],
        sizes: ['ONE'],
        desc: 'Вместительная сумка-тоут из натуральной кожи. Два внутренних кармана, магнитная застёжка. Подходит для ноутбука до 13".',
        badge: null
    },
    {
        id: 14, brand: 'NŪRA', name: 'Шёлковый платок', category: 'accessories',
        price: 34900, oldPrice: null,
        color: '#b8956a', colorName: 'Золотой',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop',
        colors: [{ name: 'Золотой', hex: '#b8956a' }, { name: 'Бордовый', hex: '#6b2d3e' }, { name: 'Синий', hex: '#2c3e50' }],
        sizes: ['ONE'],
        desc: 'Шёлковый платок с авторским принтом. Размер 90×90 см. Ручная обработка краёв. Подарочная упаковка в комплекте.',
        badge: 'Новинка'
    },
    {
        id: 15, brand: 'NŪRA', name: 'Ремень из итальянской кожи', category: 'accessories',
        price: 28500, oldPrice: null,
        color: '#1a1a1a', colorName: 'Чёрный',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop',
        colors: [{ name: 'Чёрный', hex: '#1a1a1a' }, { name: 'Коньяк', hex: '#5c4a3a' }],
        sizes: ['85', '90', '95', '100', '105'],
        desc: 'Классический ремень из итальянской кожи. Матовая пряжка из сплава, ширина 3 см. Универсальный аксессуар на каждый день.',
        badge: null
    },
    {
        id: 16, brand: 'NŪRA', name: 'Солнцезащитные очки авиатор', category: 'accessories',
        price: 56000, oldPrice: 68000,
        color: '#b8956a', colorName: 'Золотой',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop',
        colors: [{ name: 'Золотой', hex: '#b8956a' }, { name: 'Серебро', hex: '#c0c5cb' }],
        sizes: ['ONE'],
        desc: 'Солнцезащитные очки в оправе авиатор. Металлическая оправа, поляризованные линзы с UV400 защитой. Футляр и салфетка в комплекте.',
        badge: 'Sale'
    }
];

/* ===== CART ===== */
const Cart = {
    items: JSON.parse(localStorage.getItem('nura_cart') || '[]'),

    save() {
        localStorage.setItem('nura_cart', JSON.stringify(this.items));
        this.updateUI();
    },

    add(productId, size, color) {
        const existing = this.items.find(i => i.id === productId && i.size === size && i.color === color);
        if (existing) {
            existing.qty++;
        } else {
            this.items.push({ id: productId, size, color, qty: 1 });
        }
        this.save();
    },

    remove(index) {
        this.items.splice(index, 1);
        this.save();
    },

    updateQty(index, delta) {
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

/* ===== FORMAT PRICE ===== */
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸';
}

/* ===== STATE ===== */
let activeFilter = 'all';
let activeSort = 'default';

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
        : PRODUCTS.filter(p => p.category === activeFilter);

    // Sort
    if (activeSort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (activeSort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (activeSort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    grid.innerHTML = filtered.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-card__img">
                <div class="product-card__img-inner" style="background: linear-gradient(135deg, ${p.color}40 0%, ${p.color}80 100%)">
                    ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" width="600" height="800">` : ''}
                </div>
                ${p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ''}
                <div class="product-card__quick">Быстрый просмотр</div>
            </div>
            <div class="product-card__brand">${p.brand}</div>
            <div class="product-card__name">${p.name}</div>
            <div class="product-card__price">
                ${formatPrice(p.price)}
                ${p.oldPrice ? `<span class="product-card__price--old">${formatPrice(p.oldPrice)}</span>` : ''}
            </div>
        </div>`).join('');

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
        <div class="qv__img" style="background: linear-gradient(135deg, ${p.color}40 0%, ${p.color}80 100%)">
            ${p.image ? `<img src="${p.image}" alt="${p.name}" width="600" height="800" style="width:100%;height:100%;object-fit:cover">` : ''}
        </div>
        <div class="qv__info">
            <div class="qv__brand">${p.brand}</div>
            <h2 class="qv__name">${p.name}</h2>
            <div class="qv__price">
                ${formatPrice(p.price)}
                ${p.oldPrice ? `<span class="product-card__price--old">${formatPrice(p.oldPrice)}</span>` : ''}
            </div>
            <p class="qv__desc">${p.desc}</p>
            ${p.colors.length > 1 ? `
            <div class="qv__options">
                <div class="qv__label">Цвет: <span id="qvColorName">${p.colors[0].name}</span></div>
                <div class="qv__colors">
                    ${p.colors.map((c, i) => `
                        <button class="qv__color ${i === 0 ? 'active' : ''}" data-color="${c.name}"
                                style="background: ${c.hex}" title="${c.name}"></button>
                    `).join('')}
                </div>
            </div>` : ''}
            <div class="qv__options">
                <div class="qv__label">${p.sizes[0] === 'ONE' ? 'Размер: Универсальный' : 'Размер'}</div>
                ${p.sizes[0] !== 'ONE' ? `
                <div class="qv__sizes">
                    ${p.sizes.map(s => `<button class="qv__size" data-size="${s}">${s}</button>`).join('')}
                </div>` : ''}
            </div>
            <div class="qv__error" id="qvError">Выберите размер</div>
            <button class="btn btn--primary btn--full" id="qvAddToCart" data-id="${p.id}">
                Добавить в корзину — ${formatPrice(p.price)}
            </button>
        </div>
    </div>`;

    // Color selection
    body.querySelectorAll('.qv__color').forEach(btn => {
        btn.addEventListener('click', () => {
            body.querySelectorAll('.qv__color').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const nameEl = document.getElementById('qvColorName');
            if (nameEl) nameEl.textContent = btn.dataset.color;
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

    // Add to cart
    document.getElementById('qvAddToCart').addEventListener('click', () => {
        const sizeBtn = body.querySelector('.qv__size.active');
        const isOneSize = p.sizes[0] === 'ONE';
        if (!isOneSize && !sizeBtn) {
            document.getElementById('qvError').style.display = 'block';
            return;
        }
        const size = isOneSize ? 'ONE' : sizeBtn.dataset.size;
        const colorBtn = body.querySelector('.qv__color.active');
        const color = colorBtn ? colorBtn.dataset.color : p.colorName;
        Cart.add(p.id, size, color);
        closeModal('quickViewModal');
        openCart();
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
            <div class="cart-item__img" style="background: linear-gradient(135deg, ${p.color}40, ${p.color}80)">
                ${p.image ? `<img src="${p.image}" alt="${p.name}" width="80" height="100" style="width:100%;height:100%;object-fit:cover">` : ''}
            </div>
            <div class="cart-item__info">
                <div class="cart-item__brand">${p.brand}</div>
                <div class="cart-item__name">${p.name}</div>
                <div class="cart-item__meta">${item.size !== 'ONE' ? `Размер: ${item.size}` : 'Универсальный'}${item.color ? ` · ${item.color}` : ''}</div>
                <div class="cart-item__bottom">
                    <div class="cart-item__qty">
                        <button onclick="Cart.updateQty(${i}, -1); renderCart()">−</button>
                        <span>${item.qty}</span>
                        <button onclick="Cart.updateQty(${i}, 1); renderCart()">+</button>
                    </div>
                    <div class="cart-item__price">${formatPrice(p.price * item.qty)}</div>
                </div>
                <span class="cart-item__remove" onclick="Cart.remove(${i}); renderCart()">Удалить</span>
            </div>
        </div>`;
    }).join('');

    const total = Cart.getTotal();
    const deliveryFree = total >= 50000;
    const deliveryFee = deliveryFree ? 0 : 2500;

    document.getElementById('cartSubtotal').textContent = formatPrice(total);
    document.getElementById('cartDelivery').textContent = deliveryFree ? 'Бесплатно' : formatPrice(deliveryFee);
    document.getElementById('cartTotal').textContent = formatPrice(total + deliveryFee);
}

/* ===== CHECKOUT ===== */
let checkoutStep = 1;
let selectedPayment = '';

function openCheckout() {
    closeCart();
    checkoutStep = 1;
    selectedPayment = '';
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
        <div class="checkout__steps">
            <div class="checkout__step-dot ${checkoutStep >= 1 ? 'active' : ''} ${checkoutStep > 1 ? 'done' : ''}"></div>
            <div class="checkout__step-dot ${checkoutStep >= 2 ? 'active' : ''} ${checkoutStep > 2 ? 'done' : ''}"></div>
            <div class="checkout__step-dot ${checkoutStep >= 3 ? 'active' : ''}"></div>
        </div>`;

    if (checkoutStep === 1) {
        el.innerHTML = `
            ${stepsHTML}
            <h3 class="checkout__title">Доставка</h3>
            <p style="font-size:13px;color:var(--gray);margin-bottom:24px">Заполните данные для доставки заказа</p>
            <form id="deliveryForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Имя *</label>
                        <input type="text" id="fName" placeholder="Введите имя" required>
                    </div>
                    <div class="form-group">
                        <label>Фамилия *</label>
                        <input type="text" id="fSurname" placeholder="Введите фамилию" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Телефон *</label>
                    <input type="tel" id="fPhone" placeholder="+7 (___) ___-__-__" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="fEmail" placeholder="email@example.com">
                </div>
                <div class="form-group">
                    <label>Город *</label>
                    <select id="fCity" required>
                        <option value="">Выберите город</option>
                        <option value="almaty">Алматы</option>
                        <option value="astana">Астана</option>
                        <option value="shymkent">Шымкент</option>
                        <option value="karaganda">Караганда</option>
                        <option value="aktobe">Актобе</option>
                        <option value="other">Другой город</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Адрес доставки *</label>
                    <input type="text" id="fAddress" placeholder="Улица, дом, квартира" required>
                </div>
                <button type="submit" class="btn btn--primary btn--full" style="margin-top:8px">Далее — оплата</button>
            </form>`;

        document.getElementById('deliveryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const fields = ['fName', 'fSurname', 'fPhone', 'fCity', 'fAddress'];
            let valid = true;
            fields.forEach(id => {
                const input = document.getElementById(id);
                if (!input.value.trim()) {
                    input.classList.add('error');
                    valid = false;
                } else {
                    input.classList.remove('error');
                }
            });
            if (valid) { checkoutStep = 2; renderCheckout(); }
        });

    } else if (checkoutStep === 2) {
        el.innerHTML = `
            ${stepsHTML}
            <h3 class="checkout__title">Оплата</h3>
            <p style="font-size:13px;color:var(--gray);margin-bottom:24px">Итого к оплате: <strong>${formatPrice(finalTotal)}</strong></p>
            <div class="payment-methods" id="paymentMethods">
                <div class="payment-method" data-method="kaspi">
                    <div class="payment-method__radio"></div>
                    <div class="payment-method__icon" style="color:#f14635;border-color:#f14635;font-size:9px;font-weight:800">KASPI</div>
                    <div class="payment-method__info">
                        <div class="payment-method__name">Kaspi Pay</div>
                        <div class="payment-method__desc">Оплата через приложение Kaspi.kz</div>
                    </div>
                </div>
                <div class="payment-method" data-method="halyk">
                    <div class="payment-method__radio"></div>
                    <div class="payment-method__icon" style="color:#00a650;border-color:#00a650;font-size:9px;font-weight:800">HALYK</div>
                    <div class="payment-method__info">
                        <div class="payment-method__name">Halyk Bank</div>
                        <div class="payment-method__desc">Оплата через Homebank или epay.kkb.kz</div>
                    </div>
                </div>
                <div class="payment-method" data-method="card">
                    <div class="payment-method__radio"></div>
                    <div class="payment-method__icon" style="font-size:8px">VISA<br>MC</div>
                    <div class="payment-method__info">
                        <div class="payment-method__name">Банковская карта</div>
                        <div class="payment-method__desc">Visa, Mastercard любого банка</div>
                    </div>
                </div>
            </div>
            <div id="cardFormContainer"></div>
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
                document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
                method.classList.add('active');
                selectedPayment = method.dataset.method;
                payBtn.disabled = false;

                const cardContainer = document.getElementById('cardFormContainer');
                if (selectedPayment === 'card') {
                    cardContainer.innerHTML = `
                        <div class="card-form">
                            <div class="form-group">
                                <label>Номер карты</label>
                                <input type="text" placeholder="0000 0000 0000 0000" maxlength="19" id="cardNumber">
                            </div>
                            <div class="card-form .form-row-3" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
                                <div class="form-group">
                                    <label>Месяц</label>
                                    <input type="text" placeholder="MM" maxlength="2" id="cardMonth">
                                </div>
                                <div class="form-group">
                                    <label>Год</label>
                                    <input type="text" placeholder="ГГ" maxlength="2" id="cardYear">
                                </div>
                                <div class="form-group">
                                    <label>CVV</label>
                                    <input type="password" placeholder="•••" maxlength="3" id="cardCvv">
                                </div>
                            </div>
                            <p style="font-size:11px;color:var(--gray);margin-top:8px">🔒 Данные карты защищены SSL-шифрованием</p>
                        </div>`;

                    // Format card number
                    document.getElementById('cardNumber').addEventListener('input', (e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
                        e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
                    });
                } else {
                    cardContainer.innerHTML = '';
                }
            });
        });

        payBtn.addEventListener('click', () => {
            checkoutStep = 3; renderCheckout();
        });

    } else if (checkoutStep === 3) {
        const orderNum = 'NR-' + Date.now().toString().slice(-6);
        Cart.clear();

        el.innerHTML = `
            ${stepsHTML}
            <div class="order-success">
                <div class="order-success__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3>Заказ оформлен!</h3>
                <p>Спасибо за покупку. Мы свяжемся с вами для подтверждения.</p>
                <div class="order-success__number">Заказ ${orderNum}</div>
                <p style="font-size:13px">Способ оплаты: <strong>${
                    selectedPayment === 'kaspi' ? 'Kaspi Pay' :
                    selectedPayment === 'halyk' ? 'Halyk Bank' : 'Банковская карта'
                }</strong></p>
                <button class="btn btn--primary" onclick="closeModal('checkoutModal')" style="margin-top:24px">Продолжить покупки</button>
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

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            activeFilter = tab.dataset.filter;
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
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

    // Product card click → quick view
    document.getElementById('productsGrid')?.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (card) openQuickView(parseInt(card.dataset.id, 10));
    });

    // Cart
    document.getElementById('cartBtn')?.addEventListener('click', openCart);
    document.getElementById('cartClose')?.addEventListener('click', closeCart);
    document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
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
                <div class="search-result__img" style="background: linear-gradient(135deg, ${p.color}40, ${p.color}80); overflow:hidden">
                    ${p.image ? `<img src="${p.image}" alt="${p.name}" width="56" height="56" style="width:100%;height:100%;object-fit:cover">` : ''}
                </div>
                <div class="search-result__info">
                    <div class="search-result__brand">${p.brand}</div>
                    <div class="search-result__name">${p.name}</div>
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
        nav.classList.toggle('active');
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

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            closeModal('quickViewModal');
            closeModal('checkoutModal');
            searchOverlay?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
