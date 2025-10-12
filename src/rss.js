import axios from 'axios';
import parser from './parser.js';

const buildProxyUrl = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get');
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);
  return proxyUrl.toString();
};

export default (url) => {
  const proxyUrl = buildProxyUrl(url);

  return axios.get(proxyUrl)
    .then((response) => {
      const { contents } = response.data;
      return parser(contents);
    })
    .catch((error) => {
      if (error.isParsingError) {
        const parsingError = new Error('errors.invalidRss');
        parsingError.key = 'errors.invalidRss';
        throw parsingError;
      }
      const networkError = new Error('errors.network');
      networkError.key = 'errors.network';
      throw networkError;
    });
};
