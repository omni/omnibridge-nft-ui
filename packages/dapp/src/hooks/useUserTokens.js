import { useWeb3Context } from 'contexts/Web3Context';
import { useBridgeDirection } from 'hooks/useBridgeDirection';
import { fetch721TokenList, fetch1155TokenList } from 'lib/tokenList';
import { useEffect, useState } from 'react';

export const useUserTokens = () => {
  const { getEIP721GraphEndpoint, getEIP1155GraphEndpoint } =
    useBridgeDirection();
  const { account, providerChainId } = useWeb3Context();
  const [eip721Tokens, setEIP721Tokens] = useState([]);
  const [eip1155Tokens, setEIP1155Tokens] = useState([]);

  useEffect(() => {
    if (!providerChainId || !account) return;
    fetch721TokenList(
      providerChainId,
      account,
      getEIP721GraphEndpoint(providerChainId),
    ).then(setEIP721Tokens);
    fetch1155TokenList(
      providerChainId,
      account,
      getEIP1155GraphEndpoint(providerChainId),
    ).then(setEIP1155Tokens);
  }, [
    account,
    providerChainId,
    getEIP1155GraphEndpoint,
    getEIP721GraphEndpoint,
  ]);

  return { eip721Tokens, eip1155Tokens };
};
