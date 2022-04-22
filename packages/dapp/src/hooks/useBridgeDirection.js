import { useSettings } from 'contexts/SettingsContext';
import { useAmbVersion } from 'hooks/useAmbVersion';
import { useRequiredSignatures } from 'hooks/useRequiredSignatures';
import { networks } from 'lib/networks';
import { useCallback, useMemo } from 'react';

export const useBridgeDirection = () => {
  const { bridgeDirection } = useSettings();
  const bridgeConfig = useMemo(
    () => networks[bridgeDirection] || Object.values(networks)[0],
    [bridgeDirection],
  );

  const {
    ambLiveMonitorPrefix,
    homeChainId,
    foreignChainId,
    homeBridgeSubgraph,
    foreignBridgeSubgraph,
    home721Subgraph,
    foreign721Subgraph,
    home1155Subgraph,
    foreign1155Subgraph,
    homeAmbAddress,
    foreignAmbAddress,
    homeMediatorAddress,
    foreignMediatorAddress,
  } = bridgeConfig;

  const foreignAmbVersion = useAmbVersion(foreignChainId, foreignAmbAddress);

  const homeRequiredSignatures = useRequiredSignatures(
    homeChainId,
    homeAmbAddress,
  );

  const getBridgeChainId = useCallback(
    chainId => (chainId === homeChainId ? foreignChainId : homeChainId),
    [homeChainId, foreignChainId],
  );

  const getMonitorUrl = useCallback(
    (chainId, hash) => `${ambLiveMonitorPrefix}/${chainId}/${hash}`,
    [ambLiveMonitorPrefix],
  );

  const getGraphEndpoint = useCallback(
    chainId => {
      const subgraphName =
        homeChainId === chainId ? homeBridgeSubgraph : foreignBridgeSubgraph;
      if (chainId === 99999) {
        return `https://graphnode.guswap.tk/subgraphs/name/${subgraphName}`;
      }
      return `https://api.thegraph.com/subgraphs/name/${subgraphName}`;
    },
    [foreignBridgeSubgraph, homeChainId, homeBridgeSubgraph],
  );

  const getEIP721GraphEndpoint = useCallback(
    chainId => {
      const subgraphName =
        homeChainId === chainId ? home721Subgraph : foreign721Subgraph;
      if (chainId === 99999) {
        return `https://graphnode.guswap.tk/subgraphs/name/${subgraphName}`;
      }
      return `https://api.thegraph.com/subgraphs/name/${subgraphName}`;
    },
    [foreign721Subgraph, homeChainId, home721Subgraph],
  );

  const getEIP1155GraphEndpoint = useCallback(
    chainId => {
      const subgraphName =
        homeChainId === chainId ? home1155Subgraph : foreign1155Subgraph;
      if (chainId === 99999) {
        return `https://graphnode.guswap.tk/subgraphs/name/${subgraphName}`;
      }
      return `https://api.thegraph.com/subgraphs/name/${subgraphName}`;
    },
    [foreign1155Subgraph, homeChainId, home1155Subgraph],
  );

  const getAMBAddress = useCallback(
    chainId => (chainId === homeChainId ? homeAmbAddress : foreignAmbAddress),
    [homeChainId, homeAmbAddress, foreignAmbAddress],
  );

  const getMediatorAddress = useCallback(
    chainId =>
      chainId === homeChainId ? homeMediatorAddress : foreignMediatorAddress,
    [homeChainId, homeMediatorAddress, foreignMediatorAddress],
  );

  return {
    bridgeDirection,
    getBridgeChainId,
    getMonitorUrl,
    getGraphEndpoint,
    getEIP721GraphEndpoint,
    getEIP1155GraphEndpoint,
    getAMBAddress,
    getMediatorAddress,
    foreignAmbVersion,
    homeRequiredSignatures,
    ...bridgeConfig,
  };
};
