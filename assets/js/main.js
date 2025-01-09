// const btnOpen = document.querySelector('[data-modal-button]');
// const btnClose = document.querySelector('[data-modal-close]');
// const dataModal = document.querySelector('[data-modal]');

// btnOpen.addEventListener('click', function () {
//     dataModal.classList.remove('none');
// })

// btnClose.addEventListener('click', function () {
//     dataModal.classList.add('none');
// })

// dataModal.addEventListener('click', function () {
//     dataModal.classList.add('none')
// })

// //остнавливаем действие закрытия окна, если клик был по блоку
// dataModal.querySelector('.show-product-modal').addEventListener('click', function (e) {
//     e.stopPropagation();
// })

const productsURL = 'http://127.0.0.1:5500/assets/JSON/product.json';
const productsCatalogContainer = document.querySelector('#catalog-products-container');
const productsModalContainer = document.querySelector('#product-modal-container');

function getProducts(url) {
    return fetch(url).then(answer => answer.json())
}

main();

async function main() {
    const products = await getProducts(productsURL);

    const state = {
        products: products, // Все товары
        filteredProducts: products, // Отфильтрованные товары
    };

    window.state = state;

    // Первоначальный рендер
    renderCatalogProducts(state.filteredProducts);
    renderProductModals(state.products);

    // Установка слушателей событий для фильтров
    setupFilterListeners();

    // Функция рендера каталога товаров
    function renderCatalogProducts(productsToRender) {
        productsCatalogContainer.innerHTML = ""; // Очистить контейнер каталога

        productsToRender.forEach(product => {
            const markup = `
                <div class="catalog-product col-md-4 col-sm-6 mb-3">
                    <div class="catalog-product-hover">
                        <img class="product-img" src="assets/img/catalog/product/${product.img}" alt="${product.title}">
                        <div class="product-buttons">
                            <button>
                                <img src="assets/img/catalog/cart-add.svg" alt="Добавить в корзину">
                            </button>
                            <button data-bs-toggle="modal" data-bs-target="#modal-${product.id}" type="button">
                                <img src="assets/img/catalog/show.svg" alt="Просмотреть товар">
                            </button>
                        </div>
                    </div>
                    <p class="product-descr">${product.title}</p>
                    <p class="product-price">${product.priceMain} р</p>
                </div>
                
            `;

            productsCatalogContainer.insertAdjacentHTML("beforeend", markup);
        });
    }

    // Функция рендера модальных окон
    function renderProductModals(productsToRender) {
        productsModalContainer.innerHTML = ""; // Очистить контейнер модальных окон

        productsToRender.forEach(product => {
            let sizesMarkup = '';

            if (Array.isArray(product.size)) {
                sizesMarkup = product.size
                    .map(size => `<button class="show-product-size-button">${size}</button>`)
                    .join('');
            } else {
                sizesMarkup = `<button class="show-product-size-button">${product.size}</button>`;
            }

            const markup = `
                <div id="modal-${product.id}" data-bs-keyboard="true" tabindex="-1" aria-labelledby="modal-1" aria-hidden="true"
                    class="show-product modal fade ">
                    <div class="modal-dialog">
                        <div class="modal-content show-product-modal">
                            <div class="show-product-modal-header row">

                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Закрыть"></button>

                                <div class="show-product-img col-lg-6 pb-3">
                                    <img src="assets/img/catalog/product/${product.img}" alt="${product.title}">
                                </div>

                                <div class="show-product-title col-lg-6 pb-3">

                                    <div class="show-product-details row">
                                        <p class="col-6 p-0">Артикул: ${product.article}</p>
                                        <p class="col-6">В наличии: <span>${product.quantity}</span> <span>шт</span></p>
                                    </div>

                                    <h3 class="title-4">
                                    ${product.title}
                                    </h3>

                                    <div class="show-product-size">
                                        <p>Выберите размер</p>
                                        <div class="show-product-size-group">
                                            ${sizesMarkup} 
                                        </div>
                                    </div>

                                    <div class="show-product-price  ">
                                        <p class="show-product-price-main">${product.priceMain} р</p>
                                        <p class="show-product-price-old">${product.priceOld} р</p>
                                    </div>

                                    <button data-modal-close type="button" class="button button--accent text-white">
                                        Заказать
                                    </button>

                                </div>
                            </div>

                            <div class="show-product-modal-bottom row">
                                <div class="show-product-modal-description col-lg-6 pb-3">
                                    <h4 class="title-4">Описание</h4>
                                    <p>${product.description}</p>
                                </div>
                                <div class="show-product-modal-characteristics col-lg-6 pb-3">
                                    <h4 class="title-4">Характеристики</h4>
                                    <ul class="p-0">
                                        <li>Пол: ${product.characteristics.gender}</li>
                                        <li>Цвета: ${product.characteristics.color}</li>
                                        <li>Состав: ${product.characteristics.сomposition}</li>
                                        <li>Страна: ${product.characteristics.сountry}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            productsModalContainer.insertAdjacentHTML("beforeend", markup);
        });
    }

    // Настройка фильтров
    function setupFilterListeners() {
        const applyFilterButton = document.getElementById("apply-filter");
        const resetFilterButton = document.getElementById("reset-filter");

        applyFilterButton.addEventListener("click", applyFilters);
        resetFilterButton.addEventListener("click", resetFilters);
    }

    function applyFilters() {
        const minPrice = parseInt(document.getElementById("price-min").value, 10) || 0;
        const maxPrice = parseInt(document.getElementById("price-max").value, 10) || Infinity;
        const gender = document.querySelector('input[name="gender"]:checked')?.value;
        const selectedSizes = Array.from(document.querySelectorAll('.filter-size-input:checked'))
            .map(input => parseInt(input.value, 10));
    
        const catalogContainer = document.getElementById('catalog-products-container');
        const showMoreButton = document.getElementById('more-button'); // ID кнопки "Показать еще"
        const noProductsMessage = document.getElementById('product-none'); // ID сообщения "Таких товаров нет"
    
        // Фильтрация продуктов
        state.filteredProducts = state.products.filter(product => {
            const inPriceRange = product.priceMain >= minPrice && product.priceMain <= maxPrice;
            const matchesGender = !gender || product.characteristics.gender?.toLowerCase() === gender.toLowerCase();
            const matchesSize = selectedSizes.length === 0 || 
                                (Array.isArray(product.size) && product.size.some(size => selectedSizes.includes(size)));
            return inPriceRange && matchesGender && matchesSize;
        });
    
        // Очистка каталога перед рендером
        catalogContainer.innerHTML = '';
    
        // Обновление UI в зависимости от результатов фильтра
        if (state.filteredProducts.length > 0) {
            catalogContainer.classList.remove('hidden');
            showMoreButton.classList.remove('hidden');
            showMoreButton.classList.add('d-flex');
            noProductsMessage.classList.add('hidden');
    
            renderCatalogProducts(state.filteredProducts); // Отрисовка продуктов
        } else {
            catalogContainer.classList.add('hidden');
            showMoreButton.classList.add('hidden');
            showMoreButton.classList.remove('d-flex');
            noProductsMessage.classList.remove('hidden');
        }
    }
    
    
    

    function resetFilters() {
        document.getElementById("price-min").value = 1850;
        document.getElementById("price-max").value = 25768;
        document.querySelectorAll('input[name="gender"]').forEach(input => input.checked = false);
        document.querySelectorAll('.filter-size-input').forEach(input => input.checked = false);

        state.filteredProducts = state.products;
        renderCatalogProducts(state.filteredProducts);
    }
}
