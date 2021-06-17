import { Contract } from 'ethers';

export const relayTokens = async (
  ethersProvider,
  tokens,
  mediator,
  receiver,
) => {
  const signer = ethersProvider.getSigner();
  const { address, tokenIds, amounts, is1155 } = tokens;
  switch (is1155) {
    case true: {
      const abi = ['function relayTokens(address, uint256)'];
      const mediatorContract = new Contract(mediator, abi, signer);
      return mediatorContract.relayTokens(address, tokenIds, amounts, receiver);
    }
    case false:
    default: {
      const abi = ['function relayTokens(address, address, uint256)'];
      const mediatorContract = new Contract(mediator, abi, signer);
      return mediatorContract.relayTokens(address, tokenIds, amounts, receiver);
    }
  }
};
