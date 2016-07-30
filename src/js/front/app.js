'use strict';

import * as dataExtractor from './pageDataExtractor';

function main() {
  let coords = dataExtractor.getPropertyCoords();

  chrome.runtime.sendMessage({
    type: 'requestInfo',
    coords: coords
  }, function(response) {
    if (response.err) {
      // TODO: don't fail silently
    } else {
      // TODO: process response and display data
    }
  });
}

main();
