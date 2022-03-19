import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x0513ed107c2228d857198f20c98b85915b562cf5ec9add046c8538c9be60b7b4',
  })
}