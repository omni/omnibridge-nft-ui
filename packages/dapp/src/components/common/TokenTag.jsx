import { Flex, Text } from '@chakra-ui/react';
import { TopRightArrowIcon } from 'icons/TopRightArrowIcon';
import React from 'react';

export const TokenTag = ({ children, showArrow = false, ...props }) => (
  <Flex
    bg="blackAlpha.800"
    color="white"
    align="center"
    justify="center"
    borderRadius="full"
    px="2"
    fontSize="0.6875rem"
    h="1.25rem"
    {...props}
  >
    <Text textAlign="center" verticalAlign="center" lineHeight="0.875rem">
      {children}
    </Text>
    {showArrow && (
      <Flex h="0.6rem" direction="column" align="flex-end" w="0.7rem">
        <TopRightArrowIcon color="white" boxSize="0.5rem" />
      </Flex>
    )}
  </Flex>
);
