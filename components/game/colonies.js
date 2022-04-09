import styles from '../../styles/Game.module.css'

export default function Colonies({ setPage, colonies }) {

    console.log(colonies)
    return (
        <div className={styles.box}>

            <h1 className={styles.title}>Your colonies</h1>
            <p className={styles.text}>
                {colonies.map(id => (
                    <li>
                        {id.toString()}
                    </li>
                ))}
            </p>

        </div>
    );
}

