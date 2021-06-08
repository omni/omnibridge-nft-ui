import {
  Flex,
  HStack,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { ActionButton } from 'components/bridge/ActionButton';
import { AdvancedMenu } from 'components/bridge/AdvancedMenu';
import { LeftVector, RightVector } from 'components/bridge/VectorLines';
import { Logo } from 'components/common/Logo';
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
  const isSmallScreen = useBreakpointValue({ base: true, md: false });
  return (
    <Flex
      align="center"
      direction="column"
      w="100%"
      maxW="75rem"
      px={{ base: 4, sm: 8 }}
    >
      <GnosisSafeWarning noCheckbox />
      <RPCHealthWarning />
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
        <Flex direction="column" align="center" w="100%">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            width="100%"
            align="stretch"
            my="4"
          >
            <HStack spacing="0.5rem">
              <Logo w="3rem" h="3rem" />
              <Flex
                align="flex-start"
                direction="column"
                w="8rem"
                minW="8rem"
                maxW="8rem"
              >
                <Text color="greyText" fontSize="sm">
                  From
                </Text>
                <Text fontWeight="bold" fontSize="lg">
                  {getNetworkName(chainId)}
                </Text>
              </Flex>
            </HStack>
            <Flex
              justify="center"
              align="center"
              flex="1"
              mx={{ base: 0, md: 'calc(8vw - 10rem)', lg: 0 }}
              my={{ base: '2rem', md: '0' }}
            >
              <HStack
                spacing="0.5rem"
                height={{ base: '3rem', md: '2.5rem', lg: '3rem' }}
                align="stretch"
              >
                {!isSmallScreen && <LeftVector />}
                <ActionButton />
                {!isSmallScreen && <RightVector />}
              </HStack>
            </Flex>
            <HStack
              spacing="0.5rem"
              justify={{ base: 'flex-end', md: 'flex-start' }}
            >
              <Flex
                align="flex-end"
                direction="column"
                w="8rem"
                minW="8rem"
                maxW="8rem"
              >
                <Text color="greyText" fontSize="sm">
                  To
                </Text>
                <Text fontWeight="bold" fontSize="lg" textAlign="right">
                  {getNetworkName(bridgeChainId)}
                </Text>
              </Flex>
              <Logo w="3rem" h="3rem" reverseFallback />
            </HStack>
          </Flex>
          <AdvancedMenu />
        </Flex>
      </VStack>
    </Flex>
  );
};
