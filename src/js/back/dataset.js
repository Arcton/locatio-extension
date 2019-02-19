'use strict';

import $ from 'jquery';

export default function (areaUnit) {
  return function(callback) {
    $.ajax({
      url: `https://arcton.nz/locatio-data/data/${areaUnit}.json`,
      type: 'GET',
      dataType: 'json'
    })
      .done(callback)
      .fail(function() {
        callback(undefined);
      });
  };
}
