import { useWeb3Context } from 'contexts/Web3Context';
import { useBridgeDirection } from 'hooks/useBridgeDirection';
import {
  combineRequestsWithExecutions,
  getExecutions,
  getRequests,
} from 'lib/history';
import { getRequestsWithTokenUris } from 'lib/tokenUri';
import { useEffect, useState } from 'react';

export const useUserHistory = () => {
  const {
    homeChainId,
    foreignChainId,
    getGraphEndpoint,
    getEIP721GraphEndpoint,
    getEIP1155GraphEndpoint,
  } = useBridgeDirection();
  const { account } = useWeb3Context();
  const [transfers, setTransfers] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!account) return () => undefined;
    let isSubscribed = true;
    async function update() {
      setTransfers();
      setLoading(true);
      const [
        { requests: homeRequestsInit },
        { requests: foreignRequestsInit },
      ] = await Promise.all([
        getRequests(account, getGraphEndpoint(homeChainId)),
        getRequests(account, getGraphEndpoint(foreignChainId)),
      ]);
      const [
        { executions: homeExecutions },
        { executions: foreignExecutions },
        homeRequests,
        foreignRequests,
      ] = await Promise.all([
        getExecutions(getGraphEndpoint(homeChainId), foreignRequestsInit),
        getExecutions(getGraphEndpoint(foreignChainId), homeRequestsInit),
        getRequestsWithTokenUris(
          foreignChainId, // opp chainId for burnt tokens
          homeRequestsInit,
          getEIP721GraphEndpoint,
          getEIP1155GraphEndpoint,
        ),
        getRequestsWithTokenUris(
          homeChainId,
          foreignRequestsInit,
          getEIP721GraphEndpoint,
          getEIP1155GraphEndpoint,
        ),
      ]);
      const homeTransfers = combineRequestsWithExecutions(
        homeRequests,
        foreignExecutions,
        homeChainId,
      );
      const foreignTransfers = combineRequestsWithExecutions(
        foreignRequests,
        homeExecutions,
        foreignChainId,
      );
      const allTransfers = [...homeTransfers, ...foreignTransfers].sort(
        (a, b) => b.timestamp - a.timestamp,
      );
      if (isSubscribed) {
        setTransfers(allTransfers);
        setLoading(false);
      }
    }
    update();
    return () => {
      isSubscribed = false;
    };
  }, [
    homeChainId,
    foreignChainId,
    account,
    getGraphEndpoint,
    getEIP721GraphEndpoint,
    getEIP1155GraphEndpoint,
  ]);

  return { transfers, loading };
};
