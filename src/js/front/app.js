'use strict';

import * as dataExtractor from './pageDataExtractor';
import data from './sample-data.json';
import CrimeCard from './views/crime-card';
import EmploymentCard from './views/employment-card';
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
  data = _processData(data);
  const listingEl = document.getElementById('ListingMainDetails');
  const containerEl = document.createElement('div');
  const container = new Container();
  container.addCard(new CrimeCard(data.crime));
  container.addCard(new EmploymentCard(data.employment));
  container.render(containerEl);

  listingEl.parentElement.insertBefore(container.el, listingEl);
}

/**
 * Extracts the data into a more useful format
 * @return {object} Delicious data
 */
function _processData(data) {
  const processedData = {
    crime: data['crime'],
    employment: {
    }
  };

  let labourForce = data['census-individual-part-3a']['2013 Census, work and labour force status,(2) for the census usually resident population count aged 15 years and over(1)'];
  processedData.employment.employed = (labourForce['Employed Part-time'] + labourForce['Employed Full-time']);
  processedData.employment.totalEmployable = processedData.employment.employed + labourForce['Unemployed'];
  processedData.employment.industries = data['census-individual-part-3a']['2013 Census, industry (ANZSIC96 division),(18)(19) for the employed census usually resident population count aged 15 years and over(1)'];
  delete processedData.employment.industries['Total people stated'];
  delete processedData.employment.industries['Total people'];
  return processedData;
}

main();
