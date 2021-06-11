<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 v-text="title" class="text-white" />
      </template>
      <div class="m-4 p-4 border rounded-2">
        <div class="mb-2">
          {{ $t('send') }}
        </div>
        <UiButton
          type="button"
          class="d-flex flex-items-center mb-3 width-full"
        >
          <input
            v-autofocus
            v-model="amount"
            :class="isValid ? 'text-white' : 'text-red'"
            :max="balance"
            type="number"
            step="any"
            class="flex-auto px-0"
          />
          <a @click="handleMax()" class="mx-1 mb-1">
            <UiLabel v-text="$t('max')" />
          </a>
          <select v-model="selectedToken" class="select">
            <option
              v-for="token in selectOptions"
              :key="token.address"
              v-text="token.symbol"
              :id="token.address"
              :value="token"
            />
          </select>
        </UiButton>
        <div class="mb-2">
          {{ $t('receive') }}
        </div>
        <UiButton
          type="button"
          class="d-flex flex-items-center mb-2 width-full"
        >
          <input
            :value="amountOut"
            type="number"
            step="any"
            class="flex-auto px-0 text-white"
            placeholder="0.0"
            disabled
          />
          {{ pool.symbol }}
        </UiButton>
        <div
          v-text="$t('bnbBuffer')"
          class="text-yellow text-center mt-3"
          v-if="!etherLeft"
        />
      </div>
      <div v-if="route.length > 0" class="mx-4 mb-4 p-2 border rounded-2">
        <h5
          v-text="$t('route')"
          class="d-flex flex-justify-center text-white mb-2 route-header"
        />
        <UiLoading v-if="routeLoading" class="big" />
        <div v-else class="d-flex flex-wrap flex-justify-around width-full">
          <div v-for="token in route" :key="token.index">
            <div class="d-flex flex-justify-around">
              <Icon v-if="token.index !== 0" name="go" size="20" class="mx-2" />
              <div v-text="token.symbol || token.name" />
            </div>
          </div>
        </div>
      </div>
      <template slot="footer">
        <div class="col-6 float-left pr-2">
          <UiButton @click="$emit('close')" type="button" class="width-full">
            {{ $t('cancel') }}
          </UiButton>
        </div>
        <div class="col-6 float-left pl-2">
          <UiButton
            :requireLogin="true"
            :disabled="loading || !amount || !isValid"
            :loading="loading"
            type="submit"
            class="button-primary width-full"
          >
            {{ $t('confirm') }}
          </UiButton>
        </div>
      </template>
    </UiModalForm>
  </UiModal>
</template>

<script>
import { validateNumberInput, ValidationError } from '@/helpers/validation';
import { denormalizeBalance, normalizeBalance } from '@/helpers/utils';
import { mapActions } from 'vuex';

export default {
  props: ['open', 'pool', 'bPool'],
  data() {
    return {
      amount: '',
      route: [],
      estGas: '',
      amountOut: '',
      selectedToken: {},
      selectOptions: [],
      loading: false,
      routeLoading: false
    };
  },
  watch: {
    open() {
      this.loading = false;
      this.route = [];
      this.amount = '';
    },
    amount(newAmount) {
      if (newAmount > 0) {
        this.handleChange();
      }
    },
    selectedToken() {
      this.handleChange();
    }
  },
  computed: {
    title() {
      return `Get ${this.pool.symbol} for ${this.selectedToken.symbol}`;
    },
    balance() {
      const address =
        this.selectedToken.address ===
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? 'ether'
          : this.selectedToken.address;
      const balance = this.web3.balances[address] || '0';
      return normalizeBalance(balance, 18);
    },
    isValid() {
      const error = validateNumberInput(this.amount);
      if (error !== ValidationError.NONE) return false;
      return !this.balance.minus(this.estGas).lt(this.amount);
    },
    etherLeft() {
      return (
        this.balance.isZero() ||
        !this.balance.minus(this.estGas).lt(this.amount)
      );
    }
  },
  async created() {
    this.loading = true;
    const response = await fetch(
      'https://api.1inch.exchange/v3.0/56/tokens'
    ).then(res => res.json());
    const tokens = Object.values(response.tokens);
    this.selectOptions = tokens;
    this.selectedToken = tokens[0];
    this.loading = false;
  },
  methods: {
    ...mapActions(['exchangeLPtoken']),
    async handleSubmit() {
      this.loading = true;
      this.exchangeLPtoken({
        accountAddress: this.web3.account,
        amount: this.amount,
        tokenOut: this.bPool.getBptAddress(),
        title: this.title
      });
      this.loading = false;
      this.$emit('close');
    },
    handleMax() {
      const maxAllowedAmount = this.balance.minus(this.estGas);
      this.amount = maxAllowedAmount.isNegative()
        ? '0'
        : maxAllowedAmount.toString();
    },
    async handleChange() {
      if (
        this.selectedToken?.address &&
        this.bPool?.getBptAddress() &&
        this.amount
      ) {
        this.routeLoading = true;
        const link = `https://api.1inch.exchange/v3.0/56/quote?fromTokenAddress=${
          this.selectedToken.address
        }&toTokenAddress=${this.bPool.getBptAddress()}&amount=${denormalizeBalance(
          this.amount,
          18
        )}`;
        const routing = await fetch(link).then(res => res.json());
        const route = [
          {
            index: 0,
            address: routing.fromToken.address,
            name: routing.fromToken.name,
            symbol: routing.fromToken.symbol
          }
        ];
        routing.protocols.forEach(p =>
          p.forEach(s =>
            route.push({
              index: route.length,
              address: s[0].toTokenAddress,
              name: s[0].name,
              symbol: s[0].symbol
            })
          )
        );
        route.push({
          index: route.length,
          address: routing.toToken.address,
          name: routing.toToken.name,
          symbol: routing.toToken.symbol
        });
        this.route = route;
        this.estGas = normalizeBalance(routing.estimatedGas, 18);
        this.amountOut = normalizeBalance(routing.toTokenAmount, 18);
        this.routeLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.route-header {
  width: 100%;
}

.select {
  padding: 5px 0;

  cursor: pointer;

  color: #fff;
  border-radius: 15px;
  background: transparent;
}
</style>
