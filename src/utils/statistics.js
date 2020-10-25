const inRange = (value, range) => value >= range.MIN && value <= range.MAX;

const MINUTES_IN_HOUR = 60;

const RankName = {
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie buff`
};

const RankValue = {
  NOVICE: {
    MIN: 1,
    MAX: 10
  },
  FAN: {
    MIN: 11,
    MAX: 20
  },
  MOVIE_BUFF: {
    MIN: 21,
    MAX: 50
  }
};

const getAllMoviesGenres = (movies) => {
  return movies.filter((film) => film.isWatched).flatMap((film) => film.genres);
};

export const getUserRank = (films) => {
  const watchedMovies = films.filter((film) => film.isWatched).length;

  if (inRange(watchedMovies, RankValue.NOVICE)) {
    return RankName.NOVICE;
  }
  if (inRange(watchedMovies, RankValue.FAN)) {
    return RankName.FAN;
  }
  if (inRange(watchedMovies, RankValue.MOVIE_BUFF)) {
    return RankName.MOVIE_BUFF;
  }
  return ``;
};

export const getAllWatchedMoviesTime = (movies) => {

  let totalDuration = {hours: 0, minutes: 0};

  if (movies.length) {
    const watchedFilms = movies.filter((film) => film.isWatched);

    if (watchedFilms.length) {
      const totalHours = watchedFilms.map((film) => film.duration.hours).reduce((sum, current) => sum + current);
      const totalMinutes = watchedFilms.map((film) => film.duration.minutes).reduce((sum, current) => sum + current);
      const runtime = (totalHours * MINUTES_IN_HOUR) + totalMinutes;

      const hours = (runtime / 60);
      const resultHours = Math.floor(hours);
      const resultMinutes = Math.round((hours - resultHours) * 60);

      totalDuration = {
        hours: resultHours,
        minutes: resultMinutes
      };
    }
  }
  return totalDuration;
};

export const getStatsData = (movies) => {
  let genresLabels = [];
  let values = [];
  let genresCounts = {};
  let max = 0;
  const allGenres = getAllMoviesGenres(movies);
  const topGenres = [];
  for (const genre of allGenres) {
    if (!genresCounts[genre]) {
      genresCounts[genre] = 1;
      genresLabels.push(genre);
    } else {
      genresCounts[genre] += 1;
    }
    if (genresCounts[genre] > max) {
      max = genresCounts[genre];
    }
  }
  for (const genre in genresCounts) {
    if (genresCounts[genre]) {
      values.push(genresCounts[genre]);
    }
  }
  for (const key in genresCounts) {
    if (genresCounts[key] === max) {
      topGenres.push(key);
    }
  }
  return {
    topGenre: topGenres[0] ? topGenres[0] : `no movies`,
    genresLabels,
    values
  };
};
