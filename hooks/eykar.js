import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x07048661daa0f35774900124f683717fa520900a58fdd354ff1f1fe4153b29d2',
  })
}