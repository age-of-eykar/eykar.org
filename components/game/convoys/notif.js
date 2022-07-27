import styles from '../../../styles/components/convoy/Notification.module.css'
import { setConquerMode } from "../../../utils/models/game"

export default function ConvoyNotif({ convoyId, setConvoyId }) {

    return (
        <div onClick={() => {
            setConvoyId(false)
            setConquerMode(false)
        }
        } className={styles.box}>
            <p className={styles.box_text}>convoy {convoyId} is selected</p>
            <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z" clipRule="evenodd"></path></svg>
        </div>
    );
}