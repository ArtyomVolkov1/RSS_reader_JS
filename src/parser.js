const parsePosts = (post) => {
  const title = post.querySelector('title').textContent;
  const description = post.querySelector('description').textContent;
  const link = post.querySelector('link').textContent;
  const pubDate = post.querySelector('pubDate').textContent;
  return {
    link,
    title,
    description,
    pubDate,
  };
};

const parse = (rss, url, i18n, state) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(rss, 'text/xml');
  const parseError = data.querySelector('parsererror');
  if (parseError) {
    let errors = new Error(parseError.textContent);
    errors = i18n.t('errors.validation.notRss');
    // eslint-disable-next-line no-param-reassign
    state.form.error = errors;
    throw errors;
  }
  const feedTitle = data.querySelector('title').textContent;
  const feedDescription = data.querySelector('description').textContent;
  const feed = {
    link: url,
    title: feedTitle,
    description: feedDescription,
  };
  const posts = [...data.querySelectorAll('item')].map(parsePosts);
  return { feed, posts };
};

export default parse;
