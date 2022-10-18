import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x06d6c388a5d9c273b9924f0b5c0aa4caf6921c7313663e55ef5937e9f90802c2',
  })
}