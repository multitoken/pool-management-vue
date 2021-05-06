import merge from 'lodash/merge';
import registry from '@balancer-labs/assets/generated/pm/registry.homestead.json';
import tokensBSC from '@multitoken/assets/data/tokens-bsc.js';
import tokensETH from '@multitoken/assets/data/tokens-eth.js';
import mainnet from '@/config/homestead.json';
import kovan from '@/config/kovan.json';
import bsc from '@/config/bsc.json';
import rinkeby from '@/config/rinkeby.json';
import chainParams from '../helpers/chainParams.json';

// Add tokens
const registryKovan = {
  tokens: {},
  untrusted: []
};
for (const token of tokensETH) {
  registryKovan['tokens'][token.addresses.kovan] = {
    address: token.addresses.kovan,
    id: token.coingeckoID,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    precision: 3,
    hasIcon: false,
    logoUrl: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.addresses.main}/logo.png`
  };
}

const registryBSC = {
  tokens: {},
  untrusted: []
};
for (const token of tokensBSC) {
  registryBSC['tokens'][token.addresses.bsc] = {
    address: token.addresses.bsc,
    id: token.coingeckoID,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    precision: 3,
    hasIcon: false,
    logoUrl: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${token.addresses.bsc}/logo.png`
  };
}

const registryRinkeby = {
  tokens: {
    '0xc778417E063141139Fce010982780140Aa0cD5Ab': {
      address: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
      id: 'weth',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      precision: 4,
      color: '#828384',
      hasIcon: false,
      logoUrl:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
    }
  },
  untrusted: []
};

const configs = { mainnet, kovan, bsc, rinkeby };
configs.mainnet = merge(registry, configs.mainnet);
configs.kovan = merge(registryKovan, configs.kovan);
configs.bsc = merge(registryBSC, configs.bsc);
configs.rinkeby = merge(registryRinkeby, configs.rinkeby);
const walletChainId = Object.entries(chainParams).find(
  p => p[1].chainId === window.ethereum?.chainId
);
walletChainId && console.log('walletChainId[0]:', walletChainId[0]);
const network =
  (walletChainId && walletChainId[0]) || process.env.VUE_APP_NETWORK || 'kovan';
const config = configs[network];
config.env = process.env.VUE_APP_ENV || 'staging';

export default config;
