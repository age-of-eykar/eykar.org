import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x04f7fe122a8cbf07b501a4e43e18760dd14617b390090da43104dc78e57e53c0',
  })
}