import { useWeb3Context } from 'contexts/Web3Context';
import { useBridgeDirection } from 'hooks/useBridgeDirection';
import { fetch721TokenList, fetch1155TokenList } from 'lib/tokenList';
import { useEffect, useState } from 'react';

const tokenSearchFilter =
  searchText =>
  ({ name, symbol, address, tokenId }) => {
    const nameSearch = name
      ? name.toLowerCase().indexOf(searchText) >= 0
      : false;
    const symbolSearch = symbol
      ? symbol.toLowerCase().indexOf(searchText) >= 0
      : false;
    const addressSearch = address
      ? address.toLowerCase().indexOf(searchText) >= 0
      : false;
    const tokenIdSearch = tokenId
      ? tokenId.toLowerCase().indexOf(searchText) >= 0
      : false;
    return nameSearch || symbolSearch || addressSearch || tokenIdSearch;
  };

export const useUserTokens = searchText => {
  const { getEIP721GraphEndpoint, getEIP1155GraphEndpoint } =
    useBridgeDirection();
  const { account, providerChainId } = useWeb3Context();
  const [allEIP721Tokens, setAllEIP721Tokens] = useState([]);
  const [allEIP1155Tokens, setAllEIP1155Tokens] = useState([]);
  const [eip721Tokens, setEIP721Tokens] = useState([]);
  const [eip1155Tokens, setEIP1155Tokens] = useState([]);

  useEffect(() => {
    if (!providerChainId || !account) return;
    fetch721TokenList(
      providerChainId,
      account,
      getEIP721GraphEndpoint(providerChainId),
    ).then(setAllEIP721Tokens);
    fetch1155TokenList(
      providerChainId,
      account,
      getEIP1155GraphEndpoint(providerChainId),
    ).then(setAllEIP1155Tokens);
  }, [
    account,
    providerChainId,
    getEIP721GraphEndpoint,
    getEIP1155GraphEndpoint,
  ]);

  useEffect(() => {
    setEIP721Tokens(allEIP721Tokens.filter(tokenSearchFilter(searchText)));
    setEIP1155Tokens(allEIP1155Tokens.filter(tokenSearchFilter(searchText)));
  }, [searchText, allEIP721Tokens, allEIP1155Tokens]);

  return { eip721Tokens, eip1155Tokens };
};
