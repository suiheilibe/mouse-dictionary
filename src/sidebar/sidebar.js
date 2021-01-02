let container = document.getElementById("container");

let update = (html) => {
  container.innerHTML = html;
};

chrome.runtime.onMessage.addListener(
  (message) => {
    if (message.type == "updateSidebar") {
      update(message.value);
    }
  }
);