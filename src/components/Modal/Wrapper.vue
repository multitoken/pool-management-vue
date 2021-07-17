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
          <a @click="handleMax()" class="mx-3">
            <UiLabel v-text="$t('max')" />
          </a>
          {{ symbols.tokenIn }}
        </UiButton>
        <div class="mb-2">
          {{ $t('receive') }}
          <a
            @click="toggleSide()"
            v-text="'↕'"
            class="float-right mr-4 px-2 mt-n2"
          />
        </div>
        <UiButton
          type="button"
          class="d-flex flex-items-center mb-2 width-full"
        >
          <input
            v-model="amount"
            :class="isValid ? 'text-white' : 'text-red'"
            type="number"
            step="any"
            class="flex-auto px-0"
            placeholder="0.0"
          />
          {{ symbols.tokenOut }}
        </UiButton>
        <div
          v-text="$t('ethBuffer')"
          class="text-yellow text-center mt-3"
          v-if="!etherLeft"
        />
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
import { normalizeBalance } from '@/helpers/utils';
import { mapActions } from 'vuex';

export default {
  props: ['open', 'side'],
  data() {
    return {
      currentSide: 1,
      amount: '',
      loading: false
    };
  },
  watch: {
    open() {
      if (this.side) this.currentSide = this.side;
      this.loading = false;
      this.amount = '';
    }
  },
  computed: {
    title() {
      const baseToken = this.$store.getters.getConfig().baseToken;
      return this.currentSide === 2
        ? `Wrap ${baseToken.wrappedSymbol} to ${baseToken.symbol}`
        : `Wrap ${baseToken.symbol} to ${baseToken.wrappedSymbol}`;
    },
    symbols() {
      const config = this.$store.getters.getConfig();
      return {
        tokenIn:
          this.currentSide === 2
            ? config.baseToken.wrappedSymbol
            : config.baseToken.symbol,
        tokenOut:
          this.currentSide === 2
            ? config.baseToken.symbol
            : config.baseToken.wrappedSymbol
      };
    },
    balance() {
      let balance = this.web3.balances['ether'] || '0';
      if (this.currentSide === 2)
        balance =
          this.web3.balances[
            this.$store.getters.getConfig().addresses.wrapped
          ] || '0';
      return normalizeBalance(balance, 18);
    },
    isValid() {
      const error = validateNumberInput(this.amount);
      if (error !== ValidationError.NONE) return false;
      return this.currentSide === 1
        ? !this.balance
            .minus(this.$store.getters.getConfig().gas.bufferError)
            .lt(this.amount)
        : !this.balance.lt(this.amount);
    },
    etherLeft() {
      return (
        this.currentSide === 2 ||
        this.balance.isZero() ||
        !this.balance
          .minus(this.$store.getters.getConfig().gas.bufferWarning)
          .lt(this.amount)
      );
    }
  },
  methods: {
    ...mapActions(['wrap', 'unwrap']),
    async handleSubmit() {
      this.loading = true;
      if (this.currentSide === 1) await this.wrap(this.amount);
      if (this.currentSide === 2) await this.unwrap(this.amount);
      this.loading = false;
      this.$emit('close');
    },
    handleMax() {
      const maxAllowedAmount =
        this.currentSide === 1
          ? this.balance.minus(
              this.$store.getters.getConfig().gas.bufferWarning
            )
          : this.balance;
      this.amount = maxAllowedAmount.isNegative()
        ? '0'
        : maxAllowedAmount.toString();
    },
    toggleSide() {
      this.currentSide = this.currentSide === 1 ? 2 : 1;
      this.amount = '';
      this.loading = false;
    }
  }
};
</script>
