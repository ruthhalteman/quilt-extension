let fabrics = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ fabrics });
  chrome.contextMenus.create({
    id: "save",
    title: "Save fabric",
    contexts: ["image"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if ("save" === info.menuItemId) {
    chrome.storage.sync.get("fabrics", ({ fabrics }) => {
      chrome.storage.sync.set({
        fabrics: [
          ...fabrics,
          {
            imageUrl: info.srcUrl,
            linkUrl: info.linkUrl,
            pageUrl: info.pageUrl,
            visible: true
          },
        ],
      });
    });
  } else if ("view" === info.menuItemId) {
    chrome.runtime.openOptionsPage();
  }
});
