let threshold = parseInt(localStorage.getItem('threshold')) || 2048;
let contextWeight = parseInt(localStorage.getItem('contextWeight')) || 75;
let warningThreshold = parseInt(localStorage.getItem('warningThreshold')) || 80;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.threshold) {
        threshold = message.threshold;
        localStorage.setItem('threshold', threshold);
    }
    if (message.contextWeight) {
        contextWeight = message.contextWeight;
        localStorage.setItem('contextWeight', contextWeight);
    }
    if (message.warningThreshold) {
        warningThreshold = message.warningThreshold;
        localStorage.setItem('warningThreshold', warningThreshold);
    }
});

function countWords(text) {
    return text.trim().split(/\s+/).length;
}

function getTextFromNode(node) {
    let text = '';
    if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'script' && node.tagName.toLowerCase() !== 'style') {
        for (let childNode of node.childNodes) {
            text += getTextFromNode(childNode);
        }
    }
    return text;
}

function countContextOnPage() {
    const targetDiv = document.querySelector('main.w-full.h-full');

    if (targetDiv) {
        const divText = getTextFromNode(targetDiv);
        return countWords(divText) * contextWeight / 100;
    } else {
        return 0;
    }
}

function updateContextCountDisplay(contextCount, threshold, warningThreshold) {
    let contextCountColor;
    if (contextCount >= threshold) {
        contextCountColor = "red";
    } else if (contextCount >= threshold * warningThreshold / 100) {
        contextCountColor = "yellow";
    } else {
        contextCountColor = "green";
    }

    let contextCountDisplay = document.querySelector("#contextCountDisplay");

    if (!contextCountDisplay) {
        contextCountDisplay = document.createElement("div");
        contextCountDisplay.id = "contextCountDisplay";
        const navElement = document.querySelector("nav.flex.h-full.flex-1.flex-col.space-y-1.p-2");
        navElement.insertAdjacentElement("afterbegin", contextCountDisplay);
    }

    contextCountDisplay.innerHTML = `Context Count: ${contextCount.toFixed(2)}`;
    contextCountDisplay.style.color = contextCountColor;
}

function updateContextCount() {
    const contextCount = countContextOnPage();
    updateContextCountDisplay(contextCount, threshold, warningThreshold);
}

setInterval(updateContextCount, 500); // Update the context count every 5 seconds
