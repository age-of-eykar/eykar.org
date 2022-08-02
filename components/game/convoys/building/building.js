import styles from '../../../../styles/Game.module.css'
import footerStyles from '../../../../styles/components/convoy/Footer.module.css'
import { useEykarContract } from '../../../../hooks/eykar'
import { useStarknetCall } from '@starknet-react/core'
import { useState, useEffect } from "react";
import { feltToString } from '../../../../utils/felt';

import ToBuild from './tobuild'

export default function Building({ convoyId, x, y, setBuilding }) {

    const { contract } = useEykarContract()
    const { data: conveyablesData } = useStarknetCall({ contract: contract, method: 'get_conveyables', args: [convoyId] })
    const [conveyables, setConveyables] = useState(new Map());
    useEffect(() => {
        if (conveyablesData) {
            const newConveyables = new Map();
            for (const conveyable of conveyablesData.conveyables)
                newConveyables.set(feltToString(conveyable.type), conveyable.data)
            setConveyables(newConveyables);
        }
    }, [conveyablesData])

    console.log(conveyables)

    return (<> <h1 className={styles.bigtitle}>Build in ({x}, {y})</h1>
        <ToBuild conveyables={conveyables}
            building={{
                name: "Settler Camp",
                materials: [{ type: "wood", amount: 10 }],
                function_name: "build_lumber_camp"
            }}
            build_params={{ convoy_id: convoyId, x, y }} />

        <div className={footerStyles.footer} >
            <div onClick={() => setBuilding(false)} className={footerStyles.button}>
                <svg className={footerStyles.button_left_icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd"></path></svg>
                all convoys
            </div>
        </div>
    </>);
}