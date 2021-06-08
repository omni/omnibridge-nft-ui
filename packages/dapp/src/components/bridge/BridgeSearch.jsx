import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useBreakpointValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { TokenDisplay } from 'components/bridge/TokenDisplay';
import React, { useState } from 'react';

const useInputSize = () => {
  const inputSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const inputHeight = useBreakpointValue({
    base: '3.25rem',
    sm: '3.5rem',
    md: '4rem',
  });
  const inputLeftPadding = useBreakpointValue({
    base: '0.75rem',
    md: '1.25rem',
  });

  return { inputSize, inputHeight, inputLeftPadding };
};

export const BridgeSearch = () => {
  const chosenTokens = [];
  const [searching] = useState(false);
  const { inputSize, inputHeight, inputLeftPadding } = useInputSize();

  return (
    <>
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
          <AccordionPanel pt="4">
            {chosenTokens.length ? (
              <Wrap spacing="6">
                {chosenTokens.map((token, index) => (
                  <WrapItem key={index.toString()}>
                    <TokenDisplay token={token} />
                  </WrapItem>
                ))}
              </Wrap>
            ) : (
              <Text color="greyText" fontSize="sm" w="100%">
                Choose token from your wallet
              </Text>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
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
          _placeholder={{ color: 'greyText' }}
          _focus={{ boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' }}
          color="black"
          h={inputHeight}
          pl={inputLeftPadding}
          pr={inputHeight}
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
