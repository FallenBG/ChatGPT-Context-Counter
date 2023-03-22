document.addEventListener("DOMContentLoaded", function () {
  const thresholdInput = document.getElementById("threshold");
  const saveButton = document.getElementById("save");

  // Load the threshold value from localStorage if it exists, or use 2048 as the default value
  thresholdInput.value = localStorage.getItem("threshold") || 2048;

  // Save the threshold value to localStorage when the Save button is clicked
  saveButton.addEventListener("click", () => {
    const thresholdValue = parseInt(thresholdInput.value) || 2048;
    localStorage.setItem("threshold", thresholdValue);
    // Send a message to the content script to update the threshold value
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {threshold: thresholdValue});
    });
  });
});
