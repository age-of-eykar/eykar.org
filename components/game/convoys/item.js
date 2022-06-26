import styles from '../../../styles/components/convoy/Item.module.css'
import Select from './icons/select';
import Conquer from "./icons/conquer";
import BN from "bn.js"
import { useState, useEffect } from "react";
import { feltToString, toFelt } from '../../../utils/felt';
import { useEykarContract } from '../../../hooks/eykar'
import { useStarknetCall, useStarknetInvoke } from '@starknet-react/core'
import { getColonyColor } from '../../../utils/colors'
import { getDisplay } from '../../../utils/resources/convoyable';
import { setConquerMode } from "../../../utils/models/game"
import { setSelectedConvoyLoc } from "../../../utils/models/convoys"
import { getCache } from '../../../utils/models/game';

export default function ConvoyItem({ convoyId, setConquering, selectedConvoy, setSelectedConvoy, loc }) {

    const { contract } = useEykarContract()
    const { data, loading } = useStarknetCall({ contract: contract, method: 'get_conveyables', args: [convoyId] })
    const { data: metaData } = useStarknetCall({ contract: contract, method: 'get_convoy_meta', args: [convoyId] })
    const { invoke } = useStarknetInvoke({ contract: contract, method: 'conquer' })

    const [color, setColor] = useState([52, 59, 64]);
    const [owner, setOwmer] = useState(false);
    const [available, setAvailable] = useState(false);

    useEffect(() => {
        if (metaData === undefined) {
            setOwmer(false);
            setAvailable(false)
            return;
        }
        const meta = metaData.meta;
        setOwmer(meta.owner);
        if (Date.now() / 1000 > meta.availability.toNumber())
            setAvailable(true);
    }, [metaData, setOwmer, setAvailable])

    useEffect(() => {
        let baseColor;

        if (!owner)
            baseColor = [0.2, 0.23, 0.25];
        else
            baseColor = getColonyColor(owner.umod(new BN(272899064295427)).toNumber())

        if (available)
            setColor([baseColor[0] * 255, baseColor[1] * 255, baseColor[2] * 255]);
        else
            setColor([baseColor[0] * 200, baseColor[1] * 200, baseColor[2] * 200]);

    }, [owner, available, setColor])

    let [r, g, b] = color;

    const [conveyables, setConveyables] = useState([]);
    useEffect(() => {
        if (data && !loading) {
            const newConveyables = [];
            for (const conveyable of data.conveyables)
                newConveyables.push({ type: feltToString(conveyable.type), data: conveyable.data })
            setConveyables(newConveyables);
        }
    }, [data, loading])

    return (
        <div className={styles.box + " " + (selectedConvoy === convoyId ? styles.selected_box : " ")}
            style={{ 'backgroundColor': 'rgb(' + r + ', ' + g + ', ' + b + ')' }}>

            <div className={styles.content}>
                {
                    conveyables.length === 0 ? "loading..." : ""
                }

                <div className={styles.content_base}>
                    {
                        conveyables.length > 0
                            ? getDisplay(conveyables[0])
                            : ""
                    }
                    {
                        conveyables.length > 1
                            ? " + " + (conveyables.length - 1) + " other" + ((conveyables.length > 2) ? "s" : "")
                            : ""

                    }
                </div>

                <div className={styles.content_hidden}>
                    {conveyables.map((conveyable, id) => <div key={id}>{conveyables.length === 1 ? "" : "-"} {getDisplay(conveyable)}</div>)}
                </div>

                <div className={styles.items}>
                    <Select color={[r, g, b]}
                        select={() => {
                            const selected = convoyId === selectedConvoy ? false : convoyId;
                            setConquerMode(selected != false);
                            setSelectedConvoy(selected);
                            if (selected)
                                setSelectedConvoyLoc(loc)
                        }} />
                    {
                        getCache().isColonized(loc)
                            ? null
                            : <Conquer conquer={
                                getCache().getExtendOfColony(loc)
                                    ? () => invoke({
                                        args: [convoyId, toFelt(loc[0]), toFelt(loc[1]), 0],
                                        metadata: {
                                            type: 'conquer',
                                            name: undefined,
                                            convoyId: convoyId,
                                            target: [loc[0], loc[1]]
                                        }
                                    })
                                    : () => setConquering(convoyId)
                            }
                                color={[r, g, b]} />
                    }
                </div>
            </div>
        </div>
    );
}
