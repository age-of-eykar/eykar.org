import styles from '../../styles/Game.module.css'
import { useRef, useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { useStarknet, useStarknetCall, InjectedConnector } from '@starknet-react/core'
import { Spinner } from "../../components/spinner"
import { speedControler, wheelControler, MapCanvas } from "../../components/map/canvas"
import WalletMenu from '../../components/walletmenu'
import Tutorial from "../../components/game/tutorial"
import Colonies from "../../components/game/colony/colonies"
import Mint from "../../components/game/mint"
import World from "../../components/game/world"
import { useEykarContract } from '../../hooks/eykar'
import Header from "../../components/headers/game";

export default function Game() {
    const { account, connect } = useStarknet()
    const { contract } = useEykarContract()
    const { data, loading } = useStarknetCall({ contract: contract, method: 'get_player_colonies', args: account ? [account] : undefined })
    const router = useRouter()
    const { page } = router.query
    const center = useRef({ x: 0.0, y: 0.0 });

    useEffect(() => {
        if (page === 'empire' || page === 'loading') {
            speedControler.takeControl();
            wheelControler.takeControl();
        }
    }, [page])

    useEffect(() => {
        if (!InjectedConnector.ready())
            return;
        if (!account) {
            connect(new InjectedConnector())
            return;
        }
        if (!contract || loading)
            return;
        if (data && page === "loading") {
            if (data.colonies.length > 0) {
                router.push(`/game/empire`)
            } else
                router.push(`/game/tutorial`)
        }
    }, [account, data, loading, page, contract, connect])

    let component;
    if (page === 'tutorial')
        component = <Tutorial />;
    else if (page === 'mint')
        component = <Mint />;
    else if (page === 'empire')
        component = <Colonies colonyIds={data.colonies} />;
    else if (page === 'world') {
        speedControler.releaseControl();
        wheelControler.releaseControl();
        component = <World center={center} clicked={true} />;
    } else
        component = <Spinner color={"white"} className={styles.loading} />;

    return (
        <div className={styles.screen}>
            <div className={styles.interactive}>
                <Header />
                <MapCanvas center={center} onPlotClick={() => { }} />
                <div className={[styles.overlay, styles.fadeIn].join(" ")}>
                    {InjectedConnector.ready()
                        ? component
                        : <WalletMenu />}
                </div>
            </div>
        </div>
    );
}

