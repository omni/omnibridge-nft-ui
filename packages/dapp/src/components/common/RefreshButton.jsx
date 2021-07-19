import { Flex, Spinner } from '@chakra-ui/react';
import { useWeb3Context } from 'contexts/Web3Context';
import { RefreshIcon } from 'icons/RefreshIcon';
import React from 'react';

export const RefreshButton = ({ isChecked = false, ...props }) => {
  const { refreshing } = useWeb3Context();
  return (
    <Flex
      w="1.25rem"
      h="1.25rem"
      bg="blackAlpha.800"
      justify="center"
      align="center"
      borderRadius="0.25rem"
      cursor="pointer"
      {...props}
    >
      {refreshing ? (
        <Spinner color="white" w="0.875rem" h="0.875rem" thickness="2px" />
      ) : (
        <RefreshIcon color="white" boxSize="0.875rem" />
      )}
    </Flex>
  );
};
