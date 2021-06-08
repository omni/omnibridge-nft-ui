import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { TokenDisplay } from 'components/bridge/TokenDisplay';
import React from 'react';

export const BridgeTokensDisplay = () => {
  const example721 = {
    type: 'erc-721',
    uri: 'https://openmoji.org/data/color/svg/1F3F3-FE0F-200D-1F308.svg',
  };
  const example1155 = {
    type: 'erc-1155',
    uri: 'https://abcoathup.github.io/SampleERC1155/api/token/0000000000000000000000000000000000000000000000000000000000000000.json',
  };
  const example1155Two = {
    type: 'erc-1155',
    uri: 'https://abcoathup.github.io/SampleERC1155/api/token/0000000000000000000000000000000000000000000000000000000000000002.json',
  };
  const erc721Tokens = [example721, example721];
  const erc1155Tokens = [example1155, example1155Two];

  if (!(erc1155Tokens.length || erc721Tokens.length)) return null;

  return (
    <Accordion allowToggle allowMultiple w="100%" defaultIndex={[0, 1]}>
      {erc721Tokens.length ? (
        <AccordionItem border="0">
          <AccordionButton
            borderRadius="0.5rem"
            justifyContent="space-between"
            color="grey"
            _hover={{ color: 'blue.500', bg: 'blackAlpha.50' }}
          >
            <Text fontWeight="bold" fontSize="xl" color="black">
              ERC-721 Tokens
            </Text>
            <AccordionIcon boxSize="1.5rem" />
          </AccordionButton>
          <AccordionPanel pt="4">
            <Wrap spacing="6">
              {erc721Tokens.map((token, index) => (
                <WrapItem key={index.toString()}>
                  <TokenDisplay token={token} />
                </WrapItem>
              ))}
            </Wrap>
          </AccordionPanel>
        </AccordionItem>
      ) : null}
      {erc1155Tokens.length ? (
        <AccordionItem border="0">
          <AccordionButton
            borderRadius="0.5rem"
            justifyContent="space-between"
            color="grey"
            _hover={{ color: 'blue.500', bg: 'blackAlpha.50' }}
          >
            <Text fontWeight="bold" fontSize="xl" color="black">
              ERC-1155 Tokens
            </Text>
            <AccordionIcon boxSize="1.5rem" />
          </AccordionButton>
          <AccordionPanel pt="4">
            <Wrap spacing="6">
              {erc1155Tokens.map((token, index) => (
                <WrapItem key={index.toString()}>
                  <TokenDisplay token={token} />
                </WrapItem>
              ))}
            </Wrap>
          </AccordionPanel>
        </AccordionItem>
      ) : null}
    </Accordion>
  );
};
