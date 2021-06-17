import { useSettings } from 'contexts/SettingsContext';
import { fetchAmbVersion } from 'lib/amb';
import { networkLabels } from 'lib/constants';
import { logError } from 'lib/helpers';
import { networks } from 'lib/networks';
import { getEthersProvider } from 'lib/providers';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useBridgeDirection = () => {
  const { bridgeDirection } = useSettings();
  const [foreignAmbVersion, setForeignAmbVersion] = useState();
  const [fetchingVersion, setFetchingVersion] = useState(false);
  const bridgeConfig = useMemo(
    () => networks[bridgeDirection] || Object.values(networks)[0],
    [bridgeDirection],
  );

  const {
    homeChainId,
    foreignChainId,
    ambLiveMonitorPrefix,
    homeBridgeSubgraph,
    foreignBridgeSubgraph,
    home721Subgraph,
    foreign721Subgraph,
    home1155Subgraph,
    foreign1155Subgraph,
    foreignAmbAddress,
  } = bridgeConfig;

  useEffect(() => {
    const label = networkLabels[foreignChainId];
    const key = `${label}-AMB-VERSION`;
    const fetchVersion = async () => {
      const provider = await getEthersProvider(foreignChainId);
      await fetchAmbVersion(foreignAmbAddress, provider)
        .then(res => {
          setForeignAmbVersion(res);
          sessionStorage.setItem(key, res);
        })
        .catch(versionError => logError({ versionError }));
      setFetchingVersion(false);
    };
    const version = sessionStorage.getItem(key);
    if (!version && !fetchingVersion) {
      setFetchingVersion(true);
      fetchVersion();
    } else {
      setForeignAmbVersion(version);
    }
  }, [foreignAmbAddress, foreignChainId, fetchingVersion]);

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
      return `https://api.thegraph.com/subgraphs/name/${subgraphName}`;
    },
    [foreignBridgeSubgraph, homeChainId, homeBridgeSubgraph],
  );

  const getEIP721GraphEndpoint = useCallback(
    chainId => {
      const subgraphName =
        homeChainId === chainId ? home721Subgraph : foreign721Subgraph;
      return `https://api.thegraph.com/subgraphs/name/${subgraphName}`;
    },
    [foreign721Subgraph, homeChainId, home721Subgraph],
  );

  const getEIP1155GraphEndpoint = useCallback(
    chainId => {
      const subgraphName =
        homeChainId === chainId ? home1155Subgraph : foreign1155Subgraph;
      return `https://api.thegraph.com/subgraphs/name/${subgraphName}`;
    },
    [foreign1155Subgraph, homeChainId, home1155Subgraph],
  );

  return {
    bridgeDirection,
    getBridgeChainId,
    getMonitorUrl,
    getGraphEndpoint,
    getEIP721GraphEndpoint,
    getEIP1155GraphEndpoint,
    foreignAmbVersion,
    ...bridgeConfig,
  };
};
