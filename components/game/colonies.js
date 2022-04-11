import styles from '../../styles/Game.module.css'
import Colony from "./colony";

export default function Colonies({ setPage, colonyIds }) {

    return (
        <div className={styles.box}>

            <h1 className={styles.title}>Your colonies</h1>

            {colonyIds.map(colonyId => (
                <Colony id={colonyId} />
            ))}

        </div>
    );
}

