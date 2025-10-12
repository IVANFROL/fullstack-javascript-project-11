import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import onChange from 'on-change';
import initialState from './state.js';
import view from './view.js';
import validate from './validate.js';

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    submitButton: document.querySelector('[type="submit"]'),
    feedback: document.querySelector('.feedback'),
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
      .then((validatedData) => {
        state.form.error = null;
        state.form.status = 'success';
        state.feeds.push({ url: validatedData.url, id: Date.now() });
        elements.form.reset();
        elements.input.focus();
      })
      .catch((error) => {
        state.form.error = error.message;
        state.form.status = 'error';
      });
  });
};

app();
