import * as yup from 'yup';

export default (url, feeds) => {
  const urls = feeds.map((feed) => feed.url);

  const schema = yup.object().shape({
    url: yup
      .string()
      .required('Не должно быть пустым')
      .url('Ссылка должна быть валидным URL')
      .notOneOf(urls, 'RSS уже существует'),
  });

  return schema.validate({ url });
};
