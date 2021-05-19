import mainnet from '@/config/mainnet';
import kovan from '@/config/kovan';
import bsc from '@/config/bsc';
import { Config } from '@/config/types';

const configs = { mainnet, kovan, bsc };
const config: Config = configs[process.env.VUE_APP_NETWORK || ''];

export default config;
