import React from 'react';

import { BridgeTokens } from '../components/bridge/BridgeTokens';
import { BridgeProvider } from '../contexts/BridgeContext';

export const Home = () => (
  <BridgeProvider>
    <BridgeTokens />
  </BridgeProvider>
);
