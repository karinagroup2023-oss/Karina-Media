/* ===== PRODUCT DATA ===== */
const PRODUCTS = [
    {
        id: 1,
        brand: 'LODELLA',
        name: 'Tone Up Moisture BB Cream SPF50+ PA++++',
        category: 'face',
        image: 'assets/products/Screenshot_20250905-100712_Instagram.jpg',
        desc: 'BB-крем с высоким уровнем защиты SPF50+ PA++++. Увлажняющая текстура, естественное покрытие без эффекта маски. Защита от УФ, осветление и уход против морщин — всё в одном.',
        tags: ['SPF50+', 'Увлажнение', 'Тон', 'Anti-age']
    },
    {
        id: 2,
        brand: 'LODELLA',
        name: 'Deep Skin Transfer Cream',
        category: 'face',
        image: 'assets/products/Screenshot_20250905-100420_Instagram.jpg',
        desc: 'Многофункциональный крем для лица и тела с селагинеллой, мёдом манука, облепихой и пептидным комплексом. Защита, восстановление, выравнивание тона и естественное сияние.',
        tags: ['Пептиды', 'Манука', 'Облепиха', 'Anti-age']
    },
    {
        id: 3,
        brand: 'LODELLA',
        name: 'Deep Skin Transfer Essence Booster',
        category: 'face',
        image: 'assets/products/Screenshot_20250905-100850_Instagram.jpg',
        desc: 'Коллагеновый бустер с плотной гелевой текстурой — «жидкий ботокс». 12 видов пептидов и 17 аминокислот. Мягкое отшелушивание, укрепление кожного барьера и выраженный антивозрастной эффект.',
        tags: ['Коллаген', 'Пептиды', '«Жидкий ботокс»', '120 мл']
    },
    {
        id: 4,
        brand: 'GUNMISU',
        name: 'Inderma Protect Sun Serum SPF50+ PA++++',
        category: 'face',
        image: 'assets/products/Screenshot_20250905-100338_Instagram.jpg',
        desc: 'Лёгкая SPF-сыворотка для комбинированной, жирной и чувствительной кожи. Быстро впитывается, не оставляет белых пятен. Осветляющий и антивозрастной эффект.',
        tags: ['SPF50+', 'Сыворотка', 'Без белых пятен', 'Все сезоны']
    },
    {
        id: 5,
        brand: 'GUNMISU',
        name: 'Inderma Perfect Solution Mask Pack',
        category: 'face',
        image: 'assets/products/Screenshot_20250905-100320_Instagram.jpg',
        desc: 'Чёрная маска с золотым углём. 35 г натуральных ингредиентов: пептиды, глутатион, экстракт лакрицы, гриб мацутаке, мёд манука, зелёный чай. Уменьшение морщин и осветление тона.',
        tags: ['Маска', 'Пептиды', 'Глутатион', 'Детокс']
    },
    {
        id: 6,
        brand: 'GUNMISU V STORY',
        name: 'Miracle X-Homme Fire 7.0',
        category: 'intimate',
        image: 'assets/products/Screenshot_20250905-100752_Instagram.jpg',
        desc: 'Мужской гель для интимной гигиены. Поддержка оптимальной температуры, улучшение кровообращения, антибактериальное и дезодорирующее действие. Комфорт и свежесть каждый день.',
        tags: ['Мужской', 'Гигиена', 'Антибактериальный', 'Свежесть']
    },
    {
        id: 7,
        brand: 'GUNMISU V STORY',
        name: 'Miracle X-Serum',
        category: 'intimate',
        image: 'assets/products/Screenshot_20250905-100344_Instagram.jpg',
        desc: 'Женская сыворотка для Y-зоны. Восстановление, увлажнение и поддержание здоровой микрофлоры. Вдохните новую жизнь для интимного здоровья.',
        tags: ['Женский', 'Сыворотка', 'Y-зона', 'Уход']
    },
    {
        id: 8,
        brand: 'GUNMISU V STORY',
        name: 'Miracle X-Light',
        category: 'intimate',
        image: 'assets/products/Screenshot_20250905-100803_Instagram.jpg',
        desc: 'Средство для интимного ухода линейки V Story. Confidence in health care — забота и уверенность каждый день.',
        tags: ['Интимный уход', 'V Story', 'Здоровье', 'Комфорт']
    },
    {
        id: 9,
        brand: 'GUNMISU',
        name: '매일비움 PLUS (Горошек)',
        category: 'health',
        image: 'assets/products/Screenshot_20250905-100431_Instagram.jpg',
        desc: 'Натуральный помощник для здоровья и лёгкости. Снижение холестерина, уменьшение жировых отложений, очищение кишечника. В составе: шелуха подорожника, чернослив, гарциния камбоджийская.',
        tags: ['БАД', 'Похудение', 'Очищение', 'Натуральный']
    },
    {
        id: 10,
        brand: 'GUNMISU',
        name: '당케어 올인원 유산균 (Пробиотик)',
        category: 'health',
        image: 'assets/products/Screenshot_20250905-100442_Instagram.jpg',
        desc: 'Пробиотик с экстрактом листьев Banaba для контроля сахара в крови. Улучшение пищеварения, рост полезных бактерий, подавление вредной микрофлоры. Обогащён цинком, коллагеном и поливитаминами.',
        tags: ['Пробиотик', 'Контроль сахара', 'Пищеварение', 'Витамины']
    }
];

