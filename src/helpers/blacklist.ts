import { Contract } from '@ethersproject/contracts';
import provider from '@/helpers/provider';
import abi from '@/helpers/abi';

export async function getBlackList(address?) {
  const blackListContract = new Contract(
    address,
    abi['BlackList'],
    provider
  );

  return await blackListContract.getAllInBlackList();
}
