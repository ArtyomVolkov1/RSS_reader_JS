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
};

const handleError = (error) => {
  if (error.isParseError) {
    return 'notRss';
  }
  return error.message.key ?? 'unknown';
};

// const updateRss = (watchedState) => {};

export default () => {
  yup.setLocale({
    string: {
      url: () => ({ key: 'notValidUrl' }),
    },
    mixed: {
      notOneOf: () => ({ key: 'alreadyExists' }),
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
      const validater = (field) => yup.string().url().notOneOf(field);
      const watchedState = render(state, i18n, elements);
      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const addedLink = watchedState.feeds.map((feed) => feed.link);
        const schema = validater(addedLink);
        const formData = new FormData(e.target);
        const input = formData.get('url');
        schema
          .validate(input)
          .then(() => {
            watchedState.form.status = 'valid';
            watchedState.form.error = null;
            return getData(input);
          })
          .then((response) => {
            // watchedState.form.status = 'valid';
            const data = parse(response.data.contents, input);
            watchedState.form.status = 'added';
            loadRss(data, watchedState);
          })
          .catch((error) => {
            // const validationErrors = error.errors.map((err) => i18n.t(err.key));
            // err.errors.map((error) => i18n.t(error.key))
            watchedState.form.error = handleError(error);
          });
      });
    });
  // updateRss(watchedState);
};
