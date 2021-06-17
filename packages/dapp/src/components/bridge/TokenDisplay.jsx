import { CheckIcon } from '@chakra-ui/icons';
import { Flex, Link, Text, useBoolean, VStack } from '@chakra-ui/react';
import { ImageAsArray as Image } from 'components/bridge/TokenImage';
import { TopRightArrowIcon } from 'icons/TopRightArrowIcon';
import { getExplorerUrl } from 'lib/helpers';
import { getTruncatedAddress, truncateText } from 'lib/stringHelpers';
import React from 'react';

const Checkbox = ({ isChecked = false, ...props }) => (
  <Flex
    w="1.125rem"
    h="1.125rem"
    bg="blackAlpha.800"
    justify="center"
    align="center"
    borderRadius="0.25rem"
    {...props}
  >
    {isChecked && <CheckIcon color="white" boxSize="0.625rem" />}
  </Flex>
);

const TokenTag = ({ children, showArrow = false, ...props }) => (
  <Flex
    bg="blackAlpha.800"
    color="white"
    align="center"
    justify="center"
    borderRadius="full"
    px="2"
    fontSize="0.65rem"
    h="1.125rem"
    {...props}
  >
    <Text textAlign="center" verticalAlign="center" lineHeight="0.875rem">
      {children}
    </Text>
    {showArrow && (
      <Flex h="0.6rem" direction="column" align="flex-end" w="0.65rem">
        <TopRightArrowIcon color="white" boxSize="0.45rem" />
      </Flex>
    )}
  </Flex>
);

export const ERC721TokenDisplay = ({
  token,
  isDisabled = false,
  disableCheckbox = false,
}) => {
  const { chainId, tokenUri, tokenId, address } = token;
  const [isChecked, { toggle: toggleCheck }] = useBoolean(false);
  return (
    <Flex
      w="7.5rem"
      h="7.5rem"
      p="0.5rem"
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
        p="1"
        direction="column"
        justify="space-between"
        role="group"
      >
        <Image
          src={tokenUri}
          w="calc(100% - 1rem)"
          h="calc(100% - 1rem)"
          objectFit="contain"
          objectPosition="center"
          position="absolute"
          top="0.5rem"
          left="0.5rem"
          pointerEvents="none"
        />
        <Flex justify="flex-end" transform="translate(0%, 0%)">
          {isDisabled || disableCheckbox ? null : (
            <Checkbox
              isChecked={isChecked}
              onClick={toggleCheck}
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
  );
};

export const ERC1155TokenDisplay = ({
  token,
  isDisabled = false,
  disableCheckbox = false,
}) => {
  const { chainId, tokenUri, tokenId, amount, address } = token;
  const [isChecked, { toggle: toggleCheck }] = useBoolean(false);
  return (
    <Flex
      w="7.5rem"
      h="7.5rem"
      justify="center"
      align="center"
      position="relative"
    >
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
        w="7.5rem"
        h="7.5rem"
        p="0.5rem"
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
          p="1"
          direction="column"
          justify="space-between"
          role="group"
        >
          <Image
            src={tokenUri}
            w="calc(100% - 1rem)"
            h="calc(100% - 1rem)"
            objectFit="contain"
            objectPosition="center"
            position="absolute"
            top="0.5rem"
            left="0.5rem"
            pointerEvents="none"
          />
          <Flex justify="space-between" transform="translate(0%, 0%)">
            <TokenTag>{`x${amount}`}</TokenTag>
            {isDisabled || disableCheckbox ? null : (
              <Checkbox
                isChecked={isChecked}
                onClick={toggleCheck}
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

export const TokenDisplay = ({
  token,
  disableCheckbox = false,
  isDisabled = false,
}) => {
  const { is1155 } = token;

  return is1155 ? (
    <ERC1155TokenDisplay
      token={token}
      disableCheckbox={disableCheckbox}
      isDisabled={isDisabled}
    />
  ) : (
    <ERC721TokenDisplay
      token={token}
      disableCheckbox={disableCheckbox}
      isDisabled={isDisabled}
    />
  );
};
