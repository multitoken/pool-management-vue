import config from '@/config';
import chainParams from './chainParams.json';
import { getInstance } from '@snapshot-labs/lock/plugins/vue';

export function isBSCNetwork() {
  return `0x${config.chainId?.toString(16)}` == chainParams['bsc'].chainId;
}

export function getExchangeLink(LPTokenAddress, wethAddress) {
  let exchangeLink = `${config.exchangeUrl}?outputCurrency=${LPTokenAddress}`;
  if (!isBSCNetwork()) {
    exchangeLink = `${config.exchangeUrl}/${wethAddress}/${LPTokenAddress}`;
  }
  return exchangeLink;
}

let auth;

export async function addToWallet(address, symbol) {
  auth = getInstance();
  // TODO: Set decimals dynamically
  auth.web3.send('wallet_watchAsset', {
    type: 'ERC20',
    options: {
      address: address, // The address of the token contract
      symbol: symbol, // A ticker symbol or shorthand, up to 5 characters
      decimals: 18 // The number of token decimals
    }
  });
}
