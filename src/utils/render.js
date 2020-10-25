export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, child, place = RenderPosition.BEFOREEND) => {

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

export const renderTemplate = (container, component, position = `beforeend`) => {
  container.insertAdjacentHTML(position, component);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const replace = (newChild, oldChild) => {

  oldChild = oldChild.element;
  newChild = newChild.element;

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

export const makeTemplateGenerator = (generator) => {
  const reduceValues = (template, value) => {
    template += generator(value);
    return template;
  };

  return (values) => values.reduce(reduceValues, ``);
};

export const hideElement = (element) => element.classList.add(`visually-hidden`);

export const showElement = (element) => element.classList.remove(`visually-hidden`);

export const remove = (component) => {

  if (component === null) {
    return;
  }

  component.element.remove();
  component.removeElement();
};
