import styles from '../styles/Game.module.css'
import { useStarknet } from '@starknet-react/core'
import MapCanvas from "../components/map/canvas"
import { Spinner } from "../components/spinner"
import { useRouter } from 'next/router'
import { useEffect } from "react";

export default function Game() {
    const { account, hasStarknet, connectBrowserWallet, library, error } = useStarknet()
    const router = useRouter()
    useEffect(() => {
        if (!account) {
            connectBrowserWallet()
            return;
        }
        
    }, [account])
    return (
        <div className={styles.screen}>
            <div className={styles.interactive}>
                <MapCanvas setClickedPlotCallback={() => { }} />
                <div className={[styles.overlay, styles.fadeIn].join(" ")}>
                    <Spinner color={"white"} className={styles.loading} />
                </div>
            </div>
        </div>
    );
}

