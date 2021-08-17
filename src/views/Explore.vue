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
          finalized: true
        }
      };
    },
    querySmartPools() {
      if (this.config.chainId === 1)
        return {
          where: {
            id_in: Object.entries(pools)
              .filter(crp => crp[1].is_compatible)
              .map(crp => crp[0].toLowerCase()),
          }
        };
      return {
        where: {
          crp: true,
        }
      };
    },
    queryPrivatePools() {
      return {
        where: {
          finalized: false,
          crp: false,
        }
      };
    }
  }
};
</script>
