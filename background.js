let fabrics = [];

chrome.runtime.onInstalled.addListener(() => {

  chrome.storage.sync.set({ fabrics });
  chrome.contextMenus.create({
    id: 'save',
    title: 'Save fabric',
    contexts: ['image'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if ('save' === info.menuItemId) {
    chrome.storage.sync.get('fabrics', ({ fabrics }) => {
      console.log(fabrics.length);
      if (fabrics.length === 0) {
        chrome.storage.sync.set({ fabrics: [...fabrics, info.srcUrl], quiltBackground: info.srcUrl });
      } else {
        chrome.storage.sync.set({ fabrics: [...fabrics, info.srcUrl] });
      }
    });
  }
});
