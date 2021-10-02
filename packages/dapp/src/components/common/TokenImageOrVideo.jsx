import { Image as ChakraImage } from '@chakra-ui/react';
import NoImageAvailable from 'assets/no-image-available.svg';
import { DEFAULT_IMAGE_TIMEOUT } from 'lib/constants';
import { fetchImageUri, uriToHttpAsArray } from 'lib/uriHelpers';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ImageOrVideo } from './ImageOrVideo';

const FallbackImage = props => (
  <ChakraImage
    src={NoImageAvailable}
    p="1.5rem"
    borderRadius="0.375rem"
    objectFit="contain"
    objectPosition="center"
    {...props}
  />
);

const BAD_SRCS = {};
const IMAGE_TIMEOUT = 'image-timeout';

const isENS = ({ address, chainId }) =>
  chainId === 1 &&
  address.toLowerCase() ===
    '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'.toLowerCase();

const isOpensea = isENS;

const getOpenSeaUri = ({ address, chainId, tokenUri, tokenId }) => {
  switch (chainId) {
    case 1:
      return `https://api.opensea.io/api/v1/asset/${address}/${tokenId}`;
    case 4:
      return `https://rinkeby-api.opensea.io/api/v1/asset/${address}/${tokenId}`;
    default:
      return tokenUri;
  }
};

export const TokenImageOrVideo = ({ token, ...props }) => {
  const uri = useMemo(
    () => (isOpensea(token) ? getOpenSeaUri(token) : token.tokenUri),
    [token],
  );
  const [, refresh] = useState(0);
  const [srcs, setSrcs] = useState([]);

  const src = useMemo(() => srcs.find(s => !BAD_SRCS[s]), [srcs]);
  const timer = useRef(null);

  useEffect(() => {
    const oldSrcs = uriToHttpAsArray(uri);

    setSrcs(oldSrcs);

    let isSubscribed = true;
    const load = async () => {
      const newUris = await Promise.all(oldSrcs.map(fetchImageUri));
      const newSrcs = newUris
        .filter(u => !!u)
        .map(uriToHttpAsArray)
        .reduce((t, a) => [...t, ...a], []);

      if (newSrcs.length > 0) {
        setSrcs(newSrcs);
      }
      timer.current = setTimeout(() => {
        if (isSubscribed) {
          sessionStorage.setItem(uri, IMAGE_TIMEOUT);
          setSrcs([]);
        }
      }, DEFAULT_IMAGE_TIMEOUT);
    };
    const sessionSrc = sessionStorage.getItem(uri);
    if (sessionSrc) {
      setSrcs(sessionSrc === IMAGE_TIMEOUT ? [] : [sessionSrc]);
    } else {
      load();
    }
    return () => {
      isSubscribed = false;
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [uri]);

  const onError = useCallback(badSrc => {
    if (badSrc) BAD_SRCS[badSrc] = true;
    refresh(i => i + 1);
  }, []);

  const onLoad = useCallback(
    loadedSrc => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      sessionStorage.setItem(uri, loadedSrc);
    },
    [uri],
  );

  if (src) {
    return (
      <ImageOrVideo
        src={src}
        onError={() => onError(src)}
        onLoad={() => onLoad(src)}
        {...props}
      />
    );
  }

  return <FallbackImage {...props} />;
};
