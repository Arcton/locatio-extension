'use strict';

function main() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    var xhttp = new XMLHttpRequest();
    var method = 'GET';

    xhttp.onload = () => {
      sendResponse(xhttp.responseText);
    };

    xhttp.onerror = () => {
      sendResponse('error');
    };

    xhttp.open(method, 'http://example.com', true);
    xhttp.send();
    return true; // prevents the callback from being called too early on return
  });
}


main();
