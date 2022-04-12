
import styles from '../../styles/components/Colony.module.css'

export default function Colonies({}) {

    return (
        <div className={styles.box}>
            <h1 className={styles.bigtitle}>Your colonies</h1>
            <div className={coloniesStyles.colonies}>
                {colonyIds.map(colonyId => (
                    <Colony id={colonyId} />
                ))}
            </div>
        </div>
    );
}

