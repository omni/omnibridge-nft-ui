import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Collapse,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useBreakpointValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { TokenDisplay } from 'components/common/TokenDisplay';
import { useBridgeContext } from 'contexts/BridgeContext';
import React, { useState } from 'react';

const useInputSize = () => {
  const inputSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const inputHeight = useBreakpointValue({
    base: '3.25rem',
    sm: '3.75rem',
    md: '4.375rem',
  });
  const inputLeftPadding = useBreakpointValue({
    base: '0.75rem',
    md: '1.25rem',
  });

  return { inputSize, inputHeight, inputLeftPadding };
};

const getChosenTokens = ({
  address,
  tokenIds,
  tokenUris,
  amounts,
  is1155,
  chainId,
}) =>
  tokenIds.map((id, i) => ({
    tokenId: id,
    tokenUri: tokenUris[i],
    amount: amounts[i],
    address,
    is1155,
    chainId,
  }));

export const BridgeSearch = () => {
  const { tokens, searchText, setSearchText } = useBridgeContext();
  const chosenTokens = tokens ? getChosenTokens(tokens) : [];
  const [searching] = useState(false);
  const { inputSize, inputHeight, inputLeftPadding } = useInputSize();
  const showTokens = chosenTokens.length > 0;

  return (
    <>
      <Flex w="100%" direction="column">
        <Collapse in={showTokens} w="100%">
          <Accordion allowToggle w="100%" defaultIndex={[0]}>
            <AccordionItem border="0">
              <AccordionButton
                borderRadius="0.5rem"
                justifyContent="space-between"
                color="grey"
                _hover={{ color: 'blue.500', bg: 'blackAlpha.50' }}
              >
                <Text fontWeight="bold" fontSize="xl" color="black">
                  Selected Tokens
                </Text>
                <AccordionIcon boxSize="1.5rem" />
              </AccordionButton>
              <AccordionPanel minH="3rem" p="1rem">
                <Wrap spacing="6" minH="10.25rem">
                  {chosenTokens.map((token, index) => (
                    <WrapItem key={index.toString()}>
                      <TokenDisplay token={token} isChecked />
                    </WrapItem>
                  ))}
                </Wrap>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Collapse>
      </Flex>
      <InputGroup
        size={inputSize}
        w="calc(100% - 2rem)"
        h={inputHeight}
        mx="1rem"
      >
        <Input
          border="0"
          bg="white"
          boxShadow="0px 15px 30px rgba(204, 218, 238, 0.8)"
          placeholder="Search ..."
          _placeholder={{ color: 'greyText', fontWeight: 500 }}
          _focus={{ boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' }}
          color="black"
          fontWeight="500"
          h={inputHeight}
          pl={inputLeftPadding}
          pr={inputHeight}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        {searching ? (
          <InputRightElement h={inputHeight} w={inputHeight}>
            <Spinner
              color="blue.500"
              boxSize={{
                base: '1.25rem',
                md: '1.5rem',
              }}
            />
          </InputRightElement>
        ) : null}
      </InputGroup>
    </>
  );
};
