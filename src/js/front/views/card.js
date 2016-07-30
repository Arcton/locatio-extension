'use strict';

export default class Card {
  constructor(title) {
    this.title = title;
  }

  render() {
    this.el = document.createElement('div');
    this.el.innerHTML = `
      <p>${this.title}</p>
      <div></div>`;
    return this;
  }
}
