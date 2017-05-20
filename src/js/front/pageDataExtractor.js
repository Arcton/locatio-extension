'use strict';

import $ from 'jquery';

/**
 * Extracts the coordinates of the property from the page
 * @return {Object} Object with lat and lng fields
 */
export function getPropertyCoords(hostname) {
  var selection;
  var coords = {};
  switch(hostname) {
    case "www.trademe.co.nz": {
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
    }
    case "www.lodge.co.nz": {
        selection = $(".map .small")[0].src; 
        selection = selection.split("|size:mid|")[1].split("&")[0];
        coords.lat = selection.split(",")[0];
        coords.lng = selection.split(",")[1];
        return coords;
      break;
    }
    return;
  }
}

/**
 * Extracts the element we should place the Locatio DIV above from the page depending on its hostname
 * @return {Object} Element we should place the Locatio DIV above
 */
export function getBrotherElement(hostname) {
  switch(hostname) {
    case "www.trademe.co.nz": {
      return document.getElementById('ListingMainDetails'); 
    }
    case "www.lodge.co.nz": {
      return document.getElementById('tabs'); 
    }
    return;
  }
}