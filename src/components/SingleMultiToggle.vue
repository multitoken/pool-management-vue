<template>
  <div class="d-flex flex-justify-center mt-4">
    <div
      class="d-flex flex-justify-center py-2 text-white rounded-left-1 option"
      :class="{ selected: selected === multiAsset }"
      @click="onSelect(multiAsset)"
    >
      {{ $t('allPoolAssets') }}
    </div>
    <div
      class="d-flex flex-justify-center py-2 text-white rounded-right-1 option"
      :class="{ selected: selected === singleAsset }"
      @click="onSelect(singleAsset)"
    >
      {{ $t('singleAsset') }}
    </div>
    <div
      v-if="buyAvailable"
      class="d-flex flex-justify-center py-2 text-white rounded-right-1 option"
      :class="{ selected: selected === buyForEth }"
      @click="onSelect(buyForEth)"
    >
      {{ $('buyForEth') }}
    </div>
  </div>
</template>

<script lang="ts">
export enum LiquidityType {
  MULTI_ASSET,
  SINGLE_ASSET,
  BUY_FOR_ETH
}

export default {
  props: ['selected', 'onSelect', 'buyAvailable'],
  computed: {
    multiAsset() {
      return LiquidityType.MULTI_ASSET;
    },
    singleAsset() {
      return LiquidityType.SINGLE_ASSET;
    },
    buyForEth() {
      return LiquidityType.BUY_FOR_ETH;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../vars';

.option {
  width: 140px;
  border: 1px solid $panel-border;
  cursor: pointer;
}
</style>
