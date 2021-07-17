<template>
  <Page :requireLogin="true">
    <ListPools />
  </Page>
</template>

<script>
import pools from '@balancer-labs/assets/data/pools.json';

export default {
  computed: {
    querySharedPools() {
      return {
        where: {
          id_not_in: this.$store.getters.getConfig().excludedPoolsIds,
          finalized: true
        }
      };
    },
    querySmartPools() {
      if (this.$store.getters.getConfig().chainId === 1)
        return {
          where: {
            id_in: Object.entries(pools)
              .filter(crp => crp[1].is_compatible)
              .map(crp => crp[0].toLowerCase()),
            id_not_in: this.$store.getters.getConfig().excludedPoolsIds
          }
        };
      return {
        where: {
          crp: true,
          id_not_in: this.$store.getters.getConfig().excludedPoolsIds
        }
      };
    },
    queryPrivatePools() {
      return {
        where: {
          finalized: false,
          crp: false,
          id_not_in: this.$store.getters.getConfig().excludedPoolsIds
        }
      };
    }
  }
};
</script>
