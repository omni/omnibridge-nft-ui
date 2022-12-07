import { useWeb3Context } from 'contexts/Web3Context';
import { deployCollection, getDeployedNativeTokenAddress } from 'lib/factory';
import { useCallback } from 'react';

import { useBridgeDirection } from './useBridgeDirection';

export const useDeployCollection = () => {
  const { ethersProvider } = useWeb3Context();
  const { tokenFactoryAddress } = useBridgeDirection();

  const deploy = useCallback(
    async (name, description) => {
      const tx = await deployCollection(
        ethersProvider,
        name,
        description,
        tokenFactoryAddress,
      );
      const response = await tx.wait();
      const deployedAddress = await getDeployedNativeTokenAddress(response);

      return deployedAddress;
    },
    [ethersProvider, tokenFactoryAddress],
  );

  return { deploy };
};
