import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'

const POLLING_INTERVAL = 12000
const RPC_URLS = {
  //25: 'https://evm-cronos.crypto.org',
  338: 'https://cronos-testnet-3.crypto.org:8545',
}

export const injected = new InjectedConnector({ supportedChainIds: [338] })

export const network = new NetworkConnector({
  urls: { 338: RPC_URLS[338] },
  defaultChainId: 338
})

export const ledger = new LedgerConnector({ chainId: 338, url: RPC_URLS[338], pollingInterval: POLLING_INTERVAL })
