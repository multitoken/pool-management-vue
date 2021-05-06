<template>
  <div>
    <UiLoading v-if="!pool.id" class="big py-4" />
    <UiTable style="border-top-left-radius: 0 !important;" v-else>
      <UiTableTh>
        <div v-text="$t('token')" class="flex-auto text-left" />
        <div v-text="$t('weight')" class="column" />
        <div v-text="$t('etfBalance')" class="column hide-sm" />
      </UiTableTh>
      <ListTokens :pool="pool" :bPool="bPool" />
    </UiTable>
  </div>
</template>

<script>
export default {
  props: ['pool', 'bPool']
};
</script>
