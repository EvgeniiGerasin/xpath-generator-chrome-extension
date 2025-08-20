let highlightedElement = null;
let elements_count = 0;

// Подсветка элемента при наведении
document.addEventListener('mouseover', function (e) {
    if (highlightedElement) {
        highlightedElement.style.outline = '';
    }
    highlightedElement = e.target;
    highlightedElement.style.outline = '2px solid red';
});

// Получение кода по правому клику
document.addEventListener('contextmenu', function (e) {
    if (elements_count == 2) {
        console.log('Элементов больше двух');
    } else {
        elements_count += 1;
        e.preventDefault();

        // Получаем и выводим код элемента
        const elementCode = e.target.outerHTML;
        console.log('Код элемента:', elementCode);

        // Копируем в буфер обмена
        navigator.clipboard.writeText(elementCode).then(() => {
            console.log('Код скопирован в буфер обмена');
        }).catch(err => {

        });
    }

});

