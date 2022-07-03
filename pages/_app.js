import '../styles/globals.css'
import { StarknetProvider, getInstalledInjectedConnectors } from '@starknet-react/core'

function MyApp({ Component, pageProps }) {
  const connectors = getInstalledInjectedConnectors()
  return <StarknetProvider connectors={connectors}>
    <Component {...pageProps} />
  </StarknetProvider>
}

export default MyApp
