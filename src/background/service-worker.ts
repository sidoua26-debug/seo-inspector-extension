// Background Service Worker for SEO Inspector (Manifest V3)

chrome.runtime.onInstalled.addListener((details) => {
  console.log('[SEO Inspector] Extension installed / updated:', details.reason);
});

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_TAB_INFO') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        sendResponse({ tab: tabs[0] });
      } else {
        sendResponse({ tab: null });
      }
    });
    return true; // Keep channel open
  }
});
