'use strict';

import $ from 'jquery';

function canonicaliseHostname(hostname) {
  if(hostname.indexOf("www.") === 0) {
    hostname = hostname.replace("www.", "");
  }
  hostname = hostname.toLowerCase();
  return hostname;
}

/**
 * Extracts the coordinates of the property from the page
 * @param {hostname} The website we're on
 * @return {Object} Object with lat and lng fields
 */
export function getPropertyCoords(hostname) {
  var selection;
  var coords = {};
  switch(canonicaliseHostname(hostname)) {
    case "trademe.co.nz":
      selection  = $('#ListingPropertyMapContainer_panMapContainer > script[type="text/javascript"]');
      for (let el of selection) {
        const re = /lat: (.*),\n\s*?lng: (.*),/gm;

        el.innerHTML.replace(re, ($0, $1, $2) => {
          coords.lat = $1;
          coords.lng = $2;
        });

        if (coords.lat && coords.lng) {
          return coords;
        }
      }
      break;
    case "lodge.co.nz":
      selection = $(".map .small")[0].src;
      selection = selection.split("|size:mid|")[1].split("&")[0];
      coords.lat = selection.split(",")[0];
      coords.lng = selection.split(",")[1];
      return coords;
  }
  return undefined;
}

/**
 * Extracts the element we should place the Locatio DIV above from the page depending on its hostname
 * @param {hostname} The website we're on
 * @return {Object} Element we should place the Locatio DIV above
 */
export function getSiblingElement(hostname) {
  switch(canonicaliseHostname(hostname)) {
    case "trademe.co.nz":
      return document.getElementById('ListingMainDetails');
    case "lodge.co.nz":
      return document.getElementById('tabs');
  }
  return undefined;
}
