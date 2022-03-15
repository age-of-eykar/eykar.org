import styles from '../styles/Game.module.css'
import { useState, useEffect } from "react";
import { useStarknet, useStarknetCall, InjectedConnector } from '@starknet-react/core'
import { Spinner } from "../components/spinner"
import MapCanvas from "../components/map/canvas"
import WalletMenu from '../components/walletmenu'
import Tutorial from "../components/game/tutorial"
import Mint from "../components/game/mint"
import { useEykarContract } from '../hooks/eykar'

export default function Game() {
    const { account, connect } = useStarknet()
    const { contract } = useEykarContract()
    const { data, loading } = useStarknetCall({ contract: contract, method: 'get_player_colonies', args: account ? [account] : undefined })
    const [page, setPage] = useState(undefined);

    useEffect(() => {
        if (!InjectedConnector.ready)
            return;
        if (!account) {
            connect(new InjectedConnector())
            return;
        }
        if (!contract || loading)
            return;
        if (data && page === undefined) {
            if (data.colonies_len > 0) {
                setPage('colonies')
            } else
                setPage('tutorial')
        }
    }, [account, data, loading])

    let component;
    if (page === undefined)
        component = <Spinner color={"white"} className={styles.loading} />;
    else if (page === 'tutorial')
        component = <Tutorial setPage={setPage} />;
    else if (page === 'mint')
        component = <Mint setPage={setPage} />;
    else if (page === 'colonies')
        component = undefined;

    return (
        <div className={styles.screen}>
            <div className={styles.interactive}>
                <MapCanvas setClickedPlotCallback={() => { }} />
                <div className={[styles.overlay, styles.fadeIn].join(" ")}>
                    {InjectedConnector.ready
                        ? component
                        : <WalletMenu />}
                </div>
            </div>
        </div>
    );
}

