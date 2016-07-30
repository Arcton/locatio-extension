'use strict';

import $ from 'jquery';

/**
 * Extracts the coordinates of the property from the page
 * @return {Object} Object with lat and lng fields
 */
export function getPropertyCoords() {
  const selection = $('#ListingPropertyMapContainer_panMapContainer > script[type="text/javascript"]');
  $.each(selection, (k, el) => {
    const re = /lat: (.*),\n\s*?lng: (.*),/gm;
    const coords = {};

    el.innerHTML.replace(re, ($0, $1, $2) => {
      coords.lat = $1;
      coords.lng = $2;
    });

    return coords;
  });
}
