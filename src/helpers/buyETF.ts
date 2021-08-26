import config from '@/config';
import chainParams from './chainParams.json';

export function isBSCNetwork() {
  return `0x${config.chainId?.toString(16)}` == chainParams['bsc'].chainId;
}

export function isMaticNetwork() {
  return `0x${config.chainId?.toString(16)}` == chainParams['matic'].chainId;
}

export function getExchangeLink(LPTokenAddress, wethAddress) {
  let exchangeLink = `${config.exchangeUrl}/${wethAddress}/${LPTokenAddress}`;
  
  if (isBSCNetwork()) {
    exchangeLink = `${config.exchangeUrl}?outputCurrency=${LPTokenAddress}`;
  }

  if (isMaticNetwork()) {
    exchangeLink = `${config.exchangeUrl}?outputCurrency=${LPTokenAddress}`;
  }

  return exchangeLink;
}
