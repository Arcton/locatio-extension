'use strict';

export default class Container {
  constructor() {
    this.cards = [];
  }

  render(container) {
    this.el = container;

    this.cards.forEach((card) => {
      this.el.appendChild(card.render().el);
    });

    return this;
  }

  addCard(card) {
    this.cards.push(card);
  }
}
