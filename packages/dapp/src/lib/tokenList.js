import { gql, request } from 'graphql-request';
import { logError } from 'lib/helpers';
import { fetchTokenInfo } from 'lib/token';
import { getTokenUri } from 'lib/tokenUri';

const eip721TokensQuery = gql`
  query Get721Tokens($owner: ID) {
    owner(id: $owner) {
      tokens {
        tokenUri: tokenURI
        tokenId: tokenID
        token: contract {
          address: id
          name
          symbol
        }
      }
    }
  }
`;

const eip721TokensQueryAccount = gql`
  query Get721Tokens($owner: ID) {
    owner: account(id: $owner) {
      tokens {
        tokenUri: uri
        tokenId: identifier
        token: registry {
          address: id
          name
          symbol
        }
      }
    }
  }
`;

const getEIP721TokensQuery = graphEndpoint => {
  if (
    graphEndpoint.includes('sunguru98') ||
    graphEndpoint.includes('dan13ram')
  ) {
    return eip721TokensQueryAccount;
  }
  return eip721TokensQuery;
};

export const fetch721TokenList = async (chainId, account, graphEndpoint) => {
  if (!account || !chainId || !graphEndpoint) return [];
  try {
    const data = await request(
      graphEndpoint,
      getEIP721TokensQuery(graphEndpoint),
      {
        owner: account.toLowerCase(),
      },
    );
    if (
      data &&
      data.owner &&
      data.owner.tokens &&
      data.owner.tokens.length > 0
    ) {
      return data.owner.tokens
        .map(({ tokenUri, tokenId, token: { address, name, symbol } }) => ({
          chainId,
          address,
          name,
          symbol,
          tokenId,
          tokenUri: getTokenUri(tokenUri, tokenId),
          amount: 1,
          is1155: false,
        }))
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
          }) => ({
            chainId,
            address,
            tokenId,
            tokenUri: getTokenUri(tokenUri, tokenId),
            amount,
            is1155: true,
          }),
        )
        .filter(t => !!t && t.amount > 0);
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

const NFT_TOKEN_INFO_LOCAL_KEY = 'nft-token-info';

export const getLocalTokenInfo = () => {
  const localTokenInfoString = window.localStorage.getItem(
    NFT_TOKEN_INFO_LOCAL_KEY,
  );
  return localTokenInfoString ? JSON.parse(localTokenInfoString) : {};
};

export const setLocalTokenInfo = localTokenInfo => {
  window.localStorage.setItem(
    NFT_TOKEN_INFO_LOCAL_KEY,
    JSON.stringify(localTokenInfo),
  );
};

export const fetchTokenInfoForAll = async (ethersProvider, tokens) => {
  const localTokenInfo = getLocalTokenInfo();
  const tokensWithInfo = await Promise.all(
    tokens.map(async token => {
      const { chainId, address, tokenId } = token;
      const tokenKey = `${chainId}-${address.toLowerCase()}-${tokenId}`;
      const tokenInfo = localTokenInfo[tokenKey];
      const newTokenInfo = await fetchTokenInfo(
        ethersProvider,
        tokenInfo,
        token,
      );
      return newTokenInfo;
    }),
  );
  tokensWithInfo.map(token => {
    const { chainId, address, tokenId } = token;
    const tokenKey = `${chainId}-${address.toLowerCase()}-${tokenId}`;
    localTokenInfo[tokenKey] = token;
    return token;
  });
  setLocalTokenInfo(localTokenInfo);
  return tokensWithInfo;
};
