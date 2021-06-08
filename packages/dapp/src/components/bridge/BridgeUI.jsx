import { Flex, VStack } from '@chakra-ui/react';
import { BridgeHeader } from 'components/bridge/BridgeHeader';
import { BridgeSearch } from 'components/bridge/BridgeSearch';
import { BridgeLoadingModal } from 'components/modals/BridgeLoadingModal';
import { ClaimTokensModal } from 'components/modals/ClaimTokensModal';
import { ClaimTransferModal } from 'components/modals/ClaimTransferModal';
import { GnosisSafeWarning } from 'components/warnings/GnosisSafeWarning';
import { RPCHealthWarning } from 'components/warnings/RPCHealthWarning';
import { useBridgeContext } from 'contexts/BridgeContext';
import { useSettings } from 'contexts/SettingsContext';
import { useWeb3Context } from 'contexts/Web3Context';
import { useBridgeDirection } from 'hooks/useBridgeDirection';
import React from 'react';

import { BridgeTokensDisplay } from './BridgeTokensDisplay';

export const BridgeUI = () => {
  const { providerChainId: chainId } = useWeb3Context();
  const { foreignChainId } = useBridgeDirection();
  const { txHash, loading } = useBridgeContext();
  const { neverShowClaims, needsSaving } = useSettings();

  const txNeedsClaiming = !!txHash && !loading && chainId === foreignChainId;
  return (
    <Flex align="center" direction="column" w="100%" maxW="75rem" px={4}>
      <BridgeLoadingModal />
      {txNeedsClaiming ? <ClaimTransferModal /> : null}
      {txNeedsClaiming || neverShowClaims || needsSaving ? null : (
        <ClaimTokensModal />
      )}
      <VStack
        h="100%"
        w="100%"
        direction="column"
        align="center"
        spacing="2rem"
        py={{ base: 4, sm: 8 }}
      >
        <Flex w="100%" direction="column" px={4}>
          <GnosisSafeWarning noCheckbox />
          <RPCHealthWarning />
        </Flex>
        <BridgeHeader />
        <BridgeSearch />
        <BridgeTokensDisplay />
      </VStack>
    </Flex>
  );
};
