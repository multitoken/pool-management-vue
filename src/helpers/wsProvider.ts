import { WebSocketProvider } from '@ethersproject/providers';
import configs from '@/config';

const providers = {};

export default function getWSProvider(network: string) {
  const url: string = configs[network].wsUrl;
  if (!providers[network]) providers[network] = new WebSocketProvider(url);
  return providers[network];
}
