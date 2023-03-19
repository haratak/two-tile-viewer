function createSplitScreen() {
    const originalUrl = window.location.href;
  
    document.body.innerHTML = `
      <div id="split-screen-container" style="display: flex; width: 100%; height: 100%;">
        <iframe id="split-screen-left" src="${originalUrl}" style="width: 50%; height: 100%; border: none;"></iframe>
        <iframe id="split-screen-right" src="${originalUrl}" style="width: 50%; height: 100%; border: none;"></iframe>
      </div>
    `;
  
    const iframeLeft = document.getElementById("split-screen-left");
    const iframeRight = document.getElementById("split-screen-right");
  
    iframeLeft.onload = () => {
      addEventListenersToIframe(iframeLeft);
    };
    iframeRight.onload = () => {
      addEventListenersToIframe(iframeRight);
    };
  }
  
  function handleMessage(request, sender, sendResponse) {
    const iframeLeft = document.getElementById("split-screen-left");
    const iframeRight = document.getElementById("split-screen-right");
  
    if (sender.tab) {
      if (request.type === 'scroll') {
        iframeLeft.contentWindow.scrollTo(request.scrollLeft, request.scrollTop);
        iframeRight.contentWindow.scrollTo(request.scrollLeft, request.scrollTop);
      } else if (request.type === 'input') {
        const inputLeft = iframeLeft.contentDocument.getElementById(request.id);
        const inputRight = iframeRight.contentDocument.getElementById(request.id);
  
        if (inputLeft) {
          inputLeft.value = request.value;
        }
        if (inputRight) {
          inputRight.value = request.value;
        }
      }
    }
  }
  
  chrome.runtime.onMessage.addListener(handleMessage);
  
  if (!document.getElementById("split-screen-container")) {
    createSplitScreen();
  }
  
  function addEventListenersToIframe(iframe) {
    iframe.contentWindow.syncScrollEvents = function() {
      iframe.contentWindow.addEventListener('scroll', () => {
        chrome.runtime.sendMessage({
          type: 'scroll',
          scrollTop: iframe.contentWindow.document.documentElement.scrollTop,
          scrollLeft: iframe.contentWindow.document.documentElement.scrollLeft
        });
      });
    };
  
    iframe.contentWindow.syncInputEvents = function() {
      iframe.contentDocument.querySelectorAll('input, textarea').forEach((input) => {
        input.addEventListener('input', () => {
          chrome.runtime.sendMessage({
            type: 'input',
            id: input.id,
            value: input.value
          });
        });
      });
    };
  
    iframe.contentWindow.syncScrollEvents();
    iframe.contentWindow.syncInputEvents();
  }
  