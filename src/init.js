import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import render from './view.js';

export default () => {
  yup.setLocale({
    string: {
      url: () => ({ key: 'errors.validation.notValidUrl' }),
      notOneOf: () => ({ key: 'errors.validation.alreadyExists' }),
      required: () => ({ key: 'errors.validation.fields' }),
    },
    mixed: {
      required: () => ({ key: 'errors.validation.fields' }),
    },
  });
  const defaultLanguage = 'ru';
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };
  const state = {
    form: {
      status: null,
      valid: false,
      error: null,
    },
    posts: [],
    feeds: [],
  };
  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  })
    .then(() => {
      const schema = yup.string().required().url();
      const validate = (field) => schema.validate(field);
      const watchedState = render(state, i18n, elements);
      watchedState.form.status = 'filling';
      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const input = formData.get('url');
        validate(input)
          .then(() => {
            watchedState.form.error = null;
            watchedState.form.valid = true;
          })
          .catch((err) => {
            const validationErrors = err.errors.map((error) => i18n.t(error.key));
            watchedState.form.valid = false;
            watchedState.form.error = validationErrors;
            console.log(watchedState.form.error);
          });
      });
    });
};
