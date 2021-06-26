import { ERC721TokenDisplay } from 'components/common/ERC721TokenDisplay';
import { ERC1155TokenDisplay } from 'components/common/ERC1155TokenDisplay';
import React from 'react';

export const TokenDisplay = ({
  token,
  disableCheckbox = false,
  isChecked = false,
  isDisabled = false,
}) => {
  const { is1155 } = token;

  return is1155 ? (
    <ERC1155TokenDisplay
      token={token}
      disableCheckbox={disableCheckbox}
      isChecked={isChecked}
      isDisabled={isDisabled}
    />
  ) : (
    <ERC721TokenDisplay
      token={token}
      isChecked={isChecked}
      disableCheckbox={disableCheckbox}
      isDisabled={isDisabled}
    />
  );
};
