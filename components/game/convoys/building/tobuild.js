import styles from '../../../../styles/components/convoy/Build.module.css'

import { useEykarContract } from "../../../../hooks/eykar"
import { toFelt } from '../../../../utils/felt'
import { useStarknetInvoke } from '@starknet-react/core'
import { useState, useEffect } from "react";

export default function ToBuild({ conveyables, building, build_params }) {

    const { name, materials, function_name } = building;
    const [buildable, setBuildable] = useState(false);
    const { contract } = useEykarContract()
    const { data, invoke } = useStarknetInvoke({ contract: contract, method: function_name })

    useEffect(() => {
        let buildable = true;
        materials.forEach(({ type, amount }) => {
            if (!conveyables.has(type) || conveyables.get(type) < amount)
                buildable = false;
        });
        setBuildable(buildable);
    }, [materials])

    return <div onClick={buildable ? () => invoke({
        args: [build_params.convoy_id, toFelt(build_params.x), toFelt(build_params.y)],
        metadata: {
            type: 'build',
            name,
            convoy_id: build_params.convoy_id,
            loc: [build_params.x, build_params.y],
        }
    }) : null} className={buildable ? styles.card_valid : styles.card_invalid}>
        <h1 className={styles.name}>{name}</h1>
        <div >
            {materials.map(({ type, amount }, index) =>
                <div key={index} className={styles.cost}>
                    {conveyables.has(type) && conveyables.get(type) >= amount
                        ? <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        : <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>} {type} x {amount}
                </div>)}
        </div>

    </div>;
}