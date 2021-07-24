import {
  Flex,
  Image,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { getColor } from '@chakra-ui/theme-tools';
import TransferIcon from 'assets/transfer.svg';
import UnlockIcon from 'assets/unlock.svg';
import { TxLink } from 'components/common/TxLink';
import { ConfirmTransferModal } from 'components/modals/ConfirmTransferModal';
import { useBridgeContext } from 'contexts/BridgeContext';
import { useWeb3Context } from 'contexts/Web3Context';
import { utils } from 'ethers';
import React, { useCallback, useMemo } from 'react';
import { theme } from 'theme';

export const ActionButton = () => {
  const { providerChainId, ethersProvider, isGnosisSafe } = useWeb3Context();
  const { needsClaiming } = useBridgeContext();
  const { tokens, receiver } = useBridgeContext();
  const unlock = useCallback(() => undefined, []);
  const unlockLoading = false;
  const unlockTxHash = '';
  const unlocked = true;

  const { color, hoverColor, text, icon } = useMemo(() => {
    let buttonColor = 'cyan.400';
    let buttonHoverColor = 'cyan.600';
    let buttonText = 'Unlock';
    let buttonIcon = UnlockIcon;
    if (unlocked) {
      buttonColor = needsClaiming ? 'purple.300' : 'blue.500';
      buttonHoverColor = needsClaiming ? 'purple.500' : 'blue.700';
      buttonText = needsClaiming ? 'Request' : 'Transfer';
      buttonIcon = TransferIcon;
    }
    return {
      color: buttonColor,
      hoverColor: buttonHoverColor,
      text: buttonText,
      icon: buttonIcon,
    };
  }, [unlocked, needsClaiming]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const showError = useCallback(
    msg => {
      if (msg) {
        toast({
          title: 'Error',
          description: msg,
          status: 'error',
          isClosable: 'true',
        });
      }
    },
    [toast],
  );

  const valid = useCallback(() => {
    if (!ethersProvider) {
      showError('Please connect wallet');
    } else if (receiver ? !utils.isAddress(receiver) : isGnosisSafe) {
      showError(`Please specify a valid recipient address`);
    } else if (tokens) {
      return true;
    }
    return false;
  }, [ethersProvider, tokens, receiver, isGnosisSafe, showError]);

  const onClick = useCallback(() => {
    if (unlocked) {
      valid() && onOpen();
    } else {
      unlock();
    }
  }, [valid, onOpen, unlock, unlocked]);

  return (
    <Flex
      align="center"
      as="button"
      color={color}
      _hover={{
        color: hoverColor,
      }}
      cursor="pointer"
      transition="0.25s"
      position="relative"
      onClick={onClick}
      borderRadius="0.25rem"
      minW="11.125rem"
      maxW="11.25rem"
    >
      <ConfirmTransferModal isOpen={isOpen} onClose={onClose} />
      <svg height="100%" viewBox="0 0 156 42" fill="none" width="100%">
        <path
          d="M139.086 39.72a4 4 0 01-3.612 2.28H20.526a4 4 0 01-3.612-2.28l-16.19-34C-.54 3.065 1.395 0 4.335 0h147.33c2.94 0 4.875 3.065 3.611 5.72l-16.19 34z"
          fill={getColor(theme, color)}
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
          <TxLink chainId={providerChainId} hash={unlockTxHash}>
            <Spinner color="white" size="sm" />
          </TxLink>
        ) : (
          <>
            <Text color="white" fontWeight="bold">
              {text}
            </Text>
            <Image src={icon} ml={2} />
          </>
        )}
      </Flex>
    </Flex>
  );
};
