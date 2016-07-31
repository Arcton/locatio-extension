import Card from './card';

export default class LoaderCard extends Card {

  constructor() {
    super();
    this.title = null;
    this.size = 6;
  }

  render() {
    super.render();

    const htmlString = `
    <div>
      Locatio is exploring the neighbourhood...
    </div>
    <span class="lio-loader__spinner">
    </span>
    `;

    this.contentEl.classList.add('lio-loader');
    this.contentEl.innerHTML = htmlString;

    return this;
  }
}
