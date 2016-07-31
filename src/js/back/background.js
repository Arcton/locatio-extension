'use strict';

import Location from './location';
import Dataset from './dataset';
import Pokeradar from './pokeradar';

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
                type: 'areaUnit',
                data: dataset
              });
            }
          });
        }
      });
      break;
    case 'requestPokemonInfo':
      Pokeradar(
        request.coords.lat,
        request.coords.lng
      )(function (response) {
        if (response == null || response.data == null) {
          sendResponse({err: true});
        } else {
          sendResponse({
            type: 'Pokemon',
            count: response.data.length
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
