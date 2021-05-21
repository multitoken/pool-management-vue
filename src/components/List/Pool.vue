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
    <div class="column flex-shrink-0">
      <a
        v-if="isBSCNetwork"
        :href="
          `https://exchange.pancakeswap.finance/#/swap?outputCurrency=${LPTokenAddress}`
        "
        target="_blank"
        v-on:click.stop
        @mouseenter="pancakeButtonHovered = true"
        @mouseleave="pancakeButtonHovered = false"
      >
        <UiButton class="button-primary">
          {{ $t('buy') }}
        </UiButton>
      </a>
      <a
        v-else
        :href="`${config.exchangeUrl}/${BNBAddress}/${LPTokenAddress}`"
        target="_blank"
        v-on:click.stop
      >
        <UiButton class="button-primary">
          {{ $t('buy') }}
        </UiButton>
      </a>
    </div>
  </UiTableTr>
</template>

<script>
import { getPoolLiquidity } from '@/helpers/price';
import chainParams from '@/helpers/chainParams.json';

export default {
  props: ['pool'],
  computed: {
    poolLiquidity() {
      return getPoolLiquidity(this.pool, this.price.values);
    },
    isBSCNetwork() {
      return (
        `0x${this.web3.injectedChainId?.toString(16)}` ==
        chainParams['bsc'].chainId
      );
    },
    BNBAddress() {
      // TODO: add real BNB address
      return '0x266A9AAc60B0211D7269dd8b0e792D645d2923e6';
    },
    LPTokenAddress() {
      // TODO: add real LP token address
      return '0xdCC967319024DeeBbf9B5B6868F4985cFB724687';
    }
  }
};
</script>

<style scoped>
.poolToken {
  flex-basis: 100px;
}

</style>
