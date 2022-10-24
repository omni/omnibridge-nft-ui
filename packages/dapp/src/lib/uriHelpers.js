import axios from 'axios';
import { DEFAULT_IMAGE_TIMEOUT } from 'lib/constants';

const openseaAxios = axios.create({
  timeout: DEFAULT_IMAGE_TIMEOUT,
  headers: {
    'X-API-KEY': process.env.REACT_APP_OPENSEA_API_KEY,
  },
});

const defaultAxios = axios.create({
  timeout: DEFAULT_IMAGE_TIMEOUT,
});

const IPFS_URL_ADDON = `ipfs/`;
const IPNS_URL_ADDON = `ipns/`;
const URL_ADDON_LENGTH = 5;

const parseUri = uri => {
  let protocol = uri.split(':')[0].toLowerCase();
  let hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
  let name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
  if (uri.includes(IPFS_URL_ADDON)) {
    protocol = 'ipfs';
    const hashIndex = uri.indexOf(IPFS_URL_ADDON) + URL_ADDON_LENGTH;
    hash = uri.substring(hashIndex);
  } else if (uri.includes(IPNS_URL_ADDON)) {
    protocol = 'ipns';
    const hashIndex = uri.indexOf(IPNS_URL_ADDON) + URL_ADDON_LENGTH;
    name = uri.substring(hashIndex);
  } else if (uri.startsWith('Qm') && uri.length === 46) {
    protocol = 'ipfs';
    hash = uri;
  } else if (uri.includes('ipfs') && uri.includes('Qm')) {
    protocol = 'ipfs';
    const hashIndex = uri.indexOf('Qm');
    hash = uri.substring(hashIndex);
  }
  return { protocol, hash, name };
};

export const uriToHttpAsArray = uri => {
  if (!uri) return [];
  if (uri.startsWith('data')) return [uri];
  const { protocol, hash, name } = parseUri(uri);
  switch (protocol) {
    case 'https':
      return [uri];
    case 'http':
      return [`https${uri.substr(4)}`, uri];
    case 'ipfs':
      if (hash.startsWith('ipfs')) {
        const newHash = hash.split('/')[1];
        return [
          `https://ipfs.io/ipfs/${newHash}/`,
          `https://ipfs.infura.io/ipfs/${newHash}/`,
          `https://gateway.pinata.cloud/ipfs/${newHash}/`,
        ];
      }
      return [
        `https://ipfs.io/ipfs/${hash}/`,
        `https://ipfs.infura.io/ipfs/${hash}/`,
        `https://gateway.pinata.cloud/ipfs/${hash}/`,
      ];
    case 'ipns':
      return [
        `https://ipfs.infura.io/ipns/${name}/`,
        `https://gateway.pinata.cloud/ipns/${name}/`,
        `https://ipfs.io/ipns/${name}/`,
      ];
    default:
      return [];
  }
};

const JSON_STRING_PREFIX = 'data:application/json';

export const uriFromJson = jsonData => {
  const {
    image,
    // eslint-ignore-next-line camelcase
    image_url: imageUrl,
    // eslint-ignore-next-line camelcase
    image_thumbnail_url: imageThumbnailUrl,
  } = jsonData;
  return imageThumbnailUrl || imageUrl || image || '';
};

export const fetchImageUri = async tokenUri => {
  try {
    if (tokenUri.startsWith(JSON_STRING_PREFIX)) {
      const jsonString = tokenUri.substring(JSON_STRING_PREFIX.length + 1);
      return uriFromJson(jsonString);
    }
    const isOpensea = tokenUri.includes('api.opensea.io/api');

    const { data } = isOpensea
      ? await openseaAxios.get(tokenUri)
      : await defaultAxios.get(tokenUri);

    return uriFromJson(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching tokenUri', tokenUri, err);
    return '';
  }
};
