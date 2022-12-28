export const GUSANDBOX_GOERLI_BRIDGE = 'gusandbox-goerli-dev';

const GUSANDBOX_GOERLI_BRIDGE_CONFIG = {
  label: 'G.U.Sandbox⥊Görli',
  homeChainId: 99999,
  foreignChainId: 5,
  foreignMediatorAddress:
    '0x8309DEC1fb0a71D5c388dcc1B926DbE648F0e4E8'.toLowerCase(),
  homeMediatorAddress:
    '0xBaaD008D6ec64e9741189c098a8094d096355d54'.toLowerCase(),
  foreignAmbAddress: '0x0F806D8dd8bb02Ad9dd9bA0e8e351B4319cc45e4'.toLowerCase(),
  homeAmbAddress: '0xc39eAbae09273F00Ec7e56B6a8C189437a61C9C8'.toLowerCase(),
  ambLiveMonitorPrefix:
    'https://alm-gusandbox-goerli-dot-gu-bridge.an.r.appspot.com',
  foreignBridgeSubgraph: 'cuonghx1108/goerli-gu-omnibridge-nft-dev',
  homeBridgeSubgraph: 'cuonghx-gutech/gusandbox-goerli-omnibridge-nft-dev',
  home721Subgraph: 'cuonghx1108/gu-bridge-eip721-dev',
  foreign721Subgraph: 'cuonghx1108/gu-bridge-eip721-dev',
  home1155Subgraph: 'gulabs/erc1155-subgraph',
  foreign1155Subgraph: 'cuonghx1108/eip1155-goerli',
  claimDisabled: false,
  tokensClaimDisabled: [],
  tokenFactoryAddress: '0xF00046710b8480F42126726c2c4b2ACd9AdB3a03',
};

const ENABLED_BRIDGES = process.env.REACT_APP_ENABLED_BRIDGES.split(' ').map(
  b => b.toLowerCase(),
);

const bridgeInfo = {
  [GUSANDBOX_GOERLI_BRIDGE]: GUSANDBOX_GOERLI_BRIDGE_CONFIG,
};

const getNetworkConfig = bridges => {
  if (bridges && bridges.length > 0 && bridgeInfo) {
    return bridges.reduce((t, b) => ({ ...t, [b]: bridgeInfo[b] }), {});
  }
  return bridgeInfo;
};

export const networks = getNetworkConfig(ENABLED_BRIDGES);
