import { WebSocketProvider } from '@ethersproject/providers';
import config from '@/config';

const provider = new WebSocketProvider(config.state.config.wsUrl);

export default provider;
