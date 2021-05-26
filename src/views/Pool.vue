<template>
  <Page :loading="loading">
    <MessageSimilarPools
      v-if="pool.liquidity < 1e7 && pool.finalized"
      :pool="pool"
      class="mb-4"
    />
    <div class="d-block text-center text-md-left d-md-flex mb-3 mb-md-0">
      <PoolHeader :pool="bPool" class="flex-auto pb-3" />
      <div class="pb-3">
        <UiButton
          v-if="enableAddLiquidity && pool.tokens.length > 0"
          class="button-primary ml-2"
          @click="openAddLiquidityModal"
        >
          {{ $t('issue') }}
        </UiButton>
        <UiButton
          v-if="enableAddLiquidity && pool.tokens.length > 0"
          class="ml-2"
          @click="openRemoveLiquidityModal"
        >
          {{ $t('redeem') }}
        </UiButton>
        <UiButton
          v-if="enableAddLiquidity && pool.tokens.length > 0"
          class="ml-2"
          @click="addToWallet(bPool.getBptAddress(), pool.symbol)"
        >
          {{ 'Add to wallet' }}
        </UiButton>
        <a
          v-if="bPool && enableAddLiquidity && pool.tokens.length > 0"
          :href="exchangeLink"
          target="_blank"
          v-on:click.stop
          @mouseenter="pancakeButtonHovered = true"
          @mouseleave="pancakeButtonHovered = false"
        >
          <UiButton class="ml-2">
            {{ isBSCNetwork ? $t('buyOnPancake') : $t('buyOnMultitoken') }}
            <Icon name="external-link" />
          </UiButton>
        </a>
      </div>
    </div>
    <Tabs :pool="pool" />
    <router-view
      :key="$route.path"
      :pool="pool"
      :bPool="bPool"
      @reload="loadPool"
    />
    <br />
    <PoolBoxes :pool="pool" :bPool="bPool" />
    <portal to="modal">
      <ModalAddLiquidity
        :pool="pool"
        :bPool="bPool"
        :open="modalAddLiquidityOpen"
        @close="modalAddLiquidityOpen = false"
        @reload="loadPool"
      />
      <ModalRemoveLiquidity
        :pool="pool"
        :bPool="bPool"
        :open="modalRemoveLiquidityOpen"
        @close="modalRemoveLiquidityOpen = false"
        @reload="loadPool"
      />
      <ModalCustomToken
        :open="modalCustomTokenOpen"
        @close="modalCustomTokenOpen = false"
      />
    </portal>
  </Page>
</template>

<script>
import Vue from 'vue';
import { mapActions } from 'vuex';
import { getAddress } from '@ethersproject/address';
import Pool from '@/_balancer/pool';
import { bnum, scale } from '@/helpers/utils';
import { addToWallet, getExchangeLink, isBSCNetwork } from '@/helpers/buyETF';

export default {
  data() {
    return {
      bPool: undefined,
      id: this.$route.params.id,
      pool: {},
      loading: false,
      modalAddLiquidityOpen: false,
      modalRemoveLiquidityOpen: false,
      modalCustomTokenOpen: false,
      isBSCNetwork: isBSCNetwork(),
      addToWallet: addToWallet
    };
  },
  watch: {
    $route() {
      const id = this.$route.params.id;
      if (id !== this.id) {
        this.id = id;
        this.loadPool();
      }
    },
    'web3.account': async function(val, prev) {
      if (val && val.toLowerCase() !== prev) await this.loadPool();
    }
  },
  computed: {
    hasCustomToken() {
      if (!this.pool || !this.pool.tokens) return false;
      for (const token of this.pool.tokens) {
        const tokenMetadata = this.web3.tokenMetadata[token.checksum];
        if (!tokenMetadata || !tokenMetadata.whitelisted) return true;
      }
      return false;
    },
    enableAddLiquidity() {
      if (!this.bPool) return false;
      return this.pool.finalized || this.bPool.isCrp();
    },
    enableRemoveLiquidity() {
      return (
        this.config.chainId === this.web3.injectedChainId &&
        this.web3.account &&
        (Object.keys(this.subgraph.poolShares).includes(this.id) ||
          this.web3.balances[getAddress(this.id)])
      );
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
  methods: {
    ...mapActions([
      'getBalances',
      'getAllowances',
      'getPoolBalances',
      'loadTokenMetadata',
      'loadPricesByAddress'
    ]),
    openAddLiquidityModal() {
      this.modalAddLiquidityOpen = true;
    },
    openRemoveLiquidityModal() {
      this.modalRemoveLiquidityOpen = true;
    },
    /* async addToWallet() {
      // TODO: Set decimals dynamically
      this.$auth.web3.send('wallet_watchAsset', {
        type: 'ERC20',
        options: {
          address: this.bPool.getBptAddress(), // The address of the token contract
          symbol: this.pool.symbol, // A ticker symbol or shorthand, up to 5 characters
          decimals: 18 // The number of token decimals
        }
      });
    }, */
    async loadPool() {
      const bPool = new Pool(this.id);
      try {
        this.pool = await bPool.getMetadata();
        this.bPool = bPool;
      } catch (e) {
        return this.$router.push({ name: 'home' });
      }
      const unknownTokens = this.pool.tokensList.filter(
        tokenAddress => !this.web3.tokenMetadata[tokenAddress]
      );
      if (unknownTokens.length > 0) {
        await this.loadTokenMetadata(unknownTokens);
        await this.loadPricesByAddress(unknownTokens);
      }
      if (this.web3.account) {
        const data = await Promise.all([
          this.getBalances([
            ...this.pool.tokensList,
            getAddress(this.bPool.getBptAddress())
          ]),
          this.getAllowances(this.pool.tokensList),
          this.getPoolBalances({
            poolAddress: this.id,
            tokens: this.pool.tokensList
          })
        ]);
        this.fixPoolBalances(data[2]);
      }
    },
    fixPoolBalances(poolBalances) {
      for (const address in poolBalances) {
        const tokenIndex = this.pool.tokens.findIndex(
          token => token.checksum === address
        );
        const tokenDecimals = this.pool.tokens[tokenIndex].decimals;
        const poolBalance = scale(bnum(poolBalances[address]), -tokenDecimals);
        Vue.set(
          this.pool.tokens[tokenIndex],
          'balance',
          poolBalance.toString()
        );
      }
    }
  },
  async created() {
    this.loading = true;
    await this.loadPool();
    this.loading = false;
    setTimeout(() => {
      if (this.hasCustomToken && !this.bPool.isWhitelisted())
        this.modalCustomTokenOpen = true;
    }, 1e2);
  }
};
</script>
