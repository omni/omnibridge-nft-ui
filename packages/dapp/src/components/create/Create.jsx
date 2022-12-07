import { Flex, Text, Wrap, WrapItem } from '@chakra-ui/react';
import React from 'react';

import { DeployForm } from './DeployForm';
import { MintNFTForm } from './MintNFTForm';

export const Create = () => (
  <Flex maxW="75rem" direction="column" mt={8} px={{ base: 4, sm: 8 }} w="100%">
    <Text fontSize="xl" fontWeight="bold">
      Deploy Collection
    </Text>
    <Wrap>
      <WrapItem>
        <DeployForm />
      </WrapItem>
    </Wrap>
    <Text fontSize="xl" fontWeight="bold">
      Mint NFT
    </Text>
    <Wrap>
      <WrapItem>
        <MintNFTForm />
      </WrapItem>
    </Wrap>
  </Flex>
);
