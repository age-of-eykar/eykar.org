import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x03d628b219eba75ab5400f656c7b59ec7c3fcf1073bf8a471257fc6463b8edca',
  })
}