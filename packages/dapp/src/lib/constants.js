import { BigNumber } from 'ethers';

import { ETH_XDAI_BRIDGE } from './networks';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
export const ETHER_CURRENCY_LOGO =
  'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880';
export const BNB_CURRENCY_LOGO =
  'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615';

export const LARGEST_UINT256 = BigNumber.from(
  '115792089237316195423570985008687907853269984665640564039457584007913129639935',
);

export const POLLING_INTERVAL =
  process.env.REACT_APP_UI_STATUS_UPDATE_INTERVAL || 5000;

export const DEFAULT_BRIDGE_DIRECTION =
  process.env.REACT_APP_DEFAULT_BRIDGE_DIRECTION || ETH_XDAI_BRIDGE;

export const DEFAULT_IMAGE_TIMEOUT = process.env.REACT_IMAGE_TIMEOUT || 10000;

export const NON_ETH_CHAIN_IDS = [56, 77, 100];

export const XDAI_CHAIN_IDS = [77, 100];

export const nativeCurrencies = {
  1: {
    chainId: 1,
    decimals: 18,
    logoURI: ETHER_CURRENCY_LOGO,
    address: ADDRESS_ZERO,
    name: 'Ether',
    symbol: 'ETH',
    mode: 'NATIVE',
  },
  4: {
    chainId: 4,
    decimals: 18,
    logoURI: ETHER_CURRENCY_LOGO,
    address: ADDRESS_ZERO,
    name: 'Rinkeby Ether',
    symbol: 'RETH',
    mode: 'NATIVE',
  },
  42: {
    chainId: 42,
    decimals: 18,
    logoURI: ETHER_CURRENCY_LOGO,
    address: ADDRESS_ZERO,
    name: 'Kovan Ether',
    symbol: 'KETH',
    mode: 'NATIVE',
  },
  56: {
    chainId: 56,
    decimals: 18,
    logoURI: BNB_CURRENCY_LOGO,
    name: 'Binance Coin',
    address: ADDRESS_ZERO,
    symbol: 'BNB',
    mode: 'NATIVE',
  },
};

export const networkNames = {
  1: 'ETH Mainnet',
  4: 'Rinkeby Testnet',
  42: 'Kovan Testnet',
  56: 'Binance Smart Chain',
  77: 'Sokol Testnet',
  100: 'xDai Chain',
};

export const networkLabels = {
  1: 'Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Görli',
  42: 'Kovan',
  56: 'BSC',
  77: 'Sokol',
  100: 'xDai',
};

export const networkCurrencies = {
  1: {
    name: 'Ethereum',
    symbol: 'ETH',
  },
  4: {
    name: 'Ethereum',
    symbol: 'ETH',
  },
  42: {
    name: 'Ethereum',
    symbol: 'ETH',
  },
  56: {
    name: 'Binance Coin',
    symbol: 'BNB',
  },
  77: {
    name: 'Sokol POA',
    symbol: 'SPOA',
  },
  100: {
    name: 'xDai',
    symbol: 'xDai',
  },
};

const {
  REACT_APP_MAINNET_RPC_URL,
  REACT_APP_RINKEBY_RPC_URL,
  REACT_APP_XDAI_RPC_URL,
  REACT_APP_KOVAN_RPC_URL,
  REACT_APP_SOKOL_RPC_URL,
} = process.env;

export const chainUrls = {
  1: {
    rpc: REACT_APP_MAINNET_RPC_URL.split(' '),
    explorer: 'https://etherscan.io',
    chainId: 1,
    name: networkNames[1],
  },
  4: {
    rpc: REACT_APP_RINKEBY_RPC_URL.split(' '),
    explorer: 'https://rinkeby.etherscan.io',
    chainId: 4,
    name: networkNames[4],
  },
  100: {
    rpc: REACT_APP_XDAI_RPC_URL.split(' '),
    explorer: 'https://blockscout.com/xdai/mainnet',
    chainId: 100,
    name: networkNames[100],
  },
  42: {
    rpc: REACT_APP_KOVAN_RPC_URL.split(' '),
    explorer: 'https://kovan.etherscan.io',
    chainId: 42,
    name: networkNames[42],
  },
  77: {
    rpc: REACT_APP_SOKOL_RPC_URL.split(' '),
    explorer: 'https://blockscout.com/poa/sokol',
    chainId: 77,
    name: networkNames[77],
  },
};

export const GRAPH_HEALTH_ENDPOINT =
  'https://api.thegraph.com/index-node/graphql';

export const LOCAL_STORAGE_KEYS = {
  DONT_SHOW_CLAIMS: 'dont-show-claims',
  MAINNET_RPC_URL: 'mainnet-rpc-url',
  RINKEBY_RPC_URL: 'rinkeby-rpc-url',
  XDAI_RPC_URL: 'xdai-rpc-url',
  KOVAN_RPC_URL: 'kovan-rpc-url',
  SOKOL_RPC_URL: 'sokol-rpc-url',
  NEVER_SHOW_CLAIMS: 'never-show-claims',
  INFINITE_UNLOCK: 'infinite-unlock',
  BRIDGE_DIRECTION: 'bridge-direction',
};
