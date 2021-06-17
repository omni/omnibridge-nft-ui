import { useWeb3Context } from 'contexts/Web3Context';
import { useTotalConfirms } from 'hooks/useTotalConfirms';
// import { useApproval } from 'hooks/useApproval';
// import { relayTokens } from 'lib/bridge';
import { logError } from 'lib/helpers';
import React, { useCallback, useContext, useState } from 'react';

export const BridgeContext = React.createContext({});

export const useBridgeContext = () => useContext(BridgeContext);

export const BridgeProvider = ({ children }) => {
  const { isGnosisSafe, account } = useWeb3Context();

  const [receiver, setReceiver] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState();

  const totalConfirms = useTotalConfirms();

  // const {
  //   allowed,
  //   updateAllowance,
  //   unlockLoading,
  //   approvalTxHash,
  //   approve,
  // } = useApproval(fromToken, fromAmount);

  const transfer = useCallback(async () => {
    setLoading(true);
    try {
      if (isGnosisSafe && !receiver) {
        throw new Error('Must set receiver for Gnosis Safe');
      }
      const tx = { hash: '' }; // relayTokens();
      setTxHash(tx.hash);
    } catch (transferError) {
      logError({
        transferError,
        receiver: receiver || account,
        account,
      });
      throw transferError;
    } finally {
      setLoading(false);
    }
  }, [isGnosisSafe, account, receiver]);

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
        // allowed,
        // approve,
        // updateAllowance,
        // unlockLoading,
        // approvalTxHash,
      }}
    >
      {children}
    </BridgeContext.Provider>
  );
};
