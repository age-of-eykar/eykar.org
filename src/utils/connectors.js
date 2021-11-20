import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'

const POLLING_INTERVAL = 12000
const RPC_URLS = {
  //25: 'https://evm-cronos.crypto.org',
  1337: 'http://127.0.0.1:7545/',
}

export const injected = new InjectedConnector({ supportedChainIds: [1337] })

export const network = new NetworkConnector({
  urls: { 1337: RPC_URLS[1337] },
  defaultChainId: 1337
})

export const ledger = new LedgerConnector({
  chainId: 1337,
  url: RPC_URLS[1337], pollingInterval:
    POLLING_INTERVAL
})
