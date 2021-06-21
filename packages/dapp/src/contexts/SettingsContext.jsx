import { useLocalState } from 'hooks/useLocalState';
import { DEFAULT_BRIDGE_DIRECTION, LOCAL_STORAGE_KEYS } from 'lib/constants';
import { getRPCKeys } from 'lib/helpers';
import React, { useCallback, useContext, useEffect, useState } from 'react';

const {
  INFINITE_UNLOCK,
  NEVER_SHOW_CLAIMS,
  BRIDGE_DIRECTION,
} = LOCAL_STORAGE_KEYS;

const SettingsContext = React.createContext({});

export const SettingsProvider = ({ children }) => {
  const [bridgeDirection, setBridgeDirection] = useLocalState(
    DEFAULT_BRIDGE_DIRECTION,
    BRIDGE_DIRECTION,
  );

  const { homeRPCKey, foreignRPCKey } = getRPCKeys(bridgeDirection);

  const [foreignRPC, setForeignRPC] = useLocalState('', foreignRPCKey);
  const [homeRPC, setHomeRPC] = useLocalState('', homeRPCKey);

  const [infiniteUnlock, setInfiniteUnlock] = useLocalState(
    false,
    INFINITE_UNLOCK,
    { valueType: 'boolean' },
  );

  const [neverShowClaims, setNeverShowClaims] = useLocalState(
    false,
    NEVER_SHOW_CLAIMS,
    { valueType: 'boolean' },
  );

  const [needsSaving, setNeedsSaving] = useState(false);

  const save = useCallback(() => {
    if (needsSaving) {
      setInfiniteUnlock(i => i, true);
      setBridgeDirection(bNet => bNet, true);
      setForeignRPC(mRPC => mRPC, true);
      setHomeRPC(xRPC => xRPC, true);
      setNeverShowClaims(nClaims => nClaims, true);
      setNeedsSaving(false);
    }
  }, [
    setInfiniteUnlock,
    setBridgeDirection,
    setForeignRPC,
    setHomeRPC,
    setNeverShowClaims,
    needsSaving,
  ]);

  useEffect(() => {
    if (
      window.localStorage.getItem(homeRPCKey) !== homeRPC ||
      window.localStorage.getItem(foreignRPCKey) !== foreignRPC ||
      window.localStorage.getItem(INFINITE_UNLOCK) !==
        infiniteUnlock.toString() ||
      window.localStorage.getItem(NEVER_SHOW_CLAIMS) !==
        neverShowClaims.toString()
    ) {
      setNeedsSaving(true);
    } else {
      setNeedsSaving(false);
    }
  }, [
    foreignRPCKey,
    foreignRPC,
    homeRPCKey,
    homeRPC,
    infiniteUnlock,
    neverShowClaims,
  ]);

  return (
    <SettingsContext.Provider
      value={{
        bridgeDirection,
        setBridgeDirection,
        foreignRPC,
        setForeignRPC,
        homeRPC,
        setHomeRPC,
        infiniteUnlock,
        setInfiniteUnlock,
        neverShowClaims,
        setNeverShowClaims,
        needsSaving,
        save,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
