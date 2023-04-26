// eslint-disable-next-line import/no-extraneous-dependencies
// import onChange from 'on-change';

const render = (state, elements) => {
  elements.input.focus();
  elements.form.reset();
  const inputEL = elements.input;
  if (state.form.status === 'invalid') {
    inputEL.classList.add('is-invalid');
    inputEL.style.border = '$danger';
  } else if (state.form.status === 'sending') {
    inputEL.classList.remove('is-invalid');
    inputEL.style.border = null;
  }
};

export default render;
