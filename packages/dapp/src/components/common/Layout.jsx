import { Flex } from '@chakra-ui/react';
import { ConnectWeb3 } from 'components/common/ConnectWeb3';
import { Footer } from 'components/common/Footer';
import { Header } from 'components/common/Header';
import { TermsOfServiceModal } from 'components/modals/TermsOfServiceModal';
import { useWeb3Context } from 'contexts/Web3Context';
import { useBridgeDirection } from 'hooks/useBridgeDirection';
import React, { useMemo } from 'react';

export const Layout = ({ children }) => {
  const { homeChainId, foreignChainId } = useBridgeDirection();
  const { account, providerChainId } = useWeb3Context();

  const valid = useMemo(
    () =>
      !!account &&
      !!providerChainId &&
      [homeChainId, foreignChainId].indexOf(providerChainId) >= 0,
    [account, providerChainId, homeChainId, foreignChainId],
  );

  return (
    <Flex
      p={0}
      m={0}
      overflowX="hidden"
      fontFamily="body"
      w="100%"
      minH="100vh"
      align="center"
      direction="column"
      background="background"
      position="relative"
    >
      <Header />
      <Flex
        flex={1}
        align="center"
        justify="flex-start"
        direction="column"
        w="100%"
        h="100%"
        position="relative"
      >
        {valid ? children : <ConnectWeb3 />}
      </Flex>
      <Footer />
      <TermsOfServiceModal />
    </Flex>
  );
};
