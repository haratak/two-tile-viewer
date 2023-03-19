document.getElementById("split").addEventListener("click", async () => {
    chrome.scripting.executeScript({
      target: {tabId: chrome.tabs.TAB_ID_NONE},
      files: ['content.js']
    });
  });
  