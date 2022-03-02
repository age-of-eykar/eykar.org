import '../styles/globals.css'
import { StarknetProvider } from '@starknet-react/core'

function MyApp({ Component, pageProps }) {
  return <StarknetProvider><Component {...pageProps} /></StarknetProvider>
}

export default MyApp
