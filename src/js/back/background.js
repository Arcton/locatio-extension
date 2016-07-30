'use strict';

import Location from './location';

function main() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.type) {
    case 'requestInfo':
      Location(
        request.coords.lat,
        request.coords.lng)(function (location) {
          sendResponse(location.data);
        });
      break;
    default:
      sendResponse({
        err: true
      });
    }

    return true; // prevents the callback from being called too early on return
  });
}

main();
