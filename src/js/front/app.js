'use strict';

import * as dataExtractor from './pageDataExtractor';
import data from './sample-data.json';
import CrimeCard from './views/crime-card';
import Container from './views/container';

function main() {
  let coords = dataExtractor.getPropertyCoords();
  chrome.runtime.sendMessage({
    type: 'requestInfo',
    coords: coords
  }, function(response) {
    if (response.err) {
      // TODO: don't fail silently
    } else {
      createUI(data);
    }
  });
}

function createUI(data) {
  const listingEl = document.getElementById('ListingMainDetails');
  const containerEl = document.createElement('div');
  const container = new Container();
  container.addCard(new CrimeCard(data['crime']));
  container.render(containerEl);

  listingEl.parentElement.insertBefore(container.el, listingEl);
  // TODO: process response and display data
}

main();
