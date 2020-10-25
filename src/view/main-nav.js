import Abstract from './abstract';
import {FilterType, MenuItem} from '../const';

const createMainNavTemplate = (filmStats, currentFilterType = FilterType.ALL) => {

  return (
    `<nav class="main-navigation">
      <a href="#all" data-toggle="${MenuItem.LIST}" data-filter="${FilterType.ALL}" class="main-navigation__item ${currentFilterType === FilterType.ALL ? `main-navigation__item--active` : ``}">All movies</a>
      <a href="#watchlist" data-toggle="${MenuItem.LIST}" data-filter="${FilterType.WATCHLIST}" class="main-navigation__item ${currentFilterType === FilterType.WATCHLIST ? `main-navigation__item--active` : ``}">Watchlist <span class="main-navigation__item-count">${filmStats.watchList}</span></a>
      <a href="#history" data-toggle="${MenuItem.LIST}" data-filter="${FilterType.WATCHED}" class="main-navigation__item ${currentFilterType === FilterType.WATCHED ? `main-navigation__item--active` : ``}">History <span class="main-navigation__item-count">${filmStats.watched}</span></a>
      <a href="#favorites" data-toggle="${MenuItem.LIST}" data-filter="${FilterType.FAVORITES}" class="main-navigation__item ${currentFilterType === FilterType.FAVORITES ? `main-navigation__item--active` : ``}">Favorites <span class="main-navigation__item-count">${filmStats.favorites}</span></a>
      <a href="#stats" data-toggle="${MenuItem.STATS}" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainNav extends Abstract {

  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  get template() {
    return createMainNavTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener(`click`, this._filterTypeChangeHandler);
  }

  _menuClickHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    if (evt.target.dataset.toggle === MenuItem.STATS) {
      this.element.querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
      evt.target.classList.add(`main-navigation__item--active`);
    }

    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.toggle);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.element.addEventListener(`click`, this._menuClickHandler);
  }
}

