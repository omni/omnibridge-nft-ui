import { Text } from '@chakra-ui/react';
import React from 'react';

export const About = () => (
  <Text>Version: {process.env.REACT_APP_VERSION}</Text>
);
