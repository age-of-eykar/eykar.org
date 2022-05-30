import styles from '../../../styles/components/convoy/Item.module.css'
import Select from './icons/select';
import { useStarknetCall } from '@starknet-react/core'
import { getColonyColor } from '../../../utils/colors'
import { getTypeName } from '../../../utils/resources/convoyable';
import { setConquerMode } from "../../../utils/models/game"
import { setSelectedConvoyLoc } from "../../../utils/models/convoys"

export default function ConvoyItem({ convoyId, selectedConvoy, setSelectedConvoy, loc }) {

    // const { data, loading } = useStarknetCall({ contract: contract, method: 'get_convoys', args: [toFelt(x), toFelt(y)] })
    //todo: load convoyables
    const convoyables = [
        { type: 0, amount: 10 },
        { type: 1, amount: 5 },
        { type: 2, amount: 7 }
    ]

    const owner = 2;
    let [r, g, b] = getColonyColor(owner);
    [r, g, b] = [r * 255, g * 255, b * 255];


    if (convoyables) {
        const { type, amount } = convoyables[0];
        return (
            <div className={styles.box + " " + (selectedConvoy === convoyId ? styles.selected_box : " ")}
                style={{ 'backgroundColor': 'rgb(' + r + ', ' + g + ', ' + b + ')' }}>

                <div className={styles.content}>
                    <div className={styles.content_base}>
                        {
                            amount + " × " + getTypeName(type) + (amount > 1 ? "s" : "")
                        }
                        {
                            convoyables.length > 1
                                ? " + " + (convoyables.length - 1) + " other" + ((convoyables.length > 2) ? "s" : "")
                                : ""

                        }
                    </div>

                    <div className={styles.content_hidden}>
                        {convoyables.map(({ type, amount }) => <div>- {
                            amount + " × " + getTypeName(type) + (amount > 1 ? "s" : "")
                        }</div>)}
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
                    </div>
                </div>


            </div>
        );
    }
}
