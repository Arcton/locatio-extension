'use strict';

import Location from './location';

function main() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    Location(-37.7868046, 175.3195688)(function (location) {
      sendResponse(location.data);
    });

    return true; // prevents the callback from being called too early on return
  });
}

main();
