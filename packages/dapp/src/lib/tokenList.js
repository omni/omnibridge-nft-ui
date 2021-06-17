import { gql, request } from 'graphql-request';

import { logError } from './helpers';

const getTokenUri = (tokenUri, tokenId) => {
  if (tokenUri && tokenId && /\{id\}/.test(tokenUri)) {
    return tokenUri.replace(/\{id\}/, tokenId.toString());
  }
  return tokenUri;
};

const eip721TokensQuery = gql`
  query Get721Tokens($owner: ID) {
    owner(id: $owner) {
      tokens {
        tokenUri: tokenURI
        tokenId: tokenID
        token: contract {
          address: id
          supportsMetadata: supportsEIP721Metadata
        }
      }
    }
  }
`;

export const fetch721TokenList = async (chainId, account, graphEndpoint) => {
  if (!account || !chainId || !graphEndpoint) return [];
  try {
    const data = await request(graphEndpoint, eip721TokensQuery, {
      owner: account.toLowerCase(),
    });
    if (
      data &&
      data.owner &&
      data.owner.tokens &&
      data.owner.tokens.length > 0
    ) {
      return data.owner.tokens
        .map(({ tokenUri, tokenId, token: { address, supportsMetadata } }) =>
          supportsMetadata && tokenUri
            ? {
                chainId,
                address,
                tokenId,
                tokenUri: getTokenUri(tokenUri, tokenId),
                amount: 1,
                is1155: false,
              }
            : undefined,
        )
        .filter(t => !!t);
    }
  } catch (graphError) {
    logError({
      graphError,
      chainId,
      owner: account.toLowerCase(),
      graphEndpoint,
    });
  }
  return [];
};

const eip1155TokensQuery = gql`
  query Get1155Tokens($owner: ID) {
    account(id: $owner) {
      balances {
        amount: value
        token {
          registry {
            address: id
          }
          tokenUri: URI
          tokenId: identifier
        }
      }
    }
  }
`;

export const fetch1155TokenList = async (chainId, account, graphEndpoint) => {
  if (!account || !chainId || !graphEndpoint) return [];
  try {
    const data = await request(graphEndpoint, eip1155TokensQuery, {
      owner: account.toLowerCase(),
    });
    if (
      data &&
      data.account &&
      data.account.balances &&
      data.account.balances.length > 0
    ) {
      return data.account.balances
        .map(
          ({
            token: {
              tokenUri,
              tokenId,
              registry: { address },
            },
            amount,
          }) =>
            tokenUri
              ? {
                  chainId,
                  address,
                  tokenId,
                  tokenUri: getTokenUri(tokenUri, tokenId),
                  amount,
                  is1155: true,
                }
              : undefined,
        )
        .filter(t => !!t);
    }
  } catch (graphError) {
    logError({
      graphError,
      chainId,
      owner: account.toLowerCase(),
      graphEndpoint,
    });
  }
  return [];
};
