import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x07dd70c126e119f48345b7e8289146462252c0de19b81fca8352562219fb39a2',
  })
}