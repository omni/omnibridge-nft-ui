import { ERC721TokenDisplay } from 'components/common/ERC721TokenDisplay';
import { ERC1155TokenDisplay } from 'components/common/ERC1155TokenDisplay';
import { useWeb3Context } from 'contexts/Web3Context';
import React, { useCallback, useEffect, useState } from 'react';

export const TokenDisplay = ({
  token: inputToken,
  disableCheckbox = false,
  disableRefresh = false,
  isChecked = false,
  isDisabled = false,
}) => {
  const [token, setToken] = useState(inputToken);
  const { refreshToken, fetchToken } = useWeb3Context();
  const { is1155 } = token;

  const onRefresh = useCallback(() => {
    refreshToken(token).then(setToken);
  }, [token, refreshToken]);

  useEffect(() => {
    fetchToken(inputToken).then(setToken);
  }, [inputToken, fetchToken]);

  return is1155 ? (
    <ERC1155TokenDisplay
      token={token}
      disableCheckbox={disableCheckbox}
      isChecked={isChecked}
      isDisabled={isDisabled}
      onRefresh={disableRefresh ? undefined : onRefresh}
    />
  ) : (
    <ERC721TokenDisplay
      token={token}
      isChecked={isChecked}
      disableCheckbox={disableCheckbox}
      isDisabled={isDisabled}
      onRefresh={disableRefresh ? undefined : onRefresh}
    />
  );
};
