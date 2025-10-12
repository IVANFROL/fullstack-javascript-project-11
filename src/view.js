import i18n from './i18n.js'

const renderFormStatus = (elements, status, errorKey) => {
  const { input, feedback, submitButton } = elements

  switch (status) {
    case 'filling':
      input.classList.remove('is-invalid')
      feedback.textContent = ''
      feedback.classList.remove('text-danger', 'text-success')
      submitButton.disabled = false
      break

    case 'processing':
      submitButton.disabled = true
      break

    case 'success':
      input.classList.remove('is-invalid')
      feedback.textContent = i18n.t('success')
      feedback.classList.remove('text-danger')
      feedback.classList.add('text-success')
      submitButton.disabled = false
      break

    case 'error':
      input.classList.add('is-invalid')
      feedback.textContent = i18n.t(errorKey)
      feedback.classList.remove('text-success')
      feedback.classList.add('text-danger')
      submitButton.disabled = false
      break

    default:
      throw new Error(`Unknown status: ${status}`)
  }
}

const renderFeeds = (elements, feeds) => {
  const { feedsContainer } = elements

  if (feeds.length === 0) {
    feedsContainer.innerHTML = ''
    return
  }

  const card = document.createElement('div')
  card.classList.add('card', 'border-0')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')

  const cardTitle = document.createElement('h2')
  cardTitle.classList.add('card-title', 'h4')
  cardTitle.textContent = i18n.t('feeds')

  cardBody.append(cardTitle)
  card.append(cardBody)

  const listGroup = document.createElement('ul')
  listGroup.classList.add('list-group', 'border-0', 'rounded-0')

  feeds.forEach(feed => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'border-0', 'border-end-0')

    const title = document.createElement('h3')
    title.classList.add('h6', 'm-0')
    title.textContent = feed.title

    const description = document.createElement('p')
    description.classList.add('m-0', 'small', 'text-black-50')
    description.textContent = feed.description

    li.append(title, description)
    listGroup.append(li)
  })

  card.append(listGroup)
  feedsContainer.innerHTML = ''
  feedsContainer.append(card)
}

const renderPosts = (elements, posts, viewedPostIds) => {
  const { postsContainer } = elements

  if (posts.length === 0) {
    postsContainer.innerHTML = ''
    return
  }

  const card = document.createElement('div')
  card.classList.add('card', 'border-0')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')

  const cardTitle = document.createElement('h2')
  cardTitle.classList.add('card-title', 'h4')
  cardTitle.textContent = i18n.t('posts')

  cardBody.append(cardTitle)
  card.append(cardBody)

  const listGroup = document.createElement('ul')
  listGroup.classList.add('list-group', 'border-0', 'rounded-0')

  posts.forEach(post => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

    const link = document.createElement('a')
    link.setAttribute('href', post.link)
    const fontWeightClass = viewedPostIds.has(post.id) ? 'fw-normal' : 'fw-bold'
    link.classList.add(fontWeightClass)
    link.setAttribute('data-id', post.id)
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
    link.textContent = post.title

    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
    button.setAttribute('data-id', post.id)
    button.setAttribute('data-bs-toggle', 'modal')
    button.setAttribute('data-bs-target', '#modal')
    button.textContent = i18n.t('viewPost')

    li.append(link, button)
    listGroup.append(li)
  })

  card.append(listGroup)
  postsContainer.innerHTML = ''
  postsContainer.append(card)
}

export default (elements, state, path) => {
  const {
    form, feeds, posts, uiState,
  } = state

  if (path === 'form.status' || path === 'form.errorKey') {
    renderFormStatus(elements, form.status, form.errorKey)
  }

  if (path === 'feeds') {
    renderFeeds(elements, feeds)
  }

  if (path === 'posts' || path === 'uiState.viewedPostIds') {
    renderPosts(elements, posts, uiState.viewedPostIds)
  }
}
