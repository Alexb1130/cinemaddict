import {render, remove, replace} from '../utils/render';
import {generateId} from '../utils/common';
import PopupView from '../view/popup';
import CardView from '../view/card';
import {UserAction, UpdateType, FilterType} from '../const';
import CommentsModel from '../model/comments';

class Movie {
  constructor(container, changeData, filterModel, api) {
    this._api = api;
    this._popup = null;
    this._card = null;
    this._container = container;
    this._changeData = changeData;
    this._filterModel = filterModel;
    this._commentsModel = new CommentsModel();
    this._isMajorAction = false;
    this._deleteButtonTarget = null;
    this._currentPopupScroll = 0;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
    this._resetCommentDeleteButtonState = this._resetCommentDeleteButtonState.bind(this);

    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init(film) {
    this._film = film;
    this._renderCard(this._film);
  }

  async _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
          try {
            await this._api.addComment(this._film.id, update);
            await this._commentsModel.addComment(updateType, update);
            this._currentPopupScroll = this._popup.element.scrollTop;
          } catch (e) {
            this._popup.shake(() => {
              document.addEventListener(`keydown`, this._handleAddComment);
            })
          }
        break;

      case UserAction.REMOVE_COMMENT:
          try {
            await this._api.deleteComment(update);
            await this._commentsModel.removeComment(updateType, update);
            this._currentPopupScroll = this._popup.element.scrollTop;
          } catch (e) {
            this._popup.shake(this._resetCommentDeleteButtonState);
          }
        break;
    }

  }

  async _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MINOR:
        const comments = await this._api.getComments(this._film.id);
        await this._commentsModel.setComments(UpdateType.INIT_COMMENTS, comments);
        await this._renderPopup(this._film, this._commentsModel.comments);
        await this._renderCard(this._film);
        break;
      case UpdateType.INIT_COMMENTS:
        this._renderPopup(this._film, this._commentsModel.comments);
    }
  }

  _handleAddComment(evt) {
    if (evt.target.value && this._popup.checkedEmoji) {
      if (evt.key === `Enter` && evt.metaKey || evt.ctrlKey && evt.key === `Enter`) {

        const commentData = {
          emotion: this._popup.checkedEmoji.value,
          comment: evt.target.value,
          date: new Date().toJSON()
        };

        this._handleViewAction(UserAction.ADD_COMMENT, UpdateType.MINOR, commentData);
        document.removeEventListener(`keydown`, this._handleAddComment);

      }
    }
  }

  get _isMinorUpdate() {
    return this._filterModel.getFilter() === FilterType.ALL;
  }

  _renderPopup(film, comments) {
    const prevPopup = this._popup;

    this._popup = new PopupView(film, comments);

    this._popup.removeSibling();

    this._popup.setCommentsFormKeydownHandler(this._handleAddComment);
    this._popup.setEmotionInputHandler();

    this._popup.setCommentDeleteButtonClickHandler((target, commentId) => {
      this._deleteButtonTarget = target;
      this._handleViewAction(UserAction.REMOVE_COMMENT, UpdateType.MINOR, commentId);
    });

    this._popup.setCloseButtonClickHandler(() => {
      remove(this._popup);
      this._changeData(
          UserAction.UPDATE_POPUP,
          this._isMajorAction ? UpdateType.MAJOR : UpdateType.MINOR,
          film
      );
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    document.addEventListener(`keydown`, this._onEscKeyDown);

    this._popup.setAddToWatchlistButtonHandler(() => {
      this._isMajorAction = true;
      film.isWatchListAdded = !film.isWatchListAdded;
      this._changeData(UserAction.UPDATE_POPUP, UpdateType.MINOR, film);
    });

    this._popup.setMarkAsWatchedButtonHandler(() => {
      this._isMajorAction = true;

      film.isWatched = !film.isWatched;

      if (!film.isWatched) {
        film.personalRating = 0;
      }

      this._popup.updateElement({scrollTopPosition: this._popup.element.scrollTop});
      this._changeData(UserAction.UPDATE_POPUP, UpdateType.MINOR, film);
    });

    this._popup.setPersonalRatingInputHandler((value) => {
      film.personalRating = value;
      this._popup.updateElement({scrollTopPosition: this._popup.element.scrollTop});
      this._changeData(UserAction.UPDATE_POPUP, UpdateType.MINOR, film);
    });

    this._popup.setFavoriteButtonHandler(() => {
      this._isMajorAction = true;
      film.isFavorite = !film.isFavorite;
      this._changeData(UserAction.UPDATE_POPUP, UpdateType.MINOR, film);
    });

    if (prevPopup === null) {
      render(document.body, this._popup.element);
      return;
    }

    if (this._container.contains(prevPopup.element)) {
      replace(this._popup, prevPopup);
    }

    render(document.body, this._popup.element);

    if (this._currentPopupScroll > 0) {
      this._popup.element.scrollTop = this._currentPopupScroll;
    }

    remove(prevPopup);
  }

  _renderCard(film) {
    const prevCard = this._card;

    this._card = new CardView(film);

    this._card.bindClickHandlers(async () => {
      try {
        const comments = await this._api.getComments(film.id);
        this._commentsModel.setComments(UpdateType.INIT_COMMENTS, comments);
      } catch (e) {
        this._commentsModel.setComments(UpdateType.INIT_COMMENTS, []);
      }
    });

    this._card.setAddToWatchlistButtonHandler((evt) => {
      evt.preventDefault();
      film.isWatchListAdded = !film.isWatchListAdded;
      this._changeData(
          UserAction.UPDATE_CARD,
          this._isMinorUpdate ? UpdateType.MINOR : UpdateType.MAJOR,
          film
      );
    });

    this._card.setMarkAsWatchedButtonHandler((evt) => {
      evt.preventDefault();
      film.isWatched = !film.isWatched;

      if (!film.isWatched) {
        film.personalRating = 0;
      }

      this._changeData(
          UserAction.UPDATE_CARD,
          this._isMinorUpdate ? UpdateType.MINOR : UpdateType.MAJOR,
          film
      );
    });

    this._card.setFavoriteButtonHandler((evt) => {
      evt.preventDefault();
      film.isFavorite = !film.isFavorite;
      this._changeData(
          UserAction.UPDATE_CARD,
          this._isMinorUpdate ? UpdateType.MINOR : UpdateType.MAJOR,
          film
      );
    });

    if (prevCard === null) {
      render(this._container, this._card.element);
      return;
    }

    if (this._container.contains(prevCard.element)) {
      replace(this._card, prevCard);
    }

    remove(prevCard);
  }

  _resetCommentDeleteButtonState() {
    if (this._deleteButtonTarget !== null) {
      this._popup.resetCommentDeleteButtonState(this._deleteButtonTarget);
    }
  }

  destroy() {
    remove(this._popup);
    remove(this._card);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      remove(this._popup);
      this._changeData(
          UserAction.UPDATE_POPUP,
          this._isMajorAction ? UpdateType.MAJOR : UpdateType.MINOR,
          this._film
      );
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      document.removeEventListener(`keydown`, this._handleAddComment);
    }
  }
}

export default Movie;
