// eslint-disable-next-line import/no-extraneous-dependencies
import onChange from 'on-change';

const renderFeed = (state) => {
  const feeds = [];
  state.feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    li.append(h3);
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    li.append(p);
    feeds.push(li);
  });
  return feeds;
};

const renderPost = (state) => {
  const posts = [];
  state.posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    const a = document.createElement('a');
    a.setAttribute('href', post.link);
    a.setAttribute('data-id', post.id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.classList.add('fw-bold');
    a.textContent = post.title;
    li.append(a);
    posts.push(li);
  });
  return posts;
};

const createPostList = (state, i18n, elements) => {
  const { divPosts } = elements;
  const cardBorderPost = document.createElement('div');
  cardBorderPost.classList.add('card', 'border-0');
  divPosts.append(cardBorderPost);
  const cardBodyPost = document.createElement('div');
  cardBodyPost.classList.add('card-body');
  cardBorderPost.append(cardBodyPost);
  const postTitle = document.createElement('h2');
  postTitle.classList.add('card-title', 'h4');
  postTitle.textContent = i18n.t('titles.posts');
  cardBodyPost.append(postTitle);
  const postList = document.createElement('ul');
  postList.classList.add('list-group', 'border-0', 'rounded-0');
  cardBorderPost.append(postList);
  postList.append(...renderPost(state));
  return cardBorderPost;
};

const createFeedList = (state, i18n, elements) => {
  const { divFeeds } = elements;
  const cardBorderFeeds = document.createElement('div');
  cardBorderFeeds.classList.add('card', 'border-0');
  divFeeds.append(cardBorderFeeds);
  const cardBodyFeeds = document.createElement('div');
  cardBodyFeeds.classList.add('card-body');
  cardBorderFeeds.append(cardBodyFeeds);
  const feedTitle = document.createElement('h2');
  feedTitle.classList.add('card-title', 'h4');
  feedTitle.textContent = i18n.t('titles.feeds');
  cardBodyFeeds.append(feedTitle);
  const feedList = document.createElement('ul');
  feedList.classList.add('list-group', 'border-0', 'rounded-0');
  cardBorderFeeds.append(feedList);
  feedList.append(...renderFeed(state));
  return cardBorderFeeds;
};

const render = (state, i18n, elements) => {
  const {
    input, form, feedback, divPosts, divFeeds,
  } = elements;

  const renderPosts = () => {
    divPosts.innerHTML = '';
    const posts = createPostList(state, i18n, elements);
    divPosts.append(posts);
  };

  const renderFeeds = () => {
    divFeeds.innerHTML = '';
    const feeds = createFeedList(state, i18n, elements);
    divFeeds.append(feeds);
  };
  const renderError = () => {
    if (state.form.error === null) {
      return;
    }
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
    input.style.border = '$danger';
    feedback.textContent = i18n.t(`errors.${state.form.error}`);
    form.reset();
    input.focus();
  };
  const renderAdded = () => {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18n.t('already.successfully');
    input.style.border = null;
  };
  const clearErrors = () => {
    feedback.textContent = '';
  };

  const renderStatus = () => {
    switch (state.form.status) {
      case 'added':
        renderAdded();
        break;
      case 'valid':
        clearErrors();
        break;
      default:
        break;
    }
  };

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.status':
        renderStatus();
        break;
      case 'form.error':
        renderError();
        break;
      case 'posts':
        renderPosts();
        break;
      case 'feeds':
        renderFeeds();
        break;
      default:
        break;
    }
  });
  return watchedState;
};

export default render;
