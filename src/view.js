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

// const renderPost = (state) => {
//   const posts = [];
//   state.posts.forEach((post) => {
//     const li = document.createElement('li');
//     li.classList.add(
//       'list-group-item',
//       'd-flex',
//       'justify-content-between',
//       'align-items-start',
//       'border-0',
//       'border-end-0',
//     );
//     const a = document.createElement('a');
//     a.setAttribute('href', post.link);
//     a.setAttribute('data-id', post.id);
//     a.setAttribute('target', '_blank');
//     a.setAttribute('rel', 'noopener noreferrer');
//     a.classList.add('fw-bold');
//     a.textContent = post.title;
//     li.append(a);
//     posts.push(li);
//   });
//   return posts;
// };

const render = (state, i18n, elements) => {
  const { input, form, feedback, divPosts, divFeeds } = elements;
  input.focus();
  form.reset();
  const renderPosts = () => {
    const cardBorder = document.createElement('div');
    cardBorder.classList.add('card', 'border-0');
    divPosts.append(cardBorder);
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBorder.append(cardBody);
    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = i18n.t('posts');
    cardBody.append(h2);
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    cardBorder.append(ul);
    state.posts.forEach((post) => {
      const li = document.createElement('li');
      li.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
        'border-0',
        'border-end-0'
      );
      const a = document.createElement('a');
      a.setAttribute('href', post.link);
      a.setAttribute('data-id', post.id);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.classList.add('fw-bold');
      a.textContent = post.title;
      li.append(a);
      ul.append(li);
    });
    // ul.append(...renderPost(state));
  };

  const renderFeeds = () => {
    const cardBorder = document.createElement('div');
    cardBorder.classList.add('card', 'border-0');
    divFeeds.append(cardBorder);
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBorder.append(cardBody);
    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = i18n.t('feeds');
    cardBody.append(h2);
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    cardBorder.append(ul);
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
      ul.append(li);
    });
  };

  const renderError = () => {
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
    input.style.border = '$danger';
    feedback.textContent = state.form.error;
    form.reset();
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

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'posts':
        renderPosts();
        break;
      case 'feeds':
        renderFeeds();
        break;
      case 'form.error':
        renderError();
        break;
      case 'form.valid':
        clearErrors();
        renderAdded();
        break;
      default:
        break;
    }
  });
  return watchedState;
};

export default render;
