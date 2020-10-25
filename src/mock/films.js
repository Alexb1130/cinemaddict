import {generateRandomInt, getRandomIndexArr, getRandomElementArr, getRandomDate, getRandomBoolean, generateId} from '../utils/common';

const description = {
  text: (`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`).split(`.`),
  amount: {
    min: 1,
    max: 3
  }
};

const names = [
  `Die Hard`,
  `The Transporter`,
  `The Dark Knight`,
  `The Bourne Identity`,
  `James Bond: Casino Royale`,
  `Suicide Squad`,
  `Hancock`,
  `The Terminator`,
  `Predator`,
  `Taken`,
  `Mission Impossible`,
  `Indiana Jones: Raiders of the Lost Ark`,
  `Gladiator`,
  `Tomb Raider`,
  `Lethal Weapon`,
];

const posters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const genres = [
  `Action`,
  `Animation`,
  `Comedy`,
  `Crime`,
  `Drama`,
  `Experimental`,
  `Fantasy`,
  `Historical`,
  `Drama`,
  `Film`,
  `Noir Mystery`
];

const generateCommentsTemplate = () => ({
  avatar: getRandomElementArr([`smile.png`, `sleeping.png`, `sleeping.png`, `angry.png`]),
  author: getRandomElementArr([`Tim Macoveev`, `John Doe`, `Peter Parker`, `Bruce Wayne`]),
  comment: getRandomElementArr([`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`]),
  day: `${generateRandomInt(1, 5)} days ago`
});

const generateComments = (films) => {
  const comments = [];
  for (const film of films) {
    comments.push(Object.assign({id: generateId()}, generateCommentsTemplate()));
  }
  return comments.splice(getRandomIndexArr(comments), generateRandomInt(0, comments.length));
};


const generateFilm = (film) => {
  return {
    id: generateId(),
    name: film,
    poster: `/images/posters/${getRandomElementArr(posters)}`,
    country: `USA`,
    description: description.text.slice(0, generateRandomInt(description.amount.min, description.amount.max)).join(`.`),
    duration: {
      hours: generateRandomInt(1, 2),
      minutes: generateRandomInt(0, 59),
    },
    genres: getRandomElementArr(genres),
    release: {
      date: getRandomDate(new Date(1960, 0, 1), new Date()),
    },
    isFavorite: getRandomBoolean(),
    isWatched: getRandomBoolean(),
    isWatchListAdded: getRandomBoolean(),
    rating: `${generateRandomInt(1, 9)}.${generateRandomInt(1, 9)}`,
    ageRating: `${generateRandomInt(6, 18)}`,
    comments: generateComments(names)
  };
};

const generateFilms = (films) => {
  return films.map(generateFilm);
};

const filmsData = generateFilms(names);

export {filmsData};
