import { Flex, Link, VStack } from '@chakra-ui/react';
import { Checkbox } from 'components/common/Checkbox';
import { Image } from 'components/common/TokenImage';
import { TokenTag } from 'components/common/TokenTag';
import { useBridgeContext } from 'contexts/BridgeContext';
import { getExplorerUrl } from 'lib/helpers';
import { getTruncatedAddress, truncateText } from 'lib/stringHelpers';
import React, { useCallback, useEffect, useState } from 'react';

export const ERC721TokenDisplay = ({
  token,
  disableCheckbox = false,
  isChecked: inputIsChecked = false,
}) => {
  const [isDisabled, setDisabled] = useState(false);
  const { chainId, tokenUri, tokenId, address } = token;
  const [isChecked, setChecked] = useState(inputIsChecked);
  const {
    tokens: selectedTokens,
    selectToken,
    unselectToken,
  } = useBridgeContext();

  const onCheck = useCallback(() => {
    if (disableCheckbox) return;
    if (!isChecked) {
      selectToken(token);
      setChecked(true);
    } else {
      unselectToken(token);
      setChecked(false);
    }
  }, [disableCheckbox, isChecked, selectToken, unselectToken, token]);

  useEffect(() => {
    if (disableCheckbox) return;
    setDisabled(
      selectedTokens
        ? !(
            selectedTokens.address === address &&
            selectedTokens.tokenIds.includes(tokenId)
          )
        : false,
    );
    setChecked(
      selectedTokens ? selectedTokens.tokenIds.includes(tokenId) : false,
    );
  }, [disableCheckbox, selectedTokens, address, tokenId]);

  return (
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
      cursor={isDisabled ? 'not-allowed' : 'initial'}
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
        <Flex justify="flex-end" transform="translate(0%, 0%)">
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
          _groupHover={
            isDisabled ? undefined : { visibility: 'visible', opacity: 1 }
          }
        >
          <TokenTag>EIP-721</TokenTag>
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
