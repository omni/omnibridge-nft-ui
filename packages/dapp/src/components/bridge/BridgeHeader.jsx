import { Flex, HStack, Text, useBreakpointValue } from '@chakra-ui/react';
import { ActionButton } from 'components/bridge/ActionButton';
import { AdvancedMenu } from 'components/bridge/AdvancedMenu';
import { SwitchButton } from 'components/bridge/SwitchButton';
import { LeftVector, RightVector } from 'components/bridge/VectorLines';
import { Logo } from 'components/common/Logo';
import { useWeb3Context } from 'contexts/Web3Context';
import { useBridgeDirection } from 'hooks/useBridgeDirection';
import { getNetworkName } from 'lib/helpers';
import React from 'react';

export const BridgeHeader = () => {
  const { providerChainId: chainId, isMetamask } = useWeb3Context();
  const { getBridgeChainId } = useBridgeDirection();
  const bridgeChainId = getBridgeChainId(chainId);
  const isSmallScreen = useBreakpointValue({ base: true, md: false });
  return (
    <Flex direction="column" align="center" w="100%">
      <Flex
        direction={{ base: 'column', md: 'row' }}
        width="100%"
        justify="space-between"
        position="relative"
        align="stretch"
        mb="4"
        px="4"
      >
        <HStack spacing="0.5rem">
          <Logo w="3rem" h="3rem" />
          <Flex
            align="flex-start"
            direction="column"
            w="9rem"
            minW="9rem"
            maxW="9rem"
          >
            <Text color="greyText" fontSize="sm">
              From
            </Text>
            <Text fontWeight="500" fontSize="lg">
              {getNetworkName(chainId)}
            </Text>
          </Flex>
        </HStack>
        <Flex
          justify="center"
          align="center"
          position={{ base: 'relative', md: 'absolute' }}
          my={{ base: '2rem', md: '0' }}
          left="0"
          right="0"
        >
          {isMetamask && <SwitchButton />}
          <HStack
            spacing={{ base: '0', lg: '0.5rem' }}
            height="3rem"
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
            w="9rem"
            minW="9rem"
            maxW="9rem"
          >
            <Text color="greyText" fontSize="sm">
              To
            </Text>
            <Text fontWeight="500" fontSize="lg" textAlign="right">
              {getNetworkName(bridgeChainId)}
            </Text>
          </Flex>
          <Logo w="3rem" h="3rem" reverseFallback />
        </HStack>
      </Flex>
      <AdvancedMenu />
    </Flex>
  );
};
