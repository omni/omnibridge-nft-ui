import { utils } from 'ethers';
import {
  getExplorerUrl,
  getNetworkCurrency,
  getNetworkName,
  getRPCUrl,
  logError,
} from 'lib/helpers';

const trySwitchChain = async chainId =>
  window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: utils.hexValue(chainId),
      },
    ],
  });

const tryAddChain = async (chainId, currency) =>
  window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: utils.hexValue(chainId),
        chainName: getNetworkName(chainId),
        nativeCurrency: currency,
        rpcUrls: [getRPCUrl(chainId)],
        blockExplorerUrls: [getExplorerUrl(chainId)],
      },
    ],
  });

export const addChainToMetaMask = async ({ chainId }, add = false) => {
  const { name, symbol } = getNetworkCurrency(chainId);
  const currency = { name, symbol, decimals: 18 };

  if (add) {
    try {
      await tryAddChain(chainId, currency);
      return true;
    } catch (addError) {
      logError({ addError });
    }
    return false;
  }

  try {
    await trySwitchChain(chainId);
    return true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await tryAddChain(chainId, currency);
        return true;
      } catch (addError) {
        logError({ addError });
      }
    } else {
      logError({ switchError });
    }
  }
  return false;
};
