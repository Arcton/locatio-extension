'use strict';

export default class Card {
  constructor() {
    this.title = 'Card';
    this.size = 2;
  }

  render() {
    this.el = document.createElement('div');
    this.el.className = 'lio-card';
    this.el.innerHTML = `<p class="lio-card__title">${this.title}</p>
      <div class="lio-card__content"></div>`;

    this.contentEl = this.el.querySelector('.lio-card__content');

    return this;
  }

  /**
   * @return {int} A value from 1 to 6 representing it number of columns the card occupies
   */
  getSize() {
    return this.size;
  }
}
