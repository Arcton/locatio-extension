'use strict';

import $ from 'jquery';

export default class Container {
  constructor(expandCallback) {
    this.cards = [];
    this.expandCallback = expandCallback;
  }

  render(container) {
    this.el = container;
    this.el.className = 'lio-container';

    const fragment = document.createDocumentFragment();

    let rowSize = 0;
    let row;
    let rows = [];

    this.cards.forEach((card) => {
      if (rowSize === 0) {
        row = document.createElement('div');
        row.className = 'lio-grid-row';
        fragment.appendChild(row);
        rows.push(row);
        rowSize += card.getSize();
      } else if (rowSize + card.getSize() >= 6) {
        rowSize = 0;
      } else {
        rowSize += card.getSize();
      }

      const cell = document.createElement('div');
      cell.className = `lio-grid-cell-${card.getSize()}`;
      cell.appendChild(card.render().el);
      row.appendChild(cell);
    });

    if (rows.length > 1) {
      const showMore = document.createElement('div');
      showMore.className = 'lio-expander';
      showMore.innerHTML = 'Show More';
      fragment.appendChild(showMore);

      for (let r of rows) {
        $(r).hide();
      }

      $(rows[0]).show();

      $(showMore).click(() => {
        rows.forEach((r) => {
          $(r).show();
          $(showMore).hide(500);
        });

        if (this.expandCallback) {
          this.expandCallback();
        }

        this.cards.forEach((card) => {
          if (card.afterAttached != null) {
            card.afterAttached();
          }
        });
      });
    }

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

  clearAll() {
    this.cards = [];
    this.el.innerHTML = '';
  }
}
