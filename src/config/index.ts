import merge from 'lodash/merge';
import registry from '@balancer-labs/assets/generated/pm/registry.homestead.json';
import homestead from '@/config/homestead.json';
import kovan from '@/config/kovan.json';
import rinkeby from '@/config/rinkeby.json';

// Add tokens
const registryKovan = {
  tokens: {},
  untrusted: []
};

// for (const token of tokens) {
//   registryKovan['tokens'][token.addresses.kovan] = {
//     address: token.addresses.kovan,
//     id: token.coingeckoID,
//     name: token.name,
//     symbol: token.symbol,
//     decimals: token.decimals,
//     precision: 3,
//     hasIcon: false,
//     logoUrl: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.addresses.main}/logo.png`
//   };
// }

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

const configs = { homestead, kovan, rinkeby };
configs.homestead = merge(registry, configs.homestead);
configs.kovan = merge(registryKovan, configs.kovan);
configs.rinkeby = merge(registryRinkeby, configs.rinkeby);
const network = process.env.VUE_APP_NETWORK || 'kovan';
const config = configs[network];
config.env = process.env.VUE_APP_ENV || 'staging';

export default config;
