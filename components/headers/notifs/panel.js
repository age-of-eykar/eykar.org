import styles from '../../../styles/components/notifs/Panel.module.css'
import Notif from './notif';

export default function Panel() {
    return (
        <div className={styles.box}>
            <Notif />
            <Notif />
            <Notif />
        </div>
    );

}