/* ===== CATEGORY MAP ===== */
const CATEGORIES = {
    all: 'Все товары',
    face: 'Уход за лицом',
    intimate: 'Интимная гигиена',
    health: 'Здоровье и БАДы'
};

/* ===== STATE ===== */
let activeCategory = 'all';

/* ===== SINGLE INTERSECTION OBSERVER (reused) ===== */
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

function observeElements() {
    document.querySelectorAll('.product-card, .category-card, .advantage').forEach(el => {
        if (el.style.opacity === '1') return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        scrollObserver.observe(el);
    });
}

/* ===== RENDER PRODUCTS ===== */
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    const count = document.getElementById('productsCount');
    if (!grid || !count) return;

    grid.innerHTML = products.map(p => `
        <div class="product-card" data-id="${p.id}" data-category="${p.category}">
            <div class="product-card__img">
                <img src="${p.image}" alt="${p.brand} ${p.name}" loading="lazy" width="400" height="400">
                <span class="product-card__badge">${p.brand}</span>
            </div>
            <div class="product-card__info">
                <span class="product-card__brand">${p.brand}</span>
                <h3 class="product-card__name">${p.name}</h3>
                <p class="product-card__desc">${p.desc}</p>
                <div class="product-card__tags">
                    ${p.tags.map(t => `<span class="product-tag">${t}</span>`).join('')}
                </div>
                <a href="https://wa.me/77472694342?text=${encodeURIComponent(`Здравствуйте! Хочу узнать подробнее о товаре: ${p.brand} ${p.name}`)}"
                   class="btn btn--primary btn--full" target="_blank" rel="noopener">
                    Узнать цену
                </a>
            </div>
        </div>`).join('');

    count.textContent = `Показано ${products.length} из ${PRODUCTS.length} товаров`;
    observeElements();
}

/* ===== FILTERS ===== */
function filterProducts(category) {
    activeCategory = category;
    const filtered = category === 'all'
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === category);
    renderProducts(filtered);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });
}

/* ===== QUICK VIEW MODAL ===== */
function openQuickView(productId) {
    const p = PRODUCTS.find(pr => pr.id === productId);
    if (!p) return;

    const modal = document.getElementById('quickViewModal');
    const body = document.getElementById('modalBody');

    body.innerHTML = `
    <div class="modal-product">
        <div class="modal-product__img">
            <img src="${p.image}" alt="${p.brand} ${p.name}" width="400" height="400">
        </div>
        <div class="modal-product__info">
            <h2>${p.brand}</h2>
            <h3>${p.name}</h3>
            <p class="modal-product__desc">${p.desc}</p>
            <div class="modal-product__tags">
                ${p.tags.map(t => `<span class="modal-product__tag">${t}</span>`).join('')}
            </div>
            <div class="modal-product__price-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                Цена уточняется по запросу
            </div>
            <a href="https://wa.me/77472694342?text=${encodeURIComponent(`Здравствуйте! Хочу узнать цену и подробности: ${p.brand} ${p.name}`)}"
               class="btn btn--primary btn--full modal-product__cta" target="_blank" rel="noopener">
                Написать в WhatsApp
            </a>
        </div>
    </div>`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus the close button for keyboard accessibility
    const closeBtn = document.getElementById('modalClose');
    if (closeBtn) closeBtn.focus();
}

