document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['collectedElements'], function(result) {
        const elements = result.collectedElements || [];
        const resultsDiv = document.getElementById('results');
        
        if (elements.length === 0) {
            resultsDiv.innerHTML = '<p>Нет собранных данных</p>';
            return;
        }
        
        elements.forEach((element, index) => {
            const elementDiv = document.createElement('div');
            elementDiv.className = 'element';
            elementDiv.innerHTML = `
                <h4>Элемент ${index + 1}:</h4>
                <pre>${element}</pre>
            `;
            resultsDiv.appendChild(elementDiv);
        });
    });
});