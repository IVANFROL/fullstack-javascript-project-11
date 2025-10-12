import * as yup from 'yup'
import i18n from './i18n.js'

yup.setLocale({
  string: {
    url: () => ({ key: 'errors.invalidUrl' }),
  },
  mixed: {
    required: () => ({ key: 'errors.required' }),
    notOneOf: () => ({ key: 'errors.duplicate' }),
  },
})

export default (url, feeds) => {
  const urls = feeds.map(feed => feed.url)

  const schema = yup.object().shape({
    url: yup
      .string()
      .required()
      .url()
      .notOneOf(urls),
  })

  return schema.validate({ url })
    .catch(error => {
      const errorKey = error.message.key || error.message
      const translatedError = new Error(i18n.t(errorKey))
      translatedError.key = errorKey
      throw translatedError
    })
}
