<template>
  <UiModal :open="open" @close="$emit('close')" v-if="pool.id">
    <UiModalForm>
      <template slot="header">
        <h3 v-text="$t('issue')" class="text-white" />
      </template>
      <div class="text-center m-4 mt-0">
        <Toggle
          :value="type"
          :options="toggleOptions"
          :buyAvailable="true"
          @select="handleSelectType"
          class="mt-4"
        />
      </div>
      <div class="m-4 d-block d-sm-flex">
        <PoolOverview
          :pool="pool"
          :userShare="userLiquidity.relative"
          class="hide-sm hide-md col-3 float-left"
        />
        <div class="col-12 col-md-9 float-left pl-0 pl-md-4">
          <div v-if="type === 'BUY_FOR_ETH'" class="d-flex flex-justify-center">
            <Toggle
              :value="ethType"
              :options="ethToggleOptions"
              @select="handleSelectEthType"
              class="mb-4"
            />
          </div>
          <UiTable>
            <UiTableTh>
              <div v-text="$t('asset')" class="column-lg flex-auto text-left" />
              <div v-text="$t('walletBalance')" class="column" />
              <div v-text="$t('depositAmount')" class="column-sm" />
            </UiTableTh>
            <div v-if="!listLoading">
              <UiTableTr
                v-for="token in renderedTokens"
                :key="token.checksum"
                :slim="true"
                class="asset"
                :class="{
                  active: isMultiAsset || activeToken === token.checksum
                }"
              >
                <div
                  class="column-lg flex-auto d-flex flex-items-center text-left d-flex"
                >
                  <UiRadio
                    class="mr-2"
                    v-if="!isMultiAsset"
                    :checked="activeToken === token.checksum"
                    :onChange="
                      e => {
                        handleTokenSelect(token.checksum);
                      }
                    "
                  />
                  <div
                    :class="
                      token.symbol.length > 14 && 'tooltipped tooltipped-ne'
                    "
                    :aria-label="token.symbol"
                    class="text-white d-flex flex-items-center"
                  >
                    <Token :address="token.address" class="mr-2" size="30" />
                    {{ _shorten(token.symbol, 14) }}
                  </div>
                </div>
                <div class="column-lg">
                  {{
                    _trunc(
                      formatBalance(
                        web3.balances[token.checksum] || '0',
                        token.decimals
                      ),
                      4
                    )
                  }}
                  <a @click="handleMax(token)" class="ml-1">
                    <UiLabel v-text="$t('max')" />
                  </a>
                </div>
                <div class="column-sm">
                  <div
                    class="flex-auto ml-3 text-left d-flex flex-items-center position-relative"
                  >
                    <input
                      v-model="amounts[token.checksum]"
                      v-if="isMultiAsset || activeToken === token.checksum"
                      class="input flex-auto text-right"
                      :class="isInputValid(token) ? 'text-white' : 'text-red'"
                      placeholder="0.0"
                      @input="handleChange(amounts[token.checksum], token)"
                    />
                  </div>
                </div>
              </UiTableTr>
            </div>
            <ListLoading
              v-else
              :classes="[
                'column-lg flex-auto d-flex flex-items-center text-left d-flex',
                'column-lg',
                'column-sm'
              ]"
              :height="22"
              :thin="true"
            />
          </UiTable>
          <UiTable class="mt-4">
            <UiTableTh class="text-left flex-items-center text-white">
              <div class="flex-auto">
                {{ _shorten(pool.symbol, 12) }} {{ $t('amount') }}
              </div>
              <div class="flex-auto text-right">
                {{ _num(userLiquidity.absolute.current) }}
                <span v-if="userLiquidity.absolute.future">
                  → {{ _num(userLiquidity.absolute.future) }}
                </span>
                {{ _shorten(pool.symbol, 12) }}
              </div>
            </UiTableTh>
          </UiTable>
        </div>
      </div>
      <template slot="footer">
        <div class="mx-4">
          <MessageError v-if="tokenError" :text="tokenError" class="mb-2" />
          <MessageError
            v-if="validationError"
            :text="validationError"
            class="mb-2"
          />
          <MessageError
            v-if="transferError"
            :text="transferError"
            class="mb-2"
          />
          <MessageWarningToken
            v-if="!tokenError && !validationError && !warningAccepted"
            :custom="hasCustomToken"
            @accept="warningAccepted = true"
            class="mb-2 text-left"
          />
          <MessageWarningRateChange
            v-if="rateChangeWarning"
            @lower="lowerAmounts"
            class="mb-2"
          />
          <MessageSlippage
            v-if="slippage"
            :value="slippage"
            :isDeposit="true"
            class="mb-2"
          />
          <MessageWarning
            v-if="!addLiquidityEnabled"
            :text="$t('cannotAddLiquidity')"
            class="mb-2"
          />
        </div>
        <Button
          v-if="isSingleAsset || isMultiAsset"
          :requireLogin="true"
          :requireProxy="true"
          :requireApprovals="validationError ? undefined : requiredApprovals"
          @submit="handleSubmit"
          :disabled="
            tokenError ||
              validationError ||
              !warningAccepted ||
              transactionReverted ||
              !addLiquidityEnabled
          "
          :loading="loading"
          class="button-primary"
        >
          {{ $t('issue') }}
        </Button>
        <Button
          v-else
          :requireLogin="true"
          :requireApprovals="validationError ? undefined : requiredApprovals"
          @submit="handleSubmit"
          :disabled="
            tokenError ||
              validationError ||
              !warningAccepted ||
              transactionReverted
          "
          :loading="loading"
          class="button-primary"
        >
          {{
            `${$t('buyFor')} ${
              web3.tokenMetadata[activeToken]
                ? web3.tokenMetadata[activeToken].symbol
                : config.baseToken.symbol
            }`
          }}
        </Button>
      </template>
    </UiModalForm>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';
