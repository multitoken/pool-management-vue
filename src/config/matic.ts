import { Config, ConfigToken } from '@/config/types';
import tokensPolygon from '@multitoken/assets/data/tokens-polygon.js';

const tokens: { [key: string]: ConfigToken } = {};
for (const token of tokensPolygon) {
  tokens[token.addresses.matic] = {
    address: token.addresses.matic,
    id: token.coingeckoID,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    color: token.color,
    precision: token.precision,
    hasIcon: false,
    logoUrl: token.logoURI
  };
}

const config: Config = {
  network: 'matic',
  chainId: 137,
  isTestNet: false,
  defaultPrecision: 7,
  gas: {
    bufferError: 0.0001,
    bufferWarning: 0.0002
  },
  baseToken: {
    name: 'Matic',
    symbol: 'MATIC',
    wrappedSymbol: 'WMATIC'
  },
  rpcUrl: 'https://rpc-mainnet.maticvigil.com',
  wsUrl:
    'wss://rpc-mainnet.maticvigil.com/ws',
  subgraphUrl: 'https://api.thegraph.com/subgraphs/name/cron-md/multitoken_matic', // 'https://etfs-backend.herokuapp.com/v1/pools/56',
  explorer: 'https://polygonscan.com',
  exchangeUrl: 'https://quickswap.exchange/#/swap',
  addresses: {
    bFactory: '0xfb045c7Cc1Cf5C40B3e20c038E1706eBB7518d8b',
    bActions: '0x73D306c64739aEa142fE7242cB8c4D2e485dcdF3',
    dsProxyRegistry: '0xaE4575F1e8a622A74b5AEBd9D2F514fA46c4A7ad',
    proxy: '0xe14C31b58ef621f7417567D6ccFc361e71ABD936',
    crpFactory: '0x5a6531CBCC9878B48102c442CF87d7826B91cC72',
    wrapped: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    multicall: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507'
  },
  connectors: {
    injected: {
      id: 'injected',
      name: 'MetaMask'
    }
  },
  untrusted: [],
  env: process.env.VUE_APP_ENV || 'production',
  tokens: tokens,
  urls: {
    mainnet: process.env.VUE_APP_MAINNET_URL || '/',
    kovan: process.env.VUE_APP_KOVAN_URL || '/',
    bsc: process.env.VUE_APP_BSC_URL || '/',
    matic: process.env.VUE_APP_MATIC_URL || '/'
  }
};

export default config;
