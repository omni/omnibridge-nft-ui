import { useWeb3Context } from 'contexts/Web3Context';
import { useBridgeDirection } from 'hooks/useBridgeDirection';
import { useTotalConfirms } from 'hooks/useTotalConfirms';
import { useUnlock } from 'hooks/useUnlock';
import { relayTokens } from 'lib/bridge';
import { logError } from 'lib/helpers';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const BridgeContext = React.createContext({});

export const useBridgeContext = () => useContext(BridgeContext);

export const BridgeProvider = ({ children }) => {
  const { isGnosisSafe, account, providerChainId, ethersProvider } =
    useWeb3Context();

  const {
    homeChainId,
    getMediatorAddress,
    claimDisabled,
    tokensClaimDisabled,
  } = useBridgeDirection();
  const mediatorAddress = useMemo(
    () => getMediatorAddress(providerChainId),
    [getMediatorAddress, providerChainId],
  );
  const isHome = providerChainId === homeChainId;

  const [receiver, setReceiver] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState();
  const [tokens, setTokens] = useState();
  const [searchText, setSearchText] = useState('');

  const totalConfirms = useTotalConfirms();
  const { unlocked, unlockLoading, unlockTxHash, unlock } = useUnlock(tokens);

  const transfer = useCallback(async () => {
    setLoading(true);
    try {
      if (isGnosisSafe && !receiver) {
        throw new Error('Must set receiver for Gnosis Safe');
      }
      const tx = await relayTokens(
        ethersProvider,
        account,
        tokens,
        mediatorAddress,
        receiver || account,
      );
      setTxHash(tx.hash);
      setTokens();
    } catch (transferError) {
      setLoading(false);
      logError({
        transferError,
        tokens,
        receiver: receiver || account,
        account,
      });
      throw transferError;
    }
  }, [
    isGnosisSafe,
    account,
    receiver,
    tokens,
    ethersProvider,
    mediatorAddress,
  ]);

  const selectToken = useCallback(
    inputToken => {
      const { address, tokenId, tokenUri, amount, is1155, chainId } =
        inputToken;
      if (tokens && tokens.address === address && tokens.is1155 === true) {
        const { tokenIds, tokenUris, amounts } = tokens;
        const index = tokenIds.indexOf(tokenId);
        if (index >= 0) {
          tokenIds.splice(index, 1);
          tokenUris.splice(index, 1);
          amounts.splice(index, 1);
        }
        setTokens({
          ...tokens,
          tokenIds: [...tokenIds, tokenId],
          tokenUris: [...tokenUris, tokenUri],
          amounts: [...amounts, amount],
        });
      } else {
        setTokens({
          address,
          tokenIds: [tokenId],
          tokenUris: [tokenUri],
          amounts: [amount],
          is1155,
          chainId,
        });
      }
    },
    [tokens],
  );

  const unselectToken = useCallback(
    inputToken => {
      const { address, tokenId } = inputToken;
      if (tokens && tokens.address === address) {
        const { tokenIds, tokenUris, amounts } = tokens;
        const index = tokenIds.indexOf(tokenId);
        if (index >= 0) {
          tokenIds.splice(index, 1);
          tokenUris.splice(index, 1);
          amounts.splice(index, 1);
          if (tokenIds.length > 0) {
            setTokens({
              ...tokens,
              tokenIds,
              tokenUris,
              amounts,
            });
          } else {
            setTokens();
          }
        }
      }
    },
    [tokens],
  );

  useEffect(() => setTokens(), [providerChainId, account, ethersProvider]);

  const needsClaiming = useMemo(
    () =>
      isHome &&
      !claimDisabled &&
      !(tokensClaimDisabled || []).includes(tokens?.address.toLowerCase()),
    [isHome, claimDisabled, tokensClaimDisabled, tokens],
  );

  return (
    <BridgeContext.Provider
      value={{
        transfer,
        loading,
        setLoading,
        txHash,
        setTxHash,
        totalConfirms,
        receiver,
        setReceiver,
        tokens,
        selectToken,
        unselectToken,
        searchText,
        setSearchText,
        unlocked,
        unlockLoading,
        unlockTxHash,
        unlock,
        needsClaiming,
      }}
    >
      {children}
    </BridgeContext.Provider>
  );
};
