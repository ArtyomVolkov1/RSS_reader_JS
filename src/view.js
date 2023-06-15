// eslint-disable-next-line import/no-extraneous-dependencies
const createFeed = (state) => {
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

const createButton = (post, i18n) => {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('data-id', post.id);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.textContent = i18n.t('button.click');
  return button;
};

const createPost = (state, i18n) => {
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
    if (state.uiState.viewedPost.has(post.id)) {
      a.classList.add('fw-normal');
    } else {
      a.classList.add('fw-bold');
    }
    a.textContent = post.title;
    const button = createButton(post, i18n);
    li.append(a);
    li.append(button);
    posts.push(li);
  });
  return posts;
};

const createPostList = (state, i18n, elements) => {
  const { postsContainer } = elements;
  const cardBorderPost = document.createElement('div');
  cardBorderPost.classList.add('card', 'border-0');
  postsContainer.append(cardBorderPost);
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
  postList.append(...createPost(state, i18n));
  return cardBorderPost;
};

const createFeedList = (state, i18n, elements) => {
  const { feedsContainer } = elements;
  const cardBorderFeeds = document.createElement('div');
  cardBorderFeeds.classList.add('card', 'border-0');
  feedsContainer.append(cardBorderFeeds);
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
  feedList.append(...createFeed(state));
  return cardBorderFeeds;
};

const renderPosts = (state, i18n, elements) => {
  const { postsContainer } = elements;
  postsContainer.innerHTML = '';
  const posts = createPostList(state, i18n, elements);
  postsContainer.append(posts);
};

const renderFeeds = (state, i18n, elements) => {
  const { feedsContainer } = elements;
  feedsContainer.innerHTML = '';
  const feeds = createFeedList(state, i18n, elements);
  feedsContainer.append(feeds);
};

const renderError = (state, i18n, elements) => {
  const { feedback, input } = elements;
  if (state.form.error === null) {
    return;
  }
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  input.classList.add('is-invalid');
  input.style.border = '$danger';
  feedback.textContent = i18n.t(`errors.${state.form.error}`);
};

const renderAdded = (i18n, elements) => {
  const {
    feedback, input, submit, form,
  } = elements;
  submit.disabled = false;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = i18n.t('already.successfully');
  input.style.border = null;
  form.reset();
  input.focus();
};

const clearErrors = (elements) => {
  const { feedback, submit } = elements;
  submit.disabled = true;
  feedback.textContent = '';
};

const renderStatus = (state, i18n, elements) => {
  switch (state.form.status) {
    case 'added':
      renderAdded(i18n, elements);
      break;
    case 'valid':
      clearErrors(elements);
      break;
    default:
      break;
  }
};

const renderModalWindow = (state, elements, id) => {
  const { modalHeader, modalBody, modalFooter } = elements;
  const aEl = document.querySelector(`[data-id="${id}"]`);
  aEl.classList.remove('fw-bold');
  aEl.classList.add('fw-normal');
  const selectedPost = state.posts.find((post) => post.id === id);
  modalHeader.textContent = selectedPost.title;
  modalBody.textContent = selectedPost.description;
  modalFooter.setAttribute('href', `${selectedPost.link}`);
};

const render = (state, i18n, elements) => (path, value) => {
  switch (path) {
    case 'form.status':
      renderStatus(state, i18n, elements);
      break;
    case 'form.error':
      renderError(state, i18n, elements);
      break;
    case 'posts':
      renderPosts(state, i18n, elements);
      break;
    case 'feeds':
      renderFeeds(state, i18n, elements);
      break;
    case 'uiState.selectedPost':
      renderModalWindow(state, elements, value);
      break;
    default:
      break;
  }
};

export default render;
