import { JsonRpcProvider } from '@ethersproject/providers';
import configs from '@/config';

const providers = {};

export default function getProvider(network: string) {
  const url: string = configs[network].rpcUrl;
  if (!providers[network]) providers[network] = new JsonRpcProvider(url);
  return providers[network];
}
