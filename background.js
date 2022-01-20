let color = '#3aa757';
let fabrics = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);

  chrome.storage.sync.set({ fabrics });
  chrome.contextMenus.create({
    id: 'save',
    title: 'Save fabric',
    contexts: ['image'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if ('save' === info.menuItemId) {
    console.log('test test test', info);
    chrome.storage.sync.get('fabrics', ({fabrics}) => {
      chrome.storage.sync.set({ fabrics: [...fabrics, info.srcUrl] });
    });
  }
});
