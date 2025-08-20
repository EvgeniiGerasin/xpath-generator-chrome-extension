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
    const prompt = `сгенерируй мне xpath для целевого элемента ${element0} в ${element1}. Пришли только xpath (можно несоклько)`;

    fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'openai/gpt-oss-20b:free',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })
    })
        .then(response => response.json())
        .then(data => {
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