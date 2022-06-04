import gameStyles from '../../../styles/Game.module.css'
import styles from '../../../styles/components/convoy/Convoys.module.css'
import { toFelt } from '../../../utils/felt'
import { useEykarContract } from '../../../hooks/eykar'
import { useStarknetCall } from '@starknet-react/core'
import { useState, useEffect } from "react";
import ConvoysList from "./content/convoys";
import Conquer from "./content/conquer";

export default function ViewConvoys({ x, y, toggle, selectedConvoy, setSelectedConvoy }) {
    const { contract } = useEykarContract()
    const { data } = useStarknetCall({ contract: contract, method: 'get_convoys', args: [toFelt(x), toFelt(y)] })
    const [convoys, setConvoys] = useState(false);
    const [conquering, setConquering] = useState(false)

    useEffect(() => {
        setConvoys(false);
        setConquering(false);
    }, [x, y])

    useEffect(() => {
        setConvoys(data ? data.convoys_id.map((bn) => bn.toNumber()) : false)
    }, [data])

    return (
        <div className={gameStyles.box}>
            <div className={styles.header}>
                <svg className={styles.close} onClick={toggle} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </div>
            {
                conquering ? <Conquer convoyId={conquering} x={x} y={y} setConquering={setConquering} />
                    : <ConvoysList x={x} y={y} convoys={convoys} setConquering={setConquering} selectedConvoy={selectedConvoy} setSelectedConvoy={setSelectedConvoy} />
            }


        </div>
    );
}