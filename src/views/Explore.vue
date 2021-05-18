<template>
  <Page>
    <ListPools />
  </Page>
</template>

<script>
import pools from '@balancer-labs/assets/data/pools.json';
import config from '@/config';

export default {
  computed: {
    querySharedPools() {
      return {
        where: {
          id_not_in: config.excludedPoolsIds,
          finalized: true
        }
      };
    },
    querySmartPools() {
      if (this.store.state.web3.config.chainId === 1)
        return {
          where: {
            id_in: Object.entries(pools)
              .filter(crp => crp[1].is_compatible)
              .map(crp => crp[0].toLowerCase()),
            id_not_in: config.excludedPoolsIds
          }
        };
      return {
        where: {
          crp: true,
          id_not_in: config.excludedPoolsIds
        }
      };
    },
    queryPrivatePools() {
      return {
        where: {
          finalized: false,
          crp: false,
          id_not_in: config.excludedPoolsIds
        }
      };
    }
  }
};
</script>
