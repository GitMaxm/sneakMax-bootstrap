
document.addEventListener('DOMContentLoaded', function () {
    const rangeMin = document.getElementById('price-range-min');
    const rangeMax = document.getElementById('price-range-max');
    const inputMin = document.getElementById('price-min');
    const inputMax = document.getElementById('price-max');
    const progress = document.querySelector('.filter-price-progress');

    // Функция обновления прогресс-бара
    function updateProgress() {
        const min = parseInt(rangeMin.value);
        const max = parseInt(rangeMax.value);
        const minPercent = ((min - rangeMin.min) / (rangeMin.max - rangeMin.min)) * 100;
        const maxPercent = ((max - rangeMax.min) / (rangeMax.max - rangeMax.min)) * 100;

        progress.style.left = minPercent + '%';
        progress.style.right = (100 - maxPercent) + '%';
    }

    // Обработчики для ползунков
    rangeMin.addEventListener('input', (e) => {
        const min = parseInt(rangeMin.value);
        const max = parseInt(rangeMax.value);

        if (min > max) {
            rangeMin.value = max;
            inputMin.value = max;
        } else {
            inputMin.value = min;
        }
        updateProgress();
    });

    rangeMax.addEventListener('input', (e) => {
        const min = parseInt(rangeMin.value);
        const max = parseInt(rangeMax.value);

        if (max < min) {
            rangeMax.value = min;
            inputMax.value = min;
        } else {
            inputMax.value = max;
        }
        updateProgress();
    });

    // Обработчики для инпутов
    inputMin.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        if (value <= parseInt(inputMax.value) && value >= parseInt(rangeMin.min)) {
            rangeMin.value = value;
            updateProgress();
        }
    });

    inputMax.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        if (value >= parseInt(inputMin.value) && value <= parseInt(rangeMax.max)) {
            rangeMax.value = value;
            updateProgress();
        }
    });

    // Инициализация прогресс-бара
    updateProgress();
});