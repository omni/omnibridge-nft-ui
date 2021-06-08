import { Flex } from '@chakra-ui/react';
import { fetchImageUri } from 'lib/uriHelpers';
import React, { useEffect, useState } from 'react';

export const ERC721TokenDisplay = ({ token }) => {
  const { imageUri } = token;
  return (
    <Flex
      w="7.5rem"
      h="7.5rem"
      justify="center"
      align="center"
      border="10px solid white"
      borderRadius="6px"
      overflow="hidden"
      bgColor="white"
    >
      <Flex
        bgColor="white"
        bgImage={imageUri ? `url(${imageUri})` : undefined}
        bgPos="center"
        bgSize="contain"
        bgRepeat="no-repeat"
        borderRadius="6px"
        overflow="hidden"
        w="100%"
        h="100%"
      />
    </Flex>
  );
};

export const ERC1155TokenDisplay = ({ token }) => {
  const { imageUri } = token;
  return (
    <Flex
      w="7.5rem"
      h="7.5rem"
      justify="center"
      align="center"
      border="10px solid white"
      borderRadius="6px"
      overflow="hidden"
      bgColor="white"
    >
      <Flex
        bgColor="white"
        bgImage={imageUri ? `url(${imageUri})` : undefined}
        bgPos="center"
        bgSize="contain"
        bgRepeat="no-repeat"
        borderRadius="6px"
        overflow="hidden"
        w="100%"
        h="100%"
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
