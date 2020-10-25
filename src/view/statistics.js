import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import isToday from 'date-fns/isToday';
import isThisWeek from 'date-fns/isThisWeek';
import isThisMonth from 'date-fns/isThisMonth';
import isThisYear from 'date-fns/isThisYear';
import Smart from './smart';
import {getUserRank, getAllWatchedMoviesTime, getStatsData} from '../utils/statistics';

const BAR_HEIGHT = 50;

const Period = {
  DEFAULT: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const renderChart = (statisticCtx, dataLabels, dataValues) => {
  // Be sure to calculate the canvas height, it depends on the number of chart elements
  statisticCtx.height = BAR_HEIGHT * 5;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: dataLabels,
      datasets: [{
        data: dataValues,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
        barThickness: 24
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticsTemplate = (films, period) => {

  const watchedMovies = films.filter((film) => film.isWatched);
  const totalDuration = getAllWatchedMoviesTime(films);
  const {topGenre} = getStatsData(films);

  const profile = {
    rank: getUserRank(films)
  };

  return (`<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${profile.rank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${period === Period.DEFAULT ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${period === Period.TODAY ? `checked` : ``}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${period === Period.WEEK ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${period === Period.MONTH ? `checked` : ``}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${period === Period.YEAR ? `checked` : ``}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedMovies.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalDuration.hours} <span class="statistic__item-description">h</span> ${totalDuration.minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`);
};

export default class Statistics extends Smart {
  constructor(moviesModel) {
    super();
    this._films = moviesModel.films;
    this._filmsDataByPeriod = this._films;
    this._period = Period.DEFAULT;
    this._chart = null;
    this._statisticFiltersChangeHandler = this._statisticFiltersChangeHandler.bind(this);
    this._setChart();
    this._setStatisticFiltersChangeHandler();
  }

  removeElement() {
    super.removeElement();

    if (this._chart !== null) {
      this._chart = null;
    }
  }

  _statisticFiltersChangeHandler(evt) {
    evt.preventDefault();
    this._period = evt.target.value;
    this._getStatisticFromPeriood();
    this.updateData(this._filmsDataByPeriod);
  }

  _setStatisticFiltersChangeHandler() {
    this.element.querySelector(`.statistic__filters`).addEventListener(`change`, this._statisticFiltersChangeHandler);
  }

  _getStatisticFromPeriood() {
    switch (this._period) {
      case Period.DEFAULT:
        this._filmsDataByPeriod = this._films;
        break;
      case Period.TODAY:
        this._filmsDataByPeriod = this._films.filter((item) => isToday(item.watchingDate));
        break;
      case Period.WEEK:
        this._filmsDataByPeriod = this._films.filter((item) => isThisWeek(item.watchingDate, {weekStartsOn: 1}));
        break;
      case Period.MONTH:
        this._filmsDataByPeriod = this._films.filter((item) => isThisMonth(item.watchingDate));
        break;
      case Period.YEAR:
        this._filmsDataByPeriod = this._films.filter((item) => isThisYear(item.watchingDate));
        break;
    }
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }
    const statisticCtx = this.element.querySelector(`.statistic__chart`);
    const {genresLabels, values} = getStatsData(this._filmsDataByPeriod);
    this._chart = renderChart(statisticCtx, genresLabels, values);
  }

  get template() {
    return createStatisticsTemplate(this._filmsDataByPeriod, this._period);
  }

  restoreHandlers() {
    this._setChart();
    this._setStatisticFiltersChangeHandler();
  }
}