import { getAddress, isAddress } from '@ethersproject/address';
import { Contract } from '@ethersproject/contracts';
import BigNumber from '@/helpers/bignumber';
import { isBSCNetwork } from '@/helpers/buyEtf';
import {
  calcPoolTokensByRatio,
  // calcPoolTokensFromAmount
  bnum,
  normalizeBalance,
  denormalizeBalance,
  isTxReverted,
  getTokenBySymbol,
  liquidityToggleOptions,
  toWei,
  blockNumberToTimestamp
} from '@/helpers/utils';
import { calcPoolOutGivenSingleIn } from '@/helpers/math';
import { validateNumberInput, formatError } from '@/helpers/validation';
import { canProvideLiquidity } from '@/helpers/whitelist';
import store from '@/store';
import provider from '@/helpers/provider';
import SingleAssetBuyerEther from '../../helpers/abi/SingleAssetBuyerEther.json';
import SingleAssetBuyerToken from '../../helpers/abi/SingleAssetBuyerToken.json';
import MultiAssetBuyerEther from '../../helpers/abi/MultiAssetBuyerEther.json';
import { getInstance } from '@snapshot-labs/lock/plugins/vue';
import i18n from '@/i18n';

const BALANCE_BUFFER = 0.01;

function hasToken(pool, symbol) {
  const token = getTokenBySymbol(symbol);
  if (!token) {
    return false;
  }
  const tokenAddress = token.address;
  return pool.tokensList.includes(tokenAddress);
}

