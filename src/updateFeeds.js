import loadRss from './rss.js'

const getNewPosts = (loadedPosts, existingPosts) => {
  const existingLinks = new Set(existingPosts.map(post => post.link))
  return loadedPosts.filter(post => !existingLinks.has(post.link))
}

export default (state) => {
  const promises = state.feeds.map(feed => loadRss(feed.url)
    .then((data) => {
      const newPosts = getNewPosts(data.posts, state.posts)

      if (newPosts.length > 0) {
        const posts = newPosts.map((post, index) => ({
          id: `post_${feed.id}_${Date.now()}_${index}`,
          feedId: feed.id,
          title: post.title,
          description: post.description,
          link: post.link,
        }))

        return posts
      }

      return []
    })
    .catch(() => []))

  return Promise.all(promises)
    .then((results) => {
      const allNewPosts = results.flat()
      return allNewPosts
    })
}
