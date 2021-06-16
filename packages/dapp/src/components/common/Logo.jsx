import { Image } from '@chakra-ui/react';
import BSCLogo from 'assets/bsc-logo.png';
import EthLogo from 'assets/eth-logo.png';
import xDAILogo from 'assets/xdai-logo.png';
import { useWeb3Context } from 'contexts/Web3Context';
import { useBridgeDirection } from 'hooks/useBridgeDirection';
import React from 'react';

const logos = {
  1: EthLogo,
  4: EthLogo,
  42: EthLogo,
  77: xDAILogo,
  100: xDAILogo,
  56: BSCLogo,
};

export const Logo = ({ reverseFallback = false, ...props }) => {
  const { providerChainId } = useWeb3Context();
  const { getBridgeChainId } = useBridgeDirection();
  const chainId = reverseFallback
    ? getBridgeChainId(providerChainId)
    : providerChainId;
  const fallbackLogo = logos[chainId];
  return <Image src={fallbackLogo} {...props} />;
};
