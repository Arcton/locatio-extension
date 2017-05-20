'use strict';

import * as dataExtractor from './pageDataExtractor';
// import data from './sample-data.json';
import CrimeCard from './views/crime-card';
import EmploymentCard from './views/employment-card';
import PeopleCard from './views/people-card';
import TransportCard from './views/transport-card';
import Container from './views/container';
import Loader from './views/loader';

function main() {
  let coords = dataExtractor.getPropertyCoords(window.location.hostname);
  let listingEl = dataExtractor.getBrotherElement(window.location.hostname);
  
  if (coords.lat && coords.lng) {
    const container = new Container();
    const containerEl = document.createElement('div');
    listingEl.parentElement.insertBefore(containerEl, listingEl);
    showLoader(container, containerEl);

    chrome.runtime.sendMessage({
      type: 'requestInfo',
      coords: coords
    }, function(response) {
      if (response.err) {
        // TODO: don't fail silently
        console.log(response);
      } else {
        createUI(response.data, container, containerEl);
      }
    });
  }
}

function createUI(data, container, containerEl) {
  data = _processData(data);
  container.clearAll();
  container.addCard(new CrimeCard(data.crime));
  container.addCard(new EmploymentCard(data.employment));
  container.addCard(new PeopleCard(data.people));
  container.addCard(new TransportCard(data.transport));
  container.render(containerEl);
}

function showLoader(container, containerEl) {
  container.addCard(new Loader());
  container.render(containerEl);
}

/**
 * Extracts the data into a more useful format
 * @return {object} Delicious data
 */
function _processData(data) {
  const processedData = {
    crime: data['crime'],
    employment: {
    },
    people: {
    },
    transport: {
    }
  };

  let labourForce = data['census-individual-part-3a']['2013 Census, work and labour force status,(2) for the census usually resident population count aged 15 years and over(1)'];
  processedData.employment.employed = (labourForce['Employed Part-time'] + labourForce['Employed Full-time']);
  processedData.employment.totalEmployable = processedData.employment.employed + labourForce['Unemployed'];
  processedData.employment.industries = data['census-individual-part-3a']['2013 Census, industry (ANZSIC96 division),(18)(19) for the employed census usually resident population count aged 15 years and over(1)'];
  delete processedData.employment.industries['Total people stated'];
  delete processedData.employment.industries['Total people'];

  // People
  processedData.people.medianIncome = data['census-individual-part-2']['2013 Census, total personal income (grouped),(21)(22) for the census usually resident population count aged 15 years and over(1)']['Median personal income ($)(23)(27)'];
  processedData.people.medianAge = data['census-individual-part-1']['2013 Census, age in five-year groups, for the census usually resident population count(1)']['Median Age(3)'];
  const studyStats = data['census-individual-part-2']['2013 Census, study participation,(18) for the census usually resident population count aged 15 years and over(1)']
  processedData.people.studying = {
    fullTime: studyStats['Full-time Study(19)'],
    partTime: studyStats['Part-time Study(20)'],
    fullAndPart: studyStats['Full-time and Part-time Study'],
    notStudying: studyStats['Not Studying'],
    notStated: studyStats['Not stated']
  }

  let tm = data['census-individual-part-3b']['2013 Census, main means of travel to work, for the employed census usually resident population count aged 15 years and over(1)'];
  // Transport
  processedData.transport.methods = [
    ['Car, Truck or Van', tm['Drove a Private Car, Truck or Van'] + tm['Drove a Company Car, Truck or Van']],
    ['Train', tm['Train']],
    ['Motor Cycle or Power Cycle', tm['Motor Cycle or Power Cycle']],
    ['Public Bus', tm['Public Bus']],
    ['Other', tm['Other']],
    ['Walk or Jog', tm['Walked or Jogged']],
    ['Bicycle', tm['Bicycle']]
  ];
  return processedData;
}

main();
