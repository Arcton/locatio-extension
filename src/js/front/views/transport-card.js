import Card from './card';
import c3 from 'c3';

export default class TransportCard extends Card {

  constructor(data) {
    super();
    this.data = data;
    this.title = 'Transport';
    this.size = 4;
  }

  render() {
    super.render();

    const htmlString = `
    <div class="lio-card__section">How people travel to work</div>
    <div class="lio-card__section">
      <div class="lio-donut"></div>
    </div>
    <div class="lio-card__section">
    </div>`;

    this.contentEl.classList.add('lio-transport');
    this.contentEl.innerHTML = htmlString;

    return this;
  }

  afterAttached() {
    let chart = c3.generate({
      bindto: this.contentEl.querySelector('.lio-donut'),
      data: {
        columns: this.data.methods,
        type : 'donut'
      },
      donut: {
        title: '',
        label: {
          show: false
        }
      },
      size: {
        height: 160
      },
      legend: {
        position: 'right'
      }
    });

    this.data.methods.sort((a, b) => {
      return  b[1] - a[1];
    });

    let top = this.data.methods.slice(0, 3);

    chart.legend.hide('');

    top.forEach((t) => {
      chart.legend.show(t[0]);
    });
  }
}
