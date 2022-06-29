import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x06a856a7a56759c7dde6e285d73df6fa4af2b7125e3de44a884fa7302b65ec38',
  })
}