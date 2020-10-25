import Smart from './smart';

const MAX_TEXT_LENGTH = 140;

const truncateText = (text) => {
  if (text.length > MAX_TEXT_LENGTH) {
    return text.substring(0, MAX_TEXT_LENGTH).concat(`...`);
  }

  return text;
};

const setControlState = (prop) => prop ? `film-card__controls-item--active` : ``;

const createCardTemplate = (film) => (
  `<article class="film-card" data-id="${film.id}">
      <h3 class="film-card__title">${film.name}</h3>
      <p class="film-card__rating">${film.rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${film.release.date.getFullYear()}</span>
        <span class="film-card__duration">${film.duration.hours}h ${film.duration.minutes}m</span>
        <span class="film-card__genre">${film.genres[0] || ``}</span>
      </p>
      <img src="${film.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${truncateText(film.description)}</p>
      <a class="film-card__comments">${film.comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item ${setControlState(film.isWatchListAdded)} button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item ${setControlState(film.isWatched)} button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item ${setControlState(film.isFavorite)} button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
);

export default class Card extends Smart {

  constructor(film) {
    super();
    this._film = film;
  }

  get template() {
    return createCardTemplate(this._film);
  }

  bindClickHandlers(callback) {
    this._callback.bindClicks = callback;
    this.element.querySelector(`.film-card__poster`).addEventListener(`click`, callback);
    this.element.querySelector(`.film-card__title`).addEventListener(`click`, callback);
    this.element.querySelector(`.film-card__comments`).addEventListener(`click`, callback);
  }

  setAddToWatchlistButtonHandler(callback) {
    this._callback.addToWatchlistButtonHandler = callback;
    this.element.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, callback);
  }

  setMarkAsWatchedButtonHandler(callback) {
    this._callback.markAsWatchedButtonHandler = callback;
    this.element.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, callback);
  }

  setFavoriteButtonHandler(callback) {
    this._callback.favoriteButtonHandler = callback;
    this.element.querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, callback);
  }

  restoreHandlers() {
    this.bindClickHandlers(this._callback.bindClicks);
    this.setAddToWatchlistButtonHandler(this._callback.addToWatchlistButtonHandler);
    this.setMarkAsWatchedButtonHandler(this._callback.markAsWatchedButtonHandler);
    this.setFavoriteButtonHandler(this._callback.favoriteButtonHandler);
  }
}
