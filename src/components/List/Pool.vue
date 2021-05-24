<template>
  <UiTableTr :to="{ name: 'pool', params: { id: pool.id } }">
    <div class="column text-center hide-sm hide-md hide-lg flex-shrink-0">
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
    <div class="column flex-shrink-0">
      <a
        :href="exchangeLink"
        target="_blank"
        v-on:click.stop
        @mouseenter="pancakeButtonHovered = true"
        @mouseleave="pancakeButtonHovered = false"
      >
        <UiButton
          :disabled="!bPool"
          :loading="buttonLoading"
          class="button-primary"
        >
          {{ $t('buy') }}
        </UiButton>
      </a>
    </div>
  </UiTableTr>
</template>

<script>
import { getPoolLiquidity } from '@/helpers/price';
import chainParams from '@/helpers/chainParams.json';
import Pool from '@/_balancer/pool';
import { getExchangeLink } from '@/helpers/buyETF';

export default {
  data() {
    return {
      bPool: undefined,
      buttonLoading: true
    };
  },
  props: ['pool'],
  computed: {
    poolLiquidity() {
      return getPoolLiquidity(this.pool, this.price.values);
    },
    myLiquidity() {
      const poolShares = this.subgraph.poolShares[this.pool.id];
      if (!poolShares) return 0;
      return (this.poolLiquidity / this.pool.totalShares) * poolShares;
    },
    wethAddress() {
      return '0xd0a1e359811322d97991e03f863a0c30c2cf029c';
    },
    LPTokenAddress() {
      return this.bPool?.getBptAddress();
    },
    exchangeLink() {
      return getExchangeLink(this.LPTokenAddress, this.wethAddress);
    }
  },
  async mounted() {
    try {
      const bPool = new Pool(this.pool.id);
      await bPool.getMetadata();
      this.bPool = bPool;
      this.buttonLoading = false;
    } catch {
      this.buttonLoading = false;
    }
  }
};
</script>

<style scoped>
.poolToken {
  flex-basis: 100px;
}

</style>
