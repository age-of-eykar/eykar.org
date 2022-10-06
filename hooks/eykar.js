import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x001912a213f2273e0cbe7b80a28168db27843f4a1c603c675a00ceada3786b71',
  })
}