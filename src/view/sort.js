import Smart from './smart';
import {SortType} from '../const';

const ACTIVE_SORT_CLASS_NAME = `sort__button--active`;

const createSortTemplate = (currentSortType) => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort=${SortType.DEFAULT} class="sort__button ${currentSortType === SortType.DEFAULT ? `sort__button--active` : ``}">Sort by default</a></li>
      <li><a href="#" data-sort=${SortType.DATE} class="sort__button ${currentSortType === SortType.DATE ? `sort__button--active` : ``}">Sort by date</a></li>
      <li><a href="#" data-sort=${SortType.RATING} class="sort__button ${currentSortType === SortType.RATING ? `sort__button--active` : ``}">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends Smart {

  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  get template() {
    return createSortTemplate(this._currentSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener(`click`, this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {

    if (!evt.target.dataset.sort) {
      return;
    }

    evt.preventDefault();
    const {target} = evt;

    if (!target.classList.contains(ACTIVE_SORT_CLASS_NAME)) {
      this.element.querySelector(`.${ACTIVE_SORT_CLASS_NAME}`).classList.remove(ACTIVE_SORT_CLASS_NAME);
      target.classList.add(ACTIVE_SORT_CLASS_NAME);
    }

    this._callback.sortTypeChange(target.dataset.sort);
  }

  restoreHandlers() {
    this.setSortTypeChangeHandler(this._callback.sortTypeChange);
  }
}
