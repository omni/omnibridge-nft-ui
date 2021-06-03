import { gql, request } from 'graphql-request';

export const fetchTokenList = async (
  _chainId,
  homeEndpoint,
  foreignEndpoint,
) => {
  const tokens = fetchTokensFromSubgraph(homeEndpoint, foreignEndpoint);
  return tokens;
};

const homeTokensQuery = gql`
  query homeTokens {
    tokens(where: { homeAddress_contains: "0x" }, first: 1000) {
      chainId: homeChainId
      address: homeAddress
      name: homeName
      symbol
      decimals
    }
  }
`;

const foreignTokensQuery = gql`
  query foreignTokens {
    tokens(where: { foreignAddress_contains: "0x" }, first: 1000) {
      chainId: foreignChainId
      address: foreignAddress
      name: foreignName
      symbol
      decimals
    }
  }
`;

const fetchTokensFromSubgraph = async (homeEndpoint, foreignEndpoint) => {
  const [homeData, foreignData] = await Promise.all([
    request(homeEndpoint, homeTokensQuery),
    request(foreignEndpoint, foreignTokensQuery),
  ]);
  const homeTokens = homeData && homeData.tokens ? homeData.tokens : [];
  const foreignTokens =
    foreignData && foreignData.tokens ? foreignData.tokens : [];
  return homeTokens.concat(foreignTokens);
};
