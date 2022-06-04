import '../styles/globals.css'
import { StarknetProvider, InjectedConnector } from '@starknet-react/core'

function MyApp({ Component, pageProps }) {
  return <StarknetProvider connectors={[new InjectedConnector()]}>
    <Component {...pageProps} />
  </StarknetProvider>
}

export default MyApp
