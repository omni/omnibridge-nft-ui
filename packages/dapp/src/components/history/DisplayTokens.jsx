import { Wrap, WrapItem } from '@chakra-ui/react';
import { TokenDisplay } from 'components/bridge/TokenDisplay';
import React from 'react';

export const DisplayTokens = ({
  chainId,
  token: address,
  tokenIds,
  values,
  tokenUris,
  is1155,
}) => {
  const tokens = tokenIds.map((id, i) => ({
    chainId,
    address,
    tokenId: id,
    amount: values[i] || 0,
    tokenUri: tokenUris[i] || '',
    is1155,
  }));
  return (
    <Wrap spacing="6" my="4">
      {tokens.map((token, index) => (
        <WrapItem key={index.toString()}>
          <TokenDisplay token={token} disableCheckbox />
        </WrapItem>
      ))}
    </Wrap>
  );
};
