import { Contract } from 'ethers';
import { logError } from 'lib/helpers';

import { getTokenUri } from './tokenUri';

export const fetchAllowed = async (
  ethersProvider,
  mediator,
  account,
  token,
) => {
  if (!account || !mediator || !token || !ethersProvider) {
    return false;
  }

  try {
    const abi = [
      'function isApprovedForAll(address _owner, address _operator) view returns (bool)',
    ];
    const tokenContract = new Contract(token, abi, ethersProvider);
    const isAllowed = await tokenContract.isApprovedForAll(account, mediator);
    return isAllowed;
  } catch (allowanceError) {
    logError({ allowanceError });
  }
  return false;
};

export const unlockToken = async (ethersProvider, mediator, token) => {
  const abi = ['function setApprovalForAll(address _operator, bool _approved)'];
  const tokenContract = new Contract(token, abi, ethersProvider.getSigner());
  return tokenContract.setApprovalForAll(mediator, true);
};

export const fetchTokenInfo = async (ethersProvider, localTokenInfo, token) => {
  const { address, name, symbol } = token;
  let tokenInfo = localTokenInfo;
  if (tokenInfo) {
    tokenInfo = { ...token, ...tokenInfo };
  } else if (name && symbol) {
    tokenInfo = { ...token };
  } else {
    try {
      const abi = [
        'function name() public view returns (string)',
        'function symbol() public view returns (string)',
      ];
      const tokenContract = new Contract(address, abi, ethersProvider);
      const [tokenName, tokenSymbol] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
      ]);
      tokenInfo = { ...token, name: tokenName, symbol: tokenSymbol };
    } catch (tokenInfoError) {
      logError({ tokenInfoError, token });
      tokenInfo = { ...token, name: '', symbol: '' };
    }
  }
  return tokenInfo;
};

export const fetchTokenUri = async (ethersProvider, token) => {
  const { address, tokenId, is1155 } = token;
  try {
    const abi = [
      'function tokenURI(uint256 id) public view returns (string)',
      'function uri(uint256 id) public view returns (string)',
    ];
    const tokenContract = new Contract(address, abi, ethersProvider);
    const tokenUri = is1155
      ? await tokenContract.uri(tokenId)
      : await tokenContract.tokenURI(tokenId);

    return { ...token, tokenUri: getTokenUri(tokenUri, tokenId) };
  } catch (tokenInfoError) {
    logError({ tokenInfoError, token });
  }
  return { ...token, tokenUri: '' };
};
