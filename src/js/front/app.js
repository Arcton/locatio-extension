'use strict';

import * as dataExtractor from './pageDataExtractor';
import Card from './views/card';
import Container from './views/container';

function main() {
  let coords = dataExtractor.getPropertyCoords();
  console.log(coords);
  chrome.runtime.sendMessage({
    type: 'requestInfo',
    coords: coords
  }, function(response) {
    if (response.err) {
      // TODO: don't fail silently
    } else {
      createUI(response.data);
    }
  });
}

function createUI(data) {
  const listingEl = document.getElementById('ListingMainDetails');
  const containerEl = document.createElement('div');
  const container = new Container();
  container.addCard(new Card('test1'));
  container.addCard(new Card('test2'));
  container.addCard(new Card('test3'));
  container.render(containerEl);

  listingEl.parentElement.insertBefore(container.el, listingEl);
  // TODO: process response and display data
}

main();
