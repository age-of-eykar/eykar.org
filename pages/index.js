import styles from '../styles/Home.module.css'
import React from 'react'
import Powered from '../components/powered'
import Link from 'next/link'

export default function Home() {

  const [connectMenuToggled, setConnectMenuToggled] = React.useState(false);
  const [connected, setConnected] = React.useState(false);

  return (
    <div className="default_background">
      <Powered />
      {
        connectMenuToggled && !connected ?
          <div className={styles.selectmenu}>
            <button className={styles.selectmenu_close} onClick={() => { setConnectMenuToggled(false) }} >
              <svg alt="close icon" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <p className={styles.selectmenu_title}>Connect to a wallet</p>
            <a className={styles.warning} href="https://cronos.crypto.org/docs/getting-started/metamask.html#connecting-to-the-cronos-mainnet-beta" target="_blank" rel="noreferrer" >
              <svg className={styles.warning_icon_v1} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className={styles.warning_text}>Using MetaMask with Cronos</p>
              <svg className={styles.warning_icon_v2} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          </div>
          : null
      }
      <nav className={styles.nav}>
        <img className={styles.logo} src="/logo.svg" alt="Eykar Logo" />
        {connected ?
          <Link href="/play" passHref >
            <div className={
              [styles.button, styles.play].join(" ")}>
              <div className={styles.button_div}></div>
              <svg className={styles.playicon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className={styles.play_button_text}>

                Play
              </p>
            </div>
          </Link>
          :
          <button className={[styles.button, styles.highlighted, styles.toggled].join(" ")} /*onClick={() => setConnectMenuToggled(!connectMenuToggled)}*/ >
            <div className={styles.button_div}></div>
            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className={styles.button_text}>
              Coming soon
            </p>
          </button>}
        <Link href="/discover" passHref >
          <div className={[styles.button, styles.normal].join(" ")}>
            <div className={styles.button_div}></div>
            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className={styles.button_text}>
              Discover the project
            </p>
          </div>
        </Link>
        <Link href="/explore" passHref >
          <div className={[styles.button, styles.normal].join(" ")} >
            <div className={styles.button_div}></div>
            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className={styles.button_text}>
              Explore the map
            </p>
          </div>
        </Link>
      </nav>

    </div>
  );

}
