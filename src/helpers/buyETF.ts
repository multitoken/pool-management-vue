import store from '@/store';
import chainParams from './chainParams.json';

export function isBSCNetwork() {
  return (
    `0x${store.getters.getConfig().chainId?.toString(16)}` ==
    chainParams['bsc'].chainId
  );
}

export function getExchangeLink(LPTokenAddress, wethAddress) {
  let exchangeLink = `${
    store.getters.getConfig().exchangeUrl
  }?outputCurrency=${LPTokenAddress}`;
  if (!isBSCNetwork()) {
    exchangeLink = `${
      store.getters.getConfig().exchangeUrl
    }/${wethAddress}/${LPTokenAddress}`;
  }
  return exchangeLink;
}
