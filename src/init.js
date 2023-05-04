import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import { uniqueId } from 'lodash';
import resources from './locales/index.js';
import render from './view.js';
import parse from './parser.js';

const getData = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.append('disableCache', 'true');
  proxyUrl.searchParams.append('url', url);
  return axios.get(proxyUrl);
};
const addId = (posts, feedId) => {
  posts.forEach((post) => {
    const editedPost = post;
    editedPost.id = uniqueId();
    editedPost.feedId = feedId;
    return editedPost;
  });
};
const loadRss = (data, watchedState) => {
  const { posts, feed } = data;
  feed.id = uniqueId();
  watchedState.feeds.push(feed);
  addId(posts, feed.id);
  watchedState.posts.push(...posts);
  console.log(watchedState.feeds);
  console.log(watchedState.posts);
};

// const updateRss = (watchedState) => {};

export default () => {
  yup.setLocale({
    string: {
      url: () => ({ key: 'errors.validation.notValidUrl' }),
      notOneOf: () => ({ key: 'errors.validation.alreadyExists' }),
    },
  });
  const defaultLanguage = 'ru';
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    divPosts: document.querySelector('.posts'),
    divFeeds: document.querySelector('.feeds'),
  };
  const state = {
    form: {
      status: 'filling',
      valid: false,
      error: null,
    },
    posts: [],
    feeds: [],
  };
  const i18n = i18next.createInstance();
  i18n
    .init({
      lng: defaultLanguage,
      debug: false,
      resources,
    })
    .then(() => {
      const validater = (field) => yup.string().required().url().notOneOf(field);
      const watchedState = render(state, i18n, elements);
      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const addedLink = watchedState.feeds.map((feed) => feed.link);
        const schema = validater(addedLink);
        const formData = new FormData(e.target);
        const input = formData.get('url');
        schema.validate(input)
          .then(() => {
            watchedState.form.error = null;
            watchedState.form.valid = true;
            return getData(input);
          })
          .then((response) => {
            const data = parse(response.data.contents, input, i18n, watchedState);
            console.log(data);
            loadRss(data, watchedState);
            watchedState.form.valid = true;
          })
          .catch((err) => {
            const validationErrors = err.errors.map((error) => i18n.t(error.key));
            watchedState.form.valid = false;
            watchedState.form.error = validationErrors;
          });
      });
    });
  // updateRss(watchedState);
};
