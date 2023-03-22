let threshold = 2048; // Default threshold value

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.threshold) {
    threshold = message.threshold;
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

function countWordsOnPage() {
  const targetDiv = document.querySelector('main.w-full.h-full');
  
  if (targetDiv) {
    const divText = getTextFromNode(targetDiv);
    return countWords(divText)*0.75;
  } else {
    return 0;
  }
}

function updateWordCountDisplay(wordCount, threshold) {
  let wordCountColor;
  if (wordCount >= threshold) {
    wordCountColor = "red";
  } else if (wordCount >= threshold * 0.8) {
    wordCountColor = "yellow";
  } else {
    wordCountColor = "green";
  }

  let wordCountDisplay = document.querySelector("#wordCountDisplay");

  if (!wordCountDisplay) {
    wordCountDisplay = document.createElement("div");
    wordCountDisplay.id = "wordCountDisplay";
    const navElement = document.querySelector("nav.flex.h-full.flex-1.flex-col.space-y-1.p-2");
    navElement.insertAdjacentElement("afterbegin", wordCountDisplay);
  }

  wordCountDisplay.innerHTML = `Context Count: ${wordCount}`;
  wordCountDisplay.style.color = wordCountColor;
}

function updateWordCount() {
  const wordCount = countWordsOnPage();
  updateWordCountDisplay(wordCount, threshold);
}

setInterval(updateWordCount, 500); // Update the word count every 5 seconds
