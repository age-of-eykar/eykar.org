import styles from '../styles/Game.module.css'
import { useState } from "react";
import { useStarknetInvoke } from '@starknet-react/core'
import TextInput from './input'
import { useEykarContract } from '../hooks/eykar'

export default function Mint() {
    const [name, setName] = useState("")
    const { contract } = useEykarContract()
    const { invoke } = useStarknetInvoke({ contract: contract, method: 'mint_plot_with_new_colony' })

    return (
        <div className={styles.box}>
            <h1 className={styles.title}>Iminant landing</h1>
            <p className={styles.text}>
                Your ship is approaching the ground of the planet. You are going to start a new colony.
            </p>

            <TextInput content={name} setContent={setName} />

            <div className={styles.box_footer}>

                <div className={[styles.footer_element, styles.alert].join(" ")} >
                    <svg className={styles.alert_icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path></svg>
                    <p className={styles.button_text}>4</p>
                </div>

                {name ? <button className={[styles.footer_element, styles.button].join(" ")} onClick={() => {
                    invoke({ args: { name: "0x" + new Buffer.from(name).toString('hex') } })
                }}>
                    <svg className={styles.button_icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className={styles.button_text}>Establish a settler camp</p>
                </button>
                    : null}

            </div>
        </div>

    );
}

