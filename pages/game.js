import styles from '../styles/Game.module.css'
import { useState, useEffect } from "react";
import { useStarknet, useStarknetCall, InjectedConnector } from '@starknet-react/core'
import { Spinner } from "../components/spinner"
import { speedControler, wheelControler, MapCanvas } from "../components/map/canvas"
import WalletMenu from '../components/walletmenu'
import Tutorial from "../components/game/tutorial"
import Colonies from "../components/game/colony/colonies"
import Mint from "../components/game/mint"
import { useEykarContract } from '../hooks/eykar'
import Header from "../components/headers/game";

export default function Game() {
    const { account, connect } = useStarknet()
    const { contract } = useEykarContract()
    const { data, loading } = useStarknetCall({ contract: contract, method: 'get_player_colonies', args: account ? [account] : undefined })
    const [page, setPage] = useState(undefined);
    const [hasControl, setHasControl] = useState(true);

    useEffect(() => {
        if (hasControl) {
            speedControler.takeControl();
            wheelControler.takeControl();
        } else {
            speedControler.releaseControl();
            wheelControler.releaseControl();
        }
    }, [hasControl])

    useEffect(() => {
        if (!InjectedConnector.ready())
            return;
        if (!account) {
            connect(new InjectedConnector())
            return;
        }
        if (!contract || loading)
            return;
        if (data && page === undefined) {
            if (data.colonies.length > 0) {
                setPage('colonies')
            } else
                setPage('tutorial')
        }
    }, [account, data, loading, page, contract, connect])

    let component;
    if (page === undefined)
        component = <Spinner color={"white"} className={styles.loading} />;
    else if (page === 'tutorial')
        component = <Tutorial setPage={setPage} />;
    else if (page === 'mint')
        component = <Mint setPage={setPage} />;
    else if (page === 'colonies')
        component = <Colonies setPage={setPage} colonyIds={data.colonies} />;

    return (
        <div className={styles.screen}>
            <div className={styles.interactive}>
                <Header />
                <MapCanvas onPlotClick={(x, y) => { }} />
                <div className={[styles.overlay, styles.fadeIn].join(" ")}>
                    {InjectedConnector.ready()
                        ? component
                        : <WalletMenu />}
                </div>
            </div>
        </div>
    );
}

