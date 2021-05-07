export interface ConfigToken {
  address: string;
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  precision: number;
  hasIcon: boolean;
  logoUrl: string;
  color: string;
}

export interface Config {
  network: string;
  chainId: number;
  isTestNet: boolean;
  defaultPrecision: number;
  gas: {
    bufferError: number;
    bufferWarning: number;
  };
  baseToken: {
    name: string;
    symbol: string;
    wrappedSymbol: string;
  };
  rpcUrl: string;
  wsUrl: string;
  subgraphUrl: string;
  explorer: string;
  exchangeUrl: string;
  addresses: {
    bFactory: string;
    bActions: string;
    dsProxyRegistry: string;
    proxy: string;
    crpFactory: string;
    wrapped: string;
    multicall: string;
  };
  connectors: any;
  excludedPoolsIds: string[];
  untrusted: string[];
  tokens: { [key: string]: ConfigToken };
  env: string;
  urls: {
    mainnet: string;
    kovan: string;
    bsc: string;
  };
}
