import { Config, ConfigToken } from '@/config/types';
import tokensETH from '@multitoken/assets/data/tokens-eth.js';

const tokens: { [key: string]: ConfigToken } = {};
for (const token of tokensETH) {
  tokens[token.addresses.kovan] = {
    address: token.addresses.kovan,
    id: token.coingeckoID,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    color: token.color,
    precision: token.precision,
    hasIcon: false,
    logoUrl: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.addresses.main}/logo.png`
  };
}

const config: Config = {
  network: 'kovan',
  chainId: 42,
  isTestNet: true,
  defaultPrecision: 2,
  gas: {
    bufferError: 0.001,
    bufferWarning: 0.02
  },
  baseToken: {
    name: 'Ethereum',
    symbol: 'ETH',
    wrappedSymbol: 'WETH'
  },
  rpcUrl: 'https://kovan.infura.io/v3/c85c3269b9c9414bb8f35b3bf68c1412',
  wsUrl: 'wss://kovan.infura.io/ws/v3/c85c3269b9c9414bb8f35b3bf68c1412',
  subgraphUrl: 'https://api.thegraph.com/subgraphs/name/cron-md/multitoken',
  explorer: 'https://kovan.etherscan.io',
  exchangeUrl: 'https://swap.multitoken.com/#/swap',
  addresses: {
    bFactory: '0xfdFb567fe7634FCca702Cd6a83c3a733AFbd944e',
    bActions: '0x4e913Bb6fEedCA8500cC4F70628b61219DC5C02a',
    dsProxyRegistry: '0xbF1f7a145ADfF7ef6C1cfCD731bd5b3fB630acdC',
    proxy: '0xd401AB4E848Af3297bd2515331607Fee6dC538Af',
    crpFactory: '0x347DE12015cE231F7cd569c56DeD78a22273469D',
    wrapped: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
    multicall: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A'
  },
  connectors: {
    injected: {
      id: 'injected',
      name: 'MetaMask'
    },
    walletconnect: {
      id: 'walletconnect',
      name: 'WalletConnect',
      options: {
        rpc: {
          '42':
            'https://eth-kovan.alchemyapi.io/v2/C467LJc7Aa761LLxlcxXvhIG9HzDTtKw'
        }
      }
    },
    portis: {
      id: 'portis',
      name: 'Portis',
      options: {
        network: 'kovan',
        dappId: '3f1c3cfc-7dd5-4e8a-aa03-71ff7396d9fe'
      }
    },
    walletlink: {
      id: 'walletlink',
      name: 'Coinbase',
      options: {
        appName: 'Multitoken - ETF marketplace',
        darkMode: true,
        chainId: 42,
        ethJsonrpcUrl:
          'https://eth-kovan.alchemyapi.io/v2/C467LJc7Aa761LLxlcxXvhIG9HzDTtKw'
      }
    },
    fortmatic: {
      id: 'fortmatic',
      name: 'Fortmatic',
      options: {
        apiKey: 'pk_live_9CE8FD92E54684ED'
      }
    }
  },
  excludedPoolsIds: [
    '0x1e7967bfab4c2050d15707136fbb2812476f0cfb',
    '0x03544dc2d0900bcef3bc09969e3ed5044ab2c802',
    '0xbc3b9572eb9065d9f53d93c2d2c612626a07a4a0',
    '0x755130d13d6846f9fae864d004c56e633c88b9e4',
    '0xffe8899b19c625bd19dbc5f00f9fe897b00f4973',
    '0xfadc0cd8b0fd00c9717e46e3e87c1f861334d526',
    '0xf6ec55a7c31ea21d68c248b058ab2421285ec005',
    '0xdc1fc4c2794cb60bc3d51e5feef8bc1f9f7dce6f',
    '0xd24f60a348b1eea428cc696fb64ba9c0dbe04e41',
    '0xd236eb3cd2be4284c71dbf86a5804e9e97af93c1',
    '0x19f3d186d89addc92cc000f8994a89b428a230e6',
    '0x0099c6f24f77c0ab440a59357d5bb24753d992c3',
    '0x720ea1e156642c7f39e14d86ef4b0d5acb1895b3',
    '0xf907d8c68477faca1b8a093c9685634fe22bf24c',
    '0xdcbf887f1fb4bdead58d2ddb2531ef69e0a23f4e',
    '0xd28f6db2d7cdabfe674f1b48da7e03b41403ca20',
    '0x56216d36f3841ae75a9e6e5201f81bb032876f4a',
    '0x154745003955f73aea058297c57b92c6d035ff30'
  ],
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
