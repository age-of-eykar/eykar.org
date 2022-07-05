import styles from '../../../../styles/components/convoy/Item.module.css'
import { useEykarContract } from '../../../../hooks/eykar'
import { useStarknet, useStarknetCall } from '@starknet-react/core'
import { feltToString } from '../../../../utils/felt';
import { useState, useEffect } from "react";
import { getDisplay } from '../../../../utils/resources/convoyable';

export default function EditorItem({ convoyId, addToTotal, removeFromTotal }) {

    const { contract } = useEykarContract()
    const { account } = useStarknet()
    let [r, g, b] = [52, 59, 64];

    const { data: metaData } = useStarknetCall({ contract: contract, method: 'get_convoy_meta', args: [convoyId] })
    const [owner, setOwner] = useState(false);
    const [available, setAvailable] = useState(false);
    const [toggled, setToggled] = useState(false);

    useEffect(() => {
        if (metaData === undefined) {
            setOwner(false);
            return;
        }
        const meta = metaData.meta;
        const newOwner = "0x" + meta.owner.toString(16);
        if (newOwner !== "0x0")
            setOwner(newOwner);
        if (Date.now() / 1000 > meta.availability.toNumber())
            setAvailable(true);
    }, [metaData, setOwner, setAvailable])

    const { data: conveyablesData } = useStarknetCall({ contract: contract, method: 'get_conveyables', args: [convoyId] })
    const [conveyables, setConveyables] = useState([]);
    useEffect(() => {
        if (conveyablesData) {
            const newConveyables = [];
            for (const conveyable of conveyablesData.conveyables)
                newConveyables.push({ type: feltToString(conveyable.type), data: conveyable.data })
            setConveyables(newConveyables);
        }
    }, [conveyablesData])

    return (account === owner && available) ?
        <div onClick={() => {
            if (toggled)
                removeFromTotal(conveyables)
            else
                addToTotal(conveyables)
            setToggled(!toggled);
        }} className={
            [styles.box, styles.clickable, (toggled ? styles.selected_box_light : " ")].join(" ")}
            style={{ 'backgroundColor': 'rgb(' + r + ', ' + g + ', ' + b + ')' }}>

            <div className={[styles.content, styles.clickable].join(" ")}>
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
                    {toggled
                        ? <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        : <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    }
                </div>
            </div>
        </div>
        : null;
}
