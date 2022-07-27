import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x005e9dccdd3bac864d60e5299a86106799396073ffbaa4adb38c53841dac1273',
  })
}