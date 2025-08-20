document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get(['collectedElements'], function (result) {
        const elements = result.collectedElements || [];
        const resultsDiv = document.getElementById('results');

        if (elements.length === 0) {
            resultsDiv.innerHTML = '<p>Нет собранных данных</p>';
            return;
        }

        // Показываем индикатор загрузки
        resultsDiv.innerHTML = '<p style="color: #666; font-style: italic;">Генерируем XPath...</p>';

        // Автоматически генерируем XPath
        generateXPath(elements[0], elements[1]);
    });
});

// Функция для генерации XPath через OpenRouter
function generateXPath(element0, element1) {
    // Проверяем, что элементы существуют
    if (!element0 || !element1) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '<p style="color: red;">Ошибка: не удалось получить элементы</p>';
        return;
    }
    
    const prompt = `сгенерируй мне xpath для целевого элемента ${element0} в ${element1}. Делай максимально универсальный xpath. Избегай в свойствах случайно сгенерированных значений (например plex-999). универсальный вариант без завязки на случайные атрибуты. Пришли только xpath (можно несоклько)`;

    fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'moonshotai/kimi-k2:free',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })
    })
        .then(response => {
            // Сохраняем ответ для возможной отладки
            const responseClone = response.clone();
            
            // Проверяем статус ответа
            if (!response.ok) {
                // Читаем тело ответа для отладки
                return responseClone.text().then(errorBody => {
                    throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
                });
            }
            return response.json();
        })
        .then(data => {
            // Проверяем, что данные корректны
            if (!data) {
                throw new Error('Пустой ответ от сервера');
            }
            
            if (!data.choices || data.choices.length === 0) {
                // Показываем весь ответ для отладки
                const debugInfo = JSON.stringify(data, null, 2);
                throw new Error(`Не удалось получить ответ от сервера. Полный ответ: ${debugInfo}`);
            }
            
            const xpathResult = data.choices[0].message.content;

            // Показываем только результат
            displayResult(xpathResult);
        })
        .catch(error => {
            console.error('Ошибка при генерации XPath:', error);

            // Показываем только ошибку
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = `
                <div style="color: red; padding: 20px; background: #ffebee; border-radius: 4px;">
                    <h3 style="margin-top: 0;">Ошибка:</h3>
                    <p>${error.message}</p>
                </div>
            `;
        });
}

// Функция для отображения только результата
function displayResult(xpathResult) {
    const resultsDiv = document.getElementById('results');

    resultsDiv.innerHTML = `
        <div style="padding: 20px;">
            <h2 style="color: #2e7d32; margin-top: 0;">Сгенерированные XPath:</h2>
            <pre style="background: #e8f5e8; padding: 15px; border-radius: 5px; border: 1px solid #c8e6c9; font-family: monospace; white-space: pre-wrap; word-wrap: break-word;">${xpathResult}</pre>
        </div>
    `;
}