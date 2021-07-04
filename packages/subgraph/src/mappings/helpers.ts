import {
  BigInt,
  Bytes,
  Address,
  log,
  dataSource,
} from '@graphprotocol/graph-ts';

import { Token } from '../types/Omnibridge/Token';

export var ADDRESS_ZERO: Address = Address.fromHexString(
  '0x0000000000000000000000000000000000000000',
) as Address;

export function getDirection(): String {
  let network = dataSource.network();
  let address = dataSource.address();
  if (network == 'xdai') {
    if (
      address ==
        Address.fromString('0x2c0bF58cC87763783e35a625ff6a3e50d9E05337') ||
      address ==
        Address.fromString('0xc38D4991c951fE8BCE1a12bEef2046eF36b0FA4A')
    ) {
      return 'rinkeby-xdai';
    }
    return 'mainnet-xdai';
  } else if (network == 'mainnet') {
    return 'mainnet-xdai';
  } else if (network == 'rinkeby') {
    return 'rinkeby-xdai';
  } else if (network == 'poa-sokol' || network == 'kovan') {
    return 'kovan-sokol';
  }
  return '';
}

export function fetchTokenUris(
  address: Address,
  tokenIds: Array<BigInt>,
  is1155: boolean,
): Array<string> {
  let tokenInstance = Token.bind(address);
  log.debug('TokenContract at {}', [address.toHex()]);

  let tokenUris = new Array<string>();
  for (let i = 0; i < tokenIds.length; i = i + 1) {
    let tokenId = tokenIds[i];
    let uri = is1155
      ? tokenInstance.try_uri(tokenId)
      : tokenInstance.try_tokenURI(tokenId);
    tokenUris.push(uri.reverted ? '' : uri.value);
  }

  return tokenUris;
}

// headerLength = 79 + sourceChainIdLength + destinationChainIdLength
// for bsc, sokol, kovan, xdai and mainnet chainId < 255
// => len(chainId) = 1
var HEADER_LENGTH = 79 + 1 + 1;
var METHOD_SIGNATURE_LENGTH = 4;
var PADDED_LENGTH = 32;
var ADDRESS_LENGTH = 20;

var handleNativeNFT = Bytes.fromHexString('0x6ca48357') as Bytes;
var handleBridgedNFT = Bytes.fromHexString('0xb701e094') as Bytes;
var deployAndHandleBridgedNFT = Bytes.fromHexString('0xf92d7468') as Bytes;

export function decodeRecipient(encodedData: Bytes): Bytes {
  let data = encodedData.subarray(HEADER_LENGTH + METHOD_SIGNATURE_LENGTH);

  let method = encodedData.subarray(
    HEADER_LENGTH,
    HEADER_LENGTH + METHOD_SIGNATURE_LENGTH,
  ) as Bytes;

  if (method == handleNativeNFT || method == handleBridgedNFT) {
    // _token, 0 - 32
    // _receiver, 32 - 64
    return data.subarray(
      2 * PADDED_LENGTH - ADDRESS_LENGTH, // removing padded zeros
      2 * PADDED_LENGTH,
    ) as Bytes;
  } else if (method == deployAndHandleBridgedNFT) {
    // _token, 0 - 32
    // name, 32 - 64
    // symbol, 64 - 96
    // _receiver, 128 - 160
    return data.subarray(
      4 * PADDED_LENGTH - ADDRESS_LENGTH, // removing padded zeros
      4 * PADDED_LENGTH,
    ) as Bytes;
  }
  return null;
}
