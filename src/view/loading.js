import Abstract from './abstract';

const createFilmListTitleTemplate = () => {
  return `<h2 class="films-list__title">Loading...</h2>`;
};

export default class Loading extends Abstract {
  get template() {
    return createFilmListTitleTemplate();
  }
}
