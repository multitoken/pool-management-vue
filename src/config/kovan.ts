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
    multicall: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
    blackList: '0x92F8f7cfeF6266C5fc92567D1dF0c297D5586F31'
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
