import styles from '../styles/components/WalletMenu.module.css'

function WalletMenu({ close }) {
    return (
        <div className={styles.menu}>
            {close ? <button className={styles.menu_close} onClick={() => { close() }} >
                <svg alt="close icon" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
                : null}
            <p className={styles.menu_title}>You need a Starknet wallet</p>
            <p className={styles.menu_text}>
                Eykar is a decentralized game built on StarkNet.
                In order to play, your browser needs to manage a StarkNet wallet that will allow you to sign transactions.
            </p>
            <a className={styles.warning} href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb" target="_blank" rel="noreferrer" >
                <svg className={styles.warning_icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                <p className={styles.warning_text}>Install Argent X Wallet on Chrome</p>
            </a>
        </div>
    );

}
export default WalletMenu;
