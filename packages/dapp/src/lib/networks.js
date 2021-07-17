export const ETH_XDAI_BRIDGE = 'eth-xdai';
export const RINKEBY_XDAI_BRIDGE = 'rinkeby-xdai';

const ETH_XDAI_BRIDGE_CONFIG = {
  label: 'eth⥊xdai',
  homeChainId: 100,
  foreignChainId: 1,
  foreignMediatorAddress: '0x6C8d0AFDDBD29a0954feEB73904923fC8f73C480'.toLowerCase(),
  homeMediatorAddress: '0x80199C8D04Af4c5cEB532adF4463b18BB4B59ffC'.toLowerCase(),
  foreignAmbAddress: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e'.toLowerCase(),
  homeAmbAddress: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59'.toLowerCase(),
  ambLiveMonitorPrefix: 'https://alm-xdai.herokuapp.com',
  foreignBridgeSubgraph: 'dan13ram/mainnet-xdai-omnibridge-nft',
  homeBridgeSubgraph: 'dan13ram/xdai-mainnet-omnibridge-nft',
  home721Subgraph: 'sunguru98/erc721-xdai-subgraph',
  foreign721Subgraph: 'wighawag/eip721-subgraph',
  home1155Subgraph: 'sunguru98/erc1155-xdai-subgraph',
  foreign1155Subgraph: 'alexvorobiov/eip1155subgraph',
  claimDisabled: false,
  tokensClaimDisabled: [],
};

const RINKEBY_XDAI_BRIDGE_CONFIG = {
  label: 'rinkeby⥊xdai',
  homeChainId: 100,
  foreignChainId: 4,
  foreignMediatorAddress: '0xEc05e3f4D845f0E39e33146395aCE5D35c01Fcc0'.toLowerCase(),
  homeMediatorAddress: '0x2c0bF58cC87763783e35a625ff6a3e50d9E05337'.toLowerCase(),
  foreignAmbAddress: '0xD4075FB57fCf038bFc702c915Ef9592534bED5c1'.toLowerCase(),
  homeAmbAddress: '0xc38D4991c951fE8BCE1a12bEef2046eF36b0FA4A'.toLowerCase(),
  ambLiveMonitorPrefix: 'https://alm-rinkeby.herokuapp.com',
  foreignBridgeSubgraph: 'dan13ram/rinkeby-xdai-omnibridge-nft',
  homeBridgeSubgraph: 'dan13ram/xdai-rinkeby-omnibridge-nft',
  home721Subgraph: 'sunguru98/erc721-xdai-subgraph',
  foreign721Subgraph: 'daisai3/eip721_rinkeby',
  home1155Subgraph: 'sunguru98/erc1155-xdai-subgraph',
  foreign1155Subgraph: 'sunguru98/erc1155-rinkeby-subgraph',
  claimDisabled: true,
  tokensClaimDisabled: [],
};

const ENABLED_BRIDGES = process.env.REACT_APP_ENABLED_BRIDGES.split(
  ' ',
).map(b => b.toLowerCase());

const bridgeInfo = {
  [ETH_XDAI_BRIDGE]: ETH_XDAI_BRIDGE_CONFIG,
  [RINKEBY_XDAI_BRIDGE]: RINKEBY_XDAI_BRIDGE_CONFIG,
};

const getNetworkConfig = bridges => {
  if (bridges && bridges.length > 0 && bridgeInfo) {
    return bridges.reduce((t, b) => ({ ...t, [b]: bridgeInfo[b] }), {});
  }
  return bridgeInfo;
};

export const networks = getNetworkConfig(ENABLED_BRIDGES);
