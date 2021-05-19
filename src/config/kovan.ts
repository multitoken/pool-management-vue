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
    address: 'ether',
    name: 'Ethereum',
    symbol: 'ETH',
    wrappedSymbol: 'WETH'
  },
  rpcUrl: 'https://kovan.infura.io/v3/c85c3269b9c9414bb8f35b3bf68c1412',
  wsUrl: 'wss://kovan.infura.io/ws/v3/c85c3269b9c9414bb8f35b3bf68c1412',
  subgraphUrl: 'https://api.thegraph.com/subgraphs/name/cron-md/multitoken',
  explorer: 'https://kovan.etherscan.io',
  exchangeUrl: 'https://swap.multitoken.com',
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
    '0xac0a60fb1db03bb5b944dd7473530ec178f1bcd9',
    '0x9c31015dd1cc037b4b6169562024a36a71079893',
    '0xcbbb1dc635cc5789b95f27deb2a039362ce2f559',
    '0x1b6cb8caf4c4738c72c3966e8153284438ebd909',
    '0x5ff117aa7ba02b729d942631c8d88fcc2bcf7878',
    '0x37dcf3fdace7ab55d15fd05c0112c6f1596d70ab',
    '0xfa572726e89aa82847280244e06873debed5acf4',
    '0xef008f0f3e57713f665a23b9b8ee76f44ca69db2',
    '0xd68715b616fc2b4f03252c7b9e54d7dc83b969dc',
    '0xc29186483b3d7be1f7af3a7e7772f0e41440ea7d',
    '0x7c71f9476b7c9c6b1e846e529cf59789be8a0bf6',
    '0x5915622abcfe4ae753d5ad7a0dab03856348e06c',
    '0x4b05043222389f789b088c064156f5e8c5669e29',
    '0xeafb30bb014bcabf7de59307a883d196ca2c3ec3',
    '0xde3b773f50ebd7868c8957f6e968f9c970f90c9b',
    '0x9558711c0278a054241fc04a2d71b8e6ded28004',
    '0x7ea9297f3936b840360d8057e1435cbd654a4ba3',
    '0x85e43a977f90997c0ca58445fefe63959a6b45c8',
    '0x7826d886620721a00af3b1b31f0cd0c46e45b8f9',
    '0x6a4db05d5f22650dea5acde109641ca2754d2784',
    '0x1208c535030b80dd9049cd04a8f8911d4bf5ae3d',
    '0x04a269f14fd7c40db9a2d7233d9b80437a4aeb6f',
    '0xf13901ce59d9cc22eb7b05c364cfbbdf4f502134',
    '0x825462600bff18f8b92463d71ea59d10690156d1',
    '0x4b9e4744b4f346178b87d4b8cc136108741a6edf'
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
