import styles from '../styles/Game.module.css'
import { useRouter } from 'next/router'
import { useEffect } from "react";
import { useStarknet, useStarknetCall } from '@starknet-react/core'
import { Spinner } from "../components/spinner"
import MapCanvas from "../components/map/canvas"
import WalletMenu from '../components/walletmenu'
import { useEykarContract } from '../hooks/eykar'

export default function Game() {
    const { account, hasStarknet, connectBrowserWallet, error } = useStarknet()
    const { contract } = useEykarContract()
    const { data, loading } = useStarknetCall({ contract: contract, method: 'get_player_colonies', args: { player: account } })

    const router = useRouter()
    useEffect(() => {
        if (!hasStarknet)
            return;
        if (!account) {
            connectBrowserWallet()
            return;
        }
        if (!contract || loading)
            return;
        console.log("aloha")
        if (data) {
            if (parseInt(data.colonies_len, 16) > 0) {
                router.push('/mycolonies')
            } else
                router.push('/tutorial')
        }
    }, [hasStarknet, account, data, loading, router])

    return (
        <div className={styles.screen}>
            <div className={styles.interactive}>
                <MapCanvas setClickedPlotCallback={() => { }} />
                <div className={[styles.overlay, styles.fadeIn].join(" ")}>
                    {
                        hasStarknet
                            ? <Spinner color={"white"} className={styles.loading} />
                            : <WalletMenu />
                    }
                </div>
            </div>
        </div>
    );
}

