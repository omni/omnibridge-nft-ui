import { Flex, VStack } from '@chakra-ui/react';
import { BridgeHeader } from 'components/bridge/BridgeHeader';
import { BridgeSearch } from 'components/bridge/BridgeSearch';
import { BridgeLoadingModal } from 'components/modals/BridgeLoadingModal';
import { GnosisSafeWarning } from 'components/warnings/GnosisSafeWarning';
import { RPCHealthWarning } from 'components/warnings/RPCHealthWarning';
import React from 'react';

import { BridgeTokensDisplay } from './BridgeTokensDisplay';

export const BridgeUI = () => (
  <Flex
    align="center"
    direction="column"
    w="100%"
    maxW="75rem"
    px={{ base: 0, sm: 4 }}
  >
    <BridgeLoadingModal />
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
