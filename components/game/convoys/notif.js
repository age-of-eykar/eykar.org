import styles from '../../../styles/components/convoy/Notification.module.css'

export default function ConvoyNotif({convoyId}) {
    
    return (
        <div className={styles.box}>
         convoy {convoyId} is selected
        </div>
    );
}