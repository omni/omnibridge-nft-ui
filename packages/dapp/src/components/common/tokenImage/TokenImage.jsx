import { Image } from 'components/common/tokenImage/Image';
import { Video } from 'components/common/tokenImage/Video';
import React, { useMemo } from 'react';

const isVideoToken = ({ address, chainId }) =>
  chainId === 1 &&
  address.toLowerCase() ===
    '0x74ee68a33f6c9f113e22b3b77418b75f85d07d22'.toLowerCase();

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

export const TokenImage = React.memo(({ token, ...props }) => {
  const tokenUri = useMemo(
    () => (isOpensea(token) ? getOpenSeaUri(token) : token.tokenUri),
    [token],
  );

  const renderVideo = isVideoToken(token);
  return renderVideo ? (
    <Video uri={tokenUri} {...props} />
  ) : (
    <Image uri={tokenUri} {...props} />
  );
});
