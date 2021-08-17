import Vue from 'vue';
import { getBlackList } from '@/helpers/blacklist';
import config from '@/config';

const state = {
  blackListPoolIds: [],
};

const mutations = {
  SET(_state, payload) {
    Object.keys(payload).forEach(key => {
      Vue.set(_state, key, payload[key]);
    });
  }
};

const actions = {
  loadBlackListPoolIds: async ({ commit }) => {
    if (!config.addresses.blackList) {
      commit('SET', { blackListPoolIds: [] });
      return;
    }

    commit('SET', {
      blackListPoolIds: (await getBlackList(config.addresses.blackList)).map((a) => a.toLowerCase()) });
  }
};

export default {
  state,
  mutations,
  actions
};
