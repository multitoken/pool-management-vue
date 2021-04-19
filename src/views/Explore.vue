<template>
  <Page>
    <Container>
      <Filters :value="filters" v-model="filters" />
    </Container>
    <ListPools :query="query" :key="JSON.stringify(query)" />
  </Page>
</template>

<script>
import pools from '@balancer-labs/assets/data/pools.json';
import {
  amplAddress,
  clone,
  formatFilters,
  validAmplPools
} from '@/helpers/utils';

const excludedPoolsIds = [
  "0xac0a60fb1db03bb5b944dd7473530ec178f1bcd9",
  "0x9c31015dd1cc037b4b6169562024a36a71079893",
  "0xcbbb1dc635cc5789b95f27deb2a039362ce2f559",
  "0x1b6cb8caf4c4738c72c3966e8153284438ebd909",
  "0x5ff117aa7ba02b729d942631c8d88fcc2bcf7878",
  "0x37dcf3fdace7ab55d15fd05c0112c6f1596d70ab",
  "0xfa572726e89aa82847280244e06873debed5acf4",
  "0xef008f0f3e57713f665a23b9b8ee76f44ca69db2",
  "0xd68715b616fc2b4f03252c7b9e54d7dc83b969dc",
  "0xc29186483b3d7be1f7af3a7e7772f0e41440ea7d",
  "0x7c71f9476b7c9c6b1e846e529cf59789be8a0bf6",
  "0x5915622abcfe4ae753d5ad7a0dab03856348e06c",
  "0x4b05043222389f789b088c064156f5e8c5669e29",
  "0xeafb30bb014bcabf7de59307a883d196ca2c3ec3",
  "0xde3b773f50ebd7868c8957f6e968f9c970f90c9b",
  "0x9558711c0278a054241fc04a2d71b8e6ded28004",
  "0x7ea9297f3936b840360d8057e1435cbd654a4ba3"
]

export default {
  data() {
    return {
      filters: formatFilters(this.$route.query)
    };
  },
  watch: {
    filters() {
      const query = formatFilters(this.filters);
      if (query.token && query.token.length === 0) delete query.token;
      if (query.type && (query.type.length === 0 || query.type === 'shared'))
        delete query.type;
      this.$router.push({ name: 'explore', query: clone(query) });
    }
  },
  computed: {
    query() {
      let query = clone(this.querySharedPools);
      const filters = formatFilters(this.filters);
      if (filters.type === 'smart') query = this.querySmartPools;
      if (filters.type === 'private') query = this.queryPrivatePools;
      if (filters.token && filters.token.length > 0) {
        if (filters.token.includes(amplAddress) && filters.type === 'shared') {
          query.where.id_in = validAmplPools;
        } else {
          query.where.tokensList_contains = filters.token;
        }
      }
      return query;
    },
    querySharedPools() {
      return {
        where: {
          id_not_in: excludedPoolsIds,
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
            id_not_in: excludedPoolsIds,
          }
        };
      return {
        where: {
          crp: true
        }
      };
    },
    queryPrivatePools() {
      return {
        where: {
          finalized: false,
          crp: false,
          id_not_in: excludedPoolsIds,
        }
      };
    }
  }
};
</script>
