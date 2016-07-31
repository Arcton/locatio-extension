import Card from './card';
import Quantizer from '../quantizer';

const ratioQuantizer = new Quantizer(0, 3);

export default class CrimeCard extends Card {

  constructor(data) {
    super();
    this._processData(data);
    this.title = 'Crime Rate';
    this.size = 2;
  }

  render() {
    super.render();

    const htmlString = `
    <div class="lio-crime__main">
      <div class="lio-big-number lio-big-number--${ratioQuantizer.quantize(this.data.ratio)}">${this.data.ratio}x</div>
      <div class="lio-big-number-text">
        the national average
        <br>
        <span class="lio-small">(assault, sexual assault, and robberies)</span>
      </div>
    </div>
    <div class="lio-card__footer-text"><b>${this.data.events}</b> assault and robberies occured in ${this.data.name}'s public places in 2015</div>
    `;
    this.contentEl.classList.add('lio-crime');
    this.contentEl.innerHTML = htmlString;
    return this;
  }

  _processData(d) {
    this.data = {
      ratio: d[' Rate_ratio_NZ_average_rate '],
      rate: d[' Rate_per_10000_population '],
      events: d['Victimisations_calendar_year_2015'],
      name: d['Area_unit_2013_label']
    };

    if (isNaN(parseFloat(this.data.ratio))) {
      if (isNaN(parseFloat(this.data.events))) {
        this.data.ratio = '?';
        this.data.events = 'An unknown number of';
      } else {
        this.data.ratio = 0;
      }
    }
  }
}
