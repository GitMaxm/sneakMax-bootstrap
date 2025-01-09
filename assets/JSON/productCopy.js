const product = [
    {
        name: 'Кроссовки Nike Air Force', // имя товара
        img: 'assets/img/product/01.jpg', // картинка товара
        priceMain: 11000,
        priceOld: 22000,
        article: 879876, // артикул товара
        size: [36, 37, 38],
        description: 'Кроссовки Nike Air Force \'77 Vintage Suede с винтажной подошвой возрождают стиль баскетбольных моделей Nike прошлого, создавая впечатление, что они хранились в шкафу долгие годы.',
        characteristics: [ // характеристики товара
            'Пол: Мужской',
            'Цвета: Разноцветный',
            'Состав: Кожа, текстиль, резина',
            'Страна: Вьетнам'
        ],
        quantity: 10 // коли-во товара
    
    }
];

const items = JSON.stringify(product);
console.log(items);