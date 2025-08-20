// Слушатель клика по иконке расширения
chrome.action.onClicked.addListener((tab) => {
    console.log('Иконка расширения нажата!');

    // Инжектим контент-скрипт в активную вкладку
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});