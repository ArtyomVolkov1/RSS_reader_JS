import 'bootstrap';
import render from './view.js';
import onChange from 'on-change';
import * as yup from 'yup';


const validateUrl = (url) => yup.string().trim().required().url();

export default () => {
  const state = {
    form: {
      status: 'filling',
      valid: true,
      error: null,
    },
    posts: [],
    feeds: [],
  };
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.form-control'),
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const input = formData.get('url');
    const schema = validateUrl(input);
    const watchedState = onChange(state, (path, value, previousValue) => {
      render(watchedState, elements);
    });
    schema
      .validate(input)
      .then(() => {
        watchedState.form.error = null;
        watchedState.form.status = 'sending';
      })
      .catch((error) => {
        watchedState.form.status = 'invalid';
        watchedState.form.error = error;
      });
    render(watchedState, elements);
  });
};
