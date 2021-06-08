import { CheckIcon } from '@chakra-ui/icons';
import { Flex, useBoolean } from '@chakra-ui/react';
import { fetchImageUri } from 'lib/uriHelpers';
import React, { useEffect, useState } from 'react';

const Checkbox = ({ isChecked = false }) => (
  <Flex
    w="5"
    h="5"
    bg="blackAlpha.800"
    justify="center"
    align="center"
    borderRadius="0.25rem"
  >
    {isChecked && <CheckIcon color="white" boxSize="0.7rem" />}
  </Flex>
);

export const ERC721TokenDisplay = ({ token, isDisabled = false }) => {
  const { imageUri } = token;
  const [isChecked, { toggle: toggleCheck }] = useBoolean(false);
  return (
    <Flex
      as="button"
      w="7.5rem"
      h="7.5rem"
      p="0.5rem"
      justify="center"
      align="center"
      borderRadius="0.375rem"
      overflow="hidden"
      bgColor="white"
      onClick={isDisabled ? undefined : toggleCheck}
      position="relative"
      opacity={isDisabled ? 0.5 : 1}
      disabled={isDisabled}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
    >
      <Flex
        bgColor="white"
        bgImage={imageUri ? `url(${imageUri})` : undefined}
        bgPos="center"
        bgSize="contain"
        bgRepeat="no-repeat"
        borderRadius="0.375rem"
        overflow="hidden"
        w="100%"
        h="100%"
        p="1"
        direction="column"
      >
        {isDisabled ? null : (
          <Flex justify="flex-end">
            <Checkbox isChecked={isChecked} />
          </Flex>
        )}
      </Flex>
      <Flex
        w="100%"
        h="100%"
        position="absolute"
        top="0"
        left="0"
        transition="background 0.25s"
        _hover={isDisabled ? {} : { bg: 'blackAlpha.200' }}
      />
    </Flex>
  );
};

export const ERC1155TokenDisplay = ({ token, isDisabled = false }) => {
  const { imageUri, amount = 10 } = token;
  const [isChecked, { toggle: toggleCheck }] = useBoolean(false);
  return (
    <Flex
      as="button"
      w="7.5rem"
      h="7.5rem"
      p="0.5rem"
      justify="center"
      align="center"
      borderRadius="0.375rem"
      overflow="hidden"
      bgColor="white"
      onClick={isDisabled ? undefined : toggleCheck}
      position="relative"
      opacity={isDisabled ? 0.5 : 1}
      disabled={isDisabled}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
    >
      <Flex
        bgColor="white"
        bgImage={imageUri ? `url(${imageUri})` : undefined}
        bgPos="center"
        bgSize="contain"
        bgRepeat="no-repeat"
        borderRadius="0.375rem"
        overflow="hidden"
        w="100%"
        h="100%"
        p="1"
        direction="column"
      >
        <Flex justify="space-between">
          <Flex
            bg="blackAlpha.800"
            color="white"
            align="center"
            justify="center"
            borderRadius="full"
            px="2"
            fontSize="0.65rem"
            h="1.25rem"
          >
            {`x${amount}`}
          </Flex>
          {isDisabled ? null : <Checkbox isChecked={isChecked} />}
        </Flex>
      </Flex>
      <Flex
        w="100%"
        h="100%"
        position="absolute"
        top="0"
        left="0"
        transition="background 0.25s"
        _hover={isDisabled ? {} : { bg: 'blackAlpha.200' }}
      />
    </Flex>
  );
};

export const TokenDisplay = ({ token: inputToken }) => {
  const { type, uri } = inputToken;

  const [imageUri, setImageUri] = useState(uri);

  useEffect(() => {
    fetchImageUri(uri).then(setImageUri);
  }, [uri]);

  const token = { ...inputToken, imageUri };

  return type === 'erc-1155' ? (
    <ERC1155TokenDisplay token={token} />
  ) : (
    <ERC721TokenDisplay token={token} />
  );
};
