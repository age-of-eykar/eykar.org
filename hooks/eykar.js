import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x01d84e236e0dc1c006ce49c7e443ec144bff502dadb45a2425b055062aa9750c',
  })
}