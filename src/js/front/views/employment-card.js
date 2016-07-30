import Card from './card';
import Quantizer from '../quantizer';
import c3 from 'c3';
import * as d3 from 'd3';

export default class EmploymentCard extends Card {

  constructor(data) {
    super();
    this.data = data;
    this.title = 'Employment';
    this.size = 2;
  }

  render() {
    super.render();
    const industries = this._sortIndustries();

    const htmlString = `
    <div class="lio-employment__main">
      <div class="lio-gauge"></div>
      <div class="lio-big-number-text">
        % employment rate
      </div>
    </div>
    <div class="lio-card__footer-text">
      <b>${industries[0].key}</b> is the most popular industry
      <span class="lio-small">(followed by <b>${industries[1].key}</b> and <b>${industries[2].key}</b>)</span>
    </div>
    `;

    this.contentEl.classList.add('lio-employment');
    this.contentEl.innerHTML = htmlString;

    return this;
  }

  afterAttached() {
    let chart = c3.generate({
      bindto: this.contentEl.querySelector('.lio-gauge'),
      data: {
        columns: [],
        type: 'gauge'
      },
      gauge: {
        label: {
          format: (value) => {
            return value;
          },
          show: false // to turn off the min/max labels.
        },
        width: 20 // for adjusting arc thickness
      },
      tooltip: {
        show: false
      },
      color: {
        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
        threshold: {
          values: [30, 60, 90, 100]
        }
      },
      size: {
        height: 80
      }
    });

    // C3 is doing something weird - this is needed to render without having to resize the page
    window.setTimeout(() => { chart.load({columns: [
        ['data', Math.round(((this.data.employed / this.data.totalEmployable) * 100) * 10) / 10]
    ]}); }, 500);
  }

  _sortIndustries() {
    const sorted = d3.entries(this.data.industries).sort((a, b) => {
      return d3.descending(a.value, b.value);
    });

    return sorted;
  }
}
