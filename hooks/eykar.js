import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x07b4bbcc1521a35e67533a8df566aa5e3a788b5bf8a90f8c59ad3b5c098c3eef',
  })
}