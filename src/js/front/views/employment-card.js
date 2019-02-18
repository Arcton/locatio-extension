import Card from './card';
import c3 from 'c3';
import * as d3 from 'd3-collection';

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
    <div class="lio-card__section">
      <div class="lio-gauge"></div>
      <div class="lio-big-number-text">
        % employment rate
      </div>
    </div>
    <div class="lio-card__section">
      <b>${industries[0].key}</b> is the most popular industry
      <span class="lio-small">(followed by <b>${industries[1].key}</b> and <b>${industries[2].key}</b>)</span>
    </div>
    `;

    this.contentEl.classList.add('lio-employment');
    this.contentEl.innerHTML = htmlString;

    return this;
  }

  afterAttached() {
    if (this.rendered) {
      return;
    } else {
      this.rendered = true;
    }

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
        pattern: ['#ec2c15', '#fdbc1e', '#3a82d2', '#3ad2bf', '#9ede5b'], // the three color levels for the percentage values.
        threshold: {
          values: [80, 85, 90, 95, 100]
        }
      },
      size: {
        height: 93
      },
	  legend: {
        show: false
      },
	  padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });

    // C3 is doing something weird - this is needed to render without having to resize the page
    window.setTimeout(() => { chart.load({columns: [
        ['data', Math.round(((this.data.employed / this.data.totalEmployable) * 100) * 10) / 10]
    ]}); }, 500);
  }

  _sortIndustries() {
    const sorted = d3.entries(this.data.industries).sort((a, b) => {
      return b.value - a.value;
    });

    return sorted;
  }
}
