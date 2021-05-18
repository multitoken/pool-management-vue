import mainnet from '@/config/mainnet';
import kovan from '@/config/kovan';
import bsc from '@/config/bsc';
import { Config } from '@/config/types';

interface СonfigState {
  config: Config;
}

const configs = { mainnet, kovan, bsc };
// const config: Config = configs[process.env.VUE_APP_NETWORK || ''];
const defaultConfig = process.env.VUE_APP_NETWORK || 'bsc';

const state = {
  config: configs[defaultConfig]
};

const getters = {
  getConfig: state => () => {
    return state.config;
  }
};

const mutations = {
  setNetwork(_state: СonfigState, chainId: number): void {
    if (!configs[chainId]) {
      configs[chainId] = {
        ...configs[defaultConfig],
        unknown: true,
        shortName: ''
      };
    }
    _state.config = configs[chainId];
  }
};

export default {
  state,
  getters,
  mutations
};
