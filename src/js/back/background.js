'use strict';

import Location from './location';
import Dataset from './dataset';

function main() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.type) {
    case 'requestInfo':
      Location(
        request.coords.lat, request.coords.lng
      )(function (location) {
        if (location == null) {
          sendResponse({err: true});
        } else {
          Dataset(
            location.areaUnit
          )(function(dataset) {
            if (dataset == null) {
              sendResponse({err: true});
            } else {
              sendResponse({
                data: dataset
              });
            }
          });
        }
      });
      break;
    default:
      sendResponse({err: true});
    }

    return true; // prevents the callback from being called too early on return
  });
}

main();
