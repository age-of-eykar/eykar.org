import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x01a0c10aaa08298cde708d39b1e189eb324207b0f497104ea6c197cb13bfe25e',
  })
}