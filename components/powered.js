import styles from '../styles/components/Powered.module.css'

function Powered() {
    return (
        <div className={styles.setup}>
            <a className={styles.layout} href="https://starknet.io/" target="_blank" rel="noreferrer" >
                <img className={styles.logo} layout='fill' src="/starknet_logo.svg" alt="StarkNet Logo" />
                <span className={styles.text} >Powered by StarkNet</span>
            </a>
        </div>
    );

}
export default Powered;
