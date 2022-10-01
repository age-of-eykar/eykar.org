import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x01742bada34b0a17dfa019a84073e4a275fc9dd6e3d7899adf8507970feb31c9',
  })
}