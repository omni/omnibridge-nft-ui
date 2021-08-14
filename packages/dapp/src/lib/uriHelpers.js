import { DEFAULT_IMAGE_TIMEOUT } from 'lib/constants';

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
          `https://ipfs.infura.io/ipfs/${newHash}/`,
          `https://gateway.pinata.cloud/ipfs/${newHash}/`,
          `https://ipfs.io/ipfs/${newHash}/`,
        ];
      }
      return [
        `https://ipfs.infura.io/ipfs/${hash}/`,
        `https://gateway.pinata.cloud/ipfs/${hash}/`,
        `https://ipfs.io/ipfs/${hash}/`,
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

const timeoutPromise = (ms, promise) =>
  new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('promise timeout'));
    }, ms);
    promise.then(
      res => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      err => {
        clearTimeout(timeoutId);
        reject(err);
      },
    );
  });

const JSON_STRING_PREFIX = 'data:application/json';

const uriFromJson = jsonString => {
  const {
    image,
    // eslint-ignore-next-line camelcase
    image_url: imageUrl,
    // eslint-ignore-next-line camelcase
    image_thumbnail_url: imageThumbnailUrl,
  } = JSON.parse(jsonString);
  return imageThumbnailUrl || imageUrl || image || '';
};

export const fetchImageUri = async tokenUri => {
  try {
    if (tokenUri.startsWith(JSON_STRING_PREFIX)) {
      const jsonString = tokenUri.substring(JSON_STRING_PREFIX.length + 1);
      return uriFromJson(jsonString);
    }
    const isOpensea = tokenUri.includes('api.opensea.io/api');

    const response = await timeoutPromise(
      DEFAULT_IMAGE_TIMEOUT,
      fetch(tokenUri, {
        headers: isOpensea
          ? { 'X-API-KEY': process.env.REACT_APP_OPENSEA_API_KEY }
          : undefined,
      }),
    );
    const text = await response.text();
    return uriFromJson(text);
  } catch (err) {
    return '';
  }
};
