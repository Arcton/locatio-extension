import Card from './card';
import Quantizer from '../quantizer';

const ratioQuantizer = new Quantizer(20, 0);

export default class PokemonCard extends Card {

  constructor(data) {
    super();
    this.data = data;
    this.title = 'Pokemon Go';
    this.size = 2;
  }

  render() {
    super.render();

    const htmlString = `
    <div class="lio-card__section">
      <div class="lio-big-number lio-big-number--${ratioQuantizer.quantize(this.data)}">${this.data}</div>
      <div class="lio-big-number-text">
        Pokemon nearby
      </div>
    </div>
    `;
    this.contentEl.classList.add('lio-pokemon');
    this.contentEl.innerHTML = htmlString;
    return this;
  }
}
