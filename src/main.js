import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import * as bootstrap from 'bootstrap'
import onChange from 'on-change'
import createState from './state.js'
import view, { handlePostClick, showModal } from './view.js'
import validate from './validate.js'
import loadRss from './rss.js'
import updateFeeds from './updateFeeds.js'
import { initPromise } from './i18n.js'

const UPDATE_INTERVAL = 5000 // 5 секунд

const app = () => {
  initPromise.then(() => {
    const elements = {
      form: document.querySelector('.rss-form'),
      input: document.querySelector('#url-input'),
      submitButton: document.querySelector('[type="submit"]'),
      feedback: document.querySelector('.feedback'),
      feedsContainer: document.querySelector('.feeds'),
      postsContainer: document.querySelector('.posts'),
      modal: document.querySelector('#modal'),
      modalTitle: document.querySelector('.modal-title'),
      modalBody: document.querySelector('.modal-body'),
      modalCloseButton: document.querySelector('.modal-footer .btn-secondary'),
      modalReadMoreLink: document.querySelector('.full-article'),
    }

    const state = onChange(createState(), (path) => {
      view(elements, state, path)
    })

    const modal = new bootstrap.Modal(elements.modal)

    elements.postsContainer.addEventListener('click', (e) => {
      const button = e.target.closest('button[data-id]')
      if (button) {
        const postId = button.getAttribute('data-id')
        showModal(postId, state, elements, modal)
      }

      const link = e.target.closest('a[data-id]')
      if (link) {
        const postId = link.getAttribute('data-id')
        handlePostClick(postId, state)
      }
    })

    const runUpdates = () => {
      const processId = Date.now()
      state.loadingState.processId = processId

      updateFeeds(state)
        .then((newPosts) => {
          if (state.loadingState.processId !== processId) return
          if (newPosts.length > 0) {
            state.posts = [...newPosts, ...state.posts]
          }
        })
        .finally(() => {
          if (state.loadingState.processId === processId) {
            setTimeout(runUpdates, UPDATE_INTERVAL)
          }
        })
    }

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault()

      const formData = new FormData(e.target)
      const url = formData.get('url').trim()

      state.form.status = 'processing'

      validate(url, state.feeds)
        .then(() => loadRss(url))
        .then((data) => {
          const feedId = `feed_${Date.now()}`
          const feed = {
            id: feedId,
            url,
            title: data.feed.title,
            description: data.feed.description,
          }

          const posts = data.posts.map((post, index) => ({
            id: `post_${feedId}_${index}`,
            feedId,
            title: post.title,
            description: post.description,
            link: post.link,
          }))

          state.feeds = [feed, ...state.feeds]
          state.posts = [...posts, ...state.posts]
          state.form.errorKey = null
          state.form.status = 'success'
          elements.form.reset()
          elements.input.focus()
        })
        .catch((error) => {
          state.form.errorKey = error.key || 'errors.unknown'
          state.form.status = 'error'
        })
    })

    setTimeout(runUpdates, UPDATE_INTERVAL)
  })
}

app()
