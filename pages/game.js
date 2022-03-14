import styles from '../styles/Game.module.css'
import { useEffect } from "react";
import { useStarknet, useStarknetCall } from '@starknet-react/core'
import { Spinner } from "../components/spinner"
import MapCanvas from "../components/map/canvas"
import WalletMenu from '../components/walletmenu'
import Tutorial from "../components/tutorial"
import { useEykarContract } from '../hooks/eykar'

export default function Game() {
    const { account, hasStarknet, connectBrowserWallet, error } = useStarknet()
    const { contract } = useEykarContract()
    const { data, loading } = useStarknetCall({ contract: contract, method: 'get_player_colonies', args: { player: account } })
    let page = undefined;

    useEffect(() => {
        if (!hasStarknet)
            return;
        if (!account) {
            connectBrowserWallet()
            return;
        }
        if (!contract || loading)
            return;
        if (data) {
            if (parseInt(data.colonies_len, 16) > 0) {
                page = 'colonies'
            } else
                page = 'tutorial'
        }
    }, [hasStarknet, account, data, loading])

    let component;
    if (page === undefined)
        component = hasStarknet
            ? <Spinner color={"white"} className={styles.loading} />
            : <WalletMenu />;
    else if (page === 'tutorial')
        component = <Tutorial />;
    else if (page === 'colonies')
        component = undefined;

    return (
        <div className={styles.screen}>
            <div className={styles.interactive}>
                <MapCanvas setClickedPlotCallback={() => { }} />
                <div className={[styles.overlay, styles.fadeIn].join(" ")}>
                    {component}
                </div>
            </div>
        </div>
    );
}

