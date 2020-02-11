let myWindowId = null;

browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  myWindowId = windowInfo.id;
});

let container = document.getElementById("container");

let update = (newDom) => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.appendChild(newDom);
};

browser.runtime.onMessage.addEventListener(
  (message) => {
    if (message.type == "updateSidebar") {
      update(message.value);
    }
  }
);