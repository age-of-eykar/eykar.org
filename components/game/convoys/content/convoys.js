import gameStyles from '../../../../styles/Game.module.css'
import styles from '../../../../styles/components/convoy/Convoys.module.css'
import ConvoyItem from "../item"

export default function ConvoysList({ x, y, convoys, setConquering, selectedConvoy, setSelectedConvoy }) {

    return (
        <>
            <h1 className={gameStyles.bigtitle}>Convoys in ({x}, {y})</h1>
            {convoys === false
                ? <p className={styles.text}>
                    Loading convoys...
                </p>
                : convoys.length === 0
                    ? <p className={styles.text}>
                        There is no convoys here
                    </p>
                    : convoys.map((convoyId) =>
                        <ConvoyItem key={convoyId} convoyId={convoyId} setConquering={setConquering} selectedConvoy={selectedConvoy} setSelectedConvoy={setSelectedConvoy} loc={[x, y]} />
                    )
            }
        </>
    );
}