document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['collectedElements'], function(result) {
        const elements = result.collectedElements || [];
        const resultsDiv = document.getElementById('results');
        
        if (elements.length === 0) {
            resultsDiv.innerHTML = '<p>Нет собранных данных</p>';
            return;
        }
        
        // Отображаем элементы
        elements.forEach((element, index) => {
            const elementDiv = document.createElement('div');
            elementDiv.className = 'element';
            elementDiv.innerHTML = `
                <h4>Элемент ${index + 1}:</h4>
                <pre>${element}</pre>
            `;
            resultsDiv.appendChild(elementDiv);
        });
        
        // Добавляем кнопку для генерации XPath
        if (elements.length >= 2) {
            const generateButton = document.createElement('button');
            generateButton.textContent = 'Сгенерировать XPath';
            generateButton.style.cssText = 'margin: 10px 0; padding: 10px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;';
            
            generateButton.addEventListener('click', function() {
                generateXPath(elements[0], elements[1]);
            });
            
            resultsDiv.appendChild(generateButton);
        }
    });
});

// Функция для генерации XPath через OpenRouter
function generateXPath(element0, element1) {
    const prompt = `сгенерируй мне xpath для целевого элемента ${element0} в ${element1}. Пришли только xpath (можно несоклько)`;
    
    // Показываем индикатор загрузки
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.innerHTML = '<p>Генерируем XPath...</p>';
    loadingDiv.style.cssText = 'color: #666; font-style: italic;';
    resultsDiv.appendChild(loadingDiv);
    
    // Замените 'YOUR_API_KEY' на ваш реальный API ключ от OpenRouter
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
        // Убираем индикатор загрузки
        document.getElementById('loading').remove();
        
        const xpathResult = data.choices[0].message.content;
        
        // Создаем новую вкладку с результатами
        createWorkspaceTab(xpathResult, element0, element1);
    })
    .catch(error => {
        // Убираем индикатор загрузки
        document.getElementById('loading').remove();
        console.error('Ошибка при генерации XPath:', error);
        alert('Ошибка при генерации XPath: ' + error.message);
    });
}

// Функция для создания вкладки workspace с результатами
function createWorkspaceTab(xpathResult, element0, element1) {
    // Создаем HTML содержимое для новой вкладки
    const workspaceHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Результаты XPath</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .result-section {
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        pre {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 3px;
            overflow-x: auto;
        }
        .xpath-result {
            background: #e8f5e8;
            border-color: #4caf50;
        }
    </style>
</head>
<body>
    <h1>Результаты генерации XPath</h1>
    
    <div class="result-section">
        <h2>Сгенерированные XPath:</h2>
        <pre class="xpath-result">${xpathResult}</pre>
    </div>
    
    <div class="result-section">
        <h2>Элемент 1 (контекст):</h2>
        <pre>${element1}</pre>
    </div>
    
    <div class="result-section">
        <h2>Элемент 2 (целевой):</h2>
        <pre>${element0}</pre>
    </div>
</body>
</html>
    `;
    
    // Создаем Blob с HTML содержимым
    const blob = new Blob([workspaceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Открываем новую вкладку с результатами
    chrome.tabs.create({ url: url });
}