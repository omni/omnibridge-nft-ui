import { CopyIcon } from '@chakra-ui/icons';
import { Flex, Text, Tooltip, useClipboard } from '@chakra-ui/react';
import { TopRightArrowIcon } from 'icons/TopRightArrowIcon';
import React from 'react';

export const TokenTag = ({ children, showArrow = false, copy, ...props }) => {
  const { hasCopied, onCopy } = useClipboard(copy);
  const tag = (
    <Flex
      bg="blackAlpha.800"
      color="white"
      align="center"
      justify="center"
      borderRadius="full"
      px="2"
      fontSize="0.6875rem"
      h="1.25rem"
      cursor={copy ? 'pointer' : 'initial'}
      onClick={onCopy}
      {...props}
    >
      <Text textAlign="center" verticalAlign="center" lineHeight="0.875rem">
        {children}
      </Text>
      {showArrow && (
        <Flex h="0.6rem" direction="column" align="flex-end" ml="0.25rem">
          <TopRightArrowIcon color="white" boxSize="0.5rem" />
        </Flex>
      )}
      {copy && <CopyIcon cursor="pointer" ml="0.25rem" boxSize="0.6875rem" />}
    </Flex>
  );

  return copy ? (
    <Tooltip
      label={
        <Text fontSize="xs">{hasCopied ? 'Copied!' : 'Copy to clipboard'}</Text>
      }
      closeOnClick={false}
    >
      {tag}
    </Tooltip>
  ) : (
    tag
  );
};
