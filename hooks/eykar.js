import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x05de07aa0ee15be29704edbfa51ad680d91223c2d8edc2ff02e617b46edc998c',
  })
}