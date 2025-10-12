export default () => ({
  form: {
    status: 'filling', // filling, processing, success, error
    errorKey: null,
  },
  feeds: [],
  posts: [],
  uiState: {
    viewedPostIds: new Set(),
  },
});
