import "./home.css"
import { Link } from "react-router-dom";
import logo from "../../img/logo.svg";
import close from "../../img/close.svg";
import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useEagerConnect, useInactiveListener } from '../../utils/web3hooks'

import { injected, network, ledger } from '../../utils/connectors'
import { Spinner } from '../../components/spinner'

const connectorsByName = {
  ['injected']: injected,
  ['network']: network,
  ['ledger']: ledger
}

function App() {

  const context = useWeb3React();
  const { connector, library, chainId, account, activate, deactivate, active, error } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  const [connectMenuToggled, setConnectMenuToggled] = React.useState(false);
  const [connected, setConnected] = React.useState(false);

  return (
    <div className="default_background">
      {
        connectMenuToggled && !connected ?
          <div className="selectmenu">
            <a className="home selectmenu_close" onClick={() => { setConnectMenuToggled(false) }} >
              <svg className="close_icon" alt="close icon" class="home selectmenu_close_svg" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </a>
            <p className="home selectmenu_title">Connect to a wallet</p>
            <a className="home warning" href="https://cronos.crypto.org/docs/getting-started/metamask.html#connecting-to-the-cronos-mainnet-beta" target="https://cronos.crypto.org/docs/getting-started/metamask.html#connecting-to-the-cronos-mainnet-beta">
            <svg className="home warning_icon v1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="home warning_text">Using MetaMask with Cronos</p>
            <svg className="home warning_icon v2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>

            {Object.keys(connectorsByName).map(name => {

              const currentConnector = connectorsByName[name]
              const activating = currentConnector === activatingConnector
              if (currentConnector === connector) {
                setConnectMenuToggled(false);
                setConnected(true);
              }
              const disabled = !triedEager || !!activatingConnector || connected || !!error

              return (
                <button
                  className="home selectmenu_button"
                  style={{ borderColor: activating ? 'orange' : '#3f3f3f', cursor: disabled ? 'unset' : 'pointer' }}
                  disabled={disabled}
                  key={name}
                  onClick={() => {
                    setActivatingConnector(currentConnector)
                    activate(connectorsByName[name])
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'black',
                      margin: '0 0 0 1rem'
                    }}
                  >
                    {activating && <Spinner color={'black'} style={{ height: '25%', marginLeft: '-1rem' }} />}
                  </div>
                  {name}
                </button>
              )
            })}
          </div>
          : null
      }
      <nav className="home">
        <img className="home logo" src={logo} alt="Eykar Logo" />
        <button className={"home button highlighted" + (connectMenuToggled ? " toggled" : "")} onClick={() => setConnectMenuToggled(!connectMenuToggled)} >
          <div className="home button_div"></div>
          <svg className="home icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="home button_text">
            {connected ? "Connected" : "Connect to a wallet"}
          </p>
        </button>
        <Link className="home button normal" to="/discover" >
          <div className="home button_div"></div>
          <svg className="home icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="home button_text">
            Discover the project
          </p>
        </Link>
        <Link className="home button normal" to="/explore">
          <div className="home button_div"></div>
          <svg className="home icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="home button_text">
            Explore the map
          </p>
        </Link>
      </nav>


    </div>
  );

}
export default App;
