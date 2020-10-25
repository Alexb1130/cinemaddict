import Observer from '../utils/observer';

const filmRuntimeConvert = (runtime) => {
  const hours = (runtime / 60);
  const resultHours = Math.floor(hours);
  const minutes = (hours - resultHours) * 60;
  const retultMinutes = Math.round(minutes);

  return {
    hours: resultHours,
    minutes: retultMinutes,
    defaultValue: runtime
  };
};

export default class Movies extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  get films() {
    return this._films;
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index > -1) {
      this._films.splice(index, 1, update);
    }

    this._notify(updateType, update);
  }

  static adaptToClient(data) {
    return {
      id: data.id,
      name: data.film_info.title,
      alternativeTitle: data.film_info.alternative_title,
      poster: data.film_info.poster,
      rating: data.film_info.total_rating,
      ageRating: data.film_info.age_rating,
      director: data.film_info.director,
      writers: data.film_info.writers,
      actors: data.film_info.actors,
      release: {
        date: new Date(data.film_info.release.date),
        country: data.film_info.release.release_country
      },
      duration: filmRuntimeConvert(data.film_info.runtime),
      genres: data.film_info.genre,
      description: data.film_info.description,
      personalRating: data.user_details.personal_rating,
      isWatchListAdded: Boolean(data.user_details.watchlist),
      isWatched: Boolean(data.user_details.already_watched),
      watchingDate: new Date(data.user_details.watching_date),
      isFavorite: Boolean(data.user_details.favorite),
      comments: data.comments || [],
    };
  }

  static adaptToServer(data) {
    return {
      'id': data.id,
      'film_info': {
        'title': data.name,
        'alternative_title': data.alternativeTitle,
        'total_rating': data.rating,
        'poster': data.poster,
        'age_rating': data.ageRating,
        'director': data.director,
        'writers': data.writers,
        'actors': data.actors,
        'release': {
          'date': data.release.date.toJSON(),
          'release_country': data.release.country
        },
        'runtime': data.duration.defaultValue,
        'genre': data.genres,
        'description': data.description
      },
      'user_details': {
        'personal_rating': parseInt(data.personalRating, 10),
        'watchlist': data.isWatchListAdded,
        'already_watched': data.isWatched,
        'watching_date': data.watchingDate.toJSON(),
        'favorite': data.isFavorite
      },
      'comments': data.comments
    };
  }
}
