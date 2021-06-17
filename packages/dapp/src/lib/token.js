import { Contract } from 'ethers';
import { logError } from 'lib/helpers';

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
