document.addEventListener("DOMContentLoaded", function () {
    const thresholdInput = document.getElementById("threshold");
    const contextWeightInput = document.getElementById("context-weight");
    const warningThresholdInput = document.getElementById("warning-threshold");
    const saveButton = document.getElementById("save");

    // Load the threshold, context weight, and warning threshold values from localStorage if they exist, or use defaults
    thresholdInput.value = localStorage.getItem("threshold") || 75;
    contextWeightInput.value = localStorage.getItem("contextWeight") || 75;
    warningThresholdInput.value = localStorage.getItem("warningThreshold") || 80;

    // Save the threshold, context weight, and warning threshold values to localStorage when the Save button is clicked
    saveButton.addEventListener("click", () => {
        const thresholdValue = parseInt(thresholdInput.value) || 75;
        const contextWeightValue = parseInt(contextWeightInput.value) || 75;
        const warningThresholdValue = parseInt(warningThresholdInput.value) || 80;
        localStorage.setItem("threshold", thresholdValue);
        localStorage.setItem("contextWeight", contextWeightValue);
        localStorage.setItem("warningThreshold", warningThresholdValue);
// Send a message to the content script to update the threshold, context weight, and warning threshold values
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {threshold: thresholdValue, contextWeight: contextWeightValue, warningThreshold: warningThresholdValue});
        });
    });
});
