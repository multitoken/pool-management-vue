import { Config, ConfigToken } from '@/config/types';
import tokensBSC from '@multitoken/assets/data/tokens-bsc.js';

const tokens: { [key: string]: ConfigToken } = {};
for (const token of tokensBSC) {
  tokens[token.addresses.bsc] = {
    address: token.addresses.bsc,
    id: token.coingeckoID,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    color: token.color,
    precision: token.precision,
    hasIcon: false,
    logoUrl: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${token.addresses.bsc}/logo.png`
  };
}

const config: Config = {
  network: 'bsc',
  chainId: 56,
  isTestNet: false,
  defaultPrecision: 3,
  gas: {
    bufferError: 0.0001,
    bufferWarning: 0.0002
  },
  baseToken: {
    name: 'Binance',
    symbol: 'BNB',
    wrappedSymbol: 'WBNB'
  },
  rpcUrl: 'https://bsc-dataseed.binance.org',
  wsUrl:
    'wss://apis.ankr.com/wss/4fa98a79a40945b699190f251f603c58/7d08a3f1129434a5e9e124af13cb8f44/binance/full/main',
  subgraphUrl: 'https://etfs-backend.herokuapp.com/v1/pools/56',
  explorer: 'https://bscscan.com',
  exchangeUrl: 'https://swap.multitoken.com/',
  addresses: {
    bFactory: '0x776EdBbFba114c3F3b34b0154ECE803e74993436',
    bActions: '0xd631704FD9582edF70eC5f0dD13013Afe8a7D0e8',
    dsProxyRegistry: '0xCe150D83E291c44f85771360B067e68730294484',
    proxy: '0x0eAE72E8469a844fa9e02045b32b662E5b44Eafc',
    crpFactory: '0x5F1D2133Ef3D16604dca1b76d8683e3D7dCE1dBb',
    wrapped: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    multicall: '0x41263cBA59EB80dC200F3E2544eda4ed6A90E76C'
  },
  connectors: {
    injected: {
      id: 'injected',
      name: 'MetaMask'
    }
  },
  excludedPoolsIds: [],
  untrusted: [],
  env: process.env.VUE_APP_ENV || 'production',
  tokens: tokens,
  urls: {
    mainnet: process.env.VUE_APP_MAINNET_URL || '/',
    kovan: process.env.VUE_APP_KOVAN_URL || '/',
    bsc: process.env.VUE_APP_BSC_URL || '/'
  }
};

export default config;
