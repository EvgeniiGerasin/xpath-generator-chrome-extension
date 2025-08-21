(function() {
    let highlightedElement = null;
    let elements_count = 0;
    let collectedElements = [];

    // Подсветка элемента при наведении
    function handleMouseover(e) {
        if (highlightedElement) {
            highlightedElement.style.outline = '';
        }
        highlightedElement = e.target;
        if (elements_count === 0) {
            highlightedElement.style.outline = '2px solid red';
        } else {
            highlightedElement.style.outline = '2px solid green';
        } 
    }

    // Получение кода по правому клику
    function handleContextmenu(e) {
        elements_count += 1;
        e.preventDefault();

        const elementCode = e.target.outerHTML;
        collectedElements.push(elementCode);
        console.log('Код элемента:', elementCode);

        navigator.clipboard.writeText(elementCode).then(() => {
            console.log('Код скопирован в буфер обмена');
        }).catch(err => {
            console.error('Ошибка копирования:', err);
        });

        // После второго клика
        if (elements_count == 2) {
            console.log('Элементов больше двух');
            
            // Отправляем данные в background
            chrome.runtime.sendMessage({
                action: 'openPopup',
                collectedElements: collectedElements
            });
            
            // Убираем обработчики
            document.removeEventListener('mouseover', handleMouseover);
            document.removeEventListener('contextmenu', handleContextmenu);
            if (highlightedElement) {
                highlightedElement.style.outline = '';
                highlightedElement = null;
            }
            return;
        }
    }

    // Добавляем обработчики событий
    document.addEventListener('mouseover', handleMouseover);
    document.addEventListener('contextmenu', handleContextmenu);
    console.log('Content script загружен и готов к работе');
})();