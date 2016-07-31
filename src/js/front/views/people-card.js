import Card from './card';
import Quantizer from '../quantizer';

const ratioQuantizer = new Quantizer(60000, 10000);

export default class PeopleCard extends Card {

  constructor(data) {
    super();
    this._processData(data);
    this.title = 'People';
    this.size = 2;
  }

  render() {
    super.render();

    const numberStudying =
      this.data.studying.fullTime +
      this.data.studying.partTime +
      this.data.studying.fullAndPart;

    const totalStudyingResponses = numberStudying + this.data.studying.notStudying;

    const htmlString = `
    <div class="lio-people__section">
      <div class="lio-big-number lio-big-number--${ratioQuantizer.quantize(this.data.medianIncome)}">$${Math.round(this.data.medianIncome/1000)}k</div>
      <div class="lio-big-number-text">
        median income
      </div>
    </div>
    <div class="lio-people__section">The median age is <b>${this.data.medianAge}</b>. Around <b>${
          Math.round((numberStudying / totalStudyingResponses) * 100)
        }%</b> of the population are students.</div>
    `;
    this.contentEl.classList.add('lio-people');
    this.contentEl.innerHTML = htmlString;
    return this;
  }

  _processData(d) {
    this.data = d;
  }
}
