import merge from 'lodash/merge';
import registry from '@balancer-labs/assets/generated/pm/registry.homestead.json';
import tokensBSC from '@multitoken/assets/data/tokens-bsc.js';
import tokensETH from '@multitoken/assets/data/tokens-eth.js';
import mainnet from '@/config/homestead.json';
import kovan from '@/config/kovan.json';
import bsc from '@/config/bsc.json';
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

const configs = { mainnet, kovan, bsc };
configs.mainnet = merge(registry, configs.mainnet);
configs.kovan = merge(registryKovan, configs.kovan);
configs.bsc = merge(registryBSC, configs.bsc);
const walletChainId = Object.entries(chainParams).find(
  p => p[1].chainId === window.ethereum?.chainId
);
const network =
  (walletChainId && walletChainId[0]) || process.env.VUE_APP_NETWORK || 'kovan';
const config = configs[network];
config.env = process.env.VUE_APP_ENV || 'staging';

export default config;
