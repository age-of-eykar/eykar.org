import styles from '../../../styles/components/notifs/Notif.module.css'
import { Accepted } from './status';

export default function Notif({transaction}) {
    return (
        <div className={styles.box}>
            <div >
                <div className={styles.header}>
                    <Accepted />
                    <h1 className={styles.title}>Moving convoy</h1>
                </div>
                <p className={styles.text}>Convoy of 10 humans from (-4, 3) to (5, 6). Travel time estimated to 5 hours.</p>
            </div>
            <div className={styles.side}>
                <svg className={styles.close} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            
                <svg className={styles.link} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
            </div>
        </div>
    );

}
