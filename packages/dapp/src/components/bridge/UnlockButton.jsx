import { Flex, Image, Spinner, Text } from '@chakra-ui/react';
import UnlockIcon from 'assets/unlock.svg';
import { TxLink } from 'components/common/TxLink';
// import { isRebasingToken } from 'components/warnings/RebasingTokenWarning';
// import { useBridgeContext } from 'contexts/BridgeContext';
import { useWeb3Context } from 'contexts/Web3Context';
import React from 'react';

export const UnlockButton = () => {
  const { providerChainId } = useWeb3Context();
  const onClick = () => {};
  const approvalTxHash = '';
  const buttonDisabled = false;
  const unlockLoading = false;
  return (
    <Flex
      align="center"
      as="button"
      color="cyan.500"
      _hover={
        buttonDisabled
          ? undefined
          : {
              color: 'cyan.600',
            }
      }
      cursor={buttonDisabled ? 'not-allowed' : 'pointer'}
      transition="0.25s"
      position="relative"
      opacity={buttonDisabled ? 0.4 : 1}
      onClick={onClick}
      borderRadius="0.25rem"
      w={{ base: '10rem', sm: '12rem', lg: 'auto' }}
    >
      <svg width="100%" viewBox="0 0 156 42" fill="none">
        <path
          d="M139.086 39.72a4 4 0 01-3.612 2.28H20.526a4 4 0 01-3.612-2.28l-16.19-34C-.54 3.065 1.395 0 4.335 0h147.33c2.94 0 4.875 3.065 3.611 5.72l-16.19 34z"
          fill="currentColor"
        />
      </svg>
      <Flex
        position="absolute"
        w="100%"
        h="100%"
        justify="center"
        align="center"
      >
        {unlockLoading ? (
          <TxLink chainId={providerChainId} hash={approvalTxHash}>
            <Spinner color="white" size="sm" />
          </TxLink>
        ) : (
          <>
            <Text color="white" fontWeight="bold">
              {buttonDisabled ? 'Unlocked' : 'Unlock'}
            </Text>
            <Image src={UnlockIcon} ml={2} />
          </>
        )}
      </Flex>
    </Flex>
  );
};
