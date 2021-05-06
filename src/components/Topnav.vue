<template>
  <nav id="topnav" class="border-bottom position-fixed width-full">
    <div class="d-flex flex-items-center px-5" style="height: 78px;">
      <div class="flex-auto d-flex flex-items-center">
        <a class="d-block d-xl-none text-white" @click="toggleSidebar">
          <Icon name="menu" size="28" class="mr-3" />
        </a>
        <router-link
          :to="{ name: 'home' }"
          class="d-inline-block text-blue d-flex"
          style="padding-top: 2px;"
        >
          <img
            src="~/@/assets/logo.svg"
            class="mr-2 v-align-middle"
            height="45"
          />
          <span
            class="brand d-inline-block text-white"
            style="letter-spacing: 1px; font-size: 16px;"
            v-text="'Multitoken'"
          />
          <span class="alphaWarning">
            Alpha
          </span>
        </router-link>
      </div>
      <div class="header-middle hide-sm hide-md">
        <div class="chain-buttons-container">
          <UiButton
            class="mx-1"
            v-for="(chain, i) in chains"
            @click="changeNetwork(chain)"
            :key="i"
            :class="{
              'button-highlight':
                web3.injectedChainId == parseInt(chainParams[chain].chainId, 16)
            }"
            :disabled="
              web3.injectedChainId == parseInt(chainParams[chain].chainId, 16)
            "
          >
            {{ chainParams[chain].chainName }}
          </UiButton>
        </div>
      </div>
      <div :key="web3.account">
        <a
          v-if="$auth.isAuthenticated && totalPendingClaims > 0"
          href="https://claim.balancer.finance"
          target="_blank"
          class="mr-2"
        >
          <UiButton>✨ {{ _num(totalPendingClaims) }} BAL</UiButton>
        </a>
        <UiButton
          v-if="$auth.isAuthenticated && !wrongNetwork"
          class="buttton-non-clickable balance hide-sm hide-md"
        >
          <span v-text="_num(balancesTotalValue, 'usd')" />
        </UiButton>
        <UiButton
          v-if="$auth.isAuthenticated && !wrongNetwork"
          @click="modalOpen.account = true"
          :loading="loading || ui.authLoading"
          class="ml-2"
        >
          <Avatar :address="web3.account" size="16" class="ml-n1 mr-n1" />
          <span v-if="web3.name" v-text="web3.name" class="hide-sm ml-2 pl-1" />
          <span
            v-else
            v-text="_shortenAddress(web3.account)"
            class="hide-sm hide-md hide-lg  ml-2 pl-1"
          />
        </UiButton>
        <UiButton
          v-if="$auth.isAuthenticated && wrongNetwork"
          class="button-red"
        >
          <Icon name="warning" class="ml-n2 mr-1 v-align-middle" />
          {{ $t('wrongNetwork') }}
        </UiButton>
        <UiButton
          v-if="!$auth.isAuthenticated"
          @click="modalOpen.account = true"
          :loading="loading || ui.authLoading"
          class="button-primary"
        >
          {{ $t('connectWallet') }}
        </UiButton>
        <router-link
          v-if="$auth.isAuthenticated && !wrongNetwork && !ui.authLoading"
          :to="{ name: 'wallet' }"
          class="ml-2"
        >
          <UiButton class="v-align-bottom p-0">
            <Icon name="wallet" size="20" class="mx-3" />
          </UiButton>
        </router-link>
        <UiButton
          v-if="myPendingTransactions.length"
          @click="modalOpen.activity = true"
          class="button-primary ml-2"
        >
          {{ myPendingTransactions.length }}
        </UiButton>
      </div>
    </div>
    <portal to="modal">
      <ModalAccount
        :open="modalOpen.account"
        @close="modalOpen.account = false"
        @login="handleLogin"
      />
      <ModalActivity
        :open="modalOpen.activity"
        @close="modalOpen.activity = false"
        @login="handleLogin"
      />
      <ModalAbout :open="modalOpen.about" @close="modalOpen.about = false" />
    </portal>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getTotalPendingClaims } from '@/_balancer/claim';
import provider from '@/helpers/provider';
import { formatUnits } from '@ethersproject/units';
import i18n from '@/i18n';

