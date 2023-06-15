/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import { uniqueId, differenceBy } from 'lodash';
import resources from './locales/index.js';
import render from './view.js';
import parse from './parser.js';

const getData = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.append('disableCache', 'true');
  proxyUrl.searchParams.append('url', url);
  return axios.get(proxyUrl);
};

const preparingDataStorage = (data, watchedState) => {
  const { feed, posts } = data;
  const feedsId = uniqueId();
  feed.id = feedsId;
  posts.forEach((post) => {
    post.id = uniqueId();
    post.feedId = feed.id;
  });
  watchedState.feeds.push(feed);
  watchedState.posts.push(...posts);
};

const handleError = (error) => {
  if (error.isParseError) {
    return 'notRss';
  }
  if (error.request) {
    return 'networkError';
  }
  return error.message.key ?? 'unknown';
};

const updateRss = async (watchedState) => {
  const promises = watchedState.feeds.map((feed) => getData(feed.link).then((response) => {
    const { posts } = parse(response.data.contents);
    const postFromState = watchedState.posts.filter((post) => post.feedId === feed.id);
    const newPosts = differenceBy(posts, postFromState, 'link');
    newPosts.forEach((post) => {
      post.id = uniqueId();
      post.feedId = feed.id;
    });
    watchedState.posts.unshift(...newPosts);
    return newPosts;
  }));
  await Promise.all(promises);
  setTimeout(updateRss, 5000, watchedState);
};

export default () => {
  yup.setLocale({
    string: {
      url: () => ({ key: 'notValidUrl' }),
      required: () => ({ key: 'fields' }),
    },
    mixed: {
      notOneOf: () => ({ key: 'alreadyExists' }),
    },
  });
  const defaultLanguage = 'ru';
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modalHeader: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalFooter: document.querySelector('.full-article'),
  };

  const i18n = i18next.createInstance();
  i18n
    .init({
      lng: defaultLanguage,
      debug: false,
      resources,
    })
    .then(() => {
      const state = {
        form: {
          status: 'filling',
          error: null,
        },
        posts: [],
        feeds: [],
        uiState: {
          selectedPost: null,
          viewedPost: new Set(),
        },
      };
      const validater = (field) => yup.string().required().url().notOneOf(field);
      const watchedState = onChange(state, render(state, i18n, elements));
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
            const data = parse(response.data.contents, input);
            preparingDataStorage(data, watchedState);
            watchedState.form.status = 'added';
          })
          .catch((error) => {
            watchedState.form.error = handleError(error);
          });
      });

      elements.divPosts.addEventListener('click', (e) => {
        const {
          dataset: { id },
        } = e.target;
        if (id) {
          watchedState.uiState.viewedPost.add(id);
          watchedState.uiState.selectedPost = id;
        }
      });

      updateRss(watchedState);
    });
};
