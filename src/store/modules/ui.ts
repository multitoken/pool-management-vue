import Vue from 'vue';
import store from '@/store';
import { formatUnits } from '@ethersproject/units';

const state = {
  init: false,
  loading: false,
  authLoading: false,
  address: '',
  balances: {},
  pools: [],
  proxy: '',
  sidebarIsOpen: false,
  modalOpen: false
};

const mutations = {
  SET(_state, payload) {
    Object.keys(payload).forEach(key => {
      Vue.set(_state, key, payload[key]);
    });
  }
};

const actions = {
  init: async ({ commit, dispatch }) => {
    commit('SET', { loading: true });
    await new Promise(r => setTimeout(r, 500));
    await store.dispatch(
      'updateConfig',
      parseInt(formatUnits(window.ethereum!.chainId, 0))
    );
    const tokenIds = Object.keys(store.getters.getConfig().tokens)
      .map(tokenAddress => store.getters.getConfig().tokens[tokenAddress].id)
      .filter(tokenId => !!tokenId);
    await Promise.all([
      dispatch('loadPricesById', tokenIds),
      dispatch('initTokenMetadata'),
      dispatch('getBlockNumber')
    ]);
    const connector = await Vue.prototype.$auth.getConnector();
    if (connector) dispatch('login', connector);
    commit('SET', { loading: false, init: true });
  },
  loading: ({ commit }, payload) => {
    commit('SET', { loading: payload });
  },
  toggleSidebar: ({ commit }) => {
    commit('SET', { sidebarIsOpen: !state.sidebarIsOpen });
  },
  hideSidebar: ({ commit }) => {
    commit('SET', { sidebarIsOpen: false });
  },
  toggleModal: ({ commit }) => {
    commit('SET', { modalOpen: !state.modalOpen });
  }
};

export default {
  state,
  mutations,
  actions
};
