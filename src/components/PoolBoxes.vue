<template>
  <div class="d-flex pool-boxes overflow-hidden ml-n2 mr-n2 text-center">
    <div class="col-12 col-md-3 float-left my-2">
      <div
        class="border rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h3 v-text="_num(poolLiquidity, 'usd')" />
        <p v-text="$t('liquidity')" class="mb-0" />
      </div>
    </div>
    <div class="col-12 col-md-3 float-left my-2">
      <div
        class="border rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h3 v-text="_num(myLiquidity, 'usd')" />
        <p v-text="$t('myEtfShare')" class="mb-0" />
      </div>
    </div>
  </div>
</template>

<script>
import { getAddress } from '@ethersproject/address';
import { getPoolLiquidity } from '@/helpers/price';
import { normalizeBalance } from '@/helpers/utils';

export default {
  props: ['pool', 'bPool'],
  computed: {
    poolTokenBalance() {
      const bptAddress = this.bPool.getBptAddress();
      const balance = this.web3.balances[getAddress(bptAddress)];
      return normalizeBalance(balance || '0', 18);
    },
    totalShares() {
      return parseFloat(this.bPool.metadata.totalShares);
    },
    poolLiquidity() {
      return getPoolLiquidity(this.pool, this.price.values);
    },
    myLiquidity() {
      const poolShares = this.subgraph.poolShares[this.pool.id];
      if (!poolShares) return 0;
      return (this.poolLiquidity / this.pool.totalShares) * poolShares;
    }
  }
};
</script>

<style scoped>
.pool-boxes {
  justify-content: space-around;
}

</style>
