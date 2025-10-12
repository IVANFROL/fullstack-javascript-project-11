export default {
  form: {
    status: 'filling', // filling, processing, success, error
    error: null,
  },
  feeds: [],
  posts: [],
  uiState: {
    visitedLinks: new Set(),
  },
};
