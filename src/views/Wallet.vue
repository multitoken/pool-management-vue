<template>
  <Page :requireLogin="true">
    <Container class="d-flex mb-3">
      <div class="flex-auto">
        <h3 v-text="$t('myWallet')" />
        <a :href="_etherscanLink(web3.account)" target="_blank">
          <span v-text="_shortenAddress(web3.account)" />
          <Icon name="external-link" size="16" class="ml-1 mr-2" />
        </a>
      </div>
      <div class="text-right">
        <h3 v-text="_num(balancesTotalValue, 'usd-long')" />
        {{ $t('totalValue') }}
      </div>
    </Container>
    <UiTable class="mb-4">
      <UiTableTh>
        <div v-text="$t('asset')" class="flex-auto text-left" />
        <div v-text="$t('holdings')" class="column" />
      </UiTableTh>
      <UiTableTr v-for="(balance, i) in balances" :key="i">
        <Token :address="balance.address" class="mr-3" size="32" />
        <div class="text-left">
          <div v-text="balance.name" />
          <div v-text="balance.symbol" class="text-gray" />
        </div>
        <div class="flex-auto text-left">
          <div v-if="balance.address !== 'ether'" class="flex-auto">
            <UiButton
              v-if="balance.address === config.addresses.weth"
              @click="[(modalWrapperOpen = true), (side = 2)]"
              type="button"
              class="button-primary button-sm ml-2"
            >
              Unwrap to ETH
            </UiButton>
          </div>
          <div v-else class="flex-auto">
            <UiButton
              @click="[(modalWrapperOpen = true), (side = 1)]"
              type="button"
              class="button-primary button-sm ml-2"
            >
              Wrap to WETH
            </UiButton>
          </div>
        </div>
        <div class="column">
          <div>
            {{ _num(balance.balance, 'long') }}
            {{ balance.symbol }}
          </div>
          <div v-text="_num(balance.value, 'usd-long')" class="text-gray" />
        </div>
      </UiTableTr>
    </UiTable>
    <Container class="d-flex mb-3">
      <div v-if="web3.dsProxyAddress" class="flex-auto">
        <h3 v-text="$t('myProxy')" />
        <a :href="_etherscanLink(web3.dsProxyAddress)" target="_blank">
          <span v-text="web3.dsProxyAddress" />
          <Icon name="external-link" size="16" class="ml-1 mr-2" />
        </a>
      </div>
      <h4 v-else v-text="$t('noProxy')" />
    </Container>
    <Container v-if="isNotMainnet" class="d-flex mb-3">
      <div class="flex-auto">
        <h3 v-text="$t('getTestTokens')" />
      </div>
    </Container>
    <UiTable v-if="isNotMainnet" class="token-minter d-flex mb-3 float-left">
      <div
        class="d-flex"
        @click="tokenModalOpen = true"
        style="cursor: pointer"
      >
        <UiTableTh
          class="d-flex flex-auto flex-items-center text-left p-0 mx-3"
        >
          <Token :address="token" :symbol="token" class="mr-3" />
          {{ _ticker(token) }}
          <a class="d-block text-white pb-2">
            <Icon name="arrow-down" />
          </a>
        </UiTableTh>
      </div>
      <UiTableTh class="flex-auto">
        <UiButton
          @click="mintToken"
          type="button"
          class="minter-button button-primary button-sm"
          :loading="mintButtonLoading"
          v-text="
            mintButtonLoading
              ? ''
              : `${$t('get')} ${1000 / this.tokens[this.token].price} ${
                  tokens[token].symbol
                }`
          "
        >
        </UiButton>
      </UiTableTh>
    </UiTable>
    <portal to="modal">
      <ModalWrapper
        :open="modalWrapperOpen"
        @close="modalWrapperOpen = false"
        :side="side"
      />
      <ModalSelectToken
        :open="tokenModalOpen"
        @close="tokenModalOpen = false"
        @input="changeToken"
      />
    </portal>
  </Page>
</template>

<script>
import { formatUnits, parseUnits } from '@ethersproject/units';
import {
  getTokenBySymbol,
  bnum,
  isValidAddress,
  normalizeBalance
} from '@/helpers/utils';
import { getAddress } from '@ethersproject/address';
import { Contract } from '@ethersproject/contracts';
import minter from '../helpers/abi/Minter.json';
import { getInstance } from '@snapshot-labs/lock/plugins/vue';
import provider from '@/helpers/provider';
import store from '@/store';
import config from '@/config';

