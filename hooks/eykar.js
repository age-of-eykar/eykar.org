import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x036e5361579499ccbd1b61f9bec6f964698659e02d9fa578bd1fb4617175f030',
  })
}