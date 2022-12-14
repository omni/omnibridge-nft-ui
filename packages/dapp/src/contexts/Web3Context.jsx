import { SafeAppWeb3Modal as Web3Modal } from '@gnosis.pm/safe-apps-web3modal';
import Torus from '@toruslabs/torus-embed';
import WalletConnectProvider from '@walletconnect/web3-provider';
import imTokenLogo from 'assets/imtoken.svg';
import { ethers } from 'ethers';
import { ADDRESS_ZERO } from 'lib/constants';
import {
  getNetworkName,
  getRPCUrl,
  getWalletProviderName,
  logDebug,
  logError,
} from 'lib/helpers';
import { getEthersProvider } from 'lib/providers';
import { fetchTokenInfo, fetchTokenUri } from 'lib/token';
import { getLocalTokenInfo, setLocalTokenInfo } from 'lib/tokenList';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const Web3Context = React.createContext({});
export const useWeb3Context = () => useContext(Web3Context);

const updateTitle = chainId => {
  const networkName = getNetworkName(chainId);
  const defaultTitle = 'G.U.Bridge';
  if (!process.env.REACT_APP_TITLE) {
    document.title = defaultTitle;
  } else {
    const titleReplaceString = '%c';
    const appTitle = process.env.REACT_APP_TITLE || defaultTitle;

    if (appTitle.indexOf(titleReplaceString) !== -1) {
      document.title = appTitle.replace(titleReplaceString, networkName);
    } else {
      document.title = appTitle;
    }
  }
};

const rpc = {
  1: getRPCUrl(1),
  4: getRPCUrl(4),
  100: getRPCUrl(100),
};

const connector = async (ProviderPackage, options) => {
  const provider = new ProviderPackage(options);
  await provider.enable();
  return provider;
};

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: { rpc },
  },
  'custom-imToken': {
    display: {
      logo: imTokenLogo,
      name: 'imToken',
      description: 'Connect to your imToken Wallet',
    },
    package: WalletConnectProvider,
    options: { rpc },
    connector,
  },
  torus: {
    package: Torus,
    options: {
      config: {
        showTorusButton: true,
      },
    },
  },
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
});

export const Web3Provider = ({ children }) => {
  const [{ providerChainId, ethersProvider, account }, setWeb3State] = useState(
    {},
  );
  const [isGnosisSafe, setGnosisSafe] = useState(false);
  const [loading, setLoading] = useState(true);

  const setWeb3Provider = useCallback(async (prov, initialCall = false) => {
    try {
      if (prov) {
        const provider = new ethers.providers.Web3Provider(prov);
        const chainId = Number(prov.chainId);
        if (initialCall) {
          const signer = provider.getSigner();
          const gotAccount = await signer.getAddress();
          setWeb3State({
            account: gotAccount,
            ethersProvider: provider,
            providerChainId: chainId,
          });
        } else {
          setWeb3State(_provider => ({
            ..._provider,
            ethersProvider: provider,
            providerChainId: chainId,
          }));
        }
      }
    } catch (error) {
      logError({ web3ModalError: error });
    }
  }, []);

  useEffect(() => {
    if (providerChainId) {
      updateTitle(providerChainId);
    }
  }, [providerChainId]);

  const disconnect = useCallback(async () => {
    web3Modal.clearCachedProvider();
    setGnosisSafe(false);
    setWeb3State({});
  }, []);

  const connectWeb3 = useCallback(async () => {
    try {
      setLoading(true);

      const modalProvider = await web3Modal.requestProvider();

      await setWeb3Provider(modalProvider, true);

      const gnosisSafe = await web3Modal.isSafeApp();
      setGnosisSafe(gnosisSafe);

      if (!gnosisSafe) {
        modalProvider.on('accountsChanged', accounts => {
          setWeb3State(_provider => ({
            ..._provider,
            account: accounts[0],
          }));
        });
        modalProvider.on('chainChanged', () => {
          setWeb3Provider(modalProvider);
        });
      }
    } catch (error) {
      logError({ web3ModalError: error });
      disconnect();
    }
    setLoading(false);
  }, [setWeb3Provider, disconnect]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false;
    }
    (async function load() {
      if ((await web3Modal.isSafeApp()) || web3Modal.cachedProvider) {
        connectWeb3();
      } else {
        setLoading(false);
      }
    })();
  }, [connectWeb3]);

  const isMetamask = useMemo(
    () =>
      getWalletProviderName(ethersProvider) === 'metamask' &&
      window.ethereum?.isMetaMask === true,
    [ethersProvider],
  );

  const [refreshing, setRefreshing] = useState(false);

  const refreshToken = useCallback(
    async token => {
      if (refreshing) return token;
      setRefreshing(true);
      const localTokenInfo = getLocalTokenInfo();
      const { chainId, address, tokenId, nativeToken, bridgeChainId } = token;
      const isBridgedToken =
        nativeToken && nativeToken !== ADDRESS_ZERO && bridgeChainId;
      const tokenKey = `${chainId}-${address.toLowerCase()}-${tokenId}`;
      const tokenInfo = localTokenInfo[tokenKey];
      let tokenWithUri;
      if (isBridgedToken) {
        const provider =
          providerChainId === bridgeChainId
            ? ethersProvider
            : await getEthersProvider(bridgeChainId);
        tokenWithUri = await fetchTokenUri(provider, {
          ...token,
          address: nativeToken,
        });
      } else {
        const provider =
          providerChainId === chainId
            ? ethersProvider
            : await getEthersProvider(chainId);
        tokenWithUri = await fetchTokenUri(provider, token);
      }
      localTokenInfo[tokenKey] = { ...tokenInfo, ...tokenWithUri, address };
      setLocalTokenInfo(localTokenInfo);
      sessionStorage.removeItem(tokenKey);
      setRefreshing(false);
      logDebug('refreshed TokenURI', tokenWithUri);
      return tokenWithUri;
    },
    [refreshing, providerChainId, ethersProvider],
  );

  const fetchToken = useCallback(
    async token => {
      const localTokenInfo = getLocalTokenInfo();
      const { chainId, address, tokenId } = token;
      const provider =
        providerChainId === chainId
          ? ethersProvider
          : await getEthersProvider(chainId);
      const tokenKey = `${chainId}-${address.toLowerCase()}-${tokenId}`;
      const tokenInfo = localTokenInfo[tokenKey];
      const newTokenInfo = await fetchTokenInfo(provider, tokenInfo, token);
      return newTokenInfo;
    },
    [providerChainId, ethersProvider],
  );

  return (
    <Web3Context.Provider
      value={{
        isGnosisSafe,
        ethersProvider,
        connectWeb3,
        loading,
        disconnect,
        providerChainId,
        account,
        isMetamask,
        refreshToken,
        refreshing,
        fetchToken,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
