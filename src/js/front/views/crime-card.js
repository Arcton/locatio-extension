import Card from './card';

export default class CrimeCard extends Card {

  constructor(data) {
    super();
    this.data = data;
    this.title = 'Crime';
    this.size = 2;
  }

  render() {
    super.render();

    this.contentEl.innerHTML = this.data['Rate_ratio_NZ_average_rate'];
    return this;
  }
}
