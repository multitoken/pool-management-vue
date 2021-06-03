import { Config, ConfigToken } from '@/config/types';
import tokensETH from '@multitoken/assets/data/tokens-eth.js';

const tokens: { [key: string]: ConfigToken } = {};
for (const token of tokensETH) {
  tokens[token.addresses.main] = {
    address: token.addresses.main,
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
  network: 'homestead',
  chainId: 1,
  isTestNet: false,
  defaultPrecision: 2,
  gas: {
    bufferError: 0.01,
    bufferWarning: 0.2
  },
  baseToken: {
    address: 'ether',
    name: 'Ethereum',
    symbol: 'ETH',
    wrappedSymbol: 'WETH'
  },
  rpcUrl: 'https://mainnet.infura.io/v3/8dd19a9306014b30bb8e994bbf21211c',
  wsUrl: 'wss://mainnet.infura.io/ws/v3/8dd19a9306014b30bb8e994bbf21211c',
  subgraphUrl:
    'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-beta',
  explorer: 'https://etherscan.io',
  exchangeUrl: 'https://swap.multitoken.com/',
  addresses: {
    bFactory: '0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd',
    bActions: '0x2FCc6f96418764439f8Dc26aF559Ed5CdDAeefaC',
    dsProxyRegistry: '0x4678f0a6958e4D2Bc4F1BAF7Bc52E8F3564f3fE4',
    proxy: '0x2633Dc6F65f293FdC47206beEf1FC9BD6C63edFF',
    crpFactory: '0xed52D8E202401645eDAD1c0AA21e872498ce47D0',
    wrapped: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    multicall: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441'
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
          '1': 'https://cloudflare-eth.com'
        }
      }
    },
    portis: {
      id: 'portis',
      name: 'Portis',
      options: {
        network: 'mainnet',
        dappId: '3f1c3cfc-7dd5-4e8a-aa03-71ff7396d9fe'
      }
    },
    walletlink: {
      id: 'walletlink',
      name: 'Coinbase',
      options: {
        appName: 'Multitoken - ETF marketplace',
        darkMode: true,
        chainId: 1,
        ethJsonrpcUrl: 'https://cloudflare-eth.com'
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
  excludedPoolsIds: [],
  env: process.env.VUE_APP_ENV || 'production',
  tokens: tokens,
  untrusted: [],
  urls: {
    mainnet: process.env.VUE_APP_MAINNET_URL || '/',
    kovan: process.env.VUE_APP_KOVAN_URL || '/',
    bsc: process.env.VUE_APP_BSC_URL || '/'
  }
};

export default config;
