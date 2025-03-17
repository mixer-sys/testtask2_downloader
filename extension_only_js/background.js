chrome.commands.onCommand.addListener((command) => {
  if (command === "download_video") {

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              files: ['content.js']
          });
      });
  }
});
