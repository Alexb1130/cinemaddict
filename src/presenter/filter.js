import {FilterType, UpdateType} from '../const';
import {filter} from "../utils/filter";
import {render, replace, remove} from "../utils/render";
import MainNav from '../view/main-nav';

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._currentFilter = null;

    this._mainNav = null;
    this._handleMenuClick = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(callback) {
    this._currentFilter = this._filterModel.getFilter();

    this._handleMenuClick = callback;

    const filters = this._getFilters();
    const prevFilterComponent = this._mainNav;

    this._mainNav = new MainNav(filters, this._currentFilter);
    this._mainNav.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._mainNav.setMenuClickHandler(this._handleMenuClick);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._mainNav.element);
      return;
    }

    replace(this._mainNav, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init(this._handleMenuClick);
  }

  _handleFilterTypeChange(filterType) {
    if (!filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.FILTER, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.films;

    return {
      all: filter[FilterType.ALL](films).length,
      watchList: filter[FilterType.WATCHLIST](films).length,
      watched: filter[FilterType.WATCHED](films).length,
      favorites: filter[FilterType.FAVORITES](films).length
    };
  }
}
