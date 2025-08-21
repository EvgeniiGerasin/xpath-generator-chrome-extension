// Слушатель клика по иконке расширения
chrome.action.onClicked.addListener((tab) => {
    console.log('Иконка расширения нажата!');
    
    // Инжектим контент-скрипт в активную вкладку
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});

// Слушатель сообщений от контент-скрипта
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === 'openPopup') {
        // Сохраняем данные в storage
        console.log('Cохраняем в сторидж');
        await chrome.storage.local.set({ collectedElements: request.collectedElements }, () => {
            console.log('Данные сохранены. Откройте popup через клик на иконку.');
        });
        // Открываем отдельное окно
        chrome.windows.create({
            url: chrome.runtime.getURL("workspace.html"),
            type: "popup",
            width: 600,
            height: 500,
            left: 200,
            top: 200
        });
    }
});