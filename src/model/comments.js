import Observer from '../utils/observer';

export default class Сomments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  get comments() {
    return this._comments;
  }

  setComments(updateType, comments) {
    this._comments = comments.slice();
    this._notify(updateType);
  }

  addComment(updateType, update) {
    this._comments.push(update);
    this._notify(updateType, update);
  }

  removeComment(updateType, update) {
    const index = this._comments.findIndex((it) => it.id === update);

    if (index > -1) {
      this._comments.splice(index, 1);
    }

    this._notify(updateType, update);
  }
}
