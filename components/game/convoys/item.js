import styles from '../../../styles/components/convoy/Item.module.css'
import { getColonyColor } from '../../../utils/colors'
import Select from './icons/select';
import { getTypeName } from '../../../utils/resources/convoyable';

export default function ConvoyItem({ convoyId }) {

    const convoyables = [
        { type: 0, amount: 10 },
        { type: 1, amount: 5 },
        { type: 2, amount: 7 }
    ]

    const owner = 2;
    let [r, g, b] = getColonyColor(owner);
    [r, g, b] = [r * 255, g * 255, b * 255];

    const selectId = convoyId+1;

    if (convoyables) {
        const { type, amount } = convoyables[0];
        return (
            <div className={styles.box + " " + (selectId === convoyId ? styles.selected_box : " ")}
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
                        <Select color={[r, g, b]} />
                    </div>
                </div>


            </div>
        );
    }
}
