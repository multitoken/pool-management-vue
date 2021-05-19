import mainnet from '@/config/mainnet';
import kovan from '@/config/kovan';
import bsc from '@/config/bsc';
import { Config } from '@/config/types';
import Vue from 'vue';

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
    console.log('chainId', chainId);
    let newConfig = Object.values(configs).find(
      (c: Config) => c.chainId == chainId
    );
    console.log('newConfig', newConfig);

    if (!newConfig) {
      newConfig = configs[defaultConfig];
    }
    // _state.config = configs[chainId];
    Vue.set(_state, 'config', newConfig);
  }
};

const actions = {
  updateConfig({ commit }, chainId: number) {
    commit('setNetwork', chainId);
    return;
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
