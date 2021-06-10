import mainnet from '@/config/mainnet';
import kovan from '@/config/kovan';
import bsc from '@/config/bsc';
import { Config } from '@/config/types';
import Vue from 'vue';
import store from '@/store';
import chainParams from '@/helpers/chainParams.json';

interface СonfigState {
  config: Config;
}

const configs = { mainnet, kovan, bsc };
const injectedChainId = Object.values(chainParams)
  .find(c => c.chainId === window.ethereum?.chainId)
  ?.chainName.toLowerCase();
const defaultConfig = injectedChainId || process.env.VUE_APP_NETWORK || 'bsc';

const state = {
  config: configs[defaultConfig]
};

const getters = {
  getConfig: state => () => {
    return state.config;
  }
};

const mutations = {
  async setNetwork(_state: СonfigState, chainId: number): Promise<void> {
    let newConfig = Object.values(configs).find(
      (c: Config) => c.chainId == chainId
    );

    if (!newConfig) {
      newConfig = configs[defaultConfig];
    }
    await Vue.set(_state, 'config', newConfig);
  }
};

const actions = {
  async updateConfig({ commit }, chainId: number): Promise<void> {
    await commit('setNetwork', chainId);
    await store.dispatch('clearPools');
    store.dispatch('getPools', {});
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
