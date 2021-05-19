import { Contract } from '@ethersproject/contracts';
import getProvider from '@/helpers/provider';
import abi from '@/helpers/abi';
import store from '@/store';

export async function canProvideLiquidity(crpAddress, walletAddress) {
  const provider = getProvider(store.getters.getConfig().chainId);
  const crpContract = new Contract(
    crpAddress,
    abi['ConfigurableRightsPool'],
    provider
  );
  return await crpContract.canProvideLiquidity(walletAddress);
}
