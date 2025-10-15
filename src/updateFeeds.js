import loadRss from './rss.js'

const getNewPosts = (loadedPosts, existingPosts) => {
  const existingLinks = new Set(existingPosts.map(post => post.link))
  return loadedPosts.filter(post => !existingLinks.has(post.link))
}

const processFeed = (feed, existingPosts) => loadRss(feed.url)
  .then((data) => {
    const newPosts = getNewPosts(data.posts, existingPosts)
    return newPosts.map((post, index) => ({
      id: `post_${feed.id}_${Date.now()}_${index}`,
      feedId: feed.id,
      title: post.title,
      description: post.description,
      link: post.link,
    }))
  })
  .catch(() => [])

export default (state) => {
  if (state.feeds.length === 0) {
    return Promise.resolve([])
  }

  const promises = state.feeds.map(feed => processFeed(feed, state.posts))

  return Promise.all(promises)
    .then(results => results.flat())
}
