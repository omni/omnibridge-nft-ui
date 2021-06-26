import { BigNumber, Contract } from 'ethers';

export const relayTokens = async (
  ethersProvider,
  account,
  tokens,
  mediator,
  receiver,
) => {
  const signer = ethersProvider.getSigner();
  const {
    address,
    tokenIds: initTokenIds,
    amounts: initAmounts,
    is1155,
  } = tokens;
  const tokenIds = initTokenIds.map(id => BigNumber.from(id.toString()));
  const amounts = initAmounts.map(amt => BigNumber.from(amt.toString()));
  switch (is1155) {
    case true: {
      const abi = [
        'function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data)',
        'function safeBatchTransferFrom(address _from, address _to, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external',
      ];
      const tokenContract = new Contract(address, abi, signer);
      if (amounts.length > 1) {
        return tokenContract.safeBatchTransferFrom(
          account,
          mediator,
          tokenIds,
          amounts,
          receiver,
        );
      }
      return tokenContract.safeTransferFrom(
        account,
        mediator,
        tokenIds[0],
        amounts[0],
        receiver,
      );
    }
    case false:
    default: {
      const abi = [
        'function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data)',
      ];
      const tokenContract = new Contract(address, abi, signer);
      return tokenContract.safeTransferFrom(
        account,
        mediator,
        tokenIds[0],
        receiver,
      );
    }
  }
};
