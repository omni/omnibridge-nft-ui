import { Contract, ethers } from 'ethers';

export const deployCollection = async (
  ethersProvider,
  name,
  description,
  factoryAddress,
) => {
  const signer = ethersProvider.getSigner();
  const abi = [
    {
      inputs: [
        {
          internalType: 'string',
          name: '_name',
          type: 'string',
        },
        {
          internalType: 'string',
          name: '_symbol',
          type: 'string',
        },
      ],
      name: 'deployERC721NativeContract',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];

  const factoryContract = new Contract(factoryAddress, abi, signer);
  return factoryContract.deployERC721NativeContract(name, description);
};

export const getDeployedNativeTokenAddress = async txReceipt => {
  if (!txReceipt || !txReceipt.logs) {
    throw Error('No transaction found.');
  }

  const abi = new ethers.utils.Interface([
    'event ERC721NativeContractCreated(address indexed _collection)',
  ]);
  const eventFragment = abi.events[Object.keys(abi.events)[0]];
  const eventTopic = abi.getEventTopic(eventFragment);
  const event = txReceipt.logs.find(e => e.topics[0] === eventTopic);

  if (!event) {
    throw Error('It is not a deploy native token transaction.');
  }

  const decodedLog = abi.decodeEventLog(
    eventFragment,
    event.data,
    event.topics,
  );

  // eslint-disable-next-line no-underscore-dangle
  return decodedLog._collection;
};

export const mintNFT = (
  ethersProvider,
  collectionAddress,
  account,
  tokenURI,
) => {
  const signer = ethersProvider.getSigner();

  const abi = [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_tokenId',
          type: 'uint256',
        },
        {
          internalType: 'string',
          name: '_uri',
          type: 'string',
        },
      ],
      name: 'mint',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];

  const nativeTokenContract = new Contract(collectionAddress, abi, signer);
  return nativeTokenContract.mint(account, new Date().getTime(), tokenURI);
};
