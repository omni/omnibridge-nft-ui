import { CheckIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/react';
import React from 'react';

export const Checkbox = ({ isChecked = false, ...props }) => (
  <Flex
    w="1.25rem"
    h="1.25rem"
    bg="blackAlpha.800"
    justify="center"
    align="center"
    borderRadius="0.25rem"
    border="0.5px solid rgba(255, 255, 255, 0.4)"
    {...props}
  >
    {isChecked && <CheckIcon color="white" boxSize="0.625rem" />}
  </Flex>
);
