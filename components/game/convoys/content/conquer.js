import styles from '../../../../styles/Game.module.css'
import ShortTextInput from '../../../input'
import { useEykarContract } from '../../../../hooks/eykar'
import { useStarknetInvoke } from '@starknet-react/core'
import { stringToFelt, toFelt } from '../../../../utils/felt';
import { useState, useEffect } from "react";

export default function Conquer({ convoyId, x, y, setConquering }) {

    const { contract } = useEykarContract()
    const [name, setName] = useState("")
    const { data, invoke } = useStarknetInvoke({ contract: contract, method: 'conquer' })

    useEffect(() => {
        if (data)
            setConquering(false)
    }, [data])

    return (
        < >
            <h1 className={styles.bigtitle}>Conquering ({x}, {y})</h1>
            <p className={styles.text}>
                This territory is remote and your troops may have to start a new colony
            </p>
            <ShortTextInput content={name} setContent={setName} />

            <div className={styles.box_footer}>
                <svg onClick={() => setConquering(false)} className={[styles.footer_element, styles.back_icon].join(" ")} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path></svg>

                <button className={[styles.footer_element, styles.button].join(" ")} onClick={() => {
                    invoke({ args: [convoyId, toFelt(x), toFelt(y), stringToFelt(name)] })
                }}>
                    <svg className={styles.button_icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className={styles.button_text}>Send an expedition</p>
                </button>
            </div>
        </>
    );
}
