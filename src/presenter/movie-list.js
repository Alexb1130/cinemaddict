import {Counters, SortType} from '../const';
import {render, remove} from '../utils/render';
import {filter} from '../utils/filter';
import FilmsContainer from '../view/films-container';
import Button from '../view/button';
import Sort from '../view/sort';
import MoviePresenter from '../presenter/movie';
import {UserAction, UpdateType} from '../const.js';
import Loading from '../view/loading';
class MovieList {
  constructor(container, moviesModel, filterModel, api) {
    this._api = api;
    this._container = container;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._currentCardsRowCount = Counters.CARDS_ROW_COUNT;
    this._currentSortType = SortType.DEFAULT;
    this._showMoreButton = new Button();
    this._loadingComponent = new Loading();
    this._sort = null;
    this._filmsContainer = null;
    this._isLoading = true;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._moviePresenter = {};
  }

  get films() {
    const filterType = this._filterModel.getFilter();
    const films = this._moviesModel.films.slice();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {

      case SortType.DATE:
        const sortedFilmsByDate = filtredFilms.slice().sort((a, b) => a.release.date.getTime() <= b.release.date.getTime() ? 1 : -1);
        return sortedFilmsByDate;

      case SortType.RATING:
        const sortedFilmsByRating = filtredFilms.slice().sort((a, b) => a.rating <= b.rating ? 1 : -1);
        return sortedFilmsByRating;
    }

    return filtredFilms;
  }

  init() {

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderList();
  }

  destroy() {

    this._moviesModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);

    this._crearList({resetRenderedFilmsCount: true});
  }

  async _handleViewAction(actionType, updateType, update) {
    let updatedMovie = null;
    switch (actionType) {
      case UserAction.UPDATE_CARD:
        updatedMovie = await this._api.updateMovie(update)
        await this._moviesModel.updateFilm(updateType, updatedMovie);
        break;
      case UserAction.UPDATE_POPUP:
        updatedMovie = await this._api.updateMovie(update)
        await this._moviesModel.updateFilm(updateType, updatedMovie);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._moviePresenter[data.id].init(data);
        break;
      case UpdateType.MAJOR:
        this._crearList();
        this._renderList();
        break;
      case UpdateType.FILTER:
        this._crearList({resetRenderedFilmsCount: true});
        this._renderList();
        break;

      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderList();
        break;
    }
  }

  _renderLoading() {
    render(this._container, this._loadingComponent.element);
  }

  _renderList() {

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this.films;

    if (this._sort !== null) {
      this._sort = null;
    }

    if (this._filmsContainer !== null) {
      this._filmsContainer = null;
    }

    this._sort = new Sort(this._currentSortType);
    this._filmsContainer = new FilmsContainer(films);

    render(this._container, this._sort.element);
    render(this._container, this._filmsContainer.element);

    this._sort.setSortTypeChangeHandler(this._handleSortTypeChange);
    this._renderCards(films.slice(0, this._currentCardsRowCount));


    this._renderLoadMoreButton();
  }

  _crearList({resetRenderedFilmsCount = false} = {}) {
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter = {};

    remove(this._sort);
    remove(this._loadingComponent);
    remove(this._filmsContainer);
    remove(this._showMoreButton);

    if (resetRenderedFilmsCount) {
      this._currentCardsRowCount = Counters.CARDS_ROW_COUNT;
    }
  }

  _renderLoadMoreButton() {
    if (this.films.length > this._currentCardsRowCount) {
      render(this._filmsContainer.list, this._showMoreButton.element);
      this._showMoreButton.setControlClickHandler(this._onShowMoreButtonClick);
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentCardsRowCount = Counters.CARDS_ROW_COUNT;
    this._currentSortType = sortType;

    this._filmsContainer.listContainer.innerHTML = ``;
    this._renderCards(this.films.slice(0, this._currentCardsRowCount));
    this._renderLoadMoreButton();
  }

  _renderCards(films) {
    films.forEach((film) => {
      const moviePresenter = new MoviePresenter(this._filmsContainer.listContainer, this._handleViewAction, this._filterModel, this._api);
      this._moviePresenter[film.id] = moviePresenter;

      moviePresenter.init(film);
    });
  }

  _onShowMoreButtonClick(evt) {
    evt.preventDefault();

    const filmsCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmsCount, this._currentCardsRowCount + Counters.CARDS_ROW_COUNT);
    const films = this.films.slice(this._currentCardsRowCount, newRenderedFilmCount);

    this._renderCards(films);
    this._currentCardsRowCount = newRenderedFilmCount;

    if (this._currentCardsRowCount >= filmsCount) {
      evt.target.remove();
    }
  }
}

export default MovieList;
