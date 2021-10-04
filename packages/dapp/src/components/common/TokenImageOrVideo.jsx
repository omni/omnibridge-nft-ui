import { Image as ChakraImage } from '@chakra-ui/react';
import NoImageAvailable from 'assets/no-image-available.svg';
import { useWeb3Context } from 'contexts/Web3Context';
import { fetchTokenUri } from 'lib/token';
import { fetchImageUri, uriToHttpAsArray } from 'lib/uriHelpers';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

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

export const TokenImageOrVideo = React.memo(({ token, ...props }) => {
  const { ethersProvider } = useWeb3Context();
  const tokenKey = useMemo(() => {
    const { address, chainId, tokenId } = token;
    return `${chainId}-${address.toLowerCase()}-${tokenId}`;
  }, [token]);

  const [uri, setUri] = useState('');
  useEffect(
    () => setUri(isOpensea(token) ? getOpenSeaUri(token) : token.tokenUri),
    [token],
  );
  const [, refresh] = useState(0);
  const [srcs, setSrcs] = useState([]);

  const src = srcs.find(s => !BAD_SRCS[s]);

  useEffect(() => {
    if (!uri) return;
    const oldSrcs = uriToHttpAsArray(uri);

    setSrcs(oldSrcs);

    const load = async () => {
      const newUris = await Promise.all(oldSrcs.map(fetchImageUri));
      const newSrcs = newUris
        .filter(u => !!u)
        .map(uriToHttpAsArray)
        .reduce((t, a) => [...t, ...a], []);

      if (newSrcs.length > 0) {
        setSrcs(newSrcs);
      }
    };
    const sessionSrc = sessionStorage.getItem(tokenKey);
    if (sessionSrc) {
      setSrcs([sessionSrc]);
    } else {
      load();
    }
  }, [uri, tokenKey]);

  const onError = useCallback(badSrc => {
    if (badSrc && !BAD_SRCS[badSrc]) {
      BAD_SRCS[badSrc] = true;
      refresh(i => i + 1);
    }
  }, []);

  const onLoad = useCallback(
    loadedSrc => {
      sessionStorage.setItem(tokenKey, loadedSrc);
    },
    [tokenKey],
  );

  useEffect(() => {
    const load = async () => {
      const { tokenUri } = await fetchTokenUri(ethersProvider, token);
      setUri(tokenUri);
    };
    if (srcs.length > 0 && !src) {
      load();
    }
  }, [src, srcs, token, ethersProvider]);

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
});
