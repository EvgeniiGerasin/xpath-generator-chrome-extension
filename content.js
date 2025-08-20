(function() {
    let highlightedElement = null;
    let elements_count = 0;

    // Подсветка элемента при наведении
    function handleMouseover(e) {
        if (highlightedElement) {
            highlightedElement.style.outline = '';
        }
        highlightedElement = e.target;
        highlightedElement.style.outline = '2px solid red';
    }

    // Получение кода по правому клику
    function handleContextmenu(e) {
        
        elements_count += 1;
        e.preventDefault();

        // Получаем и выводим код элемента
        const elementCode = e.target.outerHTML;
        console.log('Код элемента:', elementCode);

        // Копируем в буфер обмена
        navigator.clipboard.writeText(elementCode).then(() => {
            console.log('Код скопирован в буфер обмена');
        }).catch(err => {
            console.error('Ошибка копирования:', err);
        });
        // Очистка
        if (elements_count == 2) {
            console.log('Элементов больше двух');
            // Убираем обработчики после второго клика
            document.removeEventListener('mouseover', handleMouseover);
            document.removeEventListener('contextmenu', handleContextmenu);
            highlightedElement.style.outline = '';
            highlightedElement = null;
            return;
        }
    }

    // Добавляем обработчики событий
    document.addEventListener('mouseover', handleMouseover);
    document.addEventListener('contextmenu', handleContextmenu);
    console.log('Content script загружен и готов к работе');
})();