/* ===== SHARED PRODUCT DATA — Single Source of Truth ===== */
/* This file is imported by index.html, account.html, and admin.html */

const PRODUCTS = [
    // Women
    {
        id: 1, brand: 'NŪRA', name: 'Шёлковое платье-макси', category: 'women',
        price: 89900, oldPrice: null,
        color: '#c0392b', colorName: 'Красный',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
        colors: [
            { name: 'Красный', hex: '#c0392b', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop' },
            { name: 'Чёрный', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop' }
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        desc: 'Элегантное платье-макси из натурального шёлка. Струящийся силуэт, летящая юбка. Идеально для вечернего выхода или особого случая.',
        badge: 'Новинка',
        imageHover: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop'
    },
    {
        id: 2, brand: 'NŪRA', name: 'Кашемировое пальто оверсайз', category: 'women',
        price: 245000, oldPrice: 289000,
        color: '#d4c4b0', colorName: 'Бежевый',
        image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=800&fit=crop',
        colors: [
            { name: 'Бежевый', hex: '#d4c4b0', image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=800&fit=crop' },
            { name: 'Серый', hex: '#c0c5cb', image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&h=800&fit=crop' },
            { name: 'Чёрный', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        desc: 'Роскошное пальто из итальянского кашемира. Свободный крой оверсайз, пояс в комплекте. Классическая длина до колена.',
        badge: 'Sale',
        imageHover: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&h=800&fit=crop'
    },
    {
        id: 3, brand: 'NŪRA', name: 'Блуза из органзы', category: 'women',
        price: 54900, oldPrice: null,
        color: '#f5f5f5', colorName: 'Белый',
        image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop',
        colors: [
            { name: 'Белый', hex: '#f5f5f5', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop' },
            { name: 'Пудра', hex: '#e8c4c4', image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&h=800&fit=crop' }
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        desc: 'Воздушная блуза из органзы с объёмными рукавами. Нежная текстура и романтичный силуэт. Подойдёт для офиса и особых мероприятий.',
        badge: null,
        imageHover: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&h=800&fit=crop'
    },
    {
        id: 4, brand: 'NŪRA', name: 'Брюки палаццо шерсть', category: 'women',
        price: 67000, oldPrice: null,
        color: '#2c2c2c', colorName: 'Графит',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
        colors: [
            { name: 'Графит', hex: '#2c2c2c', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop' },
            { name: 'Бежевый', hex: '#d4c4b0', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop' }
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        desc: 'Широкие брюки палаццо из костюмной шерсти. Высокая посадка, стрелки, подкладка. Универсальная модель для делового и повседневного гардероба.',
        badge: null,
        imageHover: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop'
    },
    {
        id: 5, brand: 'NŪRA', name: 'Кожаная юбка-миди', category: 'women',
        price: 78500, oldPrice: null,
        color: '#1a1a1a', colorName: 'Чёрный',
        image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop',
        colors: [
            { name: 'Чёрный', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop' },
            { name: 'Шоколад', hex: '#3d2b1f', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&h=800&fit=crop' }
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        desc: 'Юбка-миди из мягкой натуральной кожи. А-силуэт, потайная молния, подкладка из вискозы. Актуальная длина ниже колена.',
        badge: 'Новинка',
        imageHover: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&h=800&fit=crop'
    },
    {
        id: 6, brand: 'NŪRA', name: 'Трикотажный костюм', category: 'women',
        price: 112000, oldPrice: 134000,
        color: '#f5f0eb', colorName: 'Белый',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
        colors: [
            { name: 'Белый', hex: '#f5f0eb', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop' },
            { name: 'Серый', hex: '#a0a0a0', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&h=800&fit=crop' }
        ],
        sizes: ['S', 'M', 'L'],
        desc: 'Костюм из мериносовой шерсти: свитер свободного кроя + брюки с эластичным поясом. Мягкая текстура, идеальная посадка.',
        badge: 'Sale',
        imageHover: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&h=800&fit=crop'
    },
    // Men
    {
        id: 7, brand: 'NŪRA', name: 'Костюм-тройка шерсть', category: 'men',
        price: 289000, oldPrice: null,
        color: '#2c3e50', colorName: 'Тёмно-синий',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop',
        colors: [
            { name: 'Тёмно-синий', hex: '#2c3e50', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop' },
            { name: 'Графит', hex: '#2c2c2c', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop' }
        ],
        sizes: ['46', '48', '50', '52', '54'],
        desc: 'Классический костюм-тройка из итальянской шерсти Super 120\'s. Пиджак, жилет и брюки. Полуприлегающий силуэт, ручная обработка краёв.',
        badge: 'Премиум',
        imageHover: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop'
    },
    {
        id: 8, brand: 'NŪRA', name: 'Рубашка Oxford хлопок', category: 'men',
        price: 42900, oldPrice: null,
        color: '#f5f5f5', colorName: 'Белый',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
        colors: [
            { name: 'Белый', hex: '#f5f5f5', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop' },
            { name: 'Голубой', hex: '#b8d4e3', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop' },
            { name: 'Розовый', hex: '#e8c4c4', image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=600&h=800&fit=crop' }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        desc: 'Классическая рубашка Oxford из египетского хлопка. Воротник button-down, стандартный крой. Идеальна с костюмом и с джинсами.',
        badge: null,
        imageHover: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop'
    },
    {
        id: 9, brand: 'NŪRA', name: 'Пальто oversize шерсть', category: 'men',
        price: 198000, oldPrice: 235000,
        color: '#5c4a3a', colorName: 'Коричневый',
        image: 'https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=600&h=800&fit=crop',
        colors: [
            { name: 'Коричневый', hex: '#5c4a3a', image: 'https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=600&h=800&fit=crop' },
            { name: 'Чёрный', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop' }
        ],
        sizes: ['M', 'L', 'XL', 'XXL'],
        desc: 'Мужское пальто оверсайз из итальянской шерсти. Двубортная застёжка, два кармана. Длина до середины бедра.',
        badge: 'Sale',
        imageHover: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop'
    },
    {
        id: 10, brand: 'NŪRA', name: 'Брюки чинос хлопок', category: 'men',
        price: 45900, oldPrice: null,
        color: '#c9b99a', colorName: 'Бежевый',
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
        colors: [
            { name: 'Бежевый', hex: '#c9b99a', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop' },
            { name: 'Тёмно-синий', hex: '#2c3e50', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop' },
            { name: 'Чёрный', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop' }
        ],
        sizes: ['46', '48', '50', '52', '54'],
        desc: 'Классические чинос из хлопка с эластаном. Зауженный крой, средняя посадка. Комфорт на каждый день.',
        badge: null,
        imageHover: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop'
    },
    {
        id: 11, brand: 'NŪRA', name: 'Кожаная куртка байкер', category: 'men',
        price: 175000, oldPrice: null,
        color: '#1a1a1a', colorName: 'Чёрный',
        image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600&h=800&fit=crop',
        colors: [
            { name: 'Чёрный', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600&h=800&fit=crop' }
        ],
        sizes: ['M', 'L', 'XL'],
        desc: 'Мужская байкерская куртка из натуральной кожи ягнёнка. Асимметричная молния, подкладка из вискозы. Мягкая и лёгкая.',
        badge: 'Новинка',
        imageHover: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600&h=800&fit=crop'
    },
    {
        id: 12, brand: 'NŪRA', name: 'Кашемировый свитер', category: 'men',
        price: 89000, oldPrice: null,
        color: '#f5f5f5', colorName: 'Белый',
        image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=800&fit=crop',
        colors: [
            { name: 'Белый', hex: '#f5f5f5', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=800&fit=crop' },
            { name: 'Тёмно-синий', hex: '#2c3e50', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&h=800&fit=crop' },
            { name: 'Бежевый', hex: '#d4c4b0', image: 'https://images.unsplash.com/photo-1614975059251-992f11792571?w=600&h=800&fit=crop' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        desc: 'Свитер из 100% кашемира с круглым вырезом. Тонкая вязка, мягкая текстура. Базовая вещь для сезонного гардероба.',
        badge: null,
        imageHover: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&h=800&fit=crop'
    },
    // Accessories
    {
        id: 13, brand: 'NŪRA', name: 'Кожаная сумка тоут', category: 'accessories',
        price: 125000, oldPrice: null,
        color: '#5c4a3a', colorName: 'Коньяк',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop',
        colors: [
            { name: 'Коньяк', hex: '#5c4a3a', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop' },
            { name: 'Чёрный', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop' }
        ],
        sizes: ['ONE'],
        desc: 'Вместительная сумка-тоут из натуральной кожи. Два внутренних кармана, магнитная застёжка. Подходит для ноутбука до 13".',
        badge: null,
        imageHover: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop'
    },
    {
        id: 14, brand: 'NŪRA', name: 'Шёлковый платок', category: 'accessories',
        price: 34900, oldPrice: null,
        color: '#b8956a', colorName: 'Золотой',
        image: 'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?w=600&h=800&fit=crop',
        colors: [
            { name: 'Золотой', hex: '#b8956a', image: 'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?w=600&h=800&fit=crop' },
            { name: 'Бордовый', hex: '#6b2d3e', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop' },
            { name: 'Синий', hex: '#2c3e50', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=800&fit=crop' }
        ],
        sizes: ['ONE'],
        desc: 'Шёлковый платок с авторским принтом. Размер 90×90 см. Ручная обработка краёв. Подарочная упаковка в комплекте.',
        badge: 'Новинка',
        imageHover: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop'
    },
    {
        id: 15, brand: 'NŪRA', name: 'Ремень из итальянской кожи', category: 'accessories',
        price: 28500, oldPrice: null,
        color: '#1a1a1a', colorName: 'Чёрный',
        image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&h=800&fit=crop',
        colors: [
            { name: 'Чёрный', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&h=800&fit=crop' },
            { name: 'Коньяк', hex: '#5c4a3a', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop' }
        ],
        sizes: ['85', '90', '95', '100', '105'],
        desc: 'Классический ремень из итальянской кожи. Матовая пряжка из сплава, ширина 3 см. Универсальный аксессуар на каждый день.',
        badge: null,
        imageHover: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop'
    },
    {
        id: 16, brand: 'NŪRA', name: 'Солнцезащитные очки авиатор', category: 'accessories',
        price: 56000, oldPrice: 68000,
        color: '#b8956a', colorName: 'Золотой',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop',
        colors: [
            { name: 'Золотой', hex: '#b8956a', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop' },
            { name: 'Серебро', hex: '#c0c5cb', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&fit=crop' }
        ],
        sizes: ['ONE'],
        desc: 'Солнцезащитные очки в оправе авиатор. Металлическая оправа, поляризованные линзы с UV400 защитой. Футляр и салфетка в комплекте.',
        badge: 'Sale',
        imageHover: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&fit=crop'
    }
];
