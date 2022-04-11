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
    if (!loading && data) {
        name = feltToString(data.colony.name)
        x = toNegativeNumber(data.colony.x).toString()
        y = toNegativeNumber(data.colony.y).toString()
    }

    return (
        <div>
            <h1>{name}</h1>
            Location: {x}, {y}
        </div>
    );

}
export default Colony;
