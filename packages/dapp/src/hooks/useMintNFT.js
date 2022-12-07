import { useWeb3Context } from 'contexts/Web3Context';
import { mintNFT } from 'lib/factory';
import { useCallback } from 'react';

export const useMintNFT = () => {
  const { ethersProvider, account } = useWeb3Context();

  const mint = useCallback(
    async (collectionAddress, tokenURI) => {
      const tx = await mintNFT(
        ethersProvider,
        collectionAddress,
        account,
        tokenURI,
      );
      await tx.wait();
    },
    [account, ethersProvider],
  );

  return { mint };
};
