import { mapState } from 'vuex';
import store from '@/store';
import { shortenAddress, shorten, trunc, formatNumber } from '@/helpers/utils';

// @ts-ignore
const modules = Object.entries(store.state).map(module => module[0]);

export default {
  computed: {
    ...mapState(modules)
  },
  methods: {
    _num(number, key) {
      return formatNumber(number, key);
    },
    _shortenAddress(str: string): string {
      return shortenAddress(str);
    },
    _shorten(str: string, max?): string {
      return shorten(str, max);
    },
    _trunc(value: number, decimals: number): number {
      return trunc(value, decimals);
    },
    _explorerLink(str: string, type = 'address'): string {
      return `${store.getters.getConfig().explorer}/${type}/${str}`;
    },
    _ticker(address: string): string {
      if (address === 'ether')
        return store.getters.getConfig().baseToken.symbol;
      const token = store.getters.getConfig().tokens[address];
      return token ? token.symbol : this._shortenAddress(address);
    },
    _precision(rawValue: number, address: string): number {
      const tokenConfig = store.getters.getConfig().tokens[address] || {};
      const precision =
        tokenConfig.precision || store.getters.getConfig().defaultPrecision;
      const value = rawValue.toFixed(precision);
      return parseFloat(value);
    }
  }
};
