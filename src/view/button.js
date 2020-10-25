import Abstract from './abstract';

const createButtonTemplate = () => `<button class="films-list__show-more">Show more</button>`;

export default class Button extends Abstract {

  get template() {
    return createButtonTemplate();
  }

  setControlClickHandler(callback) {
    this._callback.setControlClick = callback;
    this.element.addEventListener(`click`, callback);
  }

}
