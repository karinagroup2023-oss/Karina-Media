/* ===== SHARED PRODUCT DATA — Single Source of Truth ===== */
/* Фото подобраны под каждый товар (Unsplash). Цвета используют корректное фото товара. */

const PRODUCTS = [
    {
        "id": 1,
        "brand": "NŪRA",
        "name": "Шёлковое платье-макси",
        "category": "women",
        "price": 89900,
        "oldPrice": null,
        "color": "#c0392b",
        "colorName": "Красный",
        "image": "https://images.unsplash.com/photo-1755456785144-534e2d220ae8?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Красный",
                "hex": "#c0392b",
                "image": "https://images.unsplash.com/photo-1755456785144-534e2d220ae8?w=600&h=800&fit=crop"
            },
            {
                "name": "Чёрный",
                "hex": "#1a1a1a",
                "image": "https://images.unsplash.com/photo-1755456785144-534e2d220ae8?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "XS",
            "S",
            "M",
            "L"
        ],
        "desc": "Элегантное платье-макси из натурального шёлка. Струящийся силуэт, летящая юбка. Идеально для вечернего выхода или особого случая.",
        "badge": "Новинка",
        "imageHover": "https://images.unsplash.com/photo-1755456785144-534e2d220ae8?w=600&h=800&fit=crop"
    },
    {
        "id": 2,
        "brand": "NŪRA",
        "name": "Кашемировое пальто оверсайз",
        "category": "women",
        "price": 245000,
        "oldPrice": 289000,
        "color": "#d4c4b0",
        "colorName": "Бежевый",
        "image": "https://images.unsplash.com/photo-1618333453296-9e35280fd6b1?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Бежевый",
                "hex": "#d4c4b0",
                "image": "https://images.unsplash.com/photo-1618333453296-9e35280fd6b1?w=600&h=800&fit=crop"
            },
            {
                "name": "Серый",
                "hex": "#c0c5cb",
                "image": "https://images.unsplash.com/photo-1618333453296-9e35280fd6b1?w=600&h=800&fit=crop"
            },
            {
                "name": "Чёрный",
                "hex": "#1a1a1a",
                "image": "https://images.unsplash.com/photo-1618333453296-9e35280fd6b1?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "desc": "Роскошное пальто из итальянского кашемира. Свободный крой оверсайз, пояс в комплекте. Классическая длина до колена.",
        "badge": "Sale",
        "imageHover": "https://images.unsplash.com/photo-1618333453296-9e35280fd6b1?w=600&h=800&fit=crop"
    },
    {
        "id": 3,
        "brand": "NŪRA",
        "name": "Блуза из органзы",
        "category": "women",
        "price": 54900,
        "oldPrice": null,
        "color": "#f5f5f5",
        "colorName": "Белый",
        "image": "https://images.unsplash.com/photo-1600884350802-c6d0bf14dcc6?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Белый",
                "hex": "#f5f5f5",
                "image": "https://images.unsplash.com/photo-1600884350802-c6d0bf14dcc6?w=600&h=800&fit=crop"
            },
            {
                "name": "Пудра",
                "hex": "#e8c4c4",
                "image": "https://images.unsplash.com/photo-1600884350802-c6d0bf14dcc6?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "XS",
            "S",
            "M",
            "L"
        ],
        "desc": "Воздушная блуза из органзы с объёмными рукавами. Нежная текстура и романтичный силуэт. Подойдёт для офиса и особых мероприятий.",
        "badge": null,
        "imageHover": "https://images.unsplash.com/photo-1600884350802-c6d0bf14dcc6?w=600&h=800&fit=crop"
    },
    {
        "id": 4,
        "brand": "NŪRA",
        "name": "Брюки палаццо шерсть",
        "category": "women",
        "price": 67000,
        "oldPrice": null,
        "color": "#2c2c2c",
        "colorName": "Графит",
        "image": "https://images.unsplash.com/photo-1580651214613-f4692d6d138f?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Графит",
                "hex": "#2c2c2c",
                "image": "https://images.unsplash.com/photo-1580651214613-f4692d6d138f?w=600&h=800&fit=crop"
            },
            {
                "name": "Бежевый",
                "hex": "#d4c4b0",
                "image": "https://images.unsplash.com/photo-1580651214613-f4692d6d138f?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "XS",
            "S",
            "M",
            "L",
            "XL"
        ],
        "desc": "Широкие брюки палаццо из костюмной шерсти. Высокая посадка, стрелки, подкладка. Универсальная модель для делового и повседневного гардероба.",
        "badge": null,
        "imageHover": "https://images.unsplash.com/photo-1580651214613-f4692d6d138f?w=600&h=800&fit=crop"
    },
    {
        "id": 5,
        "brand": "NŪRA",
        "name": "Кожаная юбка-миди",
        "category": "women",
        "price": 78500,
        "oldPrice": null,
        "color": "#1a1a1a",
        "colorName": "Чёрный",
        "image": "https://images.unsplash.com/photo-1583278828941-7904abc0268f?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Чёрный",
                "hex": "#1a1a1a",
                "image": "https://images.unsplash.com/photo-1583278828941-7904abc0268f?w=600&h=800&fit=crop"
            },
            {
                "name": "Шоколад",
                "hex": "#3d2b1f",
                "image": "https://images.unsplash.com/photo-1583278828941-7904abc0268f?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "XS",
            "S",
            "M",
            "L"
        ],
        "desc": "Юбка-миди из мягкой натуральной кожи. А-силуэт, потайная молния, подкладка из вискозы. Актуальная длина ниже колена.",
        "badge": "Новинка",
        "imageHover": "https://images.unsplash.com/photo-1583278828941-7904abc0268f?w=600&h=800&fit=crop"
    },
    {
        "id": 6,
        "brand": "NŪRA",
        "name": "Трикотажный костюм",
        "category": "women",
        "price": 112000,
        "oldPrice": 134000,
        "color": "#f5f0eb",
        "colorName": "Белый",
        "image": "https://images.unsplash.com/photo-1759229874786-6d0cc75d95be?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Белый",
                "hex": "#f5f0eb",
                "image": "https://images.unsplash.com/photo-1759229874786-6d0cc75d95be?w=600&h=800&fit=crop"
            },
            {
                "name": "Серый",
                "hex": "#a0a0a0",
                "image": "https://images.unsplash.com/photo-1759229874786-6d0cc75d95be?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "S",
            "M",
            "L"
        ],
        "desc": "Костюм из мериносовой шерсти: свитер свободного кроя + брюки с эластичным поясом. Мягкая текстура, идеальная посадка.",
        "badge": "Sale",
        "imageHover": "https://images.unsplash.com/photo-1759229874786-6d0cc75d95be?w=600&h=800&fit=crop"
    },
    {
        "id": 7,
        "brand": "NŪRA",
        "name": "Костюм-тройка шерсть",
        "category": "men",
        "price": 289000,
        "oldPrice": null,
        "color": "#2c3e50",
        "colorName": "Тёмно-синий",
        "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Тёмно-синий",
                "hex": "#2c3e50",
                "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop"
            },
            {
                "name": "Графит",
                "hex": "#2c2c2c",
                "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "46",
            "48",
            "50",
            "52",
            "54"
        ],
        "desc": "Классический костюм-тройка из итальянской шерсти Super 120's. Пиджак, жилет и брюки. Полуприлегающий силуэт, ручная обработка краёв.",
        "badge": "Премиум",
        "imageHover": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop"
    },
    {
        "id": 8,
        "brand": "NŪRA",
        "name": "Рубашка Oxford хлопок",
        "category": "men",
        "price": 42900,
        "oldPrice": null,
        "color": "#f5f5f5",
        "colorName": "Белый",
        "image": "https://images.unsplash.com/photo-1612541122840-bf7071c968a2?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Белый",
                "hex": "#f5f5f5",
                "image": "https://images.unsplash.com/photo-1612541122840-bf7071c968a2?w=600&h=800&fit=crop"
            },
            {
                "name": "Голубой",
                "hex": "#b8d4e3",
                "image": "https://images.unsplash.com/photo-1612541122840-bf7071c968a2?w=600&h=800&fit=crop"
            },
            {
                "name": "Розовый",
                "hex": "#e8c4c4",
                "image": "https://images.unsplash.com/photo-1612541122840-bf7071c968a2?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "S",
            "M",
            "L",
            "XL",
            "XXL"
        ],
        "desc": "Классическая рубашка Oxford из египетского хлопка. Воротник button-down, стандартный крой. Идеальна с костюмом и с джинсами.",
        "badge": null,
        "imageHover": "https://images.unsplash.com/photo-1612541122840-bf7071c968a2?w=600&h=800&fit=crop"
    },
    {
        "id": 9,
        "brand": "NŪRA",
        "name": "Пальто oversize шерсть",
        "category": "men",
        "price": 198000,
        "oldPrice": 235000,
        "color": "#5c4a3a",
        "colorName": "Коричневый",
        "image": "https://images.unsplash.com/photo-1619441523834-995b599b5baf?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Коричневый",
                "hex": "#5c4a3a",
                "image": "https://images.unsplash.com/photo-1619441523834-995b599b5baf?w=600&h=800&fit=crop"
            },
            {
                "name": "Чёрный",
                "hex": "#1a1a1a",
                "image": "https://images.unsplash.com/photo-1619441523834-995b599b5baf?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "M",
            "L",
            "XL",
            "XXL"
        ],
        "desc": "Мужское пальто оверсайз из итальянской шерсти. Двубортная застёжка, два кармана. Длина до середины бедра.",
        "badge": "Sale",
        "imageHover": "https://images.unsplash.com/photo-1619441523834-995b599b5baf?w=600&h=800&fit=crop"
    },
    {
        "id": 10,
        "brand": "NŪRA",
        "name": "Брюки чинос хлопок",
        "category": "men",
        "price": 45900,
        "oldPrice": null,
        "color": "#c9b99a",
        "colorName": "Бежевый",
        "image": "https://images.unsplash.com/photo-1623200693945-ec1e9991039a?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Бежевый",
                "hex": "#c9b99a",
                "image": "https://images.unsplash.com/photo-1623200693945-ec1e9991039a?w=600&h=800&fit=crop"
            },
            {
                "name": "Тёмно-синий",
                "hex": "#2c3e50",
                "image": "https://images.unsplash.com/photo-1623200693945-ec1e9991039a?w=600&h=800&fit=crop"
            },
            {
                "name": "Чёрный",
                "hex": "#1a1a1a",
                "image": "https://images.unsplash.com/photo-1623200693945-ec1e9991039a?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "46",
            "48",
            "50",
            "52",
            "54"
        ],
        "desc": "Классические чинос из хлопка с эластаном. Зауженный крой, средняя посадка. Комфорт на каждый день.",
        "badge": null,
        "imageHover": "https://images.unsplash.com/photo-1623200693945-ec1e9991039a?w=600&h=800&fit=crop"
    },
    {
        "id": 11,
        "brand": "NŪRA",
        "name": "Кожаная куртка байкер",
        "category": "men",
        "price": 175000,
        "oldPrice": null,
        "color": "#1a1a1a",
        "colorName": "Чёрный",
        "image": "https://images.unsplash.com/photo-1602700205182-923ff4b8e643?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Чёрный",
                "hex": "#1a1a1a",
                "image": "https://images.unsplash.com/photo-1602700205182-923ff4b8e643?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "M",
            "L",
            "XL"
        ],
        "desc": "Мужская байкерская куртка из натуральной кожи ягнёнка. Асимметричная молния, подкладка из вискозы. Мягкая и лёгкая.",
        "badge": "Новинка",
        "imageHover": "https://images.unsplash.com/photo-1602700205182-923ff4b8e643?w=600&h=800&fit=crop"
    },
    {
        "id": 12,
        "brand": "NŪRA",
        "name": "Кашемировый свитер",
        "category": "men",
        "price": 89000,
        "oldPrice": null,
        "color": "#f5f5f5",
        "colorName": "Белый",
        "image": "https://images.unsplash.com/photo-1771092358890-0db24db44e56?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Белый",
                "hex": "#f5f5f5",
                "image": "https://images.unsplash.com/photo-1771092358890-0db24db44e56?w=600&h=800&fit=crop"
            },
            {
                "name": "Тёмно-синий",
                "hex": "#2c3e50",
                "image": "https://images.unsplash.com/photo-1771092358890-0db24db44e56?w=600&h=800&fit=crop"
            },
            {
                "name": "Бежевый",
                "hex": "#d4c4b0",
                "image": "https://images.unsplash.com/photo-1771092358890-0db24db44e56?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "desc": "Свитер из 100% кашемира с круглым вырезом. Тонкая вязка, мягкая текстура. Базовая вещь для сезонного гардероба.",
        "badge": null,
        "imageHover": "https://images.unsplash.com/photo-1771092358890-0db24db44e56?w=600&h=800&fit=crop"
    },
    {
        "id": 13,
        "brand": "NŪRA",
        "name": "Кожаная сумка тоут",
        "category": "accessories",
        "price": 125000,
        "oldPrice": null,
        "color": "#5c4a3a",
        "colorName": "Коньяк",
        "image": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Коньяк",
                "hex": "#5c4a3a",
                "image": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop"
            },
            {
                "name": "Чёрный",
                "hex": "#1a1a1a",
                "image": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "ONE"
        ],
        "desc": "Вместительная сумка-тоут из натуральной кожи. Два внутренних кармана, магнитная застёжка. Подходит для ноутбука до 13\".",
        "badge": null,
        "imageHover": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop"
    },
    {
        "id": 14,
        "brand": "NŪRA",
        "name": "Шёлковый платок",
        "category": "accessories",
        "price": 34900,
        "oldPrice": null,
        "color": "#b8956a",
        "colorName": "Золотой",
        "image": "https://images.unsplash.com/photo-1606259458027-54d2a728b6ab?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Золотой",
                "hex": "#b8956a",
                "image": "https://images.unsplash.com/photo-1606259458027-54d2a728b6ab?w=600&h=800&fit=crop"
            },
            {
                "name": "Бордовый",
                "hex": "#6b2d3e",
                "image": "https://images.unsplash.com/photo-1606259458027-54d2a728b6ab?w=600&h=800&fit=crop"
            },
            {
                "name": "Синий",
                "hex": "#2c3e50",
                "image": "https://images.unsplash.com/photo-1606259458027-54d2a728b6ab?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "ONE"
        ],
        "desc": "Шёлковый платок с авторским принтом. Размер 90×90 см. Ручная обработка краёв. Подарочная упаковка в комплекте.",
        "badge": "Новинка",
        "imageHover": "https://images.unsplash.com/photo-1606259458027-54d2a728b6ab?w=600&h=800&fit=crop"
    },
    {
        "id": 15,
        "brand": "NŪRA",
        "name": "Ремень из итальянской кожи",
        "category": "accessories",
        "price": 28500,
        "oldPrice": null,
        "color": "#1a1a1a",
        "colorName": "Чёрный",
        "image": "https://images.unsplash.com/photo-1611937685025-8d1df67a80b6?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Чёрный",
                "hex": "#1a1a1a",
                "image": "https://images.unsplash.com/photo-1611937685025-8d1df67a80b6?w=600&h=800&fit=crop"
            },
            {
                "name": "Коньяк",
                "hex": "#5c4a3a",
                "image": "https://images.unsplash.com/photo-1611937685025-8d1df67a80b6?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "85",
            "90",
            "95",
            "100",
            "105"
        ],
        "desc": "Классический ремень из итальянской кожи. Матовая пряжка из сплава, ширина 3 см. Универсальный аксессуар на каждый день.",
        "badge": null,
        "imageHover": "https://images.unsplash.com/photo-1611937685025-8d1df67a80b6?w=600&h=800&fit=crop"
    },
    {
        "id": 16,
        "brand": "NŪRA",
        "name": "Солнцезащитные очки авиатор",
        "category": "accessories",
        "price": 56000,
        "oldPrice": 68000,
        "color": "#b8956a",
        "colorName": "Золотой",
        "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop",
        "colors": [
            {
                "name": "Золотой",
                "hex": "#b8956a",
                "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop"
            },
            {
                "name": "Серебро",
                "hex": "#c0c5cb",
                "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop"
            }
        ],
        "sizes": [
            "ONE"
        ],
        "desc": "Солнцезащитные очки в оправе авиатор. Металлическая оправа, поляризованные линзы с UV400 защитой. Футляр и салфетка в комплекте.",
        "badge": "Sale",
        "imageHover": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop"
    }
];
