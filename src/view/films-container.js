import Abstract from './abstract';

const NO_DATA_MESSAGE = `There are no movies in our database`;

const createFilmsList = (films) => {
  if (!films.length) {
    return `<h2 class="films-list__title">${NO_DATA_MESSAGE}</h2>`;
  } else {
    return (
      `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>`
    );
  }
};

const createFilmsContainerTemplate = (films) => (
  `<section class="films">
    <section class="films-list">
      ${createFilmsList(films)}
    </section>
    <section class="films-list--extra visually-hidden">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container"></div>
    </section>
    <section class="films-list--extra visually-hidden">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container"></div>
    </section>
  </section>`
);

export default class FilmsContainer extends Abstract {
  constructor(films = []) {
    super();
    this._films = films;
  }

  get template() {
    return createFilmsContainerTemplate(this._films);
  }

  get list() {
    return this.element.querySelector(`.films-list`);
  }

  get listContainer() {
    return this.element.querySelector(`.films-list__container`);
  }

}
