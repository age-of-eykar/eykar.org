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

    const [component, setComponent] = useState(<Spinner color={"white"} className={styles.loading} />);
    const [interactive, setInteractive] = useState(false);
    const [clicked, setClicked] = useState(undefined)

    useEffect(() => {
        if (page === 'world') {
            speedControler.releaseControl();
            wheelControler.releaseControl();
            setInteractive(true);
            setComponent(<World center={center} clicked={clicked} setClicked={setClicked} />);
        } else {
            speedControler.takeControl();
            wheelControler.takeControl();
            setInteractive(false);
            if (page === 'tutorial')
                setComponent(<Tutorial />);
            else if (page === 'mint')
                setComponent(<Mint />);
            else if (page === 'empire')
                setComponent(<Colonies colonyIds={data.colonies} />);
            else
                setComponent(<Spinner color={"white"} className={styles.loading} />);
        }
    }, [clicked, page])

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

    return (
        <div className={interactive ? undefined : styles.screen}>
            <div className={styles.interactive}>
                <Header />
                <MapCanvas center={center} onPlotClick={interactive
                    ? (x, y) => {
                        console.log(x, y)
                        setClicked((currentState) => {
                            return (currentState && currentState[0] === x && currentState[1] === y)
                                ? undefined : [x, y];
                        })
                    }
                    : () => { }
                } />
                <div className={[interactive ? undefined : styles.overlay, styles.fadeIn].join(" ")}>
                    {InjectedConnector.ready()
                        ? component
                        : <WalletMenu />}
                </div>
            </div>
        </div>
    );
}

