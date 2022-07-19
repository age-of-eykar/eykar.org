import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x07000da21052c2ea6db40b56469f1f730a22cf9ef9c7251b752d0473373da3e7',
  })
}