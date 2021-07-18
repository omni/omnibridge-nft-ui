import { createIcon } from '@chakra-ui/icons';
import * as React from 'react';

export const TopRightArrowIcon = createIcon({
  displayName: 'TopRightArrowIcon',
  path: (
    <path
      d="M0.5 1H5.5M5.5 1L0.5 6M5.5 1V6"
      stroke="currentColor"
      strokeLinecap="round"
    />
  ),
  viewBox: '0 0 6 7',
});
