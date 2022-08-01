import styles from '../../../styles/components/convoy/Item.module.css'
import Select from './icons/select';
import Conquer from "./icons/conquer";
import Attack from './icons/attack';
import Harvest from './icons/harvest';
import Build from './icons/build';
import BN from "bn.js"
import { useState, useEffect } from "react";
import { feltToString, toFelt } from '../../../utils/felt';
import { useEykarContract } from '../../../hooks/eykar'
import { useStarknet, useStarknetCall, useStarknetInvoke } from '@starknet-react/core'
import { getColonyColor } from '../../../utils/colors'
import { getDisplay } from '../../../utils/resources/convoyable';
import { setConquerMode } from "../../../utils/models/game"
import { setSelectedConvoyLoc } from "../../../utils/models/convoys"
import { getCache } from '../../../utils/models/game';

export default function ConvoyItem({ plotColony, convoys, convoyId, setConquering, selectedConvoy, setSelectedConvoy, setBuilding, loc, toggleEditor }) {

    const { contract } = useEykarContract()
    const { account } = useStarknet()
    const { data: conveyablesData, loading } = useStarknetCall({ contract: contract, method: 'get_conveyables', args: [convoyId] })
    const { data: metaData } = useStarknetCall({ contract: contract, method: 'get_convoy_meta', args: [convoyId] })
    const { invoke: conquerInvoke } = useStarknetInvoke({ contract: contract, method: 'conquer' })
    const { invoke: attackInvoke } = useStarknetInvoke({ contract: contract, method: 'attack' })
    const { invoke: harvestInvoke } = useStarknetInvoke({ contract: contract, method: 'harvest' })

    const [colorSeed, setColorSeed] = useState(0);
    const [color, setColor] = useState([52, 59, 64]);
    const [owner, setOwner] = useState(false);
    const [available, setAvailable] = useState(false);
    const [plotOwner, setPlotOwner] = useState(false);

    useEffect(() => {
        const colonyOwner = plotColony?.colony?.owner;
        if (colonyOwner === undefined) {
            setPlotOwner(false);
            return;
        }

        const newOwner = "0x" + colonyOwner.toString(16);
        if (newOwner !== "0x0")
            setPlotOwner(newOwner);
    }, [plotColony])

    useEffect(() => {
        if (metaData === undefined) {
            setOwner(false);
            setAvailable(false)
            return;
        }
        const meta = metaData.meta;
        const newOwner = "0x" + meta.owner.toString(16);
        if (newOwner !== "0x0") {
            setOwner(newOwner);
        }
        setColorSeed(getColonyColor(meta.owner.umod(new BN(272899064295427)).toNumber()))
        if (Date.now() / 1000 > meta.availability.toNumber())
            setAvailable(true);
    }, [metaData, setOwner, setAvailable])

    useEffect(() => {
        let baseColor;
        if (!owner)
            return;
        baseColor = colorSeed

        if (available)
            setColor([baseColor[0] * 255, baseColor[1] * 255, baseColor[2] * 255]);
        else
            setColor([baseColor[0] * 200, baseColor[1] * 200, baseColor[2] * 200]);

    }, [owner, colorSeed, available, setColor])

    useEffect(() => {
        if (owner === account)
            toggleEditor()
    }, [owner, account])

    let [r, g, b] = color;

    const [conveyables, setConveyables] = useState([]);
    useEffect(() => {
        if (conveyablesData && !loading) {
            const newConveyables = [];
            for (const conveyable of conveyablesData.conveyables)
                newConveyables.push({ type: feltToString(conveyable.type), amount: conveyable.data })
            setConveyables(newConveyables);
        }
    }, [conveyablesData, loading])

    return (owner ?
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
                    {available && owner !== account && selectedConvoy && convoys.includes(selectedConvoy)
                        ? <Attack
                            color={[r, g, b]}
                            attack={() => {
                                attackInvoke({
                                    args: [toFelt(selectedConvoy), toFelt(convoyId), toFelt(loc[0]), toFelt(loc[1])],
                                })
                            }}
                        />
                        : null
                    }
                    {available && owner === account ?
                        <Select color={[r, g, b]}
                            select={() => {
                                const selected = convoyId === selectedConvoy ? false : convoyId;
                                setConquerMode(selected != false);
                                setSelectedConvoy(selected);
                                if (selected)
                                    setSelectedConvoyLoc(loc)
                            }} /> : null
                    }
                    {
                        getCache().isColonized(loc)
                            || !available || owner !== account
                            ? null
                            : <Conquer conquer={
                                getCache().getExtendOfColony(loc)
                                    ? () => conquerInvoke({
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
                    {
                        true
                            ? <Build color={[r, g, b]} setBuilding={() => setBuilding(convoyId)} />
                            : null
                    }
                    {
                        !getCache().isColonized(loc)
                            || !available || owner !== account || plotOwner != owner
                            ? null
                            : <Harvest color={[r, g, b]}
                                harvest={() => {
                                    harvestInvoke({
                                        args: [convoyId, toFelt(loc[0]), toFelt(loc[1])],
                                        metadata: {
                                            type: 'harvest',
                                            convoyId: convoyId,
                                            target: [loc[0], loc[1]]
                                        }
                                    })
                                }} />
                    }
                </div>
            </div>
        </div>
        : <></>
    );
}
