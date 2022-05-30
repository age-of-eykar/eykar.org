import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x01f1ba6c425e5c01968f05b63bc811e28fed1a917ab9bec11a8f977f202affea',
  })
}