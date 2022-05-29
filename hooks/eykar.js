import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x0673c3bbb7037cc37ef0ce25998abcdfa0546588d96ab1819dfb08c79ee9a21b',
  })
}