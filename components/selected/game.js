import styles from '../../styles/components/Selected.module.css'
import { getElevation, getTemperature, getBiomeName, getBiomeStyle } from '../../utils/map/biomes.js'
import { getCache, getColonyMeta, updateColonyMeta } from "../../utils/models/game";
import { useState, useEffect } from "react";
import { useEykarContract } from '../../hooks/eykar'
import { useStarknetInvoke, useStarknetTransactionManager } from '@starknet-react/core'
import { toFelt } from "../../utils/felt"
import { getSelectedConvoyLoc } from "../../utils/models/convoys";
function Selected({ x, y, setClicked, viewConvoys, selectedConvoy }) {

    const elevation = getElevation(x, y);
    const temperature = getTemperature(x, y);
    const biome = getBiomeName(elevation, temperature);
    const bg = getBiomeStyle(biome, styles);

    const [colonyId, setColonyId] = useState(undefined);
    const { contract } = useEykarContract()
    const { data: dataExpand, loading: loadingExpand, invoke: invokeloading } = useStarknetInvoke({ contract: contract, method: 'expand' })
    const { data: dataMove, loading: loadingMove, invoke: invokeMove } = useStarknetInvoke({ contract: contract, method: 'move_convoy' })
    const { transactions } = useStarknetTransactionManager()
    const [waiting, setWaiting] = useState(false)

    useEffect(() => {
        for (const transaction of transactions)
            if (transaction.transactionHash === dataExpand
                || transaction.transactionHash === dataMove) {
                if (transaction.status === 'ACCEPTED_ON_L2'
                    || transaction.status === 'ACCEPTED_ON_L1')
                    setWaiting(false);
            }
    }, [dataExpand, dataMove, transactions])


    useEffect(() => {

        // Displays an expected value
        const cachedId = getCache().getCachedColonyId(x, y);
        if (cachedId === 0)
            setOwnerName("Wilderness");
        else {
            const meta = getColonyMeta(cachedId);
            setOwnerName(meta ? meta.name : "loading...");
        }

        if (!contract)
            return;

        let cancelled = false;

        // Displays the exact value (async)
        contract.get_plot(toFelt(x), toFelt(y)).then((resp) => {
            if (!cancelled) {
                const id = resp.plot.owner.toNumber()
                if (id != 0)
                    getCache().updateCachedColonyId(x, y, id);
                setColonyId(id);
            }
        })

        return () => {
            cancelled = true;
        }
    }, [contract, x, y])

    const [owner, setOwnerName] = useState("loading...");

    useEffect(() => {
        if (!colonyId)
            setOwnerName("Wilderness");
        (async () => {
            if (!contract || !colonyId)
                return;
            const resp = await contract.get_colony(colonyId);
            updateColonyMeta(colonyId, resp);
            const meta = getColonyMeta(colonyId);
            if (meta)
                setOwnerName(meta.name);
        })();
    }, [colonyId])

    let expandShortcut = false;
    if (getCache().getExtendOfColony([x, y]) && selectedConvoy) {
        const [sx, sy] = getSelectedConvoyLoc(selectedConvoy)
        const d1 = sx - x;
        const d2 = sy - y;
        if (d1 * d1 + d2 * d2 <= 2)
            expandShortcut = true;
    }

    return (
        <div className={styles.box + " " + bg}>
            <div className={styles.box_content}>
                <h1 className={styles.title}>{biome}</h1>
                <ul>
                    <li className={styles.item}><span className={styles.item_title}>Owner</span>: <span className={styles.fg_text}>{owner}</span></li>
                    <li className={styles.item}><span className={styles.item_title}>Location</span>: <span className={styles.bg_text}>(</span><span className={styles.fg_text}>{x}</span><span className={styles.bg_text}>,</span> <span className={styles.fg_text}>{y}</span><span className={styles.bg_text}>)</span></li>
                    <li className={styles.item}><span className={styles.item_title}>Temperature</span>: <span className={styles.fg_text}>{Math.floor((temperature + 0.6) * 20)}</span><span className={styles.bg_text}>ºC</span></li>
                    <li className={styles.item}><span className={styles.item_title}>Altitude</span>: <span className={styles.fg_text}>{Math.floor((elevation) * 1000)}</span><span className={styles.bg_text}>m</span></li>
                </ul>
                <div className={styles.buttons}>
                    <div onClick={viewConvoys} className={styles.button}>View convoys</div>
                    <div onClick={
                        expandShortcut ? () => {
                            if (loadingExpand)
                                return;
                            const [sx, sy] = getSelectedConvoyLoc(selectedConvoy)
                            invokeloading({ args: [selectedConvoy, toFelt(sx), toFelt(sy), toFelt(x), toFelt(y)] })
                            setWaiting(true);
                        } : () => {
                            if (loadingMove)
                                return;
                            const [sx, sy] = getSelectedConvoyLoc(selectedConvoy)
                            invokeMove({ args: [selectedConvoy, toFelt(sx), toFelt(sy), toFelt(x), toFelt(y)] })
                        }
                    } className={styles.button + " " + (selectedConvoy && !waiting ? "" : styles.disabled)}>{
                            waiting ? "Waiting..."
                                : (expandShortcut)
                                    ? "Expand colony"
                                    : "Send convoy"
                        }</div>
                </div>
            </div>
            <svg className={styles.close} onClick={() => setClicked(false)} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </div>
    );

}
export default Selected;