export default {
  data() {
    return {
      modalWrapperOpen: false,
      side: 0,
      token: getTokenBySymbol('DAI').address,
      tokenModalOpen: false,
      query: '',
      mintButtonLoading: false
    };
  },
  computed: {
    isNotMainnet() {
      return config.network !== 'homestead';
    },
    balances() {
      const balances = Object.entries(this.web3.balances)
        .filter(
          ([address]) => address !== 'ether' && this.web3.tokenMetadata[address]
        )
        .map(([address, denormBalance]) => {
          const price = this.price.values[address];
          const balance = formatUnits(
            denormBalance,
            this.web3.tokenMetadata[address].decimals
          );
          return {
            address,
            name: this.web3.tokenMetadata[address].name,
            symbol: this.web3.tokenMetadata[address].symbol,
            price,
            balance,
            value: balance * price
          };
        })
        .filter(({ value }) => value > 0.001);
      const ethPrice = this.price.values[this.config?.addresses.weth];
      const ethBalance = formatUnits(this.web3.balances['ether'] || 0, 18);
      return [
        {
          address: 'ether',
          name: 'ETH',
          symbol: 'ETH',
          price: ethPrice,
          balance: ethBalance,
          value: ethPrice * ethBalance
        },
        ...balances
      ];
    },
    balancesTotalValue() {
      return this.balances.reduce((a, b) => a + b.value || 0, 0);
    },
    tokens() {
      return Object.fromEntries(
        Object.entries(this.web3.tokenMetadata)
          .map(token => {
            const address = token[0];
            const decimals = token[1].decimals;
            const price = bnum(this.price.values[address] || 0);
            const balance = normalizeBalance(
              this.web3.balances[address] || 0,
              decimals
            );
            const value = price.times(balance);
            return [
              address,
              {
                decimals,
                balance: balance.toNumber(),
                price: price.toNumber(),
                value: value.toNumber(),
                symbol: token[1].symbol,
                name: token[1].name
              }
            ];
          })
          .filter(token => {
            if (this.not?.includes(token[0])) return false;
            const address = token[0];
            const query = this.query.toLowerCase();
            if (isValidAddress(query)) {
              return address.toLowerCase() === query;
            } else {
              const symbol = token[1].symbol.toLowerCase();
              const name = token[1].name.toLowerCase();
              return symbol.includes(query) || name.includes(query);
            }
          })
          .sort((a, b) => {
            if (a[1].value && b[1].value) return b[1].value - a[1].value;
            if (a[1].value) return -1;
            if (b[1].value) return 1;
            return b[1].balance - a[1].balance;
          })
      );
    }
  },
  methods: {
    changeToken(selectedToken) {
      const tokenAddress = getAddress(selectedToken);
      this.token = tokenAddress;
    },
    async mintToken() {
      this.mintButtonLoading = true;
      const contractAddress = this.token;
      const contract = new Contract(
        contractAddress,
        minter['abi'],
        getInstance().web3?.getSigner()
      );
      const amount = 1000 / this.tokens[this.token].price;
      const name = await contract.name();
      const symbol = await contract.symbol();

      const decimals = await contract.decimals();
      const parsedUnits = parseUnits(amount.toString(), decimals);

      try {
        const tx = await contract.mint(this.web3.account, parsedUnits);
        const title = `Mint ${name}`;
        store.commit('watchTransaction', { ...tx, title });

        const receipt = await provider.waitForTransaction(tx.hash, 1);
        store.commit('confirmTransaction', receipt);

        await store.dispatch('getBalances');

        console.log(
          `${name} minted: ${amount} ${symbol} to ${this.web3.account}`
        );
      } catch (err) {
        console.log(err.message);
        console.log(
          `${name} didn't mint: ${amount} ${symbol} to ${this.web3.account}`
        );
      }
      this.mintButtonLoading = false;
    }
  }
};
</script>

<style scoped lang="scss">
@media (max-width: 766px) {
  .token-minter {
    width: 100% !important;
  }
}

.minter-button {
  margin-left: auto;
}
</style>
