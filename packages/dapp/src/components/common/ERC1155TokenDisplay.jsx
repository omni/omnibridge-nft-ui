import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Checkbox } from 'components/common/Checkbox';
import { Image } from 'components/common/TokenImage';
import { TokenTag } from 'components/common/TokenTag';
import { useBridgeContext } from 'contexts/BridgeContext';
import { getExplorerUrl } from 'lib/helpers';
import { getTruncatedAddress, truncateText } from 'lib/stringHelpers';
import React, { useCallback, useEffect, useState } from 'react';

export const ERC1155TokenDisplay = ({
  token,
  disableCheckbox = false,
  isChecked: inputIsChecked = false,
}) => {
  const [isDisabled, setDisabled] = useState(false);
  const { chainId, tokenUri, tokenId, amount, address } = token;
  const [isChecked, setChecked] = useState(inputIsChecked);
  const {
    tokens: selectedTokens,
    selectToken,
    unselectToken,
  } = useBridgeContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onCheck = useCallback(() => {
    if (disableCheckbox) return;
    if (!isChecked) {
      onOpen();
    } else {
      unselectToken(token);
      setChecked(false);
    }
  }, [disableCheckbox, isChecked, unselectToken, token, onOpen]);

  useEffect(() => {
    if (disableCheckbox) return;
    setDisabled(selectedTokens ? selectedTokens.address !== address : false);
    setChecked(
      selectedTokens ? selectedTokens.tokenIds.includes(tokenId) : false,
    );
  }, [disableCheckbox, selectedTokens, address, tokenId]);

  return (
    <Flex
      w="8.75rem"
      h="8.75rem"
      justify="center"
      align="center"
      position="relative"
    >
      {!disableCheckbox && (
        <SelectEIP1155TokenModal
          isOpen={isOpen}
          onClose={onClose}
          selectToken={selectToken}
          token={token}
          setChecked={setChecked}
        />
      )}
      <Flex
        w="calc(100% - 1.25rem)"
        h="calc(100% + 0.625rem)"
        position="absolute"
        top="0"
        left="0.625rem"
        borderRadius="0.375rem"
        background="linear-gradient(180deg, rgba(255, 255, 255, 0) 96.55%, #FFFFFF 100%)"
      />
      <Flex
        w="calc(100% - 0.625rem)"
        h="calc(100% + 0.3125rem)"
        position="absolute"
        top="0"
        left="0.3125rem"
        borderRadius="0.375rem"
        background="linear-gradient(180deg, rgba(255, 255, 255, 0) 96.43%, #FFFFFF 100%)"
      />
      <Flex
        w="8.75rem"
        h="8.75rem"
        p="0.625rem"
        justify="center"
        align="center"
        borderRadius="0.375rem"
        overflow="hidden"
        bgColor="white"
        position="relative"
        opacity={isDisabled ? 0.5 : 1}
        disabled={isDisabled}
      >
        <Flex
          bgColor="white"
          borderRadius="0.375rem"
          overflow="hidden"
          w="100%"
          h="100%"
          p="0.3125rem"
          direction="column"
          justify="space-between"
          role="group"
        >
          <Image
            src={tokenUri}
            w="calc(100% - 1.25rem)"
            h="calc(100% - 1.25rem)"
            objectFit="contain"
            objectPosition="center"
            position="absolute"
            top="0.625rem"
            left="0.625rem"
            pointerEvents="none"
          />
          <Flex justify="space-between" transform="translate(0%, 0%)">
            <TokenTag>{`x${amount}`}</TokenTag>
            {isDisabled || disableCheckbox ? null : (
              <Checkbox
                isChecked={isChecked}
                onClick={onCheck}
                cursor="pointer"
              />
            )}
          </Flex>
          <VStack
            transform="translate(0%, 0%)"
            spacing="0.3125rem"
            w="100%"
            align="flex-start"
            visibility="hidden"
            opacity={0}
            transition="all 0.25s"
            _groupHover={{ visibility: 'visible', opacity: 1 }}
          >
            <TokenTag>EIP-1155</TokenTag>
            <TokenTag>{`ID: ${truncateText(tokenId.toString(), 10)}`}</TokenTag>
            <Link
              href={`${getExplorerUrl(chainId)}/address/${address}`}
              isExternal
            >
              <TokenTag cursor="pointer" showArrow>
                {getTruncatedAddress(address)}
              </TokenTag>
            </Link>
          </VStack>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const SelectEIP1155TokenModal = ({
  isOpen,
  onClose,
  selectToken,
  setChecked,
  token,
}) => {
  const [amount, setAmount] = useState(0);
  const onClick = useCallback(() => {
    selectToken({ ...token, amount: amount.toString() });
    setChecked(true);
    onClose();
  }, [token, amount, setChecked, onClose, selectToken]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay background="modalBG">
        <ModalContent
          boxShadow="0px 1rem 2rem #617492"
          borderRadius="1rem"
          maxW="19rem"
          mx={{ base: 12, lg: 0 }}
        >
          <ModalHeader p={6}>
            <Text>Choose number of tokens</Text>
          </ModalHeader>
          <ModalCloseButton
            size="lg"
            top={-10}
            right={-10}
            color="white"
            p={2}
          />
          <ModalBody px={6} py={0}>
            <VStack align="stretch" spacing="4">
              <Flex
                p="2rem"
                justify="center"
                align="center"
                bg="#EEf4FD"
                borderRadius="1rem"
              >
                <ERC1155TokenDisplay token={token} disableCheckbox />
              </Flex>
              <Text>Quantity</Text>
              <InputGroup>
                <Input
                  borderColor="#DAE3F0"
                  bg="white"
                  placeholder="Amount"
                  _placeholder={{ color: 'greyText' }}
                  color="black"
                  step="1"
                  type="number"
                  value={amount > 0 ? amount.toString() : ''}
                  onChange={e =>
                    setAmount(
                      e.target.value ? Number.parseInt(e.target.value, 10) : 0,
                    )
                  }
                  isInvalid={amount < 0 || amount > token.amount}
                  _focus={{ boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' }}
                  _invalid={{
                    boxShadow: '0 0 0 3px #ef5d5d !important',
                  }}
                  pr="7rem"
                />
                <InputRightElement w="auto" pr="0.5rem">
                  Max: {token.amount}
                </InputRightElement>
              </InputGroup>
            </VStack>
          </ModalBody>
          <ModalFooter p={6}>
            <Button
              px={12}
              colorScheme="blue"
              mt={{ base: 2, md: 0 }}
              w="100%"
              onClick={onClick}
              isDisabled={amount <= 0 || amount > token.amount}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
