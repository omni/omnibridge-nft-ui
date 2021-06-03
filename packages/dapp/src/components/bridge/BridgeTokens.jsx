import { Flex, HStack, Text } from '@chakra-ui/react';
import { AdvancedMenu } from 'components/bridge/AdvancedMenu';
// import { TransferButton } from 'components/bridge/TransferButton';
import { UnlockButton } from 'components/bridge/UnlockButton';
import { BridgeLoadingModal } from 'components/modals/BridgeLoadingModal';
import { ClaimTokensModal } from 'components/modals/ClaimTokensModal';
import { ClaimTransferModal } from 'components/modals/ClaimTransferModal';
import { GnosisSafeWarning } from 'components/warnings/GnosisSafeWarning';
import { RPCHealthWarning } from 'components/warnings/RPCHealthWarning';
import { BridgeContext } from 'contexts/BridgeContext';
import { useSettings } from 'contexts/SettingsContext';
import { useWeb3Context } from 'contexts/Web3Context';
import { useBridgeDirection } from 'hooks/useBridgeDirection';
import { getNetworkName } from 'lib/helpers';
import React, { useContext } from 'react';

export const BridgeTokens = () => {
  const { providerChainId: chainId } = useWeb3Context();
  const { getBridgeChainId, foreignChainId } = useBridgeDirection();
  const { txHash, loading } = useContext(BridgeContext);
  const { neverShowClaims, needsSaving } = useSettings();

  const bridgeChainId = getBridgeChainId(chainId);
  const txNeedsClaiming = !!txHash && !loading && chainId === foreignChainId;
  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      w={{ base: undefined, lg: 'calc(100% - 4rem)' }}
      maxW="75rem"
      my="auto"
      mx={{ base: 4, sm: 8 }}
    >
      <GnosisSafeWarning noCheckbox />
      <RPCHealthWarning />
      <Flex
        maxW="75rem"
        direction="column"
        align="center"
        p={{ base: 4, md: 8 }}
      >
        <BridgeLoadingModal />
        {txNeedsClaiming ? <ClaimTransferModal /> : null}
        {txNeedsClaiming || neverShowClaims || needsSaving ? null : (
          <ClaimTokensModal />
        )}
        <Flex direction={{ base: 'column', md: 'row' }} width="100%" my={4}>
          <HStack spacing="0.5rem">
            <Flex align="flex-start" direction="column" m={2}>
              <Text color="greyText" fontSize="sm">
                From
              </Text>
              <Text fontWeight="bold" fontSize="lg">
                {getNetworkName(chainId)}
              </Text>
            </Flex>
          </HStack>
          <Flex justify="center" align="center" flex="1">
            <HStack spacing="0.5rem">
              <UnlockButton />
              {/* <TransferButton /> */}
            </HStack>
          </Flex>
          <HStack spacing="0.5rem">
            <Flex align="flex-end" direction="column" m={2}>
              <Text color="greyText" fontSize="sm">
                To
              </Text>
              <Text fontWeight="bold" fontSize="lg" textAlign="right">
                {getNetworkName(bridgeChainId)}
              </Text>
            </Flex>
          </HStack>
        </Flex>
        <AdvancedMenu />
      </Flex>
    </Flex>
  );
};
