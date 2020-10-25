import Smart from './smart';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import {makeTemplateGenerator} from '../utils/render';

const MAX_SCORE = 9;
const EMOJIS = [`smile`, `sleeping`, `puke`, `angry`];
const ratingValues = [...Array(MAX_SCORE).keys()];

const createCommentTemplate = (commentData) => {
  const {id, emotion, comment, author, date} = commentData;
  return (
    `<li class="film-details__comment" data-comment="${id}">
    <span class="film-details__comment-emoji">
      <img src="/images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${format(parseISO(date), `dd MMMM yyyy`)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
  );
};

const createRatingInput = (score) => {
  score = score + 1;
  return (
    `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${score}" id="rating-${score}">
    <label class="film-details__user-rating-label" for="rating-${score}">${score}</label>`
  );
};

const createGenre = (genre) => {
  return `<span class="film-details__genre">${genre}</span>`;
};

const createRatingInputs = makeTemplateGenerator(createRatingInput);

const createRatingContainer = (film) => {
  return (
    `<section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>
        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${film.poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>
          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${film.name}</h3>
            <p class="film-details__user-rating-feelings">How you feel it?</p>
            <div class="film-details__user-rating-score">
              ${createRatingInputs(ratingValues)}
            </div>
          </section>
        </div>
      </section>`
  );
};

const createEmoji = (emoji) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`
);

const createCommentsTemplates = makeTemplateGenerator(createCommentTemplate);

const createEmojisTemplates = makeTemplateGenerator(createEmoji);

const createPopupTemplate = (film, comments) => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${film.poster}" alt="${film.name}">
            <p class="film-details__age">${film.ageRating}+</p>
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${film.name}</h3>
                <p class="film-details__title-original">Original: ${film.alternativeTitle}</p>
              </div>
              <div class="film-details__rating">
                <p class="film-details__total-rating">${film.rating}</p>
                <p class="film-details__user-rating ${!film.personalRating ? `visually-hidden` : ``}">Your rate ${film.personalRating}</p>
              </div>
            </div>
            <table class="film-details__table">
              <tbody><tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${film.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${film.writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${film.actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${format(film.release.date, `dd MMMM yyyy`)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${film.duration.hours}h ${film.duration.minutes}m</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${film.release.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${createGenre(film.genres)}
                </td>
              </tr>
            </tbody></table>
            <p class="film-details__film-description">
              ${film.description}
            </p>
          </div>
        </div>
        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${film.isWatchListAdded ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${film.isWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${film.isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>
      <div class="form-details__middle-container ${!film.isWatched ? `visually-hidden` : ``}">
        ${createRatingContainer(film)}
      </div>
      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments
          <span class="film-details__comments-count">
            ${comments.length}
          </span>
          </h3>
          <ul class="film-details__comments-list">
            ${createCommentsTemplates(comments)}
          </ul>
          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label"></div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>
            <div class="film-details__emoji-list">
              ${createEmojisTemplates(EMOJIS)}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`
);

export default class Popup extends Smart {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;

    this._commentDeleteButtonClickHandler = this._commentDeleteButtonClickHandler.bind(this);
    this._personalRatingInputHandler = this._personalRatingInputHandler.bind(this);
  }

  updateElement({scrollTopPosition = 0} = {}) {
    super.updateElement();

    if (scrollTopPosition > 0) {
      this.element.scrollTop = scrollTopPosition;
    }
  }

  get template() {
    return createPopupTemplate(this._film, this._comments);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.element.querySelector(`.film-details__close-btn`).addEventListener(`click`, callback);
  }

  setAddToWatchlistButtonHandler(callback) {
    this._callback.addToWatchlistButtonHandler = callback;
    this.element.querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, callback);
  }

  setMarkAsWatchedButtonHandler(callback) {
    this._callback.markAsWatchedButtonHandler = callback;
    this.element.querySelector(`.film-details__control-label--watched`).addEventListener(`click`, callback);
  }

  setFavoriteButtonHandler(callback) {
    this._callback.favoriteButtonHandler = callback;
    this.element.querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, callback);
  }

  removeSibling() {
    if (document.body.querySelector(`.film-details`)) {
      document.body.querySelector(`.film-details`).remove();
    }
  }

  setPersonalRatingInputHandler(callback) {
    this._callback.personalRatingInputHandler = callback;
    this.element.querySelector(`.film-details__user-rating-score`).addEventListener(`input`, this._personalRatingInputHandler);
  }

  _personalRatingInputHandler({target}) {
    this._callback.personalRatingInputHandler(target.value);
    this.element.querySelector(`.film-details__user-rating-input[value="${target.value}"]`).checked = target.checked;
  }

  _commentDeleteButtonClickHandler(evt) {
    evt.preventDefault();
    evt.target.disabled = true;
    evt.target.textContent = `Deleting...`;
    const commentId = evt.target.closest(`.film-details__comment`).dataset.comment;
    this._callback.commentDeleteButtonClickHandler(evt.target, commentId);
  }

  resetCommentDeleteButtonState(target) {
    target.disabled = false;
    target.textContent = `Delete`;
  }

  setCommentDeleteButtonClickHandler(callback) {
    this._callback.commentDeleteButtonClickHandler = callback;
    this.element.querySelectorAll(`.film-details__comment-delete`).forEach((el) => {
      el.addEventListener(`click`, this._commentDeleteButtonClickHandler);
    });
  }

  get checkedEmoji() {
    return this.element.querySelector(`.film-details__emoji-item:checked`);
  }

  setEmotionInputHandler() {
    this.element.querySelector(`.film-details__emoji-list`).addEventListener(`input`, (evt) => {
      this.element.querySelector(`.film-details__add-emoji-label`).innerHTML = `<img src="/images/emoji/${evt.target.value}.png" width="55" height="55" alt="emoji"></img>`;
    });
  }

  setCommentsFormKeydownHandler(handler) {
    this._callback.commentsFormKeydownHandler = handler;
    document.addEventListener(`keydown`, handler);
  }

  restoreHandlers() {
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setAddToWatchlistButtonHandler(this._callback.addToWatchlistButtonHandler);
    this.setMarkAsWatchedButtonHandler(this._callback.markAsWatchedButtonHandler);
    this.setFavoriteButtonHandler(this._callback.favoriteButtonHandler);
    this.setCommentDeleteButtonClickHandler(this._callback.commentDeleteButtonClickHandler);
    this.setCommentsFormKeydownHandler(this._callback.commentsFormKeydownHandler);
    this.setPersonalRatingInputHandler(this._callback.personalRatingInputHandler);
  }

}
