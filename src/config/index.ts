import merge from 'lodash/merge';
import registry from '@balancer-labs/assets/generated/pm/registry.homestead.json';
import tokensBSC from '@multitoken/assets/data/tokens-bsc.js';
import tokensETH from '@multitoken/assets/data/tokens-eth.js';
import mainnet from '@/config/mainnet.json';
import kovan from '@/config/kovan.json';
import bsc from '@/config/bsc.json';

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

const configs = { mainnet, kovan, bsc };
configs.mainnet = merge(registry, configs.mainnet);
configs.kovan = merge(registryKovan, configs.kovan);
configs.bsc = merge(registryBSC, configs.bsc);
const network = process.env.VUE_APP_NETWORK || 'kovan';
const config = configs[network];
config.env = process.env.VUE_APP_ENV || 'staging';
config.urls = {
  mainnet: process.env.VUE_APP_MAINNET_URL,
  kovan: process.env.VUE_APP_KOVAN_URL,
  bsc: process.env.VUE_APP_BSC_URL
};

export default config;
