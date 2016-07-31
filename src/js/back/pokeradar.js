'use strict';

import $ from 'jquery';

export default function (lat, lng) {
  return function(callback) {
    $.ajax({
      url: 'https://www.pokeradar.io/api/v1/submissions',
      data: {
        zoomLevel: 18,
        latitude: lat,
        longitude: lng
      },
      type: 'GET',
      dataType: 'json'
    })
      .done(callback)
      .fail(function() {
        callback(undefined);
      });
  };
}
