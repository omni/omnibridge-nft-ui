import { useWeb3Context } from 'contexts/Web3Context';
import { logError } from 'lib/helpers';
import { fetchAllowed, unlockToken } from 'lib/token';
import { useCallback, useEffect, useState } from 'react';

import { useBridgeDirection } from './useBridgeDirection';

export const useUnlock = tokens => {
  const { homeMediatorAddress, foreignMediatorAddress, homeChainId } =
    useBridgeDirection();
  const { account, ethersProvider, providerChainId } = useWeb3Context();

  const [unlocked, setUnlocked] = useState(false);

  const getMediatorAddress = useCallback(
    chainId =>
      homeChainId === chainId ? homeMediatorAddress : foreignMediatorAddress,
    [foreignMediatorAddress, homeChainId, homeMediatorAddress],
  );

  useEffect(() => {
    if (
      tokens &&
      providerChainId === tokens.chainId &&
      ethersProvider &&
      account
    ) {
      const mediator = getMediatorAddress(providerChainId);
      const { address: token, is1155 } = tokens;
      if (is1155) {
        setUnlocked(true);
      } else {
        fetchAllowed(ethersProvider, mediator, account, token).then(
          setUnlocked,
        );
      }
    } else {
      setUnlocked(false);
    }
  }, [ethersProvider, providerChainId, tokens, account, getMediatorAddress]);

  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockTxHash, setUnlockTxHash] = useState();

  const unlock = useCallback(async () => {
    if (
      tokens &&
      providerChainId === tokens.chainId &&
      ethersProvider &&
      account
    ) {
      const mediator = getMediatorAddress(providerChainId);
      const { address: token } = tokens;
      setUnlockLoading(true);
      try {
        const tx = await unlockToken(ethersProvider, mediator, token);
        setUnlockTxHash(tx.hash);
        await tx.wait();
        setUnlocked(true);
      } catch (unlockError) {
        logError({
          unlockError,
          token,
          account,
        });
        throw unlockError;
      } finally {
        setUnlockTxHash();
        setUnlockLoading(false);
      }
    }
  }, [ethersProvider, providerChainId, tokens, account, getMediatorAddress]);

  return { unlocked, unlockLoading, unlockTxHash, unlock };
};
