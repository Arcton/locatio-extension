'use strict';

import $ from 'jquery';

export default function (areaUnit) {
  return function(callback) {
    $.ajax({
      url: `https://rawgit.com/Arcton/locatio-data/master/data/${areaUnit}.json`,
      type: 'GET',
      dataType: 'json'
    })
      .done(callback)
      .fail(function() {
        callback(undefined);
      });
  };
}
