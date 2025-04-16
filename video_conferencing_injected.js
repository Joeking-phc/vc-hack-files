function togglePip() {
  chrome.runtime.sendMessage({
    relayToNativePort: true,
    data: { action: 'toggle_float_for_top_window' },
  });
}
function replacePipTooltip(document) {
  if (!document || !document.evaluate) {
    return;
  }
  const divResult = document.evaluate(
    ".//div[contains(text(), 'Pop')]",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  const div = divResult.singleNodeValue;
  if (div) {
    div.textContent = "Toggle Picture-in-Picture";
  }
}
function hackPipInGoogleMeet() {
  document.addEventListener('click', (e) => {
    setTimeout(() => {
      var ulResult = document.evaluate(
       "//ul[contains(., 'picture-in-picture') or contains(., '画中画') or contains(., 'imagen en imagen')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      var ul = ulResult.singleNodeValue;

      if (ul) {
        var liResult = document.evaluate(
          ".//li[contains(., 'picture-in-picture') or contains(., '画中画') or contains(., 'imagen en imagen')]",
          ul,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        var li = liResult.singleNodeValue;

        if (li && !li.hasAttribute('jsaction') && e.target.id === 'vibe-toggle-pip-button') {
          chrome.runtime.sendMessage({
            relayToNativePort: true,
            data: { action: 'toggle_float_for_top_window' },
          });
        }
        if (li && li.hasAttribute('jsaction')) {
          const spanResult = document.evaluate(
            ".//span[contains(text(), 'Open picture-in-picture')]",
            li,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );

          const span = spanResult.singleNodeValue;
          if (span) {
            span.textContent = "Toggle picture-in-picture";
          }
          li.removeAttribute('jsaction');
          li.removeAttribute('delegate-controller');
          li.setAttribute('id', 'vibe-toggle-pip-button')
        }
      }
    }, 0);
  });
}

function hackPipInZoom() {
  const observer = new MutationObserver((mutationsList, observer) => {
    const iframe = document.querySelector("iframe#webclient");
    const btn = document.querySelector("button#fullscreen-pip-btn");
    if (btn) {
      btn.onclick = null;
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        chrome.runtime.sendMessage({
          relayToNativePort: true,
          data: { action: 'toggle_float_for_top_window' },
        });
      }
      replacePipTooltip(document);
    } else if (iframe) {
      const iframeDoc = iframe.contentDocument;
      if (iframeDoc) {
        const pipButton = iframeDoc.getElementById("fullscreen-pip-btn");
        if (pipButton) {
          pipButton.onclick = null;
          pipButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            chrome.runtime.sendMessage({
              relayToNativePort: true,
              data: { action: 'toggle_float_for_top_window' },
            });
          }
          replacePipTooltip(iframeDoc);
        }
      }
    }
  });
  observer.observe(document, { childList: true, subtree: true });
}

function _main_() {
  if (location.href.includes('google')) {
    hackPipInGoogleMeet();
  }
  if (location.href.includes('zoom')) {
    hackPipInZoom();
  }
}

_main_();
