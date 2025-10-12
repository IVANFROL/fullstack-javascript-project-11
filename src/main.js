import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import onChange from 'on-change';
import initialState from './state.js';
import view from './view.js';
import validate from './validate.js';
import loadRss from './rss.js';

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    submitButton: document.querySelector('[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
  };

  const state = onChange(initialState, (path) => {
    view(elements, state, path);
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url').trim();

    state.form.status = 'processing';

    validate(url, state.feeds)
      .then(() => loadRss(url))
      .then((data) => {
        const feedId = `feed_${Date.now()}`;
        const feed = {
          id: feedId,
          url,
          title: data.feed.title,
          description: data.feed.description,
        };

        const posts = data.posts.map((post, index) => ({
          id: `post_${feedId}_${index}`,
          feedId,
          title: post.title,
          description: post.description,
          link: post.link,
        }));

        state.feeds = [feed, ...state.feeds];
        state.posts = [...posts, ...state.posts];
        state.form.errorKey = null;
        state.form.status = 'success';
        elements.form.reset();
        elements.input.focus();
      })
      .catch((error) => {
        state.form.errorKey = error.key || 'errors.unknown';
        state.form.status = 'error';
      });
  });
};

app();
