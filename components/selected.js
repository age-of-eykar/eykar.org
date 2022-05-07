import styles from '../styles/components/Selected.module.css'
import Image from 'next/image'

function Selected({ x, y }) {
    return (
        <div className={styles.box}>
            <Image className={styles.img} src="/illustrations/forest.webp" width={280} height={180} alt="A settler camp" />
            <h1 className={styles.title}>Forest</h1>
            <ul>
                <li className={styles.item}><span className={styles.item_title}>Owner</span>: <span className={styles.fg_text}>Wilderness</span></li>
                <li className={styles.item}><span className={styles.item_title}>Location</span>: <span className={styles.bg_text}>(</span><span className={styles.fg_text}>{x}</span><span className={styles.bg_text}>,</span> <span className={styles.fg_text}>{y}</span><span className={styles.bg_text}>)</span></li>
                <li className={styles.item}><span className={styles.item_title}>Temperature</span>: <span className={styles.fg_text}>12</span><span className={styles.bg_text}>ºC</span></li>
                <li className={styles.item}><span className={styles.item_title}>Altitude</span>: <span className={styles.fg_text}>1200</span><span className={styles.bg_text}>m</span></li>
            </ul>
            <div className={styles.buttons}>
                <div className={styles.button}>Send troops</div>
                <div className={styles.button}>Send resources</div>
            </div>
        </div>
    );

}
export default Selected;
