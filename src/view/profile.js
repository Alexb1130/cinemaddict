import Abstract from './abstract';
import {getUserRank} from '../utils/statistics';

const createProfileTemplate = (films) => {

  const profile = {
    rank: getUserRank(films)
  };

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${profile.rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class extends Abstract {

  constructor(moviesModel) {
    super();
    this._films = moviesModel.films;
  }

  get template() {
    return createProfileTemplate(this._films);
  }
}
