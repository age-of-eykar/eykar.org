import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x07f0054a16722e689feeb4a72537e86e2a062c38c0cfee7ea546d68835557df5',
  })
}