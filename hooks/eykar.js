import { useContract } from '@starknet-react/core'

import EykarAbi from '../abi/eykar.json'

export function useEykarContract() {
  return useContract({
    abi: EykarAbi,
    address: '0x019516515715d58bf46dde75aa7184aee9c30abb4ebe9596ff57e2ac30de8599',
  })
}