export default {
  data() {
    return {
      loading: false,
      totalPendingClaims: false,
      chains: ['mainnet', 'kovan', 'bsc'],
      chainParams: {
        mainnet: {
          chainId: '0x1',
          chainName: 'Ethereum',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://mainnet.infura.io/v3'],
          blockExplorerUrls: ['https://etherscan.io']
        },
        kovan: {
          chainId: '0x2a',
          chainName: 'Kovan',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://kovan.infura.io/v3'],
          blockExplorerUrls: ['https://kovan.etherscan.io']
        },
        fantom: {
          chainId: '0xfa',
          chainName: 'Fantom',
          nativeCurrency: {
            name: 'Fantom',
            symbol: 'FTM',
            decimals: 18
          },
          rpcUrls: ['https://rpcapi.fantom.network'],
          blockExplorerUrls: ['https://ftmscan.com']
        },
        bsc: {
          chainId: '0x38',
          chainName: 'BSC',
          nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18
          },
          rpcUrls: ['https://bsc-dataseed.binance.org'],
          blockExplorerUrls: ['https://bscscan.com']
        },
        matic: {
          chainId: '0x89',
          chainName: 'Matic',
          nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18
          },
          rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
          blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com']
        },
        heco: {
          chainId: '0x80',
          chainName: 'Heco',
          nativeCurrency: {
            name: 'Heco Token',
            symbol: 'HT',
            decimals: 18
          },
          rpcUrls: ['https://http-mainnet.hecochain.com'],
          blockExplorerUrls: ['https://hecoinfo.com']
        },
        xdai: {
          chainId: '0x64',
          chainName: 'xDai',
          nativeCurrency: {
            name: 'xDai Token',
            symbol: 'xDai',
            decimals: 18
          },
          rpcUrls: ['https://rpc.xdaichain.com'],
          blockExplorerUrls: ['https://blockscout.com/poa/xdai']
        },
        harmony: {
          chainId: '0x63564C40',
          chainName: 'Harmony One',
          nativeCurrency: {
            name: 'One Token',
            symbol: 'ONE',
            decimals: 18
          },
          rpcUrls: ['https://api.s0.t.hmny.io'],
          blockExplorerUrls: ['https://explorer.harmony.one/']
        }
      },
      modalOpen: {
        account: false,
        activity: false,
        about: false
      }
    };
  },
  watch: {
    'web3.account': async function() {
      this.totalPendingClaims = false;
      if (!this.web3.account) return;
      try {
        this.totalPendingClaims = await getTotalPendingClaims(
          this.config.chainId,
          provider,
          this.web3.account
        );
      } catch (e) {
        console.log(e);
      }
    }
  },
  computed: {
    ...mapGetters(['myPendingTransactions']),
    wrongNetwork() {
      return (
        this.config.chainId !== this.web3.injectedChainId &&
        !this.ui.authLoading &&
        !this.loading
      );
    },
    baseTokenBalance() {
      const baseToken = this.config?.baseToken;

      const price = this.price.values[this.config?.addresses[baseToken?.wrapped]];
      const balance = formatUnits(this.web3.balances[baseToken?.address] || 0, 18);
      const result = {
        address: baseToken?.address,
        name: baseToken?.name,
        symbol: baseToken?.symbol,
        price: price,
        balance: balance,
        value: price * balance
      };
      debugger;
      return result;
    },
    balances() {
      const baseToken = this.config?.baseToken;
      const balances = Object.entries(this.web3.balances)
        .filter(
          ([address]) => address !== baseToken?.address && this.web3.tokenMetadata[address]
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
      return [
        this.baseTokenBalance,
        ...balances
      ];
    },
    balancesTotalValue() {
      return this.balances.reduce((a, b) => a + b.value || 0, 0);
    }
  },
  methods: {
    ...mapActions(['toggleSidebar', 'login']),
    async handleLogin(connector) {
      this.modalOpen.account = false;
      this.loading = true;
      await this.login(connector);
      this.loading = false;
    },
    async changeNetwork(chainName) {
      if (
        // BSC Coming soon notification
        this.chainParams[chainName].chainName ===
        this.chainParams['bsc'].chainName
      ) {
        return this.$store.dispatch('notify', ['blue', i18n.tc('comingSoon')]);
      }

      try {
        await this.$auth.web3.send('wallet_addEthereumChain', [
          this.chainParams[chainName],
          this.web3.account
        ]);
        this.$store.dispatch('notify', [
          'green',
          `${i18n.tc('changedNetwork')} ${
            this.chainParams[chainName].chainName
          }.`
        ]);
      } catch (e) {
        if (
          this.chainParams[chainName].chainName ===
            this.chainParams['mainnet'].chainName ||
          this.chainParams[chainName].chainName ===
            this.chainParams['kovan'].chainName
        ) {
          this.$store.dispatch('notify', [
            'red',
            `${i18n.tc('useMetamaskToSwitch')} ${
              this.chainParams[chainName].chainName
            } network.`
          ]);
        } else {
          this.$store.dispatch('notify', ['red', e.message]);
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '../vars';

#topnav {
  z-index: 10;

  background-color: $panel-background;
}

.alphaWarning {
  position: relative;
  top: -10px;

  color: #f00;

  font-size: 12px;
}

.header-middle {
  position: absolute;
  left: calc(50% - 150px);

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  width: 300px;

  color: #fff;
}

.chain-buttons-container {
  display: flex;
}

@media (max-width: 1020px) {
  .header-middle {
    left: 260px;
  }
}

@media (max-width: 920px) {
  .brand {
    display: none !important;
  }

  .header-middle {
    left: 170px;
  }
}

@media (max-width: 826px) {
  .header-middle {
    left: unset;
    position: relative;
  }
}

@media (max-width: $width-xl) {
  .nav-buttons {
    display: none !important;
  }
}
</style>
