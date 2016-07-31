import Card from './card';
import c3 from 'c3';
import * as d3 from 'd3';

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
      return d3.descending(a[1], b[1]);
    });

    let top = this.data.methods.slice(0, 3);

    chart.legend.hide('');

    top.forEach((t) => {
      chart.legend.show(t[0]);
    });

    // C3 is doing something weird - this is needed to render without having to resize the page
    // window.setTimeout(() => { chart.load({columns: [
    //     ['data', Math.round(((this.data.employed / this.data.totalEmployable) * 100) * 10) / 10]
    // ]}); }, 500);
  }

  _sortMethods() {
    // const sorted = d3.entries(this.data.methods).sort((a, b) => {
    //   return d3.descending(a.value, b.value);
    // });
    //
    // return sorted;
  }
}
