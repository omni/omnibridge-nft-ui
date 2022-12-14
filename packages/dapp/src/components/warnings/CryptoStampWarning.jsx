import { Alert, AlertIcon, Flex, Link, Text } from '@chakra-ui/react';
import { useBridgeContext } from 'contexts/BridgeContext';
import React from 'react';

const MAINNET_CRYPTO_STAMP_TOKENS = [
  '0x7e789E2dd1340971De0A9bca35b14AC0939Aa330'.toLowerCase(),
  '0x818737EeC8A5350756DA40D5DDAfda8A84Ade107'.toLowerCase(),
  '0xa7f87E8D193E29bf1eD050Fdd511B79Fe0264d8B'.toLowerCase(),
  '0x478059f577Cb739f0AF0f37A365DD069Ba5BD8Be'.toLowerCase(),
  '0xe38251813B08C2c048B0582A52501acA5Df0BaAb'.toLowerCase(),
  '0x574317b5167521d2E3E34469a6993102FBbd92ed'.toLowerCase(),
];

const XDAI_CRYPTO_STAMP_TOKENS = [
  '0x41CDc950315D5afb5722dfFe0A32153e4DE85456'.toLowerCase(),
  '0x5550f0D022f706d03AD25A72C477684d3416193F'.toLowerCase(),
  '0xFfe8c00c14dEAb02F4734fe3106452B611089323'.toLowerCase(),
  '0xee60885fD9365042E923ED2960BA4cEc474E4446'.toLowerCase(),
  '0xC5EF97923D98d509DeC20fE96Fb6C1d3c221e927'.toLowerCase(),
  '0x143e0E54695E7EB13571B019F87e927c1098066C'.toLowerCase(),
  '0x77E25Fde78CC1052072B2E4f491764c568e60c32'.toLowerCase(),
];

const isCryptoStampToken = ({ address, chainId }) => {
  switch (chainId) {
    case 1:
      return MAINNET_CRYPTO_STAMP_TOKENS.includes(address.toLowerCase());
    case 100:
      return XDAI_CRYPTO_STAMP_TOKENS.includes(address.toLowerCase());
    default:
      return false;
  }
};

export const CryptoStampWarning = () => {
  const { tokens } = useBridgeContext();

  if (!isCryptoStampToken(tokens || {})) return null;

  return (
    <Flex align="center" direction="column" w="100%" mb="4">
      <Alert
        status="warning"
        borderRadius={5}
        boxShadow="0px 1rem 2rem rgba(204, 218, 238, 0.8)"
      >
        <AlertIcon minWidth="20px" />
        <Text fontSize="small">
          Bridging Crypto stamp token via NFT G.U.Bridge is not recommended.
          Please use a dedicated Crypto Stamp the bridge on{' '}
          <Link href="https://crypto.post.at" color="blue.500" isExternal>
            https://crypto.post.at
          </Link>
          .
        </Text>
      </Alert>
    </Flex>
  );
};
