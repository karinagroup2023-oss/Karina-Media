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
let currentLang = localStorage.getItem('glowseoul_lang') || 'ru';

/* ===== I18N TRANSLATIONS ===== */
const I18N = {
    kz: {
        // Nav
        'nav.catalog': 'Каталог',
        'nav.about': 'Біз туралы',
        'nav.brands': 'Брендтер',
        'nav.faq': 'FAQ',
        'nav.contact': 'Байланыс',
        // Hero
        'hero.badge': 'Қазақстандағы ресми өкіл',
        'hero.title': 'Денсаулық пен сұлулыққа арналған корей сапасы',
        'hero.text': 'GM Plant корей өндірушісінен GUNMISU және LODELLA брендтерінің түпнұсқа өнімдері. Косметика, гигиена құралдары және БАҚ Қазақстан бойынша жеткізумен.',
        'hero.cta': 'Каталогты қарау',
        'hero.consult': 'Кеңес алу',
        // Search
        'search.placeholder': 'Тауарлар, брендтер бойынша іздеу...',
        'search.popular': 'Танымал сұраулар',
        'search.tag.bb': 'BB крем',
        'search.tag.peptides': 'Пептидтер',
        'search.tag.spf': 'Күннен қорғау',
        'search.tag.mask': 'Маска',
        'search.tag.probiotic': 'Пробиотик',
        'search.tag.intimate': 'Интимді гигиена',
        // Categories
        'cat.title': 'Санаттар',
        'cat.sub': 'Денсаулық пен сұлулыққа арналған табиғи шешімдер',
        'cat.face.title': 'Бет күтімі',
        'cat.face.desc': 'BB-крем, кремдер, бустерлер, маскалар, SPF',
        'cat.face.count': '5 тауар',
        'cat.intimate.title': 'Интимді гигиена',
        'cat.intimate.desc': 'V Story ер мен әйел сериясы',
        'cat.intimate.count': '3 тауар',
        'cat.health.title': 'Денсаулық және БАҚ',
        'cat.health.desc': 'Пробиотиктер, детокс, салмақ бақылау',
        'cat.health.count': '2 тауар',
        // Filters
        'filter.all': 'Барлығы',
        'filter.face': 'Бет',
        'filter.intimate': 'Гигиена',
        'filter.health': 'Денсаулық',
        // About
        'about.badge': 'Компания туралы',
        'about.title': 'Кореядан табиғи шешімдер',
        'about.p1': 'Біз Қазақстандағы <strong>GM Plant Co., Ltd.</strong> корей компаниясының ресми өкіліміз. 10 жылдан астам уақыт бойы GM Plant GMP стандарты бойынша денсаулық пен сұлулыққа арналған инновациялық өнімдерді әзірлейді және шығарады.',
        'about.p2': '<strong>GUNMISU</strong> және <strong>LODELLA</strong> брендтері — функционалдық сусындар, БАҚ, тері күтіміне арналған косметика және озық корей технологияларын қолданған интимді гигиена құралдары.',
        'about.feat.years': 'жыл нарықта',
        'about.feat.gmp': 'өндіріс стандарты',
        'about.feat.original': 'түпнұсқа өнім',
        // Brands
        'brands.title': 'Біздің брендтер',
        'brand.gunmisu.desc': 'Функционалдық косметика, интимді гигиена құралдары, БАҚ және денсаулыққа арналған өнімдер. Ер мен әйелдерге арналған инновациялық формулалар.',
        'brand.lodella.desc': 'Трансферосомды технологиясы бар тері күтімінің премиум сериясы. Пептидтер мен табиғи компоненттері бар BB-кремдер, кремдер мен бустерлер.',
        'brand.site': 'Өндірушінің сайты →',
        // Advantages
        'adv.title': 'Неге бізді таңдайды',
        'adv.1.title': '100% түпнұсқа',
        'adv.1.desc': 'GM Plant өндірушісінен тікелей жеткізу, Оңтүстік Корея.',
        'adv.2.title': 'Бүкіл ҚР бойынша жеткізу',
        'adv.2.desc': 'Бүкіл Қазақстан бойынша жіберіледі. Егжей-тегжейін нақтылаңыз.',
        'adv.3.title': 'Жеке кеңес беру',
        'adv.3.desc': 'Сіздің қажеттіліктеріңізге сай өнім таңдауға көмектесеміз.',
        'adv.4.title': 'GMP стандарты',
        'adv.4.desc': 'Барлық өнім сертификатталған және GMP стандарты бойынша шығарылған.',
        // How to Order
        'order.title': 'Қалай тапсырыс беруге болады',
        'order.sub': 'Тапсырысыңызға дейін үш қарапайым қадам',
        'step.1.title': 'Тауарды таңдаңыз',
        'step.1.desc': 'Каталогты қараңыз, сипаттамаларды оқыңыз және сізге қолайлы өнімді таңдаңыз.',
        'step.2.title': 'WhatsApp-қа жазыңыз',
        'step.2.desc': '«Бағасын білу» түймесін басыңыз немесе бізге жазыңыз — егжей-тегжейі мен бағасын нақтылаймыз.',
        'step.3.title': 'Тапсырысты алыңыз',
        'step.3.desc': 'Ыңғайлы тәсілмен төлеңіз (Kaspi, аударым, қолма-қол) және Қазақстан бойынша жеткізуді алыңыз.',
        'step.cta': 'WhatsApp-қа жазу',
        // FAQ
        'faq.title': 'Жиі қойылатын сұрақтар',
        'faq.sub': 'Клиенттеріміздің ең танымал сұрақтарына жауаптар',
        'faq.q1': 'Бұл түпнұсқа өнім бе?',
        'faq.a1': 'Иә, біз Қазақстандағы GM Plant Co., Ltd. корей компаниясының ресми өкіліміз. Барлық өнім тікелей Оңтүстік Кореядағы зауыттан жеткізіледі. Әр тауардың түпнұсқа қаптамасы, таңбалануы және сертификаттауы бар. Сұрау бойынша түпнұсқалығын растайтын құжаттарды ұсынамыз.',
        'faq.q2': 'Жеткізу қалай жүзеге асырылады?',
        'faq.a2': 'Бүкіл Қазақстан бойынша жеткіземіз. Алматы бойынша — курьермен 1-2 күнде. Басқа қалаларға — көлік компаниялары арқылы, мерзімі 3-7 жұмыс күні. Жеткізу құны аймаққа байланысты жеке есептеледі. Егжей-тегжейін менеджерден нақтылаңыз.',
        'faq.q3': 'Қандай төлем тәсілдері бар?',
        'faq.a3': 'Kaspi аударымы, Kaspi QR, банктік аударым және қолма-қол ақшамен (тек Алматы бойынша) төлем қабылдаймыз. Алдын ала төлем немесе алғанда төлем — менеджермен келісіледі.',
        'faq.q4': 'Тауарды қайтаруға бола ма?',
        'faq.a4': 'Тауар ашылмаған және түпнұсқа қаптамасы сақталған жағдайда алған сәттен бастап 14 күн ішінде қайтару мүмкін. Ашылған косметикалық құралдар мен гигиена құралдары ҚР заңнамасына сәйкес ауыстыруға және қайтаруға жатпайды.',
        'faq.q5': 'Өнім сезімтал теріге жарай ма?',
        'faq.a5': 'GUNMISU және LODELLA құралдарының көпшілігі сезімтал теріні ескере отырып жасалған және табиғи компоненттерден тұрады. Дегенмен, алғаш қолданар алдында терінің шағын аумағында сынақтан өткізуді ұсынамыз. Біздің менеджер сіздің тері түріне қолайлы құралдарды таңдауға көмектеседі.',
        'faq.q6': 'Хабарламаларға қаншалықты тез жауап бересіздер?',
        'faq.a6': 'Жұмыс уақытында (9:00-ден 20:00-ге дейін, демалыссыз) 5-15 минут ішінде жауап беруге тырысамыз. Жұмыс уақытынан тыс жазсаңыз, келесі күні таңертең жауап береміз.',
        // Footer
        'footer.desc': 'Қазақстандағы GUNMISU және LODELLA корей брендтерінің ресми өкілі. Денсаулық пен сұлулыққа арналған табиғи шешімдер.',
        'footer.rights': 'Барлық құқықтар қорғалған.',
        'footer.privacy': 'Құпиялылық саясаты',
        'footer.col.catalog': 'Каталог',
        'footer.col.info': 'Ақпарат',
        'footer.col.contacts': 'Байланыс',
        'footer.link.face': 'Бет күтімі',
        'footer.link.intimate': 'Интимді гигиена',
        'footer.link.health': 'Денсаулық және БАҚ',
        'footer.link.about': 'Біз туралы',
        'footer.link.brands': 'Брендтер',
        'footer.link.gmplant': 'GM Plant (Корея)',
        // Sticky bar & modal
        'bar.call': 'Қоңырау шалу',
        'modal.related': 'Осымен бірге алады'
    }
};

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
                    ${currentLang === 'kz' ? 'Бағасын білу' : 'Узнать цену'}
                </a>
            </div>
        </div>`).join('');

    count.textContent = currentLang === 'kz'
        ? `${PRODUCTS.length} тауардан ${products.length} көрсетілген`
        : `Показано ${products.length} из ${PRODUCTS.length} товаров`;
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

    // Get related products (same category, excluding current, max 3)
    const related = PRODUCTS.filter(r => r.category === p.category && r.id !== p.id).slice(0, 3);
    const relatedHTML = related.length > 0 ? `
        <div class="modal-related">
            <h4 class="modal-related__title" data-i18n="modal.related">${currentLang === 'kz' ? 'Осымен бірге алады' : 'С этим товаром покупают'}</h4>
            <div class="modal-related__grid">
                ${related.map(r => `
                <div class="modal-related__item" data-id="${r.id}">
                    <img src="${r.image}" alt="${r.brand} ${r.name}" width="120" height="120">
                    <div class="modal-related__item-name">${r.name}</div>
                </div>`).join('')}
            </div>
        </div>` : '';

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
                ${currentLang === 'kz' ? 'Бағасы сұрау бойынша' : 'Цена уточняется по запросу'}
            </div>
            <a href="https://wa.me/77472694342?text=${encodeURIComponent(`Здравствуйте! Хочу узнать цену и подробности: ${p.brand} ${p.name}`)}"
               class="btn btn--primary btn--full modal-product__cta" target="_blank" rel="noopener">
                ${currentLang === 'kz' ? 'WhatsApp-қа жазу' : 'Написать в WhatsApp'}
            </a>
            ${relatedHTML}
        </div>
    </div>`;

    // Click on related product opens its modal
    body.querySelectorAll('.modal-related__item').forEach(item => {
        item.addEventListener('click', () => {
            openQuickView(parseInt(item.dataset.id, 10));
        });
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
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
                searchResults.innerHTML = `<div class="search-no-results">${currentLang === 'kz' ? 'Ештеңе табылмады. Басқа сұрау жазып көріңіз.' : 'Ничего не найдено. Попробуйте другой запрос.'}</div>`;
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

    /* ===== HEADER SCROLL + SCROLL-TOP (with rAF throttle) ===== */
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const y = window.scrollY;
                const header = document.querySelector('.header');
                if (header) header.style.boxShadow = y > 80 ? '0 2px 20px rgba(0,0,0,0.08)' : 'none';
                if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', y > 400);
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

    /* ===== SCROLL TO TOP ===== */
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ===== SCROLL-BASED VISIBILITY (header shadow, scroll-top, sticky bar) ===== */
    // Override the header scroll with combined handler
    /* (previous rAF scroll handler still works for header, add scroll-top visibility) */

    /* ===== LANGUAGE TOGGLE ===== */
    const langToggle = document.getElementById('langToggle');
    const ruTexts = {};
    const ruHtmlTexts = {};
    const ruPlaceholders = {};

    // Store original Russian texts
    document.querySelectorAll('[data-i18n]').forEach(el => {
        ruTexts[el.dataset.i18n] = el.textContent;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        ruHtmlTexts[el.dataset.i18nHtml] = el.innerHTML;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        ruPlaceholders[el.dataset.i18nPlaceholder] = el.placeholder;
    });

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('glowseoul_lang', lang);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (lang === 'kz' && I18N.kz[key]) {
                el.textContent = I18N.kz[key];
            } else if (lang === 'ru' && ruTexts[key]) {
                el.textContent = ruTexts[key];
            }
        });

        // Handle innerHTML translations (elements with <strong> etc.)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.dataset.i18nHtml;
            if (lang === 'kz' && I18N.kz[key]) {
                el.innerHTML = I18N.kz[key];
            } else if (lang === 'ru' && ruHtmlTexts[key]) {
                el.innerHTML = ruHtmlTexts[key];
            }
        });

        // Handle placeholder translations
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (lang === 'kz' && I18N.kz[key]) {
                el.placeholder = I18N.kz[key];
            } else if (lang === 'ru' && ruPlaceholders[key]) {
                el.placeholder = ruPlaceholders[key];
            }
        });

        // Update toggle visual
        if (langToggle) {
            const active = langToggle.querySelector('.lang-toggle__active');
            const alt = langToggle.querySelector('.lang-toggle__alt');
            if (active && alt) {
                active.textContent = lang.toUpperCase();
                alt.textContent = lang === 'ru' ? 'KZ' : 'RU';
            }
        }

        // Update html lang attribute
        document.documentElement.lang = lang === 'kz' ? 'kk' : 'ru';

        // Re-render products to update button text
        filterProducts(activeCategory);
    }

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            applyLanguage(currentLang === 'ru' ? 'kz' : 'ru');
        });
    }

    // Apply saved language on load
    if (currentLang === 'kz') {
        applyLanguage('kz');
    }

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
