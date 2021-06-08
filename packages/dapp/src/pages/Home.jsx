import { BridgeUI } from 'components/bridge/BridgeUI';
import { BridgeProvider } from 'contexts/BridgeContext';
import React from 'react';

export const Home = () => (
  <BridgeProvider>
    <BridgeUI />
  </BridgeProvider>
);
