import styles from '../../../styles/Game.module.css'
import coloniesStyles from '../../../styles/components/Colonies.module.css'
import Colony from "./colony";

export default function Colonies({ colonyIds }) {

    return (
        <div className={styles.box}>
            <h1 className={styles.bigtitle}>Your colonies</h1>
            <div className={coloniesStyles.colonies}>
                {colonyIds.map(colonyId => (
                    <Colony key={colonyId} id={colonyId} />
                ))}
            </div>
        </div>
    );
}