export default {
  props: ['open', 'pool', 'bPool'],
  data() {
    return {
      loading: false,
      listLoading: false,
      poolTokens: null,
      amounts: {},
      type: 'MULTI_ASSET',
      ethType: 'MULTI_ASSET',
      ethToggleOptions: {
        MULTI_ASSET: i18n.tc('multiAsset'),
        SINGLE_ASSET: i18n.tc('singleAsset')
      },
      activeToken: null,
      warningAccepted: false,
      transactionReverted: false,
      addLiquidityEnabled: true,
      userTokens: []
    };
  },
  watch: {
    open() {
      this.loading = false;
      this.poolTokens = null;
      this.amounts = Object.fromEntries(
        this.pool.tokens.map(token => {
          return [token.checksum, ''];
        })
      );
      this.type = 'MULTI_ASSET';
      this.activeToken = this.pool.tokens[0].checksum;
      this.warningAccepted = false;
      this.transactionReverted = false;
    },
    'web3.account': async function(val, prev) {
      if (val && val.toLowerCase() !== prev) {
        this.addLiquidityEnabled = await this.canAddLiquidity();
      }
    }
  },
  async created() {
    this.listLoading = true;
    const userTokens = Object.entries(this.web3.balances)
      .filter(t => t[1] != 0)
      .filter(t => isAddress(t[0]))
      .filter(t => t[0] !== getAddress(this.bPool.getBptAddress()));
    const userTokenIds = userTokens.map(t => t[0]);
    if (userTokenIds.length > 0) {
      await this.loadTokenMetadata(userTokenIds);
      this.userTokens = userTokens.map(t => ({
        address: t[0],
        checksum: t[0],
        symbol: this.web3.tokenMetadata[t[0]].symbol,
        decimals: this.web3.tokenMetadata[t[0]].decimals
      }));
    }
    this.addLiquidityEnabled = await this.canAddLiquidity();
    this.listLoading = false;
  },
  computed: {
    toggleOptions() {
      if (this.userTokens.length > 0) {
        if (isBSCNetwork()) {
          return {
            MULTI_ASSET: i18n.tc('multiAsset'),
            SINGLE_ASSET: i18n.tc('singleAsset'),
            BUY_FOR_ERC20: i18n.tc('buyForERC20')
          };
        }
        return liquidityToggleOptions;
      } else {
        return {
          MULTI_ASSET: i18n.tc('multiAsset'),
          SINGLE_ASSET: i18n.tc('singleAsset')
        };
      }
    },
    poolTokenBalance() {
      const bptAddress = this.bPool.getBptAddress();
      const balance = this.web3.balances[getAddress(bptAddress)];
      return normalizeBalance(balance || '0', 18);
    },
    totalShares() {
      return this.bPool.metadata.totalShares;
    },
    userLiquidity() {
      const poolSharesFrom = parseFloat(this.poolTokenBalance);
      const totalShares = parseFloat(this.totalShares);
      const current = poolSharesFrom / totalShares;
      if (this.validationError) {
        return {
          absolute: {
            current: poolSharesFrom
          },
          relative: {
            current
          }
        };
      }

      const poolTokens = this.poolTokens
        ? bnum(this.poolTokens)
            .div('1e18')
            .toNumber()
        : 0;
      const future = (poolSharesFrom + poolTokens) / (totalShares + poolTokens);
      return {
        absolute: {
          current: poolSharesFrom,
          future: poolSharesFrom + poolTokens
        },
        relative: {
          current,
          future
        }
      };
    },
    tokenError() {
      if (
        this.pool.tokens.some(token =>
          this.config.untrusted.includes(token.checksum)
        )
      ) {
        return this.$t('untrustedTokens');
      }
      return undefined;
    },
    validationError() {
      if (this.tokenError) {
        return undefined;
      }
      if (this.isSingleAsset || this.isMultiAsset) {
        for (const token of this.pool.tokensList) {
          if (!this.isMultiAsset && this.activeToken !== token) {
            continue;
          }
          const amountError = validateNumberInput(this.amounts[token]);
          const amountErrorText = formatError(amountError, this.$t('amount'));
          if (amountErrorText) return amountErrorText;
        }
        // Amount validation
        for (const token of this.pool.tokensList) {
          if (!this.isMultiAsset && this.activeToken !== token) {
            continue;
          }
          const amount = bnum(this.amounts[token]);
          const balance = normalizeBalance(
            this.web3.balances[token],
            this.web3.tokenMetadata[token].decimals
          );
          if (amount.gt(balance)) {
            return this.$t('amountExceedsBalance');
          }
        }
      }
      // Max in ratio validation
      if (this.isSingleAsset) {
        const maxInRatio = 1 / 2;
        const amount = bnum(this.amounts[this.activeToken]);
        const tokenIn = this.pool.tokens.find(
          token => token.checksum === this.activeToken
        );
        if (amount.div(tokenIn.balance).gt(maxInRatio)) {
          return this.$t('insufficientLiquidity');
        }
      }
      return undefined;
    },
    requiredApprovals() {
      return Object.fromEntries(
        this.bPool.metadata.tokensList
          .filter(
            token =>
              this.isMultiAsset ||
              (!this.isMultiAsset && this.activeToken === token)
          )
          .map(token => [token, this.amounts[token]])
      );
    },
    transferError() {
      if (this.tokenError || this.validationError) return undefined;
      if (!this.transactionReverted) return undefined;
      if (hasToken(this.pool, 'SNX')) {
        return this.$t('addStakedSNX');
      }
      const synths = ['sUSD', 'sBTC', 'sETH', 'sXAU', 'sXAG', 'sDEFI', 'sXMR'];
      if (synths.some(synth => hasToken(this.pool, synth))) {
        return this.$t('addSNXUnderwater');
      }
      const aTokens = [
        'aDAI',
        'aUSDT',
        'aUSDC',
        'aSUSD',
        'aTUSD',
        'aBUSD',
        'aBAT',
        'aETH',
        'aKNC',
        'aLEND',
        'aLINK',
        'aMANA',
        'aMKR',
        'aREP',
        'aSNX',
        'aWBTC',
        'aZRX'
      ];
      if (aTokens.some(aToken => hasToken(this.pool, aToken))) {
        return this.$t('addAAVEUnderwater');
      }
      const cTokens = [
        'cUSDC',
        'cDAI',
        'cETH',
        'cUSDT',
        'cREP',
        'cZRX',
        'cBAT',
        'cWBTC'
      ];
      if (cTokens.some(cToken => hasToken(this.pool, cToken))) {
        return this.$t('addCompoundUnderwater');
      }
      return this.$t('addTransferBlocked');
    },
    hasCustomToken() {
      if (this.validationError || this.tokenError) {
        return false;
      }
      for (const token of this.pool.tokens) {
        const tokenMetadata = this.web3.tokenMetadata[token.checksum];
        if (!tokenMetadata || !tokenMetadata.whitelisted) {
          return true;
        }
      }
      return false;
    },
    rateChangeWarning() {
      if (this.validationError || this.tokenError) {
        return false;
      }
      if (!this.isMultiAsset) {
        return false;
      }
      const token = this.findFrontrunnableToken;
      if (!token) {
        return false;
      }
      const frontrunningThreshold = 1 - BALANCE_BUFFER;
      const address = token.checksum;
      const amount = bnum(this.amounts[address]);
      const denormAmount = denormalizeBalance(amount, token.decimals);
      const balance = this.web3.balances[address];
      const amountToBalanceRatio = denormAmount.div(balance);
      return (
        amountToBalanceRatio.gt(frontrunningThreshold) &&
        amountToBalanceRatio.lte(1)
      );
    },
    slippage() {
      if (!this.isSingleAsset && !this.isMultiAsset) {
        return 0;
      }
      if (this.validationError || this.tokenError) {
        return undefined;
      }
      if (this.isMultiAsset) {
        return undefined;
      }
      const tokenInAddress = this.activeToken;
      if (!this.amounts[tokenInAddress]) {
        return undefined;
      }
      const tokenIn = this.pool.tokens.find(
        token => token.checksum === tokenInAddress
      );
      const amount = bnum(this.amounts[tokenInAddress]);

      const tokenBalanceIn = denormalizeBalance(
        tokenIn.balance,
        tokenIn.decimals
      );
      const tokenWeightIn = bnum(tokenIn.denormWeight).times('1e18');
      const poolSupply = denormalizeBalance(this.totalShares, 18);
      const totalWeight = bnum(this.pool.totalWeight).times('1e18');
      const tokenAmountIn = denormalizeBalance(
        amount,
        tokenIn.decimals
      ).integerValue(BigNumber.ROUND_UP);
      const swapFee = bnum(this.pool.swapFee).times('1e18');

      const poolAmountOut = calcPoolOutGivenSingleIn(
        tokenBalanceIn,
        tokenWeightIn,
        poolSupply,
        totalWeight,
        tokenAmountIn,
        swapFee
      );
      const expectedPoolAmountOut = tokenAmountIn
        .times(tokenWeightIn)
        .times(poolSupply)
        .div(tokenBalanceIn)
        .div(totalWeight);
      return bnum(1).minus(poolAmountOut.div(expectedPoolAmountOut));
    },
    findFrontrunnableToken() {
      if (this.validationError) {
        return;
      }
      let maxAmountToBalanceRatio = bnum(0);
      let maxRatioToken = undefined;
      for (const token of this.pool.tokens) {
        const address = token.checksum;
        const amount = bnum(this.amounts[address]);
        const denormAmount = denormalizeBalance(amount, token.decimals);
        const balance = this.web3.balances[address];
        const amountToBalanceRatio = denormAmount.div(balance);
        if (amountToBalanceRatio.gt(maxAmountToBalanceRatio)) {
          maxAmountToBalanceRatio = amountToBalanceRatio;
          maxRatioToken = token;
        }
      }
      return maxRatioToken;
    },
    isSingleAsset() {
      return this.type === 'SINGLE_ASSET';
    },
    isMultiAsset() {
      return this.type === 'MULTI_ASSET';
    },
    isBuyForEth() {
      return this.type === 'BUY_FOR_ETH';
    },
    renderedTokens() {
      if (this.isSingleAsset || this.isMultiAsset) {
        return this.pool.tokens;
      }
      if (this.isBuyForEth) {
        return [
          {
            address: this.config.baseToken.address,
            checksum: this.config.baseToken.address,
            symbol: this.config.baseToken.symbol,
            decimals: 18
          }
        ];
      }
      return this.userTokens;
    }
  },
  methods: {
    ...mapActions(['joinPool', 'joinswapExternAmountIn', 'loadTokenMetadata']),
    async handleChange(changedAmount, changedToken) {
      const ratio = bnum(changedAmount).div(changedToken.balance);
      if (this.isMultiAsset) {
        this.poolTokens = calcPoolTokensByRatio(ratio, this.totalShares);
        /*
        const tokenBalanceIn = denormalizeBalance(
          changedToken.balance,
          changedToken.decimals
        );
        this.poolTokens = calcPoolTokensFromAmount(
          bnum(changedAmount),
          tokenBalanceIn,
          this.totalShares
        );
        */
      } else if (this.isSingleAsset) {
        const tokenIn = this.pool.tokens.find(
          token => token.checksum === this.activeToken
        );
        const amount = new BigNumber(this.amounts[tokenIn.checksum]);

        const maxInRatio = 1 / 2;
        if (amount.div(tokenIn.balance).gt(maxInRatio)) {
          return;
        }

        const tokenBalanceIn = denormalizeBalance(
          tokenIn.balance,
          tokenIn.decimals
        );
        const tokenWeightIn = bnum(tokenIn.denormWeight).times('1e18');
        const poolSupply = denormalizeBalance(this.totalShares, 18);
        const totalWeight = bnum(this.pool.totalWeight).times('1e18');
        const tokenAmountIn = denormalizeBalance(
          amount,
          tokenIn.decimals
        ).integerValue(BigNumber.ROUND_UP);
        const swapFee = bnum(this.pool.swapFee).times('1e18');

        this.poolTokens = calcPoolOutGivenSingleIn(
          tokenBalanceIn,
          tokenWeightIn,
          poolSupply,
          totalWeight,
          tokenAmountIn,
          swapFee
        ).toString();
      } else if (this.amounts[this.activeToken] > 0 && this.isBuyForEth) {
        const poolAddress = this.bPool.getBptAddress();
        const isSmart = this.bPool.isCrp();
        const amount = this.amounts[this.activeToken];
        const amountWei = `0x${toWei(amount).toString(16)}`;

        if (this.ethType == 'MULTI_ASSET') {
          const buyerContract = MultiAssetBuyerEther;

          const contract = new Contract(
            buyerContract.networks[this.config.chainId].address,
            buyerContract['abi'],
            getInstance().web3?.getSigner()
          );

          const joinAmounts = await contract.calcJoinPool(
            poolAddress,
            isSmart,
            amountWei
          );
          this.poolTokens = joinAmounts[1];
        } else {
          const buyerContract = SingleAssetBuyerEther;

          const contract = new Contract(
            buyerContract.networks[this.config.chainId].address,
            buyerContract['abi'],
            getInstance().web3?.getSigner()
          );

          const underlyingToken = await contract.chooseUnderlyingToken(
            poolAddress,
            isSmart
          );

          const minPoolAmountOut = await contract.calcMinPoolAmountOut(
            poolAddress,
            isSmart,
            underlyingToken,
            amountWei
          );
          this.poolTokens = minPoolAmountOut;
        }
      } else if (this.amounts[this.activeToken] > 0) {
        const buyerContract = SingleAssetBuyerToken;
        const contract = new Contract(
          buyerContract.networks[this.config.chainId].address,
          buyerContract['abi'],
          getInstance().web3?.getSigner()
        );

        const poolAddress = this.bPool.getBptAddress();
        const isSmart = this.bPool.isCrp();
        const underlyingToken = await contract.chooseUnderlyingToken(
          poolAddress,
          isSmart
        );
        const amount = this.amounts[this.activeToken];
        const amountWei = `0x${toWei(amount).toString(16)}`;

        const minPoolAmountOut = await contract.calcMinPoolAmountOut(
          poolAddress,
          isSmart,
          underlyingToken,
          this.activeToken,
          amountWei
        );

        this.poolTokens = minPoolAmountOut;
      }

      this.pool.tokens.forEach(token => {
        if (!this.isMultiAsset) {
          return;
        }
        if (token.checksum === changedToken.checksum) {
          return;
        }

        // const ratio = bnum(changedAmount).div(changedToken.balance);
        this.amounts[token.checksum] = ratio.isNaN()
          ? ''
          : ratio.times(token.balance).toString();
      });
    },
    handleMax(token) {
      const balance = this.web3.balances[token.checksum];
      const amount = normalizeBalance(balance, token.decimals);
      this.amounts[token.checksum] = amount.toString();
      this.handleTokenSelect(token.checksum);
      this.handleChange(amount, token);
    },
    lowerAmounts() {
      const frontrunningThreshold = 1 - BALANCE_BUFFER;
      const token = this.findFrontrunnableToken;
      const address = token.checksum;
      const balance = this.web3.balances[address];
      const safeAmount = bnum(balance).times(frontrunningThreshold);
      const normalizedAmount = normalizeBalance(safeAmount, token.decimals);
      this.amounts[token.checksum] = normalizedAmount.toString();
      this.handleChange(normalizedAmount, token);
    },
    handleSelectType(type) {
      this.type = type;
      this.handleTokenSelect(this.renderedTokens[0].checksum);
      this.poolTokens = null;
      this.amounts = Object.fromEntries(
        this.pool.tokens.map(token => {
          return [token.checksum, ''];
        })
      );
    },
    handleSelectEthType(type) {
      this.ethType = type;
      this.handleTokenSelect(this.renderedTokens[0].checksum);
      this.poolTokens = null;
      this.amounts = Object.fromEntries(
        this.pool.tokens.map(token => {
          return [token.checksum, ''];
        })
      );
    },
    handleTokenSelect(token) {
      this.activeToken = token;
    },
    async handleSubmit() {
      this.loading = true;
      const poolAddress = this.bPool.getBptAddress();
      if (this.isMultiAsset) {
        const params = {
          poolAddress,
          poolAmountOut: this.poolTokens,
          maxAmountsIn: this.pool.tokensList.map(tokenAddress => {
            const token = this.pool.tokens.find(
              token => token.checksum === tokenAddress
            );
            const amount = bnum(this.amounts[token.checksum]);
            const inputAmountIn = denormalizeBalance(amount, token.decimals)
              .div(1 - BALANCE_BUFFER)
              .integerValue(BigNumber.ROUND_UP);
            const balanceAmountIn = bnum(this.web3.balances[token.checksum]);
            const tokenAmountIn = BigNumber.min(inputAmountIn, balanceAmountIn);
            return tokenAmountIn.toString();
          }),
          isCrp: this.bPool.isCrp()
        };
        console.log(`Adding multi-asset liquidity: ${params}`);
        const txResult = await this.joinPool(params);
        if (isTxReverted(txResult)) this.transactionReverted = true;
      } else if (this.isSingleAsset) {
        const tokenIn = this.pool.tokens.find(
          token => token.checksum === this.activeToken
        );
        const tokenAmountIn = denormalizeBalance(
          this.amounts[tokenIn.checksum],
          tokenIn.decimals
        )
          .integerValue(BigNumber.ROUND_UP)
          .toString();
        const minPoolAmountOut = bnum(this.poolTokens)
          .times(1 - BALANCE_BUFFER)
          .integerValue(BigNumber.ROUND_UP)
          .toString();
        const params = {
          poolAddress,
          tokenInAddress: this.activeToken,
          tokenAmountIn,
          minPoolAmountOut
        };
        await this.joinswapExternAmountIn(params);
      } else if (this.ethType == 'SINGLE_ASSET') {
        const isBaseToken =
          !this.web3.tokenMetadata[this.activeToken] ||
          this.web3.tokenMetadata[this.activeToken].symbol ===
            this.config.baseToken.symbol;
        const buyerContract = isBaseToken
          ? SingleAssetBuyerEther
          : SingleAssetBuyerToken;
        const contract = new Contract(
          buyerContract.networks[this.config.chainId].address,
          buyerContract['abi'],
          getInstance().web3?.getSigner()
        );

        const isSmart = this.bPool.isCrp();

        const poolTokensFormatted = this.poolTokens
          ? bnum(this.poolTokens).div('1e18')
          : 0;

        const tokenInAddress = this.activeToken;
        if (!this.amounts[tokenInAddress]) {
          return undefined;
        }

        const amount = this.amounts[tokenInAddress];

        const amountWei = `0x${toWei(amount).toString(16)}`;
        try {
          const underlyingToken = await contract.chooseUnderlyingToken(
            poolAddress,
            isSmart
          );

          const minPoolAmountOut = isBaseToken
            ? await contract.calcMinPoolAmountOut(
                poolAddress,
                isSmart,
                underlyingToken,
                amountWei
              )
            : await contract.calcMinPoolAmountOut(
                poolAddress,
                isSmart,
                underlyingToken,
                this.activeToken,
                amountWei
              );

          const deadline = blockNumberToTimestamp(
            Date.now(),
            this.web3.blockNumber + 1,
            this.bPool.metadata.endBlock
          );

          const tx = isBaseToken
            ? await contract.joinPool(
                poolAddress,
                isSmart,
                underlyingToken,
                minPoolAmountOut,
                `0x${bnum(deadline).toString(16)}`,
                {
                  from: this.web3.account,
                  value: amountWei
                }
              )
            : await contract.joinPool(
                poolAddress,
                isSmart,
                underlyingToken,
                minPoolAmountOut,
                `0x${bnum(deadline).toString(16)}`,
                this.activeToken,
                amountWei
              );

          console.log(tx);
          const title = `joinPool`;
          store.commit('watchTransaction', { ...tx, title });

          const receipt = await provider.waitForTransaction(tx.hash, 1);
          store.commit('confirmTransaction', receipt);

          await store.dispatch('getBalances');

          console.log(
            `${poolTokensFormatted} ${this.pool.symbol} was purchased for ${
              this.amounts[this.activeToken]
            } ${this.web3.tokenMetadata[this.activeToken].symbol}.`
          );
        } catch (err) {
          console.log(err.message);
          console.log(
            `${poolTokensFormatted} ${this.pool.symbol} wasn't purchased for ${
              this.amounts[this.activeToken]
            } ${this.web3.tokenMetadata[this.activeToken].symbol}.`
          );
        }
      } else {
        const buyerContract = MultiAssetBuyerEther;
        const contract = new Contract(
          buyerContract.networks[this.config.chainId].address,
          buyerContract['abi'],
          getInstance().web3?.getSigner()
        );

        const isSmart = this.bPool.isCrp();

        const poolTokensFormatted = this.poolTokens
          ? bnum(this.poolTokens).div('1e18')
          : 0;

        const tokenInAddress = this.activeToken;
        if (!this.amounts[tokenInAddress]) {
          return undefined;
        }

        const amount = this.amounts[tokenInAddress];

        const amountWei = `0x${toWei(amount).toString(16)}`;
        try {
          const deadline = blockNumberToTimestamp(
            Date.now(),
            this.web3.blockNumber + 1,
            this.bPool.metadata.endBlock
          );

          const tx = await contract.joinPool(
            poolAddress,
            isSmart,
            `0x${bnum(deadline).toString(16)}`,
            {
              from: this.web3.account,
              value: amountWei
            }
          );

          console.log(tx);
          const title = `joinPool`;
          store.commit('watchTransaction', { ...tx, title });

          const receipt = await provider.waitForTransaction(tx.hash, 1);
          store.commit('confirmTransaction', receipt);

          await store.dispatch('getBalances');

          console.log(
            `${poolTokensFormatted} ${this.pool.symbol} was purchased for ${
              this.amounts[this.activeToken]
            } ${this.web3.tokenMetadata[this.activeToken].symbol}.`
          );
        } catch (err) {
          console.log(err.message);
          console.log(
            `${poolTokensFormatted} ${this.pool.symbol} wasn't purchased for ${
              this.amounts[this.activeToken]
            } ${this.web3.tokenMetadata[this.activeToken].symbol}.`
          );
        }
      }
      this.$emit('close');
      this.$emit('reload');
      this.loading = false;
    },
    isInputValid(token) {
      const tokenAddress = token.checksum;
      if (!this.isMultiAsset && this.activeToken !== tokenAddress) {
        return true;
      }
      const amount = this.amounts[tokenAddress];
      if (!amount || isNaN(amount)) {
        return false;
      }
      const amountNumber = denormalizeBalance(amount, token.decimals);
      const balance = this.web3.balances[tokenAddress];
      return amountNumber.lte(balance);
    },
    formatBalance(balanceString, tokenDecimals) {
      return normalizeBalance(balanceString, tokenDecimals);
    },
    async canAddLiquidity() {
      // Can always add liquidity to a shared pool
      // Can add liquidity to a smart pool unless there is a whitelist (and this address isn't on it)
      if (
        this.bPool.metadata.crp &&
        this.bPool.metadata.rights.canWhitelistLPs
      ) {
        // Need to check if this address is on the LP whitelist
        return await canProvideLiquidity(
          this.bPool.metadata.controller,
          this.web3.dsProxyAddress
        );
      }

      return true;
    }
  }
};
</script>

<style scoped>
.asset {
  opacity: 0.6;
}

.asset.active {
  opacity: 1;
}
</style>