/* ===== CLOSE MODAL HELPER ===== */
function closeModal() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeSearch() {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    // Clear stale search state
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    const suggestions = document.getElementById('searchSuggestions');
    if (input) input.value = '';
    if (results) results.innerHTML = '';
    if (suggestions) suggestions.style.display = '';
}

/* ===== INIT (all DOM-dependent code) ===== */
document.addEventListener('DOMContentLoaded', () => {

    /* ===== SEARCH ===== */
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchSuggestions = document.getElementById('searchSuggestions');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const q = searchInput.value.toLowerCase().trim();
            if (q.length < 2) {
                searchResults.innerHTML = '';
                if (searchSuggestions) searchSuggestions.style.display = '';
                return;
            }

            if (searchSuggestions) searchSuggestions.style.display = 'none';

            const results = PRODUCTS.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.desc.toLowerCase().includes(q) ||
                p.tags.some(t => t.toLowerCase().includes(q))
            );

            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-no-results">Ничего не найдено. Попробуйте другой запрос.</div>';
                return;
            }

            searchResults.innerHTML = results.map(p => `
            <div class="search-result-item" data-id="${p.id}">
                <div class="search-result-item__img">
                    <img src="${p.image}" alt="${p.name}" width="48" height="48">
                </div>
                <div class="search-result-item__info">
                    <span class="search-result-item__brand">${p.brand}</span>
                    <div class="search-result-item__name">${p.name}</div>
                </div>
            </div>`).join('');

            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const id = parseInt(item.dataset.id, 10);
                    closeSearch();
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                    if (searchSuggestions) searchSuggestions.style.display = '';
                    openQuickView(id);
                });
            });
        });
    }

    // Search tags
    document.querySelectorAll('.tag[data-query]').forEach(tag => {
        tag.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = tag.dataset.query;
                searchInput.dispatchEvent(new Event('input'));
            }
        });
    });

    /* ===== BURGER MENU ===== */
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('active');
            burger.classList.toggle('active');
            burger.setAttribute('aria-expanded', isOpen);
        });

        document.addEventListener('click', e => {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !burger.contains(e.target)) {
                nav.classList.remove('active');
                burger.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ===== SEARCH OVERLAY ===== */
    const searchBtn = document.getElementById('searchBtn');
    const searchClose = document.getElementById('searchClose');
    const searchOverlay = document.getElementById('searchOverlay');

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => searchInput?.focus(), 300);
        });
    }

    if (searchClose && searchOverlay) {
        searchClose.addEventListener('click', closeSearch);
    }

    /* ===== MODAL ===== */
    const modalClose = document.getElementById('modalClose');
    const quickViewModal = document.getElementById('quickViewModal');

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (quickViewModal) {
        quickViewModal.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeModal();
        });
    }

    /* ===== ESCAPE KEY ===== */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearch();
            closeModal();
        }
    });

    /* ===== HEADER SCROLL (with rAF throttle) ===== */
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const header = document.querySelector('.header');
                if (header) header.style.boxShadow = window.scrollY > 80 ? '0 2px 20px rgba(0,0,0,0.08)' : 'none';
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    /* ===== SMOOTH SCROLL ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                return;
            }
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                if (nav) {
                    nav.classList.remove('active');
                    burger?.classList.remove('active');
                }
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ===== FILTER BUTTONS ===== */
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterProducts(btn.dataset.filter);
        });
    });

    // Product card click → open quick view
    document.getElementById('productsGrid')?.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;
        if (e.target.closest('.btn')) return;
        openQuickView(parseInt(card.dataset.id, 10));
    });

    /* ===== FAQ ACCORDION ===== */
    document.querySelectorAll('.faq-item__header').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const body = item.querySelector('.faq-item__body');
            const isOpen = item.classList.contains('open');

            // Close all others
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('open');
                    openItem.querySelector('.faq-item__body').style.maxHeight = null;
                    openItem.querySelector('.faq-item__header').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current
            if (isOpen) {
                item.classList.remove('open');
                body.style.maxHeight = null;
                btn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('open');
                body.style.maxHeight = body.scrollHeight + 20 + 'px';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Init
    renderProducts(PRODUCTS);
});
