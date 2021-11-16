import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'

const POLLING_INTERVAL = 12000
const RPC_URLS = {
  25: 'https://evm-cronos.crypto.org',
}

export const injected = new InjectedConnector({ supportedChainIds: [25] })

export const network = new NetworkConnector({
  urls: { 25: RPC_URLS[25] },
  defaultChainId: 25
})

export const ledger = new LedgerConnector({ chainId: 25, url: RPC_URLS[25], pollingInterval: POLLING_INTERVAL })
