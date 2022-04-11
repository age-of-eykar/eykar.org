import styles from '../../styles/components/Colony.module.css'
import { useEykarContract } from '../../hooks/eykar'
import { useStarknetCall } from '@starknet-react/core'
import { feltToString, toNegativeNumber } from '../../utils/felt'

function Colony({ id }) {

    const { contract } = useEykarContract()

    const { data, loading } = useStarknetCall({ contract: contract, method: 'get_colony', args: [id] })

    let name = 'Loading...'
    let x = "x";
    let y = "y";
    let plots = "...";
    if (!loading && data) {
        name = feltToString(data.colony.name)
        x = toNegativeNumber(data.colony.x).toString()
        y = toNegativeNumber(data.colony.y).toString()
        plots = data.colony.plots_amount.toString()
    }

    return (
        <div className={styles.box}>
            <h1 className={styles.title}>{name}</h1>
            <div>Location: ({x}, {y})</div>
            <div>Territories: {plots}</div>
            <div>LOGO</div>
        </div>
    );

}
export default Colony;
