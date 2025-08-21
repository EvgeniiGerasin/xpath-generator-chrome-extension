// Инициализируем расширение
initializeExtension();

// Метод для инициализации при загрузке DOM
function initializeExtension() {
    document.addEventListener('DOMContentLoaded', function () {
        loadCollectedElements();
    });
}

// Метод для загрузки собранных элементов из хранилища
function loadCollectedElements() {
    chrome.storage.local.get(['collectedElements'], function (result) {
        const elements = result.collectedElements || [];
        console.log(elements)
        generateXPath(elements[0], elements[1])
    });
}

// Метод для отображения сообщения об отсутствии данных
function showNoDataMessage(resultsDiv) {
    resultsDiv.innerHTML = '<p>Нет собранных данных</p>';
}

// Метод для отображения индикатора загрузки
function showLoadingIndicator() {
    putToHtmlResult("Генерируем XPath...")
}

// Функция для генерации XPath
async function generateXPath(element0, element1) {
    
    const prompt = `сгенерируй мне максимально короткие xpath для целевого элемента ${element0} в ${element1}. Делай максимально универсальный xpath. 
    Избегай в свойствах случайно сгенерированных значений (например plex-999). 
    универсальный вариант без завязки на случайные атрибуты. Пришли только xpath 
    (можно несоклько)
    
    Пример ответа:
    1) //img[@alt='User avatar' and contains(@class, 'rounded-full')]
    2) //img[@alt='User avatar' and contains(@src, 'imagedelivery.net')]
    3) //div[contains(@class, 'max-w-threadContentWidth')]//img[@alt='User avatar']
    n) ...
    
    `;
    response = await huggingFaceRequest(await getAPIKey(), prompt);
    // await putToHtmlResult(JSON.stringify(response));
    await putToHtmlResult(response.choices[0].message.content);
    };

// Функция для получения API ключа из файла keys.json
async function getAPIKey() {
    try {
        const response = await fetch('./keys.json');
        if (!response.ok) {
            await putToHtmlResult('Ошибка при чтении файла keys.json, обратитесь в техподдержку')
        }
        const data = await response.json();
        return data.openrouter_api_key
    } catch (error) {
        await putToHtmlResult(`Ошибка при работе с файлом keys.json:\n\n${error}`)
    }
}

async function putToHtmlResult(value) {
    const resultField = await document.getElementById('results');
    resultField.innerText = value;
}

async function huggingFaceRequest(apiKey, prompt) {
    showLoadingIndicator()
    try {
        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    model: "openai/gpt-oss-120b:fireworks-ai",
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = `HTTP ${response.status}: ${JSON.stringify(errorData)}`;
            await putToHtmlResult(`Ошибка запроса: ${errorMessage}`);
            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (data.error) {
            await putToHtmlResult(`API Error: ${data.error}`);
            throw new Error(`API Error: ${data.error}`);
        }

        return data;

    } catch (error) {
        if (error.name !== 'Error') { 
            await putToHtmlResult(`Ошибка: ${error.message}`);
        }
        throw error;
    }
}