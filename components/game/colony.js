import styles from '../../styles/components/Colony.module.css'
import { useEykarContract } from '../../hooks/eykar'
import { useStarknetCall } from '@starknet-react/core'
import { feltToString, toNegativeNumber } from '../../utils/felt'
import { useColonyColor, weightedW3C } from '../../hooks/colors'

function Colony({ id }) {

    const { contract } = useEykarContract()

    const { data, loading } = useStarknetCall({ contract: contract, method: 'get_colony', args: [id] })

    let name = 'Loading...'
    let x = "x";
    let y = "y";
    let plots = "...";
    let [r, g, b] = useColonyColor(id);
    [r, g, b] = [r * 255, g * 255, b * 255];
    console.log(weightedW3C(r, g, b));
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
                <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd"></path></svg>
                <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            </div>
        </div>
    );

}
export default Colony;
