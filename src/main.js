import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import * as bootstrap from 'bootstrap'
import onChange from 'on-change'
import createState from './state.js'
import view from './view.js'
import validate from './validate.js'
import loadRss from './rss.js'
import updateFeeds from './updateFeeds.js'
import i18n from './i18n.js'

const UPDATE_INTERVAL = 5000 // 5 секунд

const app = () => {
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

  const handlePostClick = (postId) => {
    state.uiState.viewedPostIds.add(postId)
    state.uiState.viewedPostIds = new Set(state.uiState.viewedPostIds)
  }

  const showModal = (postId) => {
    const post = state.posts.find((p) => p.id === postId)
    if (!post) return

    elements.modalTitle.textContent = post.title
    elements.modalBody.textContent = post.description
    elements.modalReadMoreLink.href = post.link
    elements.modalReadMoreLink.textContent = i18n.t('readMore')
    elements.modalCloseButton.textContent = i18n.t('close')

    handlePostClick(postId)
    modal.show()
  }

  elements.postsContainer.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-id]')
    if (button) {
      const postId = button.getAttribute('data-id')
      showModal(postId)
    }

    const link = e.target.closest('a[data-id]')
    if (link) {
      const postId = link.getAttribute('data-id')
      handlePostClick(postId)
    }
  })

  const runUpdates = () => {
    updateFeeds(state)
      .then((newPosts) => {
        if (newPosts.length > 0) {
          state.posts = [...newPosts, ...state.posts]
        }
      })
      .finally(() => {
        setTimeout(runUpdates, UPDATE_INTERVAL)
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
}

app()
