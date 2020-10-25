const generateRandomInt = (min, max) => {
  const length = max - min + 1;
  return Math.floor(Math.random() * length + min);
};

const getRandomIndexArr = (arr) => {
  return generateRandomInt(0, arr.length - 1);
};

const getRandomElementArr = (arr) => {
  return arr[getRandomIndexArr(arr)];
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomBoolean = (chance = 0.5) => {
  return Math.random() > chance;
};

const generateId = (id = ``) => {
  return `${id}-${(~~(Math.random() * 1e8)).toString(16)}`;
};

export {
  generateRandomInt,
  getRandomIndexArr,
  getRandomElementArr,
  getRandomDate,
  getRandomBoolean,
  generateId,
};
