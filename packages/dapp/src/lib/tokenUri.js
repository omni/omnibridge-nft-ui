import { BigNumber, utils } from 'ethers';
import { gql, request } from 'graphql-request';
import { ADDRESS_ZERO } from 'lib/constants';
import { logError } from 'lib/helpers';

export const getTokenUri = (tokenUri, tokenId) => {
  if (tokenUri && tokenId && /\{id\}/.test(tokenUri)) {
    const tokenIdHex = utils
      .hexZeroPad(BigNumber.from(tokenId).toHexString(), 32)
      .slice(2);
    return tokenUri.replace(/\{id\}/, tokenIdHex);
  }
  return tokenUri;
};

const eip721TokenUrisQuery = gql`
  query Get721Tokens($token: ID, $tokenIds: [BigInt!]) {
    tokens(where: { contract: $token, tokenID_in: $tokenIds }) {
      tokenUri: tokenURI
      tokenId: tokenID
    }
  }
`;

const eip721TokenUrisQueryAccount = gql`
  query Get721Tokens($token: ID, $tokenIds: [BigInt!]) {
    tokens(where: { registry: $token, identifier_in: $tokenIds }) {
      tokenUri: uri
      tokenId: identifier
    }
  }
`;

const eip1155TokenUrisQuery = gql`
  query Get1155Tokens($token: ID, $tokenIds: [BigInt!]) {
    tokens(where: { registry: $token, identifier_in: $tokenIds }) {
      tokenUri: URI
      tokenId: identifier
    }
  }
`;

const getEIP721TokenUrisQuery = graphEndpoint => {
  if (
    graphEndpoint.includes('sunguru98') ||
    graphEndpoint.includes('dan13ram')
  ) {
    return eip721TokenUrisQueryAccount;
  }
  return eip721TokenUrisQuery;
};

const fetchTokenUris = async (endpoint, token, tokenIds, is1155) => {
  const query = is1155
    ? eip1155TokenUrisQuery
    : getEIP721TokenUrisQuery(endpoint);

  try {
    const data = await request(endpoint, query, {
      token,
      tokenIds,
    });
    if (data && data.tokens && data.tokens.length > 0) {
      return data.tokens.map(({ tokenUri, tokenId }) =>
        getTokenUri(tokenUri, tokenId),
      );
    }
  } catch (graphError) {
    logError({
      graphError,
      endpoint,
      token,
      tokenIds,
      is1155,
    });
  }
  return tokenIds.map(_id => '');
};

export const getRequestsWithTokenUris = async (
  chainId,
  requests,
  getEIP721GraphEndpoint,
  getEIP1155GraphEndpoint,
) => {
  const eip721endpoint = getEIP721GraphEndpoint(chainId);
  const eip1155endpoint = getEIP1155GraphEndpoint(chainId);
  const requestsWithTokenUris = await Promise.all(
    requests.map(async req => {
      const { values, nativeToken, tokenIds, tokenUris } = req;
      const is1155 = values.length > 0;
      const endpoint = is1155 ? eip1155endpoint : eip721endpoint;
      const newTokenUris =
        nativeToken === ADDRESS_ZERO
          ? tokenUris.map((uri, id) => getTokenUri(uri, tokenIds[id]))
          : await fetchTokenUris(endpoint, nativeToken, tokenIds, is1155);
      return {
        ...req,
        tokenUris: newTokenUris,
      };
    }),
  );
  return requestsWithTokenUris;
};
