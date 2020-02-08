export default (words) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "query", value: words }, (data) => {
      if (arguments.length === 0) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(data);
      }
    });
  });
};