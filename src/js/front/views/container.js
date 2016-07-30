'use strict';

export default class Container {
  constructor() {
    this.cards = [];
  }

  render(container) {
    this.el = container;
    this.el.className = 'lio-container';

    const fragment = document.createDocumentFragment();

    let rowSize = 0;
    let row;

    this.cards.forEach((card) => {
      if (rowSize === 0) {
        row = document.createElement('div');
        row.className = 'lio-grid-row';
        fragment.appendChild(row);
      } else if (rowSize + card.getSize() > 6) {
        rowSize = 0;
      }

      rowSize += card.getSize();

      const cell = document.createElement('div');
      cell.className = `lio-grid-cell-${card.getSize()}`;
      cell.appendChild(card.render().el);
      row.appendChild(cell);
    });

    this.el.appendChild(fragment);

    this.cards.forEach((card) => {
      if (card.afterAttached != null) {
        card.afterAttached();
      }
    });

    return this;
  }

  addCard(card) {
    this.cards.push(card);
  }
}
