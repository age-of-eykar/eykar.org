import styles from '../../styles/Game.module.css'
import { useState, useEffect } from "react";
import { useStarknetInvoke } from '@starknet-react/core'
import ShortTextInput from '../input'
import { useEykarContract } from '../../hooks/eykar'
import { Spinner } from "../spinner"
import { useStarknetTransactionManager } from '@starknet-react/core'
import { stringToFelt } from '../../utils/felt';
import { useRouter } from 'next/router'

export default function Mint() {
    const [name, setName] = useState("")
    const { contract } = useEykarContract()
    const { data, loading, invoke } = useStarknetInvoke({ contract: contract, method: 'mint' })
    const { transactions } = useStarknetTransactionManager()
    const [minted, setMinted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        for (const transaction of transactions)
            if (transaction.transactionHash === data) {
                if (transaction.status === 'ACCEPTED_ON_L2'
                    || transaction.status === 'ACCEPTED_ON_L1')
                    setMinted(true);
            }
    }, [data, transactions])

    return (
        <div className={styles.box}>

            {!data && !loading
                ? <>
                    <h1 className={styles.title}>Approaching Eykar</h1>
                    <p className={styles.text}>
                        Your ship is approaching the ground of the planet. You are going to start a new colony.
                    </p>

                    <ShortTextInput content={name} setContent={setName} />

                    <div className={styles.box_footer}>

                        <div className={[styles.footer_element, styles.alert].join(" ")}>

                            <svg className={styles.alert_icon} fill="currentColor" viewBox="0 0 341 341" xmlns="http://www.w3.org/2000/svg" >
                                <path fillRule="evenodd" stroke="none" d="M 170.653976 16 C 255.897568 16.000031 325 85.103088 325 170.345993 C 325 255.588409 255.897568 324.692017 170.653976 324.692017 C 85.411438 324.692017 16.308445 255.588409 16.30846 170.345993 C 16.308474 85.102982 85.41156 16 170.653976 16 Z M 182.425262 74.288025 C 175.820953 67.830231 165.486984 67.830231 158.883881 74.289001 C 142.331467 90.479523 111.902878 122.600861 91.321205 158.281693 C 87.008919 165.757813 87.008919 174.934174 91.321205 182.410324 C 111.902878 218.09079 142.331467 250.21283 158.883881 266.403503 C 165.486984 272.861908 175.820953 272.861908 182.425262 266.403503 C 198.978867 250.21283 229.410355 218.089569 249.989014 182.407898 C 254.29985 174.932968 254.29985 165.759033 249.989014 158.284103 C 229.410355 122.601837 198.978867 90.479523 182.425262 74.288025 Z M 133.696304 194.768845 C 151.687485 217.87854 170.653976 231.726288 170.653976 231.726288 C 170.653976 231.726288 189.643356 217.867706 207.64035 194.74231 C 191.681213 201.420212 175.232498 207.799026 170.63588 207.799026 C 166.045288 207.799026 149.635178 201.437073 133.696304 194.768845 Z M 219.430939 162.94342 C 199.166977 129.775192 170.653976 108.965118 170.653976 108.965118 C 170.653976 108.965118 142.145782 129.780731 121.876762 162.956696 C 138.571701 169.729813 164.267899 179.714081 170.639496 179.714081 C 177.01593 179.714081 202.737427 169.716553 219.430939 162.94342 Z" />
                            </svg>

                            <p className={[styles.button_text, styles.footer_elt_base].join(" ")}>
                                4
                            </p>

                            <p className={[styles.button_text, styles.footer_elt_hidden].join(" ")}>
                                0.004 ETH
                            </p>

                        </div>

                        {name ? <button className={[styles.footer_element, styles.button].join(" ")} onClick={() => {
                            invoke({
                                args: [stringToFelt(name)],
                                metadata: {
                                    type: 'mint',
                                    name: name
                                }
                            })
                        }}>
                            <svg className={styles.button_icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <p className={styles.button_text}>Establish a settler camp</p>
                        </button>
                            : null}

                    </div>
                </> : null}

            {loading || (!minted && data)
                ? <>
                    <h1 className={styles.title}>Iminant landing</h1>
                    <p className={styles.text}>
                        Through the window of your cockpit you can see the unblemished landscape of Eykar. Forests the size of continents, mountains higher than you ever imagined and oceans as far as the eye can see.
                    </p>

                    <div className={styles.box_footer}>

                        {loading ?
                            <div className={[styles.footer_element, styles.loading_bg].join(" ")} >
                                <Spinner color={"#c5a373"} className={styles.loading_icon} />
                                <p className={styles.loading_text}>signing</p>
                            </div>
                            :
                            <div className={[styles.footer_element, styles.loading_fg].join(" ")}>
                                <div className={[styles.subfooter_element, styles.footer_elt_hidden].join(" ")}>
                                    <svg className={styles.alert_icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
                                    <a className={styles.button_text} href={"https://goerli.voyager.online/tx/" + data} target="_blank" rel="noreferrer">show on voyager</a>
                                </div>

                                <div className={[styles.subfooter_element, styles.footer_elt_base].join(" ")}>
                                    <Spinner color={"#7fd6aa"} className={styles.loading_icon} />
                                    <p className={styles.loading_text}>minting</p></div>
                            </div>
                        }
                    </div>
                </> : null}

            {
                minted ?
                    <>
                        <h1 className={styles.title}>Successful landing!</h1>
                        <p className={styles.text}>
                            In spite of your few centuries spent in hibernation you have not lost your touch, congratulations: this is a successful landing! It&apos;s time to settle down on this unknown planet.
                        </p>

                        <div className={styles.box_footer}>
                            <button className={[styles.footer_element, styles.button].join(" ")} onClick={() =>
                                router.push("/game/empire")
                            }>
                                <svg className={styles.button_icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                <p className={styles.button_text}>show</p>
                            </button>
                        </div>
                    </>
                    : null
            }

        </div>
    );
}

