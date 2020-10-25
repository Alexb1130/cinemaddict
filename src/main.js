import {MenuItem, UpdateType} from './const';
import {render, remove} from './utils/render';
import MovieList from './presenter/movie-list';
import Filter from './presenter/filter';
import MoviesModel from './model/movies';
import FilterModel from './model/filter';
import Api from './api';

import Profile from './view/profile';
import Statistics from './view/statistics';

const AUTHORIZATION = `Basic eo1w590ik23849p`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

const movieListPresenter = new MovieList(mainElement, moviesModel, filterModel, api);
const filterPresenter = new Filter(mainElement, filterModel, moviesModel);

let statisticsComponent = null;
let profile = new Profile(moviesModel);

render(headerElement, profile.element);

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.LIST:
      remove(statisticsComponent);
      movieListPresenter.destroy();
      movieListPresenter.init();
      break;
    case MenuItem.STATS:
      movieListPresenter.destroy();
      statisticsComponent = new Statistics(moviesModel);
      render(mainElement, statisticsComponent.element);
      break;
  }
};

filterPresenter.init(handleMenuClick);
movieListPresenter.init();

api.getMovies()
  .then((filmsData) => {
    moviesModel.setFilms(UpdateType.INIT, filmsData);
    remove(profile);
    render(headerElement, new Profile(moviesModel).element);

    document.querySelector(`.footer .footer__statistics`).textContent = `${filmsData.length} movies inside`;
  })
  .catch(() => {
    moviesModel.setFilms(UpdateType.INIT, []);
    remove(profile);
    render(headerElement, new Profile(moviesModel).element);
    document.querySelector(`.footer .footer__statistics`).textContent = `0 movies inside`;
  });
