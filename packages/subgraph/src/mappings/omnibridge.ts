import { log } from '@graphprotocol/graph-ts';
import {
  TokensBridgingInitiated,
  TokensBridged,
  Omnibridge,
} from '../types/Omnibridge/Omnibridge';
import { Execution, UserRequest } from '../types/schema';
import { fetchTokenUris, ADDRESS_ZERO } from './helpers';

export function handleBridgeTransfer(event: TokensBridged): void {
  log.debug('Parsing TokensBridged for txHash {}', [
    event.transaction.hash.toHexString(),
  ]);
  let txHash = event.transaction.hash;
  let execution = Execution.load(txHash.toHexString());
  if (execution == null) {
    execution = new Execution(txHash.toHexString());
  }
  execution.txHash = txHash;
  execution.timestamp = event.block.timestamp;
  execution.token = event.params.token;
  execution.recipient = event.params.recipient;
  execution.tokenIds = event.params.tokenIds;
  execution.values = event.params.values;
  execution.messageId = event.params.messageId;
  execution.save();
  log.debug('TokensBridged token {}', [execution.token.toHexString()]);
}

export function handleInitiateTransfer(event: TokensBridgingInitiated): void {
  log.debug('Parsing TokensBridgingInitiated for txHash {}', [
    event.transaction.hash.toHexString(),
  ]);
  let txHash = event.transaction.hash;
  let request = UserRequest.load(txHash.toHexString());
  if (request == null) {
    request = new UserRequest(txHash.toHexString());
  }
  request.txHash = txHash;
  request.timestamp = event.block.timestamp;
  request.token = event.params.token;

  let omnibridge = Omnibridge.bind(event.address);
  let nativeToken = omnibridge.try_nativeTokenAddress(event.params.token);
  request.nativeToken = nativeToken.reverted ? ADDRESS_ZERO : nativeToken.value;

  request.sender = event.params.sender;
  request.tokenIds = event.params.tokenIds;
  request.tokenUris = fetchTokenUris(
    event.params.token,
    event.params.tokenIds,
    event.params.values.length > 0,
  );
  request.values = event.params.values;
  request.messageId = event.params.messageId;
  request.save();
  log.debug('TokensBridgingInitiated token {}', [request.token.toHexString()]);
}
