import { Wrap, WrapItem } from '@chakra-ui/react';
import { TokenDisplay } from 'components/common/TokenDisplay';
import React from 'react';

export const DisplayTokens = ({
  tokens: { chainId, address, tokenIds, tokenUris, amounts, is1155 },
}) => {
  const tokens = tokenIds.map((id, i) => ({
    chainId,
    address,
    tokenId: id,
    tokenUri: tokenUris[i] || '',
    amount: amounts[i] || 0,
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
