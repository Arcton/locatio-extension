'use strict';

import $ from 'jquery';

var KOORDINATES_API_KEY = '50336bf0169e4c748cf919549752cd21';
var KOORDINATES_MESHBLOCK_LAYER_2013 = '8578';

class Location {
  constructor(lat, lng, max_results, callback) {
    this.lat = lat;
    this.lng = lng;
    var ref = this;

    $.ajax({
      url: 'https://koordinates.com/services/query/v1/vector.json',
      type: 'GET',
      data: {
        key: KOORDINATES_API_KEY,
        layer: KOORDINATES_MESHBLOCK_LAYER_2013,
        x: lng,
        y: lat,
        max_results: max_results
      },
      dataType: 'json'
    })
      .done(function(json) {
        ref.data = json.vectorQuery.layers[KOORDINATES_MESHBLOCK_LAYER_2013].features;
        ref.areaUnits = [];
        for (var meshBlock of ref.data) {
          var areaUnit = meshBlock.properties.AU2013;
          if (ref.areaUnits.indexOf(areaUnit) === -1) {
            ref.areaUnits.push(areaUnit);
          }
        }
        ref.areaUnit = ref.areaUnits[0];
        Object.freeze(ref.areaUnits);
        Object.freeze(ref.areaUnit);
        callback(ref);
      })
      .fail(function() {
        callback(undefined);
      });
  }
}

export default function (lat, lng, max_results) {
  if (!max_results) {
    max_results = 1;
  }
  return function(callback) {
    new Location(lat, lng, max_results, callback);
  };
}
