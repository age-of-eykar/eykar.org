import styles from '../../../styles/components/Colony.module.css'
import { useEykarContract } from '../../../hooks/eykar'
import { useStarknetCall } from '@starknet-react/core'
import { feltToString, toNegativeNumber } from '../../../utils/felt'
import { getColonyColor } from '../../../utils/colors'
import WarehousesInfo from './icons/warehouses'
import TroopsInfo  from './icons/troops'

function Colony({ id }) {

    const { contract } = useEykarContract()

    const { data, loading } = useStarknetCall({ contract: contract, method: 'get_colony', args: [id] })

    let name = 'Loading...'
    let x = "x";
    let y = "y";
    let plots = "...";
    let [r, g, b] = getColonyColor(id);
    [r, g, b] = [r * 255, g * 255, b * 255];
    if (!loading && data) {
        name = feltToString(data.colony.name)
        x = toNegativeNumber(data.colony.x).toString()
        y = toNegativeNumber(data.colony.y).toString()
        plots = data.colony.plots_amount.toString()
    }

    return (
        <div style={{ 'background-color': 'rgb(' + r + ',  ' + g + ', ' + b + ')' }} className={styles.box}>
            <h1 className={styles.title}>{name}</h1>
            <div>Place of Power: ({x}, {y})</div>
            <div>Territories: {plots}</div>
            <div className={styles.footer} >
                <TroopsInfo color={[r, g, b]} />
                <WarehousesInfo color={[r, g, b]} />
            </div>
        </div>
    );

}
export default Colony;
