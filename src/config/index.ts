import mainnet from '@/config/mainnet';
import kovan from '@/config/kovan';
import bsc from '@/config/bsc';
import { Config } from '@/config/types';

const config: Record<string, Config> = {
  '1': mainnet,
  '42': kovan,
  '56': bsc
};

export default config;
