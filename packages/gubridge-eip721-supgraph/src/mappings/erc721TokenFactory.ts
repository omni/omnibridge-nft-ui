import {
  ERC721BridgeContractCreated,
  ERC721NativeContractCreated,
} from '../../generated/ERC721TokenFactory/ERC721TokenFactory';
import {
  ERC721NativeToken as ERC721NativeTokenTemplate,
  ERC721BridgeToken as ERC721BridgeTokenTemplate,
} from '../../generated/templates';

export function handleERC721NativeContractCreated(
  event: ERC721NativeContractCreated,
): void {
  ERC721NativeTokenTemplate.create(event.params._collection);
}

export function handleERC721BridgeContractCreated(
  event: ERC721BridgeContractCreated,
): void {
  ERC721BridgeTokenTemplate.create(event.params._collection);
}
