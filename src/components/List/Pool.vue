<template>
  <UiTableTr :to="{ name: 'pool', params: { id: pool.id } }">
    <div class="column-sm text-left hide-sm hide-md hide-lg flex-shrink-0">
      {{ `${pool.name} (${pool.symbol})` }}
    </div>
    <div class="d-flex flex-justify-center flex-items-center mx-2">
      <Pie :tokens="pool.tokens" size="38" />
    </div>
    <div class="flex-auto text-left">
      <div class="d-flex flex-wrap flex-justify-start">
        <div
          v-for="token in pool.tokens"
          :key="token.address"
          :class="token.symbol.length > 14 && 'tooltipped tooltipped-n'"
          :aria-label="token.symbol"
          class="poolToken d-flex flex-items-center flex-justify-start my-1"
        >
          <Icon name="bullet" size="16" :style="`color: ${token.color}`" />
          {{ _num(token.weightPercent / 100, 'percent-short') }}
          {{ _shorten(token.symbol, 14) }}
        </div>
      </div>
    </div>
    <div v-text="_num(poolLiquidity, 'usd')" class="column flex-shrink-0" />
    <div
      v-text="_num(myLiquidity, 'usd')"
      format="currency"
      class="column hide-sm hide-md hide-lg flex-shrink-0"
    />
    <div
      v-text="_num(pool.lastSwapVolume, 'usd')"
      format="currency"
      class="column hide-sm hide-md hide-lg flex-shrink-0"
    />
  </UiTableTr>
</template>

<script>
import { getPoolLiquidity } from '@/helpers/price';

export default {
  props: ['pool'],
  computed: {
    poolLiquidity() {
      return getPoolLiquidity(this.pool, this.price.values);
    },
    myLiquidity() {
      const poolShares = this.subgraph.poolShares[this.pool.id];
      if (!this.pool.finalized || !poolShares) return 0;
      return (this.poolLiquidity / this.pool.totalShares) * poolShares;
    }
  }
};
</script>

<style scoped>
.poolToken {
  flex-basis: 100px;
}
</style>